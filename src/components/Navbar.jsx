import React from 'react';
import { Activity, User, LogOut, ChevronDown, Bell } from 'lucide-react';

export default function Navbar({
  user,
  activePatient,
  patients = [],
  onSelectPatient,
  onOpenAuth,
  onLogout,
  onOpenReminders
}) {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#ADBBDA] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 cursor-pointer select-none">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3D52A0] to-[#7091E6] flex items-center justify-center text-white shadow-md">
            <Activity className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-tight text-[#3D52A0]">
                Mediscope
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDE8F5] text-[#3D52A0] border border-[#ADBBDA]">
                AI 2.0
              </span>
            </div>
            <p className="text-[11px] font-semibold text-[#8697C4] tracking-wide uppercase">
              Health Report Companion
            </p>
          </div>
        </div>

        {/* Center / Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {user ? (
            <>
              {/* Active Patient Dropdown */}
              {patients.length > 0 && (
                <div className="relative hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#EDE8F5] border border-[#ADBBDA]">
                  <span className="text-xs font-semibold text-[#3D52A0]">Active Patient:</span>
                  <select
                    value={activePatient?.id || ''}
                    onChange={(e) => {
                      const p = patients.find(item => item.id === e.target.value);
                      if (p) onSelectPatient(p);
                    }}
                    className="bg-transparent text-xs font-bold text-[#3D52A0] focus:outline-none cursor-pointer pr-1"
                  >
                    {patients.map(p => (
                      <option key={p.id} value={p.id} className="bg-white text-[#3D52A0]">
                        {p.full_name} ({p.relationship})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Reminders Quick Action */}
              <button
                onClick={onOpenReminders}
                className="p-2.5 rounded-xl bg-[#EDE8F5] hover:bg-[#ADBBDA]/30 border border-[#ADBBDA] text-[#3D52A0] transition-colors relative"
                title="Automated Health Reminders"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#7091E6]"></span>
              </button>

              {/* User Snapshot & Logout */}
              <div className="flex items-center gap-2 pl-2 border-l border-[#ADBBDA]">
                <div className="w-8 h-8 rounded-full bg-[#7091E6] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-[#3D52A0] leading-tight truncate max-w-[120px]">
                    {user.full_name}
                  </div>
                  <div className="text-[10px] text-[#8697C4] leading-tight truncate max-w-[120px]">
                    {user.email}
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 ml-1 text-[#8697C4] hover:text-[#3D52A0] hover:bg-[#EDE8F5] rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-4 py-2 text-sm font-bold text-[#3D52A0] hover:text-[#7091E6] transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-5 py-2.5 text-sm font-bold rounded-xl text-white bg-[#7091E6] hover:bg-[#3D52A0] shadow-md hover:shadow-lg transition-all duration-200"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
