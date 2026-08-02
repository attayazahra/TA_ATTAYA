import { FaUserCircle } from 'react-icons/fa';

function AdminTopBar({ profilePicture, adminName, isMobile }) {
  const styles = {
    topBar: {
      background: 'linear-gradient(135deg, #041a3a 0%, #7c3aed 100%)',
      padding: '18px 20px 18px',
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    },
    avatar: {
      width: '52px',
      height: '52px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      flexShrink: 0,
      border: '2px solid rgba(255,255,255,0.4)',
    },
    avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
    topBarName: { fontSize: '18px', fontWeight: '600', color: 'white', margin: 0 },
    topBarSub: { fontSize: '13px', color: 'rgba(255,255,255,0.75)', margin: 0 },
  };

  return (
    <div style={styles.topBar}>
      <div style={styles.avatar}>
        {profilePicture ? (
          <img src={profilePicture} alt="avatar" style={styles.avatarImg} />
        ) : (
          <FaUserCircle size={34} color="white" />
        )}
      </div>
      <div>
        <p style={styles.topBarName}>{adminName}</p>
        <p style={styles.topBarSub}>Admin Panel</p>
      </div>
    </div>
  );
}

export default AdminTopBar;