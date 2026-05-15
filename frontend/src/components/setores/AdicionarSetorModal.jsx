"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdicionarSetorModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nome: "",
    tagNfc: "",
    idEquipe: "",
    rotasSelecionadas: [], // IDs das rotas marcadas
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Dados buscados
  const [equipes, setEquipes] = useState([]);
  const [rotas, setRotas] = useState([]);
  const [loadingEquipes, setLoadingEquipes] = useState(true);
  const [loadingRotas, setLoadingRotas] = useState(true);

  useEffect(() => {
    async function carregarEquipes() {
      try {
        const res = await apiFetch("/api/equipes");
        const data = await res.json();
        setEquipes(data);
      } catch (e) {
        console.error("Erro ao carregar equipes", e);
      } finally {
        setLoadingEquipes(false);
      }
    }
    async function carregarRotas() {
      try {
        const res = await apiFetch("/api/rotas");
        const data = await res.json();
        setRotas(data);
      } catch (e) {
        console.error("Erro ao carregar rotas", e);
      } finally {
        setLoadingRotas(false);
      }
    }
    carregarEquipes();
    carregarRotas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRotasCheckbox = (rotaId) => {
    setFormData((prev) => {
      const selecionadas = prev.rotasSelecionadas.includes(rotaId)
        ? prev.rotasSelecionadas.filter((id) => id !== rotaId)
        : [...prev.rotasSelecionadas, rotaId];
      return { ...prev, rotasSelecionadas: selecionadas };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const body = {
        nome: formData.nome,
        tagNfc: formData.tagNfc,
        idEquipe: Number(formData.idEquipe),
        rotas: formData.rotasSelecionadas,
      };

      const res = await apiFetch("/api/setores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Erro ao adicionar setor");
      }

      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Adicionar Setor</h2>
          <Button
            className="bg-transparent hover:bg-muted"
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="tagNfc">Tag NFC *</Label>
              <Input
                id="tagNfc"
                name="tagNfc"
                value={formData.tagNfc}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="idEquipe">Equipe *</Label>
              {loadingEquipes ? (
                <p className="text-sm text-gray-500">Carregando equipes...</p>
              ) : (
                <select
                  id="idEquipe"
                  name="idEquipe"
                  value={formData.idEquipe}
                  onChange={handleChange}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Selecione uma equipe</option>
                  {equipes.map((eq) => (
                    <option key={eq.Id} value={eq.Id}>
                      {eq.Nome}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Rotas (checkboxes) */}
          <div>
            <Label>Rotas (opcional)</Label>
            {loadingRotas ? (
              <p className="text-sm text-gray-500">Carregando rotas...</p>
            ) : rotas.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhuma rota disponível</p>
            ) : (
              <div className="mt-2 grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded p-2">
                {rotas.map((rota) => (
                  <label
                    key={rota.id}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.rotasSelecionadas.includes(rota.id)}
                      onChange={() => handleRotasCheckbox(rota.id)}
                    />
                    {rota.Nome}
                  </label>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}