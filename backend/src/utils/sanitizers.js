/**
 * Sanitizadores para remover conteúdo malicioso
 * Protege contra XSS e SQL injection
 */

// Remove caracteres especiais perigosos
export function sanitizeString(str) {
  if (typeof str !== 'string') return '';

  return str
    .trim()
    .replace(/[<>\"'`]/g, '') // Remove tags HTML e quotes
    .slice(0, 255); // Limita tamanho
}

// Sanitiza nome
export function sanitizeName(name) {
  if (typeof name !== 'string') return '';

  return name
    .trim()
    .replace(/[^a-záéíóúàâãñçA-ZÁÉÍÓÚÀÂÃÑÇ\s\-']/g, '')
    .slice(0, 255);
}

// Sanitiza email
export function sanitizeEmail(email) {
  if (typeof email !== 'string') return '';

  return email
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9@.\-_]/g, '')
    .slice(0, 255);
}

// Sanitiza números (apenas dígitos)
export function sanitizeNumber(num) {
  if (typeof num !== 'string') return '';

  return num.replace(/\D/g, '');
}

// Sanitiza endereço
export function sanitizeAddress(addr) {
  if (typeof addr !== 'string') return '';

  return addr
    .trim()
    .replace(/[<>`]/g, '') // Remove apenas tags perigosas
    .slice(0, 255);
}

// Sanitiza conteúdo genérico
export function sanitizeContent(content, options = {}) {
  const { maxLength = 5000, allowLineBreaks = true } = options;

  if (typeof content !== 'string') return '';

  let sanitized = content
    .trim()
    .replace(/[<>`]/g, ''); // Remove tags perigosas

  if (!allowLineBreaks) {
    sanitized = sanitized.replace(/[\r\n]+/g, ' ');
  }

  return sanitized.slice(0, maxLength);
}

// Remove espaços em branco extras
export function trimWhitespace(str) {
  if (typeof str !== 'string') return '';

  return str.trim().replace(/\s+/g, ' ');
}

// Normaliza dados de entrada
export function normalizeInput(input) {
  if (typeof input !== 'string') return '';

  return trimWhitespace(input)
    .toLowerCase()
    .slice(0, 255);
}
