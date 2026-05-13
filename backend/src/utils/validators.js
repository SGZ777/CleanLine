/**
 * Validadores reutilizáveis para o projeto
 * Centraliza todas as validações de entrada
 */

// Validação de Email
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email é obrigatório' };
  }

  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Email inválido' };
  }

  if (trimmed.length > 255) {
    return { valid: false, error: 'Email muito longo' };
  }

  return { valid: true, value: trimmed };
}

// Validação de Senha
export function validatePassword(senha) {
  if (!senha || typeof senha !== 'string') {
    return { valid: false, error: 'Senha é obrigatória' };
  }

  if (senha.length < 6) {
    return { valid: false, error: 'Senha deve ter no mínimo 6 caracteres' };
  }

  if (senha.length > 128) {
    return { valid: false, error: 'Senha muito longa' };
  }

  return { valid: true };
}

// Validação de Nome
export function validateNome(nome) {
  if (!nome || typeof nome !== 'string') {
    return { valid: false, error: 'Nome é obrigatório' };
  }

  const trimmed = nome.trim();

  if (trimmed.length < 3) {
    return { valid: false, error: 'Nome deve ter no mínimo 3 caracteres' };
  }

  if (trimmed.length > 255) {
    return { valid: false, error: 'Nome muito longo' };
  }

  // Remove caracteres perigosos
  if (!/^[a-záéíóúàâãñçA-ZÁÉÍÓÚÀÂÃÑÇ\s\-']+$/.test(trimmed)) {
    return { valid: false, error: 'Nome contém caracteres inválidos' };
  }

  return { valid: true, value: trimmed };
}

// Validação de Telefone
export function validateTelefone(tel) {
  if (!tel || typeof tel !== 'string') {
    return { valid: false, error: 'Telefone é obrigatório' };
  }

  const trimmed = tel.trim().replace(/\D/g, '');

  if (trimmed.length < 10) {
    return { valid: false, error: 'Telefone inválido' };
  }

  if (trimmed.length > 15) {
    return { valid: false, error: 'Telefone inválido' };
  }

  return { valid: true, value: trimmed };
}

// Validação de CPF
export function validateCPF(cpf) {
  if (!cpf || typeof cpf !== 'string') {
    return { valid: false, error: 'CPF é obrigatório' };
  }

  const cleaned = cpf.replace(/\D/g, '');

  if (cleaned.length !== 11) {
    return { valid: false, error: 'CPF deve ter 11 dígitos' };
  }

  // Verificação básica de CPF válido
  if (/^(\d)\1{10}$/.test(cleaned)) {
    return { valid: false, error: 'CPF inválido' };
  }

  return { valid: true, value: cleaned };
}

// Validação de CEP
export function validateCEP(cep) {
  if (!cep || typeof cep !== 'string') {
    return { valid: false, error: 'CEP é obrigatório' };
  }

  const cleaned = cep.replace(/\D/g, '');

  if (cleaned.length !== 8) {
    return { valid: false, error: 'CEP deve ter 8 dígitos' };
  }

  return { valid: true, value: cleaned };
}

// Validação de Endereço
export function validateEndereco(endereco) {
  if (!endereco || typeof endereco !== 'string') {
    return { valid: false, error: 'Endereço é obrigatório' };
  }

  const trimmed = endereco.trim();

  if (trimmed.length < 3) {
    return { valid: false, error: 'Endereço muito curto' };
  }

  if (trimmed.length > 255) {
    return { valid: false, error: 'Endereço muito longo' };
  }

  return { valid: true, value: trimmed };
}

// Validação de Número
export function validateNumero(numero) {
  const num = parseInt(numero, 10);

  if (isNaN(num) || num < 0 || num > 999999) {
    return { valid: false, error: 'Número inválido' };
  }

  return { valid: true, value: num };
}

// Validação de ID (segurança contra SQL injection)
export function validateId(id) {
  const num = parseInt(id, 10);

  if (isNaN(num) || num <= 0) {
    return { valid: false, error: 'ID inválido' };
  }

  return { valid: true, value: num };
}

// Validação de Cargo
export function validateCargo(cargo) {
  const cargosValidos = ['Administrador', 'Supervisor', 'Funcionário de Limpeza'];

  if (!cargo || !cargosValidos.includes(cargo)) {
    return { valid: false, error: `Cargo inválido. Aceitos: ${cargosValidos.join(', ')}` };
  }

  return { valid: true, value: cargo };
}

// Validação de Estado
export function validateEstado(estado) {
  const estadosValidos = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  if (!estado || !estadosValidos.includes(estado.toUpperCase())) {
    return { valid: false, error: 'Estado inválido' };
  }

  return { valid: true, value: estado.toUpperCase() };
}

// Validação de Cidade
export function validateCidade(cidade) {
  if (!cidade || typeof cidade !== 'string') {
    return { valid: false, error: 'Cidade é obrigatória' };
  }

  const trimmed = cidade.trim();

  if (trimmed.length < 2) {
    return { valid: false, error: 'Cidade inválida' };
  }

  if (trimmed.length > 100) {
    return { valid: false, error: 'Cidade muito longa' };
  }

  return { valid: true, value: trimmed };
}

// Validação de Bairro
export function validateBairro(bairro) {
  if (!bairro || typeof bairro !== 'string') {
    return { valid: false, error: 'Bairro é obrigatório' };
  }

  const trimmed = bairro.trim();

  if (trimmed.length < 2) {
    return { valid: false, error: 'Bairro inválido' };
  }

  if (trimmed.length > 100) {
    return { valid: false, error: 'Bairro muito longo' };
  }

  return { valid: true, value: trimmed };
}

// Validação de Status
export function validateStatus(status) {
  const statusValidos = ['ativo', 'inativo'];

  if (!status || !statusValidos.includes(status)) {
    return { valid: false, error: `Status inválido. Aceitos: ${statusValidos.join(', ')}` };
  }

  return { valid: true, value: status };
}

// Validação genérica de string com limites
export function validateString(value, { minLength = 1, maxLength = 255, fieldName = 'Campo' } = {}) {
  if (!value || typeof value !== 'string') {
    return { valid: false, error: `${fieldName} é obrigatório` };
  }

  const trimmed = value.trim();

  if (trimmed.length < minLength) {
    return { valid: false, error: `${fieldName} deve ter no mínimo ${minLength} caracteres` };
  }

  if (trimmed.length > maxLength) {
    return { valid: false, error: `${fieldName} não pode exceder ${maxLength} caracteres` };
  }

  return { valid: true, value: trimmed };
}

// Função auxiliar para validar múltiplos campos
export function validateFields(fields) {
  const errors = [];

  for (const [fieldName, validation] of Object.entries(fields)) {
    if (!validation.valid) {
      errors.push(validation.error);
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true };
}
