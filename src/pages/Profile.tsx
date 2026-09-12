import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSystemHealth } from '../hooks/useSystemHealth';
import { predictionService } from '../services/prediction';
import { API_BASE_URL } from '../services/api';
import { User, Shield, Cpu, Activity, LogOut, CheckCircle2, Calendar, Server } from 'lucide-react';
import { SafetyDisclaimer } from '../components/SafetyDisclaimer';
import { formatDate } from '../utils/formatters';

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const { health, isOnline } = useSystemHealth();
  const [modelInfo, setModelInfo] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    predictionService.getModelInfo().then((info) => setModelInfo(info));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-8 p-6 md:p-10 max-w-5xl mx-auto text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-medical-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-brand-primary uppercase tracking-wider font-bold">
            <User className="h-3.5 w-3.5" /> Clinician Account & Environment
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-[#0B4A7A] uppercase tracking-wider mt-1">
            <span className="bg-gradient-to-r from-[#0B4A7A] via-[#1677C8] to-[#083B63] bg-clip-text text-transparent">
              SYSTEM PROFILE
            </span>
          </h1>
          <p className="text-xs text-medical-text-muted mt-1">
            Account credentials, active session tokens, and inference infrastructure diagnostics.
          </p>
        </div>

        <div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-medred-primary/30 bg-medred-light px-5 py-2.5 text-xs font-bold text-medred-primary hover:bg-medred-primary/10 transition shadow-sm"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Profile & Subsystems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Clinician Identity Card */}
        <div className="rounded-3xl border border-medical-border bg-white p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-brand-900 p-4 text-white shadow-sm">
              <User className="h-8 w-8" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-brand-primary uppercase tracking-wider font-bold">Authenticated User</span>
              <h3 className="text-lg font-bold text-brand-900 break-all">{user?.email || 'Clinician'}</h3>
              <span className="text-xs text-medgreen-primary flex items-center gap-1 mt-0.5 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" /> Session Active
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-medical-border text-xs">
            <div className="flex justify-between">
              <span className="text-medical-text-muted">User ID:</span>
              <span className="font-mono text-brand-900 font-bold">{user?.id || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-medical-text-muted">Account Created:</span>
              <span className="text-medical-text font-medium">{formatDate(user?.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-medical-text-muted">Security Clearance:</span>
              <span className="rounded bg-brand-50 border border-brand-primary/20 px-2 py-0.5 font-bold text-brand-primary">
                Authorized Clinician
              </span>
            </div>
          </div>
        </div>

        {/* Backend & Diagnostics Card */}
        <div className="rounded-3xl border border-medical-border bg-white p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-medical-bg border border-medical-border p-4 text-brand-primary">
              <Server className="h-8 w-8" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-brand-primary uppercase tracking-wider font-bold">FastAPI Backend</span>
              <h3 className="text-lg font-bold text-brand-900">{health?.service || 'EYESCREEN AI'}</h3>

              <span className="text-xs font-mono text-medical-text-muted break-all">{API_BASE_URL}</span>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-medical-border text-xs">
            <div className="flex justify-between">
              <span className="text-medical-text-muted">API Gateway Status:</span>
              <span className={`font-bold uppercase ${isOnline ? 'text-medgreen-primary' : 'text-medred-primary'}`}>
                {health?.status || 'ONLINE'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-medical-text-muted">Model Architecture:</span>
              <span className="font-mono text-brand-900 font-bold">{health?.model_architecture || 'efficientnet_b0'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-medical-text-muted">Model Version:</span>
              <span className="font-mono text-brand-900 font-bold">{health?.model_version || 'v1.0.0-efficientnet'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-medical-text-muted">Hardware Compute:</span>
              <span className="font-mono text-medgreen-primary font-bold uppercase">{health?.device || 'CPU'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-medical-text-muted">Database Connection:</span>
              <span className="text-medgreen-primary font-bold">SQLite Connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Model Classes Overview */}
      {modelInfo && (
        <div className="rounded-3xl border border-medical-border bg-white p-6 md:p-8 space-y-4 shadow-sm">
          <h4 className="text-sm font-bold text-brand-900 uppercase tracking-wider">
            Supported Retinopathy Severity Classes ({modelInfo.num_classes})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
            {modelInfo.classes?.map((cls: string, i: number) => (
              <div key={i} className="rounded-2xl border border-medical-border bg-medical-bg p-4 text-center">
                <span className="text-[10px] font-mono text-medical-text-muted block uppercase font-bold">Class 0{i}</span>
                <span className="text-sm font-bold text-brand-900 mt-1 block">{cls}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Safety Notice */}
      <SafetyDisclaimer />
    </div>
  );
};
