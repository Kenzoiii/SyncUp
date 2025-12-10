import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';
import '../styles/LandingPage.css';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="landing-page">
     

      {/* Main Content */}
      <div className="main-content">
        <div className="landing-content">
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

          {/* Right Side - Action Buttons */}
          <div className="action-section">
            <button className="btn btn-primary btn-large" onClick={handleSignIn}>
              Sign in
            </button>
            <button className="btn btn-primary btn-large" onClick={handleRegister}>
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
