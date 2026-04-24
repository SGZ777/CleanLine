"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdicionarChecklistModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    setor: "",
    cargo: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      onSuccess({
        id: `TASK-${Date.now()}`,
        setor: formData.setor,
        cargo: formData.cargo,
        status: "pending",
        notes: formData.notes || "Checklist aguardando inicio.",
      });
    } catch (err) {
      setError(err.message || "Erro ao adicionar checklist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Adicionar Checklist</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="setor">Setor *</Label>
              <Input
                id="setor"
                name="setor"
                value={formData.setor}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="cargo">Cargo *</Label>
              <Input
                id="cargo"
                name="cargo"
                value={formData.cargo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="notes">Observacoes</Label>
              <Input
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Detalhes opcionais do checklist"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#1c96c2] hover:bg-[#157a9e] text-white"
            >
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
