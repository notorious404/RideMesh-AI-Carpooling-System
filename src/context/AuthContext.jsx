import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase/config';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getUserProfile, 
  updateUserProfile,
  loginWithGoogle
} from '../services/authService';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;

    if (isFirebaseConfigured && auth) {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          setCurrentUser(user);
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile || {
            uid: user.uid,
            name: user.displayName || 'User',
            email: user.email,
            phone: '',
            rolePreference: 'passenger',
            rating: 4.9,
            totalRides: 0,
            completedRides: 0,
            profileImage: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
          });
        } else {
          setCurrentUser(null);
          setUserProfile(null);
        }
        setLoading(false);
      });
    } else {
      // Local demo auth session check
      const stored = localStorage.getItem('smartcarpool_mock_user');
      if (stored) {
        const profile = JSON.parse(stored);
        setCurrentUser({ uid: profile.uid, email: profile.email, displayName: profile.name });
        setUserProfile(profile);
      }
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const signup = async (email, password, fullName, phone) => {
    setLoading(true);
    try {
      const res = await registerUser(email, password, fullName, phone);
      setCurrentUser(res.user);
      setUserProfile(res.profile);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await loginUser(email, password);
      setCurrentUser(res.user);
      setUserProfile(res.profile);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    setLoading(true);
    try {
      const res = await loginWithGoogle();
      setCurrentUser(res.user);
      setUserProfile(res.profile);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setUserProfile(null);
  };

  const updateProfileData = async (updatedFields) => {
    if (!currentUser) return;
    const updated = await updateUserProfile(currentUser.uid, updatedFields);
    setUserProfile(prev => ({ ...prev, ...updatedFields }));
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    googleLogin,
    logout,
    updateProfileData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
