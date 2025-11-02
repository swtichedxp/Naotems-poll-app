import React, { useState, useEffect, useContext, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, updateDoc, query, where, onSnapshot } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { BeatLoader } from 'react-spinners';

// --- 1. FIREBASE CONFIGURATION & INITIALIZATION ---
// Configuration provided by the user
const firebaseConfig = {
  apiKey: "AIzaSyDtjAk21l9-fZkfNJciz2OOFNEfSR8-qJI",
  authDomain: "notems-poll.firebaseapp.com",
  projectId: "notems-poll",
  storageBucket: "notems-poll.firebasestorage.app",
  messagingSenderId: "900359647732",
  appId: "1:900359647732:web:a2dd2746f00a09a15209a1",
  // measurementId: "G-7Z3TBC657M" // Not needed for core services
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
  // Placeholder for the map image
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
  
  // --- Admin & Shared Component Styles ---
  adminContainer: {
    maxWidth: '600px',
    margin: '20px auto',
    padding: '20px',
    borderRadius: '15px',
    background: '#1a1a1a', // Darker gray for admin panel surface
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
    minHeight: '80vh',
  },
  adminHeader: {
    color: '#a020f0',
    marginBottom: '30px',
    borderBottom: '2px solid #333',
    paddingBottom: '15px',
    textAlign: 'center',
    fontSize: '28px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  formLabel: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#e0e0e0',
    fontSize: '16px',
  },
  formInput: {
    width: '100%',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #333',
    background: '#0a0a0a',
    color: '#e0e0e0',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s',
  },
  formInputFocus: {
    borderColor: '#a020f0',
  },
  candidateInputRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: '10px',
    alignItems: 'center',
  },
  fileInput: {
    display: 'none', // Hide default input
  },
  fileInputLabel: {
    flexShrink: 0,
    padding: '10px 15px',
    borderRadius: '8px',
    background: '#c71585', // Dark Magenta accent for upload
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    textAlign: 'center',
    transition: 'background 0.3s',
  },
  fileInputLabelHover: {
    background: '#a020f0',
  },
  removeButton: {
    background: '#ff6b6b', // Red for delete
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    flexShrink: 0,
    marginLeft: '5px',
  },
  addButton: {
    background: '#34c759', // Green for add
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '10px',
    cursor: 'pointer',
    marginTop: '10px',
    width: '100%',
    fontWeight: 'bold',
  },
  candidateImagePreview: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginRight: '10px',
  },
  // Tabs for Admin Panel
  tabsContainer: {
    display: 'flex',
    marginBottom: '20px',
    borderBottom: '1px solid #333',
  },
  tabButton: {
    flexGrow: 1,
    padding: '15px',
    textAlign: 'center',
    cursor: 'pointer',
    color: '#8a8a8a',
    fontWeight: '600',
    borderBottom: '3px solid transparent',
    transition: 'all 0.3s',
    background: 'none',
    border: 'none',
    outline: 'none',
    fontSize: '16px',
  },
  tabButtonActive: {
    color: '#a020f0',
    borderBottom: '3px solid #a020f0',
  },
    // --- Student Dashboard & Poll Card Styles ---
  studentDashboard: {
    maxWidth: '550px',
    margin: '20px auto',
    padding: '0 10px',
  },
  pollCard: {
    background: '#1a1a1a',
    borderRadius: '15px',
    padding: '20px',
    marginBottom: '25px',
    boxShadow: '4px 4px 10px #050505, -4px -4px 10px #2a2a2a',
    position: 'relative',
    overflow: 'hidden',
  },
  pollTitle: {
    color: '#a020f0',
    fontSize: '22px',
    fontWeight: '700',
    marginBottom: '15px',
    textAlign: 'center',
  },
  candidateItem: (isSelected) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    borderRadius: '10px',
    marginBottom: '10px',
    cursor: 'pointer',
    background: isSelected ? 'linear-gradient(90deg, #a020f0, #c71585)' : '#2a2a2a',
    boxShadow: isSelected ? '0 0 15px rgba(160, 32, 240, 0.5)' : 'none',
    transition: 'all 0.3s ease',
    border: isSelected ? '2px solid #fff' : 'none',
    position: 'relative',
  }),
  candidateImage: {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginRight: '15px',
    border: '3px solid #0a0a0a',
  },
  candidateName: {
    color: '#e0e0e0',
    fontWeight: '600',
    flexGrow: 1,
  },
  voteStatusText: (status) => {
    let color = '#ccc';
    if (status === 'Pending') color = '#ffeb3b'; // Yellow/Amber
    if (status === 'Approved') color = '#4cd964'; // Green
    if (status === 'Not Voted') color = '#e0e0e0';
    return {
      fontSize: '14px',
      fontWeight: 'bold',
      color: color,
    };
  },

  // --- Payment Modal/Upload Styles ---
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    width: '90%',
    maxWidth: '400px',
    background: '#0a0a0a',
    padding: '30px',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(160, 32, 240, 0.5)',
    textAlign: 'center',
  },
  uploadBox: (isDragOver) => ({
    border: isDragOver ? '2px dashed #a020f0' : '2px dashed #333',
    borderRadius: '15px',
    padding: '30px 20px',
    marginTop: '20px',
    textAlign: 'center',
    transition: 'all 0.3s',
    cursor: 'pointer',
  }),
  uploadIcon: {
    fontSize: '40px',
    color: '#a020f0',
    marginBottom: '10px',
  },
  paymentButton: {
    marginTop: '20px',
    padding: '12px 25px',
    borderRadius: '10px',
    fontWeight: 'bold',
    background: '#4cd964', // Green for 'Pay Now'
    color: '#0a0a0a',
    border: 'none',
    cursor: 'pointer',
  },
  approvalItem: {
    background: '#1a1a1a',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  screenshotPreview: {
    width: '100%',
    maxHeight: '300px',
    objectFit: 'contain',
    borderRadius: '8px',
    border: '1px solid #333',
  },
  actionButtonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
    marginTop: '10px',
  }
};

