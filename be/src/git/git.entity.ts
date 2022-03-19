export const enum GIT_OAUTH_ERROR {
  INCOMPLETE = 'INCOMPLETE',
  FAILED = 'FAILED',
}

export type GitlabOAuthTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  created_at: number;
};

export type GitlabUserIdentityProvider = {
  provider: string;
  extern_uid: string;
};

export type GitlabUserInfoResponse = {
  id: number;
  username: string;
  email: string;
  name: string;
  state: string;
  avatar_url: string;
  web_url: string;
  created_at: string;
  bio: string;
  location: string | null;
  public_email: string;
  skype: string;
  linkedin: string;
  twitter: string;
  website_url: string;
  organization: string;
  last_sign_in_at: string;
  confirmed_at: string;
  theme_id: number;
  last_activity_on: string;
  color_scheme_id: number;
  projects_limit: number;
  current_sign_in_at: string;
  identities: GitlabUserIdentityProvider[];
  can_create_group: boolean;
  can_create_project: boolean;
  two_factor_enabled: boolean;
  external: boolean;
  private_profile: boolean;
};
