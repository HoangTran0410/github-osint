export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  public_repos: number;
  public_gists: number;
  created_at: string;
  updated_at: string;
  bio: string | null;
}

export interface GitHubActor {
  id: number;
  login: string;
  display_login?: string;
  gravatar_id: string;
  url: string;
  avatar_url: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  url: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count?: number;
  watchers_count?: number;
  forks_count?: number;
  owner?: GitHubActor;
  created_at?: string;
  updated_at?: string;
  size: number;
  archived: boolean;
}

export interface GitHubGist {
  id: string;
  html_url: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  files: {
    [filename: string]: {
      filename: string;
      type: string;
      language: string | null;
      raw_url: string;
      size: number;
    }
  };
  comments: number;
}

export interface GitHubPayload {
  push_id?: number;
  size?: number;
  distinct_size?: number;
  ref?: string;
  head?: string;
  before?: string;
  commits?: Array<{
    sha: string;
    author: {
      email: string;
      name: string;
    };
    message: string;
    distinct: boolean;
    url: string;
  }>;
  action?: string;
  forkee?: {
    full_name: string;
    html_url: string;
  };
  issue?: {
    number: number;
    title: string;
    html_url: string;
  };
  pull_request?: {
    title: string;
    html_url: string;
    number: number;
  };
  comment?: {
    body: string;
    html_url?: string;
  };
  release?: {
    html_url: string;
  };
  [key: string]: any;
}

export interface GitHubEvent {
  id: string;
  type: string;
  actor: GitHubActor;
  repo: GitHubRepo;
  payload: GitHubPayload;
  public: boolean;
  created_at: string;
}