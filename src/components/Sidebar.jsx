import React from 'react';
import {
  Home,
  Users,
  BarChart2,
  Stethoscope,
  MapPin,
  Clock,
  LogOut,
  Activity,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  user,
  activePatient,
  onLogout
}) {
  const menuItems = [
    { id: 'overview', label: 'Home / Main Overview', icon: Home },
    { id: 'patients', label: 'Patient & Family Records', icon: Users },
    { id: 'reports', label: 'Health Reports & Analytics', icon: BarChart2 },
    { id: 'questions', label: 'Doctor Consultation Questions', icon: Stethoscope },
    { id: 'specialists', label: 'Local Specialist Directory', icon: MapPin },
    { id: 'reminders', label: 'Health Reminders & Email Preferences', icon: Clock },
  ];

  return (
    <aside className="w-72 bg-[#EDE8F5] border-r border-[#ADBBDA] min-h-[calc(100vh-4.5rem)] flex flex-col justify-between shrink-0 select-none">
      {/* Top Header & Navigation */}
      <div className="p-4 space-y-6">
        {/* User Profile Badge Banner */}
        <div className="bg-[#FFFFFF] border border-[#ADBBDA] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#3D52A0] to-[#7091E6] text-white flex items-center justify-center font-extrabold text-base shadow-sm">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'M'}
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-[#3D52A0] truncate block">
                  {user?.full_name || 'Valued User'}
                </span>
                <ShieldCheck className="w-3.5 h-3.5 text-[#7091E6] shrink-0" />
              </div>
              <span className="text-[11px] text-[#8697C4] block truncate">
                {user?.email || 'user@mediscope.health'}
              </span>
            </div>
          </div>

          {activePatient && (
            <div className="mt-3 pt-2.5 border-t border-[#EDE8F5] flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-[#8697C4] tracking-wider">
                Current Subject
              </span>
              <span className="text-xs font-extrabold text-[#7091E6] px-2 py-0.5 rounded-full bg-[#EDE8F5]">
                {activePatient.full_name} ({activePatient.relationship})
              </span>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5">
          <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-[#8697C4]">
            Clinical Workspace
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#7091E6] text-[#FFFFFF] shadow-sm shadow-[#7091E6]/30 translate-x-1'
                    : 'text-[#3D52A0] hover:bg-[#FFFFFF]/70 hover:text-[#3D52A0]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#8697C4]'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-white shrink-0" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Bar: User Profile Snapshot & Logout */}
      <div className="p-4 border-t border-[#ADBBDA] bg-[#EDE8F5]/50">
        <div className="bg-[#FFFFFF] border border-[#ADBBDA] rounded-xl p-3 shadow-xs space-y-2">
          <div className="text-[11px] font-semibold text-[#8697C4]">Session Active</div>
          <div className="text-xs font-bold text-[#3D52A0] truncate">
            {user?.email}
          </div>
          <button
            onClick={onLogout}
            className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#EDE8F5] hover:bg-rose-50 border border-[#ADBBDA] hover:border-rose-300 text-xs font-bold text-[#3D52A0] hover:text-rose-600 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out / Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
