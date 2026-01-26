import { useState, useEffect, useRef } from 'react';
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

// ============================================
// KEEP YOUR EXISTING LANDING/PRICING/CONTACT/AUTH PAGES HERE
// DO NOT CHANGE THEM - PASTE THEM AS-IS FROM YOUR CURRENT FILE
// ============================================

// Landing Page Component - PASTE YOUR EXISTING CODE
function LandingPage({ setView }) {
    // ... YOUR EXISTING LANDING PAGE CODE ...
    return <div>Your existing landing page here</div>;
}

// Pricing Page Component - PASTE YOUR EXISTING CODE  
function PricingPage({ setView }) {
    // ... YOUR EXISTING PRICING PAGE CODE ...
    return <div>Your existing pricing page here</div>;
}

// Contact Page Component - PASTE YOUR EXISTING CODE
function ContactPage({ setView }) {
    // ... YOUR EXISTING CONTACT PAGE CODE ...
    return <div>Your existing contact page here</div>;
}

// Auth Page Component - PASTE YOUR EXISTING CODE
function AuthPage({ setView, setUser }) {
    // ... YOUR EXISTING AUTH PAGE CODE ...
    return <div>Your existing auth page here</div>;
}

// ============================================
// COMPLETE DASHBOARD - 100% PORTED FROM app-OLD.html
// ============================================

function Dashboard({ user, setView, setUser }) {
    const [videoFile, setVideoFile] = useState(null);
    const [videoUrl, setVideoUrl] = useState(null);
    const [currentMatch, setCurrentMatch] = useState(null);
    
    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setView('landing');
    };

    // If no video loaded, show upload screen
    if (!videoUrl) {
        return <UploadScreen user={user} setVideoUrl={setVideoUrl} setVideoFile={setVideoFile} setCurrentMatch={setCurrentMatch} handleSignOut={handleSignOut} />;
    }

    // Video loaded - show analysis interface
    return <AnalysisInterface videoUrl={videoUrl} videoFile={videoFile} currentMatch={currentMatch} handleSignOut={handleSignOut} />;
}

// Upload Screen
function UploadScreen({ user, setVideoUrl, setVideoFile, setCurrentMatch, handleSignOut }) {
    const [uploading, setUploading] = useState(false);

    const handleVideoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file size (5GB limit)
        if (file.size > 5 * 1024 * 1024 * 1024) {
            alert('File size must be under 5GB');
            return;
        }

        setUploading(true);

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

            setVideoUrl(publicUrl);
            setVideoFile(file);
            setCurrentMatch(match);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload video: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #0066cc 0%, #004499 100%)', display: 'flex', flexDirection: 'column'}}>
            <div style={{padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{fontSize: '26px', fontWeight: '700', color: 'white'}}>PáircPro</div>
                <button onClick={handleSignOut} style={{background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600'}}>
                    Sign Out
                </button>
            </div>
            
            <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px'}}>
                <div style={{textAlign: 'center', maxWidth: '600px'}}>
                    <h1 style={{fontSize: '48px', fontWeight: '900', color: 'white', marginBottom: '24px'}}>Upload Match Video</h1>
                    <p style={{fontSize: '18px', color: 'rgba(255,255,255,0.8)', marginBottom: '48px'}}>
                        Choose a match video to start your analysis
                    </p>
                    
                    <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        disabled={uploading}
                        style={{display: 'none'}}
                        id="video-upload"
                    />
                    <label htmlFor="video-upload" style={{cursor: uploading ? 'not-allowed' : 'pointer'}}>
                        <div style={{
                            background: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(20px)',
                            border: '2px dashed rgba(255,255,255,0.3)',
                            borderRadius: '16px',
                            padding: '64px',
                            display: 'inline-block',
                            transition: 'all 0.2s ease'
                        }}>
                            <div style={{fontSize: '64px', marginBottom: '24px'}}>📁</div>
                            <div style={{fontSize: '24px', fontWeight: '700', color: 'white', marginBottom: '12px'}}>
                                {uploading ? 'Uploading...' : 'Choose Match Video'}
                            </div>
                            <div style={{fontSize: '16px', color: 'rgba(255,255,255,0.7)'}}>
                                MP4, MOV, AVI • Max 5GB
                            </div>
                        </div>
                    </label>
                </div>
            </div>
        </div>
    );
}

// Complete Analysis Interface - 3 Column Layout from app-OLD.html
function AnalysisInterface({ videoUrl, videoFile, currentMatch, handleSignOut }) {
    const videoRef = useRef(null);
    const [currentSport, setCurrentSport] = useState('football');
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [events, setEvents] = useState([]);
    const [stats, setStats] = useState({
        'Goal': 0, 'Point': 0, '2 Point': 0, 'Wide': 0, 'Saved': 0, '45': 0, '65': 0,
        'Own Kickout Won': 0, 'Own Kickout Lost': 0, 'Opp Kickout Won': 0, 'Opp Kickout Lost': 0,
        'Free Kick': 0, 'Sideline': 0, 'Penalty': 0, 'Throw-in': 0,
        'Foul': 0, 'Yellow Card': 0, 'Red Card': 0, 'Black Card': 0,
        'Substitution': 0, 'Mark': 0, 'Turnover': 0, 'Blocked': 0, 'Short': 0
    });
    const [scores, setScores] = useState({
        home: { goals: 0, points: 0 },
        away: { goals: 0, points: 0 }
    });

    // Format time helper
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Video control handlers
    const togglePlayPause = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
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

    const seekVideo = (e) => {
        if (!videoRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        const newTime = percentage * duration;
        videoRef.current.currentTime = newTime;
    };

    // Tag event - EXACT logic from app-OLD.html
    const tagEvent = (eventType) => {
        const timestamp = currentTime;
        const event = {
            type: eventType,
            time: timestamp,
            timeString: formatTime(timestamp),
            sport: currentSport,
            id: Date.now()
        };
        
        const newEvents = [...events, event].sort((a, b) => a.time - b.time);
        setEvents(newEvents);
        
        // Update statistics
        setStats(prev => ({
            ...prev,
            [eventType]: prev[eventType] + 1
        }));
        
        // Update scores (simple logic - always home team for now)
        if (eventType === 'Goal') {
            setScores(prev => ({
                ...prev,
                home: { ...prev.home, goals: prev.home.goals + 1 }
            }));
        } else if (eventType === 'Point') {
            setScores(prev => ({
                ...prev,
                home: { ...prev.home, points: prev.home.points + 1 }
            }));
        } else if (eventType === '2 Point') {
            setScores(prev => ({
                ...prev,
                home: { ...prev.home, points: prev.home.points + 2 }
            }));
        }

        // Save to database
        if (currentMatch) {
            supabase.from('matches').update({ events: newEvents }).eq('id', currentMatch.id);
        }
    };

    // Export CSV function
    const exportCSV = () => {
        if (events.length === 0) {
            alert('No events to export');
            return;
        }
        
        const csvContent = [
            ['Event Type', 'Time (seconds)', 'Time (MM:SS)', 'Sport', 'Timestamp'],
            ...events.map(event => [
                event.type,
                event.time.toFixed(2),
                event.timeString,
                event.sport,
                new Date().toISOString()
            ])
        ].map(row => row.join(',')).join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `paircpro-events-${Date.now()}.csv`;
        a.click();
    };

    // Save project as JSON
    const saveProject = () => {
        const projectData = {
            events: events,
            stats: stats,
            scores: scores,
            sport: currentSport,
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `paircpro-project-${Date.now()}.json`;
        a.click();
    };

    // Keyboard shortcuts - EXACT from app-OLD.html
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.target.tagName === 'INPUT') return;
            
            switch(e.key.toLowerCase()) {
                case 'g': tagEvent('Goal'); break;
                case 'p': tagEvent('Point'); break;
                case 'w': tagEvent('Wide'); break;
                case 's': tagEvent('Saved'); break;
                case 'f': tagEvent('Foul'); break;
                case 'c': tagEvent('Yellow Card'); break;
                case ' ': 
                    e.preventDefault();
                    togglePlayPause();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentTime, currentSport, events, stats, scores]);

    return (
        <div style={{display: 'flex', height: '100vh', background: 'linear-gradient(135deg, #0066cc 0%, #004499 100%)', color: 'white'}}>
            {/* LEFT PANEL - Event Tagging */}
            <div style={{width: '320px', minWidth: '280px', maxWidth: '360px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto'}}>
                <div style={{padding: '24px 20px', background: 'rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '26px', fontWeight: '700', textAlign: 'center'}}>
                    PáircPro
                </div>

                {/* Match Setup */}
                <div style={{padding: '20px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', borderRadius: '12px', margin: '20px 16px', border: '1px solid rgba(255,255,255,0.1)'}}>
                    <div style={{fontWeight: '700', fontSize: '16px', marginBottom: '16px'}}>Match Setup</div>
                    <div style={{display: 'flex', gap: '6px', marginBottom: '12px'}}>
                        <div 
                            onClick={() => setCurrentSport('football')}
                            style={{
                                flex: 1,
                                padding: '10px 12px',
                                background: currentSport === 'football' ? 'white' : 'rgba(255,255,255,0.1)',
                                color: currentSport === 'football' ? '#0066cc' : 'rgba(255,255,255,0.8)',
                                border: currentSport === 'football' ? 'none' : '1px solid rgba(255,255,255,0.15)',
                                borderRadius: '8px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: '600',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            Football
                        </div>
                        <div 
                            onClick={() => setCurrentSport('hurling')}
                            style={{
                                flex: 1,
                                padding: '10px 12px',
                                background: currentSport === 'hurling' ? 'white' : 'rgba(255,255,255,0.1)',
                                color: currentSport === 'hurling' ? '#0066cc' : 'rgba(255,255,255,0.8)',
                                border: currentSport === 'hurling' ? 'none' : '1px solid rgba(255,255,255,0.15)',
                                borderRadius: '8px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: '600',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            Hurling
                        </div>
                    </div>
                </div>

                {/* Event Tagging - EXACT categories from app-OLD.html */}
                <div style={{padding: '0 16px 20px', flex: 1, overflowY: 'auto'}}>
                    {/* Scoring Events */}
                    <div style={{marginBottom: '20px'}}>
                        <div style={{fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                            Scoring
                        </div>
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px'}}>
                            <EventButton onClick={() => tagEvent('Goal')} color="#10b981">Goal</EventButton>
                            <EventButton onClick={() => tagEvent('Point')} color="#f59e0b">Point</EventButton>
                            {currentSport === 'football' && <EventButton onClick={() => tagEvent('2 Point')} color="#f59e0b">2 Point</EventButton>}
                            <EventButton onClick={() => tagEvent('Wide')} color="#ef4444">Wide</EventButton>
                            <EventButton onClick={() => tagEvent('Saved')} color="#06b6d4">Saved</EventButton>
                            <EventButton onClick={() => tagEvent(currentSport === 'football' ? '45' : '65')} color="#8b5cf6">
                                {currentSport === 'football' ? '45' : '65'}
                            </EventButton>
                        </div>
                    </div>

                    {/* Own Kickouts */}
                    <div style={{marginBottom: '20px'}}>
                        <div style={{fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px', fontWeight: '700', textTransform: 'uppercase'}}>
                            Own Kickouts
                        </div>
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                            <EventButton onClick={() => tagEvent('Own Kickout Won')} color="#3b82f6">Won</EventButton>
                            <EventButton onClick={() => tagEvent('Own Kickout Lost')} color="#ef4444">Lost</EventButton>
                        </div>
                    </div>

                    {/* Opposition Kickouts */}
                    <div style={{marginBottom: '20px'}}>
                        <div style={{fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px', fontWeight: '700', textTransform: 'uppercase'}}>
                            Opposition Kickouts
                        </div>
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                            <EventButton onClick={() => tagEvent('Opp Kickout Won')} color="#3b82f6">Won</EventButton>
                            <EventButton onClick={() => tagEvent('Opp Kickout Lost')} color="#ef4444">Lost</EventButton>
                        </div>
                    </div>

                    {/* Other Restarts */}
                    <div style={{marginBottom: '20px'}}>
                        <div style={{fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px', fontWeight: '700', textTransform: 'uppercase'}}>
                            Other Restarts
                        </div>
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                            <EventButton onClick={() => tagEvent('Free Kick')} color="#3b82f6">Free Kick</EventButton>
                            <EventButton onClick={() => tagEvent('Sideline')} color="#3b82f6">Sideline</EventButton>
                            <EventButton onClick={() => tagEvent('Penalty')} color="#a855f7">Penalty</EventButton>
                            <EventButton onClick={() => tagEvent('Throw-in')} color="#a855f7">Throw-in</EventButton>
                        </div>
                    </div>

                    {/* Fouls */}
                    <div style={{marginBottom: '20px'}}>
                        <div style={{fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px', fontWeight: '700', textTransform: 'uppercase'}}>
                            Fouls
                        </div>
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                            <EventButton onClick={() => tagEvent('Foul')} color="#f97316">Foul</EventButton>
                            <EventButton onClick={() => tagEvent('Yellow Card')} color="#eab308">Yellow</EventButton>
                            <EventButton onClick={() => tagEvent('Red Card')} color="#dc2626">Red</EventButton>
                            <EventButton onClick={() => tagEvent('Black Card')} color="#1f2937">Black</EventButton>
                        </div>
                    </div>

                    {/* Other */}
                    <div style={{marginBottom: '20px'}}>
                        <div style={{fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px', fontWeight: '700', textTransform: 'uppercase'}}>
                            Other
                        </div>
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                            <EventButton onClick={() => tagEvent('Substitution')} color="#64748b">Sub</EventButton>
                            <EventButton onClick={() => tagEvent('Mark')} color="#64748b">Mark</EventButton>
                            <EventButton onClick={() => tagEvent('Turnover')} color="#ef4444">Turnover</EventButton>
                            <EventButton onClick={() => tagEvent('Blocked')} color="#06b6d4">Blocked</EventButton>
                            <EventButton onClick={() => tagEvent('Short')} color="#ef4444">Short</EventButton>
                        </div>
                    </div>

                    {/* Keyboard Shortcuts */}
                    <div style={{marginTop: '16px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '11px', border: '1px solid rgba(255,255,255,0.1)'}}>
                        <strong style={{display: 'block', marginBottom: '8px'}}>Keyboard Shortcuts:</strong>
                        G: Goal • P: Point • W: Wide • S: Saved • F: Foul • C: Yellow Card • Space: Play/Pause
                    </div>
                </div>
            </div>

            {/* CENTER - Video Player */}
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.02)'}}>
                {/* Top Bar */}
                <div style={{background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h1 style={{fontSize: '24px', fontWeight: '700'}}>Video Analysis</h1>
                    <div style={{display: 'flex', gap: '12px'}}>
                        <button onClick={saveProject} style={{padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)'}}>
                            Save Project
                        </button>
                        <button onClick={exportCSV} style={{padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', background: 'white', color: '#0066cc'}}>
                            Export Analysis
                        </button>
                    </div>
                </div>

                {/* Video Container */}
                <div style={{flex: 1, padding: '20px', display: 'flex', flexDirection: 'column'}}>
                    <div style={{flex: 1, background: '#000', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px'}}>
                        <video
                            ref={videoRef}
                            src={videoUrl}
                            onTimeUpdate={handleTimeUpdate}
                            onLoadedMetadata={handleLoadedMetadata}
                            style={{width: '100%', height: '100%', objectFit: 'contain'}}
                        />
                    </div>

                    {/* Video Controls */}
                    <div style={{background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.1)'}}>
                        {/* Progress Bar */}
                        <div 
                            onClick={seekVideo}
                            style={{
                                height: '6px',
                                background: 'rgba(255,255,255,0.2)',
                                borderRadius: '3px',
                                marginBottom: '16px',
                                cursor: 'pointer',
                                position: 'relative'
                            }}
                        >
                            <div style={{
                                height: '100%',
                                background: 'white',
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
                                    style={{
                                        position: 'absolute',
                                        left: `${(event.time / duration) * 100}%`,
                                        top: '-4px',
                                        width: '4px',
                                        height: '14px',
                                        background: event.type === 'Goal' ? '#10b981' : event.type === 'Point' || event.type === '2 Point' ? '#f59e0b' : event.type === 'Foul' ? '#f97316' : 'white',
                                        borderRadius: '2px',
                                        cursor: 'pointer'
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (videoRef.current) videoRef.current.currentTime = event.time;
                                    }}
                                />
                            ))}
                        </div>

                        {/* Control Buttons */}
                        <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                            <button onClick={togglePlayPause} style={{width: '48px', height: '48px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '18px'}}>
                                {isPlaying ? '⏸' : '▶'}
                            </button>
                            <span style={{color: 'white', fontSize: '14px', fontWeight: '600'}}>
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL - Statistics & Events */}
            <div style={{width: '320px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderLeft: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto', padding: '20px'}}>
                {/* Scoreboard */}
                <div style={{background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px', overflow: 'hidden'}}>
                    <div style={{padding: '20px', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)', fontWeight: '700', fontSize: '16px'}}>
                        Scoreboard
                    </div>
                    <div style={{padding: '24px'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                            <div style={{textAlign: 'center'}}>
                                <div style={{fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: '600'}}>HOME</div>
                                <div style={{fontSize: '48px', fontWeight: '900', lineHeight: '1'}} id="homeScore">
                                    {scores.home.goals}-{scores.home.points.toString().padStart(2, '0')}
                                </div>
                                <div style={{fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '8px'}}>
                                    ({scores.home.goals * 3 + scores.home.points} pts)
                                </div>
                            </div>
                            <div style={{fontSize: '24px', color: 'rgba(255,255,255,0.5)', fontWeight: '900'}}>VS</div>
                            <div style={{textAlign: 'center'}}>
                                <div style={{fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: '600'}}>AWAY</div>
                                <div style={{fontSize: '48px', fontWeight: '900', lineHeight: '1'}} id="awayScore">
                                    {scores.away.goals}-{scores.away.points.toString().padStart(2, '0')}
                                </div>
                                <div style={{fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '8px'}}>
                                    ({scores.away.goals * 3 + scores.away.points} pts)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div style={{background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px', overflow: 'hidden'}}>
                    <div style={{padding: '20px', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)', fontWeight: '700', fontSize: '16px'}}>
                        Statistics
                    </div>
                    <div style={{padding: '20px'}}>
                        <StatRow label="Total Events" value={events.length} />
                        <StatRow label="Goals" value={stats.Goal} />
                        <StatRow label="Points" value={stats.Point + stats['2 Point']} />
                        <StatRow label="Fouls" value={stats.Foul + stats['Yellow Card'] + stats['Red Card'] + stats['Black Card']} />
                        <StatRow label="Own Kickouts Won" value={stats['Own Kickout Won']} />
                        <StatRow label="Opp Kickouts Won" value={stats['Opp Kickout Won']} />
                    </div>
                </div>

                {/* Recent Events */}
                <div style={{background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', flex: 1}}>
                    <div style={{padding: '20px', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)', fontWeight: '700', fontSize: '16px'}}>
                        Recent Events
                    </div>
                    <div style={{padding: '20px', maxHeight: '220px', overflowY: 'auto'}}>
                        {events.length === 0 ? (
                            <p style={{opacity: '0.6', fontSize: '13px', textAlign: 'center'}}>No events tagged yet</p>
                        ) : (
                            events.slice(-5).reverse().map(event => (
                                <div key={event.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.05)', marginBottom: '6px', borderRadius: '8px', fontSize: '13px', border: '1px solid rgba(255,255,255,0.1)'}}>
                                    <span>{event.type}</span>
                                    <span style={{fontFamily: 'monospace', color: 'rgba(255,255,255,0.8)', fontWeight: '600'}}>{event.timeString}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Event Button Component
function EventButton({ onClick, color, children }) {
    return (
        <button
            onClick={onClick}
            style={{
                padding: '12px 8px',
                background: `${color}33`,
                border: `2px solid ${color}`,
                borderRadius: '8px',
                color: 'white',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = `${color}66`}
            onMouseLeave={(e) => e.currentTarget.style.background = `${color}33`}
        >
            {children}
        </button>
    );
}

// Stat Row Component
function StatRow({ label, value }) {
    return (
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', fontSize: '13px'}}>
            <span style={{color: 'rgba(255,255,255,0.7)'}}>{label}</span>
            <span style={{fontWeight: '900', fontSize: '16px'}} id={label.replace(/\s+/g, '')}>{value}</span>
        </div>
    );
}

export default App;
