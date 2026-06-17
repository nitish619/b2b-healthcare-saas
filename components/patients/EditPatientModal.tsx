"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabase";
import type { Patient } from "@/lib/supabase";
import { X, Loader2 } from "lucide-react";
import { Button, Input } from "@/components/ui";

interface EditPatientModalProps {
  patient: Patient;
  onClose: () => void;
  onSuccess: (updated: Patient) => void;
}

const selectClass =
  "w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary";

export function EditPatientModal({
  patient,
  onClose,
  onSuccess,
}: EditPatientModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [form, setForm] = useState({
    name: patient.name,
    age: String(patient.age),
    gender: patient.gender,
    condition: patient.condition,
    last_visit: patient.last_visit,
    status: patient.status,
    phone: patient.phone ?? "",
    email: patient.email ?? "",
    address: patient.address ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: updateError } = await supabase
      .from("patients")
      .update({
        name: form.name,
        age: parseInt(form.age, 10),
        gender: form.gender,
        condition: form.condition,
        last_visit: form.last_visit,
        status: form.status,
        phone: form.phone || null,
        email: form.email || null,
        address: form.address || null,
      })
      .eq("id", patient.id)
      .select()
      .single();

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else if (data) {
      onSuccess(data as Patient);
      onClose();
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card rounded-xl shadow-2xl border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Edit Patient</h2>
            <p className="text-sm text-muted-foreground">
              Update patient details below
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name + Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Full Name *</label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Age *</label>
              <Input
                name="age"
                type="number"
                min="1"
                max="150"
                value={form.age}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Gender + Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Gender *</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
                className={selectClass}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Status *</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                required
                className={selectClass}
              >
                <option>Stable</option>
                <option>Recovering</option>
                <option>Critical</option>
              </select>
            </div>
          </div>

          {/* Condition */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Medical Condition *</label>
            <Input
              name="condition"
              value={form.condition}
              onChange={handleChange}
              required
            />
          </div>

          {/* Last Visit */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Last Visit Date *</label>
            <Input
              name="last_visit"
              type="date"
              value={form.last_visit}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Phone</label>
              <Input
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Email</label>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Address</label>
            <Input
              name="address"
              value={form.address}
              onChange={handleChange}
            />
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
