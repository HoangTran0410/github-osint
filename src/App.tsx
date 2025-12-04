import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchScreen from './components/SearchScreen';
import EventListScreen from './components/EventListScreen';
import EventDetailScreen from './components/EventDetailScreen';
import { fetchUser } from './services/githubService';
import { GitHubUser, GitHubEvent } from './types';

type Screen = 'search' | 'list' | 'detail';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('search');
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<GitHubUser | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<GitHubEvent | null>(null);

  const handleSearch = async (username: string) => {
    setIsLoading(true);
    try {
      const userData = await fetchUser(username);

      setCurrentUser(userData);
      setCurrentScreen('list');
    } catch (error) {
      console.error(error);
      alert('User not found or API limit reached. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectEvent = (event: GitHubEvent) => {
    setSelectedEvent(event);
    setCurrentScreen('detail');
  };

  const handleGoBackToList = () => {
    setSelectedEvent(null);
    setCurrentScreen('list');
  };

  const handleGoHome = () => {
    setCurrentScreen('search');
    setCurrentUser(null);
    setSelectedEvent(null);
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
      <Header onGoHome={handleGoHome} />

      <div className="flex-grow flex flex-col">
        {currentScreen === 'search' && <SearchScreen onSearch={handleSearch} isLoading={isLoading} />}

        {currentScreen === 'list' && currentUser && (
          <EventListScreen
            user={currentUser}
            onSelectEvent={handleSelectEvent}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        )}

        {currentScreen === 'detail' && selectedEvent && (
          <EventDetailScreen event={selectedEvent} onBack={handleGoBackToList} />
        )}
      </div>

      <Footer />
    </div>
  );
}

export default App;
