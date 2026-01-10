/* =====================================================
   BANK MATERI GRAMMAR
   Berbasis: Nahwu al-Muyassar li Ashabis Shighar
   Level   : Pemula
   Prinsip : Kata → Fungsi → Makna
===================================================== */

const BANK_MATERI = {

  meta: {
    sumber: "Nahwu al-Muyassar li Ashabis Shighar",
    level: "pemula",
    pendekatan: "muyassar",
    catatan: "Tanpa definisi nahwu klasik dan tanpa pembahasan i'rab"
  },

  tahap: [
    {
      id: "t1",
      judul_id: "Mengenal Kata",
      judul_ar: "الكلمة",
      deskripsi: "Mengenal jenis-jenis kata dalam bahasa Arab"
    },
    {
      id: "t2",
      judul_id: "Memahami Susunan Kalimat",
      judul_ar: "الجملة",
      deskripsi: "Memahami bagaimana kata tersusun menjadi kalimat"
    },
    {
      id: "t3",
      judul_id: "Memahami Makna dalam Kalimat",
      judul_ar: "المعنى في الجملة",
      deskripsi: "Memahami fungsi kata yang memberi makna khusus dalam kalimat"
    }
  ],

  pelajaran: [

    /* =====================================================
       PELAJARAN 1 — ISIM
    ===================================================== */
    {
      id: "t1-01",
      tahap: "t1",
      urutan: 1,

      judul_id: "Isim",
      judul_ar: "الاِسْمُ",
      
      // REFERENSI DITAMBAHKAN
      referensi: "Nahwu al-Muyassar, Hal. 4",

      tujuan: [
        "Siswa mengenal kata benda dalam bahasa Arab",
        "Siswa dapat membedakan isim dari fi'il dan harf"
      ],

      penjelasan_muyassar: [
        "Isim adalah kata yang digunakan untuk menamai sesuatu.",
        "Nama orang, benda, hewan, tempat, dan sifat termasuk isim.",
        "Isim tidak menunjukkan waktu."
      ],

      contoh: [
        {
          ar: "مُحَمَّدٌ طَالِبٌ",
          id: "Muhammad adalah seorang murid.",
          fokus: "Kata مُحَمَّدٌ dan طَالِبٌ adalah isim"
        },
        {
          ar: "الْمَدْرَسَةُ كَبِيرَةٌ",
          id: "Sekolah itu besar.",
          fokus: "Kata الْمَدْرَسَةُ adalah isim"
        }
      ],

      batas_pemula: "Cukup pahami isim sebagai 'nama sesuatu'."
    },

    /* =====================================================
       PELAJARAN 2 — FI'IL
    ===================================================== */
    {
      id: "t1-02",
      tahap: "t1",
      urutan: 2,

      judul_id: "Fi'il",
      judul_ar: "الفِعْلُ",

      // REFERENSI DITAMBAHKAN
      referensi: "Nahwu al-Muyassar, Hal. 6",

      tujuan: [
        "Siswa memahami bahwa fi'il menunjukkan perbuatan",
        "Siswa mengenal bahwa fi'il berkaitan dengan waktu"
      ],

      penjelasan_muyassar: [
        "Fi'il adalah kata yang menunjukkan suatu perbuatan.",
        "Setiap fi'il berkaitan dengan waktu, baik sudah, sedang, atau akan.",
        "Kata seperti pergi, makan, dan menulis termasuk fi'il."
      ],

      contoh: [
        {
          ar: "ذَهَبَ أَحْمَدُ",
          id: "Ahmad telah pergi.",
          fokus: "Kata ذَهَبَ adalah fi'il (perbuatan)"
        },
        {
          ar: "يَكْتُبُ الطَّالِبُ",
          id: "Murid itu sedang menulis.",
          fokus: "Kata يَكْتُبُ adalah fi'il"
        }
      ],

      batas_pemula: "Tidak perlu membahas jenis-jenis fi'il secara rinci."
    },

    /* =====================================================
       PELAJARAN 3 — HARF
    ===================================================== */
    {
      id: "t1-03",
      tahap: "t1",
      urutan: 3,

      judul_id: "Harf",
      judul_ar: "الحَرْفُ",

      // REFERENSI DITAMBAHKAN
      referensi: "Nahwu al-Muyassar, Hal. 8",

      tujuan: [
        "Siswa mengenal kata penghubung dalam bahasa Arab",
        "Siswa memahami bahwa harf tidak berdiri sendiri"
      ],

      penjelasan_muyassar: [
        "Harf adalah kata yang berfungsi menghubungkan kata lain.",
        "Harf tidak memiliki makna sendiri jika berdiri sendiri.",
        "Makna harf muncul ketika bersama isim atau fi'il."
      ],

      contoh: [
        {
          ar: "فِي الْبَيْتِ",
          id: "Di dalam rumah.",
          fokus: "Kata فِي adalah harf"
        },
        {
          ar: "إِلَى الْمَدْرَسَةِ",
          id: "Ke sekolah.",
          fokus: "Kata إِلَى adalah harf"
        }
      ],

      batas_pemula: "Cukup pahami harf sebagai kata penghubung."
    },

    /* =====================================================
       TAHAP 2 — MEMAHAMI SUSUNAN KALIMAT
    ===================================================== */

    {
      id: "t2-01",
      tahap: "t2",
      urutan: 1,

      judul_id: "Kalimat dalam Bahasa Arab",
      judul_ar: "الجُمْلَةُ",

      // REFERENSI DITAMBAHKAN
      referensi: "Nahwu al-Muyassar, Hal. 12",

      tujuan: [
        "Siswa memahami pengertian kalimat",
        "Siswa mengetahui bahwa kalimat tersusun dari kata"
      ],

      penjelasan_muyassar: [
        "Kalimat adalah rangkaian kata yang memiliki makna.",
        "Satu kata saja belum tentu menjadi kalimat.",
        "Dalam bahasa Arab, kalimat tersusun dari beberapa kata yang saling berkaitan."
      ],

      contoh: [
        {
          ar: "الطَّالِبُ مُجْتَهِدٌ",
          id: "Murid itu rajin.",
          fokus: "Ini adalah satu kalimat utuh"
        },
        {
          ar: "ذَهَبَ أَحْمَدُ",
          id: "Ahmad telah pergi.",
          fokus: "Kalimat terdiri dari beberapa kata"
        }
      ],

      batas_pemula: "Fokus pada makna kalimat, bukan susunan i‘rab."
    },

    {
      id: "t2-02",
      tahap: "t2",
      urutan: 2,

      judul_id: "Jumlah Ismiyyah",
      judul_ar: "الجُمْلَةُ الاِسْمِيَّةُ",

      // REFERENSI DITAMBAHKAN
      referensi: "Nahwu al-Muyassar, Hal. 14",

      tujuan: [
        "Siswa mengenal kalimat yang diawali isim",
        "Siswa memahami konsep subjek dan penjelas"
      ],

      penjelasan_muyassar: [
        "Jumlah ismiyyah adalah kalimat yang diawali dengan isim.",
        "Kalimat ini biasanya membicarakan sesuatu dan menjelaskannya.",
        "Jumlah ismiyyah sering digunakan untuk menyatakan keadaan."
      ],

      contoh: [
        {
          ar: "الْبَيْتُ كَبِيرٌ",
          id: "Rumah itu besar.",
          fokus: "Kalimat diawali isim الْبَيْتُ"
        },
        {
          ar: "الطَّالِبُ نَشِيطٌ",
          id: "Murid itu rajin.",
          fokus: "Isim di awal kalimat"
        }
      ],

      batas_pemula: "Tidak perlu mengenal istilah mubtada’ dan khabar dulu."
    },

    {
      id: "t2-03",
      tahap: "t2",
      urutan: 3,

      judul_id: "Jumlah Fi‘liyyah",
      judul_ar: "الجُمْلَةُ الْفِعْلِيَّةُ",

      // REFERENSI DITAMBAHKAN
      referensi: "Nahwu al-Muyassar, Hal. 16",

      tujuan: [
        "Siswa mengenal kalimat yang diawali fi'il",
        "Siswa memahami bahwa perbuatan bisa menjadi awal kalimat"
      ],

      penjelasan_muyassar: [
        "Jumlah fi‘liyyah adalah kalimat yang diawali dengan fi'il.",
        "Kalimat ini menekankan pada perbuatan yang terjadi.",
        "Pelaku perbuatan biasanya disebut setelah fi'il."
      ],

      contoh: [
        {
          ar: "ذَهَبَ الطَّالِبُ",
          id: "Murid itu pergi.",
          fokus: "Kalimat diawali fi'il ذَهَبَ"
        },
        {
          ar: "يَلْعَبُ الْوَلَدُ",
          id: "Anak itu bermain.",
          fokus: "Fi'il muncul di awal kalimat"
        }
      ],

      batas_pemula: "Cukup pahami urutan kata, bukan perubahan akhir kata."
    },

    /* =====================================================
       TAHAP 3 — MEMAHAMI MAKNA DALAM KALIMAT
    ===================================================== */

    {
      id: "t3-01",
      tahap: "t3",
      urutan: 1,

      judul_id: "Isim Isyarah",
      judul_ar: "اِسْمُ الإِشَارَةِ",

      // REFERENSI DITAMBAHKAN
      referensi: "Nahwu al-Muyassar, Hal. 20",

      tujuan: [
        "Siswa mengenal kata tunjuk dalam bahasa Arab",
        "Siswa memahami fungsi menunjuk dalam kalimat"
      ],

      penjelasan_muyassar: [
        "Isim isyarah adalah kata yang digunakan untuk menunjuk sesuatu.",
        "Kata tunjuk digunakan ketika sesuatu sudah diketahui atau terlihat.",
        "Isim isyarah selalu digunakan bersama kata lain."
      ],

      contoh: [
        {
          ar: "هَذَا بَيْتٌ",
          id: "Ini adalah rumah.",
          fokus: "هَذَا adalah kata tunjuk"
        },
        {
          ar: "تِلْكَ مَدْرَسَةٌ",
          id: "Itu adalah sekolah.",
          fokus: "تِلْكَ menunjuk sesuatu yang jauh"
        }
      ],

      batas_pemula: "Cukup mengenal fungsi menunjuk, bukan pembagiannya."
    },

    {
      id: "t3-02",
      tahap: "t3",
      urutan: 2,

      judul_id: "Isim Maushul",
      judul_ar: "اِسْمُ المَوْصُولِ",

      // REFERENSI DITAMBAHKAN
      referensi: "Nahwu al-Muyassar, Hal. 22",

      tujuan: [
        "Siswa mengenal kata penghubung makna",
        "Siswa memahami fungsi 'yang' dalam bahasa Arab"
      ],

      penjelasan_muyassar: [
        "Isim maushul digunakan untuk menghubungkan dua bagian kalimat.",
        "Dalam bahasa Indonesia, sering diterjemahkan dengan kata 'yang'.",
        "Kata ini membantu menjelaskan sesuatu secara lebih rinci."
      ],

      contoh: [
        {
          ar: "الطَّالِبُ الَّذِي يَجْتَهِدُ نَاجِحٌ",
          id: "Murid yang bersungguh-sungguh itu berhasil.",
          fokus: "الَّذِي menghubungkan penjelasan"
        }
      ],

      batas_pemula: "Tidak perlu menghafal semua bentuk isim maushul."
    },

    {
      id: "t3-03",
      tahap: "t3",
      urutan: 3,

      judul_id: "Nida’ (Panggilan)",
      judul_ar: "النِّدَاءُ",

      // REFERENSI DITAMBAHKAN
      referensi: "Nahwu al-Muyassar, Hal. 25",

      tujuan: [
        "Siswa memahami cara memanggil dalam bahasa Arab",
        "Siswa mengenal fungsi huruf panggilan"
      ],

      penjelasan_muyassar: [
        "Nida’ digunakan ketika seseorang dipanggil atau diajak bicara.",
        "Biasanya menggunakan kata panggilan seperti 'wahai'.",
        "Panggilan memberi penekanan kepada orang yang diajak bicara."
      ],

      contoh: [
        {
          ar: "يَا طَالِبُ",
          id: "Wahai murid!",
          fokus: "يَا adalah kata panggilan"
        }
      ],

      batas_pemula: "Cukup mengenal bentuk umum nida’."
    },

    {
      id: "t3-04",
      tahap: "t3",
      urutan: 4,

      judul_id: "Istifham (Pertanyaan)",
      judul_ar: "الاِسْتِفْهَامُ",

      // REFERENSI DITAMBAHKAN
      referensi: "Nahwu al-Muyassar, Hal. 27",

      tujuan: [
        "Siswa mengenal kalimat tanya sederhana",
        "Siswa memahami fungsi bertanya dalam kalimat"
      ],

      penjelasan_muyassar: [
        "Istifham digunakan untuk bertanya.",
        "Pertanyaan membantu mendapatkan informasi.",
        "Dalam bahasa Arab, ada kata khusus untuk bertanya."
      ],

      contoh: [
        {
          ar: "مَنْ هَذَا؟",
          id: "Siapa ini?",
          fokus: "مَنْ digunakan untuk bertanya tentang orang"
        },
        {
          ar: "مَا هَذَا؟",
          id: "Apa ini?",
          fokus: "مَا digunakan untuk bertanya tentang benda"
        }
      ],

      batas_pemula: "Cukup mengenal fungsi bertanya, bukan jenisnya."
    }

  ],
};