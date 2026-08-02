function FormFields({ fd, setFd, styles }) {
  const KATEGORI = ['Merah', 'Pink', 'Coral', 'Orange', 'Kuning', 'Hijau', 'Biru', 'Ungu', 'Netral'];

  return (
    <>
      {/* Field Nomor Seri */}
      <div style={styles.inputGroup}>
        <label style={styles.label}>Nomor Seri</label>
        <input
          style={styles.input}
          value={fd.nomor_seri || ''}
          placeholder="Contoh: G.99, M.10, B.05"
          onChange={(e) => setFd({ ...fd, nomor_seri: e.target.value })}
        />
        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
          Format: Huruf.Titik.Angka (contoh: G.99)
        </div>
      </div>
      
      {/* Field Nama Warna */}
      <div style={styles.inputGroup}>
        <label style={styles.label}>Nama Warna</label>
        <input
          style={styles.input}
          value={fd.nama || ''}
          placeholder="Contoh: Baby Pink, Biru Muda"
          onChange={(e) => setFd({ ...fd, nama: e.target.value })}
        />
      </div>
      
      {/* Field Kode HEX */}
      <div style={styles.inputGroup}>
        <label style={styles.label}>Kode HEX</label>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="color"
            value={fd.kode_hex && fd.kode_hex.startsWith('#') ? fd.kode_hex : '#ffffff'}
            style={{
              width: '60px',
              height: '56px',
              borderRadius: '14px',
              border: '2px solid #e2e8f0',
              cursor: 'pointer',
              padding: '3px',
            }}
            onChange={(e) => setFd({ ...fd, kode_hex: e.target.value })}
          />
          <input
            style={{ ...styles.input, flex: 1 }}
            value={fd.kode_hex || ''}
            placeholder="#FFFFFF"
            onChange={(e) => setFd({ ...fd, kode_hex: e.target.value })}
          />
        </div>
      </div>
      
      {/* Field Kategori */}
      <div style={styles.inputGroup}>
        <label style={styles.label}>Kategori</label>
        <select
          style={styles.select}
          value={fd.kategori || ''}
          onChange={(e) => setFd({ ...fd, kategori: e.target.value })}
        >
          <option value="">Pilih Kategori</option>
          {KATEGORI.map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
      </div>
      
      {/* Field Status Stok */}
      <div style={styles.inputGroup}>
        <label style={styles.label}>Status Stok</label>
        <select
          style={styles.select}
          value={fd.tersedia !== undefined ? fd.tersedia.toString() : 'true'}
          onChange={(e) => setFd({ ...fd, tersedia: e.target.value === 'true' })}
        >
          <option value="true">✓ Tersedia</option>
          <option value="false">✗ Habis</option>
        </select>
      </div>
    </>
  );
}

export default FormFields;