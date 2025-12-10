import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BarChart3, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { authAPI, RegisterRequest, usersAPI } from '../services/api';
import '../styles/RegisterPage.css';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    teamName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.teamName.trim()) {
      newErrors.teamName = 'Team name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (step === 1 && validateStep1()) {
      try {
        const res = await usersAPI.checkNameAvailability(formData.fullName.trim());
        if (!res.available) {
          setErrors(prev => ({ ...prev, fullName: 'Name already in use' }));
          return; // Block moving to step 2
        }
        setStep(2);
      } catch (err) {
        // If API fails, be conservative and block progression
        setErrors(prev => ({ ...prev, fullName: 'Unable to verify name. Please try again.' }));
      }
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 2 && validateStep2()) {
      try {
        const registerData: RegisterRequest = {
          fullName: formData.fullName,
          teamName: formData.teamName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        };
        
        const response = await authAPI.register(registerData);
        
        // Store token and user data
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify({
          userId: response.userId,
          email: response.email,
          fullName: response.fullName,
          teamId: response.teamId,
          teamName: response.teamName
        }));
        
        navigate('/dashboard');
      } catch (error: any) {
        console.error('Registration error:', error);
        const serverMessage: string | undefined = error?.response?.data?.message || error?.response?.data || error?.message;
        const msg = (typeof serverMessage === 'string') ? serverMessage : 'Registration failed. Please try again.';
        // Map known messages to specific fields
        if (error?.response?.status === 403) {
          // Treat forbidden here as duplicate or blocked registration, show under email for clarity
          setErrors(prev => ({ ...prev, email: 'Email already in use' }));
        } else if (msg.toLowerCase().includes('email')) {
          setErrors(prev => ({ ...prev, email: msg }));
        } else if (msg.toLowerCase().includes('name')) {
          setErrors(prev => ({ ...prev, fullName: msg }));
        } else if (msg.toLowerCase().includes('password')) {
          setErrors(prev => ({ ...prev, confirmPassword: msg }));
        } else {
          setErrors({ general: msg });
        }
      }
    }
  };

  return (
    <div className="register-page">

      {/* Main Content */}
      <div className="main-content">
        <div className="register-content">
          {/* Left Side - Branding */}
          <div className="branding-section">
            <h1 className="brand-title">
              <span className="brand-sync">Sync</span>
              <span className="brand-up">Up</span>
            </h1>
            <p className="brand-tagline">
              Achieve professional harmony. It's all in the <span className="tagline-sync">sync.</span>
            </p>
          </div>

          {/* Right Side - Registration Form */}
          <div className="form-section">
            <div className="form-container">
              <div className="form-header">
                <h2>Create Account</h2>
                <div className="step-indicator">
                  <div className={`step ${step === 1 ? 'active' : ''}`}>1</div>
                  <div className="step-line"></div>
                  <div className={`step ${step === 2 ? 'active' : ''}`}>2</div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="register-form">
                {step === 1 ? (
                  <>
                    <div className="form-group">
                      <div className="input-container">
                        <User className="input-icon" size={20} />
                        <input
                          type="text"
                          name="fullName"
                          placeholder="Full name"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className={`input ${errors.fullName ? 'input-error' : ''}`}
                        />
                      </div>
                      {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                    </div>

                    <div className="form-group">
                      <div className="input-container">
                        <User className="input-icon" size={20} />
                        <input
                          type="text"
                          name="teamName"
                          placeholder="Project Team name"
                          value={formData.teamName}
                          onChange={handleInputChange}
                          className={`input ${errors.teamName ? 'input-error' : ''}`}
                        />
                      </div>
                      {errors.teamName && <span className="error-message">{errors.teamName}</span>}
                    </div>

                    <div className="team-info">
                      <p>
                        Enter your company or team name. If the team name already exists, 
                        you will be added as a member. If it's a new name, 
                        you'll be the administrator of this team.
                      </p>
                    </div>

                    <button type="button" className="btn btn-primary btn-full" onClick={handleNext}>
                      Next
                    </button>
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <div className="input-container">
                        <Mail className="input-icon" size={20} />
                        <input
                          type="email"
                          name="email"
                          placeholder="Email address"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`input ${errors.email ? 'input-error' : ''}`}
                        />
                      </div>
                      {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                      <div className="input-container">
                        <Lock className="input-icon" size={20} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`input ${errors.password ? 'input-error' : ''}`}
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    <div className="form-group">
                      <div className="input-container">
                        <Lock className="input-icon" size={20} />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          placeholder="Confirm Password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`input ${errors.confirmPassword ? 'input-error' : ''}`}
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                    </div>

                    <div className="form-actions">
                      <button type="button" className="btn btn-secondary" onClick={handleBack}>
                        Back
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Register
                      </button>
                    </div>
                  </>
                )}

                <div className="form-footer">
                  <p>
                    Already have an account? <Link to="/login" className="link">Sign in here</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
