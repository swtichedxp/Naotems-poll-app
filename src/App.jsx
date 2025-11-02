import React, { useState, useEffect, useContext, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, updateDoc, query, where, onSnapshot } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { BeatLoader } from 'react-spinners';

// --- 1. FIREBASE CONFIGURATION & INITIALIZATION ---
// Ensure these credentials are correct and services (Auth, Firestore, Storage) are enabled.
const firebaseConfig = {
  apiKey: "AIzaSyDtjAk21l9-fZkfNJciz2OOFNEfSR8-qJI",
  authDomain: "notems-poll.firebaseapp.com",
  projectId: "notems-poll",
  storageBucket: "notems-poll.firebasestorage.app",
  messagingSenderId: "900359647732",
  appId: "1:900359647732:web:a2dd2746f00a09a15209a1",
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
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const adminDoc = await getDoc(doc(db, "admins", currentUser.uid));
          setIsAdmin(adminDoc.exists());
        } catch (e) {
           console.error("Admin check failed:", e);
           setIsAdmin(false);
        }
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

// EXPORT useAuth so other components can use it
export const useAuth = () => useContext(AuthContext);


// --- 3. STYLES (Sleek Dark UI based on requirements) ---
const ACCENT_PURPLE = '#a020f0'; // Purple accent color
const ACCENT_MAGENTA = '#c71585'; // Dark magenta for gradient
const BACKGROUND_DARK = '#0a0a0a'; // Main background color
const CARD_DARK = '#151515'; // Card background color

const styles = {
  // Base Styles
  appContainer: {
    minHeight: '100vh',
    background: BACKGROUND_DARK,
    color: '#e0e0e0',
    fontFamily: 'system-ui, sans-serif',
    padding: 0,
    margin: 0,
    boxSizing: 'border-box',
    overflowX: 'hidden',
  },
  errorText: {
    color: '#ff6b6b',
    marginTop: '10px',
    fontSize: '14px',
  },
  
  // Reusable Form Elements
  inputField: {
    width: '100%',
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid #333',
    background: BACKGROUND_DARK,
    color: '#e0e0e0',
    boxSizing: 'border-box',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.3s',
    marginBottom: '20px', 
  },
  primaryButton: {
    width: '100%',
    padding: '14px 20px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    background: `linear-gradient(90deg, ${ACCENT_PURPLE}, ${ACCENT_MAGENTA})`, // Gradient Button
    color: '#ffffff',
    boxShadow: `0 4px 10px rgba(160, 32, 240, 0.3)`,
    transition: 'all 0.3s ease',
    marginTop: '15px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textLink: {
    marginTop: '20px',
    color: ACCENT_PURPLE,
    cursor: 'pointer',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'color 0.3s',
  },

  // --- Login/Auth Specific Styles (Split-Screen) ---
  authLayout: {
    minHeight: '100vh',
    display: 'flex',
    background: BACKGROUND_DARK,
  },
  imagePanel: {
    flex: 1,
    display: window.innerWidth > 768 ? 'flex' : 'none', // Hide on mobile
    justifyContent: 'center',
    alignItems: 'center',
    background: '#222', 
  },
  image: {
    width: '80%',
    maxWidth: '450px',
    height: 'auto',
    objectFit: 'contain',
    borderRadius: '15px',
    boxShadow: `0 0 40px rgba(160, 32, 240, 0.4)`,
  },
  formPanel: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  authCard: {
    width: '100%',
    maxWidth: '400px',
    padding: '30px',
    borderRadius: '15px',
    background: CARD_DARK,
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.7)',
    textAlign: 'center',
    border: '1px solid #333',
  },

  // Dashboard/Polls Styles (Kept for continuity)
  studentDashboard: {
    maxWidth: '550px',
    margin: '20px auto',
    padding: '0 10px',
  },
  pollCard: {
    background: CARD_DARK,
    borderRadius: '15px',
    padding: '20px',
    marginBottom: '25px',
    boxShadow: '4px 4px 10px #050505, -4px -4px 10px #2a2a2a',
    position: 'relative',
    overflow: 'hidden',
  },
  pollTitle: {
    color: ACCENT_PURPLE,
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
    background: isSelected ? `linear-gradient(90deg, ${ACCENT_PURPLE}, ${ACCENT_MAGENTA})` : '#2a2a2a',
    boxShadow: isSelected ? '0 0 15px rgba(160, 32, 240, 0.5)' : 'none',
    transition: 'all 0.3s ease',
    border: isSelected ? '2px solid #fff' : 'none',
  }),
  candidateImage: {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginRight: '15px',
    border: `3px solid ${BACKGROUND_DARK}`,
  },
  voteStatusText: (status) => {
    let color = '#ccc';
    if (status === 'pending_payment' || status === 'pending_approval') color = '#ffeb3b'; 
    if (status === 'approved') color = '#4cd964'; 
    if (status === 'rejected') color = '#ff6b6b';
    return {
      fontSize: '14px',
      fontWeight: 'bold',
      color: color,
      textAlign: 'right',
    };
  },
  loadingOverlay: {
    position: 'fixed', 
    top: 0, 
    left: 0, 
    width: '100%', 
    height: '100%', 
    background: 'rgba(0, 0, 0, 0.9)', 
    backdropFilter: 'blur(5px)', 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 9999, 
    color: ACCENT_PURPLE, 
    fontSize: '24px', 
    fontWeight: 'bold'
  },
  
  // Admin Styles (Kept for continuity)
  adminContainer: {
    maxWidth: '600px',
    margin: '20px auto',
    padding: '20px',
    borderRadius: '15px',
    background: CARD_DARK,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
    minHeight: '80vh',
  },
  fileInput: {
    display: 'none', 
  },
  fileInputLabel: {
    flexShrink: 0,
    padding: '10px 15px',
    borderRadius: '8px',
    background: ACCENT_MAGENTA, 
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    textAlign: 'center',
    transition: 'background 0.3s',
  },
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
    color: ACCENT_PURPLE,
    borderBottom: `3px solid ${ACCENT_PURPLE}`,
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
};

