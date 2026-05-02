import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePassword } from '../services/api';
import { User, Shield, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function AdminSettings() {
  const { admin, refreshAdmin } = useAuth();
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (admin) setProfile({ name: admin.name || '', email: admin.email || '' });
  }, [admin]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true); setProfileMsg(null);
    try {
      const res = await updateProfile(profile);
      refreshAdmin(res.admin);
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setProfileSaving(false);
      setTimeout(() => setProfileMsg(null), 4000);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.next !== passwords.confirm) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' }); return;
    }
    if (passwords.next.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters.' }); return;
    }
    setPasswordSaving(true); setPasswordMsg(null);
    try {
      await changePassword(passwords.current, passwords.next);
      setPasswords({ current: '', next: '', confirm: '' });
      setPasswordMsg({ type: 'success', text: 'Password updated!' });
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err.message || 'Failed to update password.' });
    } finally {
      setPasswordSaving(false);
      setTimeout(() => setPasswordMsg(null), 4000);
    }
  };

  const getStrength = (pw: string) => {
    if (!pw) return null;
    let s = 0;
    if (pw.length >= 8) s++;
    if (pw.length >= 12) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    const levels = [
      { label: 'Weak', color: 'bg-red-500', w: '20%' },
      { label: 'Weak', color: 'bg-red-500', w: '20%' },
      { label: 'Fair', color: 'bg-yellow-500', w: '45%' },
      { label: 'Good', color: 'bg-yellow-400', w: '65%' },
      { label: 'Strong', color: 'bg-green-500', w: '85%' },
      { label: 'Very Strong', color: 'bg-green-400', w: '100%' },
    ];
    return levels[s];
  };

  const strength = getStrength(passwords.next);
  const card = 'glass rounded-2xl p-6 border border-white/8';
  const input = 'w-full px-4 py-3 rounded-xl text-sm input-dark';
  const lbl = 'block text-xs text-gray-400 uppercase tracking-wider mb-1.5';

  const Alert = ({ type, text }: { type: 'success' | 'error'; text: string }) => (
    <div className={`mb-5 flex items-center gap-3 p-4 rounded-xl border
      ${type === 'success' ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
      {type === 'success' ? <CheckCircle2 size={15} className="text-green-400 flex-shrink-0" /> : <AlertCircle size={15} className="text-red-400 flex-shrink-0" />}
      <p className={`text-sm ${type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{text}</p>
    </div>
  );

  const PasswordField = ({ field, placeholder, showKey }: { field: 'current' | 'next' | 'confirm'; placeholder: string; showKey: 'current' | 'next' | 'confirm' }) => (
    <div className="relative">
      <input type={show[showKey] ? 'text' : 'password'} value={passwords[field]}
        onChange={e => setPasswords(p => ({ ...p, [field]: e.target.value }))}
        placeholder={placeholder} required
        className={`${input} pr-11`} />
      <button type="button" onClick={() => setShow(s => ({ ...s, [showKey]: !s[showKey] }))}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
        {show[showKey] ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  );

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h2 className="font-display text-2xl font-black text-white">Settings</h2>
        <p className="text-sm text-gray-400 mt-1">Manage your dealer account credentials</p>
      </div>

      {/* Profile */}
      <div className={card}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-xl bg-brand-500/15 flex items-center justify-center text-brand-400">
            <User size={15} />
          </div>
          <h3 className="font-display font-bold text-white">Edit Profile</h3>
        </div>
        {profileMsg && <Alert type={profileMsg.type} text={profileMsg.text} />}
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className={lbl}>Full Name</label>
            <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
              placeholder="Your name" required className={input} />
          </div>
          <div>
            <label className={lbl}>Email Address</label>
            <input type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
              placeholder="admin@autoelite.com" required className={input} />
            <p className="text-xs text-gray-600 mt-1">Changing email updates your login credentials.</p>
          </div>
          <div>
            <label className={lbl}>Role</label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-brand-500/20 bg-brand-500/5">
              <span className="text-xs bg-brand-500/20 text-brand-400 px-2 py-0.5 rounded-full capitalize">{admin?.role}</span>
              <span className="text-xs text-gray-500">Role cannot be changed here</span>
            </div>
          </div>
          <button type="submit" disabled={profileSaving}
            className="btn-brand w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60">
            {profileSaving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : 'Save Profile Changes'}
          </button>
        </form>
      </div>

      {/* Password */}
      <div className={card}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-xl bg-brand-500/15 flex items-center justify-center text-brand-400">
            <Shield size={15} />
          </div>
          <h3 className="font-display font-bold text-white">Change Password</h3>
        </div>
        {passwordMsg && <Alert type={passwordMsg.type} text={passwordMsg.text} />}
        <form onSubmit={handlePasswordSave} className="space-y-4">
          <div>
            <label className={lbl}>Current Password</label>
            <PasswordField field="current" placeholder="Current password" showKey="current" />
          </div>
          <div>
            <label className={lbl}>New Password</label>
            <PasswordField field="next" placeholder="New password" showKey="next" />
            {passwords.next && strength && (
              <div className="mt-2">
                <div className="h-1.5 w-full rounded-full bg-white/10">
                  <div className={`h-full rounded-full transition-all ${strength.color}`} style={{ width: strength.w }} />
                </div>
                <p className="text-xs text-gray-500 mt-1">Strength: <span className="font-medium">{strength.label}</span></p>
              </div>
            )}
          </div>
          <div>
            <label className={lbl}>Confirm New Password</label>
            <PasswordField field="confirm" placeholder="Confirm password" showKey="confirm" />
            {passwords.confirm && (
              <p className={`text-xs mt-1 flex items-center gap-1 ${passwords.next === passwords.confirm ? 'text-green-400' : 'text-red-400'}`}>
                {passwords.next === passwords.confirm ? <><CheckCircle2 size={11} /> Match</> : <><AlertCircle size={11} /> No match</>}
              </p>
            )}
          </div>
          <button type="submit" disabled={passwordSaving}
            className="btn-brand w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60">
            {passwordSaving ? <><Loader2 size={14} className="animate-spin" /> Updating...</> : 'Update Password'}
          </button>
        </form>
      </div>

      <div className="p-4 rounded-xl border border-brand-500/15 bg-brand-500/5">
        <p className="text-xs text-gray-400">🔒 Use a strong password. Never share your credentials. Change it every 3–6 months.</p>
      </div>
    </div>
  );
}
