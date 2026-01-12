/* =====================================
   BANK SOAL GAME HARAKAT
   Tarbiyyat Al-Lughah
===================================== */

const HARAKAT_GAME_DATA = [
  // --- KOSAKATA 1 & 2 (YANG TADI) ---
  {
    id: 1,
    level: 1,
    type: "kata",
    plain: "كتاب",
    answer: "كِتَابٌ",
    hint: "Buku (Isim)"
  },
  {
    id: 2,
    level: 1,
    type: "kata",
    plain: "قلم",
    answer: "قَلَمٌ",
    hint: "Pena (Isim)"
  },

  // --- TAMBAHAN KOSAKATA BARU ---
  {
    id: 3,
    level: 1,
    type: "kata",
    plain: "باب",
    answer: "بَابٌ",
    hint: "Pintu (Isim)"
  },
  {
    id: 4,
    level: 1,
    type: "kata",
    plain: "بيت",
    answer: "بَيْتٌ",
    hint: "Rumah (Isim)"
  },
  {
    id: 5,
    level: 1,
    type: "kata",
    plain: "مدرسة",
    answer: "مَدْرَسَةٌ",
    hint: "Sekolah (Isim)"
  },
  {
    id: 6,
    level: 1,
    type: "kata",
    plain: "فصل",
    answer: "فَصْلٌ",
    hint: "Kelas (Isim)"
  },
  {
    id: 7,
    level: 1,
    type: "kata",
    plain: "كرسي",
    answer: "كُرْسِيٌّ",
    hint: "Kursi (Isim)"
  },
  {
    id: 8,
    level: 1,
    type: "kata",
    plain: "مكتب",
    answer: "مَكْتَبٌ",
    hint: "Meja tulis (Isim)"
  },
  {
    id: 9,
    level: 1,
    type: "kata",
    plain: "أستاذ",
    answer: "أُسْتَاذٌ",
    hint: "Guru Laki-laki (Isim)"
  },
  {
    id: 10,
    level: 1,
    type: "kata",
    plain: "تلميذ",
    answer: "تِلْمِيْذٌ",
    hint: "Murid (Isim)"
  },

  // ... (Data ID 1-10 sebelumnya) ...

  /* =====================
      TAMBAHAN (KATA KERJA)
  ===================== */
  {
    id: 11,
    level: 1,
    type: "kata",
    plain: "قرأ",
    answer: "قَرَأَ",
    hint: "Membaca (Fi'il Madhi)"
  },
  {
    id: 12,
    level: 1,
    type: "kata",
    plain: "كتب",
    answer: "كَتَبَ",
    hint: "Menulis (Fi'il Madhi)"
  },
  {
    id: 13,
    level: 1,
    type: "kata",
    plain: "ذهب",
    answer: "ذَهَبَ",
    hint: "Pergi (Fi'il Madhi)"
  },
  {
    id: 14,
    level: 1,
    type: "kata",
    plain: "جلس",
    answer: "جَلَسَ",
    hint: "Duduk (Fi'il Madhi)"
  },
  {
    id: 15,
    level: 1,
    type: "kata",
    plain: "رجع",
    answer: "رَجَعَ",
    hint: "Pulang/Kembali (Fi'il Madhi)"
  },

  /* =====================
      TAMBAHAN (SIFAT & BENDA ALAM)
  ===================== */
  {
    id: 16,
    level: 1,
    type: "kata",
    plain: "كبير",
    answer: "كَبِيْرٌ",
    hint: "Besar (Sifat)"
  },
  {
    id: 17,
    level: 1,
    type: "kata",
    plain: "صغير",
    answer: "صَغِيْرٌ",
    hint: "Kecil (Sifat)"
  },
  {
    id: 18,
    level: 1,
    type: "kata",
    plain: "جميل",
    answer: "جَمِيْلٌ",
    hint: "Indah/Bagus (Sifat)"
  },
  {
    id: 19,
    level: 1,
    type: "kata",
    plain: "شمس",
    answer: "شَمْسٌ",
    hint: "Matahari (Isim)"
  },
  {
    id: 20,
    level: 1,
    type: "kata",
    plain: "قمر",
    answer: "قَمَرٌ",
    hint: "Bulan (Isim)"
  },

  // ... (Data ID 1-20 sebelumnya) ...

  /* =====================
      TEMA: ANGGOTA TUBUH
  ===================== */
  {
    id: 21,
    level: 1,
    type: "kata",
    plain: "رأس",
    answer: "رَأْسٌ",
    hint: "Kepala (Isim)"
  },
  {
    id: 22,
    level: 1,
    type: "kata",
    plain: "وجه",
    answer: "وَجْهٌ",
    hint: "Wajah (Isim)"
  },
  {
    id: 23,
    level: 1,
    type: "kata",
    plain: "يد",
    answer: "يَدٌ",
    hint: "Tangan (Isim)"
  },
  {
    id: 24,
    level: 1,
    type: "kata",
    plain: "رجل",
    answer: "رِجْلٌ",
    hint: "Kaki (Isim)"
  },
  {
    id: 25,
    level: 1,
    type: "kata",
    plain: "عين",
    answer: "عَيْنٌ",
    hint: "Mata (Isim)"
  },
  {
    id: 26,
    level: 1,
    type: "kata",
    plain: "أنف",
    answer: "أَنْفٌ",
    hint: "Hidung (Isim)"
  },
  {
    id: 27,
    level: 1,
    type: "kata",
    plain: "فم",
    answer: "فَمٌ",
    hint: "Mulut (Isim)"
  },

  /* =====================
      TEMA: ALAM & BENDA
  ===================== */
  {
    id: 28,
    level: 1,
    type: "kata",
    plain: "سماء",
    answer: "سَمَاءٌ",
    hint: "Langit (Isim)"
  },
  {
    id: 29,
    level: 1,
    type: "kata",
    plain: "أرض",
    answer: "أَرْضٌ",
    hint: "Bumi (Isim)"
  },
  {
    id: 30,
    level: 1,
    type: "kata",
    plain: "ماء",
    answer: "مَاءٌ",
    hint: "Air (Isim)"
  },
  {
    id: 31,
    level: 1,
    type: "kata",
    plain: "نار",
    answer: "نَارٌ",
    hint: "Api (Isim)"
  },
  {
    id: 32,
    level: 1,
    type: "kata",
    plain: "شجر",
    answer: "شَجَرٌ",
    hint: "Pohon (Isim)"
  },
  {
    id: 33,
    level: 1,
    type: "kata",
    plain: "زهرة",
    answer: "زَهْرَةٌ",
    hint: "Bunga (Isim)"
  },

  /* =====================
      TEMA: KELUARGA
  ===================== */
  {
    id: 34,
    level: 1,
    type: "kata",
    plain: "أب",
    answer: "أَبٌ",
    hint: "Ayah (Isim)"
  },
  {
    id: 35,
    level: 1,
    type: "kata",
    plain: "أم",
    answer: "أُمٌّ",
    hint: "Ibu (Isim)"
  },
  {
    id: 36,
    level: 1,
    type: "kata",
    plain: "أخ",
    answer: "أَخٌ",
    hint: "Saudara Lk (Isim)"
  },
  {
    id: 37,
    level: 1,
    type: "kata",
    plain: "أخت",
    answer: "أُخْتٌ",
    hint: "Saudari Pr (Isim)"
  },

  /* =====================
      TEMA: SIFAT (LAWAN KATA)
  ===================== */
  {
    id: 38,
    level: 1,
    type: "kata",
    plain: "جديد",
    answer: "جَدِيْدٌ",
    hint: "Baru (Sifat)"
  },
  {
    id: 39,
    level: 1,
    type: "kata",
    plain: "قديم",
    answer: "قَدِيْمٌ",
    hint: "Lama/Usang (Sifat)"
  },
  {
    id: 40,
    level: 1,
    type: "kata",
    plain: "طويل",
    answer: "طَوِيْلٌ",
    hint: "Panjang/Tinggi (Sifat)"
  },
  {
    id: 41,
    level: 1,
    type: "kata",
    plain: "قصير",
    answer: "قَصِيْرٌ",
    hint: "Pendek (Sifat)"
  },
  {
    id: 42,
    level: 1,
    type: "kata",
    plain: "نظيف",
    answer: "نَظِيْفٌ",
    hint: "Bersih (Sifat)"
  },
  {
    id: 43,
    level: 1,
    type: "kata",
    plain: "وسخ",
    answer: "وَسِخٌ",
    hint: "Kotor (Sifat)"
  },
  {
    id: 44,
    level: 1,
    type: "kata",
    plain: "حار",
    answer: "حَارٌّ",
    hint: "Panas (Sifat)"
  },
  {
    id: 45,
    level: 1,
    type: "kata",
    plain: "بارد",
    answer: "بَارِدٌ",
    hint: "Dingin (Sifat)"
  },

  /* =====================
      TEMA: TEMPAT & WAKTU
  ===================== */
  {
    id: 46,
    level: 1,
    type: "kata",
    plain: "سوق",
    answer: "سُوْقٌ",
    hint: "Pasar (Isim)"
  },
  {
    id: 47,
    level: 1,
    type: "kata",
    plain: "ميدان",
    answer: "مَيْدَانٌ",
    hint: "Lapangan (Isim)"
  },
  {
    id: 48,
    level: 1,
    type: "kata",
    plain: "صباح",
    answer: "صَبَاحٌ",
    hint: "Pagi (Zaraf)"
  },
  {
    id: 49,
    level: 1,
    type: "kata",
    plain: "مساء",
    answer: "مَسَاءٌ",
    hint: "Sore (Zaraf)"
  },
  {
    id: 50,
    level: 1,
    type: "kata",
    plain: "ليل",
    answer: "لَيْلٌ",
    hint: "Malam (Zaraf)"
  },

  // ... (Data ID 1-50 sebelumnya) ...

  /* =====================
      TEMA: HEWAN (HAYAWANAT)
  ===================== */
  {
    id: 51,
    level: 1,
    type: "kata",
    plain: "جمل",
    answer: "جَمَلٌ",
    hint: "Unta (Isim)"
  },
  {
    id: 52,
    level: 1,
    type: "kata",
    plain: "حصان",
    answer: "حِصَانٌ",
    hint: "Kuda (Isim)"
  },
  {
    id: 53,
    level: 1,
    type: "kata",
    plain: "فيل",
    answer: "فِيْلٌ",
    hint: "Gajah (Isim)"
  },
  {
    id: 54,
    level: 1,
    type: "kata",
    plain: "قط",
    answer: "قِطٌّ",
    hint: "Kucing (Isim)"
  },
  {
    id: 55,
    level: 1,
    type: "kata",
    plain: "طير",
    answer: "طَيْرٌ",
    hint: "Burung (Isim)"
  },
  {
    id: 56,
    level: 1,
    type: "kata",
    plain: "سمك",
    answer: "سَمَكٌ",
    hint: "Ikan (Isim)"
  },
  {
    id: 57,
    level: 1,
    type: "kata",
    plain: "دجاجة",
    answer: "دَجَاجَةٌ",
    hint: "Ayam Betina (Isim)"
  },

  /* =====================
      TEMA: MAKANAN & MINUMAN
  ===================== */
  {
    id: 58,
    level: 1,
    type: "kata",
    plain: "خبز",
    answer: "خُبْزٌ",
    hint: "Roti (Isim)"
  },
  {
    id: 59,
    level: 1,
    type: "kata",
    plain: "رز",
    answer: "رُزٌّ",
    hint: "Nasi (Isim)"
  },
  {
    id: 60,
    level: 1,
    type: "kata",
    plain: "لحم",
    answer: "لَحْمٌ",
    hint: "Daging (Isim)"
  },
  {
    id: 61,
    level: 1,
    type: "kata",
    plain: "بيض",
    answer: "بَيْضٌ",
    hint: "Telur (Isim)"
  },
  {
    id: 62,
    level: 1,
    type: "kata",
    plain: "فاكهة",
    answer: "فَاكِهَةٌ",
    hint: "Buah-buahan (Isim)"
  },
  {
    id: 63,
    level: 1,
    type: "kata",
    plain: "عسل",
    answer: "عَسَلٌ",
    hint: "Madu (Isim)"
  },
  {
    id: 64,
    level: 1,
    type: "kata",
    plain: "قهوة",
    answer: "قَهْوَةٌ",
    hint: "Kopi (Isim)"
  },
  {
    id: 65,
    level: 1,
    type: "kata",
    plain: "حليب",
    answer: "حَلِيْبٌ",
    hint: "Susu (Isim)"
  },

  /* =====================
      TEMA: TRANSPORTASI
  ===================== */
  {
    id: 66,
    level: 1,
    type: "kata",
    plain: "سيارة",
    answer: "سَيَّارَةٌ",
    hint: "Mobil (Isim)"
  },
  {
    id: 67,
    level: 1,
    type: "kata",
    plain: "دراجة",
    answer: "دَرَّاجَةٌ",
    hint: "Sepeda (Isim)"
  },
  {
    id: 68,
    level: 1,
    type: "kata",
    plain: "حافلة",
    answer: "حَافِلَةٌ",
    hint: "Bus (Isim)"
  },
  {
    id: 69,
    level: 1,
    type: "kata",
    plain: "قطار",
    answer: "قِطَارٌ",
    hint: "Kereta Api (Isim)"
  },
  {
    id: 70,
    level: 1,
    type: "kata",
    plain: "سفينة",
    answer: "سَفِيْنَةٌ",
    hint: "Kapal Laut (Isim)"
  },

  /* =====================
      TEMA: PROFESI (MIHNAH)
  ===================== */
  {
    id: 71,
    level: 1,
    type: "kata",
    plain: "طبيب",
    answer: "طَبِيْبٌ",
    hint: "Dokter (Isim)"
  },
  {
    id: 72,
    level: 1,
    type: "kata",
    plain: "مهندس",
    answer: "مُهَنْدِسٌ",
    hint: "Insinyur (Isim)"
  },
  {
    id: 73,
    level: 1,
    type: "kata",
    plain: "فلاح",
    answer: "فَلَّاحٌ",
    hint: "Petani (Isim)"
  },
  {
    id: 74,
    level: 1,
    type: "kata",
    plain: "تاجر",
    answer: "تَاجِرٌ",
    hint: "Pedagang (Isim)"
  },
  {
    id: 75,
    level: 1,
    type: "kata",
    plain: "شرطي",
    answer: "شُرْطِيٌّ",
    hint: "Polisi (Isim)"
  },

  /* =====================
      TEMA: PERABOTAN RUMAH
  ===================== */
  {
    id: 76,
    level: 1,
    type: "kata",
    plain: "سرير",
    answer: "سَرِيْرٌ",
    hint: "Ranjang/Kasur (Isim)"
  },
  {
    id: 77,
    level: 1,
    type: "kata",
    plain: "وسادة",
    answer: "وِسَادَةٌ",
    hint: "Bantal (Isim)"
  },
  {
    id: 78,
    level: 1,
    type: "kata",
    plain: "مصباح",
    answer: "مِصْبَاحٌ",
    hint: "Lampu (Isim)"
  },
  {
    id: 79,
    level: 1,
    type: "kata",
    plain: "مروحة",
    answer: "مِرْوَحَةٌ",
    hint: "Kipas Angin (Isim)"
  },
  {
    id: 80,
    level: 1,
    type: "kata",
    plain: "ساعة",
    answer: "سَاعَةٌ",
    hint: "Jam (Isim)"
  },

  /* =====================
      TEMA: PAKAIAN (MALABIS)
  ===================== */
  {
    id: 81,
    level: 1,
    type: "kata",
    plain: "قميص",
    answer: "قَمِيْصٌ",
    hint: "Kemeja (Isim)"
  },
  {
    id: 82,
    level: 1,
    type: "kata",
    plain: "ثوب",
    answer: "ثَوْبٌ",
    hint: "Baju/Gamis (Isim)"
  },
  {
    id: 83,
    level: 1,
    type: "kata",
    plain: "سروال",
    answer: "سِرْوَالٌ",
    hint: "Celana (Isim)"
  },
  {
    id: 84,
    level: 1,
    type: "kata",
    plain: "حذاء",
    answer: "حِذَاءٌ",
    hint: "Sepatu (Isim)"
  },
  {
    id: 85,
    level: 1,
    type: "kata",
    plain: "قلنسوة",
    answer: "قَلَنْسُوَةٌ",
    hint: "Peci/Kopiah (Isim)"
  },

  /* =====================
      FI'IL MUDHARI (SEDANG...)
  ===================== */
  {
    id: 86,
    level: 1,
    type: "kata",
    plain: "يذهب",
    answer: "يَذْهَبُ",
    hint: "Sedang pergi (Fi'il)"
  },
  {
    id: 87,
    level: 1,
    type: "kata",
    plain: "يرجع",
    answer: "يَرْجِعُ",
    hint: "Sedang pulang (Fi'il)"
  },
  {
    id: 88,
    level: 1,
    type: "kata",
    plain: "يكتب",
    answer: "يَكْتُبُ",
    hint: "Sedang menulis (Fi'il)"
  },
  {
    id: 89,
    level: 1,
    type: "kata",
    plain: "يقرأ",
    answer: "يَقْرَأُ",
    hint: "Sedang membaca (Fi'il)"
  },
  {
    id: 90,
    level: 1,
    type: "kata",
    plain: "يأكل",
    answer: "يَأْكُلُ",
    hint: "Sedang makan (Fi'il)"
  },
  {
    id: 91,
    level: 1,
    type: "kata",
    plain: "يشرب",
    answer: "يَشْرَبُ",
    hint: "Sedang minum (Fi'il)"
  },
  {
    id: 92,
    level: 1,
    type: "kata",
    plain: "ينام",
    answer: "يَنَامُ",
    hint: "Sedang tidur (Fi'il)"
  },

  /* =====================
      SIFAT TAMBAHAN (ADJEKTIVA)
  ===================== */
  {
    id: 93,
    level: 1,
    type: "kata",
    plain: "ماهر",
    answer: "مَاهِرٌ",
    hint: "Pandai/Ahli (Sifat)"
  },
  {
    id: 94,
    level: 1,
    type: "kata",
    plain: "نشيط",
    answer: "نَشِيْطٌ",
    hint: "Rajin (Sifat)"
  },
  {
    id: 95,
    level: 1,
    type: "kata",
    plain: "كسول",
    answer: "كَسُوْلٌ",
    hint: "Malas (Sifat)"
  },
  {
    id: 96,
    level: 1,
    type: "kata",
    plain: "مسرور",
    answer: "مَسْرُوْرٌ",
    hint: "Bahagia (Sifat)"
  },
  {
    id: 97,
    level: 1,
    type: "kata",
    plain: "حزين",
    answer: "حَزِيْنٌ",
    hint: "Sedih (Sifat)"
  },
  {
    id: 98,
    level: 1,
    type: "kata",
    plain: "قوي",
    answer: "قَوِيٌّ",
    hint: "Kuat (Sifat)"
  },
  {
    id: 99,
    level: 1,
    type: "kata",
    plain: "ضعيف",
    answer: "ضَعِيْفٌ",
    hint: "Lemah (Sifat)"
  },
  {
    id: 100,
    level: 1,
    type: "kata",
    plain: "سهل",
    answer: "سَهْلٌ",
    hint: "Mudah (Sifat)"
  }
];
