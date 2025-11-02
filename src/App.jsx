import React, { useState, useEffect, useContext, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, updateDoc, query, where, deleteDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { BeatLoader } from 'react-spinners';

// --- 1. FIREBASE CONFIGURATION & INITIALIZATION ---
// IMPORTANT: REPLACE THE PLACEHOLDER VALUES WITH YOUR ACTUAL FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_CONFIG_API_KEY",
  authDomain: "YOUR_FIREBASE_CONFIG_AUTH_DOMAIN",
  projectId: "YOUR_FIREBASE_CONFIG_PROJECT_ID",
  storageBucket: "YOUR_FIREBASE_CONFIG_STORAGE_BUCKET",
  messagingSenderId: "YOUR_FIREBASE_CONFIG_MESSAGING_SENDER_ID",
  appId: "YOUR_FIREBASE_CONFIG_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// --- 2. CONTEXT FOR USER AUTHENTICATION & GLOBAL STATE ---
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check if user is an admin
        const adminDoc = await getDoc(doc(db, "admins", currentUser.uid));
        setIsAdmin(adminDoc.exists());
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const signup = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to use Auth Context
const useAuth = () => useContext(AuthContext);


// --- 3. STYLES (Mobile-First, Dark Neumorphic/Sleek) ---
// All styles are in a single object for easy copy/paste into App.jsx
const styles = {
  // Global/Container Styles
  appContainer: {
    minHeight: '100vh',
    background: '#0a0a0a', // Deep black background
    color: '#e0e0e0',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    padding: '20px',
    boxSizing: 'border-box',
  },
  
  // Login Page Styles (Neumorphic Dark)
  loginContainer: {
    maxWidth: '400px',
    margin: '60px auto 20px auto',
    padding: '30px',
    borderRadius: '25px',
    background: '#0a0a0a',
    boxShadow: '8px 8px 16px #050505, -8px -8px 16px #0f0f0f',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  loginHeader: {
    fontSize: '40px',
    fontWeight: 900,
    color: '#e0e0e0',
    margin: '20px 0 10px 0',
    textShadow: '0 0 10px rgba(160, 32, 240, 0.5)', // Subtle purple glow
  },
  loginSubText: {
    color: '#aaa',
    marginBottom: '40px',
  },
  inputGroup: {
    width: '100%',
    marginBottom: '20px',
    textAlign: 'left',
  },
  inputLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#8a8a8a',
    marginBottom: '8px',
    display: 'block',
  },
  inputField: {
    width: '100%',
    padding: '15px 20px',
    borderRadius: '15px',
    border: 'none',
    background: '#0a0a0a',
    color: '#e0e0e0',
    boxShadow: 'inset 4px 4px 8px #050505, inset -4px -4px 8px #0f0f0f',
    boxSizing: 'border-box',
    fontSize: '16px',
    outline: 'none',
  },
  // Primary Button (Purple/Magenta Accent)
  primaryButton: {
    width: '100%',
    padding: '15px 20px',
    borderRadius: '15px',
    border: 'none',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    background: 'linear-gradient(145deg, #a020f0, #c71585)', // Purple/Magenta Gradient
    color: '#ffffff',
    boxShadow: '6px 6px 12px #050505, -6px -6px 12px #0f0f0f',
    transition: 'all 0.3s ease',
    marginTop: '10px',
  },
  primaryButtonHover: {
    transform: 'scale(1.02)',
    boxShadow: '4px 4px 8px #050505, -4px -4px 8px #0f0f0f',
    opacity: 0.9,
  },
  // Text Link Button (Sign Up/Switch)
  textLink: {
    marginTop: '25px',
    color: '#a020f0', // Purple Accent
    cursor: 'pointer',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '600',
  },
  errorText: {
    color: '#ff6b6b',
    marginTop: '10px',
    fontSize: '14px',
  },
  // Placeholder for the map image (since we can't use dynamic background images easily in this format)
  mapPlaceholder: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%\' height=\'100%\' viewBox=\'0 0 100 100\' preserveAspectRatio=\'none\'><rect width=\'100\' height=\'100\' fill=\'%23000000\'/><path d=\'M 0 50 C 30 30, 70 70, 100 50 L 100 0 L 0 0 Z\' fill=\'%231a1a1a\' opacity=\'0.2\'/><circle cx=\'20\' cy=\'25\' r=\'1\' fill=\'%23a020f0\'/><circle cx=\'80\' cy=\'15\' r=\'1\' fill=\'%23c71585\'/></svg>")',
    backgroundSize: 'cover',
    opacity: 0.2,
    zIndex: 1,
  },
  // Main Content Styles
  mainContent: {
    zIndex: 2,
    position: 'relative',
    width: '100%',
    padding: '20px 0',
  },
};

