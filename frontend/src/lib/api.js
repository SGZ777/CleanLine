// Centraliza a URL base do backend.
// Em desenvolvimento: http://localhost:3001
// Em produção: defina NEXT_PUBLIC_API_URL no .env
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Faz uma requisição autenticada para o backend.
 * @param {string} path - ex: "/api/funcionarios"
 * @param {RequestInit} options - opções do fetch (method, body, etc.)
 */
export async function apiFetch(path, options = {}) {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('cleanline_token')
    : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  return response;
}
