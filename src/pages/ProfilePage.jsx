import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import MobileBottomNav from '../components/MobileBottomNav';
import Footer from '../components/Footer';
import { 
  User, 
  Mail, 
  Phone, 
  Star, 
  Save, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function ProfilePage() {
  const { userProfile, updateProfileData } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState(userProfile?.name || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfileData({ name, phone });
      addToast("Profile information updated successfully!", "success");
    } catch (err) {
      addToast("Failed to update profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow animate-fade-in">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Profile Settings</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage your account information and commuter statistics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Profile Card */}
          <div className="md:col-span-5 bg-white rounded-container p-6 border border-slate-200/80 shadow-soft text-center space-y-4">
            
            <div className="relative w-24 h-24 mx-auto">
              <img
                src={userProfile?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile?.name || 'User'}`}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md mx-auto"
              />
              <div className="absolute bottom-0 right-0 p-1.5 bg-brand-500 rounded-full text-slate-950 shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-slate-900">{userProfile?.name || 'Commuter'}</h2>
              <p className="text-xs text-slate-400 font-medium">{userProfile?.email}</p>
            </div>

            {/* Metric Statistics Cards */}
            <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-slate-100 text-center">
              <div className="p-3 bg-slate-50 rounded-2xl">
                <p className="text-lg font-extrabold text-slate-900">{userProfile?.totalRides || 18}</p>
                <p className="text-[10px] text-slate-400 uppercase font-extrabold mt-0.5">Rides</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl">
                <div className="flex items-center justify-center text-amber-400 mb-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 mr-0.5" />
                  <span className="text-sm font-extrabold text-slate-900">{userProfile?.rating || 4.9}</span>
                </div>
                <p className="text-[10px] text-slate-400 uppercase font-extrabold">Rating</p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                <p className="text-lg font-extrabold text-emerald-700">96%</p>
                <p className="text-[10px] text-emerald-600 uppercase font-extrabold mt-0.5">Completion</p>
              </div>
            </div>

          </div>

          {/* Edit Form */}
          <div className="md:col-span-7 bg-white rounded-container p-6 sm:p-8 border border-slate-200/80 shadow-soft">
            
            <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3 mb-6">
              Account Credentials
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-control text-slate-900 text-sm focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Email Address (Read Only)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    disabled
                    value={userProfile?.email || ''}
                    className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-control text-slate-500 text-sm cursor-not-allowed font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-control text-slate-900 text-sm focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3.5 rounded-control bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-md btn-interaction flex items-center justify-center space-x-2 mt-4"
              >
                <Save className="w-4 h-4 text-brand-400" />
                <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
              </button>
            </form>

          </div>

        </div>

      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
