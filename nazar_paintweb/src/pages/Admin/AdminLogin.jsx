import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaCheckCircle,
  FaTimes,
  FaLock,
  FaEnvelope,
  FaSpinner,
} from 'react-icons/fa'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'

const GOOGLE_CLIENT_ID =
  '590466406326-3is9ihkrrnk06abthc7kktsicon0qktm.apps.googleusercontent.com'

const ADMIN_EMAILS = ['grecyedl@gmail.com']

// ✅ PASANG PROPS PADA FORGOTPASSWORDMODAL
const ForgotPasswordModal = ({
  showForgotModal,
  setShowForgotModal,
  resetEmail,
  setResetEmail,
  resetMessage,
  setResetMessage,
  resetError,
  setResetError,
  isSendingEmail,
  handleForgotPassword,
  handleGoogleSuccess,
  handleGoogleError,
  isMobile,
  modalStyles,
  textDark,
  textLight,
  orangeColor,
  orangeLight,
  borderColor,
}) => {
  if (!showForgotModal) return null

  return (
    <div
      style={modalStyles.overlay}
      onClick={() => {
        if (!isSendingEmail) {
          setShowForgotModal(false)
          setResetError('')
          setResetMessage('')
          setResetEmail('')
        }
      }}
    >
      <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          style={modalStyles.modalCloseButton}
          onClick={() => {
            if (!isSendingEmail) {
              setShowForgotModal(false)
              setResetError('')
              setResetMessage('')
              setResetEmail('')
            }
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = textDark)}
          onMouseLeave={(e) => (e.currentTarget.style.color = textLight)}
        >
          <FaTimes />
        </button>

        <h2 style={modalStyles.modalTitle}>
          <FaLock size={isMobile ? 20 : 24} /> Lupa Password
        </h2>
        <p style={modalStyles.modalSubtitle}>
          Masukkan email Anda untuk menerima link reset password.
        </p>

        {resetMessage && (
          <div style={modalStyles.successMessage}>
            <FaCheckCircle size={18} />
            {resetMessage}
          </div>
        )}

        {resetError && <div style={modalStyles.errorMessage}>{resetError}</div>}

        <div style={modalStyles.modalInputWrapper}>
          <FaEnvelope style={modalStyles.modalInputIcon} />
          <input
            type="email"
            style={modalStyles.modalInput}
            placeholder="Masukkan email Anda"
            value={resetEmail}
            onChange={(e) => {
              setResetEmail(e.target.value)
              setResetError('')
              setResetMessage('')
            }}
            disabled={isSendingEmail}
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

        <button
          style={modalStyles.modalButton}
          onClick={handleForgotPassword}
          disabled={isSendingEmail}
          onMouseEnter={(e) => {
            if (!isSendingEmail) {
              e.currentTarget.style.backgroundColor = orangeLight
            }
          }}
          onMouseLeave={(e) => {
            if (!isSendingEmail) {
              e.currentTarget.style.backgroundColor = orangeColor
            }
          }}
        >
          {isSendingEmail ? (
            <>
              <FaSpinner
                size={16}
                style={{ animation: 'spin 1s linear infinite' }}
              />{' '}
              Mengirim...
            </>
          ) : (
            <>
              <FaEnvelope size={16} /> Kirim Link Reset
            </>
          )}
        </button>

        <div style={modalStyles.divider}>
          <div style={modalStyles.dividerLine} />
          <span>or sign up using</span>
          <div style={modalStyles.dividerLine} />
        </div>

        <div style={modalStyles.googleWrapper}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            shape="pill"
            size={isMobile ? 'medium' : 'large'}
            text="signin_with"
            locale="id"
          />
        </div>
      </div>
    </div>
  )
}

function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const [showForgotModal, setShowForgotModal] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetMessage, setResetMessage] = useState('')
  const [resetError, setResetError] = useState('')
  const [isSendingEmail, setIsSendingEmail] = useState(false)
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

  const simpanRiwayatLogin = async (adminId, adminName, loginType, detail) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/v1.0/riwayat/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_id: adminId || 1,
          admin_name: adminName || 'Admin',
          aktivitas: 'Login',
          detail: detail || `Login menggunakan ${loginType || 'manual'}`,
        }),
      })
    } catch (err) {
      console.error('Gagal simpan riwayat login:', err)
    }
  }

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      setResetError('Silakan masukkan email Anda')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(resetEmail)) {
      setResetError('Format email tidak valid')
      return
    }

    setResetError('')
    setResetMessage('')
    setIsSendingEmail(true)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1.0/admin/forgot-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: resetEmail }),
        },
      )

      const result = await response.json()

      if (response.ok && result.status === 'success') {
        setResetMessage(
          'Link reset password telah dikirim ke email Anda. Silakan cek inbox atau folder spam.',
        )
        setResetEmail('')
        setTimeout(() => {
          setShowForgotModal(false)
          setResetMessage('')
        }, 4000)
      } else {
        setResetError(
          result.message || 'Email tidak terdaftar atau terjadi kesalahan',
        )
      }
    } catch (err) {
      setResetError('Gagal terhubung ke server. Pastikan backend berjalan.')
    } finally {
      setIsSendingEmail(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1.0/admin/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        },
      )

      const result = await response.json()

      if (response.ok && result.status === 'success') {
        localStorage.setItem('token', result.data.token)
        localStorage.setItem('isAdminLoggedIn', 'true')
        localStorage.setItem('adminName', result.data.admin.name)
        localStorage.setItem('adminEmail', result.data.admin.email)
        localStorage.setItem('adminLoginType', result.data.admin.login_type)
        localStorage.setItem('adminId', result.data.admin.id)

        if (rememberMe) {
          localStorage.setItem('rememberAdmin', 'true')
        }

        await simpanRiwayatLogin(
          result.data.admin.id,
          result.data.admin.name,
          'MANUAL',
          `Login menggunakan MANUAL (username: ${username})`,
        )

        navigate('/admin/dashboard')
      } else {
        setError(result.message || 'Username atau password salah!')
      }
    } catch (err) {
      setError('Gagal terhubung ke server. Pastikan backend berjalan.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const base64Url = credentialResponse.credential.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const payload = JSON.parse(window.atob(base64))

      const { email, name, picture } = payload

      if (ADMIN_EMAILS.includes(email)) {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1.0/admin/login-google`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, name }),
          },
        )

        const result = await response.json()
        localStorage.setItem('isAdminLoggedIn', 'true')
        localStorage.setItem('adminName', name)
        localStorage.setItem('adminEmail', email)
        localStorage.setItem('adminPicture', picture)
        localStorage.setItem('adminLoginType', 'google')
        localStorage.setItem('adminId', '1')

        await simpanRiwayatLogin(
          1,
          name || 'Admin Google',
          'GOOGLE',
          `Login menggunakan GOOGLE (email: ${email})`,
        )

        navigate('/admin/dashboard')
      } else {
        setError(
          `Akses ditolak. Email "${email}" tidak terdaftar sebagai admin.`,
        )
      }
    } catch (err) {
      setError('Gagal memproses login Google. Coba lagi.')
    }
  }

  const handleGoogleError = () => {
    setError('Login Google gagal. Pastikan popup tidak diblokir browser.')
  }

  const modalStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      animation: 'fadeIn 0.3s ease',
    },
    modal: {
      backgroundColor: bgWhite,
      borderRadius: '24px',
      padding: isMobile ? '28px 24px' : '40px',
      maxWidth: '420px',
      width: '100%',
      position: 'relative',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      animation: 'slideUp 0.3s ease',
    },
    modalTitle: {
      fontSize: isMobile ? '20px' : '24px',
      fontWeight: '600',
      color: textDark,
      marginBottom: '8px',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
    },
    modalSubtitle: {
      fontSize: isMobile ? '13px' : '14px',
      color: textLight,
      marginBottom: '24px',
      textAlign: 'center',
    },
    modalInputWrapper: {
      position: 'relative',
      width: '100%',
      marginBottom: '16px',
    },
    modalInput: {
      width: '100%',
      padding: isMobile ? '12px 16px 12px 44px' : '14px 16px 14px 48px',
      fontSize: isMobile ? '14px' : '15px',
      border: `1px solid ${borderColor}`,
      borderRadius: '12px',
      outline: 'none',
      transition: 'all 0.3s',
      boxSizing: 'border-box',
      backgroundColor: bgWhite,
      color: textDark,
    },
    modalInputIcon: {
      position: 'absolute',
      left: isMobile ? '14px' : '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: textLight,
      fontSize: isMobile ? '16px' : '18px',
    },
    modalButton: {
      width: '100%',
      padding: isMobile ? '12px' : '14px',
      backgroundColor: isSendingEmail ? '#D1D5DB' : orangeColor,
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: isMobile ? '15px' : '16px',
      fontWeight: '600',
      cursor: isSendingEmail ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s',
      opacity: isSendingEmail ? 0.7 : 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    modalCloseButton: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      background: 'none',
      border: 'none',
      fontSize: '22px',
      color: textLight,
      cursor: 'pointer',
      padding: '4px 8px',
      borderRadius: '8px',
      transition: 'all 0.3s',
    },
    successMessage: {
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
    errorMessage: {
      color: '#EF4444',
      fontSize: isMobile ? '13px' : '14px',
      padding: '12px',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderRadius: '12px',
      marginBottom: '16px',
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '12px' : '16px',
      margin: isMobile ? '20px 0' : '24px 0',
      color: textLight,
      fontSize: isMobile ? '12px' : '13px',
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      backgroundColor: borderColor,
    },
    googleWrapper: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
    },
  }

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
    optionsRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: isMobile ? '24px' : '28px',
      flexWrap: 'wrap',
      gap: '12px',
    },
    rememberMe: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
    },
    checkbox: {
      width: '16px',
      height: '16px',
      cursor: 'pointer',
      accentColor: orangeColor,
    },
    rememberText: {
      fontSize: isMobile ? '12px' : '13px',
      color: textLight,
    },
    forgotPassword: {
      fontSize: isMobile ? '12px' : '13px',
      color: orangeColor,
      textDecoration: 'none',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      fontWeight: '500',
      transition: 'all 0.3s',
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
      color: '#ef4444',
      fontSize: isMobile ? '12px' : '13px',
      textAlign: 'center',
      marginTop: '12px',
      padding: isMobile ? '8px 12px' : '10px 14px',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderRadius: '12px',
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '12px' : '16px',
      margin: isMobile ? '24px 0' : '28px 0',
      color: textLight,
      fontSize: isMobile ? '12px' : '13px',
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      backgroundColor: borderColor,
    },
    googleWrapper: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
    },
  }

  const animationStyles = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <style>{animationStyles}</style>
      <div style={styles.page}>
        <div style={styles.overlay} />
        <div style={styles.card}>
          <button
            style={styles.backButton}
            onClick={() => navigate('/')}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = orangeColor
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = textLight
            }}
          >
            <FaArrowLeft size={isMobile ? 12 : 14} /> Kembali
          </button>

          <h1 style={styles.title}>Login to continue</h1>
          <p style={styles.subtitle}>Masuk untuk mengelola toko cat</p>

          <form onSubmit={handleLogin}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Username/Email</label>
              <div style={styles.inputWrapper}>
                <input
                  type="text"
                  style={styles.input}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    setError('')
                  }}
                  placeholder="Masukkan username"
                  autoComplete="username"
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

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  style={styles.input}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError('')
                  }}
                  placeholder="Masukkan password"
                  autoComplete="current-password"
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
                >
                  {showPassword ? (
                    <FaEyeSlash size={isMobile ? 18 : 20} />
                  ) : (
                    <FaEye size={isMobile ? 18 : 20} />
                  )}
                </button>
              </div>
            </div>

            <div style={styles.optionsRow}>
              <label style={styles.rememberMe}>
                <input
                  type="checkbox"
                  style={styles.checkbox}
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span style={styles.rememberText}>Remember me</span>
              </label>
              <button
                type="button"
                style={styles.forgotPassword}
                onClick={() => {
                  setShowForgotModal(true)
                  setResetEmail('')
                  setResetError('')
                  setResetMessage('')
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = orangeLight
                  e.currentTarget.style.textDecoration = 'underline'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = orangeColor
                  e.currentTarget.style.textDecoration = 'none'
                }}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              style={styles.button}
              disabled={isLoading}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = orangeLight
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = orangeColor
                }
              }}
            >
              {isLoading ? 'Loading...' : 'Login'}
            </button>
          </form>

          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span>or sign up using</span>
            <div style={styles.dividerLine} />
          </div>

          <div style={styles.googleWrapper}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              shape="pill"
              size={isMobile ? 'medium' : 'large'}
              text="signin_with"
              locale="id"
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}
        </div>
      </div>

      {/* ✅ KIRIMKAN SELURUH STATE & METHOD VIA PROPS */}
      <ForgotPasswordModal
        showForgotModal={showForgotModal}
        setShowForgotModal={setShowForgotModal}
        resetEmail={resetEmail}
        setResetEmail={setResetEmail}
        resetMessage={resetMessage}
        setResetMessage={setResetMessage}
        resetError={resetError}
        setResetError={setResetError}
        isSendingEmail={isSendingEmail}
        handleForgotPassword={handleForgotPassword}
        handleGoogleSuccess={handleGoogleSuccess}
        handleGoogleError={handleGoogleError}
        isMobile={isMobile}
        modalStyles={modalStyles}
        textDark={textDark}
        textLight={textLight}
        orangeColor={orangeColor}
        orangeLight={orangeLight}
        borderColor={borderColor}
      />
    </GoogleOAuthProvider>
  )
}

export default AdminLogin
