import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Image
} from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // Assuming you use Expo/Vector Icons

const { width } = Dimensions.get('window');

// 1. Theme Colors and Constants
const THEME = {
  primary: '#000000', // Black for text/buttons
  secondary: '#FFFFFF', // White for background elements
  placeholder: '#a0a0a0',
  inputBackground: 'rgba(255, 255, 255, 0.9)',
  googleBackground: '#FFFFFF',
  googleBorder: '#dcdcdc',
  buttonPrimary: '#000000',
  buttonText: '#FFFFFF',
  link: '#3a7bd5',
  gradientColors: ['#f0f0ff', '#ffe6f0', '#fff0e6'], // Simulating the soft pastel gradient
};

// 2. Custom Gradient/Background Component (Simulated with a single color for simplicity)
// In a real project, you'd use a library like 'expo-linear-gradient' for the background
const OtakeBackground = ({ children }) => (
  <View style={styles.backgroundContainer}>
    {/* This View simulates the soft, blurred pastel gradient background */}
    <View style={styles.gradientOverlay} />
    {children}
  </View>
);

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Only for Sign Up

  const handleAuth = () => {
    if (isLogin) {
      console.log('Logging in with:', email, password);
    } else {
      console.log('Signing up with:', username, email, password);
    }
  };

  // Helper to switch the mode (Login/Sign Up)
  const toggleAuthMode = () => {
    setIsLogin(prev => !prev);
  };

  const GoogleButton = () => (
    <TouchableOpacity style={styles.googleButton}>
      <AntDesign name="google" size={20} color={THEME.primary} />
      <Text style={styles.googleButtonText}>
        Continue with Google
      </Text>
    </TouchableOpacity>
  );

  const AuthForm = () => (
    <View style={styles.authContainer}>
      <View style={styles.headerPill}>
        <Text style={styles.headerPillText}>Otake Login</Text>
      </View>
      <Text style={styles.welcomeText}>Welcome Otake!</Text>

      {/* --- FORM CARDS --- */}
      <View style={styles.card}>
        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor={THEME.placeholder}
            value={username}
            onChangeText={setUsername}
          />
        )}
        <Text style={styles.inputLabel}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="batuhankra312@gmail.co" // Placeholder matches image
          placeholderTextColor={THEME.placeholder}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••••" // Placeholder matches image
          placeholderTextColor={THEME.placeholder}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <View style={styles.rowBetween}>
          <TouchableOpacity
            style={styles.rememberMe}
            onPress={() => console.log('Toggled Remember Me')}
          >
            <View style={styles.checkbox}></View>
            <Text style={styles.forgotText}>Remember me</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Forgot Password Pressed')}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        {/* --- Primary Action Button --- */}
        <TouchableOpacity style={styles.mainButton} onPress={handleAuth}>
          <Text style={styles.mainButtonText}>
            {isLogin ? 'Log In' : 'Create an Account'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.orText}>or</Text>

        {/* --- Google Button --- */}
        <GoogleButton />
      </View>
      {/* --- Footer Switch (Log In / Create an Account) --- */}
      <TouchableOpacity onPress={toggleAuthMode} style={styles.switchButton}>
        <Text style={styles.switchButtonText}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Text style={styles.linkText}>
            {isLogin ? 'Sign Up' : 'Log In'}
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <OtakeBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <AuthForm />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </OtakeBackground>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    backgroundColor: THEME.gradientColors[0], // Base color if gradient library is not used
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    // In a real app, use expo-linear-gradient here for the full effect
    backgroundColor: THEME.gradientColors[0],
    opacity: 1, // Full opacity for the simulated background
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authContainer: {
    width: width * 0.9,
    maxWidth: 400,
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 20,
  },
  headerPill: {
    backgroundColor: THEME.gradientColors[1],
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 10,
    borderColor: '#ffddf0',
    borderWidth: 1,
  },
  headerPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.primary,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: THEME.primary,
    marginBottom: 30,
  },
  card: {
    width: '100%',
    backgroundColor: THEME.secondary,
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
  },
  inputLabel: {
    fontSize: 14,
    color: THEME.primary,
    fontWeight: '500',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    height: 50,
    backgroundColor: THEME.inputBackground,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: THEME.googleBorder,
    marginBottom: 10,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    height: 18,
    width: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: THEME.placeholder,
    marginRight: 8,
  },
  forgotText: {
    fontSize: 14,
    color: THEME.placeholder,
  },
  mainButton: {
    height: 50,
    backgroundColor: THEME.buttonPrimary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  mainButtonText: {
    color: THEME.buttonText,
    fontSize: 16,
    fontWeight: '600',
  },
  orText: {
    textAlign: 'center',
    color: THEME.placeholder,
    fontSize: 14,
    marginBottom: 20,
  },
  googleButton: {
    height: 50,
    backgroundColor: THEME.googleBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: THEME.googleBorder,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButtonText: {
    color: THEME.primary,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
  switchButton: {
    marginTop: 20,
  },
  switchButtonText: {
    fontSize: 14,
    color: THEME.placeholder,
  },
  linkText: {
    color: THEME.link,
    fontWeight: '600',
  },
});

export default AuthScreen;
