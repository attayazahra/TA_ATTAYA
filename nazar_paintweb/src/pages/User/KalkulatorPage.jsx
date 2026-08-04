import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  FaRulerCombined,
  FaDoorOpen,
  FaWindowMaximize,
  FaPaintRoller,
  FaCalculator,
  FaMoneyBillWave,
  FaInfoCircle,
  FaCheckCircle,
} from 'react-icons/fa'
import { MdOutlineCleaningServices } from 'react-icons/md'
import { HiSparkles } from 'react-icons/hi'
import { getSessionId } from '../../utils/session'
import { saveRiwayatKalkulator } from '../../utils/riwayatHelper'
import NavbarFitur from '../../components/NavbarFitur'

function KalkulatorPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const resultRef = useRef(null)

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const brownColor = '#78350F'
  const brownLight = '#92400E'
  const orangeSoft = '#D97706'
  const textLight = '#78716C'
  const bgWhite = '#FFFFFF'
  const bgWarm = '#FEFCE8'
  const borderColor = '#E7E5E4'

  const primaryGradient = `linear-gradient(135deg, ${brownColor} 0%, ${brownLight} 50%, ${orangeSoft} 100%)`
  const secondaryGradient = `linear-gradient(135deg, ${brownLight} 0%, ${orangeSoft} 100%)`

  const scrollToResult = () => {
    setTimeout(() => {
      if (resultRef.current) {
        resultRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        })
      }
    }, 100)
  }

  useEffect(() => {
    if (location.state?.scrollTo === 'fitur-kalkulator') {
      const element = document.getElementById('fitur-kalkulator')
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 300)
      }
    }
  }, [location])

  const [panjang, setPanjang] = useState('')
  const [lebar, setLebar] = useState('')
  const [tinggi, setTinggi] = useState('')
  const [pintu, setPintu] = useState('')
  const [lebarPintu, setLebarPintu] = useState('')
  const [tinggiPintu, setTinggiPintu] = useState('')
  const [jendela, setJendela] = useState('')
  const [lebarJendela, setLebarJendela] = useState('')
  const [tinggiJendela, setTinggiJendela] = useState('')
  const [lapisan, setLapisan] = useState('2')
  const [jenisCat, setJenisCat] = useState('pro')
  const [hasil, setHasil] = useState(null)

  const [hargaList, setHargaList] = useState([])
  const [loadingHarga, setLoadingHarga] = useState(true)

  const fetchHarga = async () => {
    try {
      setLoadingHarga(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1.0/harga`)
      const result = await response.json()
      if (result.status === 'success') {
        setHargaList(result.data)
      }
    } catch (error) {
      console.error('Gagal fetch harga:', error)
    } finally {
      setLoadingHarga(false)
    }
  }

  useEffect(() => {
    fetchHarga()
  }, [])

  const getHargaCat = () => {
    const hargaObj = {}
    hargaList.forEach((item) => {
      const key = item.jenis.toLowerCase().replace(/\s+/g, '-')
      hargaObj[key] = item.harga_per_kg
    })
    return hargaObj
  }

  const getNamaCat = (key) => {
    const nama = {
      'multi-gloss': 'Multi Gloss',
      pro: 'Pro',
      super: 'Super',
      'multi-doff': 'Multi Doff',
      emas: 'Emas',
    }
    return nama[key] || key
  }

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID').format(angka)
  }

  const simpanRiwayatKalkulator = async (data) => {
    try {
      const sessionId = await getSessionId()

      await fetch(`${import.meta.env.VITE_API_URL}/api/v1.0/riwayat/kalkulator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          panjang: data.panjang,
          lebar: data.lebar,
          tinggi: data.tinggi,
          jumlah_pintu: data.jumlahPintu || 0,
          lebar_pintu: data.lebarPintu || 0,
          tinggi_pintu: data.tinggiPintu || 0,
          jumlah_jendela: data.jumlahJendela || 0,
          lebar_jendela: data.lebarJendela || 0,
          tinggi_jendela: data.tinggiJendela || 0,
          lapisan: data.lapisan || 2,
          jenis_cat: data.jenisCat || '',
          kebutuhan_kg: data.kebutuhanKg || 0,
          estimasi_biaya: data.estimasiBiaya || 0,
        }),
      })
    } catch (error) {
      console.error('Gagal simpan riwayat kalkulator:', error)
    }
  }

  // ===== FUNGSI HITUNG (BARU) =====
  const hitungKebutuhan = async () => {
    const p = parseFloat(panjang)
    const l = parseFloat(lebar)
    const t = parseFloat(tinggi)

    if (isNaN(p) || isNaN(l) || isNaN(t) || p <= 0 || l <= 0 || t <= 0) {
      alert(
        'Mohon isi panjang, lebar, dan tinggi ruangan dengan angka yang valid!'
      )
      return
    }

    const jumlahPintu = parseFloat(pintu) || 0
    const lebarPintuM = parseFloat(lebarPintu) || 0
    const tinggiPintuM = parseFloat(tinggiPintu) || 0
    const luasPintu = jumlahPintu * (lebarPintuM * tinggiPintuM)

    const jumlahJendela = parseFloat(jendela) || 0
    const lebarJendelaM = parseFloat(lebarJendela) || 0
    const tinggiJendelaM = parseFloat(tinggiJendela) || 0
    const luasJendela = jumlahJendela * (lebarJendelaM * tinggiJendelaM)

    const kelilingRuangan = 2 * (p + l)
    const luasDindingKotor = kelilingRuangan * t
    const luasDindingBersih = luasDindingKotor - (luasPintu + luasJendela)

    const lapisanNum = parseFloat(lapisan)
    const kebutuhanKgTotal = (luasDindingBersih / 10) * lapisanNum * 1.1
    const kebutuhanKgBulat = Math.ceil(kebutuhanKgTotal)

    const hargaCat = getHargaCat()
    const harga = hargaCat[jenisCat] || 0
    const totalBiaya = kebutuhanKgBulat * harga

    setHasil({
      luasDindingKotor: luasDindingKotor.toFixed(2),
      luasPintu: luasPintu.toFixed(2),
      luasJendela: luasJendela.toFixed(2),
      luasDindingBersih: luasDindingBersih.toFixed(2),
      kebutuhanKg: kebutuhanKgTotal.toFixed(2),
      kebutuhanKgBulat,
      totalBiaya,
      totalBiayaFormatted: formatRupiah(totalBiaya),
      jenisCat: getNamaCat(jenisCat),
      hargaPerKg: formatRupiah(harga),
      lapisan: lapisanNum,
    })

    await simpanRiwayatKalkulator({
      panjang: p,
      lebar: l,
      tinggi: t,
      jumlahPintu: parseFloat(pintu) || 0,
      lebarPintu: parseFloat(lebarPintu) || 0,
      tinggiPintu: parseFloat(tinggiPintu) || 0,
      jumlahJendela: parseFloat(jendela) || 0,
      lebarJendela: parseFloat(lebarJendela) || 0,
      tinggiJendela: parseFloat(tinggiJendela) || 0,
      lapisan: parseFloat(lapisan),
      jenisCat: getNamaCat(jenisCat),
      kebutuhanKg: kebutuhanKgTotal,
      estimasiBiaya: totalBiaya,
    })

    scrollToResult()
  }

  const resetForm = () => {
    setPanjang('')
    setLebar('')
    setTinggi('')
    setPintu('')
    setLebarPintu('')
    setTinggiPintu('')
    setJendela('')
    setLebarJendela('')
    setTinggiJendela('')
    setLapisan('2')
    setJenisCat('pro')
    setHasil(null)
  }

  const styles = {
    page: {
      background: secondaryGradient,
      minHeight: '100vh',
      padding: isMobile ? '12px' : '20px',
      fontFamily: "'Inter', 'Poppins', system-ui, sans-serif",
    },
    card: {
      maxWidth: '1400px',
      margin: '0 auto',
      backgroundColor: 'rgba(255, 255, 255, 0.96)',
      backdropFilter: 'blur(10px)',
      borderRadius: isMobile ? '20px' : '32px',
      padding: isMobile ? '20px' : '40px',
      boxShadow: `0 25px 50px -12px ${brownColor}40`,
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    navWrapper: {
      marginBottom: '20px',
      display: 'flex',
      justifyContent: isMobile ? 'center' : 'flex-start',
    },
    header: {
      fontSize: isMobile ? '24px' : '36px',
      fontWeight: '700',
      background: primaryGradient,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flexWrap: 'wrap',
    },
    headerTitle: {
      margin: 0,
      fontSize: 'inherit',
      fontWeight: 'inherit',
      color: 'inherit',
    },
    subheader: {
      fontSize: isMobile ? '14px' : '18px',
      color: textLight,
      marginBottom: isMobile ? '20px' : '30px',
      borderBottom: `2px solid ${borderColor}`,
      paddingBottom: isMobile ? '12px' : '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    mainContent: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? '24px' : '30px',
    },
    leftColumn: {
      flex: isMobile ? 'none' : 1,
      width: isMobile ? '100%' : 'auto',
    },
    rightColumn: {
      width: isMobile ? '100%' : '380px',
      position: isMobile ? 'relative' : 'sticky',
      top: '20px',
    },
    formSection: {
      backgroundColor: bgWarm,
      borderRadius: '24px',
      padding: isMobile ? '20px' : '30px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    },
    sectionCard: {
      background: bgWhite,
      borderRadius: '16px',
      padding: isMobile ? '16px' : '20px',
      marginBottom: '20px',
      border: `1px solid ${borderColor}`,
    },
    sectionTitle: {
      fontSize: isMobile ? '15px' : '18px',
      fontWeight: '600',
      color: brownColor,
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile
        ? '1fr'
        : 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: '16px',
    },
    tripleGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile
        ? '1fr'
        : 'repeat(auto-fit, minmax(100px, 1fr))',
      gap: '16px',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
    },
    label: {
      fontSize: '12px',
      fontWeight: '600',
      marginBottom: '6px',
      color: textLight,
    },
    input: {
      padding: isMobile ? '10px 12px' : '12px 16px',
      borderRadius: '12px',
      border: `2px solid ${borderColor}`,
      backgroundColor: bgWhite,
      fontSize: '14px',
      outline: 'none',
      width: '100%',
      boxSizing: 'border-box',
      transition: 'border-color 0.3s',
      color: '#292524',
    },
    select: {
      padding: isMobile ? '10px 12px' : '12px 16px',
      borderRadius: '12px',
      border: `2px solid ${borderColor}`,
      backgroundColor: bgWhite,
      fontSize: '14px',
      outline: 'none',
      width: '100%',
      cursor: 'pointer',
      color: '#292524',
    },
    button: {
      width: '100%',
      padding: isMobile ? '14px' : '16px',
      borderRadius: '40px',
      border: 'none',
      background: primaryGradient,
      color: 'white',
      fontWeight: '700',
      fontSize: isMobile ? '14px' : '16px',
      cursor: 'pointer',
      marginTop: '10px',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      boxShadow: `0 10px 20px -5px ${brownColor}60`,
    },
    resetButton: {
      width: '100%',
      padding: isMobile ? '12px' : '14px',
      borderRadius: '40px',
      border: `1px solid ${borderColor}`,
      backgroundColor: bgWhite,
      color: textLight,
      fontWeight: '600',
      fontSize: isMobile ? '13px' : '14px',
      cursor: 'pointer',
      marginTop: '10px',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    resultSection: {
      backgroundColor: bgWarm,
      borderRadius: '24px',
      padding: isMobile ? '20px' : '30px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      transform: isMobile ? 'translateY(-20px)' : 'none',
    },
    resultTitle: {
      fontSize: isMobile ? '16px' : '20px',
      fontWeight: '700',
      marginBottom: '16px',
      color: brownColor,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    resultCard: {
      backgroundColor: bgWhite,
      borderRadius: '16px',
      padding: isMobile ? '16px' : '20px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    },
    resultRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: `1px solid ${borderColor}`,
      gap: '15px',
      flexWrap: 'wrap',
    },
    resultLabel: {
      color: textLight,
      fontSize: isMobile ? '12px' : '13px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    resultValue: {
      fontWeight: '700',
      color: brownColor,
      textAlign: 'right',
      fontSize: isMobile ? '13px' : '14px',
    },
    totalBiaya: {
      marginTop: '20px',
      padding: '16px',
      borderRadius: '16px',
      backgroundColor: brownColor,
      color: 'white',
      textAlign: 'center',
      fontWeight: '700',
      fontSize: isMobile ? '20px' : '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      flexWrap: 'wrap',
    },
    rekomendasi: {
      marginTop: '16px',
      padding: '15px',
      backgroundColor: bgWarm,
      borderRadius: '14px',
      borderLeft: `3px solid ${orangeSoft}`,
      color: '#292524',
      fontSize: isMobile ? '11px' : '13px',
      fontWeight: '600',
      lineHeight: '1.6',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
    },
    emptyState: {
      textAlign: 'center',
      color: textLight,
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
    },
    emptyIcon: {
      fontSize: '64px',
      color: '#D6D3D1',
      marginBottom: '8px',
    },
    emptyText: {
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: '500',
      color: textLight,
      margin: 0,
    },
    emptySubtext: {
      fontSize: isMobile ? '12px' : '14px',
      color: '#A8A29E',
      margin: 0,
    },
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.navWrapper}>
          <NavbarFitur isMobile={isMobile} />
        </div>

        <h1 style={styles.header}>
          <FaCalculator
            size={isMobile ? 24 : 32}
            style={{ color: orangeSoft }}
          />
          <span style={styles.headerTitle}>Kalkulator Cat</span>
        </h1>

        <p style={styles.subheader}>
          <HiSparkles size={isMobile ? 14 : 16} color={textLight} />
          Hitung kebutuhan cat kiloan berdasarkan ukuran ruangan Anda
        </p>

        <div style={styles.mainContent}>
          <div id="fitur-kalkulator" style={styles.leftColumn}>
            <div style={styles.formSection}>
              <div style={styles.sectionCard}>
                <h3 style={styles.sectionTitle}>
                  <FaRulerCombined
                    color={orangeSoft}
                    size={isMobile ? 16 : 18}
                  />
                  Ukuran Ruangan
                </h3>
                <div style={styles.formGrid}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Panjang (m)</label>
                    <input
                      style={styles.input}
                      type="number"
                      step="0.1"
                      value={panjang}
                      onChange={(e) => setPanjang(e.target.value)}
                      placeholder="Contoh: 4"
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = orangeSoft
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${orangeSoft}20`
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = borderColor
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Lebar (m)</label>
                    <input
                      style={styles.input}
                      type="number"
                      step="0.1"
                      value={lebar}
                      onChange={(e) => setLebar(e.target.value)}
                      placeholder="Contoh: 5"
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = orangeSoft
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${orangeSoft}20`
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = borderColor
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Tinggi (m)</label>
                    <input
                      style={styles.input}
                      type="number"
                      step="0.1"
                      value={tinggi}
                      onChange={(e) => setTinggi(e.target.value)}
                      placeholder="Contoh: 3"
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = orangeSoft
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${orangeSoft}20`
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = borderColor
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={styles.sectionCard}>
                <h3 style={styles.sectionTitle}>
                  <FaDoorOpen color={orangeSoft} size={isMobile ? 16 : 18} />
                  Data Pintu
                </h3>
                <div style={styles.tripleGrid}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Jumlah</label>
                    <input
                      style={styles.input}
                      type="number"
                      step="1"
                      value={pintu}
                      onChange={(e) => setPintu(e.target.value)}
                      placeholder="0"
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = orangeSoft
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${orangeSoft}20`
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = borderColor
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Lebar (m)</label>
                    <input
                      style={styles.input}
                      type="number"
                      step="0.1"
                      value={lebarPintu}
                      onChange={(e) => setLebarPintu(e.target.value)}
                      placeholder="0.9"
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = orangeSoft
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${orangeSoft}20`
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = borderColor
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Tinggi (m)</label>
                    <input
                      style={styles.input}
                      type="number"
                      step="0.1"
                      value={tinggiPintu}
                      onChange={(e) => setTinggiPintu(e.target.value)}
                      placeholder="2"
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = orangeSoft
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${orangeSoft}20`
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = borderColor
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={styles.sectionCard}>
                <h3 style={styles.sectionTitle}>
                  <FaWindowMaximize
                    color={orangeSoft}
                    size={isMobile ? 16 : 18}
                  />
                  Data Jendela
                </h3>
                <div style={styles.tripleGrid}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Jumlah</label>
                    <input
                      style={styles.input}
                      type="number"
                      step="1"
                      value={jendela}
                      onChange={(e) => setJendela(e.target.value)}
                      placeholder="0"
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = orangeSoft
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${orangeSoft}20`
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = borderColor
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Lebar (m)</label>
                    <input
                      style={styles.input}
                      type="number"
                      step="0.1"
                      value={lebarJendela}
                      onChange={(e) => setLebarJendela(e.target.value)}
                      placeholder="1.2"
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = orangeSoft
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${orangeSoft}20`
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = borderColor
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Tinggi (m)</label>
                    <input
                      style={styles.input}
                      type="number"
                      step="0.1"
                      value={tinggiJendela}
                      onChange={(e) => setTinggiJendela(e.target.value)}
                      placeholder="1.5"
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = orangeSoft
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${orangeSoft}20`
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = borderColor
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={styles.sectionCard}>
                <h3 style={styles.sectionTitle}>
                  <FaPaintRoller color={orangeSoft} size={isMobile ? 16 : 18} />
                  Pengaturan Cat
                </h3>
                <div style={styles.formGrid}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Jenis Cat</label>
                    <select
                      style={styles.select}
                      value={jenisCat}
                      onChange={(e) => setJenisCat(e.target.value)}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = orangeSoft
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = borderColor
                      }}
                    >
                      {loadingHarga ? (
                        <option value="">Memuat harga...</option>
                      ) : (
                        hargaList.map((item) => {
                          const key = item.jenis
                            .toLowerCase()
                            .replace(/\s+/g, '-')
                          return (
                            <option key={item.id} value={key}>
                              {item.jenis} (Rp{' '}
                              {item.harga_per_kg.toLocaleString('id-ID')}/kg)
                            </option>
                          )
                        })
                      )}
                    </select>
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Lapisan</label>
                    <select
                      style={styles.select}
                      value={lapisan}
                      onChange={(e) => setLapisan(e.target.value)}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = orangeSoft
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = borderColor
                      }}
                    >
                      <option value="1">1 Lapis (Plafon/Banyak Warna)</option>
                      <option value="2">2 Lapis (Standar)</option>
                      <option value="3">3 Lapis (Warna Gelap)</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                style={styles.button}
                onClick={hitungKebutuhan}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = `0 15px 25px -8px ${brownColor}80`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <FaCalculator size={isMobile ? 14 : 16} /> Hitung Kebutuhan Cat
              </button>

              <button
                style={styles.resetButton}
                onClick={resetForm}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = brownColor
                  e.currentTarget.style.color = 'white'
                  e.currentTarget.style.borderColor = brownColor
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = bgWhite
                  e.currentTarget.style.color = textLight
                  e.currentTarget.style.borderColor = borderColor
                }}
              >
                <MdOutlineCleaningServices size={isMobile ? 14 : 16} /> Reset
                Form
              </button>
            </div>
          </div>

          <div ref={resultRef} style={styles.rightColumn}>
            <div style={styles.resultSection}>
              <h2 style={styles.resultTitle}>
                <FaCheckCircle color={orangeSoft} size={isMobile ? 18 : 20} />
                Hasil Perhitungan
              </h2>

              {hasil ? (
                <>
                  <div style={styles.resultCard}>
                    <div style={styles.resultRow}>
                      <span style={styles.resultLabel}>
                        <FaPaintRoller size={12} /> Jenis Cat
                      </span>
                      <span style={styles.resultValue}>{hasil.jenisCat}</span>
                    </div>
                    <div style={styles.resultRow}>
                      <span style={styles.resultLabel}>
                        <FaRulerCombined size={12} /> Luas Dinding Kotor
                      </span>
                      <span style={styles.resultValue}>
                        {hasil.luasDindingKotor} m²
                      </span>
                    </div>
                    {parseFloat(hasil.luasPintu) > 0 && (
                      <div style={styles.resultRow}>
                        <span style={styles.resultLabel}>
                          <FaDoorOpen size={12} /> Luas Pintu
                        </span>
                        <span style={styles.resultValue}>
                          - {hasil.luasPintu} m²
                        </span>
                      </div>
                    )}
                    {parseFloat(hasil.luasJendela) > 0 && (
                      <div style={styles.resultRow}>
                        <span style={styles.resultLabel}>
                          <FaWindowMaximize size={12} /> Luas Jendela
                        </span>
                        <span style={styles.resultValue}>
                          - {hasil.luasJendela} m²
                        </span>
                      </div>
                    )}
                    <div style={styles.resultRow}>
                      <span style={styles.resultLabel}>
                        <FaCheckCircle size={12} /> Luas Dinding Bersih
                      </span>
                      <span style={styles.resultValue}>
                        {hasil.luasDindingBersih} m²
                      </span>
                    </div>
                    <div style={styles.resultRow}>
                      <span style={styles.resultLabel}>
                        <FaCalculator size={12} /> Kebutuhan Cat
                      </span>
                      <span style={styles.resultValue}>
                        {hasil.kebutuhanKg} kg
                      </span>
                    </div>
                    <div style={styles.resultRow}>
                      <span style={styles.resultLabel}>
                        <FaPaintRoller size={12} /> Jumlah Plastik
                      </span>
                      <span style={styles.resultValue}>
                        {hasil.kebutuhanKgBulat} plastik ({hasil.lapisan} lapis)
                      </span>
                    </div>
                    <div style={styles.resultRow}>
                      <span style={styles.resultLabel}>
                        <FaMoneyBillWave size={12} /> Harga per Kg
                      </span>
                      <span style={styles.resultValue}>
                        Rp {hasil.hargaPerKg}
                      </span>
                    </div>
                  </div>

                  <div style={styles.totalBiaya}>
                    <FaMoneyBillWave size={isMobile ? 16 : 20} /> Rp{' '}
                    {hasil.totalBiayaFormatted}
                  </div>

                  <div style={styles.rekomendasi}>
                    <FaInfoCircle size={14} color={orangeSoft} />
                    <div>
                      <strong>📌 Rekomendasi:</strong>
                      <br />• Beli minimal{' '}
                      <strong>{hasil.kebutuhanKgBulat} plastik</strong> cat
                      kiloan
                      <br />
                      • Saran beli 1-2 plastik cadangan untuk antisipasi
                      <br />• Gunakan kuas/roller berkualitas untuk hasil
                      maksimal
                    </div>
                  </div>
                </>
              ) : (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>
                    <FaCalculator size={64} />
                  </div>
                  <p style={styles.emptyText}>Isi form di samping</p>
                  <p style={styles.emptySubtext}>
                    untuk melihat hasil perhitungan
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default KalkulatorPage