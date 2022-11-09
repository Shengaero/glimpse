import decode from 'jwt-decode';

export const LS_TOKEN_KEY = 'id_token';
export const getToken = () => localStorage.getItem(LS_TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(LS_TOKEN_KEY, token);
export const removeToken = () => localStorage.removeItem(LS_TOKEN_KEY);

export function getProfile() {
  return decode(getToken());
}

export function loggedIn() {
  const token = getToken();
  return token && !isTokenExpired(token) ? true : false;
}

export function isTokenExpired(token) {
  const decoded = decode(token);
  if(decoded.exp < Date.now() / 1000) {
    removeToken();
    return true;
  }
  return false;
}

export function login(idToken) {
  setToken(idToken);
  window.location.assign('/');
}

export function logout() {
  removeToken();
  window.location.reload();
}
