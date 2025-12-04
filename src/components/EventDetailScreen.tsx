import React, { useState } from 'react';
import { GitHubEvent } from '../types';

interface EventDetailScreenProps {
  event: GitHubEvent;
  onBack: () => void;
}

const EventDetailScreen: React.FC<EventDetailScreenProps> = ({ event, onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'commits' | 'raw'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'commits', label: `Commits (${event.payload.commits ? event.payload.commits.length : 0})` },
    { id: 'raw', label: 'Raw Data' },
  ];

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => window.location.reload()} className="text-neutral-400 hover:text-primary text-base font-medium leading-normal transition-colors">Home</button>
        <span className="text-neutral-500 text-base font-medium leading-normal">/</span>
        <button onClick={onBack} className="text-neutral-400 hover:text-primary text-base font-medium leading-normal transition-colors">Event List</button>
        <span className="text-neutral-500 text-base font-medium leading-normal">/</span>
        <span className="text-slate-900 dark:text-white text-base font-medium leading-normal">Event Details</span>
      </div>

      {/* Page Heading */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div className="flex min-w-72 flex-col gap-2">
          <p className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
            Details for {event.type} #{event.id}
          </p>
          <p className="text-slate-500 dark:text-neutral-400 text-base font-normal leading-normal">
            Triggered by user '{event.actor.login}' on repository '{event.repo.name}'
          </p>
        </div>
        <button 
          onClick={onBack}
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-primary/90 text-white text-sm font-bold leading-normal tracking-[0.015em] gap-2 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="truncate">Back to List</span>
        </button>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* General Info Card */}
          <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-6 border border-slate-200 dark:border-white/10">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">General Information</h3>
            <div className="grid grid-cols-[150px_1fr] gap-x-6">
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-slate-200 dark:border-t-white/10 py-4">
                <p className="text-slate-500 dark:text-neutral-400 text-sm font-normal leading-normal">Event ID</p>
                <p className="text-slate-900 dark:text-white text-sm font-normal leading-normal">{event.id}</p>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-slate-200 dark:border-t-white/10 py-4">
                <p className="text-slate-500 dark:text-neutral-400 text-sm font-normal leading-normal">Event Type</p>
                <p className="text-slate-900 dark:text-white text-sm font-normal leading-normal">{event.type}</p>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-slate-200 dark:border-t-white/10 py-4">
                <p className="text-slate-500 dark:text-neutral-400 text-sm font-normal leading-normal">Created At</p>
                <p className="text-slate-900 dark:text-white text-sm font-normal leading-normal">{event.created_at}</p>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid border-t border-t-slate-200 dark:border-t-white/10 py-4">
                <p className="text-slate-500 dark:text-neutral-400 text-sm font-normal leading-normal">Repository</p>
                <a href={`https://github.com/${event.repo.name}`} target="_blank" rel="noreferrer" className="text-primary hover:underline text-sm font-normal leading-normal">{event.repo.name}</a>
              </div>
            </div>
          </div>

          {/* Payload Details Card with Tabs */}
          <div className="bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Payload Details</h3>
            </div>
            <div className="pb-3">
              <div className="flex border-b border-slate-200 dark:border-white/10 px-6 gap-8 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 transition-colors whitespace-nowrap px-2 ${
                            activeTab === tab.id 
                            ? 'border-b-primary text-slate-900 dark:text-white' 
                            : 'border-b-transparent text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-white'
                        }`}
                    >
                         <p className="text-sm font-bold leading-normal tracking-[0.015em]">{tab.label}</p>
                    </button>
                ))}
              </div>
            </div>
            
            {/* Tab Content */}
            <div className="p-6 overflow-x-auto">
              {activeTab === 'overview' && (
                  <div className="grid grid-cols-[150px_1fr] gap-x-6 min-w-[300px]">
                     {Object.entries(event.payload).map(([key, value]) => {
                         if (key === 'commits' || typeof value === 'object') return null;
                         return (
                            <div key={key} className="col-span-2 grid grid-cols-subgrid py-3 border-b border-slate-200 dark:border-white/5 last:border-0">
                                <p className="text-slate-500 dark:text-neutral-400 text-sm font-normal leading-normal capitalize">{key.replace(/_/g, ' ')}</p>
                                <p className="text-slate-900 dark:text-white text-sm font-normal leading-normal font-mono break-all">{String(value)}</p>
                            </div>
                         );
                     })}
                     {Object.keys(event.payload).filter(k => k !== 'commits' && typeof event.payload[k] !== 'object').length === 0 && (
                         <p className="text-slate-500 dark:text-neutral-400 italic">No simple payload properties to display.</p>
                     )}
                  </div>
              )}

              {activeTab === 'commits' && (
                  <div className="flex flex-col gap-4">
                      {event.payload.commits && event.payload.commits.length > 0 ? (
                          event.payload.commits.map((commit: any) => (
                              <div key={commit.sha} className="p-4 rounded-lg bg-slate-200 dark:bg-white/10 flex flex-col gap-2">
                                  <div className="flex justify-between items-start">
                                      <p className="text-primary font-mono text-xs">{commit.sha.substring(0, 7)}</p>
                                      <p className="text-slate-500 dark:text-neutral-400 text-xs">{commit.author.name}</p>
                                  </div>
                                  <p className="text-slate-900 dark:text-white text-sm font-medium">{commit.message}</p>
                              </div>
                          ))
                      ) : (
                          <p className="text-slate-500 dark:text-neutral-400 italic">No commits found in payload.</p>
                      )}
                  </div>
              )}

              {activeTab === 'raw' && (
                  <pre className="bg-slate-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto font-mono">
                      {JSON.stringify(event.payload, null, 2)}
                  </pre>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (Actor Info) */}
        <div className="lg:col-span-1">
          <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-6 border border-slate-200 dark:border-white/10 sticky top-24">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Actor (User)</h3>
            <div className="flex flex-col items-center text-center">
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-24 mb-4 border-2 border-slate-200 dark:border-white/10" 
                style={{ backgroundImage: `url("${event.actor.avatar_url}")` }}
              ></div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white break-all">{event.actor.display_login || event.actor.login}</p>
              <p className="text-slate-500 dark:text-neutral-400 text-sm mt-1">ID: {event.actor.id}</p>
              <a 
                href={`https://github.com/${event.actor.login}`}
                target="_blank"
                rel="noreferrer"
                className="mt-6 flex w-full max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-900 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] gap-2 transition-colors"
              >
                <span className="truncate">View on GitHub</span>
                <span className="material-symbols-outlined text-base">open_in_new</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EventDetailScreen;
