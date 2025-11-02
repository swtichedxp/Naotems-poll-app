import React, { useState } from 'react';
import { useAuth } from '../App'; // Assuming useAuth is exported from App.jsx or context file
import { BeatLoader } from 'react-spinners';

// --- UI Constants (Matching the Sleek Dark Aesthetic) ---
const ACCENT_PURPLE = '#a020f0';
const ACCENT_MAGENTA = '#c71585';
const BACKGROUND_DARK = '#0a0a0a';
const CARD_DARK = '#151515';

const styles = {
    // --- Overall Split-Screen Layout ---
    container: {
        minHeight: '100vh',
        display: 'flex',
        background: BACKGROUND_DARK,
        color: '#e0e0e0',
        fontFamily: 'system-ui, sans-serif',
    },
    // Left Side: Image Panel (Hidden on small screens)
    imagePanel: {
        flex: 1,
        display: window.innerWidth > 768 ? 'flex' : 'none', // Hide on mobile
        justifyContent: 'center',
        alignItems: 'center',
        background: '#222', // Subtle gray background for the panel
    },
    image: {
        width: '80%',
        maxWidth: '450px',
        height: 'auto',
        objectFit: 'contain',
        borderRadius: '15px',
        boxShadow: `0 0 40px rgba(160, 32, 240, 0.4)`,
    },
    // Right Side: Form Panel (Full width on small screens)
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
    // --- Form Elements ---
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
        marginBottom: '20px',
    },
    gradientButton: {
        width: '100%',
        padding: '14px 20px',
        borderRadius: '8px',
        border: 'none',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        // --- Gradient Style Requirement ---
        background: `linear-gradient(90deg, ${ACCENT_PURPLE}, ${ACCENT_MAGENTA})`,
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
    errorText: {
        color: '#ff6b6b',
        marginTop: '10px',
        fontSize: '14px',
    },
};

const AuthScreen = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [matricNumber, setMatricNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // NOTE: This assumes 'useAuth' is accessible via import.
    // We will ensure 'useAuth' is properly exported in the next step (App.jsx cleanup).
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
                
                // Assuming Firestore logic from previous step is needed for registration
                // (You'll integrate this part into your actual App.jsx logic flow)
                // await setDoc(doc(db, "users", user.uid), { ... }); 
            }
        } catch (err) {
            console.error(err);
            setError('Authentication failed. Check credentials/network.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            {/* Left Side: Image Panel */}
            <div style={styles.imagePanel}>
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

                    <form onSubmit={handleAuth}>
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
                            style={styles.gradientButton}
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

export default AuthScreen;
