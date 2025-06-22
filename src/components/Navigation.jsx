import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGame } from '../context/GameContext';

const Navigation = ({ 
  showBackToWelcome = true, 
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
  
  // Try to get game context, but don't fail if it's not available
  let gameActions = null;
  try {
    const { actions } = useGame();
    gameActions = actions;
  } catch (error) {
    // Context not available, that's okay
  }

  const handleBackToWelcome = () => {
    console.log('Back to Welcome clicked');
    
    // Reset game state to show welcome page
    if (gameActions) {
      console.log('Game actions available, calling backToWelcome');
      gameActions.backToWelcome();
    } else {
      console.log('Game actions not available');
    }
    
    // Navigate to root
    console.log('Navigating to /');
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-brand-brown-50/90 backdrop-blur-sm border-b border-brand-brown-200 shadow-soft ${className}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Back to Welcome */}
          {showBackToWelcome && (
            <button
              onClick={handleBackToWelcome}
              className="text-brand-brown-700 hover:text-brand-brown-800 font-fredoka font-medium transition-colors duration-200 flex items-center gap-2 min-h-[40px] px-3 py-2 rounded-lg hover:bg-brand-brown-100"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">Back to Welcome</span>
              <span className="sm:hidden">Back</span>
            </button>
          )}

          {/* Center - Optional Back/Next navigation (desktop) */}
          {(showBack || showNext) && (
            <div className="hidden md:flex items-center gap-3">
              {showBack && (
                <button
                  onClick={onBack}
                  className="bg-brand-brown-100 hover:bg-brand-brown-200 text-brand-brown-700 font-fredoka font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-soft hover:shadow-medium min-h-[40px] flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {backText}
                </button>
              )}
              
              {showNext && (
                <button
                  onClick={onNext}
                  className="bg-gradient-to-r from-brand-terracotta-500 to-brand-terracotta-400 hover:from-brand-terracotta-600 hover:to-brand-terracotta-500 text-white font-fredoka font-bold px-4 py-2 rounded-lg transition-all duration-200 shadow-soft hover:shadow-medium min-h-[40px] flex items-center gap-2"
                >
                  {nextText}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Right side - Mobile menu button */}
          {(showBack || showNext) && (
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-brand-brown-700 hover:text-brand-brown-800 font-fredoka font-medium transition-colors duration-200 flex items-center gap-2 min-h-[40px] px-3 py-2 rounded-lg hover:bg-brand-brown-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>Menu</span>
            </button>
          )}

          {/* Empty div for balance when no mobile menu */}
          {!(showBack || showNext) && <div className="w-20"></div>}
        </div>

        {/* Mobile menu dropdown */}
        {(showBack || showNext) && isMobileMenuOpen && (
          <div className="md:hidden mt-3 pb-3 border-t border-brand-brown-200">
            <div className="flex flex-col gap-2 pt-3">
              {showBack && (
                <button
                  onClick={() => {
                    onBack();
                    setIsMobileMenuOpen(false);
                  }}
                  className="bg-brand-brown-100 hover:bg-brand-brown-200 text-brand-brown-700 font-fredoka font-medium px-4 py-3 rounded-lg transition-all duration-200 shadow-soft hover:shadow-medium min-h-[44px] flex items-center gap-2 justify-center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {backText}
                </button>
              )}
              
              {showNext && (
                <button
                  onClick={() => {
                    onNext();
                    setIsMobileMenuOpen(false);
                  }}
                  className="bg-gradient-to-r from-brand-terracotta-500 to-brand-terracotta-400 hover:from-brand-terracotta-600 hover:to-brand-terracotta-500 text-white font-fredoka font-bold px-4 py-3 rounded-lg transition-all duration-200 shadow-soft hover:shadow-medium min-h-[44px] flex items-center gap-2 justify-center"
                >
                  {nextText}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation; 