'use client';

import { useStore } from '@/store/useStore';
import { notFound } from 'next/navigation';
import { Card, Button } from '@/components/ui';
import { ArrowLeft, User, Calendar, Activity, Phone, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function PatientDetailsPage({ params }: { params: { id: string } }) {
  const { patients } = useStore();
  const patient = patients.find(p => p.id === params.id);

  if (!patient) {
    return notFound();
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
            <h1 className="text-3xl font-bold tracking-tight">Patient Details</h1>
            <p className="text-muted-foreground">Detailed medical record and history</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 md:col-span-1 flex flex-col items-center text-center space-y-4">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl">
            {patient.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{patient.name}</h2>
            <p className="text-muted-foreground">ID: #{patient.id}</p>
          </div>
          <span className={`px-3 py-1 rounded-full font-bold uppercase text-xs ${
            patient.status === 'Critical' ? 'bg-red-500/10 text-red-500' : 
            patient.status === 'Recovering' ? 'bg-green-500/10 text-green-500' : 
            'bg-blue-500/10 text-blue-500'
          }`}>
            {patient.status}
          </span>
          
          <div className="w-full pt-6 space-y-3 text-left">
            <h3 className="font-semibold px-2">Personal Information</h3>
            <div className="flex items-center space-x-3 text-sm px-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{patient.age} years old, {patient.gender}</span>
            </div>
            <div className="flex items-center space-x-3 text-sm px-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-3 text-sm px-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>patient@example.com</span>
            </div>
            <div className="flex items-center space-x-3 text-sm px-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>123 Medical Drive, City</span>
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
                <p className="font-medium text-lg">{patient.lastVisit}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Recent Appointments</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/10 transition">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Follow-up Checkup</p>
                      <p className="text-sm text-muted-foreground">Dr. Smith • General Practice</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Oct {15 - i}, 2024</p>
                    <p className="text-xs text-muted-foreground">10:00 AM</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
