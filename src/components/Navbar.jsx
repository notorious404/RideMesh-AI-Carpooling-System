import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  Car, 
  Search, 
  PlusCircle, 
  Clock, 
  LogOut, 
  Menu,
  X,
  User
} from 'lucide-react';

export default function Navbar() {
  const { currentUser, userProfile, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    addToast("Logged out successfully.", "info");
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand */}
          <Link to={currentUser ? "/dashboard" : "/"} className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-emerald-400 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform duration-200">
              <Car className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                SmartCarpool
              </span>
              <span className="text-[10px] font-semibold text-emerald-400 tracking-wider uppercase">
                Real-Time Ride Sharing
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {currentUser ? (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive('/dashboard') 
                      ? 'bg-slate-800 text-brand-400' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/find-ride"
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                    isActive('/find-ride') 
                      ? 'bg-slate-800 text-brand-400' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span>Find Ride</span>
                </Link>
                <Link
                  to="/create-ride"
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                    isActive('/create-ride') 
                      ? 'bg-slate-800 text-brand-400' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-brand-400" />
                  <span>Offer Ride</span>
                </Link>
                <Link
                  to="/my-rides"
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                    isActive('/my-rides') 
                      ? 'bg-slate-800 text-brand-400' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>My Rides</span>
                </Link>
              </>
            ) : (
              <>
                <a href="#how-it-works" className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  How It Works
                </a>
                <a href="#why-us" className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Why Us
                </a>
                <a href="#tracking" className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Live Tracking
                </a>
              </>
            )}
          </nav>

          {/* Right Action Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 hover:bg-slate-700/80 transition-all btn-interaction"
                >
                  <img
                    src={userProfile?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile?.name || 'User'}`}
                    alt="Profile"
                    className="w-7 h-7 rounded-full object-cover border border-brand-500"
                  />
                  <span className="text-xs font-bold text-slate-200">
                    {userProfile?.name?.split(' ')[0] || 'Profile'}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-bold text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4.5 py-2.5 rounded-xl text-xs font-extrabold bg-brand-500 hover:bg-brand-600 text-slate-950 shadow-glow btn-interaction uppercase tracking-wider"
                >
                  Get Started Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu icon */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:bg-slate-800 focus:outline-none"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-5 space-y-2 animate-slide-up">
          {currentUser ? (
            <>
              <div className="flex items-center space-x-3 pb-3 mb-2 border-b border-slate-800">
                <img
                  src={userProfile?.profileImage || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border border-brand-500"
                />
                <div>
                  <p className="font-bold text-white text-sm">{userProfile?.name || 'User'}</p>
                  <p className="text-xs text-slate-400">{userProfile?.email}</p>
                </div>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800"
              >
                Dashboard
              </Link>
              <Link
                to="/find-ride"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800"
              >
                Find Ride
              </Link>
              <Link
                to="/create-ride"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800"
              >
                Offer a Ride
              </Link>
              <Link
                to="/my-rides"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800"
              >
                My Rides
              </Link>
              <Link
                to="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800"
              >
                Profile Settings
              </Link>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-slate-800 flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <div className="space-y-2 pt-1">
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center px-4 py-3 rounded-xl text-slate-200 hover:bg-slate-800 font-bold text-sm"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center px-4 py-3 rounded-xl bg-brand-500 text-slate-950 font-extrabold text-sm"
              >
                Sign Up Free
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
