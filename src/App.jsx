import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
    'https://wkdxgyqekufpqbezzrff.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZHhneXFla3VmcHFiZXp6cmZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzOTE2ODIsImV4cCI6MjA4NDk2NzY4Mn0.A6_QQJ3WsWNeFZB-N8nfd1fcrcHD7F0QdJccKPPJYiI'
);

// Event types by category and sport
const EVENT_TYPES = {
    football: {
        scoring: ['Goal', 'Point', '45', 'Free', 'Penalty'],
        nonScoring: ['Wide', 'Short', 'Saved', 'Blocked', 'Turnover', 'Foul', 'Yellow Card', 'Red Card', 'Black Card', 'Substitution', 'Mark', 'Own Kickout Won', 'Opp Kickout Won']
    },
    hurling: {
        scoring: ['Goal', 'Point', '65', 'Free', 'Penalty'],
        nonScoring: ['Wide', 'Short', 'Saved', 'Blocked', 'Turnover', 'Foul', 'Yellow Card', 'Red Card', 'Substitution']
    }
};

// SVG Icons
const Icons = {
    Upload: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
        </svg>
    ),
    Matches: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
        </svg>
    ),
    Teams: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
    ),
    Settings: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"/>
        </svg>
    ),
    Play: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
    ),
    Pause: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
        </svg>
    ),
    SkipBack: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/>
        </svg>
    ),
    SkipForward: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/>
        </svg>
    ),
    Volume: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
        </svg>
    ),
    Fullscreen: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
        </svg>
    ),
    Download: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
        </svg>
    ),
    Trash: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
    ),
    Edit: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
    ),
    X: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
    ),
    Menu: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
    ),
    Scissors: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
            <line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/>
            <line x1="8.12" y1="8.12" x2="12" y2="12"/>
        </svg>
    )
};

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('landing');

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) setView('dashboard');
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) setView('dashboard');
            else setView('landing');
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#00833E'
            }}>
                <div style={{textAlign: 'center'}}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: '3px solid rgba(255,255,255,0.2)',
                        borderTopColor: 'white',
                        borderRadius: '50%',
                        margin: '0 auto 16px',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <p style={{color: 'white', fontSize: '14px', fontWeight: '600'}}>LOADING...</p>
                </div>
            </div>
        );
    }

    if (view === 'landing') return <LandingPage setView={setView} />;
    if (view === 'pricing') return <PricingPage setView={setView} />;
    if (view === 'contact') return <ContactPage setView={setView} />;
    if (view === 'auth') return <AuthPage setView={setView} setUser={setUser} />;
    if (view === 'dashboard') return <Dashboard user={user} setView={setView} setUser={setUser} />;

    return <LandingPage setView={setView} />;
}

