import { useState, useEffect } from 'react'
import { FaBoxes, FaSearch, FaEdit, FaTrash } from 'react-icons/fa'
import { HiCheckCircle, HiXCircle } from 'react-icons/hi'
import Swal from 'sweetalert2'

function StokTab({
  searchTerm,
  setSearchTerm,
  filterKategori,
  setFilterKategori,
  onEditWarna,
  onDeleteWarna,
  styles,
  isMobile,
}) {
  const [warnaList, setWarnaList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const kategoriList = [
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
  ]

  // ===== FETCH DATA DARI BACKEND =====
  const fetchWarna = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8081/api/v1.0/warna')
      const result = await response.json()
      if (result.status === 'success') {
        setWarnaList(result.data)
      } else {
        setError('Gagal mengambil data warna')
      }
    } catch (err) {
      setError('Gagal terhubung ke server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWarna()
  }, [])

  // ===== FILTER WARNA =====
  const getFilteredWarna = () => {
    let filtered = warnaList

    if (filterKategori !== 'Semua') {
      filtered = filtered.filter((w) => w.kategori === filterKategori)
    }

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim()
      filtered = filtered.filter(
        (w) =>
          w.nama.toLowerCase().includes(term) ||
          w.nomor_seri.toLowerCase().includes(term),
      )
    }

    return filtered
  }

  const filteredWarna = getFilteredWarna()

  // ===== HANDLE DELETE DENGAN SWEETALERT2 =====
  const handleDelete = async (id, nama) => {
    const result = await Swal.fire({
      title: `Hapus "${nama}"?`,
      text: 'Data warna akan dihapus permanen!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748B',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      reverseButtons: true,
    })

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:8081/api/v1.0/warna/${id}`,
          {
            method: 'DELETE',
          },
        )
        const resultData = await response.json()

        if (resultData.status === 'success') {
          await Swal.fire({
            title: 'Berhasil!',
            text: `Warna "${nama}" berhasil dihapus`,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
          })
          // Refresh data
          fetchWarna()
          // Panggil onDeleteWarna dari parent untuk update state global
          if (onDeleteWarna) {
            onDeleteWarna(id)
          }
        } else {
          await Swal.fire({
            title: 'Error!',
            text: 'Gagal menghapus warna',
            icon: 'error',
            confirmButtonColor: '#EA580C',
          })
        }
      } catch (err) {
        await Swal.fire({
          title: 'Error!',
          text: 'Gagal terhubung ke server',
          icon: 'error',
          confirmButtonColor: '#EA580C',
        })
      }
    }
  }

  // ===== RENDER =====
  if (loading) {
    return (
      <div style={styles.emptyState}>
        <p>Memuat data warna...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={styles.emptyState}>
        <p style={{ color: '#ef4444' }}>{error}</p>
        <button
          onClick={fetchWarna}
          style={{
            padding: '8px 20px',
            background: '#667eea',
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
    <>
      <div style={styles.pageTitle}>
        <FaBoxes /> Stok Warna
        <span style={styles.badge}>
          {filteredWarna.length} dari {warnaList.length}
        </span>
      </div>

      {/* SEARCH BAR */}
      <div style={styles.searchSection}>
        <div style={styles.searchContainer}>
          <div style={styles.searchInputWrapper}>
            <FaSearch style={styles.searchIcon} />
            <input
              type="text"
              style={styles.searchInput}
              placeholder="Cari berdasarkan nama warna..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {searchTerm && (
          <div style={styles.searchInfo}>
            ✓ Menampilkan {filteredWarna.length} dari {warnaList.length} warna
          </div>
        )}
      </div>

      {/* FILTER KATEGORI */}
      <div style={styles.filterSection}>
        {kategoriList.map((kategori) => (
          <button
            key={kategori}
            style={
              filterKategori === kategori
                ? styles.filterButtonAktif
                : styles.filterButton
            }
            onClick={() => setFilterKategori(kategori)}
          >
            {kategori}
          </button>
        ))}
      </div>

      {/* GRID CARD WARNA */}
      {filteredWarna.length > 0 ? (
        <div style={styles.cardGrid}>
          {filteredWarna.map((warna) => (
            <div key={warna.id} style={styles.card}>
              <div style={styles.cardTopRow}>
                <div
                  style={{
                    ...styles.colorSwatch,
                    backgroundColor: warna.kode_hex,
                  }}
                />
                <div>
                  <p style={styles.cardWarnaNama}>{warna.nama}</p>
                  <p style={styles.cardNomor}>{warna.nomor_seri}</p>
                </div>
              </div>

              <div style={styles.cardMeta}>
                <span style={styles.metaChip}>{warna.kategori}</span>
                <span style={styles.metaChip}>{warna.kode_hex}</span>
                <span style={styles.statusBadge(warna.tersedia)}>
                  {warna.tersedia ? (
                    <HiCheckCircle size={14} />
                  ) : (
                    <HiXCircle size={14} />
                  )}
                  {warna.tersedia ? 'Tersedia' : 'Habis'}
                </span>
              </div>

              <div style={styles.cardActions}>
                <button
                  style={styles.btnEdit}
                  onClick={() => onEditWarna(warna)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <FaEdit size={14} /> Edit
                </button>
                <button
                  style={styles.btnDelete}
                  onClick={() => handleDelete(warna.id, warna.nama)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <FaTrash size={14} /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <p>Tidak ada warna yang ditemukan</p>
          <p style={{ fontSize: '13px', marginTop: '8px' }}>
            Coba kata kunci lain atau ubah filter kategori
          </p>
        </div>
      )}
    </>
  )
}

export default StokTab