import React, { useState, useEffect } from 'react';

const Home = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const fullText = 'Your journey to seamless onboarding starts here';
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
        index++;
      } else {
        setIsTypingComplete(true);
        setTimeout(() => {
          setDisplayedText('');
          setIsTypingComplete(false);
          index = 0;
        }, 90000); 
      }
    }, 250); 
    return () => clearInterval(timer);
  }, [isTypingComplete]);

  const handleGetStarted = () => {
    window.location.href = '/register';
  };

  const handleSignIn = () => {
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      backgroundImage: 'url(/images/background.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <nav className="relative z-10 pt-4 px-6">
        <div className="bg-white rounded-2xl shadow-lg max-w-7xl mx-auto">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  OnboardPro
                </span>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <a href="#home" className="text-gray-700 hover:text-blue-600 font-medium">Home</a>
                <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium">About</a>
                <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium">Features</a>
                <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium">Contact</a>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleSignIn}
                  className="text-gray-700 hover:text-blue-600 font-medium px-4 py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Log In
                </button>
                <button 
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium shadow-lg transition-all"
                >
                  Sign Up
                </button>
                <button 
                  onClick={handleGetStarted}
                  className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 font-medium shadow-lg transition-all"
                >
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-20 px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center min-h-[calc(100vh-200px)]">
            <div className="flex-1 max-w-2xl">
              <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight min-h-[280px]" style={{ fontFamily: 'Georgia, serif' }}>
                {displayedText.split('seamless onboarding').map((part, index, array) => (
                  <React.Fragment key={index}>
                    <span className="bg-gradient-to-r from-blue-100 to-white bg-clip-text text-transparent">
                      {part}
                    </span>
                    {index < array.length - 1 && (
                      <span className="bg-gradient-to-r from-blue-200 via-blue-100 to-blue-50 bg-clip-text text-transparent" style={{ fontStyle: 'italic' }}>
                        seamless onboarding
                      </span>
                    )}
                  </React.Fragment>
                ))}
                {!isTypingComplete && <span className="animate-pulse text-white">|</span>}
              </h1>
              <p className="text-xl text-white text-opacity-90 mb-8 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                OnboardPro is a comprehensive employee onboarding platform that streamlines task management, document handling, and progress tracking. Connect new hires with personalized checklists and empower HR teams with powerful analytics and automation.
              </p>
              
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;