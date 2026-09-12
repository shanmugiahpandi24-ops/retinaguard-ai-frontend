import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { authService } from '../services/auth';
import { useAuth } from '../hooks/useAuth';
import { SafetyDisclaimer } from '../components/SafetyDisclaimer';
import { ParallaxCard } from '../components/ParallaxCard';
import { AnimatedEyeLogo } from '../components/AnimatedEyeLogo';

export const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);

    try {
      await authService.register(email, password);
      // Auto-login after registration
      const loginRes = await authService.login(email, password);
      await login(loginRes.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError(err.response?.data?.detail || 'This email is already registered. Please sign in instead.');
      } else if (err.response?.data?.detail) {
        setError(typeof err.response.data.detail === 'string' ? err.response.data.detail : 'Registration failed.');
      } else if (!err.response) {
        setError('Cannot reach server at http://localhost:8000. Please ensure backend is running.');
      } else {
        setError('An unexpected error occurred during account creation.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-[#16324F] flex flex-col justify-between p-6 relative z-10">
      <header className="flex items-center justify-between max-w-6xl w-full mx-auto py-2">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="rounded-2xl bg-[#0B4A7A] p-2 text-white shadow-md shadow-blue-500/10 flex items-center justify-center group-hover:scale-105 transition duration-300">
            <AnimatedEyeLogo size={22} cuteGlow className="text-white" />
          </div>
          <span className="font-black uppercase tracking-wider text-lg bg-gradient-to-r from-[#0B4A7A] via-[#1677C8] to-[#083B63] bg-clip-text text-transparent">
            EYE SCREEN AI
          </span>
        </Link>
        <Link to="/" className="text-xs font-semibold text-[#64748B] hover:text-[#0B4A7A] transition">
          &larr; Back to Home
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center py-8">
        <ParallaxCard depth={15} tiltAmount={7} className="w-full max-w-md">
          <div className="w-full rounded-3xl border border-[#CBD5E1] bg-white/95 backdrop-blur-md p-8 md:p-10 shadow-xl space-y-6 animate-in fade-in zoom-in-95 duration-300 relative z-10">
            {/* Neat & Cute Card Header with Animated Blinking Eye Logo */}
            <div className="text-center space-y-2">
              <div className="relative inline-flex items-center justify-center">
                <div className="rounded-2xl bg-gradient-to-tr from-[#0B4A7A] via-[#1677C8] to-[#38BDF8] p-4 text-white shadow-lg shadow-blue-500/20 mb-2 border border-white/30">
                  <AnimatedEyeLogo size={32} cuteGlow className="text-white" />
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider bg-gradient-to-r from-[#0B4A7A] via-[#1677C8] to-[#083B63] bg-clip-text text-transparent">
                CREATE CLINICIAN ACCOUNT
              </h2>
              <p className="text-xs text-[#64748B] font-medium">Join the AI-assisted retinal screening platform</p>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-[#FCA5A5] bg-[#FFF0F0] p-3.5 text-xs text-[#D9534F] animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0 text-[#D9534F] mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-[#64748B]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ophthalmologist@clinic.org"
                    className="w-full rounded-2xl border border-[#CBD5E1] bg-white pl-10 pr-4 py-3 text-sm text-[#1E293B] font-medium placeholder-[#94A3B8] focus:border-[#1677C8] focus:outline-none focus:ring-2 focus:ring-[#1677C8]/20 shadow-2xs transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                  Secure Password <span className="text-[10px] text-[#64748B] lowercase font-normal">(min 6 chars)</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-[#64748B]" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-[#CBD5E1] bg-white pl-10 pr-4 py-3 text-sm text-[#1E293B] font-medium placeholder-[#94A3B8] focus:border-[#1677C8] focus:outline-none focus:ring-2 focus:ring-[#1677C8]/20 shadow-2xs transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-[#64748B]" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-[#CBD5E1] bg-white pl-10 pr-4 py-3 text-sm text-[#1E293B] font-medium placeholder-[#94A3B8] focus:border-[#1677C8] focus:outline-none focus:ring-2 focus:ring-[#1677C8]/20 shadow-2xs transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#0B4A7A] via-[#1677C8] to-[#083B63] hover:from-[#083B63] hover:to-[#0B4A7A] py-3.5 text-sm font-bold text-white transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.01] disabled:opacity-50 mt-2 group"
              >
                <span>{loading ? 'Creating Account...' : 'Register & Enter Workspace'}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition duration-300" />
              </button>
            </form>

            <p className="text-center text-xs text-[#64748B]">
              Already registered?{' '}
              <Link to="/login" className="font-bold text-[#1677C8] hover:underline">
                Sign in to your account
              </Link>
            </p>
          </div>
        </ParallaxCard>
      </main>

      <footer className="max-w-md mx-auto w-full py-2">
        <SafetyDisclaimer />
      </footer>
    </div>
  );
};
