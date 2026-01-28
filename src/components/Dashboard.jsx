import { useState } from 'react';
import VideoAnalysis from './VideoAnalysis';
import MyFiles from './MyFiles';
import Reports from './Reports';
import DashboardView from './DashboardView';
import Settings from './Settings';

function Dashboard({ user, setView, setUser, supabase }) {
    const [activePage, setActivePage] = useState('analysis');
    const [menuOpen, setMenuOpen] = useState(false);
    const [currentMatch, setCurrentMatch] = useState(null);
    const [matches, setMatches] = useState([]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setView('landing');
    };

    const getInitials = (email) => {
        return email.substring(0, 2).toUpperCase();
    };

    return (
        <div style={{height: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #00833E 0%, #006030 100%)'}}>
            {/* Top Bar */}
            <div style={{background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer'}} onClick={() => setActivePage('analysis')}>
                    <svg width="32" height="32" viewBox="0 0 32 32">
                        <rect width="32" height="32" rx="8" fill="white"/>
                        <circle cx="16" cy="16" r="8" fill="#00833E"/>
                    </svg>
                    <span style={{fontSize: '20px', fontWeight: '800', color: 'white', textTransform: 'uppercase'}}>PÁIRCPRO</span>
                </div>
                
                <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                    {/* Profile Menu */}
                    <div onClick={() => setMenuOpen(!menuOpen)} style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}>
                        <div style={{width: '36px', height: '36px', borderRadius: '50%', background: 'white', color: '#00833E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px'}}>
                            {getInitials(user.email)}
                        </div>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <polyline points="6 9 12 15 18 9"/>
                        </svg>
                    </div>
                </div>
                
                {menuOpen && (
                    <div style={{position: 'absolute', top: '72px', right: '24px', background: 'white', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', minWidth: '220px', zIndex: 1000}}>
                        <div style={{padding: '8px 0'}}>
                            <div style={{padding: '12px 20px', borderBottom: '1px solid #E5E5E5'}}>
                                <div style={{fontSize: '14px', fontWeight: '700', color: '#333'}}>{user.email}</div>
                                <div style={{fontSize: '12px', color: '#666', marginTop: '4px'}}>Coach Account</div>
                            </div>
                            <button onClick={() => { setMenuOpen(false); setActivePage('settings'); }} style={{width: '100%', padding: '12px 20px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#333', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6"/></svg>
                                Profile settings
                            </button>
                            <button onClick={() => { setMenuOpen(false); setActivePage('settings'); }} style={{width: '100%', padding: '12px 20px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#333', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                                Account settings
                            </button>
                            <div style={{borderTop: '1px solid #E5E5E5', marginTop: '4px', paddingTop: '4px'}}>
                                <button onClick={() => { setMenuOpen(false); handleSignOut(); }} style={{width: '100%', padding: '12px 20px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#DC2626', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14l5-5-5-5m5 5H9"/></svg>
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Navigation Tabs */}
            <div style={{background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '0 24px', display: 'flex', gap: '8px'}}>
                {[
                    { id: 'analysis', label: 'Video Analysis' },
                    { id: 'myfiles', label: 'My Files' },
                    { id: 'reports', label: 'Reports' },
                    { id: 'dashboardview', label: 'Dashboard' }
                ].map(page => (
                    <button key={page.id} onClick={() => setActivePage(page.id)} style={{background: activePage === page.id ? 'rgba(255,255,255,0.15)' : 'transparent', border: 'none', color: 'white', padding: '16px 24px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', fontFamily: 'inherit', borderBottom: activePage === page.id ? '3px solid white' : '3px solid transparent'}}>
                        {page.label}
                    </button>
                ))}
            </div>

            {/* Page Content */}
            {activePage === 'analysis' && <VideoAnalysis user={user} supabase={supabase} currentMatch={currentMatch} setCurrentMatch={setCurrentMatch} />}
            {activePage === 'myfiles' && <MyFiles user={user} supabase={supabase} matches={matches} setMatches={setMatches} setActivePage={setActivePage} setCurrentMatch={setCurrentMatch} />}
            {activePage === 'reports' && <Reports user={user} currentMatch={currentMatch} supabase={supabase} setCurrentMatch={setCurrentMatch} />}
            {activePage === 'dashboardview' && <DashboardView user={user} matches={matches} currentMatch={currentMatch} />}
            {activePage === 'settings' && <Settings user={user} setView={setView} setActivePage={setActivePage} supabase={supabase} />}
        </div>
    );
}

export default Dashboard;
