import React, { useState } from 'react';
import { GitHubUser, GitHubEvent, GitHubRepo, GitHubGist } from '../types';
import moment from 'moment';
import GenericDataTab from './GenericDataTab';
import { fetchUserEvents, fetchReceivedEvents, fetchSubscriptions, fetchGists } from '../services/githubService';

interface EventListScreenProps {
  user: GitHubUser;
  onSelectEvent: (event: GitHubEvent) => void;
  onSearch: (username: string) => void;
  isLoading: boolean;
}

type TabType = 'activity' | 'received' | 'subscriptions' | 'gists';

const EventListScreen: React.FC<EventListScreenProps> = ({ user, onSelectEvent, onSearch, isLoading }) => {
  const [activeTab, setActiveTab] = useState<TabType>('activity');
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) onSearch(searchInput.trim());
  };

  // Helper functions for rendering
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'PushEvent':
        return 'upload';
      case 'ForkEvent':
        return 'share';
      case 'WatchEvent':
        return 'star';
      case 'CreateEvent':
        return 'add';
      case 'PullRequestEvent':
        return 'rebase';
      case 'IssuesEvent':
        return 'adjust';
      case 'IssueCommentEvent':
        return 'chat_bubble';
      case 'DeleteEvent':
        return 'delete';
      case 'MemberEvent':
        return 'person_add';
      case 'PublicEvent':
        return 'public';
      case 'ReleaseEvent':
        return 'new_releases';
      default:
        return 'public';
    }
  };

  const getEventUrl = (event: GitHubEvent) => {
    const payload = event.payload;
    const repoUrl = `https://github.com/${event.repo.name}`;

    switch (event.type) {
      case 'PushEvent':
        // Link to the specific commit if available, otherwise repo
        if (payload.commits && payload.commits.length > 0) {
          return `${repoUrl}/commit/${payload.commits[0].sha}`;
        }
        return repoUrl;
      case 'PullRequestEvent':
        return payload.pull_request?.html_url || repoUrl;
      case 'IssuesEvent':
        return payload.issue?.html_url || repoUrl;
      case 'IssueCommentEvent':
        return payload.comment?.html_url || payload.issue?.html_url || repoUrl;
      case 'ForkEvent':
        return payload.forkee?.html_url || repoUrl;
      case 'ReleaseEvent':
        return payload.release?.html_url || repoUrl;
      default:
        return repoUrl;
    }
  };

  const handleReceivedEventClick = (event: GitHubEvent) => {
    const url = getEventUrl(event);
    if (url) window.open(url, '_blank');
  };

  const getEventDescription = (event: GitHubEvent, isReceived: boolean = false) => {
    // Prefix for received events to show WHO did it
    const actorPrefix = isReceived ? (
      <span className="font-semibold text-slate-900 dark:text-white mr-1">
        <a
          href={`https://github.com/${event.actor.login}`}
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {event.actor.login}
        </a>
      </span>
    ) : null;

    let content;
    switch (event.type) {
      case 'PushEvent':
        const branch = event.payload.ref?.replace('refs/heads/', '');
        content = (
          <>
            pushed to <span className="font-bold text-primary">{branch}</span> in{' '}
            <a
              href={`https://github.com/${event.repo.name}`}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-primary hover:underline break-all"
              onClick={(e) => e.stopPropagation()}
            >
              {event.repo.name}
            </a>
          </>
        );
        break;
      case 'ForkEvent':
        content = (
          <>
            forked{' '}
            <a
              href={`https://github.com/${event.repo.name}`}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-primary hover:underline break-all"
              onClick={(e) => e.stopPropagation()}
            >
              {event.repo.name}
            </a>
          </>
        );
        break;
      case 'WatchEvent':
        content = (
          <>
            starred{' '}
            <a
              href={`https://github.com/${event.repo.name}`}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-primary hover:underline break-all"
              onClick={(e) => e.stopPropagation()}
            >
              {event.repo.name}
            </a>
          </>
        );
        break;
      case 'CreateEvent':
        content = (
          <>
            created repository{' '}
            <a
              href={`https://github.com/${event.repo.name}`}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-primary hover:underline break-all"
              onClick={(e) => e.stopPropagation()}
            >
              {event.repo.name}
            </a>
          </>
        );
        break;
      case 'PullRequestEvent':
        content = (
          <>
            {event.payload.action} a pull request in{' '}
            <a
              href={`https://github.com/${event.repo.name}`}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-primary hover:underline break-all"
              onClick={(e) => e.stopPropagation()}
            >
              {event.repo.name}
            </a>
          </>
        );
        break;
      case 'IssuesEvent':
        content = (
          <>
            {event.payload.action} issue in{' '}
            <a
              href={`https://github.com/${event.repo.name}`}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-primary hover:underline break-all"
              onClick={(e) => e.stopPropagation()}
            >
              {event.repo.name}
            </a>
          </>
        );
        break;
      case 'IssueCommentEvent':
        content = (
          <>
            commented on issue in{' '}
            <a
              href={`https://github.com/${event.repo.name}`}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-primary hover:underline break-all"
              onClick={(e) => e.stopPropagation()}
            >
              {event.repo.name}
            </a>
          </>
        );
        break;
      default:
        content = (
          <>
            {event.type.replace('Event', '')} on{' '}
            <a
              href={`https://github.com/${event.repo.name}`}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-primary hover:underline break-all"
              onClick={(e) => e.stopPropagation()}
            >
              {event.repo.name}
            </a>
          </>
        );
    }

    return (
      <span>
        {actorPrefix} {content}
      </span>
    );
  };

  const renderEventItem = (event: GitHubEvent, isReceived: boolean = false) => (
    <div className="cursor-pointer flex flex-col gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-[#233648] bg-white dark:bg-[#192430] hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 sm:gap-4 min-w-0">
          <div className="relative shrink-0">
            <img
              src={event.actor.avatar_url}
              className="size-10 rounded-full border border-slate-200 dark:border-white/10"
              alt={event.actor.login}
            />
            <div className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-[#233648] dark:text-white ring-2 ring-white dark:ring-[#192430]">
              <span className="material-symbols-outlined text-xs">{getEventIcon(event.type)}</span>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-medium text-slate-900 dark:text-white truncate">{event.type}</p>
            <p className="text-sm text-slate-500 dark:text-[#92adc9]">{moment(event.created_at).fromNow()}</p>
          </div>
        </div>
        {/* Show view details only for internal detailed view, received events open external link on click */}
        {!isReceived && (
          <button className="hidden sm:block text-sm font-medium text-primary hover:underline shrink-0 whitespace-nowrap">
            View Details
          </button>
        )}
        {isReceived && (
          <button className="hidden sm:block text-sm font-medium text-primary hover:underline shrink-0 whitespace-nowrap">
            <span className="material-symbols-outlined text-lg align-middle">open_in_new</span>
          </button>
        )}
      </div>
      <div className="pl-12 sm:pl-14">
        <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 break-words">
          {getEventDescription(event, isReceived)}
        </p>
        {/* Show payload preview for push messages */}
        {event.type === 'PushEvent' && event.payload.commits?.[0] && (
          <p className="mt-2 rounded-lg bg-slate-50 p-3 text-xs sm:text-sm text-slate-600 dark:bg-[#233648] dark:text-[#c3d3e7] line-clamp-2 font-mono break-all">
            {event.payload.commits[0].message}
          </p>
        )}
      </div>
    </div>
  );

  const formatSize = (sizeInKb: number) => {
    if (!sizeInKb) return '0 KB';
    if (sizeInKb > 1024) return `${(sizeInKb / 1024).toFixed(1)} MB`;
    return `${sizeInKb} KB`;
  };

  const renderRepoItem = (repo: GitHubRepo) => (
    <div className="flex flex-col gap-2 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-[#233648] bg-white dark:bg-[#192430] hover:border-primary/50 transition-colors">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
        <a
          href={repo.html_url}
          target="_blank"
          rel="noreferrer"
          className="text-base font-bold text-primary hover:underline truncate pr-4"
        >
          {repo.full_name}
        </a>
        <div className="flex items-center gap-3 text-slate-500 dark:text-[#92adc9] text-sm shrink-0">
          <span className="flex items-center gap-1" title="Stars">
            <span className="material-symbols-outlined text-sm">star</span> {repo.stargazers_count}
          </span>
          <span className="flex items-center gap-1" title="Forks">
            <span className="material-symbols-outlined text-sm">call_split</span> {repo.forks_count}
          </span>
        </div>
      </div>
      <p className="text-sm text-slate-600 dark:text-[#c3d3e7] line-clamp-2 break-words">
        {repo.description || 'No description provided.'}
      </p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-xs text-slate-500 dark:text-[#92adc9]">
        {repo.language && (
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-primary"></span> {repo.language}
          </span>
        )}
        <span>Updated {moment(repo.updated_at).fromNow()}</span>

        <span className="flex items-center gap-1" title="Size">
          <span className="material-symbols-outlined text-sm">database</span> {formatSize(repo.size)}
        </span>
        <span className="flex items-center gap-1" title="Watchers">
          <span className="material-symbols-outlined text-sm">visibility</span> {repo.watchers_count}
        </span>

        {repo.archived && (
          <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-medium text-[10px] uppercase tracking-wider border border-amber-200 dark:border-amber-800">
            Archived
          </span>
        )}
      </div>
    </div>
  );

  const renderGistItem = (gist: GitHubGist) => (
    <div className="flex flex-col gap-2 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-[#233648] bg-white dark:bg-[#192430] hover:border-primary/50 transition-colors">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
        <div className="flex flex-col gap-1 min-w-0">
          <p className="text-xs font-mono text-slate-500 dark:text-[#92adc9]">{gist.id}</p>
          <a
            href={gist.html_url}
            target="_blank"
            rel="noreferrer"
            className="text-base font-bold text-primary hover:underline truncate"
          >
            {Object.keys(gist.files)[0] || 'Untitled Gist'}
          </a>
        </div>
        <span className="text-xs text-slate-500 dark:text-[#92adc9] shrink-0">
          {moment(gist.created_at).format('MMM DD, YYYY')}
        </span>
      </div>
      <p className="text-sm text-slate-600 dark:text-[#c3d3e7] line-clamp-2 italic break-words">
        {gist.description || 'No description.'}
      </p>
      <div className="flex flex-wrap gap-2 mt-2">
        {Object.keys(gist.files).map((file) => (
          <span
            key={file}
            className="px-2 py-1 bg-slate-100 dark:bg-[#233648] rounded text-xs text-slate-700 dark:text-[#c3d3e7] font-mono break-all"
          >
            {file}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="layout-container flex h-full grow flex-col">
      <div className="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <main className="flex flex-col gap-6 p-0 sm:p-6">
            {/* Search Header */}
            <div className="flex flex-wrap justify-between gap-3 px-4 sm:px-0">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-slate-900 dark:text-white text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em]">
                  User Dashboard
                </p>
                <p className="text-slate-500 dark:text-[#92adc9] text-base font-normal leading-normal">
                  Deep dive into public user data.
                </p>
              </div>
            </div>

            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-4 items-end px-4 sm:px-0">
              <div className="flex-grow w-full">
                <label className="flex flex-col min-w-40 h-12 w-full">
                  <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                    <div className="text-slate-500 dark:text-[#92adc9] flex border-none bg-slate-100 dark:bg-[#233648] items-center justify-center pl-4 rounded-l-lg border-r-0">
                      <span className="material-symbols-outlined">person</span>
                    </div>
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 dark:text-white focus:outline-0 focus:ring-0 border-none bg-slate-100 dark:bg-[#233648] focus:border-none h-full placeholder:text-slate-500 placeholder:dark:text-[#92adc9] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                      placeholder="Enter GitHub username..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                  </div>
                </label>
              </div>
              <button
                disabled={isLoading}
                type="submit"
                className="w-full flex sm:w-[150px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-primary text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-6 hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined filled" style={{ fontSize: '20px' }}>
                  search
                </span>
                <span className="truncate">{isLoading ? 'Loading...' : 'Search'}</span>
              </button>
            </form>

            {/* User Profile Card */}
            <div className="flex flex-col gap-6 pt-2 sm:pt-6">
              <div className="rounded-xl border border-slate-200 dark:border-[#233648] bg-slate-50 dark:bg-[#192430] p-4 sm:p-6 mx-4 sm:mx-0">
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  <img
                    alt="User Avatar"
                    className="h-20 w-20 sm:h-24 sm:w-24 rounded-full border-4 border-white dark:border-background-dark"
                    src={user.avatar_url}
                  />
                  <div className="flex flex-col gap-3 w-full">
                    <div className="flex flex-col sm:flex-row justify-between items-start">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white break-all">
                          {user.login}
                        </h3>
                        <a
                          href={user.html_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline"
                        >
                          @{user.login}
                        </a>
                        {user.name && <span className="text-slate-500 dark:text-[#92adc9] ml-2">({user.name})</span>}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-[#92adc9] font-mono mt-2 sm:mt-0">
                        ID: {user.id}
                      </div>
                    </div>
                    {user.bio && <p className="text-sm text-slate-700 dark:text-[#c3d3e7]">{user.bio}</p>}
                    <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600 dark:text-[#92adc9] mt-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">folder_open</span>
                        <span>
                          <strong className="text-slate-800 dark:text-white">{user.public_repos}</strong> Public Repos
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">calendar_today</span>
                        <span>
                          Joined{' '}
                          <strong className="text-slate-800 dark:text-white">
                            {moment(user.created_at).format('MMM DD, YYYY')}
                          </strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">update</span>
                        <span>
                          Updated{' '}
                          <strong className="text-slate-800 dark:text-white">
                            {moment(user.updated_at).format('MMM DD, YYYY')}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="mx-4 sm:mx-0">
                <nav className="flex flex-wrap gap-2" aria-label="Tabs">
                  {[
                    {
                      id: 'activity',
                      label: 'Recent Activity',
                      icon: 'history'
                    },
                    {
                      id: 'received',
                      label: 'Received Events',
                      icon: 'move_to_inbox'
                    },
                    {
                      id: 'subscriptions',
                      label: 'Subscriptions',
                      icon: 'visibility'
                    },
                    {
                      id: 'gists',
                      label: user.public_gists + ' Gists',
                      icon: 'code'
                    }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`
                        whitespace-nowrap py-2 px-4 rounded-full font-medium text-sm flex items-center gap-2 transition-colors
                        ${
                          activeTab === tab.id
                            ? 'bg-primary/10 text-primary'
                            : 'text-slate-600 dark:text-[#92adc9] hover:bg-slate-100 dark:hover:bg-white/5'
                        }
                      `}
                    >
                      <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="min-h-[400px] px-4 sm:px-0">
                {activeTab === 'activity' && (
                  <GenericDataTab<GitHubEvent>
                    title="Recent Activity"
                    description="Public events triggered by this user."
                    username={user.login}
                    fetchFn={fetchUserEvents}
                    renderItem={(item) => renderEventItem(item, false)}
                    itemKey={(item) => item.id}
                    onItemClick={onSelectEvent}
                    searchFunction={(item, query) =>
                      item.type.toLowerCase().includes(query.toLowerCase()) ||
                      item.repo.name.toLowerCase().includes(query.toLowerCase())
                    }
                    getFilterValue={(item) => item.type}
                    filterOptions={[
                      'PushEvent',
                      'WatchEvent',
                      'ForkEvent',
                      'CreateEvent',
                      'PullRequestEvent',
                      'IssuesEvent',
                      'IssueCommentEvent'
                    ]}
                  />
                )}

                {activeTab === 'received' && (
                  <GenericDataTab<GitHubEvent>
                    title="Received Events"
                    description="Events broadcast to this user (activity from people they follow)."
                    username={user.login}
                    fetchFn={fetchReceivedEvents}
                    renderItem={(item) => renderEventItem(item, true)}
                    itemKey={(item) => item.id}
                    onItemClick={handleReceivedEventClick}
                    searchFunction={(item, query) =>
                      item.actor.login.toLowerCase().includes(query.toLowerCase()) ||
                      item.type.toLowerCase().includes(query.toLowerCase()) ||
                      item.repo.name.toLowerCase().includes(query.toLowerCase())
                    }
                    getFilterValue={(item) => item.type}
                    filterOptions={['PushEvent', 'WatchEvent', 'ForkEvent', 'CreateEvent', 'PullRequestEvent']}
                  />
                )}

                {activeTab === 'subscriptions' && (
                  <GenericDataTab<GitHubRepo>
                    title="Subscriptions"
                    description="Repositories watched by this user."
                    username={user.login}
                    fetchFn={fetchSubscriptions}
                    renderItem={renderRepoItem}
                    itemKey={(item) => item.id.toString()}
                    searchFunction={(item, query) =>
                      item.name.toLowerCase().includes(query.toLowerCase()) ||
                      (item.description?.toLowerCase().includes(query.toLowerCase()) ?? false)
                    }
                  />
                )}

                {activeTab === 'gists' && (
                  <GenericDataTab<GitHubGist>
                    title="Public Gists"
                    description="Code snippets and random files shared publicly."
                    username={user.login}
                    fetchFn={fetchGists}
                    renderItem={renderGistItem}
                    itemKey={(item) => item.id}
                    searchFunction={(item, query) =>
                      Object.keys(item.files).some((f) => f.toLowerCase().includes(query.toLowerCase())) ||
                      (item.description?.toLowerCase().includes(query.toLowerCase()) ?? false)
                    }
                  />
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default EventListScreen;
