import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import {
  FiImage,
  FiRotateCcw,
  FiTrash2,
  FiSliders,
  FiGrid,
  FiX,
  FiPlus,
  FiCheckCircle,
} from 'react-icons/fi'
import { MdPalette, MdColorLens, MdBrush, MdGridView } from 'react-icons/md'
import { HiSparkles, HiCheckCircle, HiXCircle } from 'react-icons/hi'
import { BsCameraFill, BsHash, BsFonts, BsGrid3X3Gap } from 'react-icons/bs'
import { TbTargetArrow } from 'react-icons/tb'
import { getSessionId } from '../../utils/session'
import Swal from 'sweetalert2'
import NavbarFitur from '../../components/NavbarFitur'

function WarnaPage() {
  const navigate = useNavigate()
  const location = useLocation()

  // ===== STATE =====
  const [warnaList, setWarnaList] = useState([])
  const [loading, setLoading] = useState(true)

  const [warnaTerpilih, setWarnaTerpilih] = useState(null)
  const [filterAktif, setFilterAktif] = useState('Semua')

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  const [searchTerm, setSearchTerm] = useState('')
  const [searchMode, setSearchMode] = useState('nama')

  const [filterStok, setFilterStok] = useState('semua')

  const [gambar, setGambar] = useState(null)
  const [gambarPreview, setGambarPreview] = useState(null)
  const [warnaSimulasi, setWarnaSimulasi] = useState(null)
  const [opacity, setOpacity] = useState(0.3)

  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedAreas, setSelectedAreas] = useState([])
  const [brushSize, setBrushSize] = useState(20)
  const [riwayatId, setRiwayatId] = useState(null)

  const [comparisonMode, setComparisonMode] = useState(false)
  const [selectedForComparison, setSelectedForComparison] = useState([])
  const [showComparison, setShowComparison] = useState(false)

  // 🔥 STATE BARU: Warna yang dicoba (belum disimpan ke database)
  const [warnaSementara, setWarnaSementara] = useState([])
  const [isSaving, setIsSaving] = useState(false)

  // ===== REFS UNTUK PERFORMANCE =====
  const canvasRef = useRef(null)
  const renderRef = useRef(null)
  const imageCache = useRef(null)
  const drawnAreasRef = useRef([])
  const isDrawingRef = useRef(false)

  // ===== COLORS =====
  const brownColor = '#78350F'
  const brownLight = '#92400E'
  const orangeSoft = '#D97706'
  const orangeSoftLight = '#F59E0B'
  const textDark = '#292524'
  const textLight = '#78716C'
  const bgWhite = '#FFFFFF'
  const bgWarm = '#FEFCE8'
  const borderColor = '#E7E5E4'

  const primaryGradient = `linear-gradient(135deg, ${brownColor} 0%, ${brownLight} 50%, ${orangeSoft} 100%)`
  const secondaryGradient = `linear-gradient(135deg, ${brownLight} 0%, ${orangeSoft} 100%)`

  // ===== HELPER FUNCTIONS =====
  const getWarnaDibandingkan = useCallback(() => {
    return selectedForComparison.map((w) => w.nama)
  }, [selectedForComparison])

  const getWarnaDicoba = useCallback(() => {
    const allWarna = drawnAreasRef.current.map((area) => area.warnaNama)
    return [...new Set(allWarna)]
  }, [])

  const hexToRgba = useCallback((hex, opacity) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }, [])

  // ===== THROTTLE =====
  const throttle = useCallback((func, limit) => {
    let inThrottle
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  }, [])

  // ===== GET ALL WARNA DARI AREA + WARNA AKTIF =====
  const getAllWarna = useCallback(() => {
    const areaWarna = drawnAreasRef.current.map((area) => area.warnaNama)
    const uniqueAreaWarna = [...new Set(areaWarna)]
    
    if (warnaSimulasi) {
      return [...new Set([...uniqueAreaWarna, warnaSimulasi.nama])]
    }
    return uniqueAreaWarna
  }, [warnaSimulasi])

  // ============================================================
  // 🔥 API CALLS
  // ============================================================

  // ==== 1. UPLOAD FOTO → POST (buat riwayat baru) ====
  const simpanRiwayatSimulasi = async (fotoPath) => {
    try {
      const sessionId = await getSessionId()
      if (!sessionId) return

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1.0/riwayat/simulasi`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionId,
            foto_path: '',
            warna_dicoba: '',
            warna_akhir: '',
          }),
        }
      )

      const result = await response.json()
      if (result.status === 'success') {
        setRiwayatId(result.data.id)
        localStorage.setItem('riwayatSimulasiId', String(result.data.id))
        console.log('✅ Riwayat simulasi dibuat, ID:', result.data.id)
      } else {
        console.error('❌ Gagal simpan riwayat:', result.message)
      }
    } catch (error) {
      console.error('❌ Gagal simpan riwayat simulasi:', error)
    }
  }

  // ==== 2. SIMPAN SIMULASI → POST (1 kali aja!) ====
  const handleSimpanSimulasi = useCallback(async () => {
    if (warnaSementara.length === 0) {
      Swal.fire({
        title: 'Belum Ada Warna!',
        text: 'Silakan pilih warna dulu sebelum menyimpan simulasi.',
        icon: 'info',
        confirmButtonColor: '#EA580C',
      })
      return
    }

    setIsSaving(true)

    try {
      const sessionId = await getSessionId()
      if (!sessionId) {
        Swal.fire({
          title: 'Error!',
          text: 'Session ID tidak ditemukan.',
          icon: 'error',
          confirmButtonColor: '#EA580C',
        })
        setIsSaving(false)
        return
      }

      const warnaAkhir = warnaSimulasi?.nama || warnaSementara[warnaSementara.length - 1]
      const warnaDibandingkan = getWarnaDibandingkan()

      console.log('📝 [SimpanSimulasi] Data:', {
        sessionId,
        warnaDicoba: warnaSementara,
        warnaAkhir: warnaAkhir,
        warnaDibandingkan: warnaDibandingkan,
      })

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1.0/riwayat/simulasi/warna`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          warna_dicoba: JSON.stringify(warnaSementara),
          warna_dibandingkan: JSON.stringify(warnaDibandingkan),
          warna_akhir: warnaAkhir,
        }),
      })

      const result = await response.json()

      if (result.status === 'success') {
        console.log('✅ Simulasi tersimpan! ID:', result.data.id)
        
        setRiwayatId(result.data.id)
        localStorage.setItem('riwayatSimulasiId', String(result.data.id))
        setWarnaSementara([])

        Swal.fire({
          title: '✅ Berhasil!',
          text: `Simulasi warna "${warnaAkhir}" berhasil disimpan ke riwayat.`,
          icon: 'success',
          confirmButtonColor: '#EA580C',
        })
      } else {
        console.error('❌ Gagal simpan:', result.message)
        Swal.fire({
          title: 'Gagal!',
          text: 'Gagal menyimpan simulasi: ' + result.message,
          icon: 'error',
          confirmButtonColor: '#EA580C',
        })
      }
    } catch (error) {
      console.error('❌ Error simpan simulasi:', error)
      Swal.fire({
        title: 'Error!',
        text: 'Terjadi kesalahan saat menyimpan simulasi.',
        icon: 'error',
        confirmButtonColor: '#EA580C',
      })
    } finally {
      setIsSaving(false)
    }
  }, [warnaSementara, warnaSimulasi, getWarnaDibandingkan])

  const fetchWarna = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1.0/warna`)
      const result = await response.json()
      if (result.status === 'success') {
        setWarnaList(result.data)
      }
    } catch (error) {
      console.error('Gagal fetch warna:', error)
    } finally {
      setLoading(false)
    }
  }

  // ===== RENDER CANVAS - OPTIMIZED =====
  const renderCanvas = useCallback(() => {
    if (renderRef.current) {
      cancelAnimationFrame(renderRef.current)
    }

    renderRef.current = requestAnimationFrame(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      const img = imageCache.current

      if (!img || !gambarPreview) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        renderRef.current = null
        return
      }

      const maxWidth = isMobile ? 350 : 600
      const scale = maxWidth / img.width
      const width = maxWidth
      const height = img.height * scale

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }

      ctx.drawImage(img, 0, 0, width, height)

      const areas = drawnAreasRef.current
      for (let i = 0; i < areas.length; i++) {
        const area = areas[i]
        ctx.beginPath()
        ctx.arc(area.x, area.y, area.radius, 0, Math.PI * 2)
        ctx.fillStyle = hexToRgba(area.warnaKode || '#cccccc', area.opacity)
        ctx.fill()
      }

      renderRef.current = null
    })
  }, [gambarPreview, isMobile, hexToRgba])

  // ===== BRUSH - DIRECT CANVAS RENDER =====
  const addSelectionArea = useCallback(
    (e) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height

      const x = (e.clientX - rect.left) * scaleX
      const y = (e.clientY - rect.top) * scaleY

      const boundedX = Math.min(Math.max(x, brushSize), canvas.width - brushSize)
      const boundedY = Math.min(Math.max(y, brushSize), canvas.height - brushSize)

      const newArea = {
        id: Date.now() + Math.random(),
        x: boundedX,
        y: boundedY,
        radius: brushSize,
        warnaKode: warnaSimulasi.kode_hex,
        warnaNama: warnaSimulasi.nama,
        opacity: opacity,
      }

      drawnAreasRef.current.push(newArea)
      renderCanvas()
    },
    [brushSize, warnaSimulasi, opacity, renderCanvas]
  )

  // ===== CANVAS EVENTS - OPTIMIZED =====
  const handleCanvasMouseDown = useCallback(
    (e) => {
      if (!selectionMode || !warnaSimulasi) return
      
      if (comparisonMode) {
        setComparisonMode(false)
      }
      
      isDrawingRef.current = true
      addSelectionArea(e)
    },
    [selectionMode, warnaSimulasi, addSelectionArea, comparisonMode]
  )

  const handleCanvasMouseMove = useCallback(
    throttle((e) => {
      if (!isDrawingRef.current || !selectionMode || !warnaSimulasi) return
      addSelectionArea(e)
    }, 16),
    [selectionMode, warnaSimulasi, addSelectionArea, throttle]
  )

  const handleCanvasMouseUp = useCallback(() => {
    if (!isDrawingRef.current) return
    isDrawingRef.current = false

    setSelectedAreas([...drawnAreasRef.current])

    const allWarna = getAllWarna()
    
    // 🔥 Update state sementara (belum ke database)
    if (allWarna.length > 0) {
      setWarnaSementara((prev) => {
        const newList = [...prev, ...allWarna]
        return [...new Set(newList)]
      })
    }
  }, [getAllWarna])

  const handleCanvasMouseLeave = useCallback(() => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false
      setSelectedAreas([...drawnAreasRef.current])
    }
  }, [])

  const handleCanvasTouch = useCallback(
    (e) => {
      e.preventDefault()
      if (!selectionMode || !warnaSimulasi) return
      const touch = e.touches[0]
      addSelectionArea({ clientX: touch.clientX, clientY: touch.clientY })
    },
    [selectionMode, warnaSimulasi, addSelectionArea]
  )

  const handleCanvasTouchMove = useCallback(
    (e) => {
      e.preventDefault()
      if (!selectionMode || !warnaSimulasi) return
      const touch = e.touches[0]
      addSelectionArea({ clientX: touch.clientX, clientY: touch.clientY })
    },
    [selectionMode, warnaSimulasi, addSelectionArea]
  )

  // ===== UNDO / CLEAR =====
  const handleUndo = useCallback(() => {
    if (drawnAreasRef.current.length === 0) return
    drawnAreasRef.current = drawnAreasRef.current.slice(0, -1)
    setSelectedAreas([...drawnAreasRef.current])
    renderCanvas()

    // 🔥 Update daftar sementara (warna terakhir dihapus)
    const allWarna = getAllWarna()
    setWarnaSementara(allWarna)
  }, [renderCanvas, getAllWarna])

  const handleClearAll = useCallback(() => {
    drawnAreasRef.current = []
    setSelectedAreas([])
    renderCanvas()

    // 🔥 Kosongkan daftar sementara
    setWarnaSementara([])
  }, [renderCanvas])

  // ===== RESET =====
  const handleReset = useCallback(() => {
    drawnAreasRef.current = []
    setGambar(null)
    setGambarPreview(null)
    setWarnaSimulasi(null)
    setSelectedAreas([])
    setSelectionMode(false)
    setWarnaTerpilih(null)
    setRiwayatId(null)
    setWarnaSementara([]) // 🔥 Reset sementara
    localStorage.removeItem('riwayatSimulasiId')
    imageCache.current = null
    renderCanvas()
  }, [renderCanvas])

  // ===== KLIK CARD WARNA =====
  const handleWarnaClick = useCallback(
    (warna) => {
      setWarnaTerpilih(warna)
      setWarnaSimulasi(warna)

      // 🔥 Simpan ke state sementara (belum ke database)
      setWarnaSementara((prev) => {
        const newList = [...prev, warna.nama]
        return [...new Set(newList)]
      })
    },
    []
  )

  // ===== COMPARISON =====
  const toggleComparison = useCallback(
    (warna) => {
      setSelectedForComparison((prev) => {
        let newList
        const isSelected = prev.some((w) => w.id === warna.id)

        if (isSelected) {
          newList = prev.filter((w) => w.id !== warna.id)
        } else {
          if (prev.length >= 4) {
            Swal.fire({
              title: 'Maksimal 4 Warna!',
              text: 'Kamu hanya bisa membandingkan maksimal 4 warna sekaligus.',
              icon: 'warning',
              confirmButtonColor: '#EA580C',
            })
            return prev
          }
          newList = [...prev, warna]
        }

        return newList
      })
    },
    []
  )

  const removeOneFromComparison = useCallback(
    (warnaId) => {
      setSelectedForComparison((prev) => {
        const newList = prev.filter((w) => w.id !== warnaId)
        return newList
      })
    },
    []
  )

  const openComparison = useCallback(() => {
    if (selectedForComparison.length < 2) {
      Swal.fire({
        title: 'Pilih Minimal 2 Warna!',
        text: 'Kamu perlu memilih minimal 2 warna untuk dibandingkan.',
        icon: 'info',
        confirmButtonColor: '#EA580C',
      })
      return
    }
    setShowComparison(true)
  }, [selectedForComparison])

  const closeComparison = useCallback(() => {
    setShowComparison(false)
  }, [])

  const resetComparison = useCallback(() => {
    setSelectedForComparison([])
    setShowComparison(false)
  }, [])

  // ===== UPLOAD =====
  const handleUpload = useCallback(
    async (e) => {
      const file = e.target.files[0]
      if (file) {
        setGambar(file)
        const reader = new FileReader()
        reader.onloadend = async () => {
          const fotoPath = reader.result
          setGambarPreview(fotoPath)
          drawnAreasRef.current = []
          setSelectedAreas([])
          setWarnaSimulasi(null)
          setWarnaSementara([]) // 🔥 Reset sementara

          const img = new Image()
          img.src = fotoPath
          img.onload = () => {
            imageCache.current = img
            renderCanvas()
          }

          await simpanRiwayatSimulasi(fotoPath)
        }
        reader.readAsDataURL(file)
      }
    },
    [renderCanvas]
  )

  // ===== FILTERED WARNA =====
  const filteredWarna = useMemo(() => {
    let filtered =
      filterAktif === 'Semua'
        ? warnaList
        : warnaList.filter((warna) => warna.kategori === filterAktif)

    if (filterStok === 'tersedia') {
      filtered = filtered.filter((w) => w.tersedia === true)
    } else if (filterStok === 'habis') {
      filtered = filtered.filter((w) => w.tersedia === false)
    }

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim()
      if (searchMode === 'nama') {
        filtered = filtered.filter((w) => w.nama.toLowerCase().includes(term))
      } else if (searchMode === 'nomor_seri') {
        filtered = filtered.filter((w) => w.nomor_seri.toLowerCase().includes(term))
      }
    }

    return filtered
  }, [warnaList, filterAktif, filterStok, searchTerm, searchMode])

  // ===== EFFECTS =====
  useEffect(() => {
    fetchWarna()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (location.state?.scrollTo === 'fitur-katalog') {
      const element = document.getElementById('fitur-katalog')
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 300)
      }
    }
  }, [location])

  useEffect(() => {
    if (gambarPreview && imageCache.current) {
      renderCanvas()
    }
  }, [gambarPreview, opacity, isMobile, renderCanvas])

  // ===== STYLES =====
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
      boxShadow: `0 25px 50px -12px ${brownColor}40`,
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
      gap: '12px',
      flexWrap: 'wrap',
    },
    subheader: {
      fontSize: isMobile ? '14px' : '18px',
      color: textLight,
      marginBottom: isMobile ? '16px' : '24px',
      borderBottom: `2px solid ${borderColor}`,
      paddingBottom: isMobile ? '8px' : '12px',
    },
    simulasiSection: {
      background: bgWarm,
      borderRadius: isMobile ? '16px' : '24px',
      padding: isMobile ? '4px 16px 16px 16px' : '8px 20px 20px 20px',
      marginBottom: isMobile ? '24px' : '32px',
      border: `1px solid ${borderColor}`,
    },
    simulasiTitle: {
      fontSize: isMobile ? '18px' : '24px',
      fontWeight: '600',
      color: brownColor,
      marginBottom: isMobile ? '8px' : '12px',
      marginTop: isMobile ? '0' : '0',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    simulasiContainer: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: isMobile ? '14px' : '24px',
      alignItems: 'stretch',
    },
    uploadArea: {
      backgroundColor: 'white',
      borderRadius: isMobile ? '16px' : '20px',
      border: `2px dashed ${orangeSoft}50`,
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: isMobile ? '340px' : '400px',
      height: '100%',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
    },
    hiddenInput: {
      display: 'none',
    },
    uploadLabel: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      cursor: 'pointer',
      width: '100%',
      height: '100%',
      padding: '20px',
      textAlign: 'center',
    },
    uploadIcon: {
      fontSize: isMobile ? '48px' : '56px',
      color: orangeSoft,
    },
    uploadText: {
      fontSize: isMobile ? '16px' : '18px',
      fontWeight: '600',
      color: brownColor,
    },
    uploadSubtext: {
      fontSize: isMobile ? '12px' : '14px',
      color: textLight,
    },
    previewArea: {
      backgroundColor: 'white',
      borderRadius: isMobile ? '16px' : '20px',
      border: `2px solid ${borderColor}`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: isMobile ? '340px' : '400px',
      height: '100%',
      overflow: 'hidden',
      padding: '16px',
      boxSizing: 'border-box',
    },
    emptyPreview: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      width: '100%',
      height: '100%',
      padding: '20px',
      boxSizing: 'border-box',
      textAlign: 'center',
    },
    emptyPreviewIcon: {
      fontSize: isMobile ? '48px' : '56px',
      color: textLight,
      display: 'block',
    },
    emptyPreviewText: {
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: '500',
      color: textLight,
      margin: 0,
      textAlign: 'center',
      width: '100%',
    },
    emptyPreviewSubtext: {
      fontSize: isMobile ? '11px' : '14px',
      color: textLight,
      margin: 0,
      textAlign: 'center',
      width: '100%',
    },
    canvasContainer: {
      position: 'relative',
      width: '100%',
      borderRadius: '12px',
      overflow: 'auto',
      boxShadow: `0 10px 15px -3px ${brownColor}20`,
      cursor: selectionMode ? 'crosshair' : 'default',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f7fafc',
      minHeight: '250px',
    },
    canvas: {
      width: '100%',
      height: 'auto',
      display: 'block',
    },
    simulasiControls: {
      marginTop: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      width: '100%',
    },
    controlRow: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    opacityControl: {
      flex: 1,
      minWidth: isMobile ? '100%' : '200px',
    },
    opacityLabel: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px',
      color: textLight,
      fontSize: isMobile ? '12px' : '14px',
    },
    opacitySlider: {
      width: '100%',
      height: '6px',
      borderRadius: '3px',
      background: primaryGradient,
      outline: 'none',
      cursor: 'pointer',
    },
    brushControl: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      backgroundColor: 'white',
      padding: '5px 15px',
      borderRadius: '30px',
      flex: 1,
      minWidth: isMobile ? '100%' : '200px',
      border: `1px solid ${borderColor}`,
    },
    brushSlider: {
      width: '100%',
      height: '6px',
      borderRadius: '3px',
      background: `${textLight}20`,
      outline: 'none',
      cursor: 'pointer',
    },
    katalogTitle: {
      fontSize: isMobile ? '18px' : '24px',
      fontWeight: '600',
      color: brownColor,
      marginBottom: isMobile ? '16px' : '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    searchSection: {
      marginBottom: isMobile ? '16px' : '25px',
    },
    searchContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      width: '100%',
    },
    searchInput: {
      width: '100%',
      padding: isMobile ? '12px 16px' : '12px 16px',
      fontSize: isMobile ? '14px' : '16px',
      border: `2px solid ${borderColor}`,
      borderRadius: '30px',
      backgroundColor: 'white',
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'border-color 0.3s',
      color: textDark,
    },
    searchButtons: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
    },
    searchModeButton: {
      flex: 1,
      padding: isMobile ? '10px 12px' : '10px 20px',
      backgroundColor: 'white',
      border: `1px solid ${borderColor}`,
      borderRadius: '30px',
      fontSize: isMobile ? '13px' : '14px',
      fontWeight: '500',
      color: textLight,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      whiteSpace: 'nowrap',
      transition: 'all 0.3s',
    },
    searchModeButtonAktif: {
      flex: 1,
      padding: isMobile ? '10px 12px' : '10px 20px',
      background: primaryGradient,
      border: 'none',
      borderRadius: '30px',
      fontSize: isMobile ? '13px' : '14px',
      fontWeight: '500',
      color: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      whiteSpace: 'nowrap',
      transition: 'all 0.3s',
    },
    searchInfo: {
      fontSize: isMobile ? '11px' : '13px',
      color: '#10b981',
      marginTop: '8px',
      paddingLeft: '4px',
    },
    stokSection: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: isMobile ? 'flex-start' : 'center',
      gap: isMobile ? '10px' : '16px',
      marginBottom: isMobile ? '20px' : '25px',
    },
    stokLabel: {
      fontSize: isMobile ? '13px' : '14px',
      fontWeight: '600',
      color: textLight,
    },
    stokButtons: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
      width: isMobile ? '100%' : 'auto',
    },
    stokButton: {
      flex: isMobile ? 1 : 'none',
      padding: isMobile ? '8px 12px' : '8px 20px',
      backgroundColor: 'white',
      border: `1px solid ${borderColor}`,
      borderRadius: '30px',
      fontSize: isMobile ? '12px' : '13px',
      fontWeight: '500',
      color: textLight,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      whiteSpace: 'nowrap',
      transition: 'all 0.3s',
    },
    stokButtonAktif: {
      flex: isMobile ? 1 : 'none',
      padding: isMobile ? '8px 12px' : '8px 20px',
      background: primaryGradient,
      border: 'none',
      borderRadius: '30px',
      fontSize: isMobile ? '12px' : '13px',
      fontWeight: '500',
      color: 'white',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      whiteSpace: 'nowrap',
      transition: 'all 0.3s',
    },
    filterSection: {
      display: 'flex',
      gap: '10px',
      marginBottom: isMobile ? '20px' : '30px',
      flexWrap: 'wrap',
    },
    filterButton: {
      padding: isMobile ? '6px 14px' : '10px 24px',
      backgroundColor: 'white',
      border: `1px solid ${borderColor}`,
      borderRadius: '30px',
      fontSize: isMobile ? '12px' : '14px',
      fontWeight: '500',
      color: textLight,
      cursor: 'pointer',
      transition: 'all 0.3s',
      boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
    },
    filterButtonAktif: {
      padding: isMobile ? '6px 14px' : '10px 24px',
      background: primaryGradient,
      border: 'none',
      borderRadius: '30px',
      fontSize: isMobile ? '12px' : '14px',
      fontWeight: '500',
      color: 'white',
      cursor: 'pointer',
      boxShadow: `0 10px 15px -3px ${orangeSoft}60`,
    },
    mainContent: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? '20px' : '30px',
      marginTop: '20px',
    },
    leftColumn: {
      flex: '2',
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
    },
    warnaBox: {
      width: '100%',
      height: isMobile ? '100px' : '140px',
      borderRadius: '12px',
      marginBottom: '12px',
      border: `1px solid ${borderColor}`,
      transition: 'all 0.3s',
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
    warnaStatus: {
      fontSize: isMobile ? '10px' : '12px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    rightColumn: {
      flex: '1',
      position: isMobile ? 'relative' : 'sticky',
      top: '20px',
      height: 'fit-content',
    },
    selectedSection: {
      background: bgWarm,
      borderRadius: isMobile ? '16px' : '24px',
      padding: isMobile ? '20px' : '30px',
      border: `1px solid ${borderColor}`,
      boxShadow: `0 20px 25px -5px ${brownColor}20`,
    },
    selectedTitle: {
      fontSize: isMobile ? '16px' : '20px',
      fontWeight: '600',
      color: brownColor,
      marginBottom: '16px',
      paddingBottom: '8px',
      borderBottom: `2px solid ${borderColor}`,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    selectedPreview: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
    },
    selectedBox: {
      width: isMobile ? '140px' : '180px',
      height: isMobile ? '140px' : '180px',
      borderRadius: '20px',
      border: '4px solid white',
      boxShadow: `0 20px 25px -5px ${brownColor}30`,
      marginBottom: '16px',
    },
    selectedNomor: {
      fontSize: isMobile ? '11px' : '13px',
      fontWeight: '700',
      color: textLight,
      marginBottom: '5px',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      fontFamily: 'monospace',
    },
    selectedNama: {
      fontSize: isMobile ? '18px' : '24px',
      fontWeight: '700',
      color: brownColor,
      marginBottom: '6px',
    },
    selectedKode: {
      fontSize: isMobile ? '13px' : '16px',
      color: textLight,
      fontFamily: 'monospace',
      marginBottom: '10px',
    },
    emptyState: {
      textAlign: 'center',
      color: textLight,
      padding: isMobile ? '20px' : '40px 20px',
      fontSize: isMobile ? '13px' : '16px',
    },
    selectionInfo: {
      fontSize: isMobile ? '11px' : '13px',
      color: orangeSoft,
      marginTop: '5px',
    },

    comparisonToolbar: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flexWrap: 'wrap',
      marginBottom: '16px',
      padding: '12px 16px',
      backgroundColor: bgWarm,
      borderRadius: '12px',
      border: `1px solid ${borderColor}`,
    },
    comparisonButton: {
      padding: isMobile ? '8px 16px' : '10px 24px',
      borderRadius: '30px',
      border: `1px solid ${borderColor}`,
      fontSize: isMobile ? '12px' : '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s',
      background: 'white',
      color: textLight,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
    },
    comparisonViewBtn: {
      padding: isMobile ? '8px 16px' : '10px 24px',
      borderRadius: '30px',
      border: 'none',
      backgroundColor: orangeSoft,
      color: 'white',
      fontSize: isMobile ? '12px' : '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
    },
    comparisonClearBtn: {
      padding: isMobile ? '6px 12px' : '8px 16px',
      borderRadius: '30px',
      border: '1px solid #ef4444',
      backgroundColor: 'white',
      color: '#ef4444',
      fontSize: isMobile ? '11px' : '13px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
    },
    comparisonCheckbox: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      marginTop: '8px',
      paddingTop: '8px',
      borderTop: `1px solid ${borderColor}`,
    },
    checkboxInput: {
      width: '18px',
      height: '18px',
      cursor: 'pointer',
      accentColor: orangeSoft,
    },
    checkboxLabel: {
      fontSize: isMobile ? '10px' : '12px',
      color: textLight,
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '24px',
      padding: isMobile ? '24px' : '40px',
      maxWidth: '900px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto',
      position: 'relative',
    },
    modalClose: {
      position: 'absolute',
      top: '16px',
      right: '20px',
      background: 'none',
      border: 'none',
      fontSize: '28px',
      cursor: 'pointer',
      color: textLight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalTitle: {
      fontSize: isMobile ? '20px' : '28px',
      fontWeight: '700',
      color: brownColor,
      marginBottom: '4px',
    },
    modalSubtitle: {
      fontSize: isMobile ? '13px' : '15px',
      color: textLight,
      marginBottom: '24px',
    },
    comparisonGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile
        ? 'repeat(auto-fill, minmax(140px, 1fr))'
        : 'repeat(auto-fill, minmax(180px, 1fr))',
      gap: '16px',
      marginBottom: '24px',
    },
    comparisonItem: {
      textAlign: 'center',
      padding: '16px',
      borderRadius: '16px',
      border: `1px solid ${borderColor}`,
      backgroundColor: 'white',
      position: 'relative',
    },
    comparisonColorBox: {
      width: '100%',
      height: isMobile ? '100px' : '140px',
      borderRadius: '12px',
      marginBottom: '12px',
      border: `1px solid ${borderColor}`,
    },
    comparisonNomor: {
      fontSize: '11px',
      fontWeight: '700',
      color: textLight,
      fontFamily: 'monospace',
      marginBottom: '2px',
    },
    comparisonNama: {
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: '600',
      color: brownColor,
      marginBottom: '2px',
    },
    comparisonKode: {
      fontSize: '12px',
      color: textLight,
      fontFamily: 'monospace',
      marginBottom: '2px',
    },
    comparisonKategori: {
      fontSize: '11px',
      color: textLight,
      marginBottom: '4px',
    },
    comparisonStatus: {
      fontSize: '12px',
      fontWeight: '500',
    },
    comparisonCloseBtn: {
      width: '100%',
      padding: '14px',
      borderRadius: '40px',
      border: 'none',
      backgroundColor: brownColor,
      color: 'white',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s',
    },
    comparisonChips: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      alignItems: 'center',
      marginLeft: '8px',
    },
    comparisonChip: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 10px 4px 6px',
      borderRadius: '30px',
      backgroundColor: 'white',
      border: `1px solid ${borderColor}`,
      fontSize: isMobile ? '11px' : '12px',
    },
    chipColor: {
      width: '18px',
      height: '18px',
      borderRadius: '50%',
      border: `1px solid ${borderColor}`,
      flexShrink: 0,
    },
    chipRemove: {
      background: 'none',
      border: 'none',
      color: '#ef4444',
      cursor: 'pointer',
      padding: '2px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      transition: 'all 0.2s',
    },
  }

  // ===== LOADING =====
  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.emptyState}>
            <MdColorLens
              size={48}
              style={{ color: textLight, marginBottom: '10px' }}
            />
            <p>Memuat data warna...</p>
          </div>
        </div>
      </div>
    )
  }

  // ===== RENDER =====
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.navWrapper}>
          <NavbarFitur isMobile={isMobile} />
        </div>

        <h1 style={styles.header}>
          <MdColorLens
            size={isMobile ? 28 : 38}
            style={{ color: orangeSoft }}
          />
          Nazar Paint Studio
        </h1>
        <p style={styles.subheader}>Visualisasikan warna impian Anda</p>

        <div style={styles.simulasiSection}>
          <h2 style={styles.simulasiTitle}>
            <HiSparkles size={isMobile ? 20 : 24} color={orangeSoft} />
            Simulasi Warna Digital
          </h2>

          <div style={styles.simulasiContainer}>
            <div style={styles.uploadArea}>
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                style={styles.hiddenInput}
                id="upload-foto"
              />
              <label htmlFor="upload-foto" style={styles.uploadLabel}>
                <BsCameraFill style={styles.uploadIcon} />
                <span style={styles.uploadText}>Upload Foto Ruangan</span>
                <span style={styles.uploadSubtext}>
                  Klik untuk memilih foto (JPG, PNG)
                </span>
              </label>
            </div>

            <div style={styles.previewArea}>
              {!gambarPreview ? (
                <div style={styles.emptyPreview}>
                  <FiImage style={styles.emptyPreviewIcon} />
                  <p style={styles.emptyPreviewText}>Belum ada foto</p>
                  <p style={styles.emptyPreviewSubtext}>
                    Upload foto ruangan untuk memulai simulasi
                  </p>
                </div>
              ) : (
                <>
                  <div style={styles.canvasContainer}>
                    <canvas
                      ref={canvasRef}
                      style={styles.canvas}
                      onMouseDown={handleCanvasMouseDown}
                      onMouseMove={handleCanvasMouseMove}
                      onMouseUp={handleCanvasMouseUp}
                      onMouseLeave={handleCanvasMouseLeave}
                      onTouchStart={handleCanvasTouch}
                      onTouchMove={handleCanvasTouchMove}
                    />
                  </div>
                  <div style={styles.simulasiControls}>
                    <div style={styles.controlRow}>
                      <div style={styles.opacityControl}>
                        <div style={styles.opacityLabel}>
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <FiSliders size={isMobile ? 12 : 14} /> Transparansi
                            Warna
                          </span>
                          <span>{Math.round(opacity * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={opacity}
                          onChange={(e) =>
                            setOpacity(parseFloat(e.target.value))
                          }
                          style={styles.opacitySlider}
                        />
                      </div>
                    </div>

                    <div style={styles.controlRow}>
                      <button
                        style={{
                          ...styles.filterButton,
                          backgroundColor: selectionMode ? orangeSoft : 'white',
                          color: selectionMode ? 'white' : textLight,
                          borderColor: selectionMode ? orangeSoft : borderColor,
                          minWidth: isMobile ? '140px' : '180px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                        onClick={() => setSelectionMode(!selectionMode)}
                      >
                        <MdBrush size={isMobile ? 14 : 16} />
                        {selectionMode ? 'Mode ON' : 'Mode OFF'}
                      </button>

                      {selectionMode && (
                        <div style={styles.brushControl}>
                          <MdBrush
                            size={isMobile ? 14 : 16}
                            color={textLight}
                          />
                          <span
                            style={{
                              fontSize: isMobile ? '12px' : '14px',
                              fontWeight: '500',
                              color: textLight,
                            }}
                          >
                            Kuas: {brushSize}px
                          </span>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            value={brushSize}
                            onChange={(e) =>
                              setBrushSize(parseInt(e.target.value))
                            }
                            style={styles.brushSlider}
                          />
                          <span style={{ 
                            fontSize: isMobile ? '8px' : '10px', 
                            color: '#78716C',
                            whiteSpace: 'nowrap'
                          }}>
                            ⚡ 10-30px terbaik
                          </span>
                        </div>
                      )}
                    </div>

                    <div style={styles.controlRow}>
                      {selectedAreas.length > 0 && (
                        <>
                          <button
                            style={{
                              ...styles.filterButton,
                              backgroundColor: orangeSoft,
                              color: 'white',
                              borderColor: orangeSoft,
                              minWidth: isMobile ? '80px' : '100px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                            onClick={handleUndo}
                          >
                            <FiRotateCcw size={isMobile ? 12 : 14} /> Undo
                          </button>
                          <button
                            style={{
                              ...styles.filterButton,
                              backgroundColor: '#dc3545',
                              color: 'white',
                              borderColor: '#dc3545',
                              minWidth: isMobile ? '100px' : '120px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                            onClick={handleClearAll}
                          >
                            <FiTrash2 size={isMobile ? 12 : 14} /> Hapus
                          </button>
                        </>
                      )}

                      {/* 🔥 TOMBOL SIMPAN SIMULASI */}
                      <button
                        style={{
                          ...styles.filterButton,
                          backgroundColor: '#10b981',
                          color: 'white',
                          borderColor: '#10b981',
                          minWidth: isMobile ? '100px' : '160px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                        onClick={handleSimpanSimulasi}
                        disabled={isSaving || warnaSementara.length === 0}
                      >
                        {isSaving ? (
                          <span>⏳ Menyimpan...</span>
                        ) : (
                          <>
                            <FiCheckCircle size={isMobile ? 12 : 14} /> Simpan Simulasi
                          </>
                        )}
                      </button>

                      <button
                        style={{
                          ...styles.filterButton,
                          backgroundColor: brownColor,
                          color: 'white',
                          borderColor: brownColor,
                          minWidth: isMobile ? '80px' : '100px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                        onClick={handleReset}
                      >
                        <FiRotateCcw size={isMobile ? 12 : 14} /> Reset
                      </button>
                    </div>

                    {/* 🔥 INDIKATOR WARNA YANG SUDAH DICOBA */}
                    {warnaSementara.length > 0 && (
                      <div
                        style={{
                          ...styles.selectionInfo,
                          backgroundColor: `${orangeSoft}10`,
                          border: `1px solid ${orangeSoft}50`,
                          color: orangeSoft,
                          padding: '8px 16px',
                          borderRadius: '20px',
                          fontSize: isMobile ? '11px' : '13px',
                          fontWeight: '500',
                          textAlign: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <MdPalette size={isMobile ? 14 : 16} />
                        Warna dicoba: {warnaSementara.join(', ')}
                        <span style={{ fontSize: '10px', color: '#78716C' }}>
                          (Klik "Simpan Simulasi" untuk simpan ke riwayat)
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <h2 style={styles.katalogTitle}>
          <BsGrid3X3Gap size={isMobile ? 18 : 22} color={orangeSoft} />
          Pilih Warna untuk Simulasi
        </h2>

        {/* ===== COMPARISON TOOLBAR ===== */}
        <div style={styles.comparisonToolbar}>
          <button
            style={{
              ...styles.comparisonButton,
              background: comparisonMode ? orangeSoft : 'white',
              color: comparisonMode ? 'white' : textLight,
              borderColor: comparisonMode ? orangeSoft : borderColor,
            }}
            onClick={() => setComparisonMode(!comparisonMode)}
          >
            <FiGrid size={isMobile ? 12 : 14} />
            {comparisonMode ? 'Mode Banding ON' : 'Bandingkan Warna'}
          </button>

          {selectedForComparison.length > 0 && (
            <div style={styles.comparisonChips}>
              {selectedForComparison.map((warna) => (
                <span key={warna.id} style={styles.comparisonChip}>
                  <span
                    style={{
                      ...styles.chipColor,
                      backgroundColor: warna.kode_hex,
                    }}
                  />
                  <span>{warna.nomor_seri}</span>
                  <button
                    style={styles.chipRemove}
                    onClick={() => removeOneFromComparison(warna.id)}
                    title={`Hapus ${warna.nama}`}
                  >
                    <FiX size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {selectedForComparison.length >= 2 && (
            <button
              style={styles.comparisonViewBtn}
              onClick={openComparison}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = orangeSoftLight
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = orangeSoft
              }}
            >
              <MdPalette size={14} /> Lihat Perbandingan
            </button>
          )}

          {selectedForComparison.length > 0 && (
            <button
              style={styles.comparisonClearBtn}
              onClick={resetComparison}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fecaca'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white'
              }}
            >
              <FiTrash2 size={14} /> Hapus Semua
            </button>
          )}
        </div>

        {/* ===== SEARCH ===== */}
        <div style={styles.searchSection}>
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder={
                searchMode === 'nama'
                  ? 'Cari warna berdasarkan nama...'
                  : 'Cari berdasarkan nomor seri...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = orangeSoft
                e.currentTarget.style.boxShadow = `0 0 0 3px ${orangeSoft}20`
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = borderColor
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
            <div style={styles.searchButtons}>
              <button
                style={
                  searchMode === 'nama'
                    ? styles.searchModeButtonAktif
                    : styles.searchModeButton
                }
                onClick={() => setSearchMode('nama')}
              >
                <BsFonts size={isMobile ? 12 : 14} /> Nama
              </button>
              <button
                style={
                  searchMode === 'nomor_seri'
                    ? styles.searchModeButtonAktif
                    : styles.searchModeButton
                }
                onClick={() => setSearchMode('nomor_seri')}
              >
                <BsHash size={isMobile ? 12 : 14} /> Nomor Seri
              </button>
            </div>
          </div>
          {searchTerm && (
            <div style={styles.searchInfo}>
              ✓ Menampilkan {filteredWarna.length} dari {warnaList.length}{' '}
              warna
            </div>
          )}
        </div>

        {/* ===== STOK FILTER ===== */}
        <div style={styles.stokSection}>
          <span style={styles.stokLabel}> Filter Stok:</span>
          <div style={styles.stokButtons}>
            <button
              style={
                filterStok === 'semua'
                  ? styles.stokButtonAktif
                  : styles.stokButton
              }
              onClick={() => setFilterStok('semua')}
            >
              <MdGridView size={isMobile ? 12 : 14} /> Semua
            </button>
            <button
              style={
                filterStok === 'tersedia'
                  ? styles.stokButtonAktif
                  : styles.stokButton
              }
              onClick={() => setFilterStok('tersedia')}
            >
              <HiCheckCircle size={isMobile ? 12 : 14} /> Tersedia (
              {warnaList.filter((w) => w.tersedia).length})
            </button>
            <button
              style={
                filterStok === 'habis'
                  ? styles.stokButtonAktif
                  : styles.stokButton
              }
              onClick={() => setFilterStok('habis')}
            >
              <HiXCircle size={isMobile ? 12 : 14} /> Habis (
              {warnaList.filter((w) => !w.tersedia).length})
            </button>
          </div>
        </div>

        {/* ===== FILTER KATEGORI ===== */}
        <div style={styles.filterSection}>
          {[
            'Semua',
            'Merah',
            'Pink',
            'Coral',
            'Orange',
            'Kuning',
            'Hijau',
            'Biru',
            'Ungu',
            'Netral',
          ].map((filter) => (
            <button
              key={filter}
              style={
                filterAktif === filter
                  ? styles.filterButtonAktif
                  : styles.filterButton
              }
              onClick={() => setFilterAktif(filter)}
              onMouseEnter={(e) => {
                if (filterAktif !== filter) {
                  e.currentTarget.style.borderColor = orangeSoft
                  e.currentTarget.style.color = orangeSoft
                }
              }}
              onMouseLeave={(e) => {
                if (filterAktif !== filter) {
                  e.currentTarget.style.borderColor = borderColor
                  e.currentTarget.style.color = textLight
                }
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* ===== MAIN CONTENT ===== */}
        <div style={styles.mainContent}>
          <div id="fitur-katalog" style={styles.leftColumn}>
            <div style={styles.warnaGrid}>
              {filteredWarna.map((warna) => {
                const isSelected = selectedForComparison.some(
                  (w) => w.id === warna.id
                )
                return (
                  <div
                    key={warna.id}
                    style={{
                      ...styles.warnaCard,
                      border:
                        warnaSimulasi?.id === warna.id
                          ? `2px solid ${orangeSoft}`
                          : isSelected
                          ? `3px solid #10b981`
                          : '2px solid transparent',
                    }}
                    onClick={() => {
                      if (comparisonMode) {
                        toggleComparison(warna)
                      } else {
                        handleWarnaClick(warna)
                      }
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.boxShadow = `0 20px 25px -8px ${brownColor}30`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = `0 4px 6px -1px ${brownColor}15`
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
                    <p
                      style={{
                        ...styles.warnaStatus,
                        color: warna.tersedia ? '#10b981' : '#ef4444',
                      }}
                    >
                      {warna.tersedia ? (
                        <HiCheckCircle size={isMobile ? 11 : 13} />
                      ) : (
                        <HiXCircle size={isMobile ? 11 : 13} />
                      )}
                      {warna.tersedia ? ' Tersedia' : ' Habis'}
                    </p>

                    {comparisonMode && (
                      <div style={styles.comparisonCheckbox}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleComparison(warna)}
                          style={styles.checkboxInput}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span style={styles.checkboxLabel}>
                          {isSelected ? (
                            <>
                              <HiCheckCircle size={12} color="#10b981" /> Dipilih
                            </>
                          ) : (
                            <>
                              <FiPlus size={12} /> Pilih untuk dibandingkan
                            </>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div style={styles.rightColumn}>
            {warnaTerpilih ? (
              <div style={styles.selectedSection}>
                <h3 style={styles.selectedTitle}>
                  <TbTargetArrow size={isMobile ? 16 : 20} color={orangeSoft} />{' '}
                  Warna Aktif
                </h3>
                <div style={styles.selectedPreview}>
                  <div
                    style={{
                      ...styles.selectedBox,
                      backgroundColor: warnaTerpilih.kode_hex,
                    }}
                  />
                  <p style={styles.selectedNomor}>{warnaTerpilih.nomor_seri}</p>
                  <p style={styles.selectedNama}>{warnaTerpilih.nama}</p>
                  <p style={styles.selectedKode}>{warnaTerpilih.kode_hex}</p>
                  <p
                    style={{
                      ...styles.warnaStatus,
                      color: warnaTerpilih.tersedia ? '#10b981' : '#ef4444',
                      justifyContent: 'center',
                      fontSize: isMobile ? '12px' : '14px',
                    }}
                  >
                    {warnaTerpilih.tersedia ? (
                      <HiCheckCircle size={isMobile ? 13 : 15} />
                    ) : (
                      <HiXCircle size={isMobile ? 13 : 15} />
                    )}
                    {warnaTerpilih.tersedia
                      ? ' Tersedia di toko'
                      : ' Stok habis'}
                  </p>
                </div>
              </div>
            ) : (
              <div style={styles.selectedSection}>
                <h3 style={styles.selectedTitle}>
                  <TbTargetArrow size={isMobile ? 16 : 20} color={orangeSoft} />{' '}
                  Warna Aktif
                </h3>
                <div style={styles.emptyState}>
                  <MdColorLens
                    size={isMobile ? 36 : 48}
                    style={{ color: textLight, marginBottom: '10px' }}
                  />
                  <p>
                    Klik warna di samping
                    <br />
                    untuk simulasi
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== COMPARISON MODAL ===== */}
      {showComparison && (
        <div style={styles.modalOverlay} onClick={closeComparison}>
          <div
            style={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button style={styles.modalClose} onClick={closeComparison}>
              <FiX size={24} />
            </button>

            <h2 style={styles.modalTitle}>🎨 Perbandingan Warna</h2>
            <p style={styles.modalSubtitle}>
              {selectedForComparison.length} warna dipilih untuk dibandingkan
            </p>

            <div style={styles.comparisonGrid}>
              {selectedForComparison.map((warna) => (
                <div key={warna.id} style={styles.comparisonItem}>
                  <div
                    style={{
                      ...styles.comparisonColorBox,
                      backgroundColor: warna.kode_hex,
                    }}
                  />
                  <p style={styles.comparisonNomor}>{warna.nomor_seri}</p>
                  <p style={styles.comparisonNama}>{warna.nama}</p>
                  <p style={styles.comparisonKode}>{warna.kode_hex}</p>
                  <p style={styles.comparisonKategori}>{warna.kategori}</p>
                  <p
                    style={{
                      ...styles.comparisonStatus,
                      color: warna.tersedia ? '#10b981' : '#ef4444',
                    }}
                  >
                    {warna.tersedia ? '✅ Tersedia' : '❌ Habis'}
                  </p>
                </div>
              ))}
            </div>

            <button
              style={styles.comparisonCloseBtn}
              onClick={closeComparison}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = brownLight
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = brownColor
              }}
            >
              Tutup Perbandingan
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default WarnaPage