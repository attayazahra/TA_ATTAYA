import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { FaCalculator, FaPalette, FaMagic, FaUserShield } from 'react-icons/fa'
import { BsCameraFill, BsStars } from 'react-icons/bs'
import { MdCalculate, MdColorLens, MdOutlinePalette } from 'react-icons/md'

function Dashboard() {
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const scrollToFitur = (fiturId) => {
    if (fiturId === 'fitur-kalkulator') {
      navigate('/kalkulator', { state: { scrollTo: 'fitur-kalkulator' } })
    } else if (fiturId === 'fitur-rekomendasi') {
      navigate('/rekomendasi', { state: { scrollTo: 'fitur-rekomendasi' } })
    } else if (fiturId === 'fitur-simulasi') {
      navigate('/warna', { state: { scrollTo: 'fitur-katalog' } })
    }
  }

  const styles = {
    page: {
      backgroundImage: 'url(/bg-dashboard5.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      width: '100%',
      fontFamily: "'Inter', 'Poppins', system-ui, sans-serif",
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
    },

    // ===== HEADER =====
    header: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: isMobile ? '16px 16px' : '30px 40px',
    },
    logo: {
      fontSize: isMobile ? '28px' : '52px',
      fontWeight: '700',
      color: 'white',
      letterSpacing: '-0.02em',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },

    // ===== HERO SECTION =====
    hero: {
      padding: isMobile ? '20px 16px' : '60px 40px',
      textAlign: 'center',
      flex: 1,
    },
    heroContent: {
      maxWidth: '900px',
      margin: '0 auto',
    },
    heroBadge: {
      display: 'inline-block',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(10px)',
      padding: isMobile ? '8px 20px' : '12px 32px', // ← DIPERBESAR
      borderRadius: '50px',
      fontSize: isMobile ? '14px' : '18px', // ← DIPERBESAR
      fontWeight: '600',
      color: 'white',
      marginBottom: isMobile ? '20px' : '32px',
      letterSpacing: '0.3px',
    },
    heroTitle: {
      fontSize: isMobile ? '28px' : '58px',
      fontWeight: '800',
      color: 'white',
      marginBottom: isMobile ? '16px' : '24px',
      lineHeight: isMobile ? '1.3' : '1.2',
      letterSpacing: '-0.5px',
      padding: isMobile ? '0 8px' : '0',
    },
    heroHighlight: {
      background: 'linear-gradient(135deg, #fff 0%, #a5f3fc 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    heroSubtitle: {
      fontSize: isMobile ? '15px' : '20px',
      color: 'rgba(255, 255, 255, 0.85)',
      marginBottom: isMobile ? '36px' : '64px',
      maxWidth: '650px',
      margin: `0 auto ${isMobile ? '36px' : '64px'}`,
      lineHeight: isMobile ? '1.5' : '1.6',
      padding: isMobile ? '0 12px' : '0',
    },
    heroButtons: {
      display: 'flex',
      gap: isMobile ? '12px' : '24px',
      justifyContent: 'center',
      flexWrap: 'wrap',
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: 'center',
    },
    heroButtonPrimary: {
      padding: isMobile ? '10px 24px' : '16px 40px',
      backgroundColor: 'white',
      border: 'none',
      borderRadius: '50px',
      fontSize: isMobile ? '13px' : '16px',
      fontWeight: '600',
      color: '#1a1a2e',
      cursor: 'pointer',
      transition: 'all 0.3s',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      width: isMobile ? '100%' : 'auto',
      maxWidth: isMobile ? '220px' : 'auto',
    },
    heroButtonSecondary: {
      padding: isMobile ? '10px 24px' : '16px 40px',
      backgroundColor: 'transparent',
      border: '2px solid white',
      borderRadius: '50px',
      fontSize: isMobile ? '13px' : '16px',
      fontWeight: '600',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.3s',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      width: isMobile ? '100%' : 'auto',
      maxWidth: isMobile ? '220px' : 'auto',
    },

    features: {
      padding: isMobile ? '20px 16px 30px' : '10px 40px 50px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      marginTop: isMobile ? '0' : '20px',
    },
    sectionTitle: {
      textAlign: 'center',
      fontSize: isMobile ? '22px' : '32px',
      fontWeight: '700',
      color: 'white',
      marginBottom: isMobile ? '10px' : '16px',
    },
    sectionSubtitle: {
      textAlign: 'center',
      fontSize: isMobile ? '12px' : '16px',
      color: 'rgba(255, 255, 255, 0.7)',
      marginBottom: isMobile ? '25px' : '40px',
      maxWidth: '600px',
      marginLeft: 'auto',
      marginRight: 'auto',
      padding: isMobile ? '0 8px' : '0',
      lineHeight: '1.5',
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
      gap: isMobile ? '14px' : '24px',
      maxWidth: '1100px',
      margin: '0 auto',
    },
    featureCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(16px)',
      borderRadius: isMobile ? '16px' : '24px',
      padding: isMobile ? '18px 14px' : '28px 24px',
      textAlign: 'center',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    featureIcon: {
      fontSize: isMobile ? '32px' : '48px',
      marginBottom: isMobile ? '10px' : '16px',
      color: 'white',
    },
    featureTitle: {
      fontSize: isMobile ? '15px' : '20px',
      fontWeight: '600',
      color: 'white',
      marginBottom: isMobile ? '5px' : '10px',
    },
    featureDesc: {
      fontSize: isMobile ? '11px' : '14px',
      color: 'rgba(255, 255, 255, 0.7)',
      lineHeight: '1.5',
      padding: isMobile ? '0' : '0',
    },

    // ===== FOOTER =====
    footer: {
      padding: isMobile ? '30px 16px' : '40px 40px 35px',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    footerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: isMobile ? '20px' : '0',
    },
    footerLeft: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: isMobile ? 'center' : 'flex-start',
      gap: '8px',
    },
    adminButton: {
      background:
        'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '40px',
      padding: isMobile ? '10px 24px' : '12px 32px',
      fontSize: isMobile ? '13px' : '14px',
      fontWeight: '600',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.3s',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
    },
    footerBottom: {
      textAlign: 'center',
      paddingTop: isMobile ? '20px' : '25px',
      marginTop: isMobile ? '20px' : '25px',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      fontSize: isMobile ? '10px' : '12px',
      color: 'rgba(255, 255, 255, 0.4)',
    },
  }

  // ===== URUTAN CARD: Kalkulator, Rekomendasi, Simulasi =====
  const features = [
    {
      id: 'kalkulator',
      icon: <FaCalculator />,
      title: 'Kalkulator Cat',
      desc: 'Hitung kebutuhan cat berdasarkan ukuran ruangan secara akurat dan mudah.',
      action: () => scrollToFitur('fitur-kalkulator'),
    },
    {
      id: 'rekomendasi',
      icon: <FaMagic />,
      title: 'Rekomendasi Warna',
      desc: 'Dapatkan saran warna terbaik sesuai dengan suasana ruangan yang Anda inginkan.',
      action: () => scrollToFitur('fitur-rekomendasi'),
    },
    {
      id: 'simulasi',
      icon: <FaPalette />,
      title: 'Katalog & Simulasi',
      desc: 'Lihat berbagai pilihan warna dan simulasi langsung di foto ruangan Anda.',
      action: () => scrollToFitur('fitur-simulasi'),
    },
  ]

  return (
    <div style={styles.page}>
      <div style={styles.overlay}>
        {/* HEADER */}
        <div style={styles.header}>
          <div
            style={styles.logo}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img
              src="/logo-header.png"
              alt="Nazar Paint"
              style={{ height: isMobile ? '48px' : '90px', width: 'auto' }}
            />
          </div>
        </div>

        {/* HERO SECTION */}
        <section style={styles.hero}>
          <div style={styles.heroContent}>
            <div style={styles.heroBadge}>
              <BsStars
                size={isMobile ? 14 : 18}
                style={{ display: 'inline', marginRight: '6px' }}
              />
              Teknologi Simulasi Generasi Terbaru
            </div>
            <h1 style={styles.heroTitle}>
              Hitung Kebutuhan Cat <br />
              <span style={styles.heroHighlight}>Secara Akurat</span> dan
              Simulasikan <br />
              Warna Ruangan Anda
            </h1>
            <p style={styles.heroSubtitle}>
              Hadirkan keindahan hunian impian dengan estimasi material yang
              tepat dan visualisasi warna yang realistik sebelum Anda mulai
              mengecat.
            </p>
            <div style={styles.heroButtons}>
              <button
                style={styles.heroButtonPrimary}
                onClick={() => scrollToFitur('fitur-kalkulator')}
                onMouseEnter={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.transform = 'translateY(-3px)'
                    e.currentTarget.style.boxShadow =
                      '0 15px 30px rgba(0,0,0,0.2)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }
                }}
              >
                <MdCalculate size={isMobile ? 14 : 18} /> Mulai Hitung
              </button>
              <button
                style={styles.heroButtonSecondary}
                onClick={() => scrollToFitur('fitur-simulasi')}
                onMouseEnter={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.transform = 'translateY(-3px)'
                    e.currentTarget.style.backgroundColor =
                      'rgba(255,255,255,0.25)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }
                }}
              >
                <BsCameraFill size={isMobile ? 13 : 16} /> Coba Simulasi
              </button>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section style={styles.features}>
          <h2 style={styles.sectionTitle}>Fitur Sistem Nazar Paint</h2>
          <p style={styles.sectionSubtitle}>
            Menyediakan rekomendasi kebutuhan material sebagai pendukung
            perencanaan pengecatan.
          </p>
          <div style={styles.featuresGrid}>
            {features.map((feature) => (
              <div
                key={feature.id}
                style={styles.featureCard}
                onClick={feature.action}
                onMouseEnter={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.transform = 'translateY(-5px)'
                    e.currentTarget.style.backgroundColor =
                      'rgba(255, 255, 255, 0.15)'
                    e.currentTarget.style.borderColor =
                      'rgba(255, 255, 255, 0.3)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.backgroundColor =
                      'rgba(255, 255, 255, 0.08)'
                    e.currentTarget.style.borderColor =
                      'rgba(255, 255, 255, 0.12)'
                  }
                }}
              >
                <div style={styles.featureIcon}>{feature.icon}</div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDesc}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer style={styles.footer}>
          <div style={styles.footerContent}>
            <div style={styles.footerLeft}></div>
            <button
              style={styles.adminButton}
              onClick={() => navigate('/admin/login')}
              onMouseEnter={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }
              }}
            >
              <FaUserShield size={isMobile ? 13 : 15} />
              <span>Admin Panel</span>
            </button>
          </div>
          <div style={styles.footerBottom}>
            © 2024 Nazar Paint. All rights reserved. Precision in every drop.
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Dashboard
