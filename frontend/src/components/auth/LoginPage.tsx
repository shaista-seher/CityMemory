import React, { useState, useEffect, useRef } from 'react';
import {
  Layers,
  ShieldCheck,
  User,
  ArrowRight,
  Sun,
  Moon,
  ChevronLeft,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const {
    theme,
    toggleTheme,
    loginWithOtp
  } = useApp();

  // Active login role
  const [role, setRole] = useState<UserRole>('citizen');

  // Input fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [employeeId, setEmployeeId] = useState('BBMP-ENG-8421');
  const [selectedWard, setSelectedWard] = useState('Ward 12 (Indiranagar)');
  const [department, setDepartment] = useState('Road & Stormwater Infrastructure Cell');

  // OTP State
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState<string>('4826');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [showSmsBanner, setShowSmsBanner] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // OTP inputs ref
  const otpInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  // Resend Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Focus first OTP field when entering OTP step
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => {
        otpInputRefs[0]?.current?.focus();
      }, 100);
    }
  }, [step]);

  // Request OTP Handler
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter your full name');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 8) {
      alert('Please enter a valid phone number');
      return;
    }

    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(randomCode);
    setOtp(['', '', '', '']);
    setOtpError(null);
    setResendTimer(30);
    setCanResend(false);
    setStep('otp');
    setShowSmsBanner(true);
  };

  // Quick Demo Logins
  const handleDemoFill = (targetRole: UserRole) => {
    if (targetRole === 'citizen') {
      setRole('citizen');
      setName('Priya Sharma');
      setPhone('98450 12345');
      setSelectedWard('Ward 12 (Indiranagar)');
      const code = '4826';
      setGeneratedOtp(code);
      setOtp(['4', '8', '2', '6']);
      setOtpError(null);
      setStep('otp');
      setShowSmsBanner(true);
    } else {
      setRole('officer');
      setName('Dr. Rajesh Kumar');
      setPhone('98440 98765');
      setEmployeeId('BBMP-SE-4491');
      setSelectedWard('Ward 12 (Indiranagar)');
      setDepartment('Stormwater & Flood Mitigation Cell');
      const code = '9142';
      setGeneratedOtp(code);
      setOtp(['9', '1', '4', '2']);
      setOtpError(null);
      setStep('otp');
      setShowSmsBanner(true);
    }
  };

  // Handle OTP digit entry
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError(null);

    if (value && index < 3) {
      otpInputRefs[index + 1]?.current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs[index - 1]?.current?.focus();
    }
  };

  // Verify OTP & Complete Login
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = otp.join('');

    if (enteredCode.length < 4) {
      setOtpError('Please enter all 4 digits');
      return;
    }

    if (enteredCode !== generatedOtp) {
      setOtpError(`Invalid code. Expected ${generatedOtp}`);
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      loginWithOtp(role, {
        name: name.trim(),
        phone: phone.trim(),
        ward: selectedWard,
        department: role === 'officer' ? department : undefined,
        employeeId: role === 'officer' ? employeeId : undefined
      });
      setIsVerifying(false);
    }, 400);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-slate-50 text-slate-900 dark:bg-[#0B1220] dark:text-slate-100 transition-colors">
      {/* Top Header Bar */}
      <header className="w-full max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <Layers className="w-4 h-4" />
          </div>
          <span className="text-base font-bold text-[#142B4A] dark:text-white tracking-tight">
            CityMemory
          </span>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </header>

      {/* Main Centered Login Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Simulated SMS Alert Banner */}
          {showSmsBanner && step === 'otp' && (
            <div className="mb-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl p-3.5 text-xs text-emerald-900 dark:text-emerald-200 shadow-sm animate-in fade-in duration-200">
              <div className="flex items-center justify-between font-semibold">
                <span>Verification Code</span>
                <button
                  type="button"
                  onClick={() => setShowSmsBanner(false)}
                  className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span>OTP: <strong className="font-mono text-sm tracking-wider text-emerald-700 dark:text-emerald-300">{generatedOtp}</strong></span>
                <button
                  type="button"
                  onClick={() => {
                    setOtp(generatedOtp.split(''));
                    setOtpError(null);
                  }}
                  className="text-[11px] font-bold underline cursor-pointer text-emerald-700 dark:text-emerald-300"
                >
                  Auto-fill
                </button>
              </div>
            </div>
          )}

          {/* Authentication Card */}
          <div className="bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#263449] rounded-2xl shadow-xl overflow-hidden">
            {/* Role Switcher */}
            <div className="grid grid-cols-2 p-1.5 bg-slate-100 dark:bg-[#17243A] border-b border-slate-200 dark:border-[#263449]">
              <button
                type="button"
                onClick={() => {
                  setRole('citizen');
                  if (step === 'otp') setStep('input');
                }}
                className={`py-2 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  role === 'citizen'
                    ? 'bg-white dark:bg-[#111C2E] text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Citizen</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRole('officer');
                  if (step === 'otp') setStep('input');
                }}
                className={`py-2 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  role === 'officer'
                    ? 'bg-white dark:bg-[#111C2E] text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Municipal Officer</span>
              </button>
            </div>

            <div className="p-6 sm:p-7 space-y-5">
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  {role === 'citizen' ? 'Citizen Sign In' : 'Municipal Officer Sign In'}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {step === 'input'
                    ? 'Enter your details to receive a verification code.'
                    : `Enter the 4-digit code sent to ${phone}.`}
                </p>
              </div>

              {step === 'input' ? (
                <form onSubmit={handleRequestOtp} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="e.g. 98450 12345"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {role === 'officer' && (
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Employee ID
                      </label>
                      <input
                        type="text"
                        required
                        value={employeeId}
                        onChange={e => setEmployeeId(e.target.value)}
                        placeholder="e.g. BBMP-ENG-8421"
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {role === 'citizen' ? 'Residential Ward' : 'Assigned Jurisdiction'}
                    </label>
                    <select
                      value={selectedWard}
                      onChange={e => setSelectedWard(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="Ward 12 (Indiranagar)">Ward 12 (Indiranagar)</option>
                      <option value="Ward 13 (Domlur)">Ward 13 (Domlur)</option>
                      <option value="Ward 15 (Koramangala)">Ward 15 (Koramangala)</option>
                      <option value="Ward 08 (Malleshwaram)">Ward 08 (Malleshwaram)</option>
                      <option value="Ward 04 (Hebbal)">Ward 04 (Hebbal)</option>
                      <option value="Ward 20 (KR Puram)">Ward 20 (KR Puram)</option>
                      <option value="Ward 22 (Whitefield)">Ward 22 (Whitefield)</option>
                      <option value="Ward 31 (Jayanagar)">Ward 31 (Jayanagar)</option>
                    </select>
                  </div>

                  {role === 'officer' && (
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Department
                      </label>
                      <select
                        value={department}
                        onChange={e => setDepartment(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="Road Maintenance Department">Road Maintenance Department</option>
                        <option value="Stormwater & Drain Cell">Stormwater &amp; Drain Cell</option>
                        <option value="BWSSB Water Supply Division">BWSSB Water Supply Division</option>
                        <option value="Electrical & Lighting Wing">Electrical &amp; Lighting Wing</option>
                        <option value="Solid Waste Management">Solid Waste Management</option>
                      </select>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer text-xs mt-2"
                  >
                    Send Verification Code
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-5 text-xs">
                  <div className="space-y-2">
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 text-center">
                      Enter 4-Digit OTP
                    </label>
                    <div className="flex justify-center gap-2.5">
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={otpInputRefs[idx]}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={e => handleOtpChange(idx, e.target.value)}
                          onKeyDown={e => handleKeyDown(idx, e)}
                          className="w-12 h-12 text-center text-xl font-bold font-mono bg-slate-50 dark:bg-[#17243A] border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                        />
                      ))}
                    </div>

                    {otpError && (
                      <p className="text-center text-rose-600 dark:text-rose-400 text-xs font-medium">
                        {otpError}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <button
                      type="button"
                      onClick={() => setStep('input')}
                      className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Edit details</span>
                    </button>

                    {canResend ? (
                      <button
                        type="button"
                        onClick={() => {
                          const newCode = Math.floor(1000 + Math.random() * 9000).toString();
                          setGeneratedOtp(newCode);
                          setResendTimer(30);
                          setCanResend(false);
                          setShowSmsBanner(true);
                        }}
                        className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                      >
                        Resend Code
                      </button>
                    ) : (
                      <span className="font-mono text-slate-400">Resend in {resendTimer}s</span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer text-xs"
                  >
                    {isVerifying ? 'Verifying...' : 'Sign In'}
                  </button>
                </form>
              )}

              {/* Fast Demo Logins */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-xs">
                <span className="text-slate-400">Quick Demo:</span>
                <button
                  type="button"
                  onClick={() => handleDemoFill('citizen')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  Citizen
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoFill('officer')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  Municipal Officer
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto px-6 py-4 text-center text-xs text-slate-400">
        CityMemory Civic Infrastructure Platform
      </footer>
    </div>
  );
};
