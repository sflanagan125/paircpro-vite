function Reports({ user, currentMatch, supabase, setCurrentMatch }) {
    if (!currentMatch || !currentMatch.events || currentMatch.events.length === 0) {
        return (
            <div style={{flex: 1, padding: '40px', overflowY: 'auto'}}>
                <div style={{maxWidth: '1200px', margin: '0 auto'}}>
                    <h1 style={{fontSize: '32px', fontWeight: '900', color: 'white', marginBottom: '32px'}}>Reports</h1>
                    <div style={{background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '48px', textAlign: 'center'}}>
                        <p style={{color: 'rgba(255,255,255,0.8)', fontSize: '18px'}}>No match selected or no events tagged</p>
                    </div>
                </div>
            </div>
        );
    }

    const events = currentMatch.events || [];
    const homeEvents = events.filter(e => e.team === 'home');
    const awayEvents = events.filter(e => e.team === 'away');
    
    const stats = {
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

    const homeTeam = currentMatch.home_team || 'Home Team';
    const awayTeam = currentMatch.away_team || 'Away Team';
    const sport = currentMatch.sport || 'football';

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const generatePDFReport = () => {
        const report = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Match Report - ${homeTeam} vs ${awayTeam}</title>
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
    <p><strong>Date:</strong> ${new Date(currentMatch.created_at).toLocaleDateString()}</p>
    
    <h2>Final Score</h2>
    <div class="score">${homeTeam}: ${stats.homeGoals}-${stats.homePoints.toString().padStart(2, '0')} vs ${awayTeam}: ${stats.awayGoals}-${stats.awayPoints.toString().padStart(2, '0')}</div>
    
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

    const deleteReport = async () => {
        if (!confirm('Delete this match and report? This cannot be undone.')) return;
        const { error } = await supabase.from('matches').delete().eq('id', currentMatch.id);
        if (!error) {
            setCurrentMatch(null);
        }
    };

    const shareReport = (method) => {
        const url = window.location.href;
        const text = `Match Report: ${homeTeam} vs ${awayTeam}`;
        
        if (method === 'email') {
            window.location.href = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`;
        } else if (method === 'whatsapp') {
            window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        }
    };

    return (
        <div style={{flex: 1, padding: '40px', overflowY: 'auto'}}>
            <div style={{maxWidth: '1200px', margin: '0 auto'}}>
                <h1 style={{fontSize: '32px', fontWeight: '900', color: 'white', marginBottom: '32px'}}>Reports</h1>
                <div style={{background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '32px', marginBottom: '24px'}}>
                    <h2 style={{fontSize: '24px', fontWeight: '700', color: 'white', marginBottom: '24px'}}>{homeTeam} vs {awayTeam}</h2>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '24px'}}>
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
                    
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px'}}>
                        <button onClick={generatePDFReport} style={{padding: '16px', background: 'white', border: 'none', color: '#00833E', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', fontFamily: 'inherit'}}>
                            DOWNLOAD PDF
                        </button>
                        <button onClick={() => shareReport('email')} style={{padding: '16px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', fontFamily: 'inherit'}}>
                            EMAIL
                        </button>
                        <button onClick={() => shareReport('whatsapp')} style={{padding: '16px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', fontFamily: 'inherit'}}>
                            WHATSAPP
                        </button>
                    </div>
                    
                    <button onClick={deleteReport} style={{marginTop: '12px', width: '100%', padding: '12px', background: 'rgba(220,38,38,0.3)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', fontFamily: 'inherit'}}>
                        DELETE REPORT
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Reports;
