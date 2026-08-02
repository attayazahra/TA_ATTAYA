import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { 
  FaEye, 
  FaEyeSlash, 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaArrowLeft,
  FaLock,
  FaInfoCircle,
  FaArrowRight
} from 'react-icons/fa'

function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const orangeColor = '#EA580C'
  const orangeLight = '#F97316'
  const textDark = '#1E293B'
  const textLight = '#64748B'
  const bgWhite = '#FFFFFF'
  const borderColor = '#E2E8F0'

  useEffect(() => {
    if (!token) {
      setError('Token reset password tidak ditemukan')
    }
  }, [token])

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword.length < 6) {
      setError('Password minimal 6 karakter')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:8081/api/v1.0/admin/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          new_password: newPassword,
        }),
      })

      const result = await response.json()

      if (response.ok && result.status === 'success') {
        setSuccess('✅ Password berhasil direset! Silakan login dengan password baru.')
        setTimeout(() => {
          navigate('/admin/login')
        }, 3000)
      } else {
        setError(result.message || 'Gagal reset password. Token mungkin sudah kadaluarsa.')
      }
    } catch (err) {
      setError('Gagal terhubung ke server. Pastikan backend berjalan.')
    } finally {
      setIsLoading(false)
    }
  }

  // ===== STYLES =====
  const styles = {
    page: {
      backgroundImage: 'url(/bg-dashboard5.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '16px' : '20px',
      fontFamily: "'Inter', 'Poppins', sans-serif",
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 0,
    },
    card: {
      maxWidth: isMobile ? '100%' : '440px',
      width: '100%',
      backgroundColor: bgWhite,
      borderRadius: isMobile ? '24px' : '32px',
      padding: isMobile ? '32px 24px' : '40px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      position: 'relative',
      zIndex: 1,
    },
    backButton: {
      position: 'absolute',
      top: isMobile ? '16px' : '20px',
      left: isMobile ? '16px' : '20px',
      backgroundColor: 'transparent',
      border: 'none',
      padding: isMobile ? '5px' : '6px',
      cursor: 'pointer',
      color: textLight,
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'all 0.3s',
      fontSize: isMobile ? '12px' : '13px',
    },
    title: {
      fontSize: isMobile ? '24px' : '28px',
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: isMobile ? '8px' : '10px',
      color: textDark,
      letterSpacing: '-0.5px',
      marginTop: isMobile ? '8px' : '12px',
    },
    subtitle: {
      fontSize: isMobile ? '13px' : '14px',
      color: textLight,
      textAlign: 'center',
      marginBottom: isMobile ? '28px' : '32px',
    },
    inputGroup: {
      marginBottom: isMobile ? '20px' : '24px',
    },
    label: {
      display: 'block',
      fontSize: isMobile ? '13px' : '14px',
      fontWeight: '500',
      color: textDark,
      marginBottom: '8px',
    },
    inputWrapper: {
      position: 'relative',
      width: '100%',
    },
    input: {
      width: '100%',
      padding: isMobile ? '12px 40px 12px 16px' : '14px 45px 14px 16px',
      fontSize: isMobile ? '14px' : '15px',
      border: `1px solid ${borderColor}`,
      borderRadius: '12px',
      outline: 'none',
      transition: 'all 0.3s',
      boxSizing: 'border-box',
      backgroundColor: bgWhite,
      color: textDark,
    },
    eyeButton: {
      position: 'absolute',
      right: isMobile ? '14px' : '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: textLight,
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    button: {
      width: '100%',
      padding: isMobile ? '12px' : '14px',
      backgroundColor: isLoading ? '#D1D5DB' : orangeColor,
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: isMobile ? '15px' : '16px',
      fontWeight: '600',
      cursor: isLoading ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s',
      opacity: isLoading ? 0.7 : 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    error: {
      color: '#EF4444',
      fontSize: isMobile ? '13px' : '14px',
      padding: '12px',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderRadius: '12px',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    success: {
      color: '#10B981',
      fontSize: isMobile ? '13px' : '14px',
      padding: '12px',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderRadius: '12px',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    infoBox: {
      backgroundColor: '#F0F9FF',
      border: `1px solid #BAE6FD`,
      borderRadius: '12px',
      padding: '12px 16px',
      marginBottom: '24px',
      fontSize: isMobile ? '13px' : '14px',
      color: '#0369A1',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    passwordHint: {
      fontSize: isMobile ? '11px' : '12px',
      color: textLight,
      marginTop: '6px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
  }

  // ===== RENDER IF TOKEN NOT FOUND =====
  if (!token) {
    return (
      <div style={styles.page}>
        <div style={styles.overlay} />
        <div style={styles.card}>
          <div style={styles.error}>
            <FaExclamationCircle size={20} />
            <span>Token reset password tidak ditemukan atau sudah kadaluarsa.</span>
          </div>
          <button
            style={styles.button}
            onClick={() => navigate('/admin/login')}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = orangeLight
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = orangeColor
            }}
          >
            <FaArrowLeft size={16} /> Kembali ke Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.overlay} />
      <div style={styles.card}>
        {/* TOMBOL KEMBALI */}
        <button
          style={styles.backButton}
          onClick={() => navigate('/admin/login')}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = orangeColor
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = textLight
          }}
        >
          <FaArrowLeft size={isMobile ? 12 : 14} /> Kembali
        </button>

        <h1 style={styles.title}>
          <FaLock style={{ marginRight: '8px' }} /> Reset Password
        </h1>
        <p style={styles.subtitle}>Buat password baru untuk akun admin</p>

        {/* INFO BOX */}
        <div style={styles.infoBox}>
          <FaInfoCircle size={16} />
          <span><strong>Informasi:</strong> Password baru minimal 6 karakter. Link reset hanya berlaku 1 jam.</span>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div style={styles.error}>
            <FaExclamationCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* SUCCESS MESSAGE */}
        {success && (
          <div style={styles.success}>
            <FaCheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleResetPassword}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password Baru</label>
            <div style={styles.inputWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                style={styles.input}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value)
                  setError('')
                  setSuccess('')
                }}
                placeholder="Minimal 6 karakter"
                disabled={isLoading || success !== ''}
                autoComplete="new-password"
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = orangeColor
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${orangeColor}20`
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = borderColor
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
              <button
                type="button"
                style={styles.eyeButton}
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <FaEyeSlash size={isMobile ? 18 : 20} />
                ) : (
                  <FaEye size={isMobile ? 18 : 20} />
                )}
              </button>
            </div>
            <div style={styles.passwordHint}>
              <FaInfoCircle size={12} /> Gunakan kombinasi huruf, angka, dan simbol untuk keamanan.
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Konfirmasi Password</label>
            <div style={styles.inputWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                style={styles.input}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  setError('')
                  setSuccess('')
                }}
                placeholder="Ulangi password baru"
                disabled={isLoading || success !== ''}
                autoComplete="new-password"
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = orangeColor
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${orangeColor}20`
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = borderColor
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            style={styles.button}
            disabled={isLoading || success !== ''}
            onMouseEnter={(e) => {
              if (!isLoading && !success) {
                e.currentTarget.style.backgroundColor = orangeLight
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading && !success) {
                e.currentTarget.style.backgroundColor = orangeColor
              }
            }}
          >
            {isLoading ? (
              <>
                <FaEyeSlash size={16} /> Memproses...
              </>
            ) : success ? (
              <>
                <FaCheckCircle size={16} /> Berhasil!
              </>
            ) : (
              <>
                <FaLock size={16} /> Reset Password
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword