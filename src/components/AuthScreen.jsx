import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { THEME, COMMON_STYLES } from './AuthStyles';
import LoginContent from './LoginContent'; // Import the new content component

// Local styles for AuthScreen (minimal)
const styles = StyleSheet.create({
  ...COMMON_STYLES, // Use all common styles
  
  // Specific styles for the Header/Pill elements
  headerPill: {
    backgroundColor: THEME.ACCENT_SOFT,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 10,
    borderColor: '#ffebf5',
    borderWidth: 1,
  },
  headerPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.PRIMARY,
  },
  switchButton: {
    marginTop: 25,
  },
  switchButtonText: {
    fontSize: 14,
    color: THEME.PLACEHOLDER,
  },
  linkText: {
    color: THEME.LINK,
    fontWeight: '600',
  },
});

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleAuth = () => {
    if (isLogin) {
      console.log('Logging in with:', email, password);
    } else {
      console.log('Signing up with:', username, email, password);
    }
    // Add your actual authentication logic here (API calls, navigation, etc.)
  };

  const toggleAuthMode = () => {
    setIsLogin(prev => !prev);
    // Clear forms on switch
    setEmail('');
    setPassword('');
    setUsername('');
  };

  return (
    // Outer container with simulated background gradient
    <View style={styles.fullScreenContainer}>
      <View style={styles.gradientOverlay} />
      <SafeAreaView style={styles.centerContent}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.centerContent}
        >
          {/* Otake Header Pill */}
          <View style={styles.headerPill}>
            <Text style={styles.headerPillText}>Otake Login</Text>
          </View>
          
          <Text style={styles.welcomeText}>Welcome Otake!</Text>

          {/* Core Login/Signup Form Content */}
          <LoginContent
            isLogin={isLogin}
            email={email}
            password={password}
            username={username}
            setEmail={setEmail}
            setPassword={setPassword}
            setUsername={setUsername}
            handleAuth={handleAuth}
          />
          
          {/* Footer Switch (Log In / Create an Account) */}
          <TouchableOpacity onPress={toggleAuthMode} style={styles.switchButton}>
            <Text style={styles.switchButtonText}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Text style={styles.linkText}>
                {isLogin ? 'Sign Up' : 'Log In'}
              </Text>
            </Text>
          </TouchableOpacity>

        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default AuthScreen;
