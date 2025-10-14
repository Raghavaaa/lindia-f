"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { apiFetch, config } from "@/lib/config";

interface ResearchItem {
  id: string;
  query_text: string;
  response_text: string;
  created_at: string;
  client_id?: string;
}

export default function HistoryPage() {
  const [research, setResearch] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ResearchItem | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchResearch();
  }, [page]);

  const fetchResearch = async () => {
    try {
      const response = await apiFetch(`${config.endpoints.research.history}?page=${page}&limit=20`);
      const data = await response.json();
      
      if (page === 1) {
        setResearch(data.research || []);
      } else {
        setResearch(prev => [...prev, ...(data.research || [])]);
      }
      
      setHasMore(data.hasMore || false);
    } catch (error) {
      console.error("Error fetching research:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  if (loading && page === 1) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="text-center">Loading research history...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      {/* Navigation */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            LegalIndia.ai
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/research" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
            Research
          </Link>
          <Link href="/login" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
            Login
          </Link>
          <Link href="/settings" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
            Settings
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100">
            Research History
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            View and manage your saved legal research queries
          </p>
        </div>

        {research.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-zinc-500 dark:text-zinc-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">No research history</h3>
            <p className="text-zinc-500 dark:text-zinc-400 mb-4">
              Start by conducting some legal research to see your history here.
            </p>
            <Link 
              href="/research"
              className="inline-flex items-center px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200"
            >
              Start Research
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Research List */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Saved Research ({research.length})
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {research.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedItem?.id === item.id
                        ? "border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800"
                        : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">
                        {truncateText(item.query_text, 60)}
                      </h3>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-2">
                        {formatDate(item.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {truncateText(item.response_text, 80)}
                    </p>
                    {item.client_id && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                          Client: {item.client_id}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {hasMore && (
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="w-full mt-4 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              )}
            </div>

            {/* Research Detail */}
            <div className="lg:sticky lg:top-6">
              {selectedItem ? (
                <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      Research Details
                    </h3>
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-2">Query:</h4>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800 p-3 rounded">
                        {selectedItem.query_text}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-zinc-900 dark:text-zinc-100 mb-2">Response:</h4>
                      <div className="text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800 p-3 rounded max-h-64 overflow-y-auto">
                        <pre className="whitespace-pre-wrap">{selectedItem.response_text}</pre>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs text-zinc-500 dark:text-zinc-400">
                      <span>Created: {formatDate(selectedItem.created_at)}</span>
                      {selectedItem.client_id && (
                        <span>Client: {selectedItem.client_id}</span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 text-center">
                  <div className="text-zinc-400 dark:text-zinc-500 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                    Select a research item
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-400">
                    Click on any research item from the list to view its details here.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
