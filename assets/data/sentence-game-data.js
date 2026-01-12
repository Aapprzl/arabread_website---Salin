const SENTENCE_GAME_DATA = [
  {
    id: 1,
    level: 1,
    title: "Kalimat Kerja Sederhana",
    description: "Pola: Kata Kerja (Fi'il) + Pelaku (Fa'il)",
    correct: [
      "أَكَلَ",       // Fi'il (Makan)
      "أَحْمَدُ"      // Fa'il (Ahmad)
    ]
  },
  {
    id: 2,
    level: 1,
    title: "Kalimat Benda (Subjek + Predikat)",
    description: "Pola: Nama Benda (Mubtada') + Sifat/Keterangan (Khabar)",
    correct: [
      "الْبَيْتُ",    // Mubtada' (Rumah itu)
      "كَبِيْرٌ"      // Khabar (Besar)
    ]
  },
  {
    id: 3,
    level: 2,
    title: "Kalimat Kerja + Objek",
    description: "Pola: Kerja + Pelaku + Objek (Maf'ul Bih)",
    correct: [
      "شَرِبَ",       // Fi'il (Minum)
      "عَلِيٌّ",      // Fa'il (Ali)
      "اللَّبَنَ"      // Maf'ul Bih (Susu) - Berakhiran Fathah
    ]
  },
  {
    id: 4,
    level: 2,
    title: "Kata Tunjuk & Sifat",
    description: "Pola: Kata Tunjuk + Kata Benda + Kata Sifat",
    correct: [
      "هَذَا",        // Isim Isyarah (Ini)
      "قَلَمٌ",       // Isim (Pulpen)
      "جَدِيْدٌ"       // Na'at (Baru)
    ]
  },
  {
    id: 5,
    level: 3,
    title: "Keterangan Tempat Sederhana",
    description: "Pola: Kata Benda + Di mana (Keterangan)",
    correct: [
      "الْأُسْتَاذُ",  // Mubtada' (Guru itu)
      "فِي",         // Harf Jar (Di dalam)
      "الْفَصْلِ"      // Isim Majrur (Kelas) - Berakhiran Kasrah
    ]
  },
  {
    id: 6,
    level: 3,
    title: "Kata Ganti (Dhamir) + Profesi",
    description: "Pola: Saya/Kamu (Subjek) + Pekerjaan (Predikat)",
    correct: [
      "أَنَا",        // Dhamir (Saya)
      "طَالِبٌ"      // Khabar (Siswa)
    ]
  },
  {
    id: 7,
    level: 3,
    title: "Keterangan Tempat (Zharaf Makan)",
    description: "Pola: Benda + Posisi (Di atas/Di bawah)",
    correct: [
      "الْكِتَابُ",    // Mubtada' (Buku itu)
      "فَوْقَ",       // Zharaf Makan (Di atas)
      "الْمَكْتَبِ"    // Isim Majrur (Meja) - Berakhiran Kasrah
    ]
  },
  {
    id: 8,
    level: 4,
    title: "Kalimat Tanya Sederhana",
    description: "Pola: Kata Tanya + Kata Tunjuk",
    correct: [
      "مَا",         // Isim Istifham (Apa)
      "هَذَا؟"        // Isim Isyarah (Ini)
    ]
  },
  {
    id: 9,
    level: 4,
    title: "Kepemilikan (Idhafah)",
    description: "Pola: Benda + Pemilik (Mudhaf + Mudhaf Ilaih)",
    correct: [
      "قَلَمُ",       // Mudhaf (Pulpen)
      "زَيْدٍ"        // Mudhaf Ilaih (Milik Zaid) - Berakhiran Kasratain
    ]
  },
  {
    id: 10,
    level: 5,
    title: "Kalimat Negatif Sederhana",
    description: "Pola: Bukan/Tidak + Kata Sifat",
    correct: [
      "لَيْسَ",       // Fi'il Madhi Naqis (Bukan/Tidak)
      "الْمَاءُ",     // Isim Laisa (Air itu)
      "بَارِدًا"      // Khabar Laisa (Dingin) - Berakhiran Fathatain
    ]
  },

  {
    id: 11,
    level: 5,
    title: "Kesesuaian Gender (Muannats)",
    description: "Pola: Benda Perempuan + Sifat Perempuan (Ta Marbuthah)",
    correct: [
      "السَّيَّارَةُ",  // Mubtada' (Mobil itu - Perempuan)
      "جَدِيْدَةٌ"     // Khabar (Baru - Ada 'at-tun' di akhir)
    ]
  },
  {
    id: 12,
    level: 5,
    title: "Kata Ganti Orang Ketiga",
    description: "Pola: Dia (Laki-laki) + Nama/Profesi",
    correct: [
      "هُوَ",         // Dhamir (Dia - Lk)
      "طَبِيْبٌ"      // Khabar (Dokter)
    ]
  },
  {
    id: 13,
    level: 6,
    title: "Kata Perintah (Fi'il Amr)",
    description: "Pola: Kata Perintah + Objek",
    correct: [
      "اِقْرَأْ",       // Fi'il Amr (Bacalah!)
      "الْكِتَابَ"     // Maf'ul Bih (Buku itu)
    ]
  },
  {
    id: 14,
    level: 6,
    title: "Kalimat Larangan (Laa Nahiyah)",
    description: "Pola: Jangan + Kata Kerja",
    correct: [
      "لَا",          // Harf Nahyi (Jangan)
      "تَحْزَنْ"       // Fi'il Mudhari' Majzum (Bersedih)
    ]
  },
  {
    id: 15,
    level: 7,
    title: "Kata Hubung Sederhana (Wa)",
    description: "Pola: Benda 1 + Dan + Benda 2",
    correct: [
      "قَلَمٌ",       // Kata Benda 1
      "وَ",          // Harf 'Athaf (Dan)
      "وَرَقٌ"        // Kata Benda 2 (Kertas)
    ]
  },
  {
    id: 16,
    level: 7,
    title: "Kalimat Tanya 'Apakah'",
    description: "Pola: Apakah + Ini + Nama Benda",
    correct: [
      "هَلْ",         // Isim Istifham (Apakah)
      "هَذَا",        // Isim Isyarah (Ini)
      "كُرْسِيٌّ؟"     // Benda (Kursi)
    ]
  },
  {
    id: 17,
    level: 8,
    title: "Angka Sederhana (Adad)",
    description: "Pola: Bilangan + Benda yang dihitung",
    correct: [
      "ثَلَاثَةُ",     // Adad (Tiga)
      "كُتُبٍ"        // Ma'dud (Buku) - Bentuk jamak & Kasratain
    ]
  },
  {
    id: 18,
    level: 8,
    title: "Warna Benda",
    description: "Pola: Benda + Warnanya",
    correct: [
      "السَّمَاءُ",    // Mubtada' (Langit)
      "زَرْقَاءُ"      // Khabar (Biru - Bentuk Muannats)
    ]
  },
  {
    id: 19,
    level: 9,
    title: "Kata Keterangan Arah",
    description: "Pola: Benda + Arah (Kanan/Kiri)",
    correct: [
      "الْمَسْجِدُ",    // Mubtada' (Masjid itu)
      "يَمِيْنَ",      // Zharaf Makan (Sebelah kanan)
      "الْبَيْتِ"      // Isim Majrur (Rumah)
    ]
  },
  {
    id: 20,
    level: 9,
    title: "Sedang Melakukan (Mudhari' - Dia)",
    description: "Pola: Dia (Lk) + Sedang Menulis",
    correct: [
      "هُوَ",         // Dhamir (Dia)
      "يَكْتُبُ",      // Fi'il Mudhari' (Sedang menulis)
      "الرِّسَالَةَ"    // Maf'ul Bih (Surat)
    ]
  },
  {
    id: 21,
    level: 10,
    title: "Kalimat 'Milik Saya'",
    description: "Pola: Kata Ganti Kepemilikan (Ya Mutakallim)",
    correct: [
      "هَذَا",        // Kata Tunjuk (Ini)
      "أَبِي"         // Isim + Ya Kepemilikan (Ayahku)
    ]
  },
  {
    id: 22,
    level: 10,
    title: "Kata Sifat 'Sangat' (Jiddan)",
    description: "Pola: Benda + Sifat + Sangat",
    correct: [
      "الْفَصْلُ",    // Mubtada' (Kelas itu)
      "وَاسِعٌ",      // Khabar (Luas)
      "جِدًّا"        // Keterangan (Sangat)
    ]
  },
  {
    id: 23,
    level: 11,
    title: "Kata Kerja Lampau (Fi'il Madhi)",
    description: "Pola: Telah Melakukan + Keterangan Waktu",
    correct: [
      "ذَهَبَ",       // Fi'il Madhi (Telah pergi)
      "الْمُدَرِّسُ",  // Fa'il (Guru itu)
      "أَمْسِ"        // Zharaf Zaman (Kemarin)
    ]
  },
  {
    id: 24,
    level: 11,
    title: "Kata Ganti Jamak (Mereka)",
    description: "Pola: Mereka + Para Guru",
    correct: [
      "هُمْ",         // Dhamir Jamak (Mereka)
      "مُدَرِّسُوْنَ"   // Khabar Jamak (Para Guru)
    ]
  },
  {
    id: 25,
    level: 12,
    title: "Kalimat Perbandingan (Isim Tafdhil)",
    description: "Pola: Benda A + Lebih [Sifat] + dari + Benda B",
    correct: [
      "أَحْمَدُ",      // Subjek
      "أَكْبَرُ",      // Isim Tafdhil (Lebih Besar)
      "مِنْ",         // Harf Jar (Dari)
      "زَيْدٍ"        // Pembanding
    ]
  },
  {
    id: 26,
    level: 12,
    title: "Kata Hubung Waktu (Ba'da/Qobla)",
    description: "Pola: Sebelum/Sesudah + Aktivitas",
    correct: [
      "نَوْمٌ",       // Mubtada' (Tidur)
      "بَعْدَ",       // Zharaf (Setelah)
      "الْأَكْلِ"      // Isim Majrur (Makan)
    ]
  },
  {
    id: 27,
    level: 13,
    title: "Kalimat 'Saya Ingin' (An Mashdariyah)",
    description: "Pola: Saya ingin + (untuk) + Menulis",
    correct: [
      "أُرِيْدُ",      // Fi'il (Saya ingin)
      "أَنْ",         // Harf Nashab (Bahwa/Untuk)
      "أَكْتُبَ"      // Fi'il Mudhari' Manshub (Menulis - Akhiran Fathah)
    ]
  },
  {
    id: 28,
    level: 13,
    title: "Kata Sifat Warna (Laki-laki)",
    description: "Pola: Benda + Warna (Bentuk Mudzakkar)",
    correct: [
      "الْكِتَابُ",    // Benda (Buku itu)
      "أَحْمَرُ"       // Warna (Merah)
    ]
  },
  {
    id: 29,
    level: 14,
    title: "Anggota Tubuh & Sifat",
    description: "Pola: Nama Anggota Badan + Sifatnya",
    correct: [
      "عَيْنٌ",        // Benda (Mata)
      "جَمِيْلَةٌ"     // Sifat (Indah) - Mata dianggap muannats
    ]
  },
  {
    id: 30,
    level: 14,
    title: "Kalimat Cuaca",
    description: "Pola: Keadaan Cuaca + Hari ini",
    correct: [
      "الْجَوُّ",      // Subjek (Cuaca)
      "حَارٌّ",       // Khabar (Panas)
      "الْيَوْمَ"      // Keterangan (Hari ini)
    ]
  },
  {
    id: 31,
    level: 15,
    title: "Kerja Perempuan (Fi'il Mudhari')",
    description: "Pola: Dia (Pr) + Sedang Melakukan",
    correct: [
      "هِيَ",         // Dhamir (Dia - Pr)
      "تَقْرَأُ",      // Fi'il (Sedang membaca - Huruf awal 'Ta')
      "الْقُرْآنَ"     // Objek
    ]
  },
  {
    id: 32,
    level: 15,
    title: "Kata Hubung 'Karena' (Lianna)",
    description: "Pola: Saya senang + karena + Guru baik",
    correct: [
      "لِأَنَّ",       // Harf (Karena)
      "الْأُسْتَاذَ",  // Isim Lianna (Guru - Fathah)
      "مَاهِرٌ"       // Khabar (Pintar)
    ]
  },
  {
    id: 33,
    level: 16,
    title: "Keterangan Keadaan (Hal)",
    description: "Pola: Menjelaskan kondisi saat melakukan sesuatu",
    correct: [
      "جَلَسَ",       // Fi'il (Duduk)
      "التِّلْمِيْذُ",  // Fa'il (Siswa)
      "مَبْرُوْرًا"     // Hal (Dengan sopan/baik) - Berakhiran Fathatain
    ]
  },
  {
    id: 34,
    level: 16,
    title: "Kata Tanya 'Kapan' (Mata)",
    description: "Pola: Kapan + Kamu + Pergi",
    correct: [
      "مَتَى",        // Kata Tanya (Kapan)
      "تَذْهَبُ",      // Fi'il (Kamu pergi)
      "إِلَى_الْبَيْتِ" // Keterangan (Ke rumah)
    ]
  },
  {
    id: 35,
    level: 17,
    title: "Kalimat Harapan (La'alla)",
    description: "Pola: Semoga + Ujian + Mudah",
    correct: [
      "لَعَلَّ",       // Harf (Semoga)
      "الِامْتِحَانَ", // Isim (Ujian - Berakhiran Fathah)
      "سَهْلٌ"        // Khabar (Mudah)
    ]
  },
  {
    id: 36,
    level: 17,
    title: "Alat Transportasi",
    description: "Pola: Saya pergi + Dengan (Naik) + Kendaraan",
    correct: [
      "أَذْهَبُ",      // Fi'il (Saya pergi)
      "بِ",          // Harf Jar (Dengan/Naik)
      "الْحَافِلَةِ"    // Isim Majrur (Bus) - Berakhiran Kasrah
    ]
  },
  {
    id: 37,
    level: 18,
    title: "Keterangan Jam (As-Sa'ah)",
    description: "Pola: Sekarang + Jam + Angka Jam",
    correct: [
      "الْآنَ",        // Keterangan (Sekarang)
      "السَّاعَةُ",    // Benda (Jam)
      "الرَّابِعَةُ"    // Angka (Empat)
    ]
  },
  {
    id: 38,
    level: 18,
    title: "Kerja Lampau Perempuan (Fi'il Madhi)",
    description: "Pola: Dia (Pr) + Telah Memasak",
    correct: [
      "هِيَ",         // Dhamir (Dia - Pr)
      "طَبَخَتْ",      // Fi'il Madhi + Ta Sukun (Telah memasak)
      "الرُّزَّ"       // Objek (Nasi)
    ]
  },
  {
    id: 39,
    level: 19,
    title: "Kata Hubung 'Atau' (Am)",
    description: "Pola: Apakah A + Atau + B",
    correct: [
      "أَ",           // Hamzah Istifham (Apakah)
      "عَصِيْرًا",     // Pilihan 1 (Jus)
      "أَمْ",         // Kata Hubung (Atau)
      "مَاءً؟"        // Pilihan 2 (Air)
    ]
  },
  {
    id: 40,
    level: 19,
    title: "Posisi di Dalam Rumah",
    description: "Pola: Ibu + Di + Dapur",
    correct: [
      "الْأُمُّ",       // Subjek (Ibu)
      "فِي",         // Harf Jar (Di dalam)
      "الْمَطْبَخِ"     // Tempat (Dapur)
    ]
  },
  {
    id: 41,
    level: 20,
    title: "Kata Ganti 'Milikmu' (Ka)",
    description: "Pola: Di mana + Tas + Mu (Lk)",
    correct: [
      "أَيْنَ",        // Kata Tanya (Di mana)
      "حَقِيْبَتُ",    // Benda (Tas)
      "كَ؟"          // Dhamir Muttashil (Mu - Laki-laki)
    ]
  },
  {
    id: 42,
    level: 20,
    title: "Pengecualian (Istitsna)",
    description: "Pola: Semua datang + Kecuali + Zaid",
    correct: [
      "حَضَرَ",       // Fi'il (Hadir)
      "الْكُلُّ",      // Fa'il (Semua)
      "إِلَّا",        // Harf Istitsna (Kecuali)
      "زَيْدًا"       // Mustatsna (Zaid - Berakhiran Fathatain)
    ]
  },
];