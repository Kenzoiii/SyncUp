import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BarChart3, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { authAPI, LoginRequest } from '../services/api';
import '../styles/LoginPage.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
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

  const validateForm = () => {
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const loginData: LoginRequest = {
          email: formData.email,
          password: formData.password
        };
        
        const response = await authAPI.login(loginData);
        
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
        console.error('Login error:', error);
        setErrors({ general: error.response?.data || 'Login failed. Please try again.' });
      }
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // TODO: Implement social login
  };

  return (
    <div className="login-page">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-icon">
          <BarChart3 size={24} />
        </div>
        <div className="sidebar-nav">
          <div className="sidebar-item">My tasks</div>
          <div className="sidebar-item">Projects</div>
          <div className="sidebar-item">Dashboard</div>
        </div>
        <div className="sidebar-logo">SyncUp</div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="login-content">
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

          {/* Right Side - Login Form */}
          <div className="form-section">
            <div className="form-container">
              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <div className="input-container">
                    <Mail className="input-icon" size={20} />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
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

                <div className="form-options">
                  <Link to="/forgot-password" className="forgot-password">
                    Forgot Password?
                  </Link>
                </div>

                <button type="submit" className="btn btn-primary btn-full">
                  Sign in
                </button>

                <div className="divider">
                  <span>or</span>
                </div>

                <div className="social-login">
                  <button
                    type="button"
                    className="btn btn-social btn-apple"
                    onClick={() => handleSocialLogin('Apple')}
                  >
                    <span className="social-icon">🍎</span>
                    Sign in with Apple
                  </button>
                  <button
                    type="button"
                    className="btn btn-social btn-google"
                    onClick={() => handleSocialLogin('Google')}
                  >
                    <span className="social-icon">G</span>
                    Sign in with Google
                  </button>
                </div>

                <div className="form-footer">
                  <p>
                    Don't have an account? <Link to="/register" className="link">Register here</Link>
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

export default LoginPage;
