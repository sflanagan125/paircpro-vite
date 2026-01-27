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

    if (loading) return <div>Loading...</div>;
    
    if (view === 'dashboard' && user) {
        return <Dashboard user={user} setView={setView} setUser={setUser} />;
    }

    return null; // Landing page handled separately
}

// COMPLETE VIDEO ANALYSIS DASHBOARD
function Dashboard({ user, setView, setUser }) {
    const videoRef = useRef(null);
    
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
    
    // Scores (GAA format: G-P)
    const [homeGoals, setHomeGoals] = useState(0);
    const [homePoints, setHomePoints] = useState(0);
    const [awayGoals, setAwayGoals] = useState(0);
    const [awayPoints, setAwayPoints] = useState(0);
    
    // Events
    const [events, setEvents] = useState([]);
    
    // Video Player
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    
    // UI
    const [activeView, setActiveView] = useState('upload'); // upload or analysis
    const [menuOpen, setMenuOpen] = useState(false);

    // Event Configuration
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
        { id: 'turnover', label: 'Turnover', color: '#f43f5e', category: 'other' },
        { id: 'injury', label: 'Injury', color: '#dc2626', category: 'other' },
        { id: 'custom', label: 'Custom', color: '#64748b', category: 'other' }
    ];

    const hurlingEvents = [
        { id: 'goal', label: 'Goal', color: '#10b981', category: 'scoring' },
        { id: 'point', label: 'Point', color: '#f59e0b', category: 'scoring' },
        { id: 'wide', label: 'Wide', color: '#ef4444', category: 'scoring' },
        { id: 'saved', label: 'Saved', color: '#8b5cf6', category: 'scoring' },
        { id: '65', label: '65', color: '#3b82f6', category: 'scoring' },
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
        
        // Check file size (2GB limit)
        const maxSize = 2 * 1024 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('File too large. Maximum size is 2GB. Consider upgrading to Pro for larger files.');
            return;
        }
        
        setUploading(true);
        try {
            const fileName = `${user.id}/${Date.now()}-${file.name}`;
            const { data, error } = await supabase.storage
                .from('videos')
                .upload(fileName, file);

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('videos')
                .getPublicUrl(fileName);

            setVideoUrl(publicUrl);
            setVideoFile(file);
            
            const { data: matchData } = await supabase
                .from('matches')
                .insert([{
                    user_id: user.id,
                    video_url: publicUrl,
                    title: file.name,
                    home_team: homeTeam,
                    away_team: awayTeam,
                    sport: sport,
                    events: [],
                    created_at: new Date()
                }])
                .select()
                .single();

            setCurrentMatch(matchData);
            setActiveView('analysis');
        } catch (error) {
            alert('Upload failed: ' + error.message + '\n\nMake sure you created the "videos" bucket in Supabase Storage (Settings → Storage → New Bucket → name: videos, public: YES)');
        } finally {
            setUploading(false);
        }
    };

    const tagEvent = async (event) => {
        if (!videoRef.current) return;
        
        const timestamp = videoRef.current.currentTime;
        const newEvent = {
            id: Date.now(),
            type: event.id,
            label: event.label,
            color: event.color,
            timestamp: timestamp,
            sport: sport
        };
        
        const updatedEvents = [...events, newEvent].sort((a, b) => a.timestamp - b.timestamp);
        setEvents(updatedEvents);
        
        // Update scores
        if (event.id === 'goal') {
            setHomeGoals(homeGoals + 1);
        } else if (event.id === 'point') {
            setHomePoints(homePoints + 1);
        } else if (event.id === '2point') {
            setHomePoints(homePoints + 2);
        }
        
        // Save to DB
        if (currentMatch) {
            await supabase
                .from('matches')
                .update({ events: updatedEvents })
                .eq('id', currentMatch.id);
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
            await supabase
                .from('matches')
                .update({ events: updatedEvents })
                .eq('id', currentMatch.id);
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

    const skipTime = (seconds) => {
        if (videoRef.current) {
            videoRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
        }
    };

    const changeSpeed = (speed) => {
        if (videoRef.current) {
            videoRef.current.playbackRate = speed;
            setPlaybackSpeed(speed);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const calculateStats = () => {
        return {
            totalEvents: events.length,
            goals: events.filter(e => e.type === 'goal').length,
            points: events.filter(e => e.type === 'point' || e.type === '2point').length,
            fouls: events.filter(e => e.type === 'foul').length,
            ownKickoutWon: events.filter(e => e.type === 'own_kickout_won').length,
            oppKickoutWon: events.filter(e => e.type === 'opp_kickout_won').length
        };
    };

    const stats = calculateStats();

    useEffect(() => {
        const loadMatches = async () => {
            const { data } = await supabase
                .from('matches')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
            
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

    return (
        <div style={{height: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #0066cc 0%, #004499 100%)'}}>
            {/* Top Bar */}
            <div style={{background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer'}} onClick={() => setView('landing')}>
                    <div style={{fontSize: '26px', fontWeight: '700', color: 'white'}}>PáircPro</div>
                </div>
                
                {activeView === 'analysis' && (
                    <h1 style={{position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: '20px', fontWeight: '700', color: 'white', margin: 0}}>
                        Video Analysis
                    </h1>
                )}
                
                {/* Hamburger Menu */}
                <button onClick={() => setMenuOpen(!menuOpen)} style={{background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px'}}>
                    <div style={{width: '24px', height: '2px', background: 'white', borderRadius: '2px'}}></div>
                    <div style={{width: '24px', height: '2px', background: 'white', borderRadius: '2px'}}></div>
                    <div style={{width: '24px', height: '2px', background: 'white', borderRadius: '2px'}}></div>
                </button>
                
                {menuOpen && (
                    <div style={{position: 'absolute', top: '72px', right: '24px', background: 'white', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', minWidth: '200px', zIndex: 1000}}>
                        <div style={{padding: '8px 0'}}>
                            <div style={{padding: '12px 20px', borderBottom: '1px solid #E5E5E5', fontSize: '14px', fontWeight: '700', color: '#333'}}>{user.email}</div>
                            <button onClick={() => { setMenuOpen(false); setActiveView('upload'); }} style={{width: '100%', padding: '12px 20px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#333', fontFamily: 'inherit'}}>Dashboard</button>
                            <button onClick={() => { setMenuOpen(false); setView('pricing'); }} style={{width: '100%', padding: '12px 20px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#333', fontFamily: 'inherit'}}>Billing</button>
                            <button onClick={() => setMenuOpen(false)} style={{width: '100%', padding: '12px 20px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#333', fontFamily: 'inherit'}}>Settings</button>
                            <button onClick={() => { setMenuOpen(false); setView('contact'); }} style={{width: '100%', padding: '12px 20px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#333', fontFamily: 'inherit'}}>Help & Support</button>
                            <div style={{borderTop: '1px solid #E5E5E5', marginTop: '4px', paddingTop: '4px'}}>
                                <button onClick={() => { setMenuOpen(false); handleSignOut(); }} style={{width: '100%', padding: '12px 20px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#DC2626', fontFamily: 'inherit'}}>Sign Out</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* UPLOAD VIEW */}
            {activeView === 'upload' && (
                <div style={{flex: 1, padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <div style={{maxWidth: '800px', width: '100%'}}>
                        <h1 style={{fontSize: '48px', fontWeight: '900', color: 'white', marginBottom: '32px', textAlign: 'center', textTransform: 'uppercase'}}>Upload Match Video</h1>
                        
                        {/* Sport Selector */}
                        <div style={{display: 'flex', gap: '16px', marginBottom: '32px'}}>
                            <button onClick={() => setSport('football')} style={{flex: 1, padding: '20px', background: sport === 'football' ? 'white' : 'rgba(255,255,255,0.1)', color: sport === 'football' ? '#0066cc' : 'white', border: '2px solid ' + (sport === 'football' ? 'white' : 'rgba(255,255,255,0.3)'), borderRadius: '12px', cursor: 'pointer', fontSize: '18px', fontWeight: '700', fontFamily: 'inherit', textTransform: 'uppercase'}}>
                                FOOTBALL
                            </button>
                            <button onClick={() => setSport('hurling')} style={{flex: 1, padding: '20px', background: sport === 'hurling' ? 'white' : 'rgba(255,255,255,0.1)', color: sport === 'hurling' ? '#0066cc' : 'white', border: '2px solid ' + (sport === 'hurling' ? 'white' : 'rgba(255,255,255,0.3)'), borderRadius: '12px', cursor: 'pointer', fontSize: '18px', fontWeight: '700', fontFamily: 'inherit', textTransform: 'uppercase'}}>
                                HURLING
                            </button>
                        </div>
                        
                        {/* Team Names */}
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
                        
                        {/* Upload Area */}
                        <div style={{background: 'rgba(255,255,255,0.1)', border: '2px dashed rgba(255,255,255,0.3)', borderRadius: '16px', padding: '80px 32px', textAlign: 'center'}}>
                            <input type="file" accept="video/*" onChange={handleVideoUpload} disabled={uploading} style={{display: 'none'}} id="video-upload" />
                            <label htmlFor="video-upload" style={{cursor: uploading ? 'not-allowed' : 'pointer', display: 'block'}}>
                                <div style={{fontSize: '72px', marginBottom: '24px'}}>🎥</div>
                                <h3 style={{color: 'white', fontSize: '28px', fontWeight: '700', marginBottom: '12px'}}>
                                    {uploading ? 'Uploading...' : 'Click to Upload Video'}
                                </h3>
                                <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '18px'}}>MP4, MOV, AVI • Max 2GB</p>
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {/* ANALYSIS VIEW - 3 COLUMN LAYOUT */}
            {activeView === 'analysis' && videoUrl && (
                <div style={{flex: 1, display: 'flex', overflow: 'hidden'}}>
                    {/* LEFT PANEL - Event Tagging */}
                    <div style={{width: '360px', background: 'rgba(255,255,255,0.05)', borderRight: '1px solid rgba(255,255,255,0.1)', padding: '20px', overflowY: 'auto'}}>
                        {/* Match Setup */}
                        <div style={{background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.1)'}}>
                            <div style={{fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.9)', marginBottom: '16px', textTransform: 'uppercase'}}>Match Setup</div>
                            <div style={{display: 'flex', gap: '8px', marginBottom: '16px'}}>
                                <button onClick={() => setSport('football')} style={{flex: 1, padding: '10px', background: sport === 'football' ? 'white' : 'rgba(255,255,255,0.1)', color: sport === 'football' ? '#0066cc' : 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', fontFamily: 'inherit'}}>
                                    Football
                                </button>
                                <button onClick={() => setSport('hurling')} style={{flex: 1, padding: '10px', background: sport === 'hurling' ? 'white' : 'rgba(255,255,255,0.1)', color: sport === 'hurling' ? '#0066cc' : 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', fontFamily: 'inherit'}}>
                                    Hurling
                                </button>
                            </div>
                        </div>

                        {/* Event Tagging */}
                        <div style={{background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)'}}>
                            <div style={{fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.9)', marginBottom: '16px', textTransform: 'uppercase'}}>Event Tagging</div>
                            
                            {/* Scoring */}
                            <div style={{marginBottom: '20px'}}>
                                <div style={{fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px', fontWeight: '700', textTransform: 'uppercase'}}>Scoring</div>
                                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px'}}>
                                    {eventsByCategory.scoring.map(event => (
                                        <button key={event.id} onClick={() => tagEvent(event)} style={{background: event.color, color: 'white', border: 'none', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: '600', fontFamily: 'inherit'}}>
                                            {event.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Own Kickouts */}
                            {sport === 'football' && eventsByCategory.own_kickouts.length > 0 && (
                                <div style={{marginBottom: '20px'}}>
                                    <div style={{fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px', fontWeight: '700', textTransform: 'uppercase'}}>Own Kickouts</div>
                                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                                        {eventsByCategory.own_kickouts.map(event => (
                                            <button key={event.id} onClick={() => tagEvent(event)} style={{background: event.color, color: 'white', border: 'none', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: '600', fontFamily: 'inherit'}}>
                                                {event.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Opposition Kickouts */}
                            {sport === 'football' && eventsByCategory.opp_kickouts.length > 0 && (
                                <div style={{marginBottom: '20px'}}>
                                    <div style={{fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px', fontWeight: '700', textTransform: 'uppercase'}}>Opposition Kickouts</div>
                                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                                        {eventsByCategory.opp_kickouts.map(event => (
                                            <button key={event.id} onClick={() => tagEvent(event)} style={{background: event.color, color: 'white', border: 'none', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: '600', fontFamily: 'inherit'}}>
                                                {event.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Other Restarts */}
                            <div style={{marginBottom: '20px'}}>
                                <div style={{fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px', fontWeight: '700', textTransform: 'uppercase'}}>Other Restarts</div>
                                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                                    {eventsByCategory.restarts.map(event => (
                                        <button key={event.id} onClick={() => tagEvent(event)} style={{background: event.color, color: 'white', border: 'none', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: '600', fontFamily: 'inherit'}}>
                                            {event.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Fouls */}
                            <div style={{marginBottom: '20px'}}>
                                <div style={{fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px', fontWeight: '700', textTransform: 'uppercase'}}>Fouls</div>
                                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                                    {eventsByCategory.fouls.map(event => (
                                        <button key={event.id} onClick={() => tagEvent(event)} style={{background: event.color, color: 'white', border: 'none', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: '600', fontFamily: 'inherit'}}>
                                            {event.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Other */}
                            <div style={{marginBottom: '20px'}}>
                                <div style={{fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px', fontWeight: '700', textTransform: 'uppercase'}}>Other</div>
                                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                                    {eventsByCategory.other.map(event => (
                                        <button key={event.id} onClick={() => tagEvent(event)} style={{background: event.color, color: 'white', border: 'none', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: '600', fontFamily: 'inherit'}}>
                                            {event.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Keyboard Shortcuts */}
                            <div style={{marginTop: '16px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '11px', border: '1px solid rgba(255,255,255,0.1)'}}>
                                <div style={{color: 'white', fontWeight: '700', marginBottom: '8px'}}>Keyboard Shortcuts</div>
                                <div style={{color: 'rgba(255,255,255,0.8)'}}>
                                    G - Goal | P - Point | W - Wide | S - Save<br/>
                                    F - Foul | C - Card | Space - Play/Pause
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CENTER PANEL - Video */}
                    <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', minWidth: '400px'}}>
                        {/* Video Player */}
                        <div style={{flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '12px', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.1)', minHeight: '300px'}}>
                            <video ref={videoRef} src={videoUrl} style={{width: '100%', height: '100%', display: 'block'}} />
                        </div>

                        {/* Timeline Section */}
                        <div style={{background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0, height: '120px'}}>
                            <h4 style={{marginBottom: '16px', fontWeight: '700', color: 'white', fontSize: '14px'}}>Event Timeline</h4>
                            <div style={{height: '60px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', position: 'relative', border: '1px solid rgba(255,255,255,0.1)'}}>
                                {events.length === 0 ? (
                                    <p style={{textAlign: 'center', lineHeight: '60px', color: 'rgba(255,255,255,0.6)', fontSize: '13px'}}>No events tagged yet</p>
                                ) : (
                                    <div style={{position: 'relative', height: '100%'}}>
                                        {events.map(event => (
                                            <div
                                                key={event.id}
                                                onClick={() => seekToEvent(event.timestamp)}
                                                style={{
                                                    position: 'absolute',
                                                    left: `${(event.timestamp / duration) * 100}%`,
                                                    top: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    width: '8px',
                                                    height: '40px',
                                                    background: event.color,
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    border: '1px solid rgba(255,255,255,0.3)'
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Controls Bar */}
                        <div style={{background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0, minHeight: '96px'}}>
                            <button onClick={togglePlayPause} style={{width: '56px', height: '56px', borderRadius: '50%', background: 'white', border: 'none', color: '#0066cc', cursor: 'pointer', fontSize: '20px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                {isPlaying ? '⏸' : '▶'}
                            </button>
                            <button onClick={() => skipTime(-5)} style={{padding: '10px 16px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontFamily: 'inherit'}}>-5s</button>
                            <button onClick={() => skipTime(5)} style={{padding: '10px 16px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontFamily: 'inherit'}}>+5s</button>
                            <span style={{fontFamily: 'monospace', fontSize: '16px', color: 'rgba(255,255,255,0.8)', fontWeight: '600'}}>
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </span>
                            <div style={{flex: 1, height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px', cursor: 'pointer', position: 'relative'}}>
                                <div style={{height: '100%', background: 'white', borderRadius: '4px', width: `${(currentTime / duration) * 100}%`}}></div>
                            </div>
                            <select value={playbackSpeed} onChange={(e) => changeSpeed(parseFloat(e.target.value))} style={{padding: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px', fontFamily: 'inherit'}}>
                                <option value="0.25">0.25x</option>
                                <option value="0.5">0.5x</option>
                                <option value="0.75">0.75x</option>
                                <option value="1">1x</option>
                                <option value="1.25">1.25x</option>
                                <option value="1.5">1.5x</option>
                                <option value="2">2x</option>
                            </select>
                        </div>
                    </div>

                    {/* RIGHT PANEL - Scoreboard & Stats & Events */}
                    <div style={{width: '360px', background: 'rgba(255,255,255,0.05)', borderLeft: '1px solid rgba(255,255,255,0.1)', padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px'}}>
                        {/* Scoreboard */}
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px'}}>
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

                        {/* Match Statistics */}
                        <div style={{background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)'}}>
                            <div style={{fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.9)', marginBottom: '16px', textTransform: 'uppercase'}}>Match Statistics</div>
                            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                                <div style={{background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)'}}>
                                    <div style={{fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase'}}>Total Events</div>
                                    <div style={{fontSize: '20px', fontWeight: '800', color: 'white'}}>{stats.totalEvents}</div>
                                </div>
                                <div style={{background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)'}}>
                                    <div style={{fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase'}}>Goals</div>
                                    <div style={{fontSize: '20px', fontWeight: '800', color: 'white'}}>{stats.goals}</div>
                                </div>
                                <div style={{background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)'}}>
                                    <div style={{fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase'}}>Points</div>
                                    <div style={{fontSize: '20px', fontWeight: '800', color: 'white'}}>{stats.points}</div>
                                </div>
                                <div style={{background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)'}}>
                                    <div style={{fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase'}}>Fouls</div>
                                    <div style={{fontSize: '20px', fontWeight: '800', color: 'white'}}>{stats.fouls}</div>
                                </div>
                                {sport === 'football' && (
                                    <>
                                        <div style={{background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)'}}>
                                            <div style={{fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase'}}>Own K/O Won</div>
                                            <div style={{fontSize: '20px', fontWeight: '800', color: 'white'}}>{stats.ownKickoutWon}</div>
                                        </div>
                                        <div style={{background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)'}}>
                                            <div style={{fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase'}}>Opp K/O Won</div>
                                            <div style={{fontSize: '20px', fontWeight: '800', color: 'white'}}>{stats.oppKickoutWon}</div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Export Options */}
                        <div style={{background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)'}}>
                            <div style={{fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.9)', marginBottom: '16px', textTransform: 'uppercase'}}>Export Options</div>
                            <button style={{width: '100%', marginBottom: '12px', padding: '12px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontFamily: 'inherit', fontSize: '14px'}}>📊 Export CSV</button>
                            <button style={{width: '100%', marginBottom: '12px', padding: '12px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontFamily: 'inherit', fontSize: '14px'}}>📄 PDF Report</button>
                            <button style={{width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontFamily: 'inherit', fontSize: '14px'}}>🔗 Share Link</button>
                        </div>

                        {/* Heat Map */}
                        <div style={{background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)'}}>
                            <div style={{fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.9)', marginBottom: '16px', textTransform: 'uppercase'}}>Heat Map</div>
                            <div style={{height: '160px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.6)'}}>
                                Field Heat Map (Possession zones)
                            </div>
                        </div>

                        {/* Recent Events */}
                        <div style={{background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)'}}>
                            <div style={{fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.9)', marginBottom: '16px', textTransform: 'uppercase'}}>Recent Events</div>
                            <div style={{maxHeight: '220px', overflowY: 'auto'}}>
                                {events.length === 0 ? (
                                    <p style={{opacity: 0.6, fontSize: '13px', textAlign: 'center', color: 'rgba(255,255,255,0.7)'}}>No events tagged yet</p>
                                ) : (
                                    events.slice().reverse().map(event => (
                                        <div key={event.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.05)', marginBottom: '6px', borderRadius: '8px', fontSize: '13px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer'}} onClick={() => seekToEvent(event.timestamp)}>
                                            <div>
                                                <div style={{fontWeight: '600', color: 'white', marginBottom: '4px'}}>{event.label}</div>
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
        </div>
    );
}

export default App;
