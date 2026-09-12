import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Menu, X, User, LogOut, Activity } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSystemHealth } from '../hooks/useSystemHealth';
import { AnimatedEyeLogo } from './AnimatedEyeLogo';

interface NavbarProps {
  onToggleMobileSidebar?: () => void;
  isMobileSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileSidebar, isMobileSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { health, isOnline } = useSystemHealth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#DCE7F2] bg-[#FFFFFF] px-4 md:px-8 shadow-xs">
      {/* Brand & Mobile Hamburger */}
      <div className="flex items-center gap-3">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden rounded-lg p-1.5 text-[#64748B] hover:text-[#16324F] hover:bg-[#F4F9FE] transition"
            aria-label="Toggle navigation drawer"
          >
            {isMobileSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        )}

        <div
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="rounded-xl bg-[#0B4A7A] p-2 text-white shadow-sm flex items-center justify-center group-hover:scale-105 transition">
            <AnimatedEyeLogo size={20} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black uppercase tracking-wider text-base md:text-lg bg-gradient-to-r from-[#0B4A7A] via-[#1677C8] to-[#083B63] bg-clip-text text-transparent">
                EYE SCREEN AI
              </span>
            </div>
            <p className="hidden sm:block text-[10px] text-[#64748B] font-medium tracking-wide">
              AI-Assisted Retinal Screening
            </p>
          </div>
        </div>
      </div>

      {/* Center / Right: System diagnostics, Quick Actions & User Dropdown */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Backend Heartbeat Pill */}
        <div
          className={`hidden lg:flex items-center gap-2 rounded-full px-3 py-1 text-xs border ${
            isOnline
              ? 'border-[#A7F3D0] bg-[#EAF8F1] text-[#249B68]'
              : 'border-[#FECACA] bg-[#FFF0F0] text-[#D9534F]'
          }`}
          title={`Service: ${health?.service || 'EyeScreen AI'}\nDevice: ${health?.device || 'CPU'}\nModel: ${health?.model_architecture || 'EfficientNet'}`}
        >
          <span className="relative flex h-2 w-2">
            {isOnline && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#249B68] opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isOnline ? 'bg-[#249B68]' : 'bg-[#D9534F]'
              }`}
            ></span>
          </span>
          <span className="font-mono text-[11px] font-bold">
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>

        {/* Quick New Screening CTA */}
        <button
          onClick={() => navigate('/screening')}
          className="flex items-center gap-1.5 rounded-xl bg-[#0B4A7A] hover:bg-[#083B63] px-4 py-2 text-xs md:text-sm font-semibold text-white transition shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Screening</span>
        </button>

        {/* User Account Avatar / Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-xl border border-[#DCE7F2] bg-[#FFFFFF] p-1.5 md:px-3 md:py-1.5 text-xs text-[#16324F] hover:bg-[#F4F9FE] transition shadow-xs"
          >
            <div className="rounded-lg bg-[#EAF5FF] p-1 text-[#0B4A7A]">
              <User className="h-4 w-4" />
            </div>
            <span className="hidden md:inline font-medium max-w-[120px] truncate">
              {user?.email || 'Clinician'}
            </span>
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#DCE7F2] bg-[#FFFFFF] p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150"
              onClick={() => setDropdownOpen(false)}
            >
              <div className="px-3 py-2 border-b border-[#DCE7F2]">
                <p className="text-[11px] text-[#64748B]">Signed in as</p>
                <p className="text-xs font-semibold text-[#16324F] truncate">{user?.email}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => navigate('/profile')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#64748B] hover:bg-[#EAF5FF] hover:text-[#0B4A7A] transition"
                >
                  <User className="h-3.5 w-3.5 text-[#0B4A7A]" />
                  <span>Profile & Subsystems</span>
                </button>
                <button
                  onClick={() => navigate('/history')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#64748B] hover:bg-[#EAF5FF] hover:text-[#0B4A7A] transition"
                >
                  <Activity className="h-3.5 w-3.5 text-[#0B4A7A]" />
                  <span>Screening Audit Log</span>
                </button>
              </div>

              <div className="border-t border-[#DCE7F2] pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#D9534F] hover:bg-[#FFF0F0] transition"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
