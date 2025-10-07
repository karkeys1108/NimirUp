import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography } from '../../constants';
import { Toast } from './Toast';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
}

type AuthScreen = 'initial' | 'login' | 'signup' | 'forgot-password';

export const AuthModal: React.FC<AuthModalProps> = ({
  visible,
  onClose,
  onAuthenticated,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('initial');
  const [isLoading, setIsLoading] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'info' as 'success' | 'error' | 'info',
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  const handleEmailSubmit = () => {
    if (!email.trim()) {
      showToast('Please enter your email address', 'error');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    
    setCurrentScreen('login');
  };

  const handleLogin = async () => {
    if (!password.trim()) {
      showToast('Please enter your password', 'error');
      return;
    }

    setIsLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      showToast('Successfully logged in!', 'success');
      setTimeout(() => {
        onAuthenticated();
      }, 1000);
    }, 1500);
  };

  const handleSignup = async () => {
    if (!password.trim()) {
      showToast('Please enter your password', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setIsLoading(true);
    
    // Simulate account creation
    setTimeout(() => {
      setIsLoading(false);
      showToast('Account created successfully!', 'success');
      setTimeout(() => {
        onAuthenticated();
      }, 1000);
    }, 1500);
  };

  const handleGoogleLogin = () => {
    showToast('Google login feature coming soon!', 'info');
    setTimeout(() => {
      onAuthenticated();
    }, 1000);
  };

  const handleForgotPassword = () => {
    if (!email.trim()) {
      showToast('Please enter your email first', 'error');
      return;
    }
    setCurrentScreen('forgot-password');
  };

  const sendPasswordReset = () => {
    showToast(`Password reset link sent to ${email}`, 'success');
    setTimeout(() => {
      setCurrentScreen('login');
    }, 1500);
  };

  const resetModal = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setCurrentScreen('initial');
    setShowPassword(false);
    setShowConfirmPassword(false);
    hideToast();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        onClose();
        resetModal();
      }}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          {/* Glassmorphism Card */}
          <View style={styles.glassCard}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                onClose();
                resetModal();
              }}
            >
              <Ionicons name="close" size={18} color={colors.primary} />
            </TouchableOpacity>

            {/* Content based on current screen */}
            {currentScreen === 'initial' && (
              <>
                {/* Header */}
                <View style={styles.header}>
                  <Text style={styles.title}>Get Started with NimirUp</Text>
                  <Text style={styles.subtitle}>Enter your email to continue</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                  {/* Email Input */}
                  <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={20} color={colors.accent} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email"
                      placeholderTextColor={colors.light}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>

                  {/* Continue Button */}
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleEmailSubmit}
                  >
                    <Text style={styles.primaryButtonText}>Continue</Text>
                  </TouchableOpacity>

                  {/* Or Divider */}
                  <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  {/* Google Login */}
                  <TouchableOpacity
                    style={styles.googleButton}
                    onPress={handleGoogleLogin}
                  >
                    <Ionicons name="logo-google" size={20} color={colors.primary} />
                    <Text style={styles.googleButtonText}>Continue with Google</Text>
                  </TouchableOpacity>

                  {/* Auth Options */}
                  <View style={styles.authOptionsContainer}>
                    <TouchableOpacity onPress={() => setCurrentScreen('login')}>
                      <Text style={styles.authOptionText}>Already have an account? Log in</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={() => setCurrentScreen('signup')}>
                      <Text style={styles.authOptionText}>New user? Create account</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}

            {currentScreen === 'login' && (
              <>
                {/* Header */}
                <View style={styles.header}>
                  <Text style={styles.title}>Welcome Back!</Text>
                  <Text style={styles.subtitle}>Enter your password to continue</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                  {/* Email Display */}
                  <View style={styles.emailDisplay}>
                    <Text style={styles.emailText}>{email}</Text>
                    <TouchableOpacity onPress={() => setCurrentScreen('initial')}>
                      <Text style={styles.changeEmailText}>Change</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Password Input */}
                  <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color={colors.accent} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="Enter your password"
                      placeholderTextColor={colors.light}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeButton}
                    >
                      <Ionicons
                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                        size={20}
                        color={colors.light}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Login Button */}
                  <TouchableOpacity
                    style={[styles.primaryButton, isLoading && styles.disabledButton]}
                    onPress={handleLogin}
                    disabled={isLoading}
                  >
                    <Text style={styles.primaryButtonText}>
                      {isLoading ? 'Logging in...' : 'Log In'}
                    </Text>
                  </TouchableOpacity>

                  {/* Links */}
                  <View style={styles.linksContainer}>
                    <TouchableOpacity onPress={handleForgotPassword}>
                      <Text style={styles.linkText}>Forgot Password?</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={() => setCurrentScreen('signup')}>
                      <Text style={styles.linkText}>Create new account</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}

            {currentScreen === 'signup' && (
              <>
                {/* Header */}
                <View style={styles.header}>
                  <Text style={styles.title}>Create Account</Text>
                  <Text style={styles.subtitle}>Set your password to get started</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                  {/* Email Display */}
                  <View style={styles.emailDisplay}>
                    <Text style={styles.emailText}>{email}</Text>
                    <TouchableOpacity onPress={() => setCurrentScreen('initial')}>
                      <Text style={styles.changeEmailText}>Change</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Password Input */}
                  <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color={colors.accent} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="Create password"
                      placeholderTextColor={colors.light}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeButton}
                    >
                      <Ionicons
                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                        size={20}
                        color={colors.light}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Confirm Password Input */}
                  <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color={colors.accent} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="Confirm password"
                      placeholderTextColor={colors.light}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={styles.eyeButton}
                    >
                      <Ionicons
                        name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                        size={20}
                        color={colors.light}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Create Account Button */}
                  <TouchableOpacity
                    style={[styles.primaryButton, isLoading && styles.disabledButton]}
                    onPress={handleSignup}
                    disabled={isLoading}
                  >
                    <Text style={styles.primaryButtonText}>
                      {isLoading ? 'Creating account...' : 'Create Account'}
                    </Text>
                  </TouchableOpacity>

                  {/* Login Link */}
                  <View style={styles.linksContainer}>
                    <TouchableOpacity onPress={() => setCurrentScreen('login')}>
                      <Text style={styles.linkText}>Already have an account? Log in</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}

            {currentScreen === 'forgot-password' && (
              <>
                {/* Header */}
                <View style={styles.header}>
                  <Text style={styles.title}>Forgot Password</Text>
                  <Text style={styles.subtitle}>We&apos;ll send you a reset link</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                  {/* Email Display */}
                  <View style={styles.emailDisplay}>
                    <Text style={styles.emailText}>{email}</Text>
                    <TouchableOpacity onPress={() => setCurrentScreen('initial')}>
                      <Text style={styles.changeEmailText}>Change</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Send Reset Button */}
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={sendPasswordReset}
                  >
                    <Text style={styles.primaryButtonText}>Send Reset Link</Text>
                  </TouchableOpacity>

                  {/* Back to Login */}
                  <View style={styles.linksContainer}>
                    <TouchableOpacity onPress={() => setCurrentScreen('login')}>
                      <Text style={styles.linkText}>Back to Login</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        </KeyboardAvoidingView>

        {/* Toast Notification */}
        <Toast
          visible={toast.visible}
          message={toast.message}
          type={toast.type}
          onHide={hideToast}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  glassCard: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: colors.primary,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 12,
    zIndex: 10,
    padding: 3,
    backgroundColor: colors.light,
    borderRadius: 15,
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  title: {
    ...typography.onboardingTitle,
    color: colors.white,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    ...typography.onboardingCaption,
    color: colors.light,
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.light,
    paddingHorizontal: 25,
    paddingVertical: 18,
    width: '100%',
    minWidth: 320,
  },
  inputIcon: {
    marginRight: 14,
  },
  input: {
    flex: 1,
    color: colors.white,
    fontSize: 16,
    fontWeight: '400',
  },
  eyeButton: {
    padding: 5,
    marginLeft: 10,
  },
  emailDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: colors.light,
    marginBottom: 5,
  },
  emailText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginRight: 15,
  },
  changeEmailText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  authOptionsContainer: {
    alignItems: 'center',
    gap: 8,
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.light,
  },
  authOptionText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    paddingVertical: 8,
  },
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: colors.accent,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.light,
  },
  dividerText: {
    color: colors.light,
    fontSize: 14,
    marginHorizontal: 15,
    opacity: 0.7,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  googleButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  linksContainer: {
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },
  linkText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});