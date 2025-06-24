import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const Navigation = ({ 
  showBackToWelcome = false, 
  showBack = false, 
  showNext = false, 
  onBack, 
  onNext,
  backText = "Back",
  nextText = "Next",
}) => {
  const navigate = useNavigate();
  
  const handleBackToWelcome = () => {
    if (window.confirm('Are you sure you want to leave this game and return to the main menu?')) {
        navigate('/');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#fdfaf6] bg-opacity-90 backdrop-blur-sm z-50 border-b border-brand-brown-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Left-side Actions */}
          <div className="flex items-center gap-4 min-w-[160px]">
            {showBackToWelcome ? (
              <button
                onClick={handleBackToWelcome}
                className="text-brand-brown-700 hover:text-brand-terracotta-600 font-semibold transition-colors text-sm"
              >
                &larr; Back to Welcome
              </button>
            ) : showBack ? (
              <button
                onClick={onBack}
                className="text-brand-brown-700 hover:text-brand-terracotta-600 font-semibold transition-colors text-sm"
              >
                &larr; {backText}
              </button>
            ) : (
              <div className="w-[120px]" />
            )}
          </div>
          
          {/* Right-side Actions */}
          <div className="flex items-center gap-4 min-w-[160px] justify-end">
            {showNext ? (
              <button
                onClick={onNext}
                className="text-brand-brown-700 hover:text-brand-terracotta-600 font-semibold transition-colors text-sm"
              >
                {nextText} &rarr;
              </button>
            ) : (
              <div className="w-[120px]" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

Navigation.propTypes = {
  showBackToWelcome: PropTypes.bool,
  showBack: PropTypes.bool,
  showNext: PropTypes.bool,
  onBack: PropTypes.func,
  onNext: PropTypes.func,
  backText: PropTypes.string,
  nextText: PropTypes.string,
};

export default Navigation; 