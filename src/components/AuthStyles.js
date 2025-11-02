import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const THEME = {
  // Colors based on Otake Image
  PRIMARY: '#000000', // Black for primary text/buttons
  SECONDARY: '#FFFFFF', // White for the main form card
  ACCENT_SOFT: '#ffddf0', // Soft pink border/accent
  PLACEHOLDER: '#a0a0a0',
  INPUT_BG: 'rgba(255, 255, 255, 0.9)',
  GOOGLE_BORDER: '#dcdcdc',
  LINK: '#3a7bd5',

  // Gradient simulation colors (used for the background)
  GRADIENT_TOP: '#f0f0ff', // Light Blue/Purple
  GRADIENT_MIDDLE: '#ffe6f0', // Light Pink
  GRADIENT_BOTTOM: '#fff0e6', // Light Yellow/Orange
};

export const COMMON_STYLES = StyleSheet.create({
  // --- Containers and Layout ---
  fullScreenContainer: {
    flex: 1,
    backgroundColor: THEME.GRADIENT_TOP, // Base color for a clean start
  },
  gradientOverlay: {
    // In a real project, replace this with ExpoLinearGradient for the smooth effect
    ...StyleSheet.absoluteFillObject,
    backgroundColor: THEME.GRADIENT_MIDDLE,
    opacity: 0.5, // Subtle blending of the gradient colors
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Important for removing any unwanted default padding
    padding: 0, 
    margin: 0, 
  },
  
  // --- Card Styling (The main white box) ---
  card: {
    width: width > 400 ? 380 : width * 0.9, // Responsive width: Fixed max width on large screens, 90% width on small screens
    backgroundColor: THEME.SECONDARY,
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 8,
  },

  // --- Typography ---
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: THEME.PRIMARY,
    marginBottom: 30,
    textAlign: 'center',
  },

  // --- Inputs ---
  inputLabel: {
    fontSize: 14,
    color: THEME.PRIMARY,
    fontWeight: '500',
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    height: 50,
    backgroundColor: THEME.INPUT_BG,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: THEME.GOOGLE_BORDER,
  },

  // --- Buttons ---
  buttonBase: {
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
