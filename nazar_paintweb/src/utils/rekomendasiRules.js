import warnaData from '../data/warnaData';
const rekomendasiRules = {
  // ===== KAMAR TIDUR =====
  "Kamar Tidur": {
    "Calming": ["Biru Langit", "Baby Blue", "Sky Blue", "Powder Blue", "Soft Lavender"],
    "Romantic": ["Salmon Peach", "Bubble Gum", "Medium Pink", "Peach Blush", "Light Pink", "Pastel Pink", "Blush Pink"],
    "Energetic": ["Cheery Red", "Magenta Pink", "Rose Red"],
    "Cozy": ["Terracotta", "Amber Gold", "Warm Beige", "Soft Apricot"]
  },
  
  // ===== RUANG TAMU =====
  "Ruang Tamu": {
    "Elegant": ["Burgundy", "Wine", "Royal Blue", "Charcoal Black"],
    "Warm": ["Golden Brown", "Terracotta", "Golden Sand", "Ivory Cream"],
    "Fresh": ["Light Green", "Mint", "Seafoam", "Soft Mint"],
    "Modern": ["Charcoal", "Light Gray", "Slate Gray", "Cool White"]
  },
  
  // ===== DAPUR =====
  "Dapur": {
    "Clean": ["Cool White", "Off White", "Soft White", "Cream", "Ivory"],
    "Fresh": ["Celery", "Kiwi", "Apple Green", "Fresh Green", "Mint"],
    "Warm": ["Golden Yellow", "Amber Gold", "Soft Lemon", "Vanilla Cream"],
    "Modern": ["Medium Gray", "Titanium", "Charcoal", "Jet Black"]
  },
  
  // ===== RUANG KERJA =====
  "Ruang Kerja": {
    "Fokus": ["Royal Blue", "Cobalt Blue", "Deep Charcoal", "Medium Gray"],
    "Fresh": ["Mint", "Seafoam", "Soft Mint", "Ice Blue"],
    "Minimalis": ["Off White", "Light Gray", "Cool White", "Soft Gray"]
  },
  
  // ===== KAMAR ANAK =====
  "Kamar Anak": {
    "Ceria": ["Golden Yellow", "Soft Lemon", "Orange", "Candy Pink", "Sky Blue"],
    "Calming": ["Salmon Peach", "Ivory", "Apricot Cream", "Peach Blush", "Blush Pink"],
    "Playful": ["Bubble Gum", "Pastel Pink", "Light Pink", "Sky Blue", "Aquamarine"]
  },
  
  // ===== KAMAR MANDI ===== 
  "Kamar Mandi": {
    "Clean": ["Cool White", "Off White", "Soft White", "Cream", "Ivory"],
    "Fresh": ["Aqua Blue", "Sky Blue", "Mint", "Seafoam", "Ice Blue"],
    "Modern": ["Light Gray", "Soft Gray", "Silver", "Titanium", "Cool White"]
  }
};

export const ruanganOptions = [
  'Kamar Tidur',
  'Ruang Tamu',
  'Dapur',
  'Ruang Kerja',
  'Kamar Anak',
  'Kamar Mandi',
  'Lainnya'
];

export const suasanaOptions = {
  "Kamar Tidur": ["Calming", "Romantic", "Energetic", "Cozy"],
  "Ruang Tamu": ["Elegant", "Warm", "Fresh", "Modern"],
  "Dapur": ["Clean", "Fresh", "Warm", "Modern"],
  "Ruang Kerja": ["Fokus", "Fresh", "Minimalis"],
  "Kamar Anak": ["Ceria", "Calming", "Playful"],
  "Kamar Mandi": ["Clean", "Fresh", "Modern"]  
};

// Opsi suasana khusus untuk ruangan custom ("Lainnya").
// Dipakai bersama oleh RekomendasiPage.jsx (sisi pelanggan) dan
// KelolaAturanRek.jsx (sisi admin) supaya daftarnya konsisten,
// tidak didefinisikan ulang di dua tempat berbeda.
export const suasanaOptionsLainnya = [
  'Calming', 'Energetic', 'Natural', 'Modern', 'Classic', 'Cozy', 'Fresh'
];

// Dipakai sebagai fallback kategori warna berdasarkan suasana saja —
// terutama untuk ruangan custom ("Lainnya") yang tidak punya aturan
// warna spesifik di rekomendasiRules.
//
// CATATAN PERBAIKAN: sebelumnya beberapa key di sini ditulis berkali-kali
// (mengikuti tiap ruangan preset yang memakainya), sehingga di JavaScript
// definisi terakhir diam-diam menimpa definisi sebelumnya. Sekarang setiap
// key digabung (union) dari seluruh ruangan yang memakai suasana tersebut,
// supaya tidak ada kategori warna yang hilang.
const suasanaToKategori = {
  "Calming": ["Biru", "Hijau", "Ungu", "Netral", "Coral", "Pink"],       // Kamar Tidur + Kamar Anak
  "Romantic": ["Pink", "Ungu", "Merah", "Coral"],                        // Kamar Tidur
  "Energetic": ["Merah", "Pink"],                                        // Kamar Tidur
  "Cozy": ["Orange", "Kuning", "Netral", "Coral"],                       // Kamar Tidur

  "Elegant": ["Merah", "Biru", "Netral"],                                // Ruang Tamu
  "Warm": ["Orange", "Kuning", "Netral", "Coral"],                       // Ruang Tamu + Dapur
  "Fresh": ["Hijau", "Biru"],                                            // Ruang Tamu + Dapur + Ruang Kerja + Kamar Mandi
  "Modern": ["Netral", "Biru"],                                         // Ruang Tamu + Dapur + Kamar Mandi

  "Clean": ["Netral", "Biru"],                                          // Dapur + Kamar Mandi

  "Fokus": ["Biru", "Netral"],                                          // Ruang Kerja
  "Minimalis": ["Netral"],                                              // Ruang Kerja

  "Ceria": ["Kuning", "Orange", "Pink", "Biru"],                        // Kamar Anak
  "Playful": ["Pink", "Biru"],                                          // Kamar Anak

  // Khusus opsi suasana untuk ruangan "Lainnya" (belum ada di atas)
  "Natural": ["Hijau", "Kuning", "Netral", "Coral"],
  "Classic": ["Merah", "Biru", "Netral"]
};


