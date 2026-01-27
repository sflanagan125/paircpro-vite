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

    return (
        <div style={{flex: 1, padding: '40px', overflowY: 'auto'}}>
            <div style={{maxWidth: '1200px', margin: '0 auto'}}>
                <h1 style={{fontSize: '32px', fontWeight: '900', color: 'white', marginBottom: '32px'}}>My Files</h1>
                {matches.length > 0 ? (
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px'}}>
                        {matches.map(match => (
                            <div key={match.id} onClick={() => loadMatch(match)} style={{background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '24px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.2s'}} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
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
    );
}

export default MyFiles;
