import { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaEdit, FaSave } from 'react-icons/fa';
import Swal from 'sweetalert2';

function HargaTab({ styles, isMobile }) {
  const [hargaList, setHargaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingJenis, setEditingJenis] = useState(null);
  const [editValue, setEditValue] = useState('');

  // ===== SIMPAN RIWAYAT ADMIN =====
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

  // ===== FETCH DATA HARGA DARI BACKEND =====
  const fetchHarga = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1.0/harga`);
      const result = await response.json();
      if (result.status === 'success') {
        setHargaList(result.data);
      } else {
        setError('Gagal mengambil data harga');
      }
    } catch (err) {
      setError('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHarga();
  }, []);

  // ===== HANDLE UPDATE HARGA DENGAN SWEETALERT2 =====
  const handleUpdate = async (jenis) => {
    const hargaBaru = parseInt(editValue);
    if (isNaN(hargaBaru) || hargaBaru < 0) {
      Swal.fire({
        title: 'Error!',
        text: 'Masukkan harga yang valid!',
        icon: 'error',
        confirmButtonColor: '#EA580C',
      });
      return;
    }

    // Konfirmasi update
    Swal.fire({
      title: 'Update Harga?',
      text: `Harga ${jenis} akan diubah menjadi Rp ${hargaBaru.toLocaleString('id-ID')}/kg`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#EA580C',
      cancelButtonColor: '#64748B',
      confirmButtonText: 'Ya, Update!',
      cancelButtonText: 'Batal',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1.0/harga/${encodeURIComponent(jenis)}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ harga_per_kg: hargaBaru }),  // ← PERBAIKI: harga_per_kg
          });

          const resultData = await response.json();
          if (resultData.status === 'success') {
            await simpanRiwayatAdmin(
              'Ubah Harga',
              `Mengubah harga ${jenis} menjadi Rp ${hargaBaru.toLocaleString('id-ID')}/kg`
            );

            Swal.fire({
              title: 'Berhasil!',
              text: `Harga ${jenis} berhasil diupdate!`,
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
            });
            
            setEditingJenis(null);
            setEditValue('');
            fetchHarga();
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'Gagal mengupdate harga: ' + (resultData.message || ''),
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

  // ===== HANDLE CANCEL EDIT =====
  const handleCancelEdit = (jenis) => {
    if (editValue) {
      Swal.fire({
        title: 'Batal?',
        text: 'Perubahan harga akan dibatalkan.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#EA580C',
        cancelButtonColor: '#64748B',
        confirmButtonText: 'Ya, Batal!',
        cancelButtonText: 'Kembali',
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          setEditingJenis(null);
          setEditValue('');
        }
      });
    } else {
      setEditingJenis(null);
      setEditValue('');
    }
  };

  // ===== RENDER =====
  if (loading) {
    return (
      <div style={styles.emptyState}>
        <p>Memuat data harga...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.emptyState}>
        <p style={{ color: '#ef4444' }}>{error}</p>
        <button
          onClick={fetchHarga}
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
    <>
      <div style={styles.pageTitle}>
        <FaMoneyBillWave /> Kelola Harga Cat
        <span style={styles.badge}>
          {hargaList.length} jenis
        </span>
      </div>

      <div style={{ marginBottom: '20px', color: '#94a3b8', fontSize: '14px' }}>
        Klik tombol Edit untuk mengubah harga per kilogram
      </div>

      {hargaList.length === 0 ? (
        <div style={styles.emptyState}>
          <p>Belum ada data harga</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {hargaList.map((item) => (
            <div key={item.id} style={styles.hargaCard}>
              <div style={styles.hargaNama}>{item.jenis}</div>
              
              {editingJenis === item.jenis ? (
                // Mode Edit
                <div style={styles.hargaInputRow}>
                  <input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    style={styles.hargaInput}
                    placeholder="Masukkan harga baru"
                    autoFocus
                  />
                  <button
                    style={styles.hargaUpdateBtn}
                    onClick={() => handleUpdate(item.jenis)}
                  >
                    <FaSave size={14} /> Simpan
                  </button>
                  <button
                    style={{
                      ...styles.hargaUpdateBtn,
                      background: '#e2e8f0',
                      color: '#475569',
                    }}
                    onClick={() => handleCancelEdit(item.jenis)}
                  >
                    Batal
                  </button>
                </div>
              ) : (
                // Mode Tampil
                <div style={styles.hargaInputRow}>
                  <div style={styles.hargaCurrent}>
                    Rp {item.harga_per_kg.toLocaleString('id-ID')} / kg   {/* ← PERBAIKI */}
                  </div>
                  <button
                    style={{
                      ...styles.hargaUpdateBtn,
                      background: '#667eea',
                      padding: '10px 20px',
                    }}
                    onClick={() => {
                      setEditingJenis(item.jenis);
                      setEditValue(item.harga_per_kg.toString());  // ← PERBAIKI
                    }}
                  >
                    <FaEdit size={14} /> Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default HargaTab;