// --- 4. LOGIN / SIGNUP COMPONENT (Updated Split-Screen UI) ---
const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [matricNumber, setMatricNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password || (!isLogin && !matricNumber)) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        const userCredential = await signup(email, password);
        const user = userCredential.user;
        
        // Save user data to Firestore
        await setDoc(doc(db, "users", user.uid), {
          email: email,
          matricNumber: matricNumber.trim().toUpperCase(),
          role: 'student', 
          votedPolls: {}, 
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
      } else { 
        setError('Invalid credentials or a network error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.authLayout}>
        {/* Left Side: Image Panel */}
        <div style={styles.imagePanel}>
            {/* The image on the left will be image.png (must be in the /public folder) */}
            <img src="/image.png" alt="NAOTEMS Poll Banner" style={styles.image} />
        </div>

        {/* Right Side: Form Panel */}
        <div style={styles.formPanel}>
            <div style={styles.authCard}>
                <h1 style={{fontSize: '32px', color: ACCENT_PURPLE, marginBottom: '5px'}}>
                    {isLogin ? 'WELCOME BACK' : 'JOIN THE VOTE'}
                </h1>
                <p style={{color: '#aaa', marginBottom: '30px', fontSize: '14px'}}>
                    {isLogin ? 'Sign in to cast your vote.' : 'Register using your details.'}
                </p>

                <form style={{ width: '100%' }} onSubmit={handleAuth}>
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Matric Number"
                            value={matricNumber}
                            onChange={(e) => setMatricNumber(e.target.value)}
                            style={styles.inputField}
                            required={!isLogin}
                        />
                    )}

                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.inputField}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.inputField}
                        required
                    />

                    {error && <p style={styles.errorText}>{error}</p>}

                    <button
                        type="submit"
                        style={styles.primaryButton}
                        disabled={loading}
                    >
                        {loading ? <BeatLoader size={10} color="#ffffff" /> : `${isLogin ? 'SIGN IN' : 'REGISTER'}`}
                    </button>
                </form>

                <span
                    style={styles.textLink}
                    onClick={() => setIsLogin(!isLogin)}
                >
                    {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
                </span>
            </div>
        </div>
    </div>
  );
};


// --- 5. PRIVATE ROUTE COMPONENTS ---
const LoadingOverlay = ({ message }) => (
    <div style={styles.loadingOverlay}>
      <BeatLoader color={ACCENT_PURPLE} size={20} /> <p>{message}</p>
    </div>
);

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingOverlay message="Loading..." />;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <LoadingOverlay message="Loading Admin..." />;
  if (!user || !isAdmin) return <Navigate to="/student" />; 
  return children;
};


// --- 6. STUDENT DASHBOARD COMPONENTS ---

// Student Sub-Component: Payment Modal
const PaymentModal = ({ pollId, candidateId, studentId, onClose }) => {
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  
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
  
  const handleFileUpload = async () => {
    if (!screenshotFile) {
      setError('Please select a payment screenshot to upload.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const filePath = `payments/${studentId}_${pollId}_${Date.now()}`;
      const imageStorageRef = storageRef(storage, filePath);
      const uploadResult = await uploadBytes(imageStorageRef, screenshotFile);
      const screenshotURL = await getDownloadURL(uploadResult.ref);
      
      const userDocRef = doc(db, "users", studentId);
      await updateDoc(userDocRef, {
        [`votedPolls.${pollId}`]: {
          candidateId: candidateId,
          status: 'pending_approval', 
          timestamp: new Date(),
          screenshotURL: screenshotURL,
          storagePath: filePath, 
        }
      });
      
      alert('Payment screenshot uploaded! Your vote is pending admin approval.');
      onClose(); 

    } catch (err) {
      console.error("Error uploading payment proof:", err);
      setError('Failed to upload proof. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000}}>
      <div style={{width: '90%', maxWidth: '400px', background: BACKGROUND_DARK, padding: '30px', borderRadius: '20px', boxShadow: `0 10px 30px rgba(160, 32, 240, 0.5)`, textAlign: 'center'}}>
        <h2 style={{ color: ACCENT_PURPLE, borderBottom: '1px solid #333', paddingBottom: '10px' }}>Verify Your Vote</h2>
        <p style={{ color: '#ccc', margin: '20px 0' }}>
          Your vote has been cast but needs payment approval.
        </p>

        <div style={{ background: CARD_DARK, padding: '15px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #333' }}>
          <p style={{ fontWeight: 'bold', color: '#fff' }}>PAYMENT INSTRUCTIONS:</p>
          <p style={{ fontSize: '14px', color: '#ccc' }}>**Fee:** {paymentDetails.amount}</p>
          <p style={{ fontSize: '14px', color: '#ccc' }}>**Account:** {paymentDetails.accountNumber} ({paymentDetails.bankName})</p>
        </div>

        <div 
          style={{border: '2px dashed #333', borderRadius: '15px', padding: '30px 20px', marginTop: '20px', textAlign: 'center', cursor: 'pointer'}}
          onClick={() => document.getElementById('screenshot-upload').click()}
        >
          <div style={{fontSize: '40px', color: ACCENT_PURPLE, marginBottom: '10px'}}>📸</div>
          <p style={{ color: '#aaa', margin: '0 0 5px 0' }}>
            {screenshotFile ? screenshotFile.name : 'Tap to Upload Payment Screenshot'}
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
          style={{...styles.primaryButton, background: `linear-gradient(145deg, #4cd964, #34c759)`, color: BACKGROUND_DARK}}
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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pollToPay, setPollToPay] = useState(null);
  const [candidateToPay, setCandidateToPay] = useState(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        setUserData(userDoc.exists() ? userDoc.data() : { votedPolls: {} });

        const pollsSnapshot = await getDocs(query(collection(db, "polls"), where("status", "==", "active")));
        setActivePolls(pollsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (e) {
        console.error("Error fetching student data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const userDocRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
            setUserData(docSnap.data());
        }
    });

    return () => unsubscribe(); 
  }, [user]);
  
  const handleVoteClick = async (pollId, candidateId) => {
    if (!userData) return;
    
    const existingVote = userData.votedPolls[pollId];
    if (existingVote && (existingVote.status === 'approved' || existingVote.status === 'pending_approval')) {
      alert(`You have already cast and submitted payment for this poll. Status: ${existingVote.status.replace(/_/g, ' ').toUpperCase()}`);
      return;
    }

    // 1. Register the vote as pending payment
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        [`votedPolls.${pollId}`]: {
          candidateId: candidateId,
          status: 'pending_payment', 
          timestamp: new Date(),
          screenshotURL: null, 
          storagePath: null,
        }
      });
      
      setPollToPay(pollId);
      setCandidateToPay(candidateId);
      setShowPaymentModal(true);
      
    } catch (err) {
      console.error("Error casting pending vote:", err);
      alert('Failed to register vote. Please try again.');
    }
  };
  
  const closeModalAndRefresh = () => {
    setShowPaymentModal(false);
    setPollToPay(null);
    setCandidateToPay(null);
  };

  if (loading) return <LoadingOverlay message="Loading Dashboard..." />;

  return (
    <div style={styles.appContainer}>
      <div style={{...styles.studentDashboard, textAlign: 'center', marginBottom: '30px', paddingTop: '20px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
            <h1 style={{color: '#fff', fontSize: '30px'}}>Welcome, <span style={{color: ACCENT_PURPLE}}>{userData?.matricNumber || user.email}!</span></h1>
            <button onClick={logout} style={{background: '#222', color: ACCENT_PURPLE, border: '1px solid #333', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer'}}>Logout</button>
        </div>
        <p style={{color: '#aaa', borderBottom: '1px solid #333', paddingBottom: '10px'}}>Cast your vote below. Payment is required for your vote to count.</p>
      </div>

      <div style={styles.studentDashboard}>
        {activePolls.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#ffeb3b', padding: '50px' }}>No active polls available right now.</p>
        ) : (
          activePolls.map(poll => {
            const voteData = userData?.votedPolls[poll.id] || { status: 'not_voted' };
            const votedCandidateId = voteData.candidateId;
            const voteStatus = voteData.status;
            
            return (
              <div key={poll.id} style={styles.pollCard}>
                <p style={{...styles.voteStatusText(voteStatus), marginBottom: '10px'}}>
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
                    <span style={{flexGrow: 1, fontWeight: '600'}}>{candidate.name}</span>
                    
                    {votedCandidateId === candidate.id && <span style={{marginLeft: '10px', color: '#fff', fontWeight: 'bold'}}>VOTED ✅</span>}
                  </div>
                ))}

                {/* Show button if vote is cast but payment is missing */}
                {voteStatus === 'pending_payment' && (
                  <button
                    onClick={() => {
                      setPollToPay(poll.id);
                      setCandidateToPay(voteData.candidateId);
                      setShowPaymentModal(true);
                    }}
                    style={{...styles.primaryButton, marginTop: '15px', background: `linear-gradient(145deg, #ffeb3b, #ffa000)`, color: BACKGROUND_DARK}}
                  >
                    Upload Payment Proof
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {showPaymentModal && pollToPay && user && candidateToPay && (
        <PaymentModal
          pollId={pollToPay}
          candidateId={candidateToPay}
          studentId={user.uid}
          onClose={closeModalAndRefresh}
        />
      )}
    </div>
  );
};


// --- 7. ADMIN PANEL COMPONENTS ---
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
        <div style={{ width: '100%', textAlign: 'left' }}>
          <label style={{display: 'block', marginBottom: '8px', fontWeight: '600'}}>Poll Title (Question)</label>
          <input
            type="text"
            placeholder="E.g., Best AI of the Year"
            value={pollTitle}
            onChange={(e) => setPollTitle(e.target.value)}
            style={{...styles.inputField, marginBottom: '20px'}}
            required
          />
        </div>

        <div style={{ width: '100%', textAlign: 'left' }}>
          <label style={{display: 'block', marginBottom: '8px', fontWeight: '600'}}>Candidates (Option & Picture)</label>
          {candidates.map((candidate, index) => (
            <div key={index} style={{display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center'}}>
              {candidate.imageUrl && (
                <img src={candidate.imageUrl} alt="Candidate Preview" style={{width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', marginRight: '5px'}} />
              )}
              
              <input
                type="text"
                placeholder={`Candidate ${index + 1} Name`}
                value={candidate.name}
                onChange={(e) => handleCandidateNameChange(index, e.target.value)}
                style={{...styles.inputField, marginBottom: 0}}
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
                  style={{background: '#ff6b6b', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', flexShrink: 0}}
                >
                  X
                </button>
              )}
            </div>
          ))}
          <button 
            type="button" 
            onClick={addCandidate} 
            style={{...styles.primaryButton, background: '#4cd964', color: BACKGROUND_DARK}}
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


// Admin Sub-Component: Payment Approval 
const PaymentApproval = ({ allPolls }) => {
  const [pendingVotes, setPendingVotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usersColRef = collection(db, "users");
    const unsubscribe = onSnapshot(usersColRef, (snapshot) => {
        const pendingList = [];
        snapshot.forEach(userDoc => {
            const userData = userDoc.data();
            const userId = userDoc.id;

            Object.entries(userData.votedPolls || {}).forEach(([pollId, voteData]) => {
                if (voteData.status === 'pending_approval') {
                    const poll = allPolls.find(p => p.id === pollId);
                    const candidate = poll?.candidates.find(c => c.id === voteData.candidateId);
                    
                    if (poll && candidate) {
                        pendingList.push({
                            userId,
                            matricNumber: userData.matricNumber || 'N/A',
                            pollId,
                            pollTitle: poll.title,
                            candidateId: candidate.id,
                            candidateName: candidate.name,
                            screenshotURL: voteData.screenshotURL,
                            storagePath: voteData.storagePath,
                            timestamp: voteData.timestamp.toDate(),
                        });
                    }
                }
            });
        });
        setPendingVotes(pendingList.sort((a, b) => a.timestamp - b.timestamp));
        setLoading(false);
    }, (error) => {
        console.error("Error fetching pending votes in real-time:", error);
        setLoading(false);
    });

    return () => unsubscribe(); 
  }, [allPolls]);
  
  const handleApproval = async (vote, isApproved) => {
    const { userId, pollId, candidateId, storagePath } = vote;
    const newStatus = isApproved ? 'approved' : 'rejected';
    
    try {
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, {
            [`votedPolls.${pollId}.status`]: newStatus,
            [`votedPolls.${pollId}.screenshotURL`]: null,
            [`votedPolls.${pollId}.storagePath`]: null,
        });
        
        if (isApproved) {
            const pollDocRef = doc(db, "polls", pollId);
            const pollDoc = await getDoc(pollDocRef);
            const pollData = pollDoc.data();
            
            const updatedCandidates = pollData.candidates.map(c => 
                c.id === candidateId ? {...c, votes: c.votes + 1} : c
            );

            await updateDoc(pollDocRef, { candidates: updatedCandidates });
        }
        
        if (storagePath) {
            const fileRef = storageRef(storage, storagePath);
            await deleteObject(fileRef).catch(e => console.warn("Could not delete storage file:", e));
        }

    } catch (e) {
        alert('Failed to process approval. Check console.');
        console.error(e);
    }
  };


  return (
    <div style={{ padding: '20px' }}>
      <h3 style={{ color: '#e0e0e0', marginBottom: '20px' }}>Pending Payments for Approval</h3>
      {loading ? (
        <div style={{textAlign: 'center', padding: '50px'}}><BeatLoader color={ACCENT_PURPLE} /></div>
      ) : pendingVotes.length === 0 ? (
        <p style={{ color: '#4cd964', textAlign: 'center' }}>🎉 All pending payments have been processed!</p>
      ) : (
        pendingVotes.map((vote) => (
          <div key={`${vote.userId}-${vote.pollId}`} style={styles.approvalItem}>
            <p style={{fontWeight: 'bold', color: '#fff'}}>User Matric No: <span style={{color: ACCENT_PURPLE}}>{vote.matricNumber}</span></p>
            <p style={{fontSize: '14px', color: '#ccc'}}>Poll: **{vote.pollTitle}**</p>
            <p style={{fontSize: '14px', color: '#ccc'}}>Voted Candidate: **{vote.candidateName}**</p>

            <h4 style={{marginTop: '10px', color: '#ffeb3b'}}>Payment Screenshot:</h4>
            <a href={vote.screenshotURL} target="_blank" rel="noopener noreferrer">
                <img src={vote.screenshotURL} alt="Payment Proof" style={{width: '100%', maxHeight: '300px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #333'}} />
            </a>

            <div style={{display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '10px'}}>
              <button 
                onClick={() => handleApproval(vote, true)}
                style={{...styles.primaryButton, flexGrow: 1, background: '#4cd964', color: BACKGROUND_DARK, boxShadow: 'none', padding: '10px'}}
              >
                Approve Vote
              </button>
              <button 
                onClick={() => handleApproval(vote, false)}
                style={{...styles.primaryButton, flexGrow: 1, background: '#ff6b6b', boxShadow: 'none', padding: '10px'}}
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


// Admin Sub-Component: Poll List/Results 
const PollList = ({ allPolls }) => {
  return (
    <div style={{ padding: '20px' }}>
      <h3 style={{ color: '#e0e0e0', marginBottom: '20px' }}>Poll Results ({allPolls.length})</h3>
      {allPolls.length === 0 ? (
        <p style={{ color: '#aaa' }}>No polls created yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {allPolls.map(poll => {
            const sortedCandidates = poll.candidates.sort((a, b) => b.votes - a.votes);
            const totalVotes = poll.candidates.reduce((sum, c) => sum + c.votes, 0);

            return (
              <li key={poll.id} style={{ padding: '15px', borderBottom: '1px solid #222', background: '#1a1a1a', borderRadius: '8px', marginBottom: '10px' }}>
                <h4 style={{color: ACCENT_PURPLE, marginBottom: '5px'}}>{poll.title}</h4>
                <p style={{fontSize: '14px', color: '#ccc', marginBottom: '10px'}}>Total Approved Votes: {totalVotes}</p>
                
                {sortedCandidates.map((c, index) => (
                    <div key={c.id} style={{marginBottom: '5px', display: 'flex', alignItems: 'center'}}>
                        <img src={c.imageURL} alt={c.name} style={{width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', marginRight: '10px'}}/>
                        <span style={{fontWeight: 'bold', color: index === 0 ? '#ffeb3b' : '#e0e0e0', flexGrow: 1}}>{c.name}</span>
                        <span style={{color: index === 0 ? '#4cd964' : '#ccc'}}>{c.votes} votes ({totalVotes > 0 ? ((c.votes / totalVotes) * 100).toFixed(1) : 0}%)</span>
                    </div>
                ))}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};


// Main Admin Panel Component (With Tabs)
const AdminPanel = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('payments'); 
  const [allPolls, setAllPolls] = useState([]);
  const [loadingPolls, setLoadingPolls] = useState(true);

  useEffect(() => {
    const pollsCol = collection(db, "polls");
    const unsubscribe = onSnapshot(pollsCol, (snapshot) => {
      const pollsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllPolls(pollsData);
      setLoadingPolls(false);
    }, (error) => {
      console.error("Error fetching polls:", error);
      setLoadingPolls(false);
    });

    return () => unsubscribe(); 
  }, []);

  const renderContent = () => {
    if (loadingPolls) return <LoadingOverlay message="Loading Poll Data..." />;

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '10px' }}>
          <h1 style={{color: '#fff', fontSize: '24px'}}>ADMIN PANEL</h1>
          <button onClick={logout} style={{background: '#222', color: ACCENT_PURPLE, border: '1px solid #333', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer'}}>Logout</button>
        </div>
        
        <div style={styles.tabsContainer}>
          <button 
            style={{...styles.tabButton, ...(activeTab === 'payments' && styles.tabButtonActive)}}
            onClick={() => setActiveTab('payments')}
          >
            Payment Approval
          </button>
          <button 
            style={{...styles.tabButton, ...(activeTab === 'create' && styles.tabButtonActive)}}
            onClick={() => setActiveTab('create')}
          >
            Create Poll
          </button>
          <button 
            style={{...styles.tabButton, ...(activeTab === 'list' && styles.tabButtonActive)}}
            onClick={() => setActiveTab('list')}
          >
            Poll Results
          </button>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};


// --- 8. MAIN APPLICATION COMPONENT & WRAPPER ---
const App = () => {
  const { user, isAdmin, loading } = useAuth();

  let defaultHome = '/';
  if (user && isAdmin) {
    defaultHome = '/admin';
  } else if (user && !isAdmin) {
    defaultHome = '/student';
  } else {
    defaultHome = '/login';
  }

  if (loading) {
    return <LoadingOverlay message="Loading Application..." />;
  }
  
  return (
    <div style={styles.appContainer}>
      <Routes>
        <Route path="/" element={<Navigate to={defaultHome} replace />} />
        <Route path="/login" element={user ? <Navigate to={isAdmin ? '/admin' : '/student'} replace /> : <AuthScreen />} />
        
        <Route path="/student" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} />
        
        <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />

        <Route path="*" element={<h1 style={{color: '#ff6b6b', textAlign: 'center', paddingTop: '100px'}}>404 Not Found</h1>} />
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
