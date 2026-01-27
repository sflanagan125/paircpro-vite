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
                
                <button onClick={() => setMenuOpen(!menuOpen)} style={{background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px'}}>
                    <div style={{width: '24px', height: '2px', background: 'white', borderRadius: '2px'}}></div>
                    <div style={{width: '24px', height: '2px', background: 'white', borderRadius: '2px'}}></div>
                    <div style={{width: '24px', height: '2px', background: 'white', borderRadius: '2px'}}></div>
                </button>
                
                {menuOpen && (
                    <div style={{position: 'absolute', top: '72px', right: '24px', background: 'white', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', minWidth: '220px', zIndex: 1000}}>
                        <div style={{padding: '8px 0'}}>
                            <div style={{padding: '12px 20px', borderBottom: '1px solid #E5E5E5'}}>
                                <div style={{fontSize: '14px', fontWeight: '700', color: '#333'}}>{user.email}</div>
                                <div style={{fontSize: '12px', color: '#666', marginTop: '4px'}}>Coach Account</div>
                            </div>
                            <button onClick={() => { setMenuOpen(false); setActivePage('settings'); }} style={{width: '100%', padding: '12px 20px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#333', fontFamily: 'inherit'}}>
                                Settings
                            </button>
                            <div style={{borderTop: '1px solid #E5E5E5', marginTop: '4px', paddingTop: '4px'}}>
                                <button onClick={() => { setMenuOpen(false); handleSignOut(); }} style={{width: '100%', padding: '12px 20px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#DC2626', fontFamily: 'inherit'}}>
                                    Sign Out
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
            {activePage === 'reports' && <Reports user={user} currentMatch={currentMatch} />}
            {activePage === 'dashboardview' && <DashboardView user={user} matches={matches} currentMatch={currentMatch} />}
            {activePage === 'settings' && <Settings user={user} setView={setView} setActivePage={setActivePage} />}
        </div>
    );
}

export default Dashboard;
