import { useState, useEffect, useRef } from 'react';

function VideoAnalysis({ user, supabase, currentMatch, setCurrentMatch }) {
    const videoRef = useRef(null);
    const [videoUrl, setVideoUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [sport, setSport] = useState('football');
    const [homeTeam, setHomeTeam] = useState('Home Team');
    const [awayTeam, setAwayTeam] = useState('Away Team');
    const [homeGoals, setHomeGoals] = useState(0);
    const [homePoints, setHomePoints] = useState(0);
    const [awayGoals, setAwayGoals] = useState(0);
    const [awayPoints, setAwayPoints] = useState(0);
    const [events, setEvents] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('home');
    const [eventNotes, setEventNotes] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [activeView, setActiveView] = useState('upload');

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

    const handleVideoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        console.log('File selected:', file.name);
        setUploading(true);
        try {
            // Create local URL - video stays in browser
            const localUrl = URL.createObjectURL(file);
            console.log('Local URL created:', localUrl);
            
            // Create temporary match object WITH blob URL
            const tempMatch = {
                id: Date.now(),
                title: file.name,
                home_team: homeTeam,
                away_team: awayTeam,
                sport: sport,
                events: [],
                video_url: localUrl
            };
            console.log('Setting match:', tempMatch);
            setCurrentMatch(tempMatch);
            // activeView will be set by useEffect
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to load video: ' + error.message);
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
            team: selectedTeam,
            notes: eventNotes
        };
        
        const updatedEvents = [...events, newEvent].sort((a, b) => a.timestamp - b.timestamp);
        setEvents(updatedEvents);
        
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
        
        setEventNotes('');
        
        if (currentMatch) {
            await supabase.from('matches').update({ events: updatedEvents }).eq('id', currentMatch.id);
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

    useEffect(() => {
        if (currentMatch) {
            setVideoUrl(currentMatch.video_url);
            setHomeTeam(currentMatch.home_team || 'Home Team');
            setAwayTeam(currentMatch.away_team || 'Away Team');
            setEvents(currentMatch.events || []);
            setSport(currentMatch.sport || 'football');
            if (currentMatch.video_url) setActiveView('video');
        }
    }, [currentMatch]);

    return (
        <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
            {activeView === 'upload' && (
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
                                <h3 style={{color: 'white', fontSize: '28px', fontWeight: '700', marginBottom: '12px'}}>{uploading ? 'Uploading...' : 'Click to Upload Video'}</h3>
                                <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '18px'}}>MP4, MOV, AVI • Max 2GB</p>
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {activeView === 'video' && videoUrl && (
                <div style={{flex: 1, display: 'flex', overflow: 'hidden', height: '100%', width: '100%'}}>
                    {/* LEFT - Event Tagging */}
                    <div style={{width: '360px', background: 'rgba(0,0,0,0.2)', borderRight: '1px solid rgba(255,255,255,0.1)', padding: '20px', overflowY: 'auto'}}>
                        <div style={{background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px', marginBottom: '20px'}}>
                            <div style={{fontSize: '13px', fontWeight: '700', color: 'white', marginBottom: '16px', textTransform: 'uppercase'}}>Match Setup</div>
                            <div style={{display: 'flex', gap: '8px', marginBottom: '12px'}}>
                                <button onClick={() => setSport('football')} style={{flex: 1, padding: '10px', background: sport === 'football' ? 'white' : 'rgba(255,255,255,0.1)', color: sport === 'football' ? '#00833E' : 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', fontFamily: 'inherit'}}>Football</button>
                                <button onClick={() => setSport('hurling')} style={{flex: 1, padding: '10px', background: sport === 'hurling' ? 'white' : 'rgba(255,255,255,0.1)', color: sport === 'hurling' ? '#00833E' : 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', fontFamily: 'inherit'}}>Hurling</button>
                            </div>
                            <div style={{display: 'flex', gap: '8px'}}>
                                <input type="text" value={homeTeam} onChange={(e) => setHomeTeam(e.target.value)} placeholder="Home Team" style={{flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '12px', fontFamily: 'inherit'}} />
                                <input type="text" value={awayTeam} onChange={(e) => setAwayTeam(e.target.value)} placeholder="Away Team" style={{flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '12px', fontFamily: 'inherit'}} />
                            </div>
                        </div>

                        <div style={{background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px', marginBottom: '20px'}}>
                            <div style={{fontSize: '13px', fontWeight: '700', color: 'white', marginBottom: '16px', textTransform: 'uppercase'}}>Tagging For</div>
                            <div style={{display: 'flex', gap: '8px'}}>
                                <button onClick={() => setSelectedTeam('home')} style={{flex: 1, padding: '12px', background: selectedTeam === 'home' ? 'white' : 'rgba(255,255,255,0.1)', color: selectedTeam === 'home' ? '#00833E' : 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', fontFamily: 'inherit', textTransform: 'uppercase'}}>{homeTeam}</button>
                                <button onClick={() => setSelectedTeam('away')} style={{flex: 1, padding: '12px', background: selectedTeam === 'away' ? 'white' : 'rgba(255,255,255,0.1)', color: selectedTeam === 'away' ? '#00833E' : 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', fontFamily: 'inherit', textTransform: 'uppercase'}}>{awayTeam}</button>
                            </div>
                        </div>

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
        </div>
    );
}

export default VideoAnalysis;
