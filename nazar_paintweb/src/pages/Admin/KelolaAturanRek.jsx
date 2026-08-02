import { useState, useEffect } from 'react';
import { 
  FaSlidersH, FaPlus, FaEdit, FaTrash, FaTimes, 
  FaSmile, FaHome, FaChartLine, FaLightbulb, FaCheckCircle, 
  FaFilter, FaSearch, FaCheck, FaChevronRight, FaEye, 
  FaInfoCircle, FaBoxOpen, FaDatabase, FaCloudUploadAlt, 
  FaUndo, FaPalette, FaArrowLeft, FaArrowRight,
  FaRegLightbulb
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import { 
  ruanganOptions, 
  suasanaOptions,
  suasanaOptionsLainnya,
} from '../../utils/rekomendasiRules';

// Warna Admin
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
  gradient: 'linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)',
};

function KelolaAturanRek({ styles: propStyles, isMobile }) {
  // ========== STATE ==========
  const [aturanList, setAturanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [warnaOptions, setWarnaOptions] = useState([]);
  const [selectedRuangan, setSelectedRuangan] = useState('Kamar Tidur');
  const [filterKategori, setFilterKategori] = useState('Semua');
  const [searchWarna, setSearchWarna] = useState('');
  const [selectedWarnaList, setSelectedWarnaList] = useState([]);
  const [expandedRuangan, setExpandedRuangan] = useState('Kamar Tidur');
  
  const [formData, setFormData] = useState({
    jenisRuangan: 'Kamar Tidur',
    suasana: 'Calming',
    warnaRekomendasi: [],
  });

  const kategoriOptions = [
    'Semua', 'Merah', 'Pink', 'Coral', 'Orange', 
    'Kuning', 'Hijau', 'Biru', 'Ungu', 'Netral'
  ];

  // ========== API BASE URL ==========
  const API_BASE = `${import.meta.env.VITE_API_URL}/api/v1.0`;

  // ========== SIMPAN RIWAYAT ADMIN ==========
  const simpanRiwayatAdmin = async (aktivitas, detail) => {
    try {
      const adminName = localStorage.getItem('adminName') || 'Admin';
      const adminId = localStorage.getItem('adminId') || 1;
      
      await fetch(`${import.meta.env.VITE_API_URL}/api/v1.0/riwayat/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_id: parseInt(adminId),
          admin_name: adminName,
          aktivitas: aktivitas,
          detail: detail,
        }),
      });
    } catch (error) {
      console.error('Gagal simpan riwayat:', error);
    }
  };

  // ========== FETCH ATURAN DARI BACKEND ==========
  const fetchAturan = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/rekomendasi/aturan`);
      const result = await response.json();
      if (result.status === 'success') {
        setAturanList(result.data);
      } else {
        setError('Gagal mengambil data aturan');
      }
    } catch (err) {
      setError('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  // ========== FETCH WARNA DARI BACKEND ==========
  const fetchWarna = async () => {
    try {
      const response = await fetch(`${API_BASE}/warna`);
      const result = await response.json();
      if (result.status === 'success') {
        setWarnaOptions(result.data.filter(w => w.tersedia === true));
      }
    } catch (err) {
      console.error('Gagal fetch warna:', err);
    }
  };

  useEffect(() => {
    fetchAturan();
    fetchWarna();
  }, []);

  // ========== FUNGSI CRUD ==========
  const filteredWarnaOptions = warnaOptions.filter(w => {
    const matchKategori = filterKategori === 'Semua' || w.kategori === filterKategori;
    const matchSearch = searchWarna === '' || 
      w.nama.toLowerCase().includes(searchWarna.toLowerCase()) || 
      w.kode_hex.toLowerCase().includes(searchWarna.toLowerCase()) ||  
      w.nomor_seri?.toLowerCase().includes(searchWarna.toLowerCase()); 
    return matchKategori && matchSearch;
  });

  const toggleWarna = (warnaNama) => {
    setSelectedWarnaList(prev => {
      if (prev.includes(warnaNama)) {
        return prev.filter(w => w !== warnaNama);
      } else {
        return [...prev, warnaNama];
      }
    });
  };

  const removeSelectedWarna = (warnaNama) => {
    setSelectedWarnaList(prev => prev.filter(w => w !== warnaNama));
  };

  // ========== HANDLE TAMBAH/UPDATE DENGAN SWEETALERT2 ==========
  const handleAddOrUpdate = async () => {
    if (selectedWarnaList.length === 0) {
      Swal.fire({
        title: 'Error!',
        text: 'Pilih minimal satu warna rekomendasi!',
        icon: 'error',
        confirmButtonColor: '#EA580C',
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/rekomendasi/aturan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ruangan: formData.jenisRuangan,
          suasana: formData.suasana,
          warna_rekomendasi: selectedWarnaList.join(', '),
        }),
      });

      const result = await response.json();
      if (result.status === 'success') {
        await simpanRiwayatAdmin(
          editId ? 'Edit Aturan' : 'Tambah Aturan',
          `${editId ? 'Mengubah' : 'Menambah'} aturan "${formData.jenisRuangan} - ${formData.suasana}" dengan ${selectedWarnaList.length} warna`
        );
        
        Swal.fire({
          title: 'Berhasil!',
          text: 'Aturan rekomendasi berhasil disimpan!',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
        
        fetchAturan();
        setShowForm(false);
        setFormData({
          jenisRuangan: 'Kamar Tidur',
          suasana: 'Calming',
          warnaRekomendasi: [],
        });
        setSelectedWarnaList([]);
        setFilterKategori('Semua');
        setSearchWarna('');
        setEditId(null);
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Gagal menyimpan aturan: ' + (result.message || ''),
          icon: 'error',
          confirmButtonColor: '#EA580C',
        });
      }
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: 'Gagal terhubung ke server',
        icon: 'error',
        confirmButtonColor: '#EA580C',
      });
    }
  };

  // ========== HANDLE EDIT ==========
  const handleEdit = (aturan) => {
    const warnaArray = aturan.warna_rekomendasi.split(',').map(s => s.trim());
    setFormData({
      jenisRuangan: aturan.ruangan,
      suasana: aturan.suasana,
      warnaRekomendasi: warnaArray,
    });
    setSelectedWarnaList(warnaArray);
    setEditId(aturan.id);
    setShowForm(true);
  };

  // ========== HANDLE DELETE DENGAN SWEETALERT2 ==========
  const handleDeleteRule = async (ruangan, suasana) => {
    Swal.fire({
      title: `Hapus aturan "${ruangan} - ${suasana}"?`,
      text: 'Aturan rekomendasi akan dihapus permanen!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748B',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `${API_BASE}/rekomendasi/aturan/${encodeURIComponent(ruangan)}/${encodeURIComponent(suasana)}`,
            { method: 'DELETE' }
          );
          const resultData = await response.json();
          
          if (resultData.status === 'success') {
            await simpanRiwayatAdmin('Hapus Aturan', `Menghapus aturan "${ruangan} - ${suasana}"`);
            
            Swal.fire({
              title: 'Berhasil!',
              text: 'Aturan berhasil dihapus!',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
            });
            fetchAturan();
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'Gagal menghapus aturan: ' + (resultData.message || ''),
              icon: 'error',
              confirmButtonColor: '#EA580C',
            });
          }
        } catch (err) {
          Swal.fire({
            title: 'Error!',
            text: 'Gagal terhubung ke server',
            icon: 'error',
            confirmButtonColor: '#EA580C',
          });
        }
      }
    });
  };

  // ========== KONFIRMASI TUTUP FORM ==========
  const handleCloseForm = () => {
    if (selectedWarnaList.length > 0) {
      Swal.fire({
        title: 'Batal?',
        text: 'Perubahan yang belum disimpan akan hilang.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#EA580C',
        cancelButtonColor: '#64748B',
        confirmButtonText: 'Ya, Batal!',
        cancelButtonText: 'Kembali',
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          setShowForm(false);
          setSelectedWarnaList([]);
          setFilterKategori('Semua');
          setSearchWarna('');
          setEditId(null);
        }
      });
    } else {
      setShowForm(false);
      setSelectedWarnaList([]);
      setFilterKategori('Semua');
      setSearchWarna('');
      setEditId(null);
    }
  };

  // Aturan rekomendasi untuk ruangan "Lainnya" ini yang dipakai sebagai
  // fallback bagi SEMUA nama ruangan custom yang diketik pelanggan
  // (lihat getRekomendasi() di rekomendasiRules.js). Karena itu opsi
  // suasananya juga pakai daftar khusus suasanaOptionsLainnya (7 opsi),
  // bukan cuma ['Calming'] seperti sebelumnya.
  const getSuasanaOptionsForRuangan = () => {
    if (formData.jenisRuangan === 'Lainnya') {
      return suasanaOptionsLainnya;
    }
    return suasanaOptions[formData.jenisRuangan] || ['Calming'];
  };

  // ========== GROUP ATURAN ==========
  const groupedAturan = aturanList.reduce((acc, aturan) => {
    if (!acc[aturan.ruangan]) {
      acc[aturan.ruangan] = [];
    }
    acc[aturan.ruangan].push(aturan);
    return acc;
  }, {});

  const toggleRuanganExpand = (ruangan) => {
    setExpandedRuangan(expandedRuangan === ruangan ? null : ruangan);
  };

  const getAturanCountPerRuangan = () => {
    const count = {};
    ruanganOptions.forEach(ruang => {
      count[ruang] = aturanList.filter(a => a.ruangan === ruang).length;
    });
    return count;
  };
  
  const aturanCount = getAturanCountPerRuangan();

  // ========== STYLE ==========
  const styles = {
    ...propStyles,
    container: { padding: isMobile ? '12px' : '20px' },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      flexWrap: 'wrap',
      gap: '12px',
    },
    title: {
      fontSize: isMobile ? '20px' : '24px',
      fontWeight: '700',
      color: adminColors.dark,
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    btnPrimary: {
      padding: isMobile ? '10px 18px' : '12px 24px',
      background: adminColors.gradient,
      color: 'white',
      border: 'none',
      borderRadius: '30px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    previewCard: {
      background: adminColors.bgCard,
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '24px',
      border: `1px solid ${adminColors.border}`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
    sectionTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '16px',
      fontWeight: '600',
      color: adminColors.dark,
      marginBottom: '16px',
      marginTop: 0,
    },
    ruanganTabs: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      marginBottom: '20px',
    },
    ruanganTab: (isActive) => ({
      padding: '6px 16px',
      borderRadius: '30px',
      border: 'none',
      background: isActive ? adminColors.gradient : adminColors.bgHover,
      color: isActive ? 'white' : adminColors.text,
      fontWeight: '500',
      fontSize: '13px',
      cursor: 'pointer',
    }),
    previewItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '8px',
      padding: '12px',
      background: adminColors.bgHover,
      borderRadius: '12px',
      marginBottom: '8px',
    },
    modalBackdrop: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px',
    },
    modalSheet: {
      background: adminColors.bgCard,
      borderRadius: '24px',
      width: '100%',
      maxWidth: '800px',
      maxHeight: '90vh',
      overflowY: 'auto',
      padding: isMobile ? '20px' : '28px',
      position: 'relative',
    },
    modalHandle: {
      width: '40px',
      height: '4px',
      background: adminColors.border,
      borderRadius: '2px',
      margin: '0 auto 20px auto',
    },
    modalTitle: {
      fontSize: isMobile ? '18px' : '20px',
      fontWeight: '600',
      color: adminColors.dark,
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    formRow: {
      display: 'flex',
      gap: '16px',
      marginBottom: '20px',
      flexWrap: 'wrap',
    },
    formGroup: {
      flex: 1,
      minWidth: '150px',
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '13px',
      fontWeight: '600',
      color: adminColors.text,
      marginBottom: '8px',
    },
    select: {
      width: '100%',
      padding: '10px 12px',
      borderRadius: '12px',
      border: `1px solid ${adminColors.border}`,
      fontSize: '14px',
      background: adminColors.bgCard,
      cursor: 'pointer',
    },
    filterChips: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      marginBottom: '16px',
    },
    filterChip: (isActive) => ({
      padding: '6px 14px',
      borderRadius: '40px',
      border: isActive ? `2px solid ${adminColors.primary}` : `1px solid ${adminColors.border}`,
      background: isActive ? `${adminColors.primary}10` : 'white',
      color: isActive ? adminColors.primary : adminColors.textLight,
      fontSize: '12px',
      fontWeight: isActive ? '600' : '500',
      cursor: 'pointer',
    }),
    searchContainer: {
      position: 'relative',
      marginBottom: '16px',
      maxWidth: isMobile ? '280px' : '100%',
    },
    searchInput: {
      width: '100%',
      padding: isMobile ? '8px 12px 8px 32px' : '10px 12px 10px 36px',
      borderRadius: '12px',
      border: `1px solid ${adminColors.border}`,
      fontSize: isMobile ? '12px' : '14px',
      outline: 'none',
    },
    searchIcon: {
      position: 'absolute',
      left: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: adminColors.textLight,
      fontSize: isMobile ? '12px' : '14px',
    },
    warnaGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
      gap: '12px',
      maxHeight: '400px',
      overflowY: 'auto',
      padding: '4px',
    },
    warnaCardSelect: (isSelected) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px',
      borderRadius: '12px',
      border: isSelected ? `2px solid ${adminColors.primary}` : `1px solid ${adminColors.border}`,
      background: isSelected ? `${adminColors.primary}10` : 'white',
      cursor: 'pointer',
      transition: 'all 0.2s',
    }),
    selectedPreview: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      marginTop: '12px',
      padding: '12px',
      background: adminColors.bgHover,
      borderRadius: '12px',
    },
    selectedItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 8px 4px 6px',
      background: 'white',
      borderRadius: '20px',
      border: `1px solid ${adminColors.border}`,
    },
    actionButtons: {
      display: 'flex',
      gap: '12px',
      marginTop: '24px',
    },
    submitBtn: {
      flex: 1,
      padding: '12px',
      background: adminColors.gradient,
      color: 'white',
      border: 'none',
      borderRadius: '40px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    cancelBtn: {
      flex: 0.5,
      padding: '12px',
      background: adminColors.bgHover,
      color: adminColors.text,
      border: `1px solid ${adminColors.border}`,
      borderRadius: '40px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    cardGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '16px',
      marginBottom: '24px',
    },
    card: {
      background: adminColors.bgCard,
      borderRadius: '16px',
      padding: '16px',
      border: `1px solid ${adminColors.border}`,
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px',
    },
    warnaPreview: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexWrap: 'wrap',
      marginBottom: '12px',
    },
    warnaDot: {
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      border: `1px solid ${adminColors.border}`,
    },
    metaChip: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flexWrap: 'wrap',
      fontSize: '12px',
      color: adminColors.textLight,
    },
    btnEdit: {
      padding: '6px 12px',
      background: `${adminColors.primary}10`,
      color: adminColors.primary,
      border: 'none',
      borderRadius: '8px',
      fontSize: '12px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    btnDelete: {
      padding: '6px 12px',
      background: `${adminColors.danger}10`,
      color: adminColors.danger,
      border: 'none',
      borderRadius: '8px',
      fontSize: '12px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      background: adminColors.bgHover,
      borderRadius: '16px',
    },
    infoCard: {
      marginTop: '20px',
      padding: '16px',
      background: `${adminColors.warning}10`,
      borderLeft: `4px solid ${adminColors.warning}`,
      borderRadius: '12px',
    },
    groupHeader: {
      fontSize: isMobile ? '16px' : '18px',
      fontWeight: '600',
      color: adminColors.dark,
      marginBottom: '16px',
      paddingBottom: '8px',
      borderBottom: `2px solid ${adminColors.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      cursor: 'pointer',
    },
    guideCard: {
      background: `${adminColors.primary}05`,
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '20px',
      border: `1px solid ${adminColors.border}`,
    },
    guideContent: { marginTop: '8px' },
    guideItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '8px 0',
      borderBottom: `1px solid ${adminColors.border}`,
      fontSize: '13px',
      color: adminColors.text,
    },
    guideItemLast: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '8px 0',
      fontSize: '13px',
      color: adminColors.text,
    },
    stepBadge: {
      width: '22px',
      height: '22px',
      background: adminColors.primary,
      color: 'white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '11px',
      fontWeight: 'bold',
      flexShrink: 0,
    },
  };

  // ========== RENDER ==========
  if (loading && aturanList.length === 0) {
    return (
      <div style={styles.emptyState}>
        <p>Memuat data aturan rekomendasi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.emptyState}>
        <p style={{ color: '#ef4444' }}>{error}</p>
        <button
          onClick={fetchAturan}
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
    );
  }

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <h2 style={styles.title}>
          <FaSlidersH size={isMobile ? 20 : 24} color={adminColors.primary} />
          Kelola Aturan Rekomendasi
        </h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setFormData({
              jenisRuangan: 'Kamar Tidur',
              suasana: 'Calming',
              warnaRekomendasi: [],
            });
            setSelectedWarnaList([]);
            setFilterKategori('Semua');
            setSearchWarna('');
          }}
          style={styles.btnPrimary}
        >
          <FaPlus size={14} /> Tambah / Edit Aturan
        </button>
      </div>

      {/* PANDUAN */}
      <div style={styles.guideCard}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <FaRegLightbulb size={16} color={adminColors.primary} />
          <span style={{ fontWeight: '600', fontSize: '14px', color: adminColors.dark }}>Cara Kelola Aturan Rekomendasi</span>
        </div>
        <div style={styles.guideContent}>
          <div style={styles.guideItem}>
            <div style={styles.stepBadge}>1</div>
            <span>Pilih ruangan di tab bawah → lihat rekomendasi saat ini</span>
          </div>
          <div style={styles.guideItem}>
            <div style={styles.stepBadge}>2</div>
            <span>Klik <strong>"Tambah/Edit Aturan"</strong> → pilih ruangan & suasana</span>
          </div>
          <div style={styles.guideItem}>
            <div style={styles.stepBadge}>3</div>
            <span>Filter & cari warna yang diinginkan → klik kartu warna untuk memilih</span>
          </div>
          <div style={styles.guideItemLast}>
            <div style={styles.stepBadge}>4</div>
            <span>Klik <strong>"Simpan Aturan"</strong> → perubahan langsung berlaku untuk pelanggan</span>
          </div>
        </div>
      </div>

      {/* ========== RINGKASAN ATURAN ========== */}
      <div style={styles.previewCard}>
        <h3 style={styles.sectionTitle}>
          <FaChartLine size={16} color={adminColors.primary} />
          Ringkasan Aturan Rekomendasi Saat Ini
        </h3>
        
        <div style={styles.ruanganTabs}>
          {ruanganOptions.map(ruang => (
            <button
              key={ruang}
              onClick={() => setSelectedRuangan(ruang)}
              style={styles.ruanganTab(selectedRuangan === ruang)}
            >
              {ruang}
              {aturanCount[ruang] > 0 && (
                <span style={{ 
                  marginLeft: '6px', 
                  background: 'rgba(255,255,255,0.2)', 
                  padding: '2px 6px', 
                  borderRadius: '20px',
                  fontSize: '10px'
                }}>
                  {aturanCount[ruang]}
                </span>
              )}
            </button>
          ))}
        </div>
        
        <div>
          {aturanCount[selectedRuangan] === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', background: adminColors.bgHover, borderRadius: '12px' }}>
              <FaBoxOpen size={32} color={adminColors.textLight} />
              <p style={{ color: adminColors.textLight, margin: '12px 0 0 0', fontSize: '13px' }}>
                Belum ada aturan untuk ruangan <strong>{selectedRuangan}</strong>
              </p>
              <p style={{ color: adminColors.textLight, margin: '8px 0 0 0', fontSize: '12px' }}>
                Klik "Tambah / Edit Aturan" untuk menambahkan rekomendasi warna
              </p>
            </div>
          ) : (
            aturanList
              .filter(a => a.ruangan === selectedRuangan)
              .map(aturan => {
                const warnaArray = aturan.warna_rekomendasi.split(',').map(s => s.trim());
                return (
                  <div key={aturan.suasana} style={styles.previewItem}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <FaSmile size={14} color={adminColors.primary} />
                      <span style={{ fontWeight: '500', fontSize: '13px', minWidth: '90px' }}>
                        {aturan.suasana}
                      </span>
                      <FaChevronRight size={12} color={adminColors.border} />
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {warnaArray.slice(0, 3).map((nama, idx) => (
                          <span key={idx} style={{ fontSize: '12px', background: '#e2e8f0', padding: '2px 10px', borderRadius: '12px' }}>
                            {nama}
                          </span>
                        ))}
                        {warnaArray.length > 3 && (
                          <span style={{ fontSize: '11px', color: adminColors.textLight }}>
                            +{warnaArray.length - 3} lainnya
                          </span>
                        )}
                      </div>
                    </div>
                    <FaCheckCircle size={14} color={adminColors.success} />
                  </div>
                );
              })
          )}
        </div>
      </div>

      {/* MODAL FORM */}
      {showForm && (
        <div style={styles.modalBackdrop} onClick={handleCloseForm}>
          <div style={styles.modalSheet} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHandle}></div>
            
            <div style={styles.modalTitle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaRegLightbulb size={20} color={adminColors.primary} />
                {editId ? 'Edit Aturan Rekomendasi' : 'Tambah Aturan Rekomendasi'}
              </div>
              <button onClick={handleCloseForm} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <FaTimes color={adminColors.textLight} />
              </button>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <FaHome size={14} /> Jenis Ruangan
                </label>
                <select
                  style={styles.select}
                  value={formData.jenisRuangan}
                  onChange={(e) => {
                    const ruanganBaru = e.target.value;
                    const suasanaOpts = ruanganBaru === 'Lainnya'
                      ? suasanaOptionsLainnya
                      : (suasanaOptions[ruanganBaru] || ['Calming']);
                    setFormData({
                      ...formData,
                      jenisRuangan: ruanganBaru,
                      suasana: suasanaOpts[0],
                    });
                  }}
                >
                  {ruanganOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <FaSmile size={14} /> Suasana Ruangan
                </label>
                <select
                  style={styles.select}
                  value={formData.suasana}
                  onChange={(e) => setFormData({ ...formData, suasana: e.target.value })}
                >
                  {getSuasanaOptionsForRuangan().map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            {formData.jenisRuangan === 'Lainnya' && (
              <div style={{
                marginBottom: '16px',
                padding: '10px 14px',
                background: `${adminColors.primary}08`,
                borderRadius: '10px',
                fontSize: '12px',
                color: adminColors.textLight,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <FaInfoCircle size={14} color={adminColors.primary} />
                Aturan ini akan berlaku untuk semua nama ruangan custom yang diketik pelanggan (misal "Ruang Makan", "Garasi"), dikelompokkan berdasarkan suasana yang dipilih.
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={styles.label}>
                <FaFilter size={14} /> Filter Kategori Warna
              </label>
              <div style={styles.filterChips}>
                {kategoriOptions.map(kat => (
                  <button
                    key={kat}
                    type="button"
                    onClick={() => setFilterKategori(kat)}
                    style={styles.filterChip(filterKategori === kat)}
                  >
                    {kat}
                    {filterKategori === kat && <FaCheck size={10} style={{ marginLeft: '6px' }} />}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.searchContainer}>
              <FaSearch style={styles.searchIcon} />
              <input
                type="text"
                placeholder={isMobile ? "Cari warna..." : "Cari warna berdasarkan nama, nomor seri, atau kode HEX..."}
                value={searchWarna}
                onChange={(e) => setSearchWarna(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={styles.label}>
                <FaPalette size={14} /> Pilih Warna Rekomendasi (klik kartu untuk memilih)
              </label>
              
              {filteredWarnaOptions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', background: adminColors.bgHover, borderRadius: '12px' }}>
                  <FaBoxOpen size={32} color={adminColors.textLight} />
                  <p style={{ color: adminColors.textLight, marginTop: '12px' }}>
                    Tidak ada warna dalam kategori "{filterKategori}"
                  </p>
                </div>
              ) : (
                <div style={styles.warnaGrid}>
                  {filteredWarnaOptions.map(warna => {
                    const isSelected = selectedWarnaList.includes(warna.nama);
                    return (
                      <div
                        key={warna.id}
                        onClick={() => toggleWarna(warna.nama)}
                        style={styles.warnaCardSelect(isSelected)}
                      >
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          background: warna.kode_hex,  
                          border: `1px solid ${adminColors.border}`,
                          flexShrink: 0,
                        }} />
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                          <div style={{ fontSize: '10px', color: adminColors.textLight, fontFamily: 'monospace' }}>
                            {warna.nomor_seri}  
                          </div>
                          <div style={{ fontWeight: '600', fontSize: '13px', color: adminColors.dark }}>
                            {warna.nama}
                          </div>
                          <div style={{ fontSize: '10px', color: adminColors.textLight, fontFamily: 'monospace' }}>
                            {warna.kode_hex}  
                          </div>
                          <div style={{ fontSize: '10px', color: adminColors.primary, marginTop: '2px' }}>
                            {warna.kategori}
                          </div>
                        </div>
                        {isSelected && (
                          <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: adminColors.primary,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            <FaCheck size={12} color="white" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              
              <div style={{ marginTop: '12px', fontSize: '12px', color: adminColors.textLight, display: 'flex', justifyContent: 'space-between' }}>
                <span><FaDatabase size={10} style={{ marginRight: '4px' }} /> Total: {filteredWarnaOptions.length} warna</span>
                <span style={{ color: adminColors.primary }}><FaCheck size={10} style={{ marginRight: '4px' }} /> {selectedWarnaList.length} dipilih</span>
              </div>
            </div>

            {selectedWarnaList.length > 0 && (
              <div>
                <label style={styles.label}>
                  <FaEye size={14} /> Preview Warna yang Akan Disimpan ({selectedWarnaList.length})
                </label>
                <div style={styles.selectedPreview}>
                  {selectedWarnaList.map(warnaNama => {
                    const warna = warnaOptions.find(w => w.nama === warnaNama);
                    return warna ? (
                      <div key={warnaNama} style={styles.selectedItem}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: warna.kode_hex }}></div> 
                        <span style={{ fontSize: '11px', color: adminColors.textLight }}>{warna.nomor_seri}</span>  
                        <span style={{ fontSize: '12px', color: adminColors.dark }}>{warna.nama}</span>
                        <button
                          onClick={() => removeSelectedWarna(warnaNama)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: adminColors.danger,
                            display: 'flex',
                            alignItems: 'center',
                            padding: '2px',
                            borderRadius: '50%',
                          }}
                          title="Hapus warna ini"
                        >
                          <FaTimes size={10} />
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            <div style={styles.actionButtons}>
              <button onClick={handleAddOrUpdate} style={styles.submitBtn}>
                <FaCloudUploadAlt size={14} /> Simpan Aturan
              </button>
              <button onClick={handleCloseForm} style={styles.cancelBtn}>
                <FaUndo size={14} /> Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DAFTAR ATURAN PER RUANGAN */}
      {Object.keys(groupedAturan).length === 0 ? (
        <div style={styles.emptyState}>
          <FaRegLightbulb size={isMobile ? 48 : 56} color={adminColors.textLight} />
          <p style={{ color: adminColors.textLight, marginTop: '16px' }}>Belum ada aturan rekomendasi</p>
          <p style={{ fontSize: '13px', color: adminColors.textLight }}>Klik "Tambah / Edit Aturan" untuk menambahkan</p>
        </div>
      ) : (
        Object.keys(groupedAturan).map(ruangan => (
          <div key={ruangan} style={{ marginBottom: '24px' }}>
            <div 
              style={styles.groupHeader}
              onClick={() => toggleRuanganExpand(ruangan)}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaHome size={16} color={adminColors.primary} />
                {ruangan}
                <span style={{ fontSize: '12px', color: adminColors.textLight, fontWeight: 'normal' }}>
                  ({groupedAturan[ruangan].length} aturan)
                </span>
              </span>
              {expandedRuangan === ruangan ? <FaArrowRight size={12} /> : <FaArrowLeft size={12} />}
            </div>
            
            {(expandedRuangan === ruangan || !isMobile) && (
              <div style={styles.cardGrid}>
                {groupedAturan[ruangan].map((aturan) => {
                  const warnaArray = aturan.warna_rekomendasi.split(',').map(s => s.trim());
                  return (
                    <div key={aturan.id} style={styles.card}>
                      <div style={styles.cardHeader}>
                        <div>
                          <div style={styles.warnaPreview}>
                            {warnaArray.slice(0, 3).map((nama, idx) => (
                              <span key={idx} style={{ fontSize: '13px', fontWeight: '500', background: '#f1f5f9', padding: '4px 12px', borderRadius: '12px' }}>
                                {nama}
                              </span>
                            ))}
                            {warnaArray.length > 3 && (
                              <span style={{ fontSize: '12px', color: adminColors.textLight }}>
                                +{warnaArray.length - 3} lainnya
                              </span>
                            )}
                          </div>
                          <div style={styles.metaChip}>
                            <span><FaSmile size={12} /> {aturan.suasana}</span>
                            <span><FaPalette size={12} /> {warnaArray.length} warna</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleEdit(aturan)} style={styles.btnEdit}>
                            <FaEdit size={12} /> Edit
                          </button>
                          <button onClick={() => handleDeleteRule(aturan.ruangan, aturan.suasana)} style={styles.btnDelete}>
                            <FaTrash size={12} /> Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))
      )}

      {/* INFORMASI */}
      <div style={styles.infoCard}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaInfoCircle size={18} color={adminColors.warning} />
          <span style={{ fontSize: '13px', color: '#92400e' }}>
            Perubahan aturan akan langsung mempengaruhi halaman Rekomendasi Warna yang dilihat pelanggan.
            Pastikan setiap kombinasi ruangan dan suasana memiliki minimal 1 warna rekomendasi.
          </span>
        </div>
      </div>
    </div>
  );
}

export default KelolaAturanRek;
