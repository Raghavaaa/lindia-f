/**
 * Example Component: Research Module Usage
 * This demonstrates how to use the API integration in your components
 */

'use client';

import { useState } from 'react';
import { useResearch, useResearchHistory } from '@/hooks/api';
import { useApiToast } from '@/hooks/use-api-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingCard } from '@/components/ui/loading-spinner';

export default function ExampleResearchComponent() {
  const [query, setQuery] = useState('');
  
  // Use the research mutation hook
  const { 
    mutate: search, 
    data: searchResults, 
    isPending: isSearching,
    error: searchError 
  } = useResearch();
  
  // Get research history
  const { 
    data: history, 
    isLoading: isLoadingHistory 
  } = useResearchHistory(10);
  
  // Toast notifications
  const apiToast = useApiToast();

  const handleSearch = () => {
    if (!query.trim()) {
      apiToast.warning('Empty Query', 'Please enter a search query');
      return;
    }

    search(
      {
        query,
        jurisdiction: 'India',
        caseType: 'civil',
      },
      {
        onSuccess: (data) => {
          apiToast.success(
            'Search Complete',
            `Found ${data.totalFound} results in ${data.searchTime}ms`
          );
        },
        onError: (error) => {
          apiToast.error(error, 'Failed to perform research');
        },
      }
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Legal Research</h2>
        
        {/* Search Input */}
        <div className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your legal query..."
            disabled={isSearching}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button 
            onClick={handleSearch} 
            disabled={isSearching}
          >
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {/* Search Results */}
        {isSearching && <LoadingCard text="Searching legal database..." />}
        
        {searchError && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-400">
              Error: {searchError.message}
            </p>
          </div>
        )}

        {searchResults && (
          <div className="space-y-2">
            <h3 className="font-semibold">Results</h3>
            {searchResults.results.map((result) => (
              <div 
                key={result.id}
                className="p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <h4 className="font-medium">{result.title}</h4>
                <p className="text-sm text-muted-foreground">{result.summary}</p>
                <div className="mt-2 flex gap-2 text-xs">
                  <span className="px-2 py-1 bg-primary/10 rounded">
                    Relevance: {(result.relevance * 100).toFixed(0)}%
                  </span>
                  <span className="px-2 py-1 bg-primary/10 rounded">
                    {result.source}
                  </span>
                  <span className="px-2 py-1 bg-primary/10 rounded">
                    {result.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Research History */}
      <div className="space-y-2">
        <h3 className="font-semibold">Recent Searches</h3>
        {isLoadingHistory ? (
          <p className="text-sm text-muted-foreground">Loading history...</p>
        ) : history && history.length > 0 ? (
          <div className="space-y-1">
            {history.map((item: any, index: number) => (
              <div 
                key={index}
                className="p-2 text-sm border rounded hover:bg-accent cursor-pointer transition-colors"
                onClick={() => setQuery(item.query)}
              >
                {item.query}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No search history</p>
        )}
      </div>
    </div>
  );
}

/**
 * Example Component: Case Management
 */
export function ExampleCaseManagement() {
  const { data: cases, isLoading } = useCases(1, 20);
  const createCase = useCreateCase();
  const updateCase = useUpdateCase();
  const apiToast = useApiToast();

  const handleCreateCase = () => {
    createCase.mutate(
      {
        caseNumber: 'CASE-2025-001',
        title: 'Property Dispute',
        description: 'Commercial property ownership dispute',
        clientId: 'client-123',
        priority: 'high',
      },
      {
        onSuccess: () => {
          apiToast.success('Case Created', 'New case has been created successfully');
        },
        onError: (error) => {
          apiToast.error(error, 'Failed to create case');
        },
      }
    );
  };

  return (
    <div className="space-y-4 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Case Management</h2>
        <Button onClick={handleCreateCase} disabled={createCase.isPending}>
          {createCase.isPending ? 'Creating...' : 'New Case'}
        </Button>
      </div>

      {isLoading ? (
        <LoadingCard text="Loading cases..." />
      ) : cases?.data && cases.data.length > 0 ? (
        <div className="grid gap-4">
          {cases.data.map((caseItem) => (
            <div 
              key={caseItem.id}
              className="p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{caseItem.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {caseItem.caseNumber}
                  </p>
                  <p className="text-sm mt-2">{caseItem.description}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 text-xs rounded ${
                    caseItem.status === 'active' ? 'bg-green-100 text-green-800' :
                    caseItem.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {caseItem.status}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded ${
                    caseItem.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                    caseItem.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {caseItem.priority}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No cases found</p>
      )}
    </div>
  );
}

// Import statements needed for the case management example
import { useCases, useCreateCase, useUpdateCase } from '@/hooks/api';

