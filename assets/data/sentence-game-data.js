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
  }
];