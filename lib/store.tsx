"use client";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type WorkspaceOption = "property" | "research" | "case" | "junior";

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  referenceId?: string;
}

export interface Directory {
  id: string;
  name: string;
  clientId: string;
}

export interface Subdirectory {
  id: string;
  name: string;
  directoryId: string;
}

export interface ActiveSelection {
  clientId?: string;
  option?: WorkspaceOption;
  directoryId?: string;
  subdirectoryId?: string;
}

interface AppState {
  clients: Client[];
  directories: Directory[];
  subdirectories: Subdirectory[];
  active: ActiveSelection;
  logoDataUrl?: string;
}

interface AppStore extends AppState {
  setActive: (update: Partial<ActiveSelection>) => void;
  addClient: (client: Omit<Client, "id">) => Client;
  removeClient: (clientId: string) => void;
  addDirectory: (clientId: string, name: string) => Directory;
  addSubdirectory: (directoryId: string, name: string) => Subdirectory;
  setLogoDataUrl: (dataUrl?: string) => void;
  getClientName: (clientId?: string) => string | undefined;
}

const StoreContext = createContext<AppStore | null>(null);

const STORAGE_KEY = "legalindia.store.v1";

function generateId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    if (typeof window === "undefined") return { clients: [], directories: [], subdirectories: [], active: {} };
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return { clients: [], directories: [], subdirectories: [], active: {} };
      const parsed = JSON.parse(raw) as AppState;
      return { ...parsed, active: parsed.active ?? {} };
    } catch {
      return { clients: [], directories: [], subdirectories: [], active: {} };
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore persistence errors
    }
  }, [state]);

  const setActive = useCallback((update: Partial<ActiveSelection>) => {
    setState((prev) => ({ ...prev, active: { ...prev.active, ...update } }));
  }, []);

  const addClient = useCallback((clientData: Omit<Client, "id">): Client => {
    const client: Client = { id: generateId("cli"), ...clientData };
    setState((prev) => ({ ...prev, clients: [...prev.clients, client] }));
    return client;
  }, []);

  const removeClient = useCallback((clientId: string) => {
    setState((prev) => ({
      ...prev,
      clients: prev.clients.filter((c) => c.id !== clientId),
      directories: prev.directories.filter((d) => d.clientId !== clientId),
      subdirectories: prev.subdirectories.filter((s) => prev.directories.find((d) => d.id === s.directoryId)?.clientId !== clientId),
      active: prev.active.clientId === clientId ? {} : prev.active,
    }));
  }, []);

  const addDirectory = useCallback((clientId: string, name: string): Directory => {
    const dir: Directory = { id: generateId("dir"), name, clientId };
    setState((prev) => ({ ...prev, directories: [...prev.directories, dir] }));
    return dir;
  }, []);

  const addSubdirectory = useCallback((directoryId: string, name: string): Subdirectory => {
    const sub: Subdirectory = { id: generateId("sub"), name, directoryId };
    setState((prev) => ({ ...prev, subdirectories: [...prev.subdirectories, sub] }));
    return sub;
  }, []);

  const setLogoDataUrl = useCallback((dataUrl?: string) => {
    setState((prev) => ({ ...prev, logoDataUrl: dataUrl }));
  }, []);

  const getClientName = useCallback((clientId?: string) => state.clients.find((c) => c.id === clientId)?.name, [state.clients]);

  const value = useMemo<AppStore>(() => ({
    ...state,
    setActive,
    addClient,
    removeClient,
    addDirectory,
    addSubdirectory,
    setLogoDataUrl,
    getClientName,
  }), [state, setActive, addClient, removeClient, addDirectory, addSubdirectory, setLogoDataUrl, getClientName]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useAppStore(): AppStore {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider");
  return ctx;
}


