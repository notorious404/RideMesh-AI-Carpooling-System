import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider, isFirebaseConfigured } from '../firebase/config';

// Key for local storage fallback user
const MOCK_USER_KEY = 'smartcarpool_mock_user';

/**
 * Register a new user with Email and Password
 */
export async function registerUser(email, password, fullName, phone = '') {
  if (isFirebaseConfigured && auth && db) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userProfile = {
        uid: user.uid,
        name: fullName,
        email: email,
        phone: phone,
        rolePreference: 'passenger', // default, can switch anytime
        rating: 4.9,
        totalRides: 0,
        completedRides: 0,
        createdAt: new Date().toISOString(),
        profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);
      return { user, profile: userProfile };
    } catch (error) {
      throw new Error(formatAuthError(error.code || error.message));
    }
  }

  // Fallback local registration
  const mockUser = {
    uid: 'mock_user_' + Date.now(),
    name: fullName,
    email: email,
    phone: phone,
    rolePreference: 'passenger',
    rating: 5.0,
    totalRides: 0,
    completedRides: 0,
    createdAt: new Date().toISOString(),
    profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`
  };
  localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
  return { user: { uid: mockUser.uid, email: mockUser.email }, profile: mockUser };
}

/**
 * Log in an existing user
 */
export async function loginUser(email, password) {
  if (isFirebaseConfigured && auth && db) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const profile = await getUserProfile(user.uid);
      return { user, profile };
    } catch (error) {
      throw new Error(formatAuthError(error.code || error.message));
    }
  }

  // Fallback local login
  const storedUser = localStorage.getItem(MOCK_USER_KEY);
  let mockUser = storedUser ? JSON.parse(storedUser) : null;
  
  if (!mockUser || mockUser.email !== email) {
    // Generate standard demo user profile for testing
    mockUser = {
      uid: 'demo_user_101',
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email: email,
      phone: '+91 98765 43210',
      rolePreference: 'passenger',
      rating: 4.8,
      totalRides: 5,
      completedRides: 4,
      createdAt: new Date().toISOString(),
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
    };
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
  }
  return { user: { uid: mockUser.uid, email: mockUser.email }, profile: mockUser };
}

/**
 * Log in with Google Provider
 */
export async function loginWithGoogle() {
  if (isFirebaseConfigured && auth && db) {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      let profile = await getUserProfile(user.uid);

      if (!profile) {
        profile = {
          uid: user.uid,
          name: user.displayName || 'Smart User',
          email: user.email,
          phone: user.phoneNumber || '',
          rolePreference: 'passenger',
          rating: 5.0,
          totalRides: 0,
          completedRides: 0,
          createdAt: new Date().toISOString(),
          profileImage: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.displayName || 'User')}`
        };
        await setDoc(doc(db, 'users', user.uid), profile);
      }
      return { user, profile };
    } catch (error) {
      throw new Error(formatAuthError(error.code || error.message));
    }
  }

  // Fallback demo Google login
  const googleUser = {
    uid: 'google_demo_' + Date.now(),
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98123 45678',
    rolePreference: 'driver',
    rating: 4.9,
    totalRides: 12,
    completedRides: 11,
    createdAt: new Date().toISOString(),
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'
  };
  localStorage.setItem(MOCK_USER_KEY, JSON.stringify(googleUser));
  return { user: { uid: googleUser.uid, email: googleUser.email }, profile: googleUser };
}

/**
 * Log out user
 */
export async function logoutUser() {
  if (isFirebaseConfigured && auth) {
    await signOut(auth);
  }
  localStorage.removeItem(MOCK_USER_KEY);
}

/**
 * Send password reset email
 */
export async function resetPassword(email) {
  if (isFirebaseConfigured && auth) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw new Error(formatAuthError(error.code || error.message));
    }
  }
}

/**
 * Fetch profile from Firestore by user UID
 */
export async function getUserProfile(uid) {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
    } catch (err) {
      console.warn("Could not fetch user profile from Firestore:", err);
    }
  }

  const storedUser = localStorage.getItem(MOCK_USER_KEY);
  return storedUser ? JSON.parse(storedUser) : null;
}

/**
 * Update user profile in Firestore
 */
export async function updateUserProfile(uid, updatedData) {
  if (isFirebaseConfigured && db) {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, updatedData);
  }
  
  const storedUser = localStorage.getItem(MOCK_USER_KEY);
  if (storedUser) {
    const userObj = JSON.parse(storedUser);
    const updatedUser = { ...userObj, ...updatedData };
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  }
}

/**
 * User-friendly Firebase auth error message translator
 */
function formatAuthError(code) {
  switch (code) {
    case 'auth/invalid-email':
      return 'The email address format is invalid.';
    case 'auth/user-disabled':
      return 'This user account has been disabled.';
    case 'auth/user-not-found':
      return 'No user account found with this email.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect password or credentials. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    default:
      return code || 'Authentication failed. Please check your network and credentials.';
  }
}
