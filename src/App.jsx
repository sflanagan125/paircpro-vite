import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
    'https://wkdxgyqekufpqbezzrff.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZHhneXFla3VmcHFiZXp6cmZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzOTE2ODIsImV4cCI6MjA4NDk2NzY4Mn0.A6_QQJ3WsWNeFZB-N8nfd1fcrcHD7F0QdJccKPPJYiI'
);

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
                background: 'white'
            }}>
                <div style={{textAlign: 'center'}}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: '3px solid #E5E5E5',
                        borderTopColor: '#00833E',
                        borderRadius: '50%',
                        margin: '0 auto 16px',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <p style={{color: '#666', fontSize: '14px', fontWeight: '600'}}>LOADING...</p>
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

// Landing Page Component
function LandingPage({ setView }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [accordion1, setAccordion1] = useState(false);
    const [accordion2, setAccordion2] = useState(false);
    const [accordion3, setAccordion3] = useState(false);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && menuOpen) setMenuOpen(false);
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [menuOpen]);

    return (
        <div>
            {/* Green CTA Bar */}
            <div className="green-cta-bar" onClick={() => setView('contact')}>
                BOOK YOUR FREE DEMO
            </div>

            {/* Fixed Navigation */}
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
                        aria-label="Toggle menu"
                    >
                        <div className="hamburger-line"></div>
                        <div className="hamburger-line"></div>
                        <div className="hamburger-line"></div>
                    </button>
                </div>
            </nav>

            {/* Fullscreen Menu */}
            <div className={`fullscreen-menu ${menuOpen ? 'active' : ''}`}>
                <nav>
                    <a href="#" onClick={(e) => {e.preventDefault(); setMenuOpen(false);}}>HOME</a>
                    <a href="#" onClick={(e) => {e.preventDefault(); setMenuOpen(false); setView('pricing');}}>PRICING</a>
                    <a href="#" onClick={(e) => {e.preventDefault(); setMenuOpen(false); setView('contact');}}>CONTACT</a>
                    <a href="#" onClick={(e) => {e.preventDefault(); setMenuOpen(false); setView('auth');}}>SIGN IN</a>
                </nav>
            </div>

            {/* Hero Section */}
            <section 
                id="main-content"
                className="hero-section hero-overlay-dark"
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundImage: 'url(/hurling-hero.jpg)',
                    padding: '120px 24px 80px'
                }}
            >
                <div className="hero-content container-narrow text-center" style={{color: 'white'}}>
                    <h1 style={{
                        fontSize: '72px',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        marginBottom: '32px',
                        color: 'white',
                        textShadow: '0 4px 12px rgba(0,0,0,0.5)'
                    }}>
                        ELITE GAA<br/>
                        VIDEO ANALYSIS.<br/>
                        SIMPLIFIED.
                    </h1>
                    <div className="divider-line"></div>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        marginBottom: '48px',
                        color: 'white',
                        textShadow: '0 2px 8px rgba(0,0,0,0.5)'
                    }}>
                        PROFESSIONAL TOOLS FOR COACHES & TEAMS
                    </h2>
                    <p className="body-lg" style={{
                        maxWidth: '600px',
                        margin: '0 auto 64px',
                        color: 'white',
                        textShadow: '0 2px 8px rgba(0,0,0,0.5)'
                    }}>
                        Upload match footage, get instant tactical insights, and build winning game plans. Used by county teams across Ireland.
                    </p>
                    <button onClick={() => setView('contact')} className="btn-outline-white">
                        BOOK FREE DEMO
                    </button>
                </div>
            </section>

            {/* Value Proposition */}
            <section className="bg-white" style={{padding: 'var(--section-padding) 24px'}}>
                <div className="container-narrow text-center">
                    <h2 className="display-md uppercase mb-large">
                        WHY <strong>PÁIRCPRO?</strong>
                    </h2>
                    <p className="body-lg mb-medium">
                        <strong>PáircPro</strong> gives GAA coaches the analysis tools they need without the complexity of professional software. Upload, analyze, share - all in one platform.
                    </p>
                    <p className="body-lg mb-medium" style={{textDecoration: 'underline'}}>
                        No training required. Start analyzing in minutes.
                    </p>
                    <p className="body-lg mb-xlarge" style={{fontWeight: '700', textTransform: 'uppercase'}}>
                        CLUB TO COUNTY - ALL LEVELS WELCOME
                    </p>
                    <button onClick={() => setView('pricing')} className="btn-primary">
                        SEE PRICING
                    </button>
                </div>
            </section>

            {/* Features Section */}
            <section 
                className="hero-section hero-overlay-darker"
                style={{
                    backgroundImage: 'url(/football-hero.jpg)',
                    padding: 'var(--section-padding) 24px',
                    color: 'white'
                }}
            >
                <div className="hero-content container-narrow">
                    <h2 className="display-lg uppercase mb-large text-center">
                        BUILT FOR<br/>
                        GAA COACHES.
                    </h2>
                    <div style={{width: '100%', height: '2px', background: 'white', margin: '48px 0'}}></div>

                    {/* Accordion Container */}
                    <div className="accordion-container">
                        {/* Accordion 1 */}
                        <div className="accordion-item">
                            <button className="accordion-header" onClick={() => setAccordion1(!accordion1)}>
                                <h3 className="accordion-title">VIDEO UPLOAD & STORAGE</h3>
                                <span className={`accordion-icon ${accordion1 ? 'active' : ''}`}>+</span>
                            </button>
                            <div className={`accordion-content ${accordion1 ? 'active' : ''}`}>
                                <div className="accordion-content-inner">
                                    <p className="body-md mb-medium">
                                        Upload full match footage or training clips. Secure cloud storage keeps everything organized by team, competition, and date.
                                    </p>
                                    <p className="body-md mb-small">Features:</p>
                                    <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                                        <li className="body-md mb-small" style={{paddingLeft: '24px', position: 'relative'}}>
                                            <span style={{position: 'absolute', left: 0}}>•</span>
                                            Unlimited video uploads
                                        </li>
                                        <li className="body-md mb-small" style={{paddingLeft: '24px', position: 'relative'}}>
                                            <span style={{position: 'absolute', left: 0}}>•</span>
                                            Automatic backup and sync
                                        </li>
                                        <li className="body-md mb-small" style={{paddingLeft: '24px', position: 'relative'}}>
                                            <span style={{position: 'absolute', left: 0}}>•</span>
                                            Team and player tagging
                                        </li>
                                        <li className="body-md" style={{paddingLeft: '24px', position: 'relative'}}>
                                            <span style={{position: 'absolute', left: 0}}>•</span>
                                            HD quality playback
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Accordion 2 */}
                        <div className="accordion-item">
                            <button className="accordion-header" onClick={() => setAccordion2(!accordion2)}>
                                <h3 className="accordion-title">TACTICAL ANALYSIS TOOLS</h3>
                                <span className={`accordion-icon ${accordion2 ? 'active' : ''}`}>+</span>
                            </button>
                            <div className={`accordion-content ${accordion2 ? 'active' : ''}`}>
                                <div className="accordion-content-inner">
                                    <p className="body-md mb-medium">
                                        Draw formations, highlight key moments, and create video clips. Share tactical breakdowns with your team instantly.
                                    </p>
                                    <p className="body-md mb-small">Tools include:</p>
                                    <ul style={{listStyle: 'none', padding: 0}}>
                                        <li className="body-md mb-small" style={{paddingLeft: '32px', position: 'relative'}}>
                                            <span style={{position: 'absolute', left: 0}}>1.</span>
                                            Drawing tools for formations
                                        </li>
                                        <li className="body-md mb-small" style={{paddingLeft: '32px', position: 'relative'}}>
                                            <span style={{position: 'absolute', left: 0}}>2.</span>
                                            Clip creation and sharing
                                        </li>
                                        <li className="body-md mb-small" style={{paddingLeft: '32px', position: 'relative'}}>
                                            <span style={{position: 'absolute', left: 0}}>3.</span>
                                            Frame-by-frame analysis
                                        </li>
                                        <li className="body-md mb-small" style={{paddingLeft: '32px', position: 'relative'}}>
                                            <span style={{position: 'absolute', left: 0}}>4.</span>
                                            Slow motion playback
                                        </li>
                                        <li className="body-md" style={{paddingLeft: '32px', position: 'relative'}}>
                                            <span style={{position: 'absolute', left: 0}}>5.</span>
                                            Text annotations
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Accordion 3 */}
                        <div className="accordion-item">
                            <button className="accordion-header" onClick={() => setAccordion3(!accordion3)}>
                                <h3 className="accordion-title">TEAM COLLABORATION</h3>
                                <span className={`accordion-icon ${accordion3 ? 'active' : ''}`}>+</span>
                            </button>
                            <div className={`accordion-content ${accordion3 ? 'active' : ''}`}>
                                <div className="accordion-content-inner">
                                    <p className="body-md mb-medium">
                                        Invite coaching staff and players. Share analysis, assign tasks, and track progress all in one place.
                                    </p>
                                    <p className="body-md mb-small">Collaboration features:</p>
                                    <ul style={{listStyle: 'none', padding: 0}}>
                                        <li className="body-md mb-small" style={{paddingLeft: '24px', position: 'relative'}}>
                                            <span style={{position: 'absolute', left: 0}}>•</span>
                                            Multi-user access
                                        </li>
                                        <li className="body-md mb-small" style={{paddingLeft: '24px', position: 'relative'}}>
                                            <span style={{position: 'absolute', left: 0}}>•</span>
                                            Role-based permissions
                                        </li>
                                        <li className="body-md mb-small" style={{paddingLeft: '24px', position: 'relative'}}>
                                            <span style={{position: 'absolute', left: 0}}>•</span>
                                            Shared playlists
                                        </li>
                                        <li className="body-md mb-small" style={{paddingLeft: '24px', position: 'relative'}}>
                                            <span style={{position: 'absolute', left: 0}}>•</span>
                                            Comments and feedback
                                        </li>
                                        <li className="body-md" style={{paddingLeft: '24px', position: 'relative'}}>
                                            <span style={{position: 'absolute', left: 0}}>•</span>
                                            Export and download options
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                background: 'var(--primary-green)',
                color: 'white',
                padding: '80px 24px',
                textAlign: 'center'
            }}>
                <div className="container-narrow">
                    <h2 className="display-md uppercase mb-medium">
                        READY TO ELEVATE YOUR COACHING?
                    </h2>
                    <p className="body-lg mb-xlarge">
                        See PáircPro in action with a personalized demo from our team.
                    </p>
                    <button 
                        onClick={() => setView('contact')}
                        className="btn-outline-white"
                    >
                        BOOK FREE DEMO
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black text-white text-center" style={{padding: '48px 24px'}}>
                <div className="container-narrow">
                    <p className="body-md mb-medium" style={{color: 'rgba(255,255,255,0.7)'}}>
                        © 2025 PáircPro. Professional GAA video analysis platform.
                    </p>
                    <div style={{display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap'}}>
                        <a href="#" onClick={(e) => {e.preventDefault(); setView('landing');}} style={{color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px'}}>Privacy</a>
                        <a href="#" onClick={(e) => {e.preventDefault(); setView('landing');}} style={{color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px'}}>Terms</a>
                        <a href="#" onClick={(e) => {e.preventDefault(); setView('contact');}} style={{color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px'}}>Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// Pricing Page Component
function PricingPage({ setView }) {
    const [billing, setBilling] = useState('monthly');
    
    return (
        <div style={{minHeight: '100vh', background: 'white'}}>
            {/* Header */}
            <nav style={{background: 'white', borderBottom: '1px solid #E5E5E5', padding: '16px 24px'}}>
                <div style={{maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <button 
                        onClick={() => setView('landing')}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            fontFamily: 'inherit'
                        }}
                    >
                        ← BACK
                    </button>
                </div>
            </nav>

            {/* Pricing Content */}
            <div style={{padding: '80px 24px'}}>
                <div className="container text-center">
                    <h1 className="display-lg uppercase mb-medium">CHOOSE YOUR PLAN</h1>
                    <p className="body-lg mb-large" style={{color: 'var(--gray-mid)'}}>
                        Professional GAA video analysis for every level
                    </p>
                    
                    {/* Billing Toggle */}
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '48px'}}>
                        <span style={{fontWeight: '600', color: billing === 'monthly' ? '#000' : '#999'}}>Monthly</span>
                        <button
                            onClick={() => setBilling(billing === 'monthly' ? 'annual' : 'monthly')}
                            style={{
                                width: '60px',
                                height: '32px',
                                background: billing === 'annual' ? '#00833E' : '#E5E5E5',
                                border: 'none',
                                borderRadius: '16px',
                                position: 'relative',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                        >
                            <div style={{
                                width: '24px',
                                height: '24px',
                                background: 'white',
                                borderRadius: '50%',
                                position: 'absolute',
                                top: '4px',
                                left: billing === 'annual' ? '32px' : '4px',
                                transition: 'all 0.3s'
                            }}></div>
                        </button>
                        <span style={{fontWeight: '600', color: billing === 'annual' ? '#000' : '#999'}}>
                            Annual <span style={{color: '#00833E', fontSize: '14px'}}>(Save 25%)</span>
                        </span>
                    </div>

                    {/* Plans Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '32px',
                        maxWidth: '1100px',
                        margin: '0 auto 80px',
                        textAlign: 'left'
                    }}>
                        {/* Coach Plan */}
                        <div style={{
                            border: '2px solid #E5E5E5',
                            borderRadius: '8px',
                            padding: '40px 32px',
                        }}>
                            <h3 style={{fontSize: '24px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '24px'}}>
                                COACH
                            </h3>
                            <div style={{marginBottom: '32px'}}>
                                {billing === 'annual' && (
                                    <div style={{fontSize: '16px', color: '#999', textDecoration: 'line-through', marginBottom: '8px'}}>
                                        €1,164/year
                                    </div>
                                )}
                                <div style={{fontSize: '48px', fontWeight: '900', marginBottom: '8px'}}>
                                    {billing === 'monthly' ? '€97' : '€873'}
                                </div>
                                <p style={{color: 'var(--gray-mid)', fontWeight: '600'}}>
                                    {billing === 'monthly' ? '/month' : '/year'}
                                </p>
                            </div>
                            <ul style={{listStyle: 'none', padding: 0, marginBottom: '32px'}}>
                                <li style={{marginBottom: '16px', fontWeight: '500', display: 'flex', alignItems: 'start'}}>
                                    <span style={{color: 'var(--black)', marginRight: '12px', fontWeight: '700'}}>✓</span>
                                    50GB video storage
                                </li>
                                <li style={{marginBottom: '16px', fontWeight: '500', display: 'flex', alignItems: 'start'}}>
                                    <span style={{color: 'var(--black)', marginRight: '12px', fontWeight: '700'}}>✓</span>
                                    Up to 3 users
                                </li>
                                <li style={{marginBottom: '16px', fontWeight: '500', display: 'flex', alignItems: 'start'}}>
                                    <span style={{color: 'var(--black)', marginRight: '12px', fontWeight: '700'}}>✓</span>
                                    Basic analysis tools
                                </li>
                                <li style={{marginBottom: '16px', fontWeight: '500', display: 'flex', alignItems: 'start'}}>
                                    <span style={{color: 'var(--black)', marginRight: '12px', fontWeight: '700'}}>✓</span>
                                    GAA-specific tagging
                                </li>
                                <li style={{fontWeight: '400', color: 'var(--gray-mid)', display: 'flex', alignItems: 'start'}}>
                                    <span style={{marginRight: '12px'}}>✗</span>
                                    Advanced statistics
                                </li>
                            </ul>
                            <button 
                                onClick={() => setView('contact')}
                                className="btn-outline-black"
                                style={{width: '100%'}}
                            >
                                BOOK DEMO
                            </button>
                        </div>

                        {/* Premium Plan - Featured */}
                        <div style={{
                            border: '3px solid var(--primary-green)',
                            borderRadius: '8px',
                            padding: '40px 32px',
                            position: 'relative',
                            background: 'linear-gradient(180deg, #FAFAFA 0%, #FFFFFF 100%)'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '-16px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'var(--primary-green)',
                                color: 'white',
                                padding: '8px 24px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '800',
                                letterSpacing: '0.1em'
                            }}>
                                MOST POPULAR
                            </div>
                            <h3 style={{fontSize: '24px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '24px'}}>
                                PREMIUM
                            </h3>
                            <div style={{marginBottom: '32px'}}>
                                {billing === 'annual' && (
                                    <div style={{fontSize: '16px', color: '#999', textDecoration: 'line-through', marginBottom: '8px'}}>
                                        €1,764/year
                                    </div>
                                )}
                                <div style={{fontSize: '48px', fontWeight: '900', marginBottom: '8px'}}>
                                    {billing === 'monthly' ? '€147' : '€1,323'}
                                </div>
                                <p style={{color: 'var(--gray-mid)', fontWeight: '600'}}>
                                    {billing === 'monthly' ? '/month' : '/year'}
                                </p>
                            </div>
                            <ul style={{listStyle: 'none', padding: 0, marginBottom: '32px'}}>
                                <li style={{marginBottom: '16px', fontWeight: '500', display: 'flex', alignItems: 'start'}}>
                                    <span style={{color: 'var(--black)', marginRight: '12px', fontWeight: '700'}}>✓</span>
                                    150GB video storage
                                </li>
                                <li style={{marginBottom: '16px', fontWeight: '500', display: 'flex', alignItems: 'start'}}>
                                    <span style={{color: 'var(--black)', marginRight: '12px', fontWeight: '700'}}>✓</span>
                                    Up to 10 users
                                </li>
                                <li style={{marginBottom: '16px', fontWeight: '500', display: 'flex', alignItems: 'start'}}>
                                    <span style={{color: 'var(--black)', marginRight: '12px', fontWeight: '700'}}>✓</span>
                                    Advanced statistics
                                </li>
                                <li style={{marginBottom: '16px', fontWeight: '500', display: 'flex', alignItems: 'start'}}>
                                    <span style={{color: 'var(--black)', marginRight: '12px', fontWeight: '700'}}>✓</span>
                                    Live match analysis
                                </li>
                                <li style={{marginBottom: '16px', fontWeight: '500', display: 'flex', alignItems: 'start'}}>
                                    <span style={{color: 'var(--black)', marginRight: '12px', fontWeight: '700'}}>✓</span>
                                    PDF reports
                                </li>
                            </ul>
                            <button 
                                onClick={() => setView('contact')}
                                className="btn-primary"
                                style={{width: '100%'}}
                            >
                                BOOK DEMO
                            </button>
                        </div>

                        {/* Enterprise Plan */}
                        <div style={{
                            border: '2px solid #E5E5E5',
                            borderRadius: '8px',
                            padding: '40px 32px',
                        }}>
                            <h3 style={{fontSize: '24px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '24px'}}>
                                ENTERPRISE
                            </h3>
                            <div style={{marginBottom: '32px'}}>
                                {billing === 'annual' && (
                                    <div style={{fontSize: '16px', color: '#999', textDecoration: 'line-through', marginBottom: '8px'}}>
                                        €5,964/year
                                    </div>
                                )}
                                <div style={{fontSize: '48px', fontWeight: '900', marginBottom: '8px'}}>
                                    {billing === 'monthly' ? '€497' : '€4,473'}
                                </div>
                                <p style={{color: 'var(--gray-mid)', fontWeight: '600'}}>
                                    {billing === 'monthly' ? '/month' : '/year'}
                                </p>
                            </div>
                            <ul style={{listStyle: 'none', padding: 0, marginBottom: '32px'}}>
                                <li style={{marginBottom: '16px', fontWeight: '500', display: 'flex', alignItems: 'start'}}>
                                    <span style={{color: 'var(--black)', marginRight: '12px', fontWeight: '700'}}>✓</span>
                                    500GB video storage
                                </li>
                                <li style={{marginBottom: '16px', fontWeight: '500', display: 'flex', alignItems: 'start'}}>
                                    <span style={{color: 'var(--black)', marginRight: '12px', fontWeight: '700'}}>✓</span>
                                    Unlimited users
                                </li>
                                <li style={{marginBottom: '16px', fontWeight: '500', display: 'flex', alignItems: 'start'}}>
                                    <span style={{color: 'var(--black)', marginRight: '12px', fontWeight: '700'}}>✓</span>
                                    Everything in Premium
                                </li>
                                <li style={{marginBottom: '16px', fontWeight: '500', display: 'flex', alignItems: 'start'}}>
                                    <span style={{color: 'var(--black)', marginRight: '12px', fontWeight: '700'}}>✓</span>
                                    Custom integrations
                                </li>
                                <li style={{marginBottom: '16px', fontWeight: '500', display: 'flex', alignItems: 'start'}}>
                                    <span style={{color: 'var(--black)', marginRight: '12px', fontWeight: '700'}}>✓</span>
                                    Dedicated account manager
                                </li>
                            </ul>
                            <button 
                                onClick={() => setView('contact')}
                                className="btn-outline-black"
                                style={{width: '100%'}}
                            >
                                BOOK DEMO
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Contact Page Component  
function ContactPage({ setView }) {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        
        const form = new FormData();
        form.append('name', formData.name);
        form.append('email', formData.email);
        form.append('message', formData.message);
        form.append('_subject', 'PáircPro Demo Request - ' + formData.name);
        form.append('_autoresponse', 'Thank you for your interest in PáircPro! We\'ve received your demo request and will contact you within 24 hours to schedule your personalized demonstration.');
        form.append('_captcha', 'false');
        
        try {
            // Save to Supabase
            await supabase.from('contact_requests').insert([{
                name: formData.name,
                email: formData.email,
                message: formData.message,
                status: 'new'
            }]);
            
            // Send email via FormSubmit
            await fetch('https://formsubmit.co/sflanagan125@gmail.com', {
                method: 'POST',
                body: form
            });
            
            setSent(true);
        } catch (error) {
            alert('Error sending message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    if (sent) {
        return (
            <div style={{minHeight: '100vh', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'}}>
                <div style={{textAlign: 'center', maxWidth: '500px'}}>
                    <h2 className="display-md uppercase mb-medium">MESSAGE SENT!</h2>
                    <p className="body-lg mb-xlarge" style={{color: 'var(--gray-mid)'}}>
                        Thanks for reaching out. We'll get back to you within 24 hours.
                    </p>
                    <button onClick={() => setView('landing')} className="btn-primary">
                        BACK TO HOME
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{minHeight: '100vh', background: 'white'}}>
            {/* Header */}
            <nav style={{background: 'white', borderBottom: '1px solid #E5E5E5', padding: '16px 24px'}}>
                <div style={{maxWidth: '1200px', margin: '0 auto'}}>
                    <button 
                        onClick={() => setView('landing')}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            fontFamily: 'inherit'
                        }}
                    >
                        ← BACK
                    </button>
                </div>
            </nav>

            <div style={{padding: '80px 24px'}}>
                <div className="container-narrow">
                    <h1 className="display-lg uppercase mb-medium text-center">GET IN TOUCH</h1>
                    <p className="body-lg mb-xlarge text-center" style={{color: 'var(--gray-mid)'}}>
                        Questions about PáircPro? We're here to help.
                    </p>

                    <form onSubmit={handleSubmit} style={{maxWidth: '600px', margin: '0 auto'}}>
                        <div style={{marginBottom: '24px'}}>
                            <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                                NAME *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    border: '2px solid #E5E5E5',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>

                        <div style={{marginBottom: '24px'}}>
                            <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                                EMAIL *
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    border: '2px solid #E5E5E5',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>

                        <div style={{marginBottom: '32px'}}>
                            <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                                MESSAGE *
                            </label>
                            <textarea
                                required
                                rows="6"
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    border: '2px solid #E5E5E5',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontFamily: 'inherit',
                                    resize: 'vertical'
                                }}
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={sending}
                            className="btn-primary"
                            style={{width: '100%'}}
                        >
                            {sending ? 'SENDING...' : 'SEND MESSAGE'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

// Auth Page Component
function AuthPage({ setView, setUser }) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                alert('Check your email for the confirmation link!');
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{minHeight: '100vh', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'}}>
            <div style={{width: '100%', maxWidth: '400px'}}>
                <button 
                    onClick={() => setView('landing')}
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        marginBottom: '32px',
                        fontFamily: 'inherit'
                    }}
                >
                    ← BACK
                </button>

                <h1 className="display-md uppercase mb-large text-center">
                    {isSignUp ? 'CREATE ACCOUNT' : 'WELCOME BACK'}
                </h1>

                <form onSubmit={handleAuth}>
                    <div style={{marginBottom: '24px'}}>
                        <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                            EMAIL *
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '16px',
                                border: '2px solid #E5E5E5',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontFamily: 'inherit'
                            }}
                        />
                    </div>

                    <div style={{marginBottom: '32px'}}>
                        <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                            PASSWORD *
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '16px',
                                border: '2px solid #E5E5E5',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontFamily: 'inherit'
                            }}
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                        style={{width: '100%', marginBottom: '16px'}}
                    >
                        {loading ? 'LOADING...' : (isSignUp ? 'SIGN UP' : 'SIGN IN')}
                    </button>

                    <p style={{textAlign: 'center', fontSize: '14px', color: 'var(--gray-mid)'}}>
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                        <button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--primary-green)',
                                fontWeight: '600',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                fontFamily: 'inherit'
                            }}
                        >
                            {isSignUp ? 'Sign in' : 'Sign up'}
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
}

// Dashboard Component
function Dashboard({ user, setView, setUser }) {
    const [activeTab, setActiveTab] = useState('upload');
    const [videoFile, setVideoFile] = useState(null);
    const [videoUrl, setVideoUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [matches, setMatches] = useState([]);
    const [currentMatch, setCurrentMatch] = useState(null);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setView('landing');
    };

    const handleVideoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setUploading(true);
        try {
            // Upload to Supabase storage
            const fileName = `${user.id}/${Date.now()}-${file.name}`;
            const { data, error } = await supabase.storage
                .from('videos')
                .upload(fileName, file);

            if (error) throw error;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('videos')
                .getPublicUrl(fileName);

            setVideoUrl(publicUrl);
            setVideoFile(file);
            
            // Save match record
            const { data: matchData } = await supabase
                .from('matches')
                .insert([{
                    user_id: user.id,
                    video_url: publicUrl,
                    title: file.name,
                    created_at: new Date()
                }])
                .select()
                .single();

            setCurrentMatch(matchData);
            setActiveTab('analysis');
        } catch (error) {
            alert('Upload failed: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #00833E 0%, #006030 100%)'}}>
            {/* Header */}
            <header style={{background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                <div style={{maxWidth: '1400px', margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                        <svg width="32" height="32" viewBox="0 0 32 32">
                            <rect width="32" height="32" rx="8" fill="white"/>
                            <circle cx="16" cy="16" r="8" fill="#00833E"/>
                            <path d="M12 16 L16 12 L20 16 L16 20 Z" fill="white"/>
                        </svg>
                        <span style={{fontSize: '20px', fontWeight: '800', textTransform: 'uppercase', color: 'white'}}>PÁIRCPRO</span>
                    </div>
                    <button
                        onClick={handleSignOut}
                        style={{
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.3)',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            fontFamily: 'inherit'
                        }}
                    >
                        SIGN OUT
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div style={{display: 'flex', height: 'calc(100vh - 65px)'}}>
                {/* Sidebar */}
                <div style={{width: '240px', background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(255,255,255,0.1)', padding: '24px 16px'}}>
                    <div style={{marginBottom: '32px'}}>
                        <div style={{fontSize: '11px', color: 'rgba(255,255,255,0.6)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px'}}>Analysis</div>
                        <button
                            onClick={() => setActiveTab('upload')}
                            style={{
                                width: '100%',
                                background: activeTab === 'upload' ? 'rgba(255,255,255,0.15)' : 'transparent',
                                border: 'none',
                                color: 'white',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                textAlign: 'left',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '14px',
                                marginBottom: '8px',
                                fontFamily: 'inherit'
                            }}
                        >
                            🎥 Video Upload
                        </button>
                        <button
                            onClick={() => setActiveTab('matches')}
                            style={{
                                width: '100%',
                                background: activeTab === 'matches' ? 'rgba(255,255,255,0.15)' : 'transparent',
                                border: 'none',
                                color: 'white',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                textAlign: 'left',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '14px',
                                marginBottom: '8px',
                                fontFamily: 'inherit'
                            }}
                        >
                            📁 My Matches
                        </button>
                        <button
                            onClick={() => setActiveTab('analysis')}
                            style={{
                                width: '100%',
                                background: activeTab === 'analysis' ? 'rgba(255,255,255,0.15)' : 'transparent',
                                border: 'none',
                                color: 'white',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                textAlign: 'left',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '14px',
                                fontFamily: 'inherit'
                            }}
                        >
                            ⚡ Analysis
                        </button>
                    </div>
                </div>

                {/* Main Area */}
                <div style={{flex: 1, padding: '32px', overflowY: 'auto'}}>
                    {activeTab === 'upload' && (
                        <div style={{maxWidth: '800px', margin: '0 auto'}}>
                            <h1 style={{fontSize: '40px', fontWeight: '900', color: 'white', marginBottom: '16px', textTransform: 'uppercase'}}>Upload Match Video</h1>
                            <p style={{color: 'rgba(255,255,255,0.8)', fontSize: '18px', marginBottom: '48px'}}>
                                Upload GAA match footage to begin your analysis
                            </p>
                            
                            <div style={{
                                background: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(20px)',
                                border: '2px dashed rgba(255,255,255,0.3)',
                                borderRadius: '16px',
                                padding: '64px 32px',
                                textAlign: 'center'
                            }}>
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={handleVideoUpload}
                                    disabled={uploading}
                                    style={{display: 'none'}}
                                    id="video-upload"
                                />
                                <label
                                    htmlFor="video-upload"
                                    style={{
                                        cursor: uploading ? 'not-allowed' : 'pointer',
                                        display: 'block'
                                    }}
                                >
                                    <div style={{fontSize: '64px', marginBottom: '24px'}}>🎥</div>
                                    <h3 style={{color: 'white', fontSize: '24px', fontWeight: '700', marginBottom: '12px'}}>
                                        {uploading ? 'Uploading...' : 'Click to Upload Video'}
                                    </h3>
                                    <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '16px'}}>
                                        MP4, MOV, AVI • Max 2GB
                                    </p>
                                </label>
                            </div>

                            {videoFile && (
                                <div style={{marginTop: '32px', padding: '24px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px'}}>
                                    <p style={{color: 'white', fontWeight: '600', marginBottom: '8px'}}>✓ Uploaded: {videoFile.name}</p>
                                    <button
                                        onClick={() => setActiveTab('analysis')}
                                        className="btn-primary"
                                        style={{marginTop: '16px'}}
                                    >
                                        START ANALYSIS
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'matches' && (
                        <div>
                            <h1 style={{fontSize: '40px', fontWeight: '900', color: 'white', marginBottom: '32px', textTransform: 'uppercase'}}>My Matches</h1>
                            <div style={{
                                background: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '12px',
                                padding: '48px',
                                textAlign: 'center'
                            }}>
                                <p style={{color: 'rgba(255,255,255,0.8)', fontSize: '18px'}}>
                                    No matches yet. Upload your first video to get started!
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'analysis' && (
                        <div>
                            <h1 style={{fontSize: '40px', fontWeight: '900', color: 'white', marginBottom: '32px', textTransform: 'uppercase'}}>Video Analysis</h1>
                            
                            {videoUrl ? (
                                <div style={{
                                    background: 'rgba(0,0,0,0.3)',
                                    backdropFilter: 'blur(20px)',
                                    borderRadius: '16px',
                                    padding: '24px',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }}>
                                    <video
                                        controls
                                        style={{width: '100%', borderRadius: '12px', marginBottom: '24px'}}
                                        src={videoUrl}
                                    />
                                    
                                    {/* Analysis Tools */}
                                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '24px'}}>
                                        <div style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            padding: '20px',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(255,255,255,0.1)'
                                        }}>
                                            <div style={{fontSize: '32px', marginBottom: '8px'}}>⚽</div>
                                            <h3 style={{color: 'white', fontSize: '16px', fontWeight: '700', marginBottom: '4px'}}>Tag Events</h3>
                                            <p style={{color: 'rgba(255,255,255,0.6)', fontSize: '13px'}}>Mark goals, points, fouls</p>
                                        </div>
                                        
                                        <div style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            padding: '20px',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(255,255,255,0.1)'
                                        }}>
                                            <div style={{fontSize: '32px', marginBottom: '8px'}}>📊</div>
                                            <h3 style={{color: 'white', fontSize: '16px', fontWeight: '700', marginBottom: '4px'}}>Statistics</h3>
                                            <p style={{color: 'rgba(255,255,255,0.6)', fontSize: '13px'}}>Track possessions, shots</p>
                                        </div>
                                        
                                        <div style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            padding: '20px',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(255,255,255,0.1)'
                                        }}>
                                            <div style={{fontSize: '32px', marginBottom: '8px'}}>🔥</div>
                                            <h3 style={{color: 'white', fontSize: '16px', fontWeight: '700', marginBottom: '4px'}}>Heat Maps</h3>
                                            <p style={{color: 'rgba(255,255,255,0.6)', fontSize: '13px'}}>Visualize positioning</p>
                                        </div>
                                        
                                        <div style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            padding: '20px',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(255,255,255,0.1)'
                                        }}>
                                            <div style={{fontSize: '32px', marginBottom: '8px'}}>✂️</div>
                                            <h3 style={{color: 'white', fontSize: '16px', fontWeight: '700', marginBottom: '4px'}}>Create Clips</h3>
                                            <p style={{color: 'rgba(255,255,255,0.6)', fontSize: '13px'}}>Export highlights</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    backdropFilter: 'blur(20px)',
                                    borderRadius: '12px',
                                    padding: '48px',
                                    textAlign: 'center'
                                }}>
                                    <p style={{color: 'rgba(255,255,255,0.8)', fontSize: '18px', marginBottom: '24px'}}>
                                        Upload a video to start your analysis
                                    </p>
                                    <button
                                        onClick={() => setActiveTab('upload')}
                                        className="btn-primary"
                                    >
                                        UPLOAD VIDEO
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
