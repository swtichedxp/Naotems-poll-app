import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // Ensure this package is installed
import { THEME, COMMON_STYLES } from './AuthStyles';

// Local styles for this component
const styles = StyleSheet.create({
  ...COMMON_STYLES, // Import common styles
  
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 25,
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
    borderColor: THEME.PLACEHOLDER,
    marginRight: 8,
    // Add checkmark here when implemented
  },
  forgotText: {
    fontSize: 14,
    color: THEME.PLACEHOLDER,
    fontWeight: '500',
  },
  mainButton: {
    ...COMMON_STYLES.buttonBase,
    backgroundColor: THEME.PRIMARY,
    marginBottom: 20,
  },
  mainButtonText: {
    ...COMMON_STYLES.buttonText,
    color: THEME.SECONDARY,
  },
  orText: {
    textAlign: 'center',
    color: THEME.PLACEHOLDER,
    fontSize: 14,
    marginBottom: 20,
  },
  googleButton: {
    ...COMMON_STYLES.buttonBase,
    backgroundColor: THEME.SECONDARY,
    borderWidth: 1,
    borderColor: THEME.GOOGLE_BORDER,
    flexDirection: 'row',
  },
  googleButtonText: {
    ...COMMON_STYLES.buttonText,
    color: THEME.PRIMARY,
    marginLeft: 10,
  },
});

const LoginContent = ({ isLogin, email, password, username, setEmail, setPassword, setUsername, handleAuth }) => {
  return (
    <View style={styles.card}>
      {/* Username Field (Only for Sign Up) */}
      {!isLogin && (
        <>
          <Text style={styles.inputLabel}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Choose a username"
            placeholderTextColor={THEME.PLACEHOLDER}
            value={username}
            onChangeText={setUsername}
          />
        </>
      )}

      {/* Email Field */}
      <Text style={styles.inputLabel}>Email Address</Text>
      <TextInput
        style={styles.input}
        placeholder="batuhankra312@gmail.co"
        placeholderTextColor={THEME.PLACEHOLDER}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password Field */}
      <Text style={styles.inputLabel}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="••••••••••"
        placeholderTextColor={THEME.PLACEHOLDER}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Remember Me / Forgot Password */}
      <View style={styles.rowBetween}>
        <TouchableOpacity style={styles.rememberMe}>
          <View style={styles.checkbox}></View>
          <Text style={styles.forgotText}>Remember me</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Forgot Password Pressed')}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>
      </View>

      {/* Primary Action Button */}
      <TouchableOpacity style={styles.mainButton} onPress={handleAuth}>
        <Text style={styles.mainButtonText}>
          {isLogin ? 'Log In' : 'Create an Account'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.orText}>or</Text>

      {/* Continue with Google Button */}
      <TouchableOpacity style={styles.googleButton}>
        <AntDesign name="google" size={20} color={THEME.PRIMARY} />
        <Text style={styles.googleButtonText}>
          Continue with Google
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginContent;
