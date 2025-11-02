import React, { useState } from 'react';
import { useAuth } from '../App'; // Assuming useAuth is exported from App.jsx or context file
import { BeatLoader } from 'react-spinners';

// --- UI Constants (New Dark/White Aesthetic) ---
const ACCENT_WHITE = '#FFFFFF';
const ACCENT_LIGHT_GRAY = '#E0E0E0';
const BACKGROUND_DARK = '#0A0A0A'; // Deepest dark background
const CARD_DARK = '#151515';       // Dark card background
const BORDER_DARK = '#333333';     // Subtle border color

const styles = {
    // --- Overall Split-Screen Layout ---
    container: {
        minHeight: '100vh',
        display: 'flex',
        background: BACKGROUND_DARK,
        color: ACCENT_LIGHT_GRAY, // Default text color
        fontFamily: 'system-ui, sans-serif',
    },
    // Left Side: Image Panel 
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
        // Update: Use a white-based shadow instead of purple
        boxShadow: `0 0 40px rgba(255, 255, 255, 0.4)`,
    },
    // Right Side: Form Panel 
    formPanel: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
    },
    authBox: {
        width: '100%',
        maxWidth: '400px',
        padding: '40px',
        // Update: Darker card background
        background: CARD_DARK,
        borderRadius: '10px',
        // Update: White glow for the card shadow
        boxShadow: `0 10px 30px rgba(255, 255, 255, 0.08)`,
        textAlign: 'center',
    },
    header: {
        fontSize: '28px',
        fontWeight: '700',
        marginBottom: '30px',
        color: ACCENT_WHITE, // White header
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        marginBottom: '20px',
    },
    inputField: {
        padding: '12px 15px',
        border: `1px solid ${BORDER_DARK}`, // Darker border
        borderRadius: '5px',
        fontSize: '16px',
        background: BACKGROUND_DARK, // Very dark input background
        color: ACCENT_LIGHT_GRAY,
        outline: 'none',
        transition: 'border-color 0.3s',
    },
    // Focus effect: border turns white
    inputFieldFocus: {
        borderColor: ACCENT_WHITE,
        boxShadow: `0 0 0 1px ${ACCENT_WHITE}`,
    },
    // Update: Solid white background button with dark text
    gradientButton: {
        padding: '12px 20px',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        // New: Solid white background, black/dark text
        background: ACCENT_WHITE,
        color: BACKGROUND_DARK, 
        transition: 'opacity 0.3s, transform 0.1s',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Hover/Active effect
    gradientButtonHover: {
        opacity: 0.9,
    },
    gradientButtonActive: {
        transform: 'scale(0.98)',
    },
    // Disabled state
    gradientButtonDisabled: {
        opacity: 0.5,
        cursor: 'not-allowed',
    },
    // Update: Subtle light gray link
    textLink: {
        color: ACCENT_LIGHT_GRAY,
        fontSize: '14px',
        cursor: 'pointer',
        marginTop: '15px',
        display: 'block',
        transition: 'color 0.3s',
    },
    // Hover for link
    textLinkHover: {
        color: ACCENT_WHITE,
    },
    errorText: {
        color: '#ff6b6b', // Keep a standard error color
        fontSize: '14px',
        textAlign: 'center',
        margin: '10px 0',
    }
};

const AuthScreen = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { signIn, register } = useAuth(); // Assuming useAuth provides signIn and register functions

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                await signIn(email, password);
            } else {
                // In a real app, you might add username or other fields for registration
                await register(email, password);
            }
        } catch (err) {
            console.error(err);
            // Firebase error codes can be parsed for user-friendly messages
            setError(err.message.replace('Firebase: Error ', ''));
        } finally {
            setLoading(false);
        }
    };

    // Helper for input focus state (for visual feedback)
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    
    // Inline styling to handle hover/focus/active states for a purely CSS-in-JS environment
    const getButtonStyle = (disabled) => ({
        ...styles.gradientButton,
        ...(disabled && styles.gradientButtonDisabled),
        // Add pseudo-class support by checking current interaction state if possible,
        // but for simplicity in this structure, we rely on the disabled state.
    });

    return (
        <div style={styles.container}>
            <div style={styles.imagePanel}>
                <img 
                    src={process.env.PUBLIC_URL + '/image.png'} 
                    alt="Poll Application Visual" 
                    style={styles.image}
                />
            </div>
            <div style={styles.formPanel}>
                <div style={styles.authBox}>
                    <h2 style={styles.header}>
                        {isLogin ? 'WELCOME BACK' : 'CREATE ACCOUNT'}
                    </h2>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            // Combine base style with focus style
                            style={{
                                ...styles.inputField,
                                ...(emailFocused && styles.inputFieldFocus)
                            }}
                            onFocus={() => setEmailFocused(true)}
                            onBlur={() => setEmailFocused(false)}
                            required
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            // Combine base style with focus style
                            style={{
                                ...styles.inputField,
                                ...(passwordFocused && styles.inputFieldFocus)
                            }}
                            onFocus={() => setPasswordFocused(true)}
                            onBlur={() => setPasswordFocused(false)}
                            required
                        />

                        {error && <p style={styles.errorText}>{error}</p>}

                        <button
                            type="submit"
                            style={getButtonStyle(loading)}
                            disabled={loading}
                            // Inline pseudo-class support for hover/active could be added 
                            // using onMouseOver/onMouseOut/onMouseDown/onMouseUp
                            // but is often complex in pure inline styles. We'll rely on 
                            // the change of the background and text color for the main UI change.
                        >
                            {loading ? <BeatLoader size={10} color={BACKGROUND_DARK} /> : `${isLogin ? 'SIGN IN' : 'REGISTER'}`}
                        </button>
                    </form>

                    <span
                        style={styles.textLink}
                        onClick={() => setIsLogin(!isLogin)}
                        // Note: Real-world applications should use a standard button 
                        // or link tag for better accessibility.
                    >
                        {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AuthScreen;
