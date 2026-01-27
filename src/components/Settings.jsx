function Settings({ user, setView, setActivePage }) {
    return (
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
                    <button onClick={() => alert('Subscription cancellation will be implemented with Stripe integration')} style={{width: '100%', padding: '12px', background: '#DC2626', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', fontFamily: 'inherit', marginBottom: '12px'}}>
                        Cancel Subscription
                    </button>
                    <button onClick={() => setView('pricing')} style={{width: '100%', padding: '12px', background: 'white', border: 'none', color: '#00833E', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', fontFamily: 'inherit'}}>
                        Change Plan
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Settings;