// --- 4. LOGIN / SIGNUP COMPONENT (Based on 1000369452.jpg) ---
const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [matricNumber, setMatricNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isHovering, setIsHovering] = useState(false); 
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

    try {
      if (isLogin) {
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
          votedPolls: {}, // {pollId: {candidateId: 'xyz', status: 'pending_payment'}}
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


// --- 5. PRIVATE ROUTE COMPONENTS ---
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{...styles.appContainer, textAlign: 'center', paddingTop: '100px'}}><BeatLoader color="#a020f0" /></div>;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div style={{...styles.appContainer, textAlign: 'center', paddingTop: '100px'}}><BeatLoader color="#a020f0" /></div>;
  if (!user || !isAdmin) return <Navigate to="/" />; // Redirect to student dashboard or login
  return children;
};


// --- 6. STUDENT DASHBOARD COMPONENTS ---

// Student Sub-Component: Payment Modal (1000369486.jpg)
const PaymentModal = ({ pollId, candidateId, studentId, onClose }) => {
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  
  const paymentDetails = {
    accountName: "NAOTEMS Dues Collection",
    bankName: "First Bank PLC",
    accountNumber: "3045678912",
    amount: "N1,000.00", 
  };

  const handleFileChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      setScreenshotFile(file);
      setError('');
    } else {
      setScreenshotFile(null);
      setError('Please upload a valid image file (screenshot).');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };
  
  const handleFileUpload = async () => {
    if (!screenshotFile) {
      setError('Please select a payment screenshot to upload.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // 1. Upload screenshot to Firebase Storage
      const filePath = `payments/${studentId}_${pollId}_${Date.now()}`;
      const imageStorageRef = storageRef(storage, filePath);
      const uploadResult = await uploadBytes(imageStorageRef, screenshotFile);
      const screenshotURL = await getDownloadURL(uploadResult.ref);
      
      // 2. Update the student's vote record in Firestore
      const userDocRef = doc(db, "users", studentId);
      await updateDoc(userDocRef, {
        [`votedPolls.${pollId}`]: {
          candidateId: candidateId,
          status: 'pending_approval', // Status changes to awaiting admin check
          timestamp: new Date(),
          screenshotURL: screenshotURL,
          storagePath: filePath,
        }
      });
      
      alert('Payment screenshot uploaded! Your vote is pending admin approval.');
      onClose(); // Close modal on success

    } catch (err) {
      console.error("Error uploading payment proof:", err);
      setError('Failed to upload proof. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={styles.modalBackdrop}>
      <div style={styles.modalContent}>
        <h2 style={{ color: '#a020f0', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Verify Your Vote</h2>
        <p style={{ color: '#ccc', margin: '20px 0' }}>
          Your vote has been cast but will only count after payment is approved by an admin.
        </p>

        {/* Payment Details */}
        <div style={{ background: '#1a1a1a', padding: '15px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #333' }}>
          <p style={{ fontWeight: 'bold', color: '#fff' }}>PAYMENT INSTRUCTIONS:</p>
          <p style={{ fontSize: '14px', color: '#ccc' }}>**Fee:** {paymentDetails.amount}</p>
          <p style={{ fontSize: '14px', color: '#ccc' }}>**Bank:** {paymentDetails.bankName}</p>
          <p style={{ fontSize: '14px', color: '#ccc' }}>**Account:** {paymentDetails.accountNumber}</p>
        </div>

        {/* File Upload Area */}
        <div 
          style={styles.uploadBox(isDragOver)}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('screenshot-upload').click()}
        >
          <div style={styles.uploadIcon}>📸</div>
          <p style={{ color: '#aaa', margin: '0 0 5px 0' }}>
            {screenshotFile ? screenshotFile.name : 'Tap or Drag & Drop Payment Screenshot'}
          </p>
          <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>
            (Only JPEG/PNG images are accepted)
          </p>
          <input
            type="file"
            id="screenshot-upload"
            accept="image/*"
            style={styles.fileInput}
            onChange={(e) => handleFileChange(e.target.files[0])}
          />
        </div>

        {error && <p style={styles.errorText}>{error}</p>}

        <button 
          onClick={handleFileUpload} 
          style={{...styles.primaryButton, background: 'linear-gradient(145deg, #4cd964, #34c759)'}}
          disabled={uploading || !screenshotFile}
        >
          {uploading ? <BeatLoader size={10} color="#0a0a0a" /> : 'Submit Proof for Approval'}
        </button>
        <button 
          onClick={onClose} 
          style={{...styles.textLink, marginTop: '15px', color: '#ccc'}}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// Student Dashboard Main Component
const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [activePolls, setActivePolls] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pollToPay, setPollToPay] = useState(null);

  // Fetch all active polls and user's vote history
  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      try {
        // Fetch User Data (Crucial for vote status)
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const currentData = userDoc.exists() ? userDoc.data() : { votedPolls: {} };
        setUserData(currentData);

        // Fetch Active Polls
        const pollsSnapshot = await getDocs(query(collection(db, "polls"), where("status", "==", "active")));
        const pollsList = pollsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setActivePolls(pollsList);
      } catch (e) {
        console.error("Error fetching student data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Setup a real-time listener for the user's document for instant status updates
    const userDocRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
            setUserData(docSnap.data());
        }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [user]);
  
  const handleVoteClick = async (pollId, candidateId) => {
    if (!userData) return;
    
    // Check if the user has already voted
    const existingVote = userData.votedPolls[pollId];
    if (existingVote && existingVote.status !== 'not_voted') {
      alert(`You have already cast a vote for this poll. Current status: ${existingVote.status.replace(/_/g, ' ').toUpperCase()}`);
      return;
    }

    try {
      // 1. Cast the initial PENDING_PAYMENT vote in the user document
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        [`votedPolls.${pollId}`]: {
          candidateId: candidateId,
          status: 'pending_payment', // The key status for payment required
          timestamp: new Date(),
          screenshotURL: null, // Set to null initially
          storagePath: null,
        }
      });
      
      // 2. Open payment modal
      setSelectedCandidate(candidateId);
      setPollToPay(pollId);
      setShowPaymentModal(true);
      
    } catch (err) {
      console.error("Error casting pending vote:", err);
      alert('Failed to register vote. Please try again.');
    }
  };
  
  const closeModalAndRefresh = () => {
    setShowPaymentModal(false);
    setSelectedCandidate(null);
    setPollToPay(null);
  };

  if (loading) return <div style={{...styles.appContainer, textAlign: 'center', paddingTop: '100px'}}><BeatLoader color="#a020f0" /></div>;

  return (
    <div style={styles.appContainer}>
      <div style={{...styles.studentDashboard, textAlign: 'center', marginBottom: '30px'}}>
        <h1 style={{color: '#fff', fontSize: '30px'}}>Hello, <span style={{color: '#a020f0'}}>{userData?.matricNumber || user.email}!</span></h1>
        <p style={{color: '#aaa'}}>Cast your vote below. Payment is required for your vote to count.</p>
        <button onClick={logout} style={{...styles.primaryButton, width: 'fit-content', padding: '10px 20px', background: '#333'}}>Logout</button>
      </div>

      <div style={styles.studentDashboard}>
        {activePolls.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#ffeb3b', padding: '50px' }}>No active polls available right now. Check back later!</p>
        ) : (
          activePolls.map(poll => {
            const voteStatus = userData?.votedPolls[poll.id]?.status || 'Not Voted';
            const votedCandidateId = userData?.votedPolls[poll.id]?.candidateId;
            
            return (
              <div key={poll.id} style={styles.pollCard}>
                <p style={{...styles.voteStatusText(voteStatus), marginBottom: '10px', textAlign: 'right'}}>
                  Status: {voteStatus.replace(/_/g, ' ').toUpperCase()}
                </p>
                <h2 style={styles.pollTitle}>{poll.title}</h2>
                
                {poll.candidates.map(candidate => (
                  <div
                    key={candidate.id}
                    style={styles.candidateItem(votedCandidateId === candidate.id)}
                    onClick={() => handleVoteClick(poll.id, candidate.id)}
                  >
                    <img 
                      src={candidate.imageURL} 
                      alt={candidate.name} 
                      style={styles.candidateImage} 
                    />
                    <span style={styles.candidateName}>{candidate.name}</span>
                    
                    {/* Display approved votes */}
                    <span style={{color: '#4cd964', fontWeight: 'bold'}}>
                      {candidate.votes} Approved Votes
                    </span>
                    
                    {votedCandidateId === candidate.id && <span style={{marginLeft: '10px'}}>✅</span>}
                  </div>
                ))}

                {/* Button to upload payment proof if status is pending payment */}
                {voteStatus === 'pending_payment' && (
                  <button
                    onClick={() => {
                      setPollToPay(poll.id);
                      setSelectedCandidate(userData.votedPolls[poll.id].candidateId);
                      setShowPaymentModal(true);
                    }}
                    style={{...styles.primaryButton, marginTop: '15px', background: 'linear-gradient(145deg, #ffeb3b, #ffa000)', color: '#0a0a0a'}}
                  >
                    Upload Payment Proof
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && pollToPay && user && selectedCandidate && (
        <PaymentModal
          pollId={pollToPay}
          candidateId={selectedCandidate}
          studentId={user.uid}
          onClose={closeModalAndRefresh}
        />
      )}
    </div>
  );
};


// --- 7. ADMIN PANEL COMPONENTS (The final piece!) ---

// Admin Sub-Component: Poll Creation (From previous step)
const CreatePoll = ({ setAllPolls }) => {
  const [pollTitle, setPollTitle] = useState('');
  const [candidates, setCandidates] = useState([{ name: '', imageFile: null, imageUrl: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCandidateNameChange = (index, name) => {
    const newCandidates = [...candidates];
    newCandidates[index].name = name;
    setCandidates(newCandidates);
  };

  const handleImageUpload = (index, file) => {
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    
    const newCandidates = [...candidates];
    newCandidates[index].imageFile = file;
    newCandidates[index].imageUrl = imageUrl;
    setCandidates(newCandidates);
  };
  
  const addCandidate = () => {
    setCandidates([...candidates, { name: '', imageFile: null, imageUrl: '' }]);
  };

  const removeCandidate = (index) => {
    if (candidates.length > 1) {
      setCandidates(candidates.filter((_, i) => i !== index));
    }
  };

  const handleSavePoll = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!pollTitle.trim()) {
      setError("Poll title is required.");
      setLoading(false);
      return;
    }
    const validCandidates = candidates.filter(c => c.name.trim() && c.imageFile);
    if (validCandidates.length < 2) {
      setError("Please add at least two candidates with names and images.");
      setLoading(false);
      return;
    }

    try {
      const newPollRef = doc(collection(db, "polls"));
      const pollId = newPollRef.id;
      
      const candidatesData = [];

      for (let i = 0; i < validCandidates.length; i++) {
        const candidate = validCandidates[i];
        
        const candidateId = `candidate_${i + 1}_${Date.now()}`;
        const imagePath = `polls/${pollId}/${candidateId}/${candidate.imageFile.name}`;
        const imageStorageRef = storageRef(storage, imagePath);
        
        const uploadResult = await uploadBytes(imageStorageRef, candidate.imageFile);
        const imageURL = await getDownloadURL(uploadResult.ref);
        
        candidatesData.push({
          id: candidateId,
          name: candidate.name.trim(),
          imageURL: imageURL,
          votes: 0, 
          storagePath: imagePath,
        });
      }

      await setDoc(newPollRef, {
        title: pollTitle.trim(),
        candidates: candidatesData,
        createdAt: new Date(),
        status: 'active',
      });

      setPollTitle('');
      setCandidates([{ name: '', imageFile: null, imageUrl: '' }]);
      alert('Poll created successfully!');
      setAllPolls(prev => [...prev, { id: pollId, title: pollTitle.trim(), status: 'active', candidates: candidatesData }]);

    } catch (err) {
      console.error("Error creating poll:", err);
      setError('Failed to create poll. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3 style={{ color: '#e0e0e0', marginBottom: '20px' }}>Create New Poll</h3>
      <form onSubmit={handleSavePoll}>
        <div style={styles.formGroup}>
          <label style={styles.formLabel}>Poll Title (Question)</label>
          <input
            type="text"
            placeholder="E.g., Best AI of the Year"
            value={pollTitle}
            onChange={(e) => setPollTitle(e.target.value)}
            style={styles.formInput}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.formLabel}>Candidates (Option & Picture)</label>
          {candidates.map((candidate, index) => (
            <div key={index} style={styles.candidateInputRow}>
              {candidate.imageUrl && (
                <img src={candidate.imageUrl} alt="Candidate Preview" style={styles.candidateImagePreview} />
              )}
              
              <input
                type="text"
                placeholder={`Candidate ${index + 1} Name`}
                value={candidate.name}
                onChange={(e) => handleCandidateNameChange(index, e.target.value)}
                style={styles.formInput}
                required
              />

              <label style={styles.fileInputLabel}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(index, e.target.files[0])}
                  style={styles.fileInput}
                />
                {candidate.imageFile ? 'Change' : 'Upload'}
              </label>

              {candidates.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeCandidate(index)} 
                  style={styles.removeButton}
                >
                  X
                </button>
              )}
            </div>
          ))}
          <button 
            type="button" 
            onClick={addCandidate} 
            style={{...styles.addButton, background: '#4cd964'}}
          >
            + Add Candidate
          </button>
        </div>

        {error && <p style={styles.errorText}>{error}</p>}
        
        <button
          type="submit"
          style={styles.primaryButton}
          disabled={loading}
        >
          {loading ? <BeatLoader size={10} color="#ffffff" /> : 'Post Poll'}
        </button>
      </form>
    </div>
  );
};


// Admin Sub-Component: Payment Approval (The new, final required logic)
const PaymentApproval = ({ allPolls }) => {
  const [pendingVotes, setPendingVotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users whose votes are 'pending_approval'
  useEffect(() => {
    const fetchPendingVotes = async () => {
      setLoading(true);
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const pendingList = [];

        usersSnapshot.forEach(userDoc => {
          const userData = userDoc.data();
          const userId = userDoc.id;

          // Check all votedPolls for 'pending_approval' status
          Object.entries(userData.votedPolls).forEach(([pollId, voteData]) => {
            if (voteData.status === 'pending_approval') {
              const poll = allPolls.find(p => p.id === pollId);
              const candidate = poll?.candidates.find(c => c.id === voteData.candidateId);
              
              if (poll && candidate) {
                pendingList.push({
                  userId,
                  matricNumber: userData.matricNumber,
                  pollId,
                  pollTitle: poll.title,
                  candidateId: candidate.id,
                  candidateName: candidate.name,
                  screenshotURL: voteData.screenshotURL,
                  storagePath: voteData.storagePath,
                });
              }
            }
          });
        });
        setPendingVotes(pendingList);
      } catch (e) {
        console.error("Error fetching pending votes:", e);
      } finally {
        setLoading(false);
      }
    };
    
    if (allPolls.length > 0) {
      fetchPendingVotes();
    }
  }, [allPolls]);
  
  const handleApproval = async (vote, isApproved) => {
    const { userId, pollId, candidateId, storagePath } = vote;
    const newStatus = isApproved ? 'approved' : 'rejected';
    
    // 1. Update the user's vote status
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
        [`votedPolls.${pollId}.status`]: newStatus,
    });
    
    // 2. If approved, increment the poll's vote count
    if (isApproved) {
        const pollDocRef = doc(db, "polls", pollId);
        const pollDoc = await getDoc(pollDocRef);
        const pollData = pollDoc.data();
        
        const updatedCandidates = pollData.candidates.map(c => 
            c.id === candidateId ? {...c, votes: c.votes + 1} : c
        );

        await updateDoc(pollDocRef, { candidates: updatedCandidates });
    }
    
    // 3. Delete the payment screenshot from Storage (it's no longer needed)
    try {
        if (storagePath) {
            const fileRef = storageRef(storage, storagePath);
            await deleteObject(fileRef);
        }
    } catch (e) {
        console.warn("Could not delete storage file:", e);
    }

    // 4. Remove the item from the local pending list
    setPendingVotes(prev => prev.filter(v => v.userId !== userId || v.pollId !== pollId));
  };


  return (
    <div style={{ padding: '20px' }}>
      <h3 style={{ color: '#e0e0e0', marginBottom: '20px' }}>Pending Payments for Approval</h3>
      {loading ? (
        <div style={{textAlign: 'center', padding: '50px'}}><BeatLoader color="#a020f0" /></div>
      ) : pendingVotes.length === 0 ? (
        <p style={{ color: '#4cd964', textAlign: 'center' }}>🎉 All pending payments have been processed!</p>
      ) : (
        pendingVotes.map((vote, index) => (
          <div key={`${vote.userId}-${vote.pollId}`} style={styles.approvalItem}>
            <p style={{fontWeight: 'bold', color: '#fff'}}>User: <span style={{color: '#a020f0'}}>{vote.matricNumber}</span></p>
            <p style={{fontSize: '14px'}}>Poll: **{vote.pollTitle}**</p>
            <p style={{fontSize: '14px'}}>Voted Candidate: **{vote.candidateName}**</p>

            <h4 style={{marginTop: '10px', color: '#ffeb3b'}}>Payment Screenshot:</h4>
            <a href={vote.screenshotURL} target="_blank" rel="noopener noreferrer">
                <img src={vote.screenshotURL} alt="Payment Proof" style={styles.screenshotPreview} />
            </a>

            <div style={styles.actionButtonContainer}>
              <button 
                onClick={() => handleApproval(vote, true)}
                style={{...styles.primaryButton, flexGrow: 1, background: '#4cd964', color: '#0a0a0a', boxShadow: 'none'}}
              >
                Approve Vote
              </button>
              <button 
                onClick={() => handleApproval(vote, false)}
                style={{...styles.primaryButton, flexGrow: 1, background: '#ff6b6b', boxShadow: 'none'}}
              >
                Reject Vote
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};


// Admin Sub-Component: Poll List/Results (Placeholder for now)
const PollList = ({ allPolls }) => {
  return (
    <div style={{ padding: '20px' }}>
      <h3 style={{ color: '#e0e0e0', marginBottom: '20px' }}>Manage Existing Polls ({allPolls.length})</h3>
      {allPolls.length === 0 ? (
        <p style={{ color: '#aaa' }}>No polls created yet.</p>
      ) : (
        // Map through polls to show list and results (Full result display logic can be added here)
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {allPolls.map(poll => (
            <li key={poll.id} style={{ padding: '10px 0', borderBottom: '1px solid #222', color: '#ccc' }}>
              **{poll.title}** - Status: {poll.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Main Admin Panel Component (With Tabs)
const AdminPanel = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('list'); // 'list', 'create', 'payments'
  const [allPolls, setAllPolls] = useState([]);
  const [loadingPolls, setLoadingPolls] = useState(true);

  // Fetch all polls on load and setup real-time listener
  useEffect(() => {
    const pollsCol = collection(db, "polls");
    
    // Set up a real-time listener for the polls collection
    const unsubscribe = onSnapshot(pollsCol, (snapshot) => {
      const pollsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllPolls(pollsData);
      setLoadingPolls(false);
    }, (error) => {
      console.error("Error fetching polls:", error);
      setLoadingPolls(false);
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  const renderContent = () => {
    if (loadingPolls) return <div style={{textAlign: 'center', padding: '50px'}}><BeatLoader color="#a020f0" /></div>;

    switch (activeTab) {
      case 'create':
        return <CreatePoll setAllPolls={setAllPolls} />;
      case 'payments':
        return <PaymentApproval allPolls={allPolls} />;
      case 'list':
      default:
        return <PollList allPolls={allPolls} />;
    }
  };

  return (
    <div style={styles.appContainer}>
      <div style={styles.adminContainer}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #333' }}>
          <h1 style={styles.adminHeader}>👑 Admin Dashboard</h1>
          <button onClick={logout} style={{...styles.removeButton, background: '#222', color: '#a020f0'}}>Logout</button>
        </div>
        
        {/* Tab Navigation */}
        <div style={styles.tabsContainer}>
          <button 
            style={{...styles.tabButton, ...(activeTab === 'list' && styles.tabButtonActive)}}
            onClick={() => setActiveTab('list')}
          >
            Manage Polls
          </button>
          <button 
            style={{...styles.tabButton, ...(activeTab === 'create' && styles.tabButtonActive)}}
            onClick={() => setActiveTab('create')}
          >
            Create New Poll
          </button>
          <button 
            style={{...styles.tabButton, ...(activeTab === 'payments' && styles.tabButtonActive)}}
            onClick={() => setActiveTab('payments')}
          >
            Payment Approval
          </button>
        </div>

        {/* Tab Content */}
        {renderContent()}
      </div>
    </div>
  );
};


// --- 8. MAIN APPLICATION COMPONENT & WRAPPER ---
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

const Root = () => (
  <Router>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Router>
);

export default Root;
