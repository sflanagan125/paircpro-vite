function DashboardView({ matches, currentMatch }) {
    if (!currentMatch || !currentMatch.events || currentMatch.events.length === 0) {
        return (
            <div style={{flex: 1, padding: '40px', overflowY: 'auto'}}>
                <div style={{maxWidth: '1400px', margin: '0 auto'}}>
                    <h1 style={{fontSize: '32px', fontWeight: '900', color: 'white', marginBottom: '32px'}}>Dashboard Overview</h1>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px'}}>
                        <div style={{background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '32px'}}>
                            <div style={{fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '700'}}>Total Matches</div>
                            <div style={{fontSize: '48px', fontWeight: '900', color: 'white'}}>{matches.length}</div>
                        </div>
                        <div style={{background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '32px'}}>
                            <div style={{fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '700'}}>Total Events Tagged</div>
                            <div style={{fontSize: '48px', fontWeight: '900', color: 'white'}}>{matches.reduce((sum, m) => sum + (m.events?.length || 0), 0)}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const events = currentMatch.events || [];
    const homeTeam = currentMatch.home_team || 'Home Team';
    const awayTeam = currentMatch.away_team || 'Away Team';
    const homeEvents = events.filter(e => e.team === 'home');
    const awayEvents = events.filter(e => e.team === 'away');
    
    const stats = {
        homeGoals: homeEvents.filter(e => e.type === 'goal').length,
        awayGoals: awayEvents.filter(e => e.type === 'goal').length,
        homePoints: homeEvents.filter(e => e.type === 'point' || e.type === '2point').length,
        awayPoints: awayEvents.filter(e => e.type === 'point' || e.type === '2point').length,
        homeFouls: homeEvents.filter(e => e.type === 'foul').length,
        awayFouls: awayEvents.filter(e => e.type === 'foul').length,
        homeWides: homeEvents.filter(e => e.type === 'wide').length,
        awayWides: awayEvents.filter(e => e.type === 'wide').length
    };

    const eventCounts = events.reduce((acc, e) => { acc[e.label] = (acc[e.label] || 0) + 1; return acc; }, {});

    return (
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
                </div>
                
                <div style={{background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '32px'}}>
                    <h2 style={{fontSize: '24px', fontWeight: '700', color: 'white', marginBottom: '24px'}}>Latest Match: {homeTeam} vs {awayTeam}</h2>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px'}}>
                        {/* Event Distribution */}
                        <div>
                            <div style={{fontSize: '16px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px', fontWeight: '700'}}>Event Distribution</div>
                            <div style={{height: '300px', background: 'white', borderRadius: '8px', padding: '20px'}}>
                                {Object.entries(eventCounts).map(([label, count]) => (
                                    <div key={label} style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee'}}>
                                        <span style={{fontWeight: '600'}}>{label}</span>
                                        <span style={{fontWeight: '700', color: '#00833E'}}>{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Team Performance */}
                        <div>
                            <div style={{fontSize: '16px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px', fontWeight: '700'}}>Team Performance</div>
                            <div style={{height: '300px', background: 'white', borderRadius: '8px', padding: '20px'}}>
                                <div style={{marginBottom: '20px'}}>
                                    <div style={{fontSize: '12px', color: '#666', marginBottom: '4px'}}>Goals</div>
                                    <div style={{display: 'flex', gap: '8px'}}>
                                        <div style={{flex: stats.homeGoals || 0.5, background: '#00833E', height: '24px', borderRadius: '4px', minWidth: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: '700'}}>{stats.homeGoals}</div>
                                        <div style={{flex: stats.awayGoals || 0.5, background: '#006030', height: '24px', borderRadius: '4px', minWidth: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: '700'}}>{stats.awayGoals}</div>
                                    </div>
                                </div>
                                <div style={{marginBottom: '20px'}}>
                                    <div style={{fontSize: '12px', color: '#666', marginBottom: '4px'}}>Points</div>
                                    <div style={{display: 'flex', gap: '8px'}}>
                                        <div style={{flex: stats.homePoints || 0.5, background: '#00833E', height: '24px', borderRadius: '4px', minWidth: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: '700'}}>{stats.homePoints}</div>
                                        <div style={{flex: stats.awayPoints || 0.5, background: '#006030', height: '24px', borderRadius: '4px', minWidth: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: '700'}}>{stats.awayPoints}</div>
                                    </div>
                                </div>
                                <div style={{marginBottom: '20px'}}>
                                    <div style={{fontSize: '12px', color: '#666', marginBottom: '4px'}}>Fouls</div>
                                    <div style={{display: 'flex', gap: '8px'}}>
                                        <div style={{flex: stats.homeFouls || 0.5, background: '#00833E', height: '24px', borderRadius: '4px', minWidth: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: '700'}}>{stats.homeFouls}</div>
                                        <div style={{flex: stats.awayFouls || 0.5, background: '#006030', height: '24px', borderRadius: '4px', minWidth: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: '700'}}>{stats.awayFouls}</div>
                                    </div>
                                </div>
                                <div>
                                    <div style={{fontSize: '12px', color: '#666', marginBottom: '4px'}}>Wides</div>
                                    <div style={{display: 'flex', gap: '8px'}}>
                                        <div style={{flex: stats.homeWides || 0.5, background: '#00833E', height: '24px', borderRadius: '4px', minWidth: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: '700'}}>{stats.homeWides}</div>
                                        <div style={{flex: stats.awayWides || 0.5, background: '#006030', height: '24px', borderRadius: '4px', minWidth: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: '700'}}>{stats.awayWides}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardView;
