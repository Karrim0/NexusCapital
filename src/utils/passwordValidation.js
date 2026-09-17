/**
 * Validates password strength according to security requirements:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export const validatePassword = (password) => {
  const errors = [];

  if (!password || password.length < 8) {
    errors.push("passwordMinLength");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("passwordUppercase");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("passwordLowercase");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("passwordNumber");
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push("passwordSpecial");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Get password strength indicator (weak, medium, strong)
 */
export const getPasswordStrength = (password) => {
  if (!password) return "weak";

  let strength = 0;

  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  if (strength <= 2) return "weak";
  if (strength <= 4) return "medium";
  return "strong";
};

/**
 * Get password requirements text for display
 */
export const getPasswordRequirements = () => {
  return [
    "passwordRequirement.minLength",
    "passwordRequirement.uppercase",
    "passwordRequirement.lowercase",
    "passwordRequirement.number",
    "passwordRequirement.special",
  ];
};
