import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation = ({ 
  showBackToWelcome = false, 
  showBack = false, 
  showNext = false, 
  onBack, 
  onNext,
  backText = "Back",
  nextText = "Next",
  className = ""
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleBackToWelcome = () => {
    if (window.confirm('Are you sure you want to leave this game and return to the main menu?')) {
        navigate('/');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#fdfaf6] bg-opacity-90 backdrop-blur-sm z-50 border-b border-brand-brown-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Left-side Actions */}
          <div className="flex items-center gap-4">
            {showBackToWelcome && (
              <button
                onClick={handleBackToWelcome}
                className="text-brand-brown-700 hover:text-brand-terracotta-600 font-semibold transition-colors text-sm"
              >
                &larr; Back to Welcome
              </button>
            )}
            {showBack && (
              <button
                onClick={onBack}
                className="text-brand-brown-700 hover:text-brand-terracotta-600 font-semibold transition-colors text-sm"
              >
                &larr; {backText}
              </button>
            )}
          </div>
          
          {/* Right-side Actions */}
          <div className="flex items-center gap-4">
            {showNext && (
               <button
                onClick={onNext}
                className="text-brand-brown-700 hover:text-brand-terracotta-600 font-semibold transition-colors text-sm"
              >
                {nextText} &rarr;
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation; 