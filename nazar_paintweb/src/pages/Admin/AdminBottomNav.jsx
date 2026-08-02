import { FaBoxes, FaMoneyBillWave, FaPlusCircle, FaSlidersH, FaHistory, FaUser, FaPalette } from 'react-icons/fa';

function AdminBottomNav({ activeTab, setActiveTab, isMobile }) {
  const menuItems = [
    { id: 'stok', icon: <FaBoxes size={22} />, label: 'Stok' },
    { id: 'harga', icon: <FaMoneyBillWave size={22} />, label: 'Harga' },
    { id: 'tambah', icon: <FaPlusCircle size={22} />, label: 'Tambah' },
    { id: 'aturan', icon: <FaSlidersH size={22} />, label: 'Aturan' },
    { id: 'riwayat', icon: <FaHistory size={22} />, label: 'Riwayat' },
    { id: 'profile', icon: <FaUser size={22} />, label: 'Profil' },
  ];

  const styles = {
    container: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'white',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: isMobile ? '10px 12px' : '12px 20px',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.08)',
      borderTop: '1px solid #e2e8f0',
      zIndex: 100,
    },
    navItem: (isActive) => ({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: isMobile ? '6px 12px' : '8px 16px',
      borderRadius: '30px',
      transition: 'all 0.2s',
      color: isActive ? '#667eea' : '#94a3b8',
      backgroundColor: isActive ? '#eef2ff' : 'transparent',
    }),
    label: {
      fontSize: isMobile ? '11px' : '12px',
      fontWeight: '500',
    },
  };

  return (
    <div style={styles.container}>
      {menuItems.map((item) => (
        <button
          key={item.id}
          style={styles.navItem(activeTab === item.id)}
          onClick={() => setActiveTab(item.id)}
        >
          {item.icon}
          <span style={styles.label}>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

export default AdminBottomNav;