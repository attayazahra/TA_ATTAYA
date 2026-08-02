import { useState, useEffect } from 'react'
import {
  FaCalculator,
  FaPalette,
  FaLightbulb,
  FaUserCog,
  FaCalendarAlt,
  FaHistory,
  FaRulerCombined,
  FaDollarSign,
  FaPaintRoller,
  FaHome,
  FaSmile,
  FaCheckCircle,
  FaSignInAlt,
  FaSignOutAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTicketAlt,
  FaDoorOpen,
  FaWindowMaximize,
  FaLock,
} from 'react-icons/fa'

const adminColors = {
  primary: '#4f46e5',
  primaryDark: '#4338ca',
  primaryLight: '#818cf8',
  secondary: '#0ea5e9',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  dark: '#1e293b',
  light: '#f8fafc',
  border: '#e2e8f0',
  text: '#334155',
  textLight: '#64748b',
  bgCard: '#ffffff',
  bgHover: '#f1f5f9',
}

// ============================================================
// 🔧 FUNGSI UTILITY UNTUK MENANGANI DATA WARNA
// ============================================================
const safeParseWarna = (warnaData) => {
  if (!warnaData) return []
  if (Array.isArray(warnaData)) return warnaData
  if (typeof warnaData === 'string') {
    try {
      const parsed = JSON.parse(warnaData)
      if (Array.isArray(parsed)) return parsed
    } catch (e) {
      if (warnaData.includes(',')) {
        return warnaData.split(',').map(item => item.trim()).filter(item => item.length > 0)
      }
      return [warnaData]
    }
  }
  if (typeof warnaData === 'object') {
    if (Array.isArray(warnaData.warna)) return warnaData.warna
    if (Array.isArray(warnaData.list)) return warnaData.list
    if (Array.isArray(warnaData.data)) return warnaData.data
    const values = Object.values(warnaData)
    if (values.some(v => typeof v === 'string')) {
      return values.filter(v => typeof v === 'string')
    }
  }
  return []
}

function RiwayatTab({ styles: propStyles, isMobile }) {
  const [riwayatType, setRiwayatType] = useState('kalkulator')
  const [dataRiwayat, setDataRiwayat] = useState([])
  const [expandedId, setExpandedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const API_BASE = `${import.meta.env.VITE_API_URL}/api/v1.0/riwayat`

  // ===== FETCH DATA DARI BACKEND =====
  const fetchRiwayat = async () => {
    setLoading(true)
    setError('')
    try {
      let endpoint = ''
      if (riwayatType === 'kalkulator') endpoint = `${API_BASE}/kalkulator`
      else if (riwayatType === 'simulasi') endpoint = `${API_BASE}/simulasi`
      else if (riwayatType === 'rekomendasi') endpoint = `${API_BASE}/rekomendasi`
      else if (riwayatType === 'admin') endpoint = `${API_BASE}/admin`

      const response = await fetch(endpoint)
      const result = await response.json()
      if (result.status === 'success') {
        setDataRiwayat(result.data)
      } else {
        setError('Gagal mengambil data riwayat')
      }
    } catch (err) {
      setError('Gagal terhubung ke server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRiwayat()
  }, [riwayatType])

  // ===== FORMAT TANGGAL DENGAN TIMEZONE WIB =====
  const formatTanggal = (tanggalStr) => {
    if (!tanggalStr) return '-'
    try {
      const date = new Date(tanggalStr)
      return date.toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Jakarta'
      })
    } catch (e) {
      return tanggalStr
    }
  }

  const tabs = [
    { id: 'kalkulator', label: 'Kalkulator', icon: <FaCalculator size={isMobile ? 12 : 16} />, color: adminColors.primary },
    { id: 'simulasi', label: 'Simulasi', icon: <FaPalette size={isMobile ? 12 : 16} />, color: adminColors.secondary },
    { id: 'rekomendasi', label: 'Rekomendasi', icon: <FaLightbulb size={isMobile ? 12 : 16} />, color: adminColors.warning },
    { id: 'admin', label: 'Aktivitas', icon: <FaUserCog size={isMobile ? 12 : 16} />, color: adminColors.dark },
  ]

  const styles = {
    ...propStyles,
    container: { padding: isMobile ? '12px' : '20px', marginTop: '-12px' },
    title: { fontSize: isMobile ? '18px' : '20px', fontWeight: '600', color: adminColors.dark, marginTop: '0', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' },
    tabContainer: { display: 'flex', gap: isMobile ? '8px' : '12px', flexWrap: 'wrap', marginBottom: '20px' },
    tabButton: (isActive, color) => ({
      padding: isMobile ? '6px 12px' : '10px 28px',
      borderRadius: '40px',
      border: `1px solid ${isActive ? color : adminColors.border}`,
      background: isActive ? color : 'white',
      color: isActive ? 'white' : adminColors.textLight,
      fontWeight: isActive ? '600' : '500',
      fontSize: isMobile ? '11px' : '14px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      transition: 'all 0.2s',
      boxShadow: isActive ? `0 2px 8px ${color}40` : 'none',
    }),
    
    statsContainer: {
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: '12px',
      marginBottom: '24px',
    },
    statCard: {
      background: adminColors.bgCard,
      borderRadius: '20px',
      padding: isMobile ? '16px 12px' : '20px 16px',
      textAlign: 'center',
      position: 'relative',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    statIconWrapper: {
      width: '36px',
      height: '36px',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '8px',
    },
    statNumber: { 
      fontSize: isMobile ? '18px' : '28px', 
      fontWeight: '700', 
      color: adminColors.dark, 
      marginBottom: '4px', 
      lineHeight: 1.2,
      textAlign: 'center',
    },
    statLabel: { 
      fontSize: isMobile ? '9px' : '11px', 
      color: adminColors.textLight, 
      fontWeight: '500', 
      textTransform: 'uppercase', 
      letterSpacing: '0.5px',
      textAlign: 'center',
    },
    
    cardGrid: { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(380px, 1fr))', gap: '12px' },
    card: { background: adminColors.bgCard, borderRadius: '16px', padding: isMobile ? '10px' : '16px', border: `1px solid ${adminColors.border}`, cursor: 'pointer', transition: 'all 0.2s' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', paddingBottom: '8px', borderBottom: `1px solid ${adminColors.border}`, flexWrap: 'wrap', gap: '6px' },
    dateBadge: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: isMobile ? '8px' : '12px', color: adminColors.textLight },
    cardContent: { marginBottom: '6px' },
    cardRow: { 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: isMobile ? '3px 0' : '6px 0', 
      borderBottom: `1px solid ${adminColors.border}40` 
    },
    cardLabel: { 
      fontSize: isMobile ? '9px' : '13px', 
      color: adminColors.textLight, 
      display: 'flex', 
      alignItems: 'center', 
      gap: '4px' 
    },
    cardValue: { 
      fontSize: isMobile ? '9px' : '13px', 
      fontWeight: '500', 
      color: adminColors.dark, 
      textAlign: 'right' 
    },
    expandedContent: { marginTop: '8px', paddingTop: '8px', borderTop: `1px solid ${adminColors.border}`, background: adminColors.bgHover, borderRadius: '12px', padding: '8px', fontSize: isMobile ? '10px' : '12px' },
    emptyState: { textAlign: 'center', padding: isMobile ? '40px 20px' : '60px 20px', background: adminColors.bgHover, borderRadius: '16px', color: adminColors.textLight },
    loadingState: { textAlign: 'center', padding: isMobile ? '40px 20px' : '60px 20px', background: adminColors.bgHover, borderRadius: '16px', color: adminColors.textLight },
    // Style untuk badge kode aktivitas
    kodeBadge: {
      background: `${adminColors.primary}15`,
      color: adminColors.primary,
      padding: '2px 10px',
      borderRadius: '20px',
      fontSize: isMobile ? '8px' : '11px',
      fontWeight: '600',
      fontFamily: 'monospace',
      letterSpacing: '0.3px',
    },
  }

  const getStats = () => {
    if (!dataRiwayat || dataRiwayat.length === 0) return {}
    if (riwayatType === 'kalkulator') {
      const totalBiaya = dataRiwayat.reduce((sum, item) => sum + (item.estimasi_biaya || 0), 0)
      const totalCat = dataRiwayat.reduce((sum, item) => sum + (item.kebutuhan_kg || 0), 0)
      return { totalBiaya, totalCat }
    }
    if (riwayatType === 'simulasi') {
      const totalWarnaDicoba = dataRiwayat.reduce((sum, item) => {
        const warnaArray = safeParseWarna(item.warna_dicoba)
        return sum + warnaArray.length
      }, 0)
      return { totalWarnaDicoba }
    }
    if (riwayatType === 'rekomendasi') {
      return { totalRekomendasi: dataRiwayat.length }
    }
    if (riwayatType === 'admin') {
      const loginCount = dataRiwayat.filter((item) => item.aktivitas === 'Login').length
      const editCount = dataRiwayat.filter((item) => item.aktivitas?.includes('Edit') || item.aktivitas?.includes('Tambah') || item.aktivitas?.includes('Hapus')).length
      return { loginCount, editCount }
    }
    return {}
  }

  const stats = getStats()

  // ============================================================
  // 🔧 GET ACTIVITY ICON - LENGKAP DENGAN SEMUA AKTIVITAS
  // ============================================================
  const getActivityIcon = (aktivitas) => {
    if (aktivitas === 'Login') return <FaSignInAlt size={isMobile ? 8 : 12} color={adminColors.success} />
    if (aktivitas === 'Logout') return <FaSignOutAlt size={isMobile ? 8 : 12} color={adminColors.danger} />
    if (aktivitas === 'Reset Password') return <FaLock size={isMobile ? 8 : 12} color={adminColors.warning} />
    if (aktivitas === 'Tambah Warna') return <FaPlus size={isMobile ? 8 : 12} color={adminColors.success} />
    if (aktivitas === 'Edit Warna') return <FaEdit size={isMobile ? 8 : 12} color={adminColors.warning} />
    if (aktivitas === 'Hapus Warna') return <FaTrash size={isMobile ? 8 : 12} color={adminColors.danger} />
    if (aktivitas === 'Tambah Aturan') return <FaPlus size={isMobile ? 8 : 12} color={adminColors.success} />
    if (aktivitas === 'Edit Aturan') return <FaEdit size={isMobile ? 8 : 12} color={adminColors.warning} />
    if (aktivitas === 'Hapus Aturan') return <FaTrash size={isMobile ? 8 : 12} color={adminColors.danger} />
    if (aktivitas === 'Ubah Harga') return <FaDollarSign size={isMobile ? 8 : 12} color={adminColors.warning} />
    if (aktivitas === 'Ubah Profil') return <FaUserCog size={isMobile ? 8 : 12} color={adminColors.primary} />
    return <FaUserCog size={isMobile ? 8 : 12} color={adminColors.primary} />
  }

  // ============================================================
  // 🔧 GET ACTIVITY COLOR - LENGKAP DENGAN SEMUA AKTIVITAS
  // ============================================================
  const getActivityColor = (aktivitas) => {
    if (aktivitas === 'Login') return adminColors.success
    if (aktivitas === 'Logout') return adminColors.danger
    if (aktivitas === 'Reset Password') return adminColors.warning
    if (aktivitas === 'Tambah Warna') return adminColors.success
    if (aktivitas === 'Edit Warna') return adminColors.warning
    if (aktivitas === 'Hapus Warna') return adminColors.danger
    if (aktivitas === 'Tambah Aturan') return adminColors.success
    if (aktivitas === 'Edit Aturan') return adminColors.warning
    if (aktivitas === 'Hapus Aturan') return adminColors.danger
    if (aktivitas === 'Ubah Harga') return adminColors.warning
    if (aktivitas === 'Ubah Profil') return adminColors.primary
    return adminColors.primary
  }

  // ============================================================
  // 🔧 RENDER CARD
  // ============================================================
  const renderCard = (item) => {
    if (!item) return null
    const isExpanded = expandedId === item.id

    // ===== KALKULATOR =====
    if (riwayatType === 'kalkulator') {
      return (
        <div key={item.id} style={styles.card} onClick={() => setExpandedId(isExpanded ? null : item.id)}>
          <div style={styles.cardHeader}>
            <div style={styles.dateBadge}>
              <FaCalendarAlt size={isMobile ? 8 : 12} /> {formatTanggal(item.created_at)}
            </div>
            {/* TAMPILKAN KODE AKTIVITAS */}
            <div style={styles.kodeBadge}>
              {item.kode_aktivitas || '-'}
            </div>
          </div>
          <div style={styles.cardContent}>
            <div style={styles.cardRow}>
              <span style={styles.cardLabel}>
                <FaTicketAlt size={isMobile ? 8 : 12} /> Kode Aktivitas
              </span>
              <span style={{ ...styles.cardValue, fontFamily: 'monospace', fontWeight: '600' }}>
                {item.kode_aktivitas || '-'}
              </span>
            </div>
            <div style={styles.cardRow}>
              <span style={styles.cardLabel}>
                <FaRulerCombined size={isMobile ? 8 : 12} /> Dimensi Ruangan
              </span>
              <span style={styles.cardValue}>{item.panjang}×{item.lebar}×{item.tinggi} m</span>
            </div>
            <div style={styles.cardRow}>
              <span style={styles.cardLabel}>
                <FaDoorOpen size={isMobile ? 8 : 12} /> Pintu
              </span>
              <span style={styles.cardValue}>
                {item.jumlah_pintu || 0} bh 
                {item.lebar_pintu && item.tinggi_pintu && ` (${item.lebar_pintu}×${item.tinggi_pintu} m)`}
              </span>
            </div>
            <div style={styles.cardRow}>
              <span style={styles.cardLabel}>
                <FaWindowMaximize size={isMobile ? 8 : 12} /> Jendela
              </span>
              <span style={styles.cardValue}>
                {item.jumlah_jendela || 0} bh
                {item.lebar_jendela && item.tinggi_jendela && ` (${item.lebar_jendela}×${item.tinggi_jendela} m)`}
              </span>
            </div>
            <div style={styles.cardRow}>
              <span style={styles.cardLabel}>
                <FaPaintRoller size={isMobile ? 8 : 12} /> Kebutuhan
              </span>
              <span style={styles.cardValue}>{item.kebutuhan_kg || 0} kg ({item.lapisan || 2} lapis)</span>
            </div>
            <div style={styles.cardRow}>
              <span style={styles.cardLabel}>
                <FaDollarSign size={isMobile ? 8 : 12} /> Estimasi
              </span>
              <span style={styles.cardValue}>Rp {(item.estimasi_biaya || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )
    }

    // ===== SIMULASI =====
    if (riwayatType === 'simulasi') {
      const warnaArray = safeParseWarna(item.warna_dicoba)
      const warnaCount = warnaArray.length
      const displayWarna = warnaArray.slice(0, 2)
      const hasMore = warnaCount > 2

      return (
        <div key={item.id} style={styles.card} onClick={() => setExpandedId(isExpanded ? null : item.id)}>
          <div style={styles.cardHeader}>
            <div style={styles.dateBadge}>
              <FaCalendarAlt size={isMobile ? 8 : 12} /> {formatTanggal(item.created_at)}
            </div>
            {/* TAMPILKAN KODE AKTIVITAS */}
            <div style={styles.kodeBadge}>
              {item.kode_aktivitas || '-'}
            </div>
          </div>
          <div style={styles.cardContent}>
            <div style={styles.cardRow}>
              <span style={styles.cardLabel}>
                <FaTicketAlt size={isMobile ? 8 : 12} /> Kode Aktivitas
              </span>
              <span style={{ ...styles.cardValue, fontFamily: 'monospace', fontWeight: '600' }}>
                {item.kode_aktivitas || '-'}
              </span>
            </div>
            <div style={styles.cardRow}>
              <span style={styles.cardLabel}>
                <FaPalette size={isMobile ? 8 : 12} /> Warna Dicoba
              </span>
              <span style={styles.cardValue}>{warnaCount} warna</span>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
              {displayWarna.map((w, idx) => (
                <span 
                  key={idx} 
                  style={{ 
                    background: adminColors.bgHover, 
                    padding: '2px 8px', 
                    borderRadius: '20px', 
                    fontSize: isMobile ? '9px' : '11px' 
                  }}
                >
                  {w}
                </span>
              ))}
              {hasMore && (
                <span style={{ fontSize: '9px', color: adminColors.textLight }}>
                  +{warnaCount - 2} lainnya
                </span>
              )}
            </div>
            <div style={styles.cardRow}>
              <span style={styles.cardLabel}>
                <FaCheckCircle size={isMobile ? 8 : 12} color={adminColors.success} /> Warna Akhir
              </span>
              <span style={styles.cardValue}>{item.warna_akhir || '-'}</span>
            </div>
          </div>
        </div>
      )
    }

    // ===== REKOMENDASI =====
    if (riwayatType === 'rekomendasi') {
      return (
        <div key={item.id} style={styles.card} onClick={() => setExpandedId(isExpanded ? null : item.id)}>
          <div style={styles.cardHeader}>
            <div style={styles.dateBadge}>
              <FaCalendarAlt size={isMobile ? 8 : 12} /> {formatTanggal(item.created_at)}
            </div>
            {/* TAMPILKAN KODE AKTIVITAS */}
            <div style={styles.kodeBadge}>
              {item.kode_aktivitas || '-'}
            </div>
          </div>
          <div style={styles.cardContent}>
            <div style={styles.cardRow}>
              <span style={styles.cardLabel}>
                <FaTicketAlt size={isMobile ? 8 : 12} /> Kode Aktivitas
              </span>
              <span style={{ ...styles.cardValue, fontFamily: 'monospace', fontWeight: '600' }}>
                {item.kode_aktivitas || '-'}
              </span>
            </div>
            <div style={styles.cardRow}>
              <span style={styles.cardLabel}>
                <FaHome size={isMobile ? 8 : 12} /> Ruangan
              </span>
              <span style={styles.cardValue}>{item.jenis_ruangan || '-'}</span>
            </div>
            <div style={styles.cardRow}>
              <span style={styles.cardLabel}>
                <FaSmile size={isMobile ? 8 : 12} /> Suasana
              </span>
              <span style={styles.cardValue}>{item.suasana || '-'}</span>
            </div>
            <div style={styles.cardRow}>
              <span style={styles.cardLabel}>Dipilih</span>
              <span style={styles.cardValue}>
                <FaCheckCircle size={isMobile ? 8 : 12} color={adminColors.success} /> {item.warna_dipilih || '-'}
              </span>
            </div>
          </div>
        </div>
      )
    }

    // ===== ADMIN =====
    if (riwayatType === 'admin') {
      return (
        <div key={item.id} style={styles.card} onClick={() => setExpandedId(isExpanded ? null : item.id)}>
          <div style={styles.cardHeader}>
            <div style={styles.dateBadge}>
              <FaCalendarAlt size={isMobile ? 8 : 12} /> {formatTanggal(item.created_at)}
            </div>
            <div style={{ 
              fontSize: isMobile ? '8px' : '11px', 
              color: getActivityColor(item.aktivitas), 
              background: `${getActivityColor(item.aktivitas)}10`, 
              padding: '2px 6px', 
              borderRadius: '20px', 
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {getActivityIcon(item.aktivitas)} {item.aktivitas || '-'}
            </div>
          </div>
          <div style={styles.cardContent}>
            <div style={styles.cardRow}>
              <span style={styles.cardLabel}>Admin</span>
              <span style={styles.cardValue}>{item.admin_name || '-'}</span>
            </div>
            <div style={styles.cardRow}>
              <span style={styles.cardLabel}>Detail</span>
              <span style={{ ...styles.cardValue, textAlign: 'left', fontSize: isMobile ? '9px' : '12px' }}>
                {item.detail?.substring(0, 35)}...
              </span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  if (loading) return <div style={styles.loadingState}>⏳ Memuat data riwayat...</div>

  if (error) {
    return (
      <div style={styles.emptyState}>
        <p style={{ color: '#ef4444' }}>{error}</p>
        <button
          onClick={fetchRiwayat}
          style={{
            padding: '8px 20px',
            background: adminColors.primary,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '10px',
          }}
        >
          Coba Lagi
        </button>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        <FaHistory size={isMobile ? 18 : 24} color={adminColors.primary} /> Riwayat Aktivitas
      </h2>

      <div style={styles.tabContainer}>
        {tabs.map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => setRiwayatType(tab.id)} 
            style={styles.tabButton(riwayatType === tab.id, tab.color)}
          >
            {tab.icon}
            {!isMobile && tab.label}
            {isMobile && (riwayatType === tab.id ? tab.label : tab.label.charAt(0))}
          </button>
        ))}
      </div>

      {dataRiwayat.length > 0 && (
        <div style={styles.statsContainer}>
          <div style={{ ...styles.statCard, borderTop: `3px solid ${adminColors.primary}` }}>
            <div style={{ ...styles.statIconWrapper, background: `${adminColors.primary}20` }}>
              <FaHistory size={18} color={adminColors.primary} />
            </div>
            <div style={styles.statNumber}>{dataRiwayat.length}</div>
            <div style={styles.statLabel}>Total Data</div>
          </div>

          {riwayatType === 'kalkulator' && stats.totalCat !== undefined && (
            <>
              <div style={{ ...styles.statCard, borderTop: `3px solid ${adminColors.secondary}` }}>
                <div style={{ ...styles.statIconWrapper, background: `${adminColors.secondary}20` }}>
                  <FaPaintRoller size={18} color={adminColors.secondary} />
                </div>
                <div style={styles.statNumber}>{stats.totalCat?.toFixed(1) || 0} kg</div>
                <div style={styles.statLabel}>Total Cat</div>
              </div>
              <div style={{ ...styles.statCard, borderTop: `3px solid ${adminColors.success}` }}>
                <div style={{ ...styles.statIconWrapper, background: `${adminColors.success}20` }}>
                  <FaDollarSign size={18} color={adminColors.success} />
                </div>
                <div style={styles.statNumber}>Rp {(stats.totalBiaya || 0).toLocaleString()}</div>
                <div style={styles.statLabel}>Total Estimasi</div>
              </div>
            </>
          )}

          {riwayatType === 'simulasi' && stats.totalWarnaDicoba !== undefined && (
            <div style={{ ...styles.statCard, borderTop: `3px solid ${adminColors.warning}` }}>
              <div style={{ ...styles.statIconWrapper, background: `${adminColors.warning}20` }}>
                <FaPalette size={18} color={adminColors.warning} />
              </div>
              <div style={styles.statNumber}>{stats.totalWarnaDicoba || 0}</div>
              <div style={styles.statLabel}>Warna Dicoba</div>
            </div>
          )}

          {riwayatType === 'admin' && (
            <>
              <div style={{ ...styles.statCard, borderTop: `3px solid ${adminColors.success}` }}>
                <div style={{ ...styles.statIconWrapper, background: `${adminColors.success}20` }}>
                  <FaSignInAlt size={18} color={adminColors.success} />
                </div>
                <div style={styles.statNumber}>{stats.loginCount || 0}</div>
                <div style={styles.statLabel}>Login</div>
              </div>
              <div style={{ ...styles.statCard, borderTop: `3px solid ${adminColors.warning}` }}>
                <div style={{ ...styles.statIconWrapper, background: `${adminColors.warning}20` }}>
                  <FaEdit size={18} color={adminColors.warning} />
                </div>
                <div style={styles.statNumber}>{stats.editCount || 0}</div>
                <div style={styles.statLabel}>Perubahan Data</div>
              </div>
            </>
          )}
        </div>
      )}

      {dataRiwayat.length === 0 ? (
        <div style={styles.emptyState}>
          <FaHistory size={isMobile ? 32 : 48} style={{ marginBottom: '12px', opacity: 0.5 }} />
          <p>Belum ada data riwayat</p>
        </div>
      ) : (
        <div style={styles.cardGrid}>
          {dataRiwayat.map((item) => renderCard(item))}
        </div>
      )}
    </div>
  )
}

export default RiwayatTab