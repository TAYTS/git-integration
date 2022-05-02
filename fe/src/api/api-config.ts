const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const config = {
  getGitlabOAuthRedirectURI: `${baseURL}/git/gitlab/get-redirect-uri`,
  signup: `${baseURL}/users`,
};

export default config;
