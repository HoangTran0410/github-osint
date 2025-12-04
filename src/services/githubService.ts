import { GitHubUser, GitHubEvent, GitHubRepo, GitHubGist } from '../types';

const BASE_URL = 'https://api.github.com';

export const fetchUser = async (username: string): Promise<GitHubUser> => {
  const response = await fetch(`${BASE_URL}/users/${username}`);
  if (!response.ok) {
    throw new Error('User not found');
  }
  return response.json();
};

export const fetchUserEvents = async (username: string, page: number = 1): Promise<GitHubEvent[]> => {
  const response = await fetch(`${BASE_URL}/users/${username}/events/public?page=${page}&per_page=30`);
  if (!response.ok) {
    throw new Error('Could not fetch events');
  }
  return response.json();
};

export const fetchReceivedEvents = async (username: string, page: number = 1): Promise<GitHubEvent[]> => {
  const response = await fetch(`${BASE_URL}/users/${username}/received_events?page=${page}&per_page=30`);
  if (!response.ok) {
    throw new Error('Could not fetch received events');
  }
  return response.json();
};

export const fetchSubscriptions = async (username: string, page: number = 1): Promise<GitHubRepo[]> => {
  const response = await fetch(`${BASE_URL}/users/${username}/subscriptions?page=${page}&per_page=30`);
  if (!response.ok) {
    throw new Error('Could not fetch subscriptions');
  }
  return response.json();
};

export const fetchGists = async (username: string, page: number = 1): Promise<GitHubGist[]> => {
  const response = await fetch(`${BASE_URL}/users/${username}/gists?page=${page}&per_page=30`);
  if (!response.ok) {
    throw new Error('Could not fetch gists');
  }
  return response.json();
};
