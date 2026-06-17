"use client";

import { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Patient } from "@/lib/supabase";
import { Card, Button } from "@/components/ui";
import { EditPatientModal } from "@/components/patients/EditPatientModal";
import {
  ArrowLeft,
  User,
  Calendar,
  Activity,
  Phone,
  Mail,
  MapPin,
  Loader2,
  Pencil,
} from "lucide-react";
import Link from "next/link";

export default function PatientDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    async function fetchPatient() {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setPatient(data as Patient);
      }
      setLoading(false);
    }
    fetchPatient();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !patient) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <p className="text-lg font-medium">Patient not found.</p>
        <Link href="/patients">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Patients
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/patients">
            <Button variant="ghost" className="h-10 w-10 p-0 rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Patient Details
            </h1>
            <p className="text-muted-foreground">
              Detailed medical record and history
            </p>
          </div>
        </div>
        <Button onClick={() => setShowEdit(true)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit Patient
        </Button>
      </div>

      {showEdit && (
        <EditPatientModal
          patient={patient}
          onClose={() => setShowEdit(false)}
          onSuccess={(updated) => setPatient(updated)}
        />
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile card */}
        <Card className="p-6 md:col-span-1 flex flex-col items-center text-center space-y-4">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl">
            {patient.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{patient.name}</h2>
            <p className="text-muted-foreground text-sm">
              ID: {patient.id.slice(0, 8)}…
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full font-bold uppercase text-xs ${
              patient.status === "Critical"
                ? "bg-red-500/10 text-red-500"
                : patient.status === "Recovering"
                  ? "bg-green-500/10 text-green-500"
                  : "bg-blue-500/10 text-blue-500"
            }`}
          >
            {patient.status}
          </span>

          <div className="w-full pt-6 space-y-3 text-left">
            <h3 className="font-semibold px-2">Personal Information</h3>
            <div className="flex items-center space-x-3 text-sm px-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>
                {patient.age} years old, {patient.gender}
              </span>
            </div>
            <div className="flex items-center space-x-3 text-sm px-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{patient.phone || "Not provided"}</span>
            </div>
            <div className="flex items-center space-x-3 text-sm px-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{patient.email || "Not provided"}</span>
            </div>
            <div className="flex items-center space-x-3 text-sm px-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{patient.address || "Not provided"}</span>
            </div>
          </div>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Medical Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground flex items-center">
                  <Activity className="mr-2 h-4 w-4" /> Primary Condition
                </p>
                <p className="font-medium text-lg">{patient.condition}</p>
              </div>
              <div className="space-y-1 p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="mr-2 h-4 w-4" /> Last Visit
                </p>
                <p className="font-medium text-lg">{patient.last_visit}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Record Info</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">
                  Patient ID:{" "}
                </span>
                {patient.id}
              </p>
              <p>
                <span className="font-medium text-foreground">Added on: </span>
                {patient.created_at
                  ? new Date(patient.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "—"}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
