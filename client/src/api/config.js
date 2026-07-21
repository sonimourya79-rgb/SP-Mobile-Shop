// In dev, VITE_API_URL is unset: API_BASE stays '/api' and Vite's dev-server proxy
// (see vite.config.js) forwards it to the local backend, so API_ORIGIN is ''.
// In production, VITE_API_URL points at the deployed backend, e.g.
// https://sp-mobile-api.onrender.com/api, so uploaded images (served from the
// backend's own /uploads path) can be resolved to an absolute URL.
export const API_BASE = import.meta.env.VITE_API_URL || '/api';
export const API_ORIGIN = API_BASE.replace(/\/api\/?$/, '');

export function resolveImage(path) {
  if (!path) return path;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_ORIGIN}${path}`;
}
