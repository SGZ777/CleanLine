"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Funções de máscara
const formatCPF = (value) => {
  const digits = value.replace(/\D/g, "");
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .substring(0, 14);
};

const formatPhone = (value) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").substring(0, 14);
  }
  return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").substring(0, 15);
};

const formatCEP = (value) => {
  const digits = value.replace(/\D/g, "");
  return digits.replace(/(\d{5})(\d{0,3})/, "$1-$2").substring(0, 9);
};

export default function AdicionarFuncionarioModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    tel: "",
    cargo: "Funcionário de Limpeza",
    cpf: "",
    estado: "",
    cidade: "",
    bairro: "",
    logradouro: "",
    numero: "",
    cep: "",
    idEquipe: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCPFChange = (e) => {
    setFormData({ ...formData, cpf: formatCPF(e.target.value) });
  };

  const handlePhoneChange = (e) => {
    setFormData({ ...formData, tel: formatPhone(e.target.value) });
  };

  const handleCEPChange = (e) => {
    setFormData({ ...formData, cep: formatCEP(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Remover formatação antes de enviar (opcional, backend pode limpar)
    const cleanData = {
      ...formData,
      cpf: formData.cpf.replace(/\D/g, ""),
      tel: formData.tel.replace(/\D/g, ""),
      cep: formData.cep.replace(/\D/g, ""),
    };

    try {
      const res = await apiFetch("/api/funcionarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Erro ao adicionar");
      }

      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isSupervisor = formData.cargo === "Supervisor";
  const isFuncLimpeza = formData.cargo === "Funcionário de Limpeza";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Adicionar Funcionário</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome *</Label>
              <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="senha">Senha *</Label>
              <Input id="senha" name="senha" type="password" value={formData.senha} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="tel">Telefone *</Label>
              <Input id="tel" name="tel" value={formData.tel} onChange={handlePhoneChange} placeholder="(99) 99999-9999" required />
            </div>
          </div>

          <div>
            <Label htmlFor="cargo">Cargo *</Label>
            <select
              id="cargo"
              name="cargo"
              value={formData.cargo}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              required
            >
              <option value="Administrador">Administrador</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Funcionário de Limpeza">Funcionário de Limpeza</option>
            </select>
          </div>

          {isSupervisor && (
            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-2">Dados de Supervisor</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input id="cpf" name="cpf" value={formData.cpf} onChange={handleCPFChange} placeholder="999.999.999-99" required />
                </div>
                <div>
                  <Label htmlFor="estado">Estado (UF) *</Label>
                  <Input id="estado" name="estado" maxLength={2} value={formData.estado} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="cidade">Cidade *</Label>
                  <Input id="cidade" name="cidade" value={formData.cidade} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="bairro">Bairro *</Label>
                  <Input id="bairro" name="bairro" value={formData.bairro} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="logradouro">Logradouro *</Label>
                  <Input id="logradouro" name="logradouro" value={formData.logradouro} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="numero">Número *</Label>
                  <Input id="numero" name="numero" type="number" value={formData.numero} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="cep">CEP *</Label>
                  <Input id="cep" name="cep" value={formData.cep} onChange={handleCEPChange} placeholder="99999-999" required />
                </div>
              </div>
            </div>
          )}

          {isFuncLimpeza && (
            <div>
              <Label htmlFor="idEquipe">Equipe *</Label>
              <Input id="idEquipe" name="idEquipe" type="number" value={formData.idEquipe} onChange={handleChange} required />
              <p className="text-xs text-muted-foreground mt-1">ID da equipe de limpeza.</p>
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={loading} className="bg-[#1c96c2] hover:bg-[#157a9e] text-white">
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
