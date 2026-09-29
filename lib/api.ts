import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const BASE_URL =
  'https://api-contatos-auth-04-09-25.onrender.com';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
});

export async function setAuthToken(token: string) {
  await SecureStore.setItemAsync('token', token);
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export async function loadAuthToken() {
  const token = await SecureStore.getItemAsync('token');

  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  return token;
}

export async function clearAuthToken() {
  await SecureStore.deleteItemAsync('token');
  delete api.defaults.headers.common.Authorization;
}

export function getImageUrl(fileId?: string) {
  return fileId ? `${BASE_URL}/upload/${fileId}` : undefined;
}

export default api;