// --- 4. LOGIN / SIGNUP COMPONENT (Based on 1000369452.jpg) ---
const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [matricNumber, setMatricNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isHovering, setIsHovering] = useState(false); // For Neumorphic hover effect
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simple validation
    if (!email || !password || (!isLogin && !matricNumber)) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    // Naotems specific validation: using matric number in the user's name/profile for identification
    const userEmail = `${matricNumber.trim().toLowerCase()}@${email.includes('@') ? email.split('@')[1] : 'student.com'}`; // A simplified way to ensure a unique email for Firebase, though the user will enter their *real* gmail.

    try {
      if (isLogin) {
        // NOTE: Firebase Auth uses email for sign in. We'll use the user-provided 'gmail' for this.
        await login(email, password);
      } else {
        // Sign Up with Gmail and Password
        const userCredential = await signup(email, password);
        const user = userCredential.user;
        
        // Save additional user data (matric number) to Firestore
        await setDoc(doc(db, "users", user.uid), {
          email: email,
          matricNumber: matricNumber.trim().toUpperCase(),
          role: 'student', // Default role
          votedPolls: {}, // {pollId: {candidateId: 'xyz', status: 'pending'}}
          createdAt: new Date(),
        });
      }
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/invalid-email') {
        setError('Invalid email format.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered.');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid credentials.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Combine base style with hover style conditionally
  const buttonStyle = isHovering 
    ? { ...styles.primaryButton, ...styles.primaryButtonHover } 
    : styles.primaryButton;

  return (
    <div style={styles.loginContainer}>
      <div style={styles.mapPlaceholder} />
      <div style={styles.mainContent}>
        <h1 style={styles.loginHeader}>WELCOME</h1>
        <p style={styles.loginSubText}>
          Please enter your {isLogin ? 'details' : 'matric number, gmail and password'}
        </p>

        <form style={{ width: '100%' }} onSubmit={handleAuth}>
          {!isLogin && (
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Matric Number</label>
              <input
                type="text"
                placeholder="Enter Matric Number"
                value={matricNumber}
                onChange={(e) => setMatricNumber(e.target.value)}
                style={styles.inputField}
                required={!isLogin}
              />
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>{isLogin ? 'Gmail' : 'Gmail'}</label>
            <input
              type="email"
              placeholder="Enter your Gmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.inputField}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.inputField}
              required
            />
          </div>

          {error && <p style={styles.errorText}>{error}</p>}

          <button
            type="submit"
            style={buttonStyle}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            disabled={loading}
          >
            {loading ? <BeatLoader size={10} color="#ffffff" /> : `${isLogin ? 'Sign In' : 'Sign Up'} >`}
          </button>
        </form>

        <span
          style={styles.textLink}
          onClick={() => setIsLogin(!isLogin)}
        >
          <span style={{ marginRight: '10px' }}>👑</span> 
          {isLogin ? 'Create an account' : 'Already have an account? Sign In'}
        </span>
      </div>
    </div>
  );
};


// --- 5. PRIVATE ROUTE COMPONENT (Protects Student/Admin views) ---
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{...styles.appContainer, textAlign: 'center', paddingTop: '100px'}}><BeatLoader color="#a020f0" /></div>;
  return user ? children : <Navigate to="/login" />;
};

// --- 6. ADMIN ROUTE COMPONENT (Protects Admin views) ---
const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div style={{...styles.appContainer, textAlign: 'center', paddingTop: '100px'}}><BeatLoader color="#a020f0" /></div>;
  if (!user || !isAdmin) return <Navigate to="/" />; // Redirect to student dashboard or login
  return children;
};

// --- 7. PLACEHOLDER COMPONENTS (To be built next) ---
const StudentDashboard = () => {
  const { logout } = useAuth();
  return (
    <div style={styles.appContainer}>
      <h1 style={{color: '#c71585'}}>Student Dashboard (Coming Soon)</h1>
      <p>This is where you will see the active polls and vote.</p>
      <button onClick={logout} style={styles.primaryButton}>Logout</button>
    </div>
  );
};

const AdminPanel = () => {
  const { logout } = useAuth();
  return (
    <div style={styles.appContainer}>
      <h1 style={{color: '#a020f0'}}>Admin Control Panel (Coming Soon)</h1>
      <p>This is where you will manage polls, candidates, and approve payments.</p>
      <button onClick={logout} style={styles.primaryButton}>Logout</button>
    </div>
  );
};

// --- 8. MAIN APPLICATION COMPONENT ---
const App = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{...styles.appContainer, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px'}}>
        <BeatLoader color="#a020f0" /> Loading Application...
      </div>
    );
  }

  // Logic to determine the default landing page after loading
  let defaultHome = '/';
  if (user && isAdmin) {
    defaultHome = '/admin';
  } else if (user && !isAdmin) {
    defaultHome = '/student';
  } else {
    defaultHome = '/login';
  }

  return (
    <div style={styles.appContainer}>
      <Routes>
        <Route path="/" element={<Navigate to={defaultHome} replace />} />
        <Route path="/login" element={user ? <Navigate to={isAdmin ? '/admin' : '/student'} replace /> : <AuthScreen />} />
        
        {/* Protected Student Routes */}
        <Route path="/student" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />

        <Route path="*" element={<h1 style={{color: '#ff6b6b', textAlign: 'center'}}>404 Not Found</h1>} />
      </Routes>
    </div>
  );
};

// --- 9. WRAPPER FOR REACT ROUTER ---
const Root = () => (
  <Router>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Router>
);

export default Root;
