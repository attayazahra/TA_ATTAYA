import { FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

function WarnaCard({ warna, index, onEdit, onDelete, styles, isMobile }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardTopRow}>
        <div style={{ ...styles.colorSwatch, background: warna.kode }} />
        <div style={{ flex: 1 }}>
          <p style={styles.cardWarnaNama}>{warna.nama}</p>
          <p style={styles.cardNomor}>
            {warna.nomor} · {warna.kode}
          </p>
        </div>
        <span style={styles.statusBadge(warna.tersedia)}>
          {warna.tersedia ? <FaCheckCircle size={12} /> : <FaTimesCircle size={12} />}
          {warna.tersedia ? ' Ada' : ' Habis'}
        </span>
      </div>
      <div style={styles.cardMeta}>
        <span style={styles.metaChip}>{warna.kategori}</span>
        <span style={{ ...styles.metaChip, fontFamily: 'monospace' }}>#{index + 1}</span>
      </div>
      <div style={styles.cardActions}>
        <button style={styles.btnEdit} onClick={() => onEdit(warna)}>
          <FaEdit size={13} /> Edit
        </button>
        <button style={styles.btnDelete} onClick={() => onDelete(warna.id)}>
          <FaTrash size={13} /> Hapus
        </button>
      </div>
    </div>
  );
}

export default WarnaCard;