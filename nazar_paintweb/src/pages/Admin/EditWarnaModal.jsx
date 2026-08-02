import { FaSave, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';

function EditWarnaModal({ formData, setFormData, onSave, onClose, styles }) {
  const KATEGORI = ['Merah', 'Pink', 'Coral', 'Orange', 'Kuning', 'Hijau', 'Biru', 'Ungu', 'Netral'];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi lengkap
    if (!formData.nomor_seri || !formData.nama || !formData.kode_hex || !formData.kategori) {
      Swal.fire({
        title: 'Error!',
        text: 'Semua field wajib diisi!',
        icon: 'error',
        confirmButtonColor: '#EA580C',
      });
      return;
    }

    // Validasi format HEX
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(formData.kode_hex)) {
      Swal.fire({
        title: 'Error!',
        text: 'Format kode HEX tidak valid! Contoh: #FFFFFF',
        icon: 'error',
        confirmButtonColor: '#EA580C',
      });
      return;
    }

    // Validasi format Nomor Seri
    const seriRegex = /^[A-Z]\.\d{1,2}$/;
    if (!seriRegex.test(formData.nomor_seri)) {
      Swal.fire({
        title: 'Error!',
        text: 'Format Nomor Seri tidak valid! Contoh: G.99, M.10, B.05',
        icon: 'error',
        confirmButtonColor: '#EA580C',
      });
      return;
    }

    // Konfirmasi edit
    const confirmResult = await Swal.fire({
      title: 'Simpan Perubahan?',
      html: `
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px">
          <div style="width:60px;height:60px;border-radius:12px;background:${formData.kode_hex};border:2px solid #e2e8f0"></div>
          <div><strong>${formData.nama}</strong></div>
          <div style="font-size:12px;color:#94a3b8">${formData.nomor_seri} • ${formData.kode_hex} • ${formData.kategori}</div>
          <div style="font-size:12px;color:${formData.tersedia ? '#10b981' : '#ef4444'}">
            ${formData.tersedia ? '✓ Tersedia' : '✗ Habis'}
          </div>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#EA580C',
      cancelButtonColor: '#64748B',
      confirmButtonText: 'Ya, Simpan!',
      cancelButtonText: 'Batal',
      reverseButtons: true,
    });

    if (confirmResult.isConfirmed) {
      await onSave();
    }
  };

  // Style modal lebih kecil dan rapi
  const modalStyles = {
    backdrop: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    },
    modal: {
      background: 'white',
      borderRadius: '24px',
      padding: '30px',
      maxWidth: '500px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      animation: 'slideUp 0.3s ease',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: '2px solid #f1f5f9',
    },
    title: {
      fontSize: '22px',
      fontWeight: '700',
      color: '#1e293b',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      color: '#94a3b8',
      cursor: 'pointer',
      padding: '4px 8px',
      borderRadius: '8px',
      transition: 'all 0.2s',
    },
    inputGroup: {
      marginBottom: '16px',
    },
    label: {
      display: 'block',
      fontSize: '13px',
      fontWeight: '600',
      color: '#475569',
      marginBottom: '4px',
    },
    input: {
      width: '100%',
      padding: '12px 14px',
      borderRadius: '12px',
      border: '2px solid #e2e8f0',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box',
    },
    select: {
      width: '100%',
      padding: '12px 14px',
      borderRadius: '12px',
      border: '2px solid #e2e8f0',
      fontSize: '14px',
      outline: 'none',
      backgroundColor: 'white',
      boxSizing: 'border-box',
    },
    colorRow: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
    },
    colorPicker: {
      width: '50px',
      height: '50px',
      borderRadius: '12px',
      border: '2px solid #e2e8f0',
      cursor: 'pointer',
      padding: '3px',
      flexShrink: 0,
    },
    colorInput: {
      flex: 1,
      padding: '12px 14px',
      borderRadius: '12px',
      border: '2px solid #e2e8f0',
      fontSize: '14px',
      outline: 'none',
      boxSizing: 'border-box',
    },
    helperText: {
      fontSize: '11px',
      color: '#94a3b8',
      marginTop: '4px',
    },
    buttonRow: {
      display: 'flex',
      gap: '12px',
      marginTop: '24px',
      paddingTop: '16px',
      borderTop: '2px solid #f1f5f9',
    },
    saveBtn: {
      flex: 1,
      padding: '12px',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'all 0.2s',
    },
    cancelBtn: {
      flex: 1,
      padding: '12px',
      background: '#f1f5f9',
      color: '#475569',
      border: 'none',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'all 0.2s',
    },
  };

  // Animasi CSS
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes slideUp {
      from {
        transform: translateY(20px) scale(0.95);
        opacity: 0;
      }
      to {
        transform: translateY(0) scale(1);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(styleSheet);

  return (
    <div style={modalStyles.backdrop} onClick={onClose}>
      <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={modalStyles.header}>
          <div style={modalStyles.title}>
            ✏️ Edit Warna
          </div>
          <button 
            style={modalStyles.closeBtn}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f1f5f9';
              e.currentTarget.style.color = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
              e.currentTarget.style.color = '#94a3b8';
            }}
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Nomor Seri */}
          <div style={modalStyles.inputGroup}>
            <label style={modalStyles.label}>Nomor Seri</label>
            <input
              style={modalStyles.input}
              value={formData.nomor_seri || ''}
              placeholder="Contoh: G.99, M.10, B.05"
              onChange={(e) => setFormData({ ...formData, nomor_seri: e.target.value })}
            />
            <div style={modalStyles.helperText}>
              Format: Huruf.Titik.Angka (contoh: G.99)
            </div>
          </div>

          {/* Nama Warna */}
          <div style={modalStyles.inputGroup}>
            <label style={modalStyles.label}>Nama Warna</label>
            <input
              style={modalStyles.input}
              value={formData.nama || ''}
              placeholder="Contoh: Baby Pink, Biru Muda"
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
            />
          </div>

          {/* Kode HEX */}
          <div style={modalStyles.inputGroup}>
            <label style={modalStyles.label}>Kode HEX</label>
            <div style={modalStyles.colorRow}>
              <input
                type="color"
                value={formData.kode_hex && formData.kode_hex.startsWith('#') ? formData.kode_hex : '#ffffff'}
                style={modalStyles.colorPicker}
                onChange={(e) => setFormData({ ...formData, kode_hex: e.target.value })}
              />
              <input
                style={modalStyles.colorInput}
                value={formData.kode_hex || ''}
                placeholder="#FFFFFF"
                onChange={(e) => setFormData({ ...formData, kode_hex: e.target.value })}
              />
            </div>
          </div>

          {/* Kategori */}
          <div style={modalStyles.inputGroup}>
            <label style={modalStyles.label}>Kategori</label>
            <select
              style={modalStyles.select}
              value={formData.kategori || ''}
              onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
            >
              <option value="">Pilih Kategori</option>
              {KATEGORI.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>

          {/* Status Stok */}
          <div style={modalStyles.inputGroup}>
            <label style={modalStyles.label}>Status Stok</label>
            <select
              style={modalStyles.select}
              value={formData.tersedia !== undefined ? formData.tersedia.toString() : 'true'}
              onChange={(e) => setFormData({ ...formData, tersedia: e.target.value === 'true' })}
            >
              <option value="true">✓ Tersedia</option>
              <option value="false">✗ Habis</option>
            </select>
          </div>

          {/* Tombol */}
          <div style={modalStyles.buttonRow}>
            <button
              type="button"
              style={modalStyles.cancelBtn}
              onClick={onClose}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e2e8f0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f1f5f9';
              }}
            >
              <FaTimes /> Batal
            </button>
            <button
              type="submit"
              style={modalStyles.saveBtn}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <FaSave /> Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditWarnaModal;