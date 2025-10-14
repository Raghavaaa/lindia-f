"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopTabs from "@/components/TopTabs";
import UploadCard from "@/components/UploadCard";
import { useAppStore, WorkspaceOption, Client } from "@/lib/store";
import ClientGate from "@/components/ClientGate";
import ResearchModal from "@/components/ResearchModal";
import ClientSelectionModal from "@/components/ClientSelectionModal";

export default function DashboardPage() {
  const { active, setActive, directories, subdirectories, addDirectory, addSubdirectory, getClientName, clients, addClient } = useAppStore();
  const [topOption, setTopOption] = useState<WorkspaceOption | undefined>(undefined);
  const [showGate, setShowGate] = useState(false);
  const [showResearch, setShowResearch] = useState(false);
  const [showClientSelection, setShowClientSelection] = useState(false);
  const [pendingOption, setPendingOption] = useState<WorkspaceOption | undefined>(undefined);
  const clientSelected = Boolean(active.clientId);

  const showWorkspace = clientSelected && Boolean(topOption);
  const selectedDirectory = directories.find((d) => d.id === active.directoryId);
  const selectedSubdirectory = subdirectories.find((s) => s.id === active.subdirectoryId);

  function handleTopTabChange(key: WorkspaceOption) {
    if (!clientSelected) {
      setPendingOption(key);
      setShowClientSelection(true);
      return;
    }
    setTopOption(key);
    if (key === "research") setShowResearch(true);
  }

  function handleClientSelect(client: Client) {
    setActive({ clientId: client.id });
    setShowClientSelection(false);
    if (pendingOption) {
      setTopOption(pendingOption);
      if (pendingOption === "research") setShowResearch(true);
      setPendingOption(undefined);
    }
  }

  function handleCreateClient(clientData: Omit<Client, "id">) {
    const newClient = addClient(clientData);
    handleClientSelect(newClient);
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-6 space-y-6">
      <TopTabs active={topOption} onChange={handleTopTabChange} />
      <div className="flex items-start gap-6">
        <Sidebar />
        <div className="flex-1 space-y-6">
          {!showWorkspace ? (
            <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-10 text-center text-zinc-600 dark:text-zinc-400">
              Choose an option at top-right to begin.
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-6">
                <h3 className="text-sm uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                  {topOption === "property" && "Property Opinions"}
                  {topOption === "research" && "Research"}
                  {topOption === "case" && "Case"}
                  {topOption === "junior" && "Junior"}
                  {active.clientId ? ` • ${getClientName(active.clientId) ?? ""}` : ""}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Directories</h4>
                    <button
                      className="px-3 py-1.5 rounded-xl text-sm font-medium bg-black text-white"
                      onClick={() => {
                        if (!active.clientId) return;
                        const dirName = window.prompt("New directory name?");
                        if (!dirName) return;
                        const dir = addDirectory(active.clientId, dirName);
                        setActive({ directoryId: dir.id, subdirectoryId: undefined });
                      }}
                    >
                      New Directory
                    </button>
                  </div>
                  <div className="mt-3 space-y-2">
                    {directories.filter((d) => d.clientId === active.clientId).map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setActive({ directoryId: d.id, subdirectoryId: undefined })}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 ${active.directoryId === d.id ? "bg-zinc-100 dark:bg-zinc-800" : ""}`}
                      >
                        {d.name}
                      </button>
                    ))}
                  </div>
                  {selectedDirectory && !selectedSubdirectory && (
                    <div className="mt-4">
                      <UploadCard />
                    </div>
                  )}
                </section>
                <section className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 p-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Subdirectories</h4>
                    <button
                      className="px-3 py-1.5 rounded-xl text-sm font-medium bg-black text-white"
                      onClick={() => {
                        if (!active.directoryId) return;
                        const subName = window.prompt("New subdirectory name?");
                        if (!subName) return;
                        const sub = addSubdirectory(active.directoryId, subName);
                        setActive({ subdirectoryId: sub.id });
                      }}
                    >
                      New Subdirectory
                    </button>
                  </div>
                  <div className="mt-3 space-y-2">
                    {subdirectories.filter((s) => s.directoryId === active.directoryId).map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setActive({ subdirectoryId: s.id })}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 ${active.subdirectoryId === s.id ? "bg-zinc-100 dark:bg-zinc-800" : ""}`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                  {selectedSubdirectory && (
                    <div className="mt-4">
                      <UploadCard />
                    </div>
                  )}
                </section>
              </div>
            </>
          )}
        </div>
      </div>
      {showGate && <ClientGate onClose={() => setShowGate(false)} />}
      {showClientSelection && (
        <ClientSelectionModal
          onSelectClient={handleClientSelect}
          onCreateClient={handleCreateClient}
          onClose={() => {
            setShowClientSelection(false);
            setPendingOption(undefined);
          }}
          existingClients={clients}
        />
      )}
      {showResearch && <ResearchModal userId={active.clientId} onClose={() => setShowResearch(false)} />}
    </div>
  );
}


