import React, { useState, useEffect } from 'react'

const App = () => {
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [showResult, setShowResult] = useState(false)
  const [copied, setCopied] = useState(false)
  
  // Auth states
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' or 'signup'
  const [authData, setAuthData] = useState({ email: '', password: '', name: '' })
  const [userUrls, setUserUrls] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [anonymousUrlCount, setAnonymousUrlCount] = useState(0)

  // Animation trigger states
  const [headerVisible, setHeaderVisible] = useState(false)
  const [cardVisible, setCardVisible] = useState(false)
  const [featuresVisible, setFeaturesVisible] = useState(false)

  useEffect(() => {
    // Staggered animation entrance
    setTimeout(() => setHeaderVisible(true), 200)
    setTimeout(() => setCardVisible(true), 600)
    setTimeout(() => setFeaturesVisible(true), 1000)
    
    // Check for existing auth token
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user_data')
    if (token && userData) {
      setIsAuthenticated(true)
      setUser(JSON.parse(userData))
    }
    
    // Reset anonymous URL count on app restart (don't persist in localStorage)
    setAnonymousUrlCount(0)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!url) return

    // Check if anonymous user has reached limit
    if (!isAuthenticated && anonymousUrlCount >= 3) {
      setError('You have reached the limit of 3 URLs. Please sign up to create unlimited URLs!')
      setShowAuthModal(true)
      setAuthMode('signup')
      return
    }

    setIsLoading(true)
    setError('')
    setShowResult(false)
    
    try {
      const headers = {
        'Content-Type': 'application/json',
      }
      
      // Add auth token if user is logged in
      const token = localStorage.getItem('auth_token')
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://url-shorter-doie8camf-m-talha-waris-projects.vercel.app'}/api/create`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ url }),
      })
      
      const data = await response.json()
      if (response.ok) {
        setShortUrl(data.shortUrl)
        setTimeout(() => setShowResult(true), 500)
        
        // Update counters
        if (!isAuthenticated) {
          const newCount = anonymousUrlCount + 1
          setAnonymousUrlCount(newCount)
          // Don't persist anonymous count - it resets on app restart
        } else {
          // Add to user's URL history
          const newUrl = {
            id: Date.now(),
            original: url,
            shortened: data.shortUrl,
            createdAt: new Date().toLocaleString()
          }
          const updatedUrls = [newUrl, ...userUrls]
          setUserUrls(updatedUrls)
          localStorage.setItem(`user_urls_${user.id}`, JSON.stringify(updatedUrls))
        }
      } else {
        setError(data.error || 'Something went wrong')
      }
    } catch (err) {
      setError('Failed to shorten URL. Please try again.')
    }
    
    setIsLoading(false)
  }

  const handleAuth = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const endpoint = authMode === 'login' ? 'login' : 'signup'
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://url-shorter-doie8camf-m-talha-waris-projects.vercel.app'}/api/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authData),
      })

      const data = await response.json()
      
      if (response.ok) {
        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('user_data', JSON.stringify(data.user))
        setIsAuthenticated(true)
        setUser(data.user)
        setShowAuthModal(false)
        setAuthData({ email: '', password: '', name: '' })
        
        // Load user's URL history
        const savedUrls = localStorage.getItem(`user_urls_${data.user.id}`)
        if (savedUrls) {
          setUserUrls(JSON.parse(savedUrls))
        }
      } else {
        setError(data.error || 'Authentication failed')
      }
    } catch (err) {
      setError('Authentication failed. Please try again.')
    }
    
    setIsLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    localStorage.removeItem(`user_urls_${user?.id}`)
    setIsAuthenticated(false)
    setUser(null)
    setUserUrls([])
    setShowHistory(false)
    setShortUrl('')
    setUrl('')
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const testRedirect = () => {
    window.open(shortUrl, '_blank')
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const themeClasses = isDarkMode 
    ? "min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"
    : "min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"

  return (
    <div className={`${themeClasses} transition-all duration-1000 ease-in-out relative overflow-hidden`}>
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full ${isDarkMode ? 'bg-blue-600/20' : 'bg-blue-300/30'} blur-3xl animate-pulse`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full ${isDarkMode ? 'bg-indigo-600/20' : 'bg-indigo-300/30'} blur-3xl animate-pulse delay-1000`}></div>
        <div className={`absolute top-1/2 right-1/3 w-64 h-64 rounded-full ${isDarkMode ? 'bg-cyan-600/20' : 'bg-cyan-300/30'} blur-3xl animate-pulse delay-500`}></div>
      </div>

      {/* Floating Theme Toggle & Auth */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        {/* Auth Buttons */}
        {!isAuthenticated ? (
          <div className="flex gap-2">
            <button
              onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' 
                  : 'bg-black/10 hover:bg-black/20 text-gray-800 border border-black/20'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setAuthMode('signup'); setShowAuthModal(true); }}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Sign Up
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' 
                  : 'bg-black/10 hover:bg-black/20 text-gray-800 border border-black/20'
              }`}
            >
              My URLs ({userUrls.length})
            </button>
            <span className={`px-3 py-1 rounded-lg text-sm ${
              isDarkMode ? 'text-white/80' : 'text-gray-600'
            }`}>
              Welcome, {user?.name || user?.email}
            </span>
            <button
              onClick={handleLogout}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              Logout
            </button>
          </div>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`relative p-4 rounded-full backdrop-blur-lg transition-all duration-500 hover:scale-110 active:scale-95 ${
            isDarkMode 
              ? 'bg-white/10 border border-white/20 hover:bg-white/20' 
              : 'bg-black/10 border border-black/20 hover:bg-black/20'
          }`}
        >
          <div className="relative w-6 h-6">
            {/* Light Bulb Animation */}
            <div className={`absolute inset-0 transition-all duration-500 ${isDarkMode ? 'opacity-0 rotate-180 scale-0' : 'opacity-100 rotate-0 scale-100'}`}>
              <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .6.4 1 1 1h6c.6 0 1-.4 1-1v-2.3c1.8-1.2 3-3.3 3-5.7 0-3.9-3.1-7-7-7zm-3 15v1h6v-1H9zm0 2v1h6v-1H9z"/>
                <circle cx="12" cy="9" r="3" className="animate-pulse"/>
              </svg>
              {/* Light rays */}
              <div className="absolute inset-0 animate-spin" style={{animationDuration: '4s'}}>
                <div className="absolute top-0 left-1/2 w-0.5 h-2 -mt-4 -ml-0.25 bg-yellow-400 rounded-full opacity-60"></div>
                <div className="absolute top-0 right-0 w-0.5 h-2 -mt-3 -mr-1 bg-yellow-400 rounded-full opacity-40 rotate-45"></div>
                <div className="absolute right-0 top-1/2 w-2 h-0.5 -mr-4 -mt-0.25 bg-yellow-400 rounded-full opacity-60"></div>
                <div className="absolute bottom-0 right-0 w-0.5 h-2 -mb-3 -mr-1 bg-yellow-400 rounded-full opacity-40 rotate-45"></div>
                <div className="absolute bottom-0 left-1/2 w-0.5 h-2 -mb-4 -ml-0.25 bg-yellow-400 rounded-full opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-0.5 h-2 -mb-3 -ml-1 bg-yellow-400 rounded-full opacity-40 rotate-45"></div>
                <div className="absolute left-0 top-1/2 w-2 h-0.5 -ml-4 -mt-0.25 bg-yellow-400 rounded-full opacity-60"></div>
                <div className="absolute top-0 left-0 w-0.5 h-2 -mt-3 -ml-1 bg-yellow-400 rounded-full opacity-40 rotate-45"></div>
              </div>
            </div>
            
            {/* Moon Animation */}
            <div className={`absolute inset-0 transition-all duration-500 ${isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-0'}`}>
              <svg className="w-6 h-6 text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.1 2 5 5.1 5 9s3.1 7 7 7c1.9 0 3.6-.8 4.9-2 .4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0C14.6 13.4 13.3 14 12 14c-2.8 0-5-2.2-5-5s2.2-5 5-5c.6 0 1-.4 1-1s-.4-1-1-1z"/>
              </svg>
              {/* Stars */}
              <div className="absolute -top-1 -right-1 w-1 h-1 bg-blue-200 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-1 -left-1 w-0.5 h-0.5 bg-blue-200 rounded-full animate-pulse delay-300"></div>
              <div className="absolute top-0 -left-2 w-0.5 h-0.5 bg-blue-200 rounded-full animate-pulse delay-700"></div>
            </div>
          </div>
        </button>
      </div>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`max-w-md w-full rounded-2xl p-8 ${
            isDarkMode 
              ? 'bg-slate-800 border border-white/10' 
              : 'bg-white border border-gray-200'
          } shadow-2xl transform transition-all duration-300`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <button
                onClick={() => setShowAuthModal(false)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-white/90' : 'text-gray-700'
                  }`}>
                    Name
                  </label>
                  <input
                    type="text"
                    value={authData.name}
                    onChange={(e) => setAuthData({...authData, name: e.target.value})}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      isDarkMode 
                        ? 'bg-white/5 border-white/20 text-white placeholder-white/50 focus:border-blue-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    placeholder="Enter your name"
                    required={authMode === 'signup'}
                  />
                </div>
              )}
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-white/90' : 'text-gray-700'
                }`}>
                  Email
                </label>
                <input
                  type="email"
                  value={authData.email}
                  onChange={(e) => setAuthData({...authData, email: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'bg-white/5 border-white/20 text-white placeholder-white/50 focus:border-blue-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-white/90' : 'text-gray-700'
                }`}>
                  Password
                </label>
                <input
                  type="password"
                  value={authData.password}
                  onChange={(e) => setAuthData({...authData, password: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'bg-white/5 border-white/20 text-white placeholder-white/50 focus:border-blue-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {error && (
                <div className={`p-3 rounded-lg ${
                  isDarkMode ? 'bg-red-500/20 text-red-200' : 'bg-red-50 text-red-600'
                } text-sm`}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:transform hover:scale-[1.02]'
                } bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg`}
              >
                {isLoading ? 'Please wait...' : (authMode === 'login' ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'signup' : 'login')
                  setError('')
                }}
                className={`text-sm ${
                  isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                } transition-colors`}
              >
                {authMode === 'login' 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className={`text-center mb-8 sm:mb-12 transition-all duration-1000 transform ${
          headerVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
        }`}>
          <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight transition-all duration-500 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            URL
            <span className={`bg-gradient-to-r ${isDarkMode ? 'from-blue-400 to-cyan-400' : 'from-blue-600 to-indigo-600'} bg-clip-text text-transparent ml-2 transition-all duration-500`}>
              Shorter
            </span>
          </h1>
          <p className={`text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed transition-colors duration-500 ${
            isDarkMode ? 'text-white/80' : 'text-gray-600'
          }`}>
            Transform your long URLs into short, shareable links in seconds. 
            Fast, reliable, and completely free.
          </p>
          
          {/* Anonymous User Warning */}
          {!isAuthenticated && (
            <div className={`mt-6 max-w-lg mx-auto p-4 rounded-xl ${
              anonymousUrlCount >= 2 
                ? (isDarkMode ? 'bg-orange-500/20 border border-orange-400/30' : 'bg-orange-50 border border-orange-200')
                : (isDarkMode ? 'bg-blue-500/20 border border-blue-400/30' : 'bg-blue-50 border border-blue-200')
            }`}>
              <p className={`text-sm text-center ${
                anonymousUrlCount >= 2 
                  ? (isDarkMode ? 'text-orange-200' : 'text-orange-700')
                  : (isDarkMode ? 'text-blue-200' : 'text-blue-700')
              }`}>
                {anonymousUrlCount >= 2 
                  ? `⚠️ You have ${3 - anonymousUrlCount} URL${3 - anonymousUrlCount !== 1 ? 's' : ''} left. Sign up for unlimited URLs!`
                  : `🎯 Anonymous users get 3 free URLs. You've used ${anonymousUrlCount}/3. Sign up for unlimited access!`
                }
              </p>
            </div>
          )}
        </div>

        {/* Main Card */}
        <div className={`max-w-4xl mx-auto transition-all duration-1000 transform ${
          cardVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          
          {/* URL History Panel for Authenticated Users */}
          {isAuthenticated && showHistory && (
            <div className={`mb-8 backdrop-blur-lg ${
              isDarkMode 
                ? 'bg-white/5 border border-white/10 ring-1 ring-white/20' 
                : 'bg-white/80 border border-gray-200/50 ring-1 ring-gray-200/30 shadow-xl'
            } rounded-3xl p-6 md:p-8 shadow-2xl transition-all duration-500`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Your URL History ({userUrls.length})
                </h3>
                <button
                  onClick={() => setShowHistory(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {userUrls.length === 0 ? (
                <p className={`text-center py-8 ${
                  isDarkMode ? 'text-white/70' : 'text-gray-600'
                }`}>
                  No URLs created yet. Start shortening some links!
                </p>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {userUrls.map((urlItem) => (
                    <div key={urlItem.id} className={`p-4 rounded-xl ${
                      isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'
                    }`}>
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium mb-1 ${
                            isDarkMode ? 'text-white/90' : 'text-gray-700'
                          }`}>
                            Original URL
                          </p>
                          <p className={`text-sm break-all ${
                            isDarkMode ? 'text-white/70' : 'text-gray-600'
                          }`}>
                            {urlItem.original}
                          </p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium mb-1 ${
                            isDarkMode ? 'text-white/90' : 'text-gray-700'
                          }`}>
                            Short URL
                          </p>
                          <p className={`text-sm break-all font-mono ${
                            isDarkMode ? 'text-blue-300' : 'text-blue-600'
                          }`}>
                            {urlItem.shortened}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => navigator.clipboard.writeText(urlItem.shortened)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              isDarkMode 
                                ? 'bg-white/10 hover:bg-white/20 text-white' 
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            }`}
                          >
                            Copy
                          </button>
                          <p className={`text-xs text-center ${
                            isDarkMode ? 'text-white/50' : 'text-gray-500'
                          }`}>
                            {urlItem.createdAt}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className={`backdrop-blur-lg ${
            isDarkMode 
              ? 'bg-white/5 border border-white/10 ring-1 ring-white/20' 
              : 'bg-white/80 border border-gray-200/50 ring-1 ring-gray-200/30 shadow-xl'
          } rounded-3xl p-8 md:p-12 shadow-2xl transition-all duration-500`}>
            {/* URL Input Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <label htmlFor="url" className={`block text-lg font-medium mb-3 transition-colors duration-500 ${
                  isDarkMode ? 'text-white/90' : 'text-gray-700'
                }`}>
                  Enter your long URL
                </label>
                <div className="relative">
                  <input
                    id="url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/very-long-url-that-needs-shortening"
                    className={`w-full px-6 py-4 backdrop-blur-sm border rounded-2xl 
                             placeholder-gray-500 focus:outline-none focus:ring-4 transition-all duration-300 text-lg shadow-lg ${
                               isDarkMode 
                                 ? 'bg-white/95 border-gray-200 text-gray-800 focus:ring-blue-500/30 focus:border-blue-400'
                                 : 'bg-white/95 border-gray-300 text-gray-900 focus:ring-blue-500/50 focus:border-blue-500'
                             }`}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-6">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !url}
                className={`w-full py-4 px-8 font-bold text-lg rounded-2xl shadow-lg 
                         transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                         focus:outline-none focus:ring-4 ${
                           isDarkMode
                             ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white focus:ring-blue-500/50'
                             : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white focus:ring-blue-500/50'
                         }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Shortening...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Shorten URL</span>
                  </div>
                )}
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <div className={`mt-6 p-4 rounded-xl transition-colors duration-500 ${
                isDarkMode 
                  ? 'bg-red-500/20 border border-red-400/30' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <p className={`text-center font-medium ${
                  isDarkMode ? 'text-red-100' : 'text-red-600'
                }`}>{error}</p>
              </div>
            )}

            {/* Result */}
            {shortUrl && (
              <div className={`mt-8 p-6 rounded-2xl ring-1 transition-all duration-500 ${
                isDarkMode 
                  ? 'bg-emerald-500/10 border border-emerald-400/20 ring-emerald-400/30' 
                  : 'bg-emerald-50 border border-emerald-200 ring-emerald-200/50'
              }`}>
                <h3 className={`font-bold text-xl mb-4 text-center transition-colors duration-500 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>🎉 Your short URL is ready!</h3>
                <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                  <div className="flex-1 p-4 bg-white/98 rounded-xl shadow-inner border border-gray-100">
                    <p className="text-gray-800 font-mono text-lg break-all">{shortUrl}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={copyToClipboard}
                      className={`px-6 py-3 font-medium rounded-xl transition-all duration-300 
                               focus:outline-none focus:ring-4 shadow-lg ${
                                 copied ? 'bg-green-500 text-white' : ''
                               } ${
                                 isDarkMode && !copied
                                   ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 focus:ring-blue-500/30'
                                   : !copied && 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 hover:border-gray-300 focus:ring-blue-500/50'
                               }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={copied ? "M5 13l4 4L19 7" : "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"} />
                        </svg>
                        <span>{copied ? 'Copied!' : 'Copy'}</span>
                      </div>
                    </button>
                    
                    <button
                      onClick={testRedirect}
                      className={`px-6 py-3 font-medium rounded-xl transition-all duration-300 
                               focus:outline-none focus:ring-4 shadow-lg ${
                                 isDarkMode
                                   ? 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-500 hover:border-blue-400 focus:ring-blue-500/30'
                                   : 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-500 hover:border-blue-400 focus:ring-blue-500/50'
                               }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span>Open</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className={`mt-20 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto transition-all duration-1000 transform ${
          featuresVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="text-center">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors duration-500 ${
              isDarkMode ? 'bg-white/20' : 'bg-blue-100'
            }`}>
              <svg className={`w-8 h-8 transition-colors duration-500 ${
                isDarkMode ? 'text-white' : 'text-blue-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className={`text-xl font-bold mb-2 transition-colors duration-500 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Lightning Fast</h3>
            <p className={`transition-colors duration-500 ${
              isDarkMode ? 'text-white/70' : 'text-gray-600'
            }`}>Get your shortened URLs in milliseconds</p>
          </div>
          
          <div className="text-center">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors duration-500 ${
              isDarkMode ? 'bg-white/20' : 'bg-green-100'
            }`}>
              <svg className={`w-8 h-8 transition-colors duration-500 ${
                isDarkMode ? 'text-white' : 'text-green-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className={`text-xl font-bold mb-2 transition-colors duration-500 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>{isAuthenticated ? 'Unlimited URLs' : 'Free Trial'}</h3>
            <p className={`transition-colors duration-500 ${
              isDarkMode ? 'text-white/70' : 'text-gray-600'
            }`}>
              {isAuthenticated 
                ? 'Create unlimited URLs and track them all' 
                : '3 free URLs for anonymous users, unlimited for members'
              }
            </p>
          </div>
          
          <div className="text-center">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors duration-500 ${
              isDarkMode ? 'bg-white/20' : 'bg-purple-100'
            }`}>
              <svg className={`w-8 h-8 transition-colors duration-500 ${
                isDarkMode ? 'text-white' : 'text-purple-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className={`text-xl font-bold mb-2 transition-colors duration-500 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>{isAuthenticated ? 'URL History' : 'Track & Manage'}</h3>
            <p className={`transition-colors duration-500 ${
              isDarkMode ? 'text-white/70' : 'text-gray-600'
            }`}>
              {isAuthenticated 
                ? 'Access all your URLs anytime, anywhere' 
                : 'Sign up to save and manage all your shortened URLs'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
