function Settings({ user, setView, setActivePage }) {
    const changePlan = () => {
        window.open('/#pricing', '_blank');
    };

    return (
        <div style={{flex: 1, padding: '40px', overflowY: 'auto'}}>
            <div style={{maxWidth: '800px', margin: '0 auto'}}>
                <h1 style={{fontSize: '32px', fontWeight: '900', color: 'white', marginBottom: '32px'}}>Settings</h1>
                
                {/* Profile Settings */}
                <div style={{background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '32px', marginBottom: '24px'}}>
                    <h2 style={{fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '24px'}}>Profile Settings</h2>
                    
                    <div style={{marginBottom: '20px'}}>
                        <label style={{display: 'block', color: 'white', fontWeight: '600', fontSize: '14px', marginBottom: '8px'}}>Profile Photo</label>
                        <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                            <div style={{width: '80px', height: '80px', borderRadius: '50%', background: 'white', color: '#00833E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '24px'}}>
                                {user.email.substring(0, 2).toUpperCase()}
                            </div>
                            <button style={{padding: '12px 24px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', fontFamily: 'inherit'}}>
                                Change Photo
                            </button>
                        </div>
                    </div>
                    
                    <div style={{marginBottom: '20px'}}>
                        <label style={{display: 'block', color: 'white', fontWeight: '600', fontSize: '14px', marginBottom: '8px'}}>Full Name</label>
                        <input type="text" placeholder="Enter your full name" style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '16px'}} />
                    </div>
                    
                    <div style={{marginBottom: '20px'}}>
                        <label style={{display: 'block', color: 'white', fontWeight: '600', fontSize: '14px', marginBottom: '8px'}}>Email</label>
                        <input type="email" value={user.email} disabled style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '16px'}} />
                    </div>
                    
                    <div style={{marginBottom: '20px'}}>
                        <label style={{display: 'block', color: 'white', fontWeight: '600', fontSize: '14px', marginBottom: '8px'}}>Bio</label>
                        <textarea placeholder="Tell us about yourself" rows="4" style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '16px', fontFamily: 'inherit', resize: 'vertical'}}></textarea>
                    </div>
                    
                    <button style={{padding: '12px 24px', background: 'white', border: 'none', color: '#00833E', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', fontFamily: 'inherit'}}>
                        Save Profile
                    </button>
                </div>

                {/* Account Settings */}
                <div style={{background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '32px', marginBottom: '24px'}}>
                    <h2 style={{fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '24px'}}>Account Settings</h2>
                    
                    <div style={{marginBottom: '24px'}}>
                        <h3 style={{fontSize: '16px', fontWeight: '600', color: 'white', marginBottom: '12px'}}>Change Password</h3>
                        <div style={{marginBottom: '12px'}}>
                            <input type="password" placeholder="Current password" style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '14px', marginBottom: '8px'}} />
                            <input type="password" placeholder="New password" style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '14px', marginBottom: '8px'}} />
                            <input type="password" placeholder="Confirm new password" style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '14px'}} />
                        </div>
                        <button style={{padding: '10px 20px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', fontFamily: 'inherit'}}>
                            Update Password
                        </button>
                    </div>
                    
                    <div style={{padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '16px'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                            <div style={{fontSize: '16px', fontWeight: '600', color: 'white'}}>Coach Plan</div>
                            <div style={{fontSize: '24px', fontWeight: '800', color: 'white'}}>€97/mo</div>
                        </div>
                        <div style={{fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px'}}>50GB Storage • 3 Users</div>
                        <button onClick={changePlan} style={{padding: '10px 20px', background: 'white', border: 'none', color: '#00833E', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', fontFamily: 'inherit'}}>
                            Change Plan
                        </button>
                    </div>
                    
                    <div style={{borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '24px', marginTop: '24px'}}>
                        <h3 style={{fontSize: '16px', fontWeight: '600', color: '#ef4444', marginBottom: '12px'}}>Danger Zone</h3>
                        <button onClick={() => alert('Delete account requires confirmation email')} style={{padding: '12px 24px', background: 'rgba(220,38,38,0.3)', border: '1px solid #DC2626', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', fontFamily: 'inherit'}}>
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
