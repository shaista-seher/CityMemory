import React, { useState } from 'react';
import { X, User, ShieldCheck, ArrowRight, CheckCircle2, Building, MapPin, Phone, Mail, Lock, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DEMO_CITIZEN_USERS, DEMO_OFFICER_USERS } from '../../data/mockData';
import { UserRole } from '../../types';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    currentUserRole,
    loginAsCitizen,
    loginAsOfficer,
    currentCitizen,
    currentOfficer,
    logout
  } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUserRole);
  const [activeTab, setActiveTab] = useState<'demo' | 'custom'>('demo');

  // Custom Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [ward, setWard] = useState('Ward 12 (Indiranagar)');
  const [residentialArea, setResidentialArea] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [department, setDepartment] = useState('Road & Stormwater Infrastructure Cell');

  if (!isAuthModalOpen) return null;

  const handleCustomCitizenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsCitizen({
      id: `CIT-${Date.now().toString().slice(-4)}`,
      name: name || 'Citizen User',
      email: email || 'citizen@bengaluru.in',
      phone: phone || '+91 98450 00000',
      residentialArea: residentialArea || 'Indiranagar Central',
      ward: ward,
      municipality: 'BBMP Bengaluru'
    });
  };

  const handleCustomOfficerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsOfficer({
      id: `OFF-${Date.now().toString().slice(-4)}`,
      name: name || 'Municipal Officer',
      employeeId: employeeId || 'BBMP-OFF-99',
      department: department,
      designation: 'Assistant Executive Engineer',
      municipality: 'BBMP Bengaluru',
      assignedWards: [ward]
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={() => setIsAuthModalOpen(false)}
    >
      <div
        className="bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden text-xs"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#17243A]/50">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              CityMemory Role Access
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
              Select your role to access either the Citizen Portal or Municipal Officer Command.
            </p>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Segmented Controls */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-[#17243A] rounded-xl">
            <button
              type="button"
              onClick={() => setSelectedRole('citizen')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                selectedRole === 'citizen'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Citizen Portal</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('officer')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                selectedRole === 'officer'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Municipal Officer</span>
            </button>
          </div>

          {/* Quick Demo Accounts Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <span>Fast 1-Click Demo Profiles</span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">Instant Switch</span>
            </div>

            {selectedRole === 'citizen' ? (
              <div className="space-y-2">
                {DEMO_CITIZEN_USERS.map(user => {
                  const isCurrent = currentCitizen.id === user.id && currentUserRole === 'citizen';
                  return (
                    <div
                      key={user.id}
                      onClick={() => loginAsCitizen(user)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                        isCurrent
                          ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 dark:border-blue-500'
                          : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#17243A] hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{user.name}</span>
                            {isCurrent && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-semibold">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {user.ward} · {user.residentialArea}
                          </div>
                        </div>
                      </div>

                      <button className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shrink-0">
                        Log In →
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                {DEMO_OFFICER_USERS.map(officer => {
                  const isCurrent = currentOfficer.id === officer.id && currentUserRole === 'officer';
                  return (
                    <div
                      key={officer.id}
                      onClick={() => loginAsOfficer(officer)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                        isCurrent
                          ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 dark:border-blue-500'
                          : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#17243A] hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs">
                          {officer.name.split(' ').slice(1).map(n => n[0]).join('') || 'KR'}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{officer.name}</span>
                            <span className="text-[10px] font-mono text-slate-400">({officer.employeeId})</span>
                            {isCurrent && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-semibold">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {officer.department} · Jurisdictions: <strong className="text-slate-700 dark:text-slate-300">{officer.assignedWards.join(', ')}</strong>
                          </div>
                        </div>
                      </div>

                      <button className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shrink-0">
                        Access Command →
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-center">
            <span className="text-[11px] text-slate-500 text-left">
              {selectedRole === 'citizen'
                ? 'Citizens can report civic issues and track resolutions in their ward.'
                : 'Officers only receive complaints belonging to their assigned geographical jurisdiction.'}
            </span>

            <button
              type="button"
              onClick={() => {
                setIsAuthModalOpen(false);
                logout();
              }}
              className="px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-semibold text-[11px] hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out to Login Screen</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