// Landing Page (keeping existing)
function LandingPage({ setView }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div>
            <div className="green-cta-bar" onClick={() => setView('contact')}>
                BOOK YOUR FREE DEMO
            </div>

            <nav className="nav-fixed">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto'}}>
                    <div className="nav-logo">
                        <svg width="48" height="48" viewBox="0 0 32 32">
                            <rect width="32" height="32" rx="8" fill="white"/>
                            <circle cx="16" cy="16" r="8" fill="#00833E"/>
                            <path d="M12 16 L16 12 L20 16 L16 20 Z" fill="white"/>
                        </svg>
                        <span className="nav-logo-text">PÁIRCPRO</span>
                    </div>
                    <button 
                        className={`hamburger ${menuOpen ? 'active' : ''}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <div className="hamburger-line"></div>
                        <div className="hamburger-line"></div>
                        <div className="hamburger-line"></div>
                    </button>
                </div>
            </nav>

            <div className={`fullscreen-menu ${menuOpen ? 'active' : ''}`}>
                <nav>
                    <a href="#" onClick={(e) => {e.preventDefault(); setMenuOpen(false);}}>HOME</a>
                    <a href="#" onClick={(e) => {e.preventDefault(); setMenuOpen(false); setView('pricing');}}>PRICING</a>
                    <a href="#" onClick={(e) => {e.preventDefault(); setMenuOpen(false); setView('contact');}}>CONTACT</a>
                    <a href="#" onClick={(e) => {e.preventDefault(); setMenuOpen(false); setView('auth');}}>SIGN IN</a>
                </nav>
            </div>

            <section className="hero-section hero-overlay-dark" style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: 'url(/hurling-hero.jpg)',
                padding: '120px 24px 80px'
            }}>
                <div className="hero-content container-narrow text-center" style={{color: 'white'}}>
                    <h1 style={{fontSize: '72px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '32px', color: 'white', textShadow: '0 4px 12px rgba(0,0,0,0.5)'}}>
                        ELITE GAA<br/>VIDEO ANALYSIS.<br/>SIMPLIFIED.
                    </h1>
                    <div className="divider-line"></div>
                    <h2 style={{fontSize: '24px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '48px', color: 'white'}}>
                        PROFESSIONAL VIDEO ANALYSIS FOR GAA TEAMS
                    </h2>
                    <button className="btn-primary" onClick={() => setView('auth')} style={{fontSize: '16px', padding: '18px 48px'}}>
                        START FREE TRIAL
                    </button>
                </div>
            </section>
        </div>
    );
}

// Pricing Page (keeping existing structure)
function PricingPage({ setView }) {
    return <LandingPage setView={setView} />;
}

// Contact Page (keeping existing structure)
function ContactPage({ setView }) {
    return <LandingPage setView={setView} />;
}

// Auth Page (keeping existing)
function AuthPage({ setView, setUser }) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                alert('Check your email to confirm your account!');
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{minHeight: '100vh', background: '#00833E', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'}}>
            <div style={{background: 'white', borderRadius: '16px', padding: '48px', maxWidth: '400px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'}}>
                <h1 style={{fontSize: '32px', fontWeight: '900', color: '#00833E', marginBottom: '32px', textAlign: 'center'}}>
                    {isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN'}
                </h1>
                <form onSubmit={handleAuth}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{width: '100%', padding: '14px', marginBottom: '16px', border: '2px solid #E5E5E5', borderRadius: '8px', fontSize: '16px'}}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{width: '100%', padding: '14px', marginBottom: '24px', border: '2px solid #E5E5E5', borderRadius: '8px', fontSize: '16px'}}
                    />
                    {error && <p style={{color: '#DC2626', fontSize: '14px', marginBottom: '16px'}}>{error}</p>}
                    <button type="submit" disabled={loading} className="btn-primary" style={{width: '100%', padding: '14px', fontSize: '16px', fontWeight: '700'}}>
                        {loading ? 'LOADING...' : (isSignUp ? 'SIGN UP' : 'SIGN IN')}
                    </button>
                </form>
                <p style={{marginTop: '24px', textAlign: 'center', color: '#666', fontSize: '14px'}}>
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                    <button onClick={() => setIsSignUp(!isSignUp)} style={{marginLeft: '8px', color: '#00833E', fontWeight: '700', background: 'none', border: 'none', cursor: 'pointer'}}>
                        {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                </p>
                <button onClick={() => setView('landing')} style={{marginTop: '16px', width: '100%', padding: '12px', background: 'none', border: 'none', color: '#666', cursor: 'pointer'}}>
                    ← Back to Home
                </button>
            </div>
        </div>
    );
}

// Complete Dashboard with Video Analysis
function Dashboard({ user, setView, setUser }) {
    const [activeView, setActiveView] = useState('upload');
    const [matches, setMatches] = useState([]);
    const [currentMatch, setCurrentMatch] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setView('landing');
    };

    return (
        <div style={{minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column'}}>
            {/* Top Navigation */}
            <nav style={{
                background: '#00833E',
                padding: '16px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div 
                    onClick={() => { setActiveView('upload'); setCurrentMatch(null); }}
                    style={{display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer'}}
                >
                    <svg width="40" height="40" viewBox="0 0 32 32">
                        <rect width="32" height="32" rx="8" fill="white"/>
                        <circle cx="16" cy="16" r="8" fill="#00833E"/>
                        <path d="M12 16 L16 12 L20 16 L16 20 Z" fill="white"/>
                    </svg>
                    <span style={{fontSize: '24px', fontWeight: '900', color: 'white'}}>PÁIRCPRO</span>
                </div>
                
                {currentMatch && (
                    <h2 style={{color: 'white', fontSize: '18px', fontWeight: '700'}}>
                        {currentMatch.title || 'Match Analysis'}
                    </h2>
                )}

                <button 
                    onClick={() => setMenuOpen(!menuOpen)}
                    style={{background: 'rgba(255,255,255,0.2)', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                >
                    <Icons.Menu />
                </button>
            </nav>

            {/* Dropdown Menu */}
            {menuOpen && (
                <div style={{
                    position: 'absolute',
                    top: '70px',
                    right: '24px',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                    zIndex: 1000,
                    minWidth: '200px'
                }}>
                    <button onClick={() => { setMenuOpen(false); alert('Account settings coming soon'); }} style={{width: '100%', padding: '12px 16px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#333'}}>
                        Account Settings
                    </button>
                    <button onClick={() => { setMenuOpen(false); alert('Billing coming soon'); }} style={{width: '100%', padding: '12px 16px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#333', borderTop: '1px solid #E5E5E5'}}>
                        Billing
                    </button>
                    <button onClick={() => { setMenuOpen(false); alert('Help & Support coming soon'); }} style={{width: '100%', padding: '12px 16px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#333', borderTop: '1px solid #E5E5E5'}}>
                        Help & Support
                    </button>
                    <button onClick={handleSignOut} style={{width: '100%', padding: '12px 16px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#DC2626', borderTop: '1px solid #E5E5E5'}}>
                        Sign Out
                    </button>
                </div>
            )}

            {/* Main Content */}
            {!currentMatch ? (
                <UploadView 
                    user={user} 
                    activeView={activeView} 
                    setActiveView={setActiveView}
                    matches={matches}
                    setMatches={setMatches}
                    setCurrentMatch={setCurrentMatch}
                />
            ) : (
                <AnalysisView 
                    match={currentMatch}
                    setCurrentMatch={setCurrentMatch}
                />
            )}
        </div>
    );
}

// Upload View
function UploadView({ user, activeView, setActiveView, matches, setMatches, setCurrentMatch }) {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleVideoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024 * 1024) {
            alert('File size must be under 2GB');
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        try {
            const fileName = `${Date.now()}-${file.name}`;
            const filePath = `${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('videos')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('videos')
                .getPublicUrl(filePath);

            const { data: match, error: dbError } = await supabase
                .from('matches')
                .insert({
                    user_id: user.id,
                    title: file.name,
                    video_url: publicUrl,
                    video_path: filePath,
                    sport: 'football',
                    events: [],
                    metadata: {}
                })
                .select()
                .single();

            if (dbError) throw dbError;

            setCurrentMatch(match);
            setMatches([...matches, match]);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload video: ' + error.message);
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    useEffect(() => {
        const fetchMatches = async () => {
            const { data } = await supabase
                .from('matches')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
            if (data) setMatches(data);
        };
        fetchMatches();
    }, [user]);

    return (
        <div style={{display: 'flex', flex: 1, overflow: 'hidden'}}>
            {/* Sidebar */}
            <div style={{
                width: '200px',
                background: 'rgba(255,255,255,0.05)',
                borderRight: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '24px 16px'
            }}>
                <NavItem 
                    icon={<Icons.Upload />} 
                    label="Upload Video" 
                    active={activeView === 'upload'}
                    onClick={() => setActiveView('upload')}
                />
                <NavItem 
                    icon={<Icons.Matches />} 
                    label="My Matches" 
                    active={activeView === 'matches'}
                    onClick={() => setActiveView('matches')}
                />
                <NavItem 
                    icon={<Icons.Teams />} 
                    label="Teams" 
                    active={activeView === 'teams'}
                    onClick={() => setActiveView('teams')}
                />
                <NavItem 
                    icon={<Icons.Settings />} 
                    label="Settings" 
                    active={activeView === 'settings'}
                    onClick={() => setActiveView('settings')}
                />
            </div>

            {/* Content */}
            <div style={{flex: 1, padding: '48px', overflow: 'auto'}}>
                {activeView === 'upload' && (
                    <div>
                        <h1 style={{fontSize: '40px', fontWeight: '900', color: 'white', marginBottom: '32px'}}>UPLOAD VIDEO</h1>
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '2px dashed rgba(255,255,255,0.3)',
                            borderRadius: '16px',
                            padding: '64px 32px',
                            textAlign: 'center',
                            maxWidth: '600px'
                        }}>
                            <input
                                type="file"
                                accept="video/*"
                                onChange={handleVideoUpload}
                                disabled={uploading}
                                style={{display: 'none'}}
                                id="video-upload"
                            />
                            <label htmlFor="video-upload" style={{cursor: uploading ? 'not-allowed' : 'pointer', display: 'block'}}>
                                <div style={{fontSize: '64px', marginBottom: '24px'}}>
                                    <Icons.Upload />
                                </div>
                                <h3 style={{color: 'white', fontSize: '24px', fontWeight: '700', marginBottom: '12px'}}>
                                    {uploading ? `Uploading... ${uploadProgress}%` : 'Click to Upload Video'}
                                </h3>
                                <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '16px'}}>
                                    MP4, MOV, AVI • Max 2GB
                                </p>
                            </label>
                        </div>
                    </div>
                )}

                {activeView === 'matches' && (
                    <div>
                        <h1 style={{fontSize: '40px', fontWeight: '900', color: 'white', marginBottom: '32px'}}>MY MATCHES</h1>
                        {matches.length === 0 ? (
                            <div style={{background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '48px', textAlign: 'center'}}>
                                <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '18px'}}>
                                    No matches yet. Upload your first video to get started!
                                </p>
                            </div>
                        ) : (
                            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px'}}>
                                {matches.map(match => (
                                    <div 
                                        key={match.id}
                                        onClick={() => setCurrentMatch(match)}
                                        style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            border: '1px solid rgba(255,255,255,0.1)'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                        <div style={{aspectRatio: '16/9', background: '#00833E', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                            <Icons.Play />
                                        </div>
                                        <div style={{padding: '16px'}}>
                                            <h3 style={{color: 'white', fontSize: '18px', fontWeight: '700', marginBottom: '8px'}}>
                                                {match.title}
                                            </h3>
                                            <p style={{color: 'rgba(255,255,255,0.6)', fontSize: '14px'}}>
                                                {match.sport === 'football' ? 'Football' : 'Hurling'} • {new Date(match.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeView === 'teams' && (
                    <div>
                        <h1 style={{fontSize: '40px', fontWeight: '900', color: 'white', marginBottom: '32px'}}>TEAMS</h1>
                        <div style={{background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '48px', textAlign: 'center'}}>
                            <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '18px'}}>
                                Team management coming soon!
                            </p>
                        </div>
                    </div>
                )}

                {activeView === 'settings' && (
                    <div>
                        <h1 style={{fontSize: '40px', fontWeight: '900', color: 'white', marginBottom: '32px'}}>SETTINGS</h1>
                        <div style={{background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '48px', textAlign: 'center'}}>
                            <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '18px'}}>
                                Settings coming soon!
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Nav Item Component
function NavItem({ icon, label, active, onClick }) {
    return (
        <div 
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: active ? 'white' : 'rgba(255,255,255,0.7)',
                transition: 'all 0.2s ease',
                fontWeight: '600',
                fontSize: '14px'
            }}
            onMouseEnter={(e) => !active && (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
            onMouseLeave={(e) => !active && (e.currentTarget.style.background = 'transparent')}
        >
            {icon}
            <span>{label}</span>
        </div>
    );
}

// Complete Analysis View with 3-Column Layout
function AnalysisView({ match, setCurrentMatch }) {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [volume, setVolume] = useState(1);
    const [sport, setSport] = useState(match.sport || 'football');
    const [events, setEvents] = useState(match.events || []);
    const [stats, setStats] = useState({});
    const [scores, setScores] = useState({ home: { goals: 0, points: 0 }, away: { goals: 0, points: 0 } });
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showPitchDiagram, setShowPitchDiagram] = useState(false);
    const [clipStart, setClipStart] = useState(null);
    const [clipEnd, setClipEnd] = useState(null);
    const [showClipCreator, setShowClipCreator] = useState(false);

    // Initialize stats for current sport
    useEffect(() => {
        const initialStats = {};
        [...EVENT_TYPES[sport].scoring, ...EVENT_TYPES[sport].nonScoring].forEach(type => {
            initialStats[type] = 0;
        });
        setStats(initialStats);
    }, [sport]);

    // Video controls
    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const handleSeek = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        if (videoRef.current) {
            videoRef.current.currentTime = pos * duration;
        }
    };

    const skipBackward = () => {
        if (videoRef.current) {
            videoRef.current.currentTime = Math.max(0, currentTime - 5);
        }
    };

    const skipForward = () => {
        if (videoRef.current) {
            videoRef.current.currentTime = Math.min(duration, currentTime + 5);
        }
    };

    const changeSpeed = () => {
        const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];
        const currentIndex = speeds.indexOf(playbackSpeed);
        const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
        setPlaybackSpeed(nextSpeed);
        if (videoRef.current) {
            videoRef.current.playbackRate = nextSpeed;
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
        }
    };

    const toggleFullscreen = () => {
        if (videoRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                videoRef.current.requestFullscreen();
            }
        }
    };

    // Event tagging
    const tagEvent = (eventType, team = 'home') => {
        const event = {
            id: Date.now(),
            type: eventType,
            time: currentTime,
            timeString: formatTime(currentTime),
            sport: sport,
            team: team,
            playerNumber: null,
            location: null,
            notes: ''
        };

        const newEvents = [...events, event].sort((a, b) => a.time - b.time);
        setEvents(newEvents);

        // Update stats
        const newStats = { ...stats };
        newStats[eventType] = (newStats[eventType] || 0) + 1;
        setStats(newStats);

        // Update scores
        if (eventType === 'Goal') {
            setScores(prev => ({
                ...prev,
                [team]: { ...prev[team], goals: prev[team].goals + 1 }
            }));
        } else if (eventType === 'Point') {
            setScores(prev => ({
                ...prev,
                [team]: { ...prev[team], points: prev[team].points + 1 }
            }));
        }

        // Save to database
        saveMatch(newEvents);
    };

    const deleteEvent = (eventId) => {
        const newEvents = events.filter(e => e.id !== eventId);
        setEvents(newEvents);
        saveMatch(newEvents);
    };

    const saveMatch = async (updatedEvents) => {
        await supabase
            .from('matches')
            .update({ events: updatedEvents })
            .eq('id', match.id);
    };

    const jumpToEvent = (time) => {
        if (videoRef.current) {
            videoRef.current.currentTime = time;
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Export functions
    const exportCSV = () => {
        if (events.length === 0) {
            alert('No events to export');
            return;
        }

        const csvContent = [
            ['Event Type', 'Time (seconds)', 'Time (MM:SS)', 'Team', 'Sport', 'Player', 'Notes'],
            ...events.map(event => [
                event.type,
                event.time.toFixed(2),
                event.timeString,
                event.team,
                event.sport,
                event.playerNumber || '',
                event.notes || ''
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `paircpro-${match.title}-events.csv`;
        a.click();
    };

    const exportJSON = () => {
        const data = {
            match: match.title,
            sport: sport,
            events: events,
            stats: stats,
            scores: scores,
            exportedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `paircpro-${match.title}-analysis.json`;
        a.click();
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            switch(e.key.toLowerCase()) {
                case ' ': e.preventDefault(); togglePlay(); break;
                case 'arrowleft': skipBackward(); break;
                case 'arrowright': skipForward(); break;
                case 'f': toggleFullscreen(); break;
                case 'g': tagEvent('Goal'); break;
                case 'p': tagEvent('Point'); break;
                case 'w': tagEvent('Wide'); break;
                case 's': tagEvent('Saved'); break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isPlaying, currentTime, sport]);

    const totalHomeScore = scores.home.goals * 3 + scores.home.points;
    const totalAwayScore = scores.away.goals * 3 + scores.away.points;

    return (
        <div style={{display: 'flex', height: 'calc(100vh - 73px)', overflow: 'hidden'}}>
            {/* Left Panel - Event Tagging */}
            <div style={{
                width: '280px',
                background: 'rgba(255,255,255,0.05)',
                borderRight: '1px solid rgba(255,255,255,0.1)',
                overflow: 'auto',
                padding: '20px'
            }}>
                {/* Sport Selector */}
                <div style={{marginBottom: '24px'}}>
                    <h3 style={{color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '12px'}}>SPORT</h3>
                    <div style={{display: 'flex', gap: '8px'}}>
                        <button
                            onClick={() => setSport('football')}
                            style={{
                                flex: 1,
                                padding: '10px',
                                background: sport === 'football' ? 'white' : 'rgba(255,255,255,0.1)',
                                color: sport === 'football' ? '#00833E' : 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '700',
                                fontSize: '13px',
                                cursor: 'pointer'
                            }}
                        >
                            Football
                        </button>
                        <button
                            onClick={() => setSport('hurling')}
                            style={{
                                flex: 1,
                                padding: '10px',
                                background: sport === 'hurling' ? 'white' : 'rgba(255,255,255,0.1)',
                                color: sport === 'hurling' ? '#00833E' : 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '700',
                                fontSize: '13px',
                                cursor: 'pointer'
                            }}
                        >
                            Hurling
                        </button>
                    </div>
                </div>

                {/* Scoring Events */}
                <div style={{marginBottom: '24px'}}>
                    <h3 style={{color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '12px'}}>SCORING</h3>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px'}}>
                        {EVENT_TYPES[sport].scoring.map(type => (
                            <button
                                key={type}
                                onClick={() => tagEvent(type)}
                                style={{
                                    padding: '12px 8px',
                                    background: 'rgba(0,131,62,0.2)',
                                    border: '1px solid rgba(0,131,62,0.4)',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontWeight: '700',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,131,62,0.3)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,131,62,0.2)'}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Non-Scoring Events */}
                <div style={{marginBottom: '24px'}}>
                    <h3 style={{color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '12px'}}>EVENTS</h3>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px'}}>
                        {EVENT_TYPES[sport].nonScoring.map(type => (
                            <button
                                key={type}
                                onClick={() => tagEvent(type)}
                                style={{
                                    padding: '12px 8px',
                                    background: 'rgba(255,255,255,0.1)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontWeight: '700',
                                    fontSize: '11px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div>
                    <h3 style={{color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '12px'}}>TOOLS</h3>
                    <button
                        onClick={() => setShowPitchDiagram(!showPitchDiagram)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: showPitchDiagram ? 'rgba(0,131,62,0.3)' : 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            color: 'white',
                            fontWeight: '700',
                            fontSize: '13px',
                            cursor: 'pointer',
                            marginBottom: '8px'
                        }}
                    >
                        {showPitchDiagram ? 'Hide' : 'Show'} Pitch Diagram
                    </button>
                    <button
                        onClick={() => setShowClipCreator(!showClipCreator)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            color: 'white',
                            fontWeight: '700',
                            fontSize: '13px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        <Icons.Scissors /> Create Clip
                    </button>
                </div>
            </div>

            {/* Center Panel - Video Player */}
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', background: '#000', padding: '20px'}}>
                {/* Video */}
                <div style={{flex: 1, background: '#000', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', position: 'relative'}}>
                    <video
                        ref={videoRef}
                        src={match.video_url}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        style={{width: '100%', height: '100%', objectFit: 'contain'}}
                    />
                </div>

                {/* Video Controls */}
                <div style={{background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px'}}>
                    {/* Progress Bar */}
                    <div 
                        onClick={handleSeek}
                        style={{
                            height: '6px',
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '3px',
                            marginBottom: '16px',
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'visible'
                        }}
                    >
                        <div style={{
                            height: '100%',
                            background: '#00833E',
                            borderRadius: '3px',
                            width: `${(currentTime / duration) * 100}%`,
                            position: 'relative'
                        }}>
                            <div style={{
                                position: 'absolute',
                                right: '-6px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '12px',
                                height: '12px',
                                background: 'white',
                                borderRadius: '50%',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                            }}></div>
                        </div>
                        
                        {/* Event markers on timeline */}
                        {events.map(event => (
                            <div
                                key={event.id}
                                onClick={(e) => { e.stopPropagation(); jumpToEvent(event.time); }}
                                style={{
                                    position: 'absolute',
                                    left: `${(event.time / duration) * 100}%`,
                                    top: '-4px',
                                    width: '4px',
                                    height: '14px',
                                    background: event.type === 'Goal' ? '#10b981' : event.type === 'Point' ? '#f59e0b' : 'white',
                                    borderRadius: '2px',
                                    cursor: 'pointer'
                                }}
                            />
                        ))}
                    </div>

                    {/* Control Buttons */}
                    <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                        <button onClick={skipBackward} style={controlButtonStyle}>
                            <Icons.SkipBack />
                        </button>
                        <button onClick={togglePlay} style={{...controlButtonStyle, width: '48px', height: '48px'}}>
                            {isPlaying ? <Icons.Pause /> : <Icons.Play />}
                        </button>
                        <button onClick={skipForward} style={controlButtonStyle}>
                            <Icons.SkipForward />
                        </button>
                        
                        <span style={{color: 'white', fontSize: '14px', fontWeight: '600', marginLeft: '8px'}}>
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>

                        <button onClick={changeSpeed} style={{...controlButtonStyle, width: 'auto', padding: '0 16px', marginLeft: 'auto'}}>
                            <span style={{fontSize: '13px', fontWeight: '700'}}>{playbackSpeed}x</span>
                        </button>

                        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <Icons.Volume />
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={volume}
                                onChange={handleVolumeChange}
                                style={{width: '80px'}}
                            />
                        </div>

                        <button onClick={toggleFullscreen} style={controlButtonStyle}>
                            <Icons.Fullscreen />
                        </button>
                    </div>
                </div>

                {/* Pitch Diagram */}
                {showPitchDiagram && (
                    <div style={{
                        marginTop: '16px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '12px',
                        padding: '24px'
                    }}>
                        <h3 style={{color: 'white', fontSize: '16px', fontWeight: '700', marginBottom: '16px'}}>PITCH DIAGRAM</h3>
                        <GAAPitchDiagram events={events} />
                    </div>
                )}

                {/* Clip Creator */}
                {showClipCreator && (
                    <div style={{
                        marginTop: '16px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '12px',
                        padding: '24px'
                    }}>
                        <h3 style={{color: 'white', fontSize: '16px', fontWeight: '700', marginBottom: '16px'}}>CREATE CLIP</h3>
                        <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                            <button
                                onClick={() => setClipStart(currentTime)}
                                style={{
                                    padding: '12px 20px',
                                    background: clipStart !== null ? 'rgba(0,131,62,0.3)' : 'rgba(255,255,255,0.1)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontWeight: '700',
                                    fontSize: '13px',
                                    cursor: 'pointer'
                                }}
                            >
                                Set Start {clipStart !== null && `(${formatTime(clipStart)})`}
                            </button>
                            <button
                                onClick={() => setClipEnd(currentTime)}
                                style={{
                                    padding: '12px 20px',
                                    background: clipEnd !== null ? 'rgba(0,131,62,0.3)' : 'rgba(255,255,255,0.1)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontWeight: '700',
                                    fontSize: '13px',
                                    cursor: 'pointer'
                                }}
                            >
                                Set End {clipEnd !== null && `(${formatTime(clipEnd)})`}
                            </button>
                            <button
                                onClick={() => alert('Clip export coming soon!')}
                                disabled={clipStart === null || clipEnd === null}
                                style={{
                                    padding: '12px 20px',
                                    background: '#00833E',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontWeight: '700',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    opacity: (clipStart === null || clipEnd === null) ? 0.5 : 1,
                                    marginLeft: 'auto'
                                }}
                            >
                                Export Clip
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Panel - Stats & Events */}
            <div style={{
                width: '320px',
                background: 'rgba(255,255,255,0.05)',
                borderLeft: '1px solid rgba(255,255,255,0.1)',
                overflow: 'auto',
                padding: '20px'
            }}>
                {/* Scoreboard */}
                <div style={{
                    background: 'rgba(0,131,62,0.2)',
                    border: '2px solid rgba(0,131,62,0.4)',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '20px'
                }}>
                    <h3 style={{color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '16px', textAlign: 'center'}}>SCORE</h3>
                    <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
                        <div style={{textAlign: 'center'}}>
                            <div style={{color: 'white', fontSize: '32px', fontWeight: '900', marginBottom: '4px'}}>
                                {scores.home.goals}-{scores.home.points.toString().padStart(2, '0')}
                            </div>
                            <div style={{color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: '700'}}>
                                HOME ({totalHomeScore})
                            </div>
                        </div>
                        <div style={{color: 'rgba(255,255,255,0.5)', fontSize: '24px', fontWeight: '900'}}>VS</div>
                        <div style={{textAlign: 'center'}}>
                            <div style={{color: 'white', fontSize: '32px', fontWeight: '900', marginBottom: '4px'}}>
                                {scores.away.goals}-{scores.away.points.toString().padStart(2, '0')}
                            </div>
                            <div style={{color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: '700'}}>
                                AWAY ({totalAwayScore})
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '20px'
                }}>
                    <h3 style={{color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '16px'}}>STATISTICS</h3>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                        <StatRow label="Total Events" value={events.length} />
                        <StatRow label="Goals" value={stats.Goal || 0} />
                        <StatRow label="Points" value={stats.Point || 0} />
                        <StatRow label="Wides" value={stats.Wide || 0} />
                        <StatRow label="Fouls" value={(stats.Foul || 0) + (stats['Yellow Card'] || 0) + (stats['Red Card'] || 0)} />
                        <StatRow label="Turnovers" value={stats.Turnover || 0} />
                    </div>
                </div>

                {/* Events List */}
                <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    padding: '20px'
                }}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                        <h3 style={{color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase'}}>EVENTS ({events.length})</h3>
                        <button onClick={exportCSV} style={{
                            padding: '6px 12px',
                            background: 'rgba(0,131,62,0.3)',
                            border: '1px solid rgba(0,131,62,0.5)',
                            borderRadius: '6px',
                            color: 'white',
                            fontSize: '11px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}>
                            <Icons.Download /> CSV
                        </button>
                    </div>
                    <div style={{maxHeight: '400px', overflow: 'auto'}}>
                        {events.length === 0 ? (
                            <p style={{color: 'rgba(255,255,255,0.5)', fontSize: '13px', textAlign: 'center', padding: '20px 0'}}>
                                No events tagged yet
                            </p>
                        ) : (
                            events.slice().reverse().map(event => (
                                <div
                                    key={event.id}
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: '8px',
                                        padding: '12px',
                                        marginBottom: '8px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}
                                    onClick={() => jumpToEvent(event.time)}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                >
                                    <div>
                                        <div style={{color: 'white', fontSize: '13px', fontWeight: '700', marginBottom: '4px'}}>
                                            {event.type}
                                        </div>
                                        <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '11px'}}>
                                            {event.timeString} • {event.team.toUpperCase()}
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); deleteEvent(event.id); }}
                                        style={{
                                            background: 'rgba(220,38,38,0.2)',
                                            border: '1px solid rgba(220,38,38,0.3)',
                                            borderRadius: '6px',
                                            padding: '6px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Icons.Trash />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Export Options */}
                <div style={{marginTop: '20px'}}>
                    <button
                        onClick={exportJSON}
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: '#00833E',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            fontWeight: '700',
                            fontSize: '14px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        <Icons.Download /> Export Full Analysis
                    </button>
                </div>
            </div>
        </div>
    );
}

// Stat Row Component
function StatRow({ label, value }) {
    return (
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span style={{color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '600'}}>{label}</span>
            <span style={{color: 'white', fontSize: '16px', fontWeight: '900'}}>{value}</span>
        </div>
    );
}

// GAA Pitch Diagram Component
function GAAPitchDiagram({ events }) {
    return (
        <div style={{
            aspectRatio: '4/6',
            background: 'rgba(0,131,62,0.2)',
            borderRadius: '12px',
            border: '2px solid rgba(0,131,62,0.4)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Pitch markings */}
            <svg width="100%" height="100%" style={{position: 'absolute', top: 0, left: 0}}>
                {/* Center line */}
                <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                
                {/* 45/65 lines */}
                <line x1="0%" y1="30%" x2="100%" y2="30%" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="0%" y1="70%" x2="100%" y2="70%" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="5,5" />
                
                {/* Goal areas */}
                <rect x="35%" y="2%" width="30%" height="8%" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                <rect x="35%" y="90%" width="30%" height="8%" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                
                {/* Center circle */}
                <circle cx="50%" cy="50%" r="10%" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
            </svg>

            {/* Event markers */}
            {events.filter(e => e.location).map(event => (
                <div
                    key={event.id}
                    style={{
                        position: 'absolute',
                        left: `${event.location.x}%`,
                        top: `${event.location.y}%`,
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: event.type === 'Goal' ? '#10b981' : event.type === 'Point' ? '#f59e0b' : 'white',
                        border: '2px solid rgba(0,0,0,0.3)',
                        transform: 'translate(-50%, -50%)'
                    }}
                />
            ))}

            <p style={{
                position: 'absolute',
                bottom: '8px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'rgba(255,255,255,0.5)',
                fontSize: '11px',
                fontWeight: '700'
            }}>
                Click event locations to mark on pitch
            </p>
        </div>
    );
}

// Control button style
const controlButtonStyle = {
    width: '40px',
    height: '40px',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '8px',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
};

export default App;
