import { useState } from 'react';
import {
  FaUserCircle, FaImage, FaEdit, FaCheck, FaTimes,
  FaEnvelope, FaInfoCircle, FaSignOutAlt
} from 'react-icons/fa';
import Swal from 'sweetalert2';

function ProfileTab({
  adminProfile,
  profilePicture,
  onAvatarChange,
  onSaveName,
  onLogout,
  styles,
  isMobile,
}) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(adminProfile.name);

  const handleSaveName = () => {
    if (editName.trim()) {
      onSaveName(editName.trim());
      setIsEditingName(false);
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Nama tidak boleh kosong',
        icon: 'error',
        confirmButtonColor: '#EA580C',
      });
    }
  };

  // ===== 🔥 HANDLE LOGOUT - TANPA DOUBLE NOTIFIKASI =====
  const handleLogout = () => {
    Swal.fire({
      title: 'Apakah Anda yakin ingin logout?',
      text: 'Anda akan keluar dari sistem dan perlu login kembali.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#EA580C',
      cancelButtonColor: '#64748B',
      confirmButtonText: 'Ya, Logout!',
      cancelButtonText: 'Batal',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // 🔥 LANGSUNG PANGGIL onLogout - TANPA NOTIFIKASI TAMBAHAN
        onLogout();
      }
    });
  };

  // ===== HANDLE AVATAR CHANGE =====
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          title: 'Error!',
          text: 'Ukuran file maksimal 2MB',
          icon: 'error',
          confirmButtonColor: '#EA580C',
        });
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          title: 'Error!',
          text: 'File harus berupa gambar',
          icon: 'error',
          confirmButtonColor: '#EA580C',
        });
        return;
      }
      
      Swal.fire({
        title: 'Ganti Foto Profil?',
        text: `File: ${file.name}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#EA580C',
        cancelButtonColor: '#64748B',
        confirmButtonText: 'Ya, Ganti!',
        cancelButtonText: 'Batal',
      }).then((result) => {
        if (result.isConfirmed) {
          onAvatarChange(e);
          Swal.fire({
            title: 'Berhasil!',
            text: 'Foto profil berhasil diperbarui',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
          });
        }
      });
    }
  };

  return (
    <>
      <div style={styles.profileHeader}>
        <label style={styles.profileAvatarLg}>
          <input
            type="file"
            accept="image/*"
            style={styles.hiddenInput}
            onChange={handleAvatarChange}
          />
          {profilePicture ? (
            <img
              src={profilePicture}
              alt="Profile"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <FaUserCircle size={isMobile ? 50 : 64} color="white" />
          )}
          <div style={styles.avatarOverlay}>
            <FaImage size={11} /> Ganti
          </div>
        </label>

        {isEditingName ? (
          <div style={styles.editNameRow}>
            <input
              style={styles.nameInput}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSaveName()}
              autoFocus
            />
            <div style={styles.editNameButtons}>
              <button style={styles.saveBtn} onClick={handleSaveName}>
                <FaCheck size={14} /> Simpan
              </button>
              <button
                style={styles.cancelBtn}
                onClick={() => {
                  setIsEditingName(false);
                  setEditName(adminProfile.name);
                }}
              >
                <FaTimes size={14} /> Batal
              </button>
            </div>
          </div>
        ) : (
          <div style={styles.profileNameWrapper}>
            <span style={styles.profileName}>{adminProfile.name}</span>
            <button
              style={styles.editBtn}
              onClick={() => setIsEditingName(true)}
            >
              <FaEdit size={13} /> Edit
            </button>
          </div>
        )}

        <p style={styles.profileEmail}>{adminProfile.email || 'admin@nazarpaint.com'}</p>
      </div>

      <div style={styles.infoCard}>
        <div style={styles.infoRow}>
          <div style={styles.infoIcon}>
            <FaEnvelope />
          </div>
          <div>
            <div style={styles.infoLabel}>Email</div>
            <div style={styles.infoValue}>
              {adminProfile.email || 'admin@nazarpaint.com'}
            </div>
          </div>
        </div>
        <div style={{ ...styles.infoRow, borderBottom: 'none' }}>
          <div style={styles.infoIcon}>
            <FaInfoCircle />
          </div>
          <div>
            <div style={styles.infoLabel}>Tipe Login</div>
            <div style={styles.infoValue}>
              <span style={styles.loginTypeBadge}>
                {adminProfile.loginType === 'google' ? 'Google Account' : 'Username / Password'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <button style={styles.logoutButtonProfile} onClick={handleLogout}>
        <FaSignOutAlt /> Logout
      </button>
    </>
  );
}

export default ProfileTab;