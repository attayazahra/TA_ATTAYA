import { useNavigate, useLocation } from 'react-router-dom'
import { FaHome, FaCalculator, FaLightbulb, FaPalette } from 'react-icons/fa'

function NavbarFitur({ isMobile }) {
  const navigate = useNavigate()
  const location = useLocation()

  const items = [
    { path: '/', label: 'Beranda', icon: <FaHome size={isMobile ? 14 : 16} /> },
    { path: '/kalkulator', label: 'Kalkulator', icon: <FaCalculator size={isMobile ? 14 : 16} /> },
    { path: '/rekomendasi', label: 'Rekomendasi', icon: <FaLightbulb size={isMobile ? 14 : 16} /> },
    { path: '/warna', label: 'Simulasi', icon: <FaPalette size={isMobile ? 14 : 16} /> },
  ]

  const styles = {
    container: {
      display: 'flex',
      gap: isMobile ? '4px' : '8px',
      background: 'white',
      borderRadius: '40px',
      padding: isMobile ? '4px' : '6px',
      border: '1px solid #E7E5E4',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      flexWrap: isMobile ? 'wrap' : 'nowrap',
      justifyContent: isMobile ? 'center' : 'flex-start',
      width: '100%',
    },
    navItem: (active) => ({
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '4px' : '8px',
      padding: isMobile ? '6px 12px' : '8px 20px',
      borderRadius: '30px',
      border: 'none',
      background: active ? '#D97706' : 'transparent',
      color: active ? 'white' : '#78716C',
      fontSize: isMobile ? '11px' : '14px',
      fontWeight: active ? '600' : '500',
      cursor: 'pointer',
      transition: 'all 0.25s ease',
      whiteSpace: 'nowrap',
    }),
  }

  return (
    <div style={styles.container}>
      {items.map((item) => {
        const isActive = location.pathname === item.path
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={styles.navItem(isActive)}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = '#FEF3C7'
                e.currentTarget.style.color = '#78350F'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#78716C'
              }
            }}
          >
            {item.icon}
            {!isMobile && item.label}
            {isMobile && isActive && item.label}
          </button>
        )
      })}
    </div>
  )
}

export default NavbarFitur