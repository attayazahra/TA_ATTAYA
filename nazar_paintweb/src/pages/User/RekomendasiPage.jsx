import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  getRekomendasi,
  ruanganOptions,
  suasanaOptions,
} from '../../utils/rekomendasiRules'

import { FiSearch, FiCheck, FiSave, FiX } from 'react-icons/fi'
import { MdColorLens, MdMeetingRoom } from 'react-icons/md'
import { HiSparkles } from 'react-icons/hi'
import { BsGrid3X3Gap, BsDropletHalf } from 'react-icons/bs'
import { TbMoodSmile } from 'react-icons/tb'
import { getSessionId } from '../../utils/session'
import Swal from 'sweetalert2'
import NavbarFitur from '../../components/NavbarFitur'

function RekomendasiPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [ruangan, setRuangan] = useState('Kamar Tidur')
  const [ruanganLainnya, setRuanganLainnya] = useState('')
  const [suasana, setSuasana] = useState('Calming')
  const [rekomendasi, setRekomendasi] = useState([])
  const [selectedWarna, setSelectedWarna] = useState([])
  const [isSaving, setIsSaving] = useState(false)
  const [showModalLainnya, setShowModalLainnya] = useState(false)

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (location.state?.scrollTo === 'fitur-rekomendasi') {
      const element = document.getElementById('fitur-rekomendasi')
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 300)
      }
    }
  }, [location])

  const brownColor = '#78350F'
  const brownLight = '#92400E'
  const orangeSoft = '#D97706'
  const textDark = '#292524'
  const textLight = '#78716C'
  const bgWhite = '#FFFFFF'
  const bgWarm = '#FEFCE8'
  const borderColor = '#E7E5E4'

  const primaryGradient = `linear-gradient(135deg, ${brownColor} 0%, ${brownLight} 50%, ${orangeSoft} 100%)`
  const secondaryGradient = `linear-gradient(135deg, ${brownLight} 0%, ${orangeSoft} 100%)`

  const getSuasanaUntukLainnya = () => {
    return ['Calming', 'Energetic', 'Natural', 'Modern', 'Classic', 'Cozy', 'Fresh']
  }

  const suasanaOptionsUntukLainnya = getSuasanaUntukLainnya()

  const isRuanganCustom = ruangan !== 'Lainnya' && !ruanganOptions.includes(ruangan)

  const displayOptions = isRuanganCustom ? [...ruanganOptions, ruangan] : ruanganOptions

  const simpanRiwayatRekomendasi = async (namaRuangan, suasana, hasilRekomendasi, warnaDipilih) => {
    try {
      const sessionId = await getSessionId()

      const warnaDirekomendasikan = JSON.stringify(hasilRekomendasi.map(w => w.nama))
      const warnaDipilihStr = warnaDipilih.join(', ')

      const response = await fetch('http://localhost:8081/api/v1.0/riwayat/rekomendasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          jenis_ruangan: namaRuangan,
          suasana: suasana,
          warna_direkomendasikan: warnaDirekomendasikan,
          warna_dipilih: warnaDipilihStr,
        }),
      })

      const result = await response.json()

      if (result.status !== 'success') {
        throw new Error(result.message || 'Gagal menyimpan')
      }

      return result
    } catch (error) {
      console.error('Gagal simpan riwayat rekomendasi:', error)
      throw error
    }
  }

  const toggleWarna = (warna) => {
    setSelectedWarna(prev => {
      const isSelected = prev.some(w => w.id === warna.id)
      if (isSelected) {
        return prev.filter(w => w.id !== warna.id)
      } else {
        return [...prev, warna]
      }
    })
  }

  const handleSimpanPilihan = async () => {
    if (selectedWarna.length === 0) {
      Swal.fire({
        title: 'Error!',
        text: 'Pilih minimal satu warna!',
        icon: 'error',
        confirmButtonColor: '#EA580C',
      })
      return
    }

    Swal.fire({
      title: 'Simpan Pilihan?',
      text: selectedWarna.length + ' warna akan disimpan.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#64748B',
      confirmButtonText: 'Ya, Simpan!',
      cancelButtonText: 'Batal',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsSaving(true)
        try {
          await simpanRiwayatRekomendasi(
            ruangan,
            suasana,
            rekomendasi,
            selectedWarna.map(w => w.nama)
          )

          Swal.fire({
            title: 'Berhasil!',
            text: selectedWarna.length + ' warna berhasil disimpan!',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
          })

          setSelectedWarna([])
        } catch (error) {
          Swal.fire({
            title: 'Error!',
            text: 'Gagal menyimpan riwayat rekomendasi. Silakan coba lagi.',
            icon: 'error',
            confirmButtonColor: '#EA580C',
          })
        } finally {
          setIsSaving(false)
        }
      }
    })
  }

  const handleHapusPilihan = () => {
    if (selectedWarna.length === 0) return

    Swal.fire({
      title: 'Hapus Semua Pilihan?',
      text: selectedWarna.length + ' warna akan dihapus dari pilihan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748B',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedWarna([])
        Swal.fire({
          title: 'Berhasil!',
          text: 'Semua pilihan warna dihapus.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false,
        })
      }
    })
  }

  const handleCariRekomendasi = () => {
    const hasil = getRekomendasi(ruangan, suasana)
    setRekomendasi(hasil)
    setSelectedWarna([])
  }

  // Dropdown "Jenis Ruangan" dipilih pelanggan
  const handleRuanganChange = (e) => {
    const selected = e.target.value

    if (selected === 'Lainnya') {
      // Cuma buka modal, JANGAN ubah ruangan/suasana dulu.
      // Kalau modal di-cancel, dropdown otomatis balik ke nilai
      // sebelumnya karena value={ruangan} tidak pernah berubah.
      setShowModalLainnya(true)
      return
    }

    setRuangan(selected)
    setSuasana(suasanaOptions[selected]?.[0] || 'Calming')
  }

  const styles = {
    page: {
      background: secondaryGradient,
      minHeight: '100vh',
      padding: isMobile ? '12px' : '20px',
      fontFamily: "'Inter', 'Poppins', system-ui, sans-serif",
    },
    card: {
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: 'rgba(255, 255, 255, 0.96)',
      backdropFilter: 'blur(10px)',
      borderRadius: isMobile ? '24px' : '40px',
      boxShadow: `0 30px 60px -15px ${brownColor}40`,
      padding: isMobile ? '20px' : '40px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    navWrapper: {
      marginBottom: '16px',
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
      gap: '10px',
      flexWrap: 'wrap',
    },
    subheader: {
      fontSize: isMobile ? '14px' : '18px',
      color: textLight,
      marginBottom: isMobile ? '16px' : '24px',
      borderBottom: `2px solid ${borderColor}`,
      paddingBottom: isMobile ? '12px' : '20px',
    },
    formContainer: {
      background: bgWarm,
      borderRadius: isMobile ? '20px' : '24px',
      padding: isMobile ? '8px 20px 20px 20px' : '12px 30px 30px 30px',
      marginBottom: isMobile ? '24px' : '40px',
      boxShadow: `0 10px 30px -10px ${brownColor}20`,
    },
    formTitle: {
      fontSize: isMobile ? '16px' : '20px',
      fontWeight: '600',
      marginBottom: '12px',
      marginTop: isMobile ? '4px' : '0',
      color: brownColor,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: '20px',
      marginBottom: '24px',
      alignItems: 'start',
    },
    formGroup: {
      flex: 1,
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: isMobile ? '13px' : '14px',
      fontWeight: '600',
      color: textLight,
      marginBottom: '8px',
    },
    select: {
      width: '100%',
      padding: isMobile ? '12px 14px' : '12px 16px',
      fontSize: isMobile ? '15px' : '16px',
      border: `2px solid ${borderColor}`,
      borderRadius: '12px',
      backgroundColor: 'white',
      transition: 'all 0.3s',
      outline: 'none',
      cursor: 'pointer',
      color: textDark,
    },
    input: {
      width: '100%',
      padding: isMobile ? '12px 14px' : '12px 16px',
      fontSize: isMobile ? '15px' : '16px',
      border: `2px solid ${borderColor}`,
      borderRadius: '12px',
      backgroundColor: 'white',
      transition: 'all 0.3s',
      outline: 'none',
      color: textDark,
    },
    button: {
      width: isMobile ? '100%' : 'auto',
      padding: isMobile ? '14px 20px' : '14px 30px',
      background: primaryGradient,
      color: 'white',
      border: 'none',
      borderRadius: '40px',
      fontSize: isMobile ? '15px' : '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s',
      boxShadow: `0 10px 20px -5px ${brownColor}60`,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    buttonSave: {
      width: isMobile ? '100%' : 'auto',
      padding: isMobile ? '14px 20px' : '14px 30px',
      background: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '40px',
      fontSize: isMobile ? '15px' : '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s',
      boxShadow: '0 10px 20px -5px rgba(16, 185, 129, 0.5)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    buttonClear: {
      width: isMobile ? '100%' : 'auto',
      padding: isMobile ? '14px 20px' : '14px 30px',
      background: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '40px',
      fontSize: isMobile ? '15px' : '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s',
      boxShadow: '0 10px 20px -5px rgba(239, 68, 68, 0.5)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    buttonRow: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap',
      marginTop: '16px',
    },
    resultSection: {
      marginTop: isMobile ? '24px' : '40px',
    },
    resultTitle: {
      fontSize: isMobile ? '18px' : '24px',
      fontWeight: '600',
      color: brownColor,
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    warnaGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile
        ? 'repeat(auto-fill, minmax(150px, 1fr))'
        : 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: isMobile ? '12px' : '20px',
    },
    warnaCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: isMobile ? '12px' : '20px',
      cursor: 'pointer',
      border: `2px solid transparent`,
      transition: 'all 0.3s',
      boxShadow: `0 4px 6px -1px ${brownColor}15`,
      position: 'relative',
    },
    warnaCardSelected: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: isMobile ? '12px' : '20px',
      cursor: 'pointer',
      border: `2px solid #10b981`,
      transition: 'all 0.3s',
      boxShadow: `0 4px 12px -1px rgba(16, 185, 129, 0.3)`,
      position: 'relative',
    },
    checkMark: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      background: '#10b981',
      color: 'white',
      borderRadius: '50%',
      width: '24px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
    },
    warnaBox: {
      width: '100%',
      height: isMobile ? '100px' : '140px',
      borderRadius: '12px',
      marginBottom: '12px',
      border: `1px solid ${borderColor}`,
    },
    warnaNomor: {
      fontSize: isMobile ? '10px' : '11px',
      fontWeight: '700',
      color: textLight,
      marginBottom: '3px',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      fontFamily: 'monospace',
    },
    warnaNama: {
      fontSize: isMobile ? '13px' : '16px',
      fontWeight: '600',
      color: brownColor,
      marginBottom: '4px',
    },
    warnaKode: {
      fontSize: isMobile ? '11px' : '13px',
      color: textLight,
      marginBottom: '4px',
      fontFamily: 'monospace',
    },
    emptyState: {
      textAlign: 'center',
      color: textLight,
      padding: isMobile ? '40px 20px' : '60px 20px',
      fontSize: isMobile ? '13px' : '16px',
      background: 'white',
      borderRadius: '24px',
    },
    selectedInfo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      background: `${brownColor}10`,
      borderRadius: '12px',
      marginBottom: '16px',
      flexWrap: 'wrap',
      gap: '10px',
    },
    selectedCount: {
      fontSize: isMobile ? '13px' : '14px',
      fontWeight: '600',
      color: brownColor,
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '24px',
      padding: isMobile ? '24px' : '32px',
      maxWidth: '450px',
      width: '100%',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
      position: 'relative',
    },
    modalTitle: {
      fontSize: isMobile ? '18px' : '22px',
      fontWeight: '700',
      color: brownColor,
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    modalSubtitle: {
      fontSize: isMobile ? '13px' : '14px',
      color: textLight,
      marginBottom: '20px',
    },
    modalInput: {
      width: '100%',
      padding: isMobile ? '12px 14px' : '12px 16px',
      fontSize: isMobile ? '15px' : '16px',
      border: `2px solid ${borderColor}`,
      borderRadius: '12px',
      backgroundColor: 'white',
      transition: 'all 0.3s',
      outline: 'none',
      color: textDark,
      marginBottom: '16px',
      boxSizing: 'border-box',
    },
    modalButtonRow: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
    },
    modalButtonSave: {
      padding: isMobile ? '10px 20px' : '12px 28px',
      background: primaryGradient,
      color: 'white',
      border: 'none',
      borderRadius: '40px',
      fontSize: isMobile ? '14px' : '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s',
    },
    modalButtonCancel: {
      padding: isMobile ? '10px 20px' : '12px 28px',
      background: '#e2e8f0',
      color: textLight,
      border: 'none',
      borderRadius: '40px',
      fontSize: isMobile ? '14px' : '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s',
    },
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.navWrapper}>
          <NavbarFitur isMobile={isMobile} />
        </div>

        <h1 style={styles.header}>
          <HiSparkles size={isMobile ? 28 : 36} style={{ color: orangeSoft }} />
          Rekomendasi Warna
        </h1>
        <p style={styles.subheader}>
          Dapatkan saran warna cat sesuai dengan ruangan Anda
        </p>

        <div id="fitur-rekomendasi" style={styles.formContainer}>
          <h3 style={styles.formTitle}>
            <BsGrid3X3Gap size={isMobile ? 16 : 20} color={orangeSoft} />
            Pilih Karakteristik Ruangan
          </h3>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <MdMeetingRoom size={isMobile ? 13 : 15} /> Jenis Ruangan
              </label>
              <select
                style={styles.select}
                value={ruangan}
                onChange={handleRuanganChange}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = orangeSoft
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${orangeSoft}20`
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = borderColor
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {displayOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <TbMoodSmile size={isMobile ? 13 : 15} /> Suasana Ruangan
              </label>
              <select
                style={styles.select}
                value={suasana}
                onChange={(e) => setSuasana(e.target.value)}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = orangeSoft
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${orangeSoft}20`
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = borderColor
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {(isRuanganCustom ? suasanaOptionsUntukLainnya : suasanaOptions[ruangan] || []).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            style={styles.button}
            onClick={handleCariRekomendasi}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = `0 15px 25px -8px ${brownColor}80`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = `0 10px 20px -5px ${brownColor}60`
            }}
          >
            <FiSearch size={isMobile ? 14 : 16} /> Cari Rekomendasi Warna
          </button>
        </div>

        <div style={styles.resultSection}>
          <h3 style={styles.resultTitle}>
            <MdColorLens size={isMobile ? 20 : 24} color={orangeSoft} />
            Rekomendasi Warna
          </h3>

          {rekomendasi.length > 0 ? (
            <>
              <div style={styles.selectedInfo}>
                <span style={styles.selectedCount}>
                  <FiCheck size={16} style={{ marginRight: '6px' }} />
                  {selectedWarna.length} warna dipilih
                </span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    style={styles.buttonSave}
                    onClick={handleSimpanPilihan}
                    disabled={isSaving || selectedWarna.length === 0}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <FiSave size={isMobile ? 14 : 16} />
                    {isSaving ? 'Menyimpan...' : 'Simpan Pilihan'}
                  </button>
                  {selectedWarna.length > 0 && (
                    <button
                      style={styles.buttonClear}
                      onClick={handleHapusPilihan}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                    >
                      <FiX size={isMobile ? 14 : 16} /> Hapus Semua
                    </button>
                  )}
                </div>
              </div>

              <div style={styles.warnaGrid}>
                {rekomendasi.map((warna) => {
                  const isSelected = selectedWarna.some(w => w.id === warna.id)
                  return (
                    <div
                      key={warna.id}
                      style={isSelected ? styles.warnaCardSelected : styles.warnaCard}
                      onClick={() => toggleWarna(warna)}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.transform = 'translateY(-4px)'
                          e.currentTarget.style.borderColor = orangeSoft
                          e.currentTarget.style.boxShadow = `0 12px 20px -8px ${brownColor}30`
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.borderColor = 'transparent'
                          e.currentTarget.style.boxShadow = `0 4px 6px -1px ${brownColor}15`
                        }
                      }}
                    >
                      <div
                        style={{
                          ...styles.warnaBox,
                          backgroundColor: warna.kode_hex,
                        }}
                      />
                      <p style={styles.warnaNomor}>{warna.nomor_seri}</p>
                      <p style={styles.warnaNama}>{warna.nama}</p>
                      <p style={styles.warnaKode}>{warna.kode_hex}</p>
                      {isSelected && (
                        <div style={styles.checkMark}>
                          <FiCheck size={14} />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <div style={styles.emptyState}>
              <BsDropletHalf
                size={isMobile ? 36 : 48}
                style={{ color: textLight, marginBottom: '12px' }}
              />
              <p>
                Pilih ruangan dan suasana
                <br />
                untuk mendapatkan rekomendasi
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ===== MODAL UNTUK RUANGAN LAINNYA ===== */}
      {showModalLainnya && (
        <div style={styles.modalOverlay} onClick={() => setShowModalLainnya(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>
              <MdMeetingRoom size={24} color={orangeSoft} />
              Nama Ruangan Lainnya
            </h3>
            <p style={styles.modalSubtitle}>
              Silakan masukkan nama ruangan yang Anda inginkan.
            </p>
            <input
              type="text"
              style={styles.modalInput}
              placeholder="Contoh: Ruang Makan, Garasi, Gudang, dll"
              value={ruanganLainnya}
              onChange={(e) => setRuanganLainnya(e.target.value)}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = orangeSoft
                e.currentTarget.style.boxShadow = `0 0 0 3px ${orangeSoft}20`
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = borderColor
                e.currentTarget.style.boxShadow = 'none'
              }}
              autoFocus
            />
            <div style={styles.modalButtonRow}>
              <button
                style={styles.modalButtonCancel}
                onClick={() => setShowModalLainnya(false)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#cbd5e1'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#e2e8f0'
                }}
              >
                Batal
              </button>
              <button
                style={styles.modalButtonSave}
                onClick={() => {
                  const namaBaru = ruanganLainnya.trim()
                  if (!namaBaru) {
                    Swal.fire({
                      title: 'Nama Ruangan Kosong!',
                      text: 'Silakan masukkan nama ruangan Anda.',
                      icon: 'info',
                      confirmButtonColor: '#EA580C',
                    })
                    return
                  }
                  setRuanganLainnya(namaBaru)
                  setRuangan(namaBaru)
                  setSuasana(suasanaOptionsUntukLainnya[0])
                  setShowModalLainnya(false)
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RekomendasiPage
