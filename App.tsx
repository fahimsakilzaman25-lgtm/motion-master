
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppStatus, AuthStatus, Question, QuizState, User } from './types';
import { generatePhysicsQuestions, getPerformanceFeedback } from './services/geminiService';
import { ICONS, PHYSICS_EQUATIONS, QUIZ_DURATION, TOTAL_QUESTIONS, AppLogo } from './constants';

// --- Helper Components ---

const Header: React.FC<{ 
  user: User | null; 
  onLogout: () => void; 
  isMuted: boolean; 
  toggleMute: () => void 
}> = ({ user, onLogout, isMuted, toggleMute }) => (
  <header className="py-4 px-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 transition-colors duration-500">
    <div className="max-w-6xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-4 group cursor-default">
        <AppLogo className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
          MotionMaster
        </h1>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
        <button 
          onClick={toggleMute}
          className={`p-2 rounded-lg border transition-all active:scale-95 group flex items-center gap-2 ${
            isMuted ? 'border-slate-800 bg-slate-900 text-slate-500' : 'border-blue-500/30 bg-blue-600/10 text-blue-400 animate-pulse-glow'
          }`}
          title={isMuted ? "Unmute motivational tune" : "Mute motivational tune"}
        >
          {isMuted ? <ICONS.VolumeMute className="w-5 h-5" /> : <ICONS.VolumeHigh className="w-5 h-5" />}
          <span className="text-[10px] font-bold uppercase tracking-tighter hidden sm:inline">Tune</span>
        </button>

        <div className="hidden lg:flex gap-4 text-xs font-medium uppercase tracking-widest text-slate-500">
          {PHYSICS_EQUATIONS.map((eq, i) => (
            <span key={i} className="math-font text-slate-400 hover:text-blue-400 transition-colors cursor-help" title={eq.description}>{eq.formula}</span>
          ))}
        </div>
        
        {user && (
          <div className="flex items-center gap-4 pl-4 md:pl-6 border-l border-slate-800 animate-scale-in">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-slate-200">{user.name}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-tighter">Researcher</div>
            </div>
            <button 
              onClick={onLogout}
              className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-lg transition-all active:scale-90 group"
              title="Sign Out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  </header>
);

const AuthScreen: React.FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password && (isLogin || name)) {
      onLogin({ name: name || email.split('@')[0], email });
    }
  };

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    setIsSocialLoading(provider);
    setTimeout(() => {
      onLogin({ 
        name: provider === 'google' ? 'Google Researcher' : 'Facebook Explorer', 
        email: `${provider}@social.lab` 
      });
      setIsSocialLoading(null);
    }, 1200);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6 animate-fade-in-up">
      <div className="w-full max-w-md">
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden animate-pulse-glow">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600"></div>
          
          <div className="text-center mb-8">
            <div className="inline-flex mb-4 animate-float">
              <AppLogo className="w-20 h-20" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {isLogin ? 'Command Center' : 'Recruit Registration'}
            </h2>
            <p className="text-slate-400 text-sm">
              {isLogin ? 'Access your physics laboratory' : 'Join the mission to master kinematics'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <button 
              onClick={() => handleSocialLogin('google')}
              disabled={!!isSocialLoading}
              className="flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-bold py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {isSocialLoading === 'google' ? (
                <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-sm">Google</span>
                </>
              )}
            </button>
            <button 
              onClick={() => handleSocialLogin('facebook')}
              disabled={!!isSocialLoading}
              className="flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {isSocialLoading === 'facebook' ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="text-sm">Facebook</span>
                </>
              )}
            </button>
          </div>

          <div className="relative flex items-center gap-4 mb-8">
            <div className="flex-grow h-px bg-slate-800"></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Or continue with</span>
            <div className="flex-grow h-px bg-slate-800"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="animate-scale-in">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 transition-all focus:ring-1 focus:ring-blue-500/50"
                  placeholder="Isaac Newton"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 transition-all focus:ring-1 focus:ring-blue-500/50"
                placeholder="physicist@lab.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 transition-all focus:ring-1 focus:ring-blue-500/50"
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={!!isSocialLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4 disabled:opacity-50"
            >
              {isLogin ? 'Authorize Access' : 'Initialize Account'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-800 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
            >
              {isLogin ? "New researcher? Create an account" : "Already have access? Sign in here"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingOverlay: React.FC = () => (
  <div className="fixed inset-0 bg-slate-950/90 z-[100] flex flex-col items-center justify-center p-6 text-center animate-fade-in-up">
    <div className="relative mb-8">
      <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full animate-pulse"></div>
      <AppLogo className="w-20 h-20 animate-spin relative z-10" />
    </div>
    <h2 className="text-2xl font-bold mb-2">Initializing Lab Equipment...</h2>
    <p className="text-slate-400 max-w-sm animate-pulse">
      Generating a fresh set of unique motion challenges using AI.
    </p>
  </div>
);

const LandingPage: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="max-w-4xl mx-auto py-12 px-6 lg:py-24 animate-fade-in-up">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <div className="mb-8">
          <AppLogo className="w-24 h-24 mb-6 animate-float" />
          <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm font-semibold mb-6 border border-blue-500/20 animate-scale-in">
            Master Kinematics
          </span>
          <h1 className="text-5xl lg:text-7xl font-extrabold mb-8 leading-tight">
            Conquer the <span className="text-blue-500">Laws</span> of Motion.
          </h1>
        </div>
        <p className="text-xl text-slate-400 mb-10 leading-relaxed">
          The three equations of motion are the foundation of classical physics. Test your ability to calculate velocity, displacement, and acceleration in real-world scenarios.
        </p>
        <button 
          onClick={onStart}
          className="group relative inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-600/30 active:scale-95 shadow-xl shadow-blue-600/20"
        >
          Begin Experiment
          <ICONS.Rocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>

      <div className="relative">
        <div className="absolute -inset-4 bg-blue-500/10 blur-3xl rounded-full animate-pulse-glow"></div>
        <div className="relative grid gap-4">
          {PHYSICS_EQUATIONS.map((eq, i) => (
            <div 
              key={i} 
              className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl hover:border-blue-500/30 transition-all duration-300 hover:translate-x-2 glass-card"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-xs font-bold text-blue-500 mb-1 uppercase tracking-tighter">{eq.description}</div>
              <div className="text-2xl math-font font-bold text-white">{eq.formula}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// --- Main App Component ---

export default function App() {
  const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.UNAUTHENTICATED);
  const [user, setUser] = useState<User | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  
  const [state, setState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: new Array(TOTAL_QUESTIONS).fill(null),
    score: 0,
    timeLeft: QUIZ_DURATION,
    status: AppStatus.IDLE
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Background Music
  useEffect(() => {
    audioRef.current = new Audio('https://cdn.pixabay.com/audio/2022/03/10/audio_af512f435d.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleStartMusic = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(err => console.debug("Audio play blocked by browser", err));
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('motion_master_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setAuthStatus(AuthStatus.AUTHENTICATED);
    }
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    setAuthStatus(AuthStatus.AUTHENTICATED);
    localStorage.setItem('motion_master_user', JSON.stringify(newUser));
    handleStartMusic();
  };

  const handleLogout = () => {
    setUser(null);
    setAuthStatus(AuthStatus.UNAUTHENTICATED);
    localStorage.removeItem('motion_master_user');
    setState(prev => ({ ...prev, status: AppStatus.IDLE }));
  };

  const startQuiz = async () => {
    handleStartMusic();
    setState(prev => ({ ...prev, status: AppStatus.LOADING }));
    try {
      const questions = await generatePhysicsQuestions();
      setState(prev => ({
        ...prev,
        questions,
        status: AppStatus.ACTIVE,
        timeLeft: QUIZ_DURATION,
        currentQuestionIndex: 0,
        userAnswers: new Array(TOTAL_QUESTIONS).fill(null),
        score: 0
      }));
    } catch (error) {
      alert("Failed to load questions. Please check your network or API key.");
      setState(prev => ({ ...prev, status: AppStatus.IDLE }));
    }
  };

  const finishQuiz = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    let finalScore = 0;
    setState(prev => {
      finalScore = prev.userAnswers.reduce((acc, ans, idx) => {
        return ans === prev.questions[idx]?.correctAnswer ? acc + 1 : acc;
      }, 0);
      return { ...prev, status: AppStatus.LOADING };
    });
    
    try {
      const feedback = await getPerformanceFeedback(finalScore, TOTAL_QUESTIONS);
      setState(prev => ({ 
        ...prev, 
        score: finalScore, 
        status: AppStatus.FINISHED,
        feedback 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        score: finalScore, 
        status: AppStatus.FINISHED,
        feedback: "Great effort completing the kinematics challenge!" 
      }));
    }
  }, []);

  useEffect(() => {
    if (state.status === AppStatus.ACTIVE) {
      timerRef.current = setInterval(() => {
        setState(prev => {
          if (prev.timeLeft <= 0) return prev;
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [state.status]);

  useEffect(() => {
    if (state.status === AppStatus.ACTIVE && state.timeLeft <= 0) {
      finishQuiz();
    }
  }, [state.timeLeft, state.status, finishQuiz]);

  const handleAnswerSelect = (optionIndex: number) => {
    const newUserAnswers = [...state.userAnswers];
    newUserAnswers[state.currentQuestionIndex] = optionIndex;
    setState(prev => ({ ...prev, userAnswers: newUserAnswers }));
  };

  const nextQuestion = () => {
    if (state.currentQuestionIndex < TOTAL_QUESTIONS - 1) {
      setState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 }));
    } else {
      finishQuiz();
    }
  };

  const prevQuestion = () => {
    if (state.currentQuestionIndex > 0) {
      setState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex - 1 }));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = state.questions[state.currentQuestionIndex];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col selection:bg-blue-500/30 transition-all duration-700">
      <Header 
        user={user} 
        onLogout={handleLogout} 
        isMuted={isMuted} 
        toggleMute={() => setIsMuted(!isMuted)} 
      />

      {state.status === AppStatus.LOADING && <LoadingOverlay />}

      <main className="flex-grow flex flex-col relative overflow-hidden">
        {/* Background Blobs for Atmosphere */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/5 blur-[120px] rounded-full animate-float"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-600/5 blur-[120px] rounded-full animate-float" style={{animationDelay: '1s'}}></div>

        {authStatus === AuthStatus.UNAUTHENTICATED ? (
          <AuthScreen onLogin={handleLogin} />
        ) : (
          <>
            {state.status === AppStatus.IDLE && (
              <LandingPage onStart={startQuiz} />
            )}

            {state.status === AppStatus.ACTIVE && currentQuestion && (
              <div className="max-w-3xl mx-auto w-full py-8 px-6 animate-fade-in-up">
                <div className="flex justify-between items-center mb-10">
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Progress</span>
                    <div className="flex items-center gap-4">
                      <div className="w-48 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-500 ease-out"
                          style={{ width: `${((state.currentQuestionIndex + 1) / TOTAL_QUESTIONS) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-slate-300">
                        {state.currentQuestionIndex + 1} / {TOTAL_QUESTIONS}
                      </span>
                    </div>
                  </div>

                  <div className={`flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 shadow-inner transition-all duration-300 ${state.timeLeft < 60 ? 'border-red-500/50 bg-red-500/5 animate-pulse-glow' : ''}`}>
                    <ICONS.Timer className={`w-5 h-5 ${state.timeLeft < 60 ? 'text-red-500 animate-shiver' : 'text-blue-500'}`} />
                    <span className={`font-mono font-bold text-lg ${state.timeLeft < 60 ? 'text-red-500' : 'text-slate-200'}`}>
                      {formatTime(state.timeLeft)}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 lg:p-12 shadow-2xl backdrop-blur-sm glass-card animate-scale-in">
                  <h3 className="text-2xl font-medium leading-relaxed mb-10 text-slate-100 transition-all duration-300">
                    {currentQuestion.question}
                  </h3>

                  <div className="grid gap-4">
                    {currentQuestion.options.map((option, idx) => {
                      const isSelected = state.userAnswers[state.currentQuestionIndex] === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleAnswerSelect(idx)}
                          className={`group flex items-center p-6 rounded-2xl border transition-all duration-300 text-left hover:translate-x-1 ${
                            isSelected 
                            ? 'bg-blue-600/10 border-blue-500 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                            : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900/80 hover:text-slate-200'
                          }`}
                          style={{ animationDelay: `${idx * 0.05}s` }}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-4 transition-all duration-300 ${
                            isSelected ? 'bg-blue-600 text-white scale-110 rotate-[360deg]' : 'bg-slate-800 text-slate-500'
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </div>
                          <span className="text-lg font-medium">{option}</span>
                          {isSelected && <ICONS.Check className="ml-auto text-blue-500 animate-scale-in" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between mt-12">
                  <button 
                    onClick={prevQuestion}
                    disabled={state.currentQuestionIndex === 0}
                    className="px-8 py-3 rounded-full font-bold transition-all disabled:opacity-0 hover:bg-slate-800 text-slate-400 hover:text-slate-200 active:scale-90"
                  >
                    Back
                  </button>
                  <button 
                    onClick={nextQuestion}
                    disabled={state.userAnswers[state.currentQuestionIndex] === null}
                    className="px-10 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-full font-bold shadow-lg shadow-blue-600/10 transition-all hover:scale-105 active:scale-95"
                  >
                    {state.currentQuestionIndex === TOTAL_QUESTIONS - 1 ? 'Finish Challenge' : 'Next Question'}
                  </button>
                </div>
              </div>
            )}

            {state.status === AppStatus.FINISHED && (
              <div className="max-w-4xl mx-auto w-full py-16 px-6 text-center animate-fade-in-up">
                <div className="mb-12 inline-block relative">
                  <div className="absolute -inset-8 bg-blue-500/20 blur-3xl rounded-full animate-pulse-glow"></div>
                  <div className="relative bg-slate-900 border-4 border-slate-800 w-48 h-48 rounded-full flex flex-col items-center justify-center shadow-2xl animate-scale-in">
                    <span className="text-5xl font-extrabold text-blue-400">{state.score}</span>
                    <span className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">/ {TOTAL_QUESTIONS}</span>
                  </div>
                </div>

                <h2 className="text-4xl font-bold mb-4 animate-scale-in" style={{animationDelay: '0.1s'}}>Mission Report</h2>
                <div className="max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                  <p className="text-xl text-slate-400 italic mb-10 leading-relaxed">
                    "{state.feedback}"
                  </p>

                  <div className="grid sm:grid-cols-2 gap-6 mb-16 text-left">
                    <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition-colors group">
                      <div className="flex items-center gap-3 text-blue-400 mb-2">
                        <ICONS.Brain className="w-5 h-5 group-hover:animate-float" />
                        <span className="text-sm font-bold uppercase tracking-wider">Accuracy</span>
                      </div>
                      <div className="text-3xl font-bold">{Math.round((state.score / TOTAL_QUESTIONS) * 100)}%</div>
                    </div>
                    <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-colors group">
                      <div className="flex items-center gap-3 text-emerald-400 mb-2">
                        <ICONS.Timer className="w-5 h-5 group-hover:animate-shiver" />
                        <span className="text-sm font-bold uppercase tracking-wider">Time Mastery</span>
                      </div>
                      <div className="text-3xl font-bold">{formatTime(QUIZ_DURATION - state.timeLeft)}</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                      onClick={startQuiz}
                      className="w-full sm:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/20 transition-all hover:scale-105 active:scale-95"
                    >
                      Restart Experiment
                    </button>
                    <button 
                      onClick={() => setState(prev => ({ ...prev, status: AppStatus.IDLE }))}
                      className="w-full sm:w-auto px-10 py-4 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-2xl border border-slate-800 transition-all active:scale-95"
                    >
                      Return to Landing
                    </button>
                  </div>
                </div>
                
                <div className="mt-20 text-left">
                  <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 animate-fade-in-up">
                    <ICONS.Trophy className="text-yellow-500 animate-float" /> Review Solutions
                  </h3>
                  <div className="grid gap-6">
                    {state.questions.map((q, idx) => (
                      <div 
                        key={idx} 
                        className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 hover:bg-slate-900/60 transition-colors animate-fade-in-up"
                        style={{animationDelay: `${idx * 0.1}s`}}
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-1 ${
                            state.userAnswers[idx] === q.correctAnswer ? 'bg-emerald-500/20 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-red-500/20 text-red-500'
                          }`}>
                            {idx + 1}
                          </span>
                          <p className="font-medium text-slate-200">{q.question}</p>
                        </div>
                        <div className="ml-10">
                          <div className="flex gap-4 items-center mb-2">
                            <span className="text-slate-500 text-sm">Correct Answer:</span>
                            <span className="text-emerald-400 font-bold">{q.options[q.correctAnswer]}</span>
                          </div>
                          <div className="p-4 bg-slate-950/50 rounded-xl text-sm text-slate-400 leading-relaxed italic border-l-2 border-slate-700">
                            {q.explanation}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="py-8 px-6 border-t border-slate-900 text-center text-slate-600 text-sm">
        <p>&copy; 2024 MotionMaster Physics Lab. Powered by AI Intelligence.</p>
      </footer>
    </div>
  );
}
