import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

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

    if (loading) return <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><div style={{textAlign: 'center'}}><div style={{width: '50px', height: '50px', border: '3px solid #E5E5E5', borderTopColor: '#00833E', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite'}}></div><p style={{color: '#666', fontSize: '14px', fontWeight: '600'}}>LOADING...</p></div></div>;
    
    if (view === 'dashboard' && user) {
        return <Dashboard user={user} setView={setView} setUser={setUser} />;
    }

    return null;
}

// COMPLETE DASHBOARD WITH ALL FEATURES
function Dashboard({ user, setView, setUser }) {
    const videoRef = useRef(null);
    
    // Navigation
    const [activePage, setActivePage] = useState('analysis'); // analysis, myfiles, reports, dashboardview, settings
    const [activeAnalysisView, setActiveAnalysisView] = useState('upload'); // upload, video
    const [menuOpen, setMenuOpen] = useState(false);
    
    // Video & Match
    const [videoUrl, setVideoUrl] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [currentMatch, setCurrentMatch] = useState(null);
    const [matches, setMatches] = useState([]);
    const [uploading, setUploading] = useState(false);
    
    // Match Setup
    const [sport, setSport] = useState('football');
    const [homeTeam, setHomeTeam] = useState('Home Team');
    const [awayTeam, setAwayTeam] = useState('Away Team');
    
    // Scores
    const [homeGoals, setHomeGoals] = useState(0);
    const [homePoints, setHomePoints] = useState(0);
    const [awayGoals, setAwayGoals] = useState(0);
    const [awayPoints, setAwayPoints] = useState(0);
    
    // Events
    const [events, setEvents] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('home'); // NEW: home or away
    const [eventNotes, setEventNotes] = useState(''); // NEW: notes for tagging
    
    // Video Player
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);

    // Event types - Football
    const footballEvents = [
        { id: 'goal', label: 'Goal', color: '#10b981', category: 'scoring' },
        { id: 'point', label: 'Point', color: '#f59e0b', category: 'scoring' },
        { id: '2point', label: '2 Point', color: '#8b5cf6', category: 'scoring' },
        { id: 'wide', label: 'Wide', color: '#ef4444', category: 'scoring' },
        { id: 'saved', label: 'Saved', color: '#8b5cf6', category: 'scoring' },
        { id: '45', label: '45', color: '#3b82f6', category: 'scoring' },
        { id: 'own_kickout_won', label: 'Won', color: '#10b981', category: 'own_kickouts' },
        { id: 'own_kickout_lost', label: 'Lost', color: '#ef4444', category: 'own_kickouts' },
        { id: 'opp_kickout_won', label: 'Won', color: '#10b981', category: 'opp_kickouts' },
        { id: 'opp_kickout_lost', label: 'Lost', color: '#ef4444', category: 'opp_kickouts' },
        { id: 'free_kick', label: 'Free Kick', color: '#06b6d4', category: 'restarts' },
        { id: 'sideline', label: 'Sideline', color: '#06b6d4', category: 'restarts' },
        { id: 'penalty', label: 'Penalty', color: '#ec4899', category: 'restarts' },
        { id: 'throwin', label: 'Throw-in', color: '#14b8a6', category: 'restarts' },
        { id: 'foul', label: 'Foul', color: '#f97316', category: 'fouls' },
        { id: 'yellow', label: 'Yellow Card', color: '#fbbf24', category: 'fouls' },
        { id: 'red', label: 'Red Card', color: '#dc2626', category: 'fouls' },
        { id: 'black', label: 'Black Card', color: '#1f2937', category: 'fouls' },
        { id: 'substitution', label: 'Substitution', color: '#6366f1', category: 'other' },
        { id: 'turnover', label: 'Turnover', color: '#f43f5e', category: 'other' }
    ];

    // Event types - Hurling (with puckouts instead of kickouts)
    const hurlingEvents = [
        { id: 'goal', label: 'Goal', color: '#10b981', category: 'scoring' },
        { id: 'point', label: 'Point', color: '#f59e0b', category: 'scoring' },
        { id: 'wide', label: 'Wide', color: '#ef4444', category: 'scoring' },
        { id: 'saved', label: 'Saved', color: '#8b5cf6', category: 'scoring' },
        { id: '65', label: '65', color: '#3b82f6', category: 'scoring' },
        { id: 'own_puckout_won', label: 'Won', color: '#10b981', category: 'own_puckouts' },
        { id: 'own_puckout_lost', label: 'Lost', color: '#ef4444', category: 'own_puckouts' },
        { id: 'opp_puckout_won', label: 'Won', color: '#10b981', category: 'opp_puckouts' },
        { id: 'opp_puckout_lost', label: 'Lost', color: '#ef4444', category: 'opp_puckouts' },
        { id: 'free', label: 'Free', color: '#06b6d4', category: 'restarts' },
        { id: 'sideline', label: 'Sideline', color: '#06b6d4', category: 'restarts' },
        { id: 'penalty', label: 'Penalty', color: '#ec4899', category: 'restarts' },
        { id: 'foul', label: 'Foul', color: '#f97316', category: 'fouls' },
        { id: 'yellow', label: 'Yellow Card', color: '#fbbf24', category: 'fouls' },
        { id: 'red', label: 'Red Card', color: '#dc2626', category: 'fouls' },
        { id: 'substitution', label: 'Substitution', color: '#6366f1', category: 'other' },
        { id: 'turnover', label: 'Turnover', color: '#f43f5e', category: 'other' }
    ];

    const currentEvents = sport === 'football' ? footballEvents : hurlingEvents;
    const eventsByCategory = {
        scoring: currentEvents.filter(e => e.category === 'scoring'),
        own_kickouts: currentEvents.filter(e => e.category === 'own_kickouts'),
        opp_kickouts: currentEvents.filter(e => e.category === 'opp_kickouts'),
        own_puckouts: currentEvents.filter(e => e.category === 'own_puckouts'),
        opp_puckouts: currentEvents.filter(e => e.category === 'opp_puckouts'),
        restarts: currentEvents.filter(e => e.category === 'restarts'),
        fouls: currentEvents.filter(e => e.category === 'fouls'),
        other: currentEvents.filter(e => e.category === 'other')
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setView('landing');
    };

    const handleVideoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const maxSize = 2 * 1024 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('File too large. Maximum size is 2GB.');
            return;
        }
        
        setUploading(true);
        try {
            const fileName = `${user.id}/${Date.now()}-${file.name}`;
            const { error } = await supabase.storage.from('videos').upload(fileName, file);
            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage.from('videos').getPublicUrl(fileName);
            setVideoUrl(publicUrl);
            setVideoFile(file);
            
            const { data: matchData } = await supabase.from('matches').insert([{
                user_id: user.id,
                video_url: publicUrl,
                title: file.name,
                home_team: homeTeam,
                away_team: awayTeam,
                sport: sport,
                events: []
            }]).select().single();

            setCurrentMatch(matchData);
            setActiveAnalysisView('video');
        } catch (error) {
            alert('Upload failed: ' + error.message + '\n\nMake sure the "videos" bucket exists in Supabase Storage (public, 2GB limit)');
        } finally {
            setUploading(false);
        }
    };

    const tagEvent = async (event) => {
        if (!videoRef.current) return;
        
        const newEvent = {
            id: Date.now(),
            type: event.id,
            label: event.label,
            color: event.color,
            timestamp: videoRef.current.currentTime,
            team: selectedTeam, // home or away
            notes: eventNotes
        };
        
        const updatedEvents = [...events, newEvent].sort((a, b) => a.timestamp - b.timestamp);
        setEvents(updatedEvents);
        
        // Update scores for the selected team
        if (event.id === 'goal') {
            if (selectedTeam === 'home') setHomeGoals(homeGoals + 1);
            else setAwayGoals(awayGoals + 1);
        } else if (event.id === 'point') {
            if (selectedTeam === 'home') setHomePoints(homePoints + 1);
            else setAwayPoints(awayPoints + 1);
        } else if (event.id === '2point') {
            if (selectedTeam === 'home') setHomePoints(homePoints + 2);
            else setAwayPoints(awayPoints + 2);
        }
        
        setEventNotes(''); // Clear notes after tagging
        
        if (currentMatch) {
            await supabase.from('matches').update({ 
                events: updatedEvents,
                home_score: selectedTeam === 'home' && event.id === 'goal' ? homeGoals + 1 : homeGoals,
                away_score: selectedTeam === 'away' && event.id === 'goal' ? awayGoals + 1 : awayGoals
            }).eq('id', currentMatch.id);
        }
    };

    const seekToEvent = (timestamp) => {
        if (videoRef.current) {
            videoRef.current.currentTime = timestamp;
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    const deleteEvent = async (eventId) => {
        const updatedEvents = events.filter(e => e.id !== eventId);
        setEvents(updatedEvents);
        if (currentMatch) {
            await supabase.from('matches').update({ events: updatedEvents }).eq('id', currentMatch.id);
        }
    };

    const togglePlayPause = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const calculateStats = () => {
        const homeEvents = events.filter(e => e.team === 'home');
        const awayEvents = events.filter(e => e.team === 'away');
        return {
            totalEvents: events.length,
            homeGoals: homeEvents.filter(e => e.type === 'goal').length,
            awayGoals: awayEvents.filter(e => e.type === 'goal').length,
            homePoints: homeEvents.filter(e => e.type === 'point' || e.type === '2point').length,
            awayPoints: awayEvents.filter(e => e.type === 'point' || e.type === '2point').length,
            homeFouls: homeEvents.filter(e => e.type === 'foul').length,
            awayFouls: awayEvents.filter(e => e.type === 'foul').length,
            homeWides: homeEvents.filter(e => e.type === 'wide').length,
            awayWides: awayEvents.filter(e => e.type === 'wide').length
        };
    };

    const generatePDFReport = () => {
        const stats = calculateStats();
        const report = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Match Report</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
        h1 { color: #00833E; border-bottom: 3px solid #00833E; padding-bottom: 10px; }
        h2 { color: #006030; margin-top: 30px; }
        .score { font-size: 48px; font-weight: bold; text-align: center; margin: 20px 0; color: #00833E; }
        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
        .stat-box { background: #f5f5f5; padding: 15px; border-radius: 8px; text-align: center; }
        .stat-label { font-size: 12px; color: #666; text-transform: uppercase; }
        .stat-value { font-size: 28px; font-weight: bold; color: #00833E; }
        .event { padding: 10px; border-left: 4px solid #00833E; margin: 10px 0; background: #f9f9f9; }
        .event-time { font-weight: bold; color: #006030; }
    </style>
</head>
<body>
    <h1>PÁIRCPRO MATCH REPORT</h1>
    <p><strong>Match:</strong> ${homeTeam} vs ${awayTeam}</p>
    <p><strong>Sport:</strong> ${sport.charAt(0).toUpperCase() + sport.slice(1)}</p>
    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
    
    <h2>Final Score</h2>
    <div class="score">${homeTeam}: ${homeGoals}-${homePoints.toString().padStart(2, '0')} vs ${awayTeam}: ${awayGoals}-${awayPoints.toString().padStart(2, '0')}</div>
    
    <h2>Match Statistics</h2>
    <div class="stats-grid">
        <div class="stat-box"><div class="stat-label">Total Events</div><div class="stat-value">${stats.totalEvents}</div></div>
        <div class="stat-box"><div class="stat-label">Goals</div><div class="stat-value">${stats.homeGoals} - ${stats.awayGoals}</div></div>
        <div class="stat-box"><div class="stat-label">Points</div><div class="stat-value">${stats.homePoints} - ${stats.awayPoints}</div></div>
        <div class="stat-box"><div class="stat-label">Fouls</div><div class="stat-value">${stats.homeFouls} - ${stats.awayFouls}</div></div>
        <div class="stat-box"><div class="stat-label">Wides</div><div class="stat-value">${stats.homeWides} - ${stats.awayWides}</div></div>
    </div>
    
    <h2>Events Timeline</h2>
    ${events.map(e => `<div class="event"><span class="event-time">${formatTime(e.timestamp)}</span> - ${e.team === 'home' ? homeTeam : awayTeam} - <strong>${e.label}</strong>${e.notes ? ' (' + e.notes + ')' : ''}</div>`).join('')}
</body>
</html>`;
        
        const blob = new Blob([report], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${homeTeam}-vs-${awayTeam}-${Date.now()}.html`;
        a.click();
    };

    useEffect(() => {
        const loadMatches = async () => {
            const { data } = await supabase.from('matches').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
            if (data) setMatches(data);
        };
        loadMatches();
    }, [user.id]);

    useEffect(() => {
        if (videoRef.current) {
            const video = videoRef.current;
            const handleLoadedMetadata = () => setDuration(video.duration);
            const handleTimeUpdate = () => setCurrentTime(video.currentTime);
            video.addEventListener('loadedmetadata', handleLoadedMetadata);
            video.addEventListener('timeupdate', handleTimeUpdate);
            return () => {
                video.removeEventListener('loadedmetadata', handleLoadedMetadata);
                video.removeEventListener('timeupdate', handleTimeUpdate);
            };
        }
    }, [videoUrl]);

    const stats = calculateStats();

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
                            <button onClick={() => { setMenuOpen(false); setActivePage('settings'); }} style={{width: '100%', padding: '12px 20px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#333', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m5.9-13.9l-4.2 4.2m-3.4 3.4l-4.2 4.2M23 12h-6m-6 0H1m13.9 5.9l-4.2-4.2m-3.4-3.4l-4.2-4.2"/></svg>
                                Profile Settings
                            </button>
                            <button onClick={() => { setMenuOpen(false); setActivePage('settings'); }} style={{width: '100%', padding: '12px 20px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#333', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
                                Account Settings
                            </button>
                            <div style={{borderTop: '1px solid #E5E5E5', marginTop: '4px', paddingTop: '4px'}}>
                                <button onClick={() => { setMenuOpen(false); handleSignOut(); }} style={{width: '100%', padding: '12px 20px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#DC2626', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14l5-5-5-5m5 5H9"/></svg>
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Navigation Tabs */}
            <div style={{background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '0 24px', display: 'flex', gap: '8px'}}>
                {['analysis', 'myfiles', 'reports', 'dashboardview'].map(page => (
                    <button key={page} onClick={() => setActivePage(page)} style={{background: activePage === page ? 'rgba(255,255,255,0.15)' : 'transparent', border: 'none', color: 'white', padding: '16px 24px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', fontFamily: 'inherit', borderBottom: activePage === page ? '3px solid white' : '3px solid transparent'}}>
                        {page === 'analysis' ? 'Video Analysis' : page === 'myfiles' ? 'My Files' : page === 'reports' ? 'Reports' : 'Dashboard'}
                    </button>
                ))}
            </div>

            {/* SETTINGS PAGE */}
            {activePage === 'settings' && (
                <div style={{flex: 1, padding: '40px', overflowY: 'auto'}}>
                    <div style={{maxWidth: '800px', margin: '0 auto'}}>
                        <h1 style={{fontSize: '32px', fontWeight: '900', color: 'white', marginBottom: '32px'}}>Settings</h1>
                        
                        <div style={{background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '32px', marginBottom: '24px'}}>
                            <h2 style={{fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '24px'}}>Profile Settings</h2>
                            <div style={{marginBottom: '20px'}}>
                                <label style={{display: 'block', color: 'white', fontWeight: '600', fontSize: '14px', marginBottom: '8px'}}>Email</label>
                                <input type="email" value={user.email} disabled style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '16px'}} />
                            </div>
                        </div>

                        <div style={{background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '32px'}}>
                            <h2 style={{fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '16px'}}>Subscription</h2>
                            <div style={{padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '16px'}}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                                    <div style={{fontSize: '16px', fontWeight: '600', color: 'white'}}>Coach Plan</div>
                                    <div style={{fontSize: '24px', fontWeight: '800', color: 'white'}}>€97/mo</div>
                                </div>
                                <div style={{fontSize: '14px', color: 'rgba(255,255,255,0.7)'}}>50GB Storage • 3 Users</div>
                            </div>
                            <button onClick={() => setActivePage('analysis')} style={{width: '100%', padding: '12px', background: '#DC2626', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', fontFamily: 'inherit', marginBottom: '12px'}}>
                                Cancel Subscription
                            </button>
                            <button onClick={() => setView('pricing')} style={{width: '100%', padding: '12px', background: 'white', border: 'none', color: '#00833E', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', fontFamily: 'inherit'}}>
                                Change Plan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MY FILES PAGE */}
            {activePage === 'myfiles' && (
                <div style={{flex: 1, padding: '40px', overflowY: 'auto'}}>
                    <div style={{maxWidth: '1200px', margin: '0 auto'}}>
                        <h1 style={{fontSize: '32px', fontWeight: '900', color: 'white', marginBottom: '32px'}}>My Files</h1>
                        {matches.length > 0 ? (
                            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px'}}>
                                {matches.map(match => (
                                    <div key={match.id} onClick={() => { setCurrentMatch(match); setVideoUrl(match.video_url); setHomeTeam(match.home_team || 'Home Team'); setAwayTeam(match.away_team || 'Away Team'); setEvents(match.events || []); setSport(match.sport || 'football'); setActivePage('analysis'); setActiveAnalysisView('video'); }} style={{background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '24px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.2s'}} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                                        <h3 style={{color: 'white', fontSize: '18px', fontWeight: '700', marginBottom: '8px'}}>{match.title}</h3>
                                        <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '14px'}}>{new Date(match.created_at).toLocaleDateString()} • {(match.events || []).length} events • {match.sport}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '48px', textAlign: 'center'}}>
                                <p style={{color: 'rgba(255,255,255,0.8)', fontSize: '18px', marginBottom: '24px'}}>No files yet</p>
                                <button onClick={() => setActivePage('analysis')} style={{background: 'white', color: '#00833E', padding: '12px 24px', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit'}}>UPLOAD VIDEO</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* REPORTS PAGE */}
            {activePage === 'reports' && (
                <div style={{flex: 1, padding: '40px', overflowY: 'auto'}}>
                    <div style={{maxWidth: '1200px', margin: '0 auto'}}>
                        <h1 style={{fontSize: '32px', fontWeight: '900', color: 'white', marginBottom: '32px'}}>Reports</h1>
                        {currentMatch ? (
                            <div>
                                <div style={{background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '32px', marginBottom: '24px'}}>
                                    <h2 style={{fontSize: '24px', fontWeight: '700', color: 'white', marginBottom: '24px'}}>{homeTeam} vs {awayTeam}</h2>
                                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px'}}>
                                        <div style={{background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '8px', textAlign: 'center'}}>
                                            <div style={{fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px'}}>Total Events</div>
                                            <div style={{fontSize: '32px', fontWeight: '800', color: 'white'}}>{stats.totalEvents}</div>
                                        </div>
                                        <div style={{background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '8px', textAlign: 'center'}}>
                                            <div style={{fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px'}}>Goals</div>
                                            <div style={{fontSize: '32px', fontWeight: '800', color: 'white'}}>{stats.homeGoals} - {stats.awayGoals}</div>
                                        </div>
                                        <div style={{background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '8px', textAlign: 'center'}}>
                                            <div style={{fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px'}}>Points</div>
                                            <div style={{fontSize: '32px', fontWeight: '800', color: 'white'}}>{stats.homePoints} - {stats.awayPoints}</div>
                                        </div>
                                    </div>
                                    <button onClick={generatePDFReport} style={{marginTop: '24px', width: '100%', padding: '16px', background: 'white', border: 'none', color: '#00833E', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '16px', fontFamily: 'inherit'}}>
                                        DOWNLOAD PDF REPORT
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div style={{background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '48px', textAlign: 'center'}}>
                                <p style={{color: 'rgba(255,255,255,0.8)', fontSize: '18px'}}>No match selected</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* DASHBOARD VIEW PAGE */}
            {activePage === 'dashboardview' && (
                <div style={{flex: 1, padding: '40px', overflowY: 'auto'}}>
                    <div style={{maxWidth: '1400px', margin: '0 auto'}}>
                        <h1 style={{fontSize: '32px', fontWeight: '900', color: 'white', marginBottom: '32px'}}>Dashboard Overview</h1>
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px'}}>
                            <div style={{background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '32px'}}>
                                <div style={{fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '700'}}>Total Matches</div>
                                <div style={{fontSize: '48px', fontWeight: '900', color: 'white'}}>{matches.length}</div>
                            </div>
                            <div style={{background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '32px'}}>
                                <div style={{fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '700'}}>Total Events Tagged</div>
                                <div style={{fontSize: '48px', fontWeight: '900', color: 'white'}}>{matches.reduce((sum, m) => sum + (m.events?.length || 0), 0)}</div>
                            </div>
                            <div style={{background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '32px'}}>
                                <div style={{fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '700'}}>Storage Used</div>
                                <div style={{fontSize: '48px', fontWeight: '900', color: 'white'}}>2.4GB</div>
                            </div>
                        </div>
                        
                        {currentMatch && events.length > 0 && (
                            <div style={{background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '32px'}}>
                                <h2 style={{fontSize: '24px', fontWeight: '700', color: 'white', marginBottom: '24px'}}>Latest Match: {homeTeam} vs {awayTeam}</h2>
                                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px'}}>
                                    {/* Event Distribution Chart */}
                                    <div>
                                        <div style={{fontSize: '16px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px', fontWeight: '700'}}>Event Distribution</div>
                                        <div style={{height: '300px', background: 'white', borderRadius: '8px', padding: '20px'}}>
                                            <canvas id="eventChart" style={{maxHeight: '260px'}}></canvas>
                                        </div>
                                    </div>
                                    {/* Team Performance Chart */}
                                    <div>
                                        <div style={{fontSize: '16px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px', fontWeight: '700'}}>Team Performance</div>
                                        <div style={{height: '300px', background: 'white', borderRadius: '8px', padding: '20px'}}>
                                            <canvas id="performanceChart" style={{maxHeight: '260px'}}></canvas>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={generatePDFReport} style={{marginTop: '24px', padding: '12px 24px', background: 'white', border: 'none', color: '#00833E', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', fontFamily: 'inherit'}}>
                                    DOWNLOAD REPORT
                                </button>
                            </div>
                        )}
                        
                        {/* Load Chart.js and render charts */}
                        {currentMatch && events.length > 0 && (() => {
                            setTimeout(() => {
                                if (typeof Chart === 'undefined') {
                                    const script = document.createElement('script');
                                    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js';
                                    script.onload = () => renderCharts();
                                    document.head.appendChild(script);
                                } else {
                                    renderCharts();
                                }
                                
                                function renderCharts() {
                                    const eventTypes = {};
                                    events.forEach(e => {
                                        eventTypes[e.label] = (eventTypes[e.label] || 0) + 1;
                                    });
                                    
                                    // Event Distribution Pie Chart
                                    const ctx1 = document.getElementById('eventChart');
                                    if (ctx1 && !ctx1.chart) {
                                        ctx1.chart = new Chart(ctx1, {
                                            type: 'pie',
                                            data: {
                                                labels: Object.keys(eventTypes),
                                                datasets: [{
                                                    data: Object.values(eventTypes),
                                                    backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#fbbf24', '#dc2626']
                                                }]
                                            },
                                            options: {
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: {
                                                    legend: { position: 'bottom' }
                                                }
                                            }
                                        });
                                    }
                                    
                                    // Team Performance Bar Chart
                                    const ctx2 = document.getElementById('performanceChart');
                                    if (ctx2 && !ctx2.chart) {
                                        ctx2.chart = new Chart(ctx2, {
                                            type: 'bar',
                                            data: {
                                                labels: ['Goals', 'Points', 'Fouls', 'Wides'],
                                                datasets: [
                                                    {
                                                        label: homeTeam,
                                                        data: [stats.homeGoals, stats.homePoints, stats.homeFouls, stats.homeWides],
                                                        backgroundColor: '#00833E'
                                                    },
                                                    {
                                                        label: awayTeam,
                                                        data: [stats.awayGoals, stats.awayPoints, stats.awayFouls, stats.awayWides],
                                                        backgroundColor: '#006030'
                                                    }
                                                ]
                                            },
                                            options: {
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: {
                                                    legend: { position: 'top' }
                                                },
                                                scales: {
                                                    y: { beginAtZero: true }
                                                }
                                            }
                                        });
                                    }
                                }
                            }, 100);
                            return null;
                        })()}
                    </div>
                </div>
            )}

            {/* VIDEO ANALYSIS PAGE */}
            {activePage === 'analysis' && (
                <>
                    {activeAnalysisView === 'upload' && (
                        <div style={{flex: 1, padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <div style={{maxWidth: '800px', width: '100%'}}>
                                <h1 style={{fontSize: '48px', fontWeight: '900', color: 'white', marginBottom: '32px', textAlign: 'center', textTransform: 'uppercase'}}>Upload Match Video</h1>
                                
                                <div style={{display: 'flex', gap: '16px', marginBottom: '32px'}}>
                                    <button onClick={() => setSport('football')} style={{flex: 1, padding: '20px', background: sport === 'football' ? 'white' : 'rgba(255,255,255,0.1)', color: sport === 'football' ? '#00833E' : 'white', border: '2px solid ' + (sport === 'football' ? 'white' : 'rgba(255,255,255,0.3)'), borderRadius: '12px', cursor: 'pointer', fontSize: '18px', fontWeight: '700', fontFamily: 'inherit', textTransform: 'uppercase'}}>FOOTBALL</button>
                                    <button onClick={() => setSport('hurling')} style={{flex: 1, padding: '20px', background: sport === 'hurling' ? 'white' : 'rgba(255,255,255,0.1)', color: sport === 'hurling' ? '#00833E' : 'white', border: '2px solid ' + (sport === 'hurling' ? 'white' : 'rgba(255,255,255,0.3)'), borderRadius: '12px', cursor: 'pointer', fontSize: '18px', fontWeight: '700', fontFamily: 'inherit', textTransform: 'uppercase'}}>HURLING</button>
                                </div>
                                
                                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px'}}>
                                    <div>
                                        <label style={{display: 'block', color: 'white', fontWeight: '600', fontSize: '14px', marginBottom: '8px', textTransform: 'uppercase'}}>Home Team</label>
                                        <input type="text" value={homeTeam} onChange={(e) => setHomeTeam(e.target.value)} style={{width: '100%', padding: '16px', borderRadius: '8px', border: '2px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '16px', fontFamily: 'inherit'}} />
                                    </div>
                                    <div>
                                        <label style={{display: 'block', color: 'white', fontWeight: '600', fontSize: '14px', marginBottom: '8px', textTransform: 'uppercase'}}>Away Team</label>
                                        <input type="text" value={awayTeam} onChange={(e) => setAwayTeam(e.target.value)} style={{width: '100%', padding: '16px', borderRadius: '8px', border: '2px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '16px', fontFamily: 'inherit'}} />
                                    </div>
                                </div>
                                
                                <div style={{background: 'rgba(255,255,255,0.1)', border: '2px dashed rgba(255,255,255,0.3)', borderRadius: '16px', padding: '80px 32px', textAlign: 'center'}}>
                                    <input type="file" accept="video/*" onChange={handleVideoUpload} disabled={uploading} style={{display: 'none'}} id="video-upload" />
                                    <label htmlFor="video-upload" style={{cursor: uploading ? 'not-allowed' : 'pointer', display: 'block'}}>
                                        <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{margin: '0 auto 24px'}}>
                                            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
                                            <line x1="7" y1="2" x2="7" y2="22"/>
                                            <line x1="17" y1="2" x2="17" y2="22"/>
                                            <line x1="2" y1="12" x2="22" y2="12"/>
                                        </svg>
                                        <h3 style={{color: 'white', fontSize: '28px', fontWeight: '700', marginBottom: '12px'}}>{uploading ? 'Uploading...' : 'Click to Upload Video'}</h3>
                                        <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '18px'}}>MP4, MOV, AVI • Max 2GB</p>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeAnalysisView === 'video' && videoUrl && (
                        <div style={{flex: 1, display: 'flex', overflow: 'hidden'}}>
                            {/* LEFT - Event Tagging */}
                            <div style={{width: '360px', background: 'rgba(0,0,0,0.2)', borderRight: '1px solid rgba(255,255,255,0.1)', padding: '20px', overflowY: 'auto'}}>
                                <div style={{background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px', marginBottom: '20px'}}>
                                    <div style={{fontSize: '13px', fontWeight: '700', color: 'white', marginBottom: '16px', textTransform: 'uppercase'}}>Match Setup</div>
                                    <div style={{display: 'flex', gap: '8px'}}>
                                        <button onClick={() => setSport('football')} style={{flex: 1, padding: '10px', background: sport === 'football' ? 'white' : 'rgba(255,255,255,0.1)', color: sport === 'football' ? '#00833E' : 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', fontFamily: 'inherit'}}>Football</button>
                                        <button onClick={() => setSport('hurling')} style={{flex: 1, padding: '10px', background: sport === 'hurling' ? 'white' : 'rgba(255,255,255,0.1)', color: sport === 'hurling' ? '#00833E' : 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', fontFamily: 'inherit'}}>Hurling</button>
                                    </div>
                                </div>

                                {/* HOME/AWAY TEAM SELECTOR */}
                                <div style={{background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px', marginBottom: '20px'}}>
                                    <div style={{fontSize: '13px', fontWeight: '700', color: 'white', marginBottom: '16px', textTransform: 'uppercase'}}>Tagging For</div>
                                    <div style={{display: 'flex', gap: '8px'}}>
                                        <button onClick={() => setSelectedTeam('home')} style={{flex: 1, padding: '12px', background: selectedTeam === 'home' ? 'white' : 'rgba(255,255,255,0.1)', color: selectedTeam === 'home' ? '#00833E' : 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', fontFamily: 'inherit', textTransform: 'uppercase'}}>{homeTeam}</button>
                                        <button onClick={() => setSelectedTeam('away')} style={{flex: 1, padding: '12px', background: selectedTeam === 'away' ? 'white' : 'rgba(255,255,255,0.1)', color: selectedTeam === 'away' ? '#00833E' : 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', fontFamily: 'inherit', textTransform: 'uppercase'}}>{awayTeam}</button>
                                    </div>
                                </div>

                                {/* EVENT NOTES INPUT */}
                                <div style={{background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px', marginBottom: '20px'}}>
                                    <div style={{fontSize: '13px', fontWeight: '700', color: 'white', marginBottom: '12px', textTransform: 'uppercase'}}>Event Notes</div>
                                    <input type="text" value={eventNotes} onChange={(e) => setEventNotes(e.target.value)} placeholder="Add notes (optional)" style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '14px', fontFamily: 'inherit'}} />
                                </div>

                                <div style={{background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px'}}>
                                    <div style={{fontSize: '13px', fontWeight: '700', color: 'white', marginBottom: '16px', textTransform: 'uppercase'}}>Event Tagging</div>
                                    
                                    {Object.entries(eventsByCategory).map(([category, categoryEvents]) => 
                                        categoryEvents.length > 0 && (
                                            <div key={category} style={{marginBottom: '20px'}}>
                                                <div style={{fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px', fontWeight: '700', textTransform: 'uppercase'}}>
                                                    {category.replace('_', ' ').replace('kickouts', sport === 'football' ? 'kickouts' : 'puckouts')}
                                                </div>
                                                <div style={{display: 'grid', gridTemplateColumns: category.includes('kickout') || category.includes('puckout') ? '1fr 1fr' : '1fr 1fr 1fr', gap: '8px'}}>
                                                    {categoryEvents.map(event => (
                                                        <button key={event.id} onClick={() => tagEvent(event)} style={{background: event.color, color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: '600', fontFamily: 'inherit'}}>{event.label}</button>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* CENTER - Video */}
                            <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px'}}>
                                <div style={{flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '12px', overflow: 'hidden'}}>
                                    <video ref={videoRef} src={videoUrl} style={{width: '100%', height: '100%'}} />
                                </div>

                                <div style={{background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px', height: '120px'}}>
                                    <h4 style={{marginBottom: '16px', fontWeight: '700', color: 'white', fontSize: '14px'}}>Event Timeline</h4>
                                    <div style={{height: '60px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', position: 'relative'}}>
                                        {events.map(event => (
                                            <div key={event.id} onClick={() => seekToEvent(event.timestamp)} style={{position: 'absolute', left: `${(event.timestamp / duration) * 100}%`, top: '50%', transform: 'translate(-50%, -50%)', width: '8px', height: '40px', background: event.color, borderRadius: '4px', cursor: 'pointer'}} />
                                        ))}
                                    </div>
                                </div>

                                <div style={{background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '20px'}}>
                                    <button onClick={togglePlayPause} style={{width: '56px', height: '56px', borderRadius: '50%', background: 'white', border: 'none', color: '#00833E', cursor: 'pointer', fontSize: '20px'}}>{isPlaying ? '⏸' : '▶'}</button>
                                    <span style={{fontFamily: 'monospace', fontSize: '16px', color: 'white', fontWeight: '600'}}>{formatTime(currentTime)} / {formatTime(duration)}</span>
                                    <div style={{flex: 1, height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px'}}>
                                        <div style={{height: '100%', background: 'white', borderRadius: '4px', width: `${(currentTime / duration) * 100}%`}}></div>
                                    </div>
                                    <select value={playbackSpeed} onChange={(e) => { if (videoRef.current) videoRef.current.playbackRate = parseFloat(e.target.value); setPlaybackSpeed(parseFloat(e.target.value)); }} style={{padding: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px', fontFamily: 'inherit'}}>
                                        {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => <option key={speed} value={speed}>{speed}x</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* RIGHT - Stats & Events */}
                            <div style={{width: '360px', background: 'rgba(0,0,0,0.2)', borderLeft: '1px solid rgba(255,255,255,0.1)', padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px'}}>
                                <div style={{padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <div style={{textAlign: 'center', flex: 1}}>
                                        <div style={{fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase'}}>{homeTeam}</div>
                                        <div style={{fontSize: '28px', fontWeight: '800', color: 'white'}}>{homeGoals}-{homePoints.toString().padStart(2, '0')}</div>
                                    </div>
                                    <div style={{margin: '0 24px', fontSize: '18px', color: 'rgba(255,255,255,0.6)', fontWeight: '600'}}>VS</div>
                                    <div style={{textAlign: 'center', flex: 1}}>
                                        <div style={{fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase'}}>{awayTeam}</div>
                                        <div style={{fontSize: '28px', fontWeight: '800', color: 'white'}}>{awayGoals}-{awayPoints.toString().padStart(2, '0')}</div>
                                    </div>
                                </div>

                                <div style={{background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px'}}>
                                    <div style={{fontSize: '13px', fontWeight: '700', color: 'white', marginBottom: '16px', textTransform: 'uppercase'}}>Match Statistics</div>
                                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px'}}>
                                        <div style={{background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', textAlign: 'center'}}>
                                            <div style={{fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px'}}>Goals</div>
                                            <div style={{fontSize: '20px', fontWeight: '800', color: 'white'}}>{stats.homeGoals} - {stats.awayGoals}</div>
                                        </div>
                                        <div style={{background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', textAlign: 'center'}}>
                                            <div style={{fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px'}}>Points</div>
                                            <div style={{fontSize: '20px', fontWeight: '800', color: 'white'}}>{stats.homePoints} - {stats.awayPoints}</div>
                                        </div>
                                        <div style={{background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', textAlign: 'center'}}>
                                            <div style={{fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px'}}>Fouls</div>
                                            <div style={{fontSize: '20px', fontWeight: '800', color: 'white'}}>{stats.homeFouls} - {stats.awayFouls}</div>
                                        </div>
                                        <div style={{background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', textAlign: 'center'}}>
                                            <div style={{fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px'}}>Wides</div>
                                            <div style={{fontSize: '20px', fontWeight: '800', color: 'white'}}>{stats.homeWides} - {stats.awayWides}</div>
                                        </div>
                                    </div>
                                    <button onClick={generatePDFReport} style={{width: '100%', padding: '12px', background: 'white', border: 'none', color: '#00833E', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', fontFamily: 'inherit'}}>DOWNLOAD REPORT</button>
                                </div>

                                <div style={{background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px'}}>
                                    <div style={{fontSize: '13px', fontWeight: '700', color: 'white', marginBottom: '16px', textTransform: 'uppercase'}}>Recent Events ({events.length})</div>
                                    <div style={{maxHeight: '400px', overflowY: 'auto'}}>
                                        {events.length === 0 ? (
                                            <p style={{opacity: 0.6, fontSize: '13px', textAlign: 'center', color: 'rgba(255,255,255,0.7)'}}>No events tagged yet</p>
                                        ) : (
                                            events.slice().reverse().map(event => (
                                                <div key={event.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', padding: '12px', background: 'rgba(255,255,255,0.05)', marginBottom: '6px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer'}} onClick={() => seekToEvent(event.timestamp)}>
                                                    <div style={{flex: 1}}>
                                                        <div style={{fontWeight: '600', color: 'white', marginBottom: '4px'}}>{event.label} - {event.team === 'home' ? homeTeam : awayTeam}</div>
                                                        {event.notes && <div style={{fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px'}}>{event.notes}</div>}
                                                        <div style={{fontFamily: 'monospace', color: 'rgba(255,255,255,0.8)', fontWeight: '600', fontSize: '12px'}}>{formatTime(event.timestamp)}</div>
                                                    </div>
                                                    <button onClick={(e) => { e.stopPropagation(); deleteEvent(event.id); }} style={{background: 'rgba(255,0,0,0.2)', border: 'none', color: 'white', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px'}}>✕</button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default App;
