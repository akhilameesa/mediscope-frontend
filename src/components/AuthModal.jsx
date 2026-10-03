import React, { useState, useId } from 'react';
import { X, Check, AlertCircle, Eye, EyeOff, Lock, Mail, User, ShieldAlert, ArrowRight } from 'lucide-react';
import { apiClient } from '../api/client';

export default function AuthModal({ isOpen, onClose, initialTab = 'login', onAuthSuccess }) {
  const [tab, setTab] = useState(initialTab); // 'login' or 'register'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [consentGranted, setConsentGranted] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState('');
  
  // Specific modal alert when user is not found during login
  const [showAccountNotFoundModal, setShowAccountNotFoundModal] = useState(false);
  const notFoundModalTitleId = useId();

  if (!isOpen) return null;

  // Password complexity checks
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[@#$%!&*^()\-_=+[\]{}|;:'",.<>/?]/.test(password);
  const isPasswordValid = hasMinLength && hasUpper && hasLower && hasDigit && hasSpecial;

  // Email format validation with domain
  const isEmailValid = /^[^@]+@[^@]+\.[^@]{2,}$/.test(email.trim());

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setErrorNotice('');
    setShowAccountNotFoundModal(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorNotice('');
    if (!email || !password) {
      setErrorNotice('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.login(email, password);
      onAuthSuccess(res.user);
      onClose();
    } catch (err) {
      if (err.status === 404 || err.message?.includes('Account Not Found')) {
        // Trigger required modal popup alert!
        setShowAccountNotFoundModal(true);
      } else {
        setErrorNotice(err.message || 'Authentication failed. Please verify your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorNotice('');

    if (!fullName.trim()) {
      setErrorNotice('Please provide your full legal name.');
      return;
    }

    if (!isEmailValid) {
      setErrorNotice('Please enter a valid email address with a valid domain (e.g. yourname@gmail.com).');
      return;
    }

    if (!isPasswordValid) {
      setErrorNotice('Please ensure your password meets all complexity requirements below.');
      return;
    }

    if (!consentGranted) {
      setErrorNotice('Mandatory permission consent must be granted to register for Mediscope.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.register(fullName, email, password, consentGranted);
      onAuthSuccess(res.user);
      onClose();
    } catch (err) {
      // Check duplicate notice
      if (err.message?.includes('already exists') || err.status === 400) {
        setErrorNotice('An account with this email already exists. Please log in.');
      } else {
        setErrorNotice(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D52A0]/40 backdrop-blur-xs">
      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-[#FFFFFF] border border-[#ADBBDA] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header with Close */}
        <div className="bg-[#EDE8F5] border-b border-[#ADBBDA] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl text-[#3D52A0]">Mediscope</span>
            <span className="text-xs text-[#8697C4] font-semibold">| Health Companion</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#8697C4] hover:text-[#3D52A0] hover:bg-[#FFFFFF]/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Gateway */}
        <div className="flex border-b border-[#ADBBDA] bg-[#EDE8F5]/40 text-sm font-bold">
          <button
            type="button"
            onClick={() => handleTabChange('login')}
            className={`flex-1 py-3.5 text-center transition-all cursor-pointer ${
              tab === 'login'
                ? 'text-[#3D52A0] border-b-2 border-[#7091E6] bg-[#FFFFFF]'
                : 'text-[#8697C4] hover:text-[#3D52A0]'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('register')}
            className={`flex-1 py-3.5 text-center transition-all cursor-pointer ${
              tab === 'register'
                ? 'text-[#3D52A0] border-b-2 border-[#7091E6] bg-[#FFFFFF]'
                : 'text-[#8697C4] hover:text-[#3D52A0]'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {errorNotice && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorNotice}</span>
            </div>
          )}

          {tab === 'login' ? (
            /* ================= LOGIN FORM ================= */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3D52A0] uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8697C4]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. patient@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#EDE8F5]/30 border border-[#ADBBDA] focus:border-[#7091E6] focus:bg-white text-sm text-[#3D52A0] font-medium outline-hidden transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3D52A0] uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8697C4]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#EDE8F5]/30 border border-[#ADBBDA] focus:border-[#7091E6] focus:bg-white text-sm text-[#3D52A0] font-medium outline-hidden transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-[#8697C4] hover:text-[#3D52A0]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#7091E6] hover:bg-[#3D52A0] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In to Mediscope'}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-[#8697C4]">Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => handleTabChange('register')}
                  className="text-xs font-bold text-[#7091E6] hover:underline"
                >
                  Create one now
                </button>
              </div>
            </form>
          ) : (
            /* ================= REGISTRATION FORM ================= */
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3D52A0] uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8697C4]" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Akhila Meesa"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#EDE8F5]/30 border border-[#ADBBDA] focus:border-[#7091E6] focus:bg-white text-sm text-[#3D52A0] font-medium outline-hidden transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3D52A0] uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8697C4]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. name@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#EDE8F5]/30 border border-[#ADBBDA] focus:border-[#7091E6] focus:bg-white text-sm text-[#3D52A0] font-medium outline-hidden transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3D52A0] uppercase tracking-wider mb-1.5">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8697C4]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Choose a strong password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#EDE8F5]/30 border border-[#ADBBDA] focus:border-[#7091E6] focus:bg-white text-sm text-[#3D52A0] font-medium outline-hidden transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-[#8697C4] hover:text-[#3D52A0]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Live Interactive Password Complexity Checklist */}
              <div className="p-3.5 rounded-xl bg-[#EDE8F5]/50 border border-[#ADBBDA] space-y-1.5 text-xs">
                <div className="font-bold text-[#3D52A0] mb-1">Password Requirements:</div>
                <div className={`flex items-center gap-2 ${hasMinLength ? 'text-emerald-700 font-bold' : 'text-[#8697C4]'}`}>
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${hasMinLength ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200'}`}>
                    {hasMinLength ? <Check className="w-3 h-3" /> : '•'}
                  </div>
                  <span>Minimum 8 characters</span>
                </div>
                <div className={`flex items-center gap-2 ${hasUpper ? 'text-emerald-700 font-bold' : 'text-[#8697C4]'}`}>
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${hasUpper ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200'}`}>
                    {hasUpper ? <Check className="w-3 h-3" /> : '•'}
                  </div>
                  <span>At least 1 uppercase letter (A-Z)</span>
                </div>
                <div className={`flex items-center gap-2 ${hasLower ? 'text-emerald-700 font-bold' : 'text-[#8697C4]'}`}>
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${hasLower ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200'}`}>
                    {hasLower ? <Check className="w-3 h-3" /> : '•'}
                  </div>
                  <span>At least 1 lowercase letter (a-z)</span>
                </div>
                <div className={`flex items-center gap-2 ${hasDigit ? 'text-emerald-700 font-bold' : 'text-[#8697C4]'}`}>
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${hasDigit ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200'}`}>
                    {hasDigit ? <Check className="w-3 h-3" /> : '•'}
                  </div>
                  <span>At least 1 numeric digit (0-9)</span>
                </div>
                <div className={`flex items-center gap-2 ${hasSpecial ? 'text-emerald-700 font-bold' : 'text-[#8697C4]'}`}>
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${hasSpecial ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200'}`}>
                    {hasSpecial ? <Check className="w-3 h-3" /> : '•'}
                  </div>
                  <span>At least 1 special character (@, #, $, %, !, &, *, etc.)</span>
                </div>
              </div>

              {/* ONE-TIME MANDATORY PERMISSION CONSENT (Registration Only) */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentGranted}
                    onChange={(e) => setConsentGranted(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-[#7091E6] focus:ring-[#7091E6] border-[#ADBBDA]"
                  />
                  <span className="text-[11px] leading-relaxed text-[#3D52A0] font-medium">
                    I grant Mediscope permission to store encrypted patient profile data, parse laboratory files, send health checkup reminder emails to my registered address, and process anonymized health data for AI educational briefing. I understand Mediscope is an educational companion, NOT a diagnostic platform.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || !consentGranted || !isPasswordValid}
                className="w-full py-3 rounded-xl bg-[#7091E6] hover:bg-[#3D52A0] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-[#8697C4]">Already have an account? </span>
                <button
                  type="button"
                  onClick={() => handleTabChange('login')}
                  className="text-xs font-bold text-[#7091E6] hover:underline"
                >
                  Log In instead
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* ============================================================================ */}
      {/* SIGN-IN USER LOOKUP & MODAL ALERT                                            */}
      {/* Triggered when user attempts login with email not present in database        */}
      {/* ============================================================================ */}
      {showAccountNotFoundModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={notFoundModalTitleId}
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="w-full max-w-md bg-[#FFFFFF] border-2 border-[#7091E6] rounded-2xl shadow-2xl p-6 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 id={notFoundModalTitleId} className="text-lg font-extrabold text-[#3D52A0]">
                Account Not Found
              </h3>
              <p className="text-sm text-[#3D52A0] font-medium leading-relaxed">
                No account is associated with this email address. Please register for a new account instead of signing in.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setShowAccountNotFoundModal(false);
                  handleTabChange('register');
                }}
                className="w-full py-3 rounded-xl bg-[#7091E6] hover:bg-[#3D52A0] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Switch to Registration</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowAccountNotFoundModal(false)}
                className="w-full py-2.5 rounded-xl bg-[#EDE8F5] text-[#3D52A0] font-bold text-xs hover:bg-[#ADBBDA]/40 transition-colors cursor-pointer"
              >
                Cancel / Try Another Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
