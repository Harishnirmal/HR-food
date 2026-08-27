import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HariLogo } from '../common/HariLogo';
import { X, Lock, Mail, User, Phone, Sparkles, Shield, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode,
    login,
    register,
    switchRoleDemo,
    showToast
  } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authModalMode === 'login') {
      if (!email.trim() || !password.trim()) {
        showToast('Please enter email and password', 'error');
        return;
      }
      const success = login(email, password);
      if (success) {
        setIsAuthModalOpen(false);
      }
    } else if (authModalMode === 'register') {
      if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
        showToast('Please fill all required fields', 'error');
        return;
      }
      const success = register(name, email, phone, password);
      if (success) {
        setIsAuthModalOpen(false);
      }
    } else {
      // Forgot password
      if (!email.trim()) {
        showToast('Please enter your email to receive password reset link', 'error');
        return;
      }
      showToast(`Password reset link sent to ${email}`, 'success');
      setAuthModalMode('login');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        id="auth-modal-panel"
        className="w-full max-w-md bg-[#FCFAF6] rounded-3xl shadow-2xl border border-[#E8DFD3] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E8DFC8] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <HariLogo size="sm" variant="icon" />
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900 leading-tight">
                {authModalMode === 'login' ? 'Welcome Back' : authModalMode === 'register' ? 'Create Account' : 'Reset Password'}
              </h3>
              <p className="text-xs text-stone-500">
                {authModalMode === 'login' ? 'Log in to track your orders and saved addresses' : authModalMode === 'register' ? 'Join Hari Restaurant for instant ordering' : 'We will send a reset link'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Logins Banner */}
        <div className="bg-[#F4ECE1] px-5 py-3 border-b border-[#E8DFC8] flex items-center justify-between text-xs">
          <span className="text-stone-600 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#C85A32]" />
            Quick Demo Login:
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                switchRoleDemo('customer');
                setIsAuthModalOpen(false);
              }}
              className="px-2.5 py-1 rounded-lg bg-white border border-stone-300 text-stone-800 font-bold hover:bg-[#FAF6F0] transition-colors"
            >
              Customer
            </button>
            <button
              onClick={() => {
                switchRoleDemo('admin');
                setIsAuthModalOpen(false);
              }}
              className="px-2.5 py-1 rounded-lg bg-purple-700 text-white font-bold hover:bg-purple-800 transition-colors"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {authModalMode === 'register' && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Suresh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-stone-900 focus:outline-none focus:border-[#183928]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="e.g. suresh@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-stone-900 focus:outline-none focus:border-[#183928]"
              />
            </div>
          </div>

          {authModalMode === 'register' && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  required
                  placeholder="e.g. 98401 23456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-stone-900 focus:outline-none focus:border-[#183928]"
                />
              </div>
            </div>
          )}

          {authModalMode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  Password
                </label>
                {authModalMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('forgot')}
                    className="text-xs text-[#C85A32] font-semibold hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-stone-900 focus:outline-none focus:border-[#183928]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#183928] text-white hover:bg-[#10261A] font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>
              {authModalMode === 'login' ? 'Sign In' : authModalMode === 'register' ? 'Create Account' : 'Send Reset Link'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer switch between login & register */}
        <div className="p-4 bg-[#F5EFE6] border-t border-[#E8DFC8] text-center text-xs text-stone-600">
          {authModalMode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => setAuthModalMode('register')}
                className="font-bold text-[#C85A32] hover:underline"
              >
                Register Now
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setAuthModalMode('login')}
                className="font-bold text-[#183928] hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