export const getRekomendasi = (ruangan, suasana, preferensiWarna = null) => {
  // Ruangan custom (nama bebas yang diketik pelanggan lewat modal "Lainnya")
  // tidak mungkin dibuatkan aturan spesifik satu-satu oleh admin, karena
  // jumlahnya tidak terbatas. Jadi setiap nama ruangan yang BUKAN salah
  // satu dari 6 preset resmi diperlakukan sebagai kategori umum "Lainnya"
  // saat mencari aturan rekomendasi.
  const ruanganUntukAturan = ruanganOptions.includes(ruangan) && ruangan !== 'Lainnya'
    ? ruangan
    : 'Lainnya';

  // Cek aturan custom terlebih dahulu
  const customAturan = loadCustomAturan();
  let aturan;
  
  if (customAturan && customAturan[ruanganUntukAturan] && customAturan[ruanganUntukAturan][suasana] && customAturan[ruanganUntukAturan][suasana].length > 0) {
    aturan = customAturan[ruanganUntukAturan][suasana];
  } else {
    aturan = rekomendasiRules[ruanganUntukAturan]?.[suasana] || [];
  }
  
  // Cari warna dari database berdasarkan nama
  let rekomendasi = warnaData.filter(warna => 
    aturan.includes(warna.nama) && warna.tersedia === true
  );
  
  // Jika hasil kurang dari 5, ambil warna dari kategori yang sesuai
  if (rekomendasi.length < 5) {
    const kategoriTambahan = suasanaToKategori[suasana] || ["Netral", "Biru", "Hijau"];
    
    const tambahan = warnaData.filter(warna => 
      kategoriTambahan.includes(warna.kategori) && 
      warna.tersedia === true &&
      !rekomendasi.some(r => r.id === warna.id)
    );
    
    // Acak urutan
    const shuffled = [...tambahan].sort(() => 0.5 - Math.random());
    
    // Ambil warna tambahan secukupnya
    const perlu = 5 - rekomendasi.length;
    rekomendasi = [...rekomendasi, ...shuffled.slice(0, perlu)];
  }
  
  // Filter berdasarkan preferensi warna jika ada
  if (preferensiWarna && preferensiWarna !== 'Semua') {
    rekomendasi = rekomendasi.filter(w => w.kategori === preferensiWarna);
  }
  
  return rekomendasi.slice(0, 5);
};

// ============================================================
// FUNGSI UNTUK KELOLA ATURAN (CUSTOM RULES)
// ============================================================

// Menyimpan aturan custom ke localStorage
export function saveCustomAturan(customAturan) {
  localStorage.setItem('customAturanRekomendasi', JSON.stringify(customAturan));
}

// Memuat aturan custom dari localStorage
export function loadCustomAturan() {
  const saved = localStorage.getItem('customAturanRekomendasi');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Gagal parse customAturan:', e);
      return null;
    }
  }
  return null;
}

// Mendapatkan seluruh aturan rekomendasi (default + custom)
export function getAturanRekomendasi() {
  const customAturan = loadCustomAturan();
  if (customAturan) {
    // Merge dengan default (deep merge)
    const merged = JSON.parse(JSON.stringify(rekomendasiRules));
    Object.keys(customAturan).forEach(ruangan => {
      if (!merged[ruangan]) merged[ruangan] = {};
      Object.keys(customAturan[ruangan]).forEach(suasana => {
        if (customAturan[ruangan][suasana].length > 0) {
          merged[ruangan][suasana] = customAturan[ruangan][suasana];
        }
      });
    });
    return merged;
  }
  return rekomendasiRules;
}

// Update aturan rekomendasi untuk kombinasi ruangan dan suasana tertentu
export function updateAturanRekomendasi(ruangan, suasana, warnaArray) {
  const currentCustom = loadCustomAturan() || {};
  
  if (!currentCustom[ruangan]) {
    currentCustom[ruangan] = {};
  }
  
  currentCustom[ruangan][suasana] = warnaArray;
  saveCustomAturan(currentCustom);
  
  console.log('Aturan berhasil diupdate:', ruangan, suasana, warnaArray);
}

// Reset ke aturan default (hapus semua custom)
export function resetAturanRekomendasi() {
  localStorage.removeItem('customAturanRekomendasi');
  console.log('Aturan berhasil direset ke default');
}
console.log('✅ rekomendasiRules.js loaded');
console.log('   Ruangan:', ruanganOptions);
console.log('   Total warna di database:', warnaData.length);