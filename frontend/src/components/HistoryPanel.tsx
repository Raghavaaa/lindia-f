"use client";
import React, { useEffect, useState } from "react";

type HistoryItem = {
  id: string;
  title: string;
  query: string;
  adminPrompt?: string | null;
  resultText: string;
  ts: number;
};

type Props = {
  clientId: string | null;
  clientName: string | null;
  activeModule: string | null;
  onSelectItem: (item: HistoryItem) => void;
  selectedItemId?: string | null;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  refreshTrigger?: number; // Add refresh trigger
};

export default function HistoryPanel({ 
  clientId, 
  clientName, 
  activeModule, 
  onSelectItem,
  selectedItemId,
  isMobileOpen = false,
  onMobileClose,
  refreshTrigger
}: Props) {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [displayLimit, setDisplayLimit] = useState(50);

  // Load history when client changes
  useEffect(() => {
    if (!clientId) {
      setHistoryItems([]);
      return;
    }

    try {
      // Use the exact same key format as ResearchModule
      const key = `legalindia::client::${clientId}::research`;
      const saved = localStorage.getItem(key);
      
      if (saved) {
        const items: HistoryItem[] = JSON.parse(saved);
        console.log("HistoryPanel: Loaded items for key", key, items);
        setHistoryItems(items.slice(0, 100)); // Limit to 100 most recent
      } else {
        console.log("HistoryPanel: No data found for key", key);
        setHistoryItems([]);
      }
    } catch (error) {
      console.error("Error loading history:", error);
      setHistoryItems([]);
    }
  }, [clientId, refreshTrigger]); // Add refreshTrigger dependency

  const displayedItems = historyItems.slice(0, displayLimit);
  const hasMore = historyItems.length > displayLimit;

  const formatTime = (ts: number) => {
    const date = new Date(ts);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleItemClick = (item: HistoryItem) => {
    onSelectItem(item);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <div style={{
      width: 320,
      borderLeft: "1px solid #F1F5F9",
      background: "#FFFFFF",
      height: "100vh",
      position: "sticky",
      top: 0,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }}
    className={`history-panel ${isMobileOpen ? 'mobile-open' : ''}`}
    >
      {/* Header */}
      <div style={{
        padding: "16px",
        borderBottom: "1px solid #F1F5F9"
      }}>
        {clientName && (
          <div style={{
            fontSize: 12,
            color: "#9CA3AF",
            marginBottom: 8
          }}>
            Client: {clientName}
          </div>
        )}
        <h3 style={{
          fontSize: 16,
          fontWeight: 600,
          color: "#1F2937",
          margin: 0
        }}>
          History
        </h3>
      </div>

      {/* History List */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "8px"
      }}>
        {!clientId || !activeModule ? (
          <div style={{
            padding: "16px",
            textAlign: "center",
            fontSize: 13,
            color: "#9CA3AF"
          }}>
            Select a client and module
          </div>
        ) : historyItems.length === 0 ? (
          <div style={{
            padding: "16px",
            textAlign: "center",
            fontSize: 13,
            color: "#9CA3AF"
          }}>
            No history yet.
          </div>
        ) : (
          <>
            {displayedItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                tabIndex={0}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 12px",
                  marginBottom: "4px",
                  borderRadius: 8,
                  border: "none",
                  background: selectedItemId === item.id ? "#E8F1FF" : "transparent",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  display: "block"
                }}
                onMouseEnter={(e) => {
                  if (selectedItemId !== item.id) {
                    e.currentTarget.style.background = "#F8FAFC";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedItemId !== item.id) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
                aria-label={`History item ${item.title}, ${new Date(item.ts).toLocaleString()}`}
              >
                <div style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: selectedItemId === item.id ? "#2E7CF6" : "#1F2937",
                  marginBottom: 4,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}>
                  {formatTime(item.ts)} • {item.title.substring(0, 40)}{item.title.length > 40 ? "..." : ""}
                </div>
                <div style={{
                  fontSize: 12,
                  color: "#9CA3AF"
                }}>
                  {new Date(item.ts).toLocaleDateString()}
                </div>
              </button>
            ))}
            
            {hasMore && (
              <button
                onClick={() => setDisplayLimit(prev => prev + 50)}
                style={{
                  width: "100%",
                  padding: "8px",
                  marginTop: "8px",
                  border: "none",
                  background: "transparent",
                  color: "#2E7CF6",
                  fontSize: 13,
                  cursor: "pointer",
                  textAlign: "center"
                }}
                aria-label="Load more history items"
              >
                Load more...
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

