// utils/riwayatHelper.js

const API_BASE = 'http://localhost:8081/api/v1.0/riwayat'

/**
 * Simpan riwayat secara otomatis ke backend
 * @param {string} type - 'kalkulator' | 'simulasi' | 'rekomendasi' | 'admin'
 * @param {object} data - Data yang akan disimpan
 * @returns {Promise<object>} - Response dari API
 */
export const saveRiwayat = async (type, data) => {
  try {
    let endpoint = ''
    let payload = {}

    switch (type) {
      case 'kalkulator':
        endpoint = `${API_BASE}/kalkulator`
        payload = {
          session_id: data.session_id || `KALK-${Date.now()}`,
          jenis_cat: data.jenis_cat || 'Tidak diketahui',
          
          // Dimensi Ruangan
          panjang: data.panjang || 0,
          lebar: data.lebar || 0,
          tinggi: data.tinggi || 0,
          
          // === DIMENSI PINTU ===
          lebar_pintu: data.lebar_pintu || 0,
          tinggi_pintu: data.tinggi_pintu || 0,
          jumlah_pintu: data.jumlah_pintu || 0,
          
          // === DIMENSI JENDELA ===
          lebar_jendela: data.lebar_jendela || 0,
          tinggi_jendela: data.tinggi_jendela || 0,
          jumlah_jendela: data.jumlah_jendela || 0,
          
          // Hasil Perhitungan
          kebutuhan_kg: data.kebutuhan_kg || 0,
          lapisan: data.lapisan || 2,
          estimasi_biaya: data.estimasi_biaya || 0,
          created_at: new Date().toISOString(),
        }
        break

      case 'simulasi':
        endpoint = `${API_BASE}/simulasi`
        payload = {
          session_id: data.session_id || `SIM-${Date.now()}`,
          warna_dicoba: data.warna_dicoba || [],
          warna_akhir: data.warna_akhir || '',
          created_at: new Date().toISOString(),
        }
        break

      case 'rekomendasi':
        endpoint = `${API_BASE}/rekomendasi`
        payload = {
          session_id: data.session_id || `REK-${Date.now()}`,
          jenis_ruangan: data.jenis_ruangan || '',
          suasana: data.suasana || '',
          warna_dipilih: data.warna_dipilih || '',
          created_at: new Date().toISOString(),
        }
        break

      case 'admin':
        endpoint = `${API_BASE}/admin`
        payload = {
          session_id: data.session_id || `ADMIN-${Date.now()}`,
          admin_name: data.admin_name || 'Admin',
          aktivitas: data.aktivitas || 'Aktivitas',
          detail: data.detail || '',
          created_at: new Date().toISOString(),
        }
        break

      default:
        throw new Error(`Tipe riwayat tidak dikenal: ${type}`)
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json()
    
    if (!response.ok) {
      throw new Error(result.message || 'Gagal menyimpan riwayat')
    }

    console.log(`✅ Riwayat ${type} tersimpan:`, result)
    return result
  } catch (error) {
    console.error(`❌ Gagal menyimpan riwayat ${type}:`, error)
    // ⚠️ Jangan throw error agar tidak mengganggu flow utama
    return { status: 'error', message: error.message }
  }
}

/**
 * Helper untuk menyimpan riwayat kalkulator
 */
export const saveRiwayatKalkulator = (data) => saveRiwayat('kalkulator', data)

/**
 * Helper untuk menyimpan riwayat simulasi
 */
export const saveRiwayatSimulasi = (data) => saveRiwayat('simulasi', data)

/**
 * Helper untuk menyimpan riwayat rekomendasi
 */
export const saveRiwayatRekomendasi = (data) => saveRiwayat('rekomendasi', data)

/**
 * Helper untuk menyimpan riwayat admin
 */
export const saveRiwayatAdmin = (data) => saveRiwayat('admin', data)

export default {
  saveRiwayat,
  saveRiwayatKalkulator,
  saveRiwayatSimulasi,
  saveRiwayatRekomendasi,
  saveRiwayatAdmin,
}