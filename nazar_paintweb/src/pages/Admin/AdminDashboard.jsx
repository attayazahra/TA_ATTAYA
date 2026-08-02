import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import warnaDataOriginal from '../../data/warnaData'
import hargaCatData from '../../data/hargaData'
import AdminTopBar from './AdminTopBar'
import AdminBottomNav from './AdminBottomNav'
import StokTab from './StokTab'
import HargaTab from './HargaTab'
import TambahWarnaTab from './TambahWarnaTab'
import ProfileTab from './ProfileTab'
import EditWarnaModal from './EditWarnaModal'
import KelolaAturanRek from './KelolaAturanRek'
import RiwayatTab from './RiwayatTab'


function AdminDashboard() {
  const navigate = useNavigate()
  const [warnaList, setWarnaList] = useState([])
  const [hargaList, setHargaList] = useState(hargaCatData)
  const [activeTab, setActiveTab] = useState('stok')
  const [showEditModal, setShowEditModal] = useState(false)
  const [editWarna, setEditWarna] = useState(null)
  const [adminProfile, setAdminProfile] = useState({
    name: 'Admin',
    email: '',
    picture: '',
    loginType: 'manual',
  })
  const [profilePicture, setProfilePicture] = useState(null)
  const [filterKategori, setFilterKategori] = useState('Semua')
  const [searchTerm, setSearchTerm] = useState('')
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [formData, setFormData] = useState({
    nomor_seri: '',
    nama: '',
    kode_hex: '#',
    kategori: 'Netral',
    tersedia: true,
  })
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn')
    if (!isLoggedIn) {
      navigate('/admin/login')
      return
    }

    const savedName = localStorage.getItem('adminName')
    const savedEmail = localStorage.getItem('adminEmail')
    const savedPicture = localStorage.getItem('adminPicture')
    const savedLoginType = localStorage.getItem('adminLoginType') || 'manual'

    setAdminProfile({
      name: savedName || 'Admin',
      email: savedEmail || '',
      picture: savedPicture || '',
      loginType: savedLoginType,
    })
    setProfilePicture(savedPicture || null)

    const savedWarna = localStorage.getItem('warnaData')
    setWarnaList(savedWarna ? JSON.parse(savedWarna) : warnaDataOriginal)

    const savedHarga = localStorage.getItem('hargaCat')
    if (savedHarga) setHargaList(JSON.parse(savedHarga))
  }, [navigate])

  useEffect(() => {
    if (warnaList.length > 0) {
      localStorage.setItem('warnaData', JSON.stringify(warnaList))
    }
  }, [warnaList])

  useEffect(() => {
    localStorage.setItem('hargaCat', JSON.stringify(hargaList))
  }, [hargaList])

  // ===== SIMPAN RIWAYAT ADMIN =====
  const simpanRiwayatAdmin = async (aktivitas, detail) => {
    try {
      const adminName = localStorage.getItem('adminName') || 'Admin'
      const adminId = localStorage.getItem('adminId') || 1
      
      await fetch(`${import.meta.env.VITE_API_URL}/api/v1.0/riwayat/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_id: parseInt(adminId),
          admin_name: adminName,
          aktivitas: aktivitas,
          detail: detail,
        }),
      })
    } catch (error) {
      console.error('Gagal simpan riwayat:', error)
    }
  }

  // ===== LOGOUT =====
  const handleLogout = async () => {
    localStorage.clear();
    simpanRiwayatAdmin('Logout', 'Logout dari sistem').catch(() => {});
    navigate('/admin/login', { replace: true });
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  // ===== UBAH NAMA PROFIL =====
  const handleSaveName = async (newName) => {
    const oldName = adminProfile.name
    await simpanRiwayatAdmin('Ubah Profil', `Mengubah nama profil dari "${oldName}" menjadi "${newName}"`)
    setAdminProfile((p) => ({ ...p, name: newName }))
    localStorage.setItem('adminName', newName)
  }

  // ===== UBAH FOTO PROFIL =====
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = async () => {
      setProfilePicture(reader.result)
      localStorage.setItem('adminPicture', reader.result)
      setAdminProfile((p) => ({ ...p, picture: reader.result }))
      await simpanRiwayatAdmin('Ubah Profil', 'Mengubah foto profil')
    }
    reader.readAsDataURL(file)
  }

  // ===== UPDATE HARGA =====
  const handleUpdateHarga = async (jenis, hargaBaru) => {
    const harga = parseInt(hargaBaru)
    if (isNaN(harga) || harga < 0) {
      Swal.fire({
        title: 'Error!',
        text: 'Masukkan harga yang valid!',
        icon: 'error',
        confirmButtonColor: '#EA580C',
      })
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1.0/harga/${encodeURIComponent(jenis)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ harga_per_kg: harga }),
      })

      const result = await response.json()
      if (result.status === 'success') {
        const oldHarga = hargaList[jenis]?.harga || 0
        await simpanRiwayatAdmin('Ubah Harga', `Mengubah harga ${jenis} dari Rp ${oldHarga.toLocaleString()} menjadi Rp ${harga.toLocaleString()}/kg`)
        
        Swal.fire({
          title: 'Berhasil!',
          text: 'Harga berhasil diupdate!',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        })
        
        setHargaList((h) => ({ ...h, [jenis]: { ...h[jenis], harga } }))
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Gagal mengupdate harga: ' + (result.message || ''),
          icon: 'error',
          confirmButtonColor: '#EA580C',
        })
      }
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: 'Gagal terhubung ke server',
        icon: 'error',
        confirmButtonColor: '#EA580C',
      })
    }
  }

  // ===== TAMBAH WARNA =====
  const handleTambahWarna = async (e) => {
    e.preventDefault()
    
    if (!formData.nomor_seri || !formData.nama || !formData.kode_hex || !formData.kategori) {
      Swal.fire({
        title: 'Error!',
        text: 'Semua field wajib diisi!',
        icon: 'error',
        confirmButtonColor: '#EA580C',
      })
      return
    }

    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(formData.kode_hex)) {
      Swal.fire({
        title: 'Error!',
        text: 'Format kode HEX tidak valid! Contoh: #FFFFFF',
        icon: 'error',
        confirmButtonColor: '#EA580C',
      })
      return
    }

    const seriRegex = /^[A-Z]\.\d{1,2}$/;
    if (!seriRegex.test(formData.nomor_seri)) {
      Swal.fire({
        title: 'Error!',
        text: 'Format Nomor Seri tidak valid! Contoh: G.99, M.10, B.05',
        icon: 'error',
        confirmButtonColor: '#EA580C',
      })
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1.0/warna`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomor_seri: formData.nomor_seri.toUpperCase(),
          nama: formData.nama,
          kode_hex: formData.kode_hex,
          kategori: formData.kategori,
          tersedia: formData.tersedia,
        }),
      })

      const result = await response.json()
      if (result.status === 'success') {
        await simpanRiwayatAdmin('Tambah Warna', `Menambah warna "${formData.nama}" (${formData.nomor_seri})`)
        
        Swal.fire({
          title: 'Berhasil!',
          text: 'Warna berhasil ditambahkan!',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        })
        
        setRefreshTrigger((prev) => prev + 1)
        setFormData({
          nomor_seri: '',
          nama: '',
          kode_hex: '#',
          kategori: 'Netral',
          tersedia: true,
        })
        
        if (result.data) {
          setWarnaList(prev => [result.data, ...prev])
        }
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Gagal menambahkan warna: ' + (result.message || ''),
          icon: 'error',
          confirmButtonColor: '#EA580C',
        })
      }
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: 'Gagal terhubung ke server: ' + (err.message || ''),
        icon: 'error',
        confirmButtonColor: '#EA580C',
      })
    }
  }

  // ===== EDIT WARNA =====
  const handleEditWarna = (warna) => {
    setEditWarna(warna)
    setFormData({
      nomor_seri: warna.nomor_seri || '',
      nama: warna.nama || '',
      kode_hex: warna.kode_hex || '#ffffff',
      kategori: warna.kategori || '',
      tersedia: warna.tersedia !== undefined ? warna.tersedia : true,
    })
    setShowEditModal(true)
  }

  const handleSaveEdit = async () => {
    if (!formData.nomor_seri || !formData.nama || !formData.kode_hex) {
      Swal.fire({
        title: 'Error!',
        text: 'Semua field wajib diisi!',
        icon: 'error',
        confirmButtonColor: '#EA580C',
      })
      return
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1.0/warna/${editWarna.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nomor_seri: formData.nomor_seri.toUpperCase(),
            nama: formData.nama,
            kode_hex: formData.kode_hex,
            kategori: formData.kategori,
            tersedia: formData.tersedia,
          }),
        },
      )

      const result = await response.json()
      if (result.status === 'success') {
        await simpanRiwayatAdmin('Edit Warna', `Mengubah warna "${editWarna.nama}" (${editWarna.nomor_seri}) menjadi "${formData.nama}" (${formData.nomor_seri})`)
        
        Swal.fire({
          title: 'Berhasil!',
          text: 'Warna berhasil diupdate!',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        })
        
        setRefreshTrigger((prev) => prev + 1)
        setShowEditModal(false)
        setEditWarna(null)
        
        setWarnaList(prev => prev.map(w => 
          w.id === editWarna.id ? { ...w, ...formData } : w
        ))
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Gagal mengupdate warna: ' + (result.message || ''),
          icon: 'error',
          confirmButtonColor: '#EA580C',
        })
      }
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: 'Gagal terhubung ke server',
        icon: 'error',
        confirmButtonColor: '#EA580C',
      })
    }
  }

  // ===== HAPUS WARNA =====
  const handleDeleteWarna = async (id) => {
    const result = await Swal.fire({
      title: 'Yakin ingin menghapus?',
      text: 'Data yang dihapus tidak dapat dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#64748B',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      reverseButtons: true,
    })

    if (!result.isConfirmed) return

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1.0/warna/${id}`, {
        method: 'DELETE',
      })
      const resultData = await response.json()
      if (resultData.status === 'success') {
        const warna = warnaList.find(w => w.id === id)
        await simpanRiwayatAdmin('Hapus Warna', `Menghapus warna "${warna?.nama || id}" (ID: ${id})`)
        
        Swal.fire({
          title: 'Berhasil!',
          text: 'Warna berhasil dihapus!',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        })
        
        setRefreshTrigger((prev) => prev + 1)
        setWarnaList((list) => list.filter((w) => w.id !== id))
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Gagal menghapus warna',
          icon: 'error',
          confirmButtonColor: '#EA580C',
        })
      }
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: 'Gagal terhubung ke server',
        icon: 'error',
        confirmButtonColor: '#EA580C',
      })
    }
  }

  // ========== STYLES ==========
  const styles = {
    page: {
      minHeight: '100vh',
      background: '#f4f6fb',
      fontFamily: "'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', Roboto, sans-serif",
      paddingBottom: '70px',
    },
    content: {
      padding: isMobile ? '16px' : '24px',
      maxWidth: isMobile ? '550px' : '1400px',
      margin: '0 auto',
    },
    pageTitle: {
      fontSize: isMobile ? '22px' : '28px',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      flexWrap: 'wrap',
    },
    badge: {
      background: '#eef2ff',
      color: '#667eea',
      borderRadius: '24px',
      padding: '4px 12px',
      fontSize: '13px',
      fontWeight: '700',
    },
    searchSection: { marginBottom: '20px' },
    searchContainer: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: '16px',
      width: '100%',
      alignItems: 'center',
    },
    searchInputWrapper: {
      flex: isMobile ? 1 : 2,
      position: 'relative',
      width: '100%',
    },
    searchInput: {
      width: '100%',
      padding: isMobile ? '12px 16px' : '14px 18px',
      paddingLeft: '45px',
      fontSize: isMobile ? '14px' : '15px',
      border: '2px solid #e2e8f0',
      borderRadius: '30px',
      backgroundColor: 'white',
      outline: 'none',
      transition: 'all 0.3s',
      boxSizing: 'border-box',
    },
    searchIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#94a3b8',
      fontSize: '18px',
    },
    searchInfo: {
      fontSize: isMobile ? '11px' : '13px',
      color: '#10b981',
      marginTop: '8px',
      paddingLeft: '4px',
    },
    filterSection: {
      display: 'flex',
      gap: '10px',
      marginBottom: '24px',
      flexWrap: 'wrap',
    },
    filterButton: {
      padding: isMobile ? '8px 16px' : '10px 24px',
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '30px',
      fontSize: isMobile ? '13px' : '14px',
      fontWeight: '500',
      color: '#4a5568',
      cursor: 'pointer',
      transition: 'all 0.3s',
      boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
    },
    filterButtonAktif: {
      padding: isMobile ? '8px 16px' : '10px 24px',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      border: 'none',
      borderRadius: '30px',
      fontSize: isMobile ? '13px' : '14px',
      fontWeight: '500',
      color: 'white',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    },
    cardGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(380px, 1fr))',
      gap: '16px',
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      padding: '18px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
    },
    cardTopRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      marginBottom: '14px',
      flexWrap: 'wrap',
    },
    colorSwatch: {
      width: '60px',
      height: '60px',
      borderRadius: '14px',
      border: '1px solid #e2e8f0',
      flexShrink: 0,
    },
    cardWarnaNama: {
      fontSize: isMobile ? '17px' : '18px',
      fontWeight: '600',
      color: '#1e293b',
      margin: 0,
    },
    cardNomor: {
      fontSize: '13px',
      color: '#667eea',
      fontFamily: 'monospace',
      margin: '4px 0 0',
    },
    statusBadge: (tersedia) => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '5px 14px',
      borderRadius: '24px',
      fontSize: '13px',
      fontWeight: '600',
      background: tersedia ? '#d1fae5' : '#fee2e2',
      color: tersedia ? '#065f46' : '#991b1b',
    }),
    cardMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '14px',
      flexWrap: 'wrap',
      gap: '8px',
    },
    metaChip: {
      background: '#f1f5f9',
      color: '#475569',
      padding: '6px 14px',
      borderRadius: '24px',
      fontSize: '13px',
    },
    cardActions: {
      display: 'flex',
      gap: '10px',
      marginTop: '10px',
    },
    btnEdit: {
      flex: 1,
      padding: '11px 6px',
      borderRadius: '12px',
      border: 'none',
      background: '#667eea',
      color: 'white',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '5px',
    },
    btnDelete: {
      flex: 1,
      padding: '11px 6px',
      borderRadius: '12px',
      border: 'none',
      background: '#ef4444',
      color: 'white',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '5px',
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#94a3b8',
      background: 'white',
      borderRadius: '20px',
    },
    hargaCard: {
      background: 'white',
      borderRadius: '24px',
      padding: '22px',
      marginBottom: '14px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
    },
    hargaNama: {
      fontSize: '17px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '6px',
    },
    hargaCurrent: {
      fontSize: '14px',
      color: '#64748b',
      marginBottom: '16px',
    },
    hargaInputRow: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap',
    },
    hargaInput: {
      flex: 1,
      padding: '15px 16px',
      borderRadius: '14px',
      border: '2px solid #e2e8f0',
      fontSize: '16px',
      outline: 'none',
      minWidth: '180px',
    },
    hargaUpdateBtn: {
      padding: '15px 24px',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      border: 'none',
      borderRadius: '14px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    formCard: {
      background: 'white',
      borderRadius: '24px',
      padding: '22px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
    },
    inputGroup: { marginBottom: '18px' },
    label: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#475569',
      display: 'block',
      marginBottom: '8px',
    },
    input: {
      width: '100%',
      padding: '15px 16px',
      borderRadius: '14px',
      border: '2px solid #e2e8f0',
      fontSize: '16px',
      outline: 'none',
      boxSizing: 'border-box',
    },
    select: {
      width: '100%',
      padding: '15px 16px',
      borderRadius: '14px',
      border: '2px solid #e2e8f0',
      fontSize: '16px',
      outline: 'none',
      backgroundColor: 'white',
      boxSizing: 'border-box',
    },
    submitBtn: {
      width: '100%',
      padding: '16px',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      border: 'none',
      borderRadius: '16px',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      marginTop: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
    },
    profileHeader: {
      background: 'linear-gradient(135deg, #041a3a 0%, #7c3aed 100%)',
      borderRadius: '24px',
      padding: isMobile ? '30px 20px' : '35px 20px',
      textAlign: 'center',
      marginBottom: '18px',
    },
    profileAvatarLg: {
      width: isMobile ? '100px' : '120px',
      height: isMobile ? '100px' : '120px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.2)',
      margin: '0 auto 18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      border: '3px solid rgba(255,255,255,0.5)',
      cursor: 'pointer',
      position: 'relative',
    },
    avatarOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(0,0,0,0.65)',
      color: 'white',
      fontSize: '10px',
      textAlign: 'center',
      padding: '6px',
    },
    profileNameWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      flexWrap: 'wrap',
      marginBottom: '8px',
    },
    profileName: {
      fontSize: isMobile ? '22px' : '26px',
      fontWeight: '700',
      color: 'white',
      margin: 0,
    },
    editBtn: {
      padding: isMobile ? '6px 14px' : '8px 18px',
      background: 'rgba(255,255,255,0.2)',
      color: 'white',
      border: 'none',
      borderRadius: '24px',
      fontSize: isMobile ? '12px' : '13px',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
    },
    profileEmail: {
      fontSize: isMobile ? '13px' : '14px',
      color: 'rgba(255,255,255,0.8)',
      margin: 0,
    },
    editNameRow: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: '12px',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '16px',
    },
    editNameButtons: {
      display: 'flex',
      gap: '10px',
      width: isMobile ? '100%' : 'auto',
      justifyContent: 'center',
    },
    nameInput: {
      padding: isMobile ? '12px 16px' : '13px 16px',
      borderRadius: '14px',
      border: '2px solid white',
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: '500',
      outline: 'none',
      width: isMobile ? '100%' : '250px',
      maxWidth: '100%',
      textAlign: 'center',
      backgroundColor: 'white',
      color: '#1e293b',
      boxSizing: 'border-box',
    },
    saveBtn: {
      padding: isMobile ? '12px 20px' : '13px 20px',
      background: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '14px',
      fontSize: isMobile ? '13px' : '14px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
    },
    cancelBtn: {
      padding: isMobile ? '12px 20px' : '13px 20px',
      background: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '14px',
      fontSize: isMobile ? '13px' : '14px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
    },
    infoCard: {
      background: 'white',
      borderRadius: '20px',
      padding: '0 18px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
      marginBottom: '14px',
    },
    infoRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '16px 0',
      borderBottom: '1px solid #f1f5f9',
    },
    infoIcon: {
      color: '#667eea',
      fontSize: isMobile ? '20px' : '24px',
      width: '32px',
      flexShrink: 0,
    },
    infoLabel: {
      fontSize: isMobile ? '12px' : '13px',
      color: '#94a3b8',
      marginBottom: '3px',
    },
    infoValue: {
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: '500',
      color: '#1e293b',
    },
    loginTypeBadge: {
      display: 'inline-block',
      padding: isMobile ? '5px 12px' : '6px 16px',
      borderRadius: '30px',
      fontSize: isMobile ? '11px' : '13px',
      fontWeight: '600',
      backgroundColor: '#eef2ff',
      color: '#667eea',
    },
    logoutButtonProfile: {
      width: '100%',
      padding: isMobile ? '14px' : '16px',
      background: 'white',
      border: '2px solid #fee2e2',
      borderRadius: '16px',
      color: '#dc3545',
      fontSize: isMobile ? '14px' : '15px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    hiddenInput: { display: 'none' },
    modalBackdrop: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.55)',
      display: 'flex',
      alignItems: 'flex-end',
      zIndex: 500,
    },
    modalSheet: {
      background: 'white',
      borderRadius: '28px 28px 0 0',
      width: '100%',
      maxHeight: '85vh',
      overflowY: 'auto',
      padding: '28px 22px 35px',
    },
    modalHandle: {
      width: '50px',
      height: '5px',
      background: '#e2e8f0',
      borderRadius: '99px',
      margin: '0 auto 22px',
    },
    modalTitle: {
      fontSize: '22px',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '22px',
    },
  }

  return (
    <div style={styles.page}>
      <AdminTopBar
        profilePicture={profilePicture}
        adminName={adminProfile.name}
        isMobile={isMobile}
      />

      <div style={styles.content}>
        {activeTab === 'stok' && (
          <StokTab
            key={refreshTrigger}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterKategori={filterKategori}
            setFilterKategori={setFilterKategori}
            onEditWarna={handleEditWarna}
            onDeleteWarna={handleDeleteWarna}
            styles={styles}
            isMobile={isMobile}
          />
        )}

        {activeTab === 'harga' && (
          <HargaTab 
            styles={styles} 
            isMobile={isMobile} 
          />
        )}

        {activeTab === 'tambah' && (
          <TambahWarnaTab
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleTambahWarna}
            styles={styles}
            isMobile={isMobile}
          />
        )}

        {activeTab === 'aturan' && (
          <KelolaAturanRek styles={styles} isMobile={isMobile} />
        )}

        {activeTab === 'riwayat' && (
          <RiwayatTab styles={styles} isMobile={isMobile} />
        )}

        {activeTab === 'profile' && (
          <ProfileTab
            adminProfile={adminProfile}
            profilePicture={profilePicture}
            onAvatarChange={handleAvatarChange}
            onSaveName={handleSaveName}
            onLogout={handleLogout}
            styles={styles}
            isMobile={isMobile}
          />
        )}
      </div>

      <AdminBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobile={isMobile}
      />

      {showEditModal && (
        <EditWarnaModal
          formData={formData}
          setFormData={setFormData}
          onSave={handleSaveEdit}
          onClose={() => setShowEditModal(false)}
          styles={styles}
        />
      )}
    </div>
  )
}

export default AdminDashboard