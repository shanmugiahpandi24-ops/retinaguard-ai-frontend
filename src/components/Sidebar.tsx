import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  Clock,
  FileText,
  MessageSquare,
  User,
  LogOut,
  Eye,
  Cpu,
  Activity,
  X
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSystemHealth } from '../hooks/useSystemHealth';
import { AnimatedEyeLogo } from './AnimatedEyeLogo';

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { logout } = useAuth();
  const { health } = useSystemHealth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'New Screening', icon: PlusCircle, path: '/screening' },
    { label: 'Screening History', icon: Clock, path: '/history' },
    { label: 'Assessment Reports', icon: FileText, path: '/reports' },
    { label: 'AI Support', icon: MessageSquare, path: '/support' },
    { label: 'System Profile', icon: User, path: '/profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (onCloseMobile) onCloseMobile();
  };

  const content = (
    <div className="flex h-full w-64 flex-col justify-between border-r border-[#DCE7F2] bg-[#FFFFFF] shadow-xs">
      <div>
        {/* Brand logo & mobile close */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#DCE7F2]">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#0B4A7A] p-2 text-white shadow-sm flex items-center justify-center">
              <AnimatedEyeLogo size={20} className="text-white" />
            </div>
            <div>
              <span className="font-black uppercase tracking-wider text-base block bg-gradient-to-r from-[#0B4A7A] via-[#1677C8] to-[#083B63] bg-clip-text text-transparent">
                EYE SCREEN AI
              </span>
            </div>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden rounded-lg p-1.5 text-[#64748B] hover:text-[#16324F]"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition ${
                    isActive
                      ? 'bg-[#EAF5FF] text-[#0B4A7A] border border-[#BAE6FD] font-bold shadow-xs'
                      : 'text-[#64748B] hover:bg-[#F4F9FE] hover:text-[#0B4A7A]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#0B4A7A]' : 'text-[#64748B]'}`} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom status widget & logout */}
      <div className="p-4 border-t border-[#DCE7F2] space-y-3">
        {/* Diagnostics Mini Card */}
        <div className="rounded-xl border border-[#DCE7F2] bg-[#F8FBFF] p-3 space-y-1.5 text-[11px] text-[#64748B]">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[#64748B]">
              <Cpu className="h-3.5 w-3.5 text-[#0B4A7A]" /> Arch:
            </span>
            <span className="font-mono text-[#0B4A7A] font-bold text-[10px] tracking-tight">EfficientNet-B0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[#64748B]">
              <Activity className="h-3.5 w-3.5 text-[#0B4A7A]" /> Device:
            </span>
            <span className="font-mono text-[#249B68] font-bold uppercase text-[10px]">{health?.device || 'CPU'}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-4 py-2.5 rounded-xl text-xs font-semibold text-[#D9534F] hover:bg-[#FFF0F0] transition border border-[#D9534F]/30"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden md:flex h-full shrink-0 relative z-20">
        {content}
      </aside>

      {/* Mobile slide-over drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
