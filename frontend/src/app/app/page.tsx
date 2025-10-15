"use client";
import React, { useEffect, useState } from "react";
import TopNav from "../../components/TopNav";
import Sidebar from "../../components/Sidebar";
import UploadBox from "../../components/UploadBox";
import ClientModal from "../../components/ClientModal";
import { v4 as uuidv4 } from "uuid";
import "./app.css";

type Client = { id: string; name: string; phone?: string };

export default function AppPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeModule, setActiveModule] = useState("Property Opinion");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("legalindia_clients");
      if (raw) setClients(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("legalindia_clients", JSON.stringify(clients));
    } catch {}
  }, [clients]);

  function handleCreateClient(c: { name: string; phone?: string }) {
    const newClient = { id: uuidv4(), name: c.name, phone: c.phone };
    setClients((s) => [newClient, ...s]);
    setSelectedClient(newClient.id);
  }

  return (
    <div>
      <TopNav active={activeModule} onSelect={(m) => setActiveModule(m)} />
      <div className="app-grid container mt-6 gap-6">
        <Sidebar clients={clients} onSelect={(id) => setSelectedClient(id)} onOpenNew={() => setShowModal(true)} selected={selectedClient ?? undefined} />

        <main className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold">{activeModule}</h2>
              <div className="text-sm text-gray-600 mt-1">Working area for {activeModule}</div>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <div className="text-sm text-gray-700">Client: </div>
              <select
                value={selectedClient ?? ""}
                onChange={(e) => setSelectedClient(e.target.value || null)}
                className="input"
              >
                <option value="">Select client</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Upload documents</h4>
                <UploadBox />
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Client selection (mobile)</h4>
                <div className="md:hidden">
                  <select value={selectedClient ?? ""} onChange={(e) => setSelectedClient(e.target.value || null)} className="input">
                    <option value="">Select client</option>
                    {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h4 className="text-sm font-medium mb-3">Module workspace</h4>
                <div className="text-sm text-gray-600">
                  {selectedClient ? (
                    <div>
                      <div className="mb-2">Active client: <strong>{clients.find(c=>c.id===selectedClient)?.name}</strong></div>
                      <div className="text-xs text-gray-500">This workspace will show module-specific tools (research input, property opinion request, case files).</div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-gray-500 mb-2">Select a client or create a new client to start.</div>
                      <button onClick={() => setShowModal(true)} className="btn btn-primary">Create Client</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <ClientModal open={showModal} onClose={() => setShowModal(false)} onCreate={(c) => handleCreateClient(c)} />
    </div>
  );
}