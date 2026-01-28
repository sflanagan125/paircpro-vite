import { useEffect } from 'react';

function MyFiles({ user, supabase, matches, setMatches, setActivePage, setCurrentMatch }) {
    useEffect(() => {
        const loadMatches = async () => {
            const { data } = await supabase.from('matches').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
            if (data) setMatches(data);
        };
        loadMatches();
    }, [user.id, supabase, setMatches]);

    const loadMatch = (match) => {
        setCurrentMatch(match);
        setActivePage('analysis');
    };

    const deleteMatch = async (matchId, e) => {
        e.stopPropagation();
        if (!confirm('Delete this match? This cannot be undone.')) return;
        
        const { error } = await supabase.from('matches').delete().eq('id', matchId);
        if (!error) {
            setMatches(matches.filter(m => m.id !== matchId));
        }
    };

    const downloadVideo = async (match, e) => {
        e.stopPropagation();
        const a = document.createElement('a');
        a.href = match.video_url;
        a.download = match.title;
        a.click();
    };

    return (
        <div style={{flex: 1, padding: '40px', overflowY: 'auto'}}>
            <div style={{maxWidth: '1200px', margin: '0 auto'}}>
                <h1 style={{fontSize: '32px', fontWeight: '900', color: 'white', marginBottom: '32px'}}>My Files</h1>
                {matches.length > 0 ? (
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px'}}>
                        {matches.map(match => (
                            <div key={match.id} onClick={() => loadMatch(match)} style={{background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '24px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.2s', position: 'relative'}} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                                <h3 style={{color: 'white', fontSize: '18px', fontWeight: '700', marginBottom: '8px'}}>{match.title}</h3>
                                <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '16px'}}>{new Date(match.created_at).toLocaleDateString()} • {(match.events || []).length} events • {match.sport}</p>
                                <div style={{display: 'flex', gap: '8px'}}>
                                    <button onClick={(e) => downloadVideo(match, e)} style={{flex: 1, padding: '8px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600'}}>Download</button>
                                    <button onClick={(e) => deleteMatch(match.id, e)} style={{flex: 1, padding: '8px', background: 'rgba(220,38,38,0.3)', border: 'none', color: 'white', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600'}}>Delete</button>
                                </div>
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
    );
}

export default MyFiles;
