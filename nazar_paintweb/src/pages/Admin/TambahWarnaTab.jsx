import { FaPlusCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import FormFields from './FormFields';

function TambahWarnaTab({ formData, setFormData, onSubmit, styles, isMobile }) {

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

    // Konfirmasi tambah warna
    const confirmResult = await Swal.fire({
      title: 'Tambah Warna Baru?',
      html: `
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px">
          <div style="width:60px;height:60px;border-radius:12px;background:${formData.kode_hex};border:2px solid #e2e8f0"></div>
          <div><strong>${formData.nama}</strong></div>
          <div style="font-size:12px;color:#94a3b8">${formData.nomor_seri} • ${formData.kode_hex} • ${formData.kategori}</div>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#EA580C',
      cancelButtonColor: '#64748B',
      confirmButtonText: 'Ya, Tambah!',
      cancelButtonText: 'Batal',
      reverseButtons: true,
    });

    if (confirmResult.isConfirmed) {
      await onSubmit(e);
    }
  };

  return (
    <>
      <div style={styles.pageTitle}>
        <FaPlusCircle /> Tambah Warna
      </div>
      <div style={styles.formCard}>
        <form onSubmit={handleSubmit}>
          <FormFields fd={formData} setFd={setFormData} styles={styles} />
          <button 
            type="submit" 
            style={styles.submitBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <FaPlusCircle /> Tambah Warna Baru
          </button>
        </form>
      </div>
    </>
  );
}

export default TambahWarnaTab;