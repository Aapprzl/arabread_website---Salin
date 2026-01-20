function generatePassword(length = 8) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let pass = "";
  for (let i = 0; i < length; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}


const { onRequest } = require("firebase-functions/v2/https");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });


admin.initializeApp();

// ----BUAT AKUN
exports.createStudentAccount = onRequest(
  { region: "asia-southeast1" },
  async (req, res) => {
    cors(req, res, async () => {
      try {
        const { nama, nisn, kelas, gender } = req.body;

        if (!nama || !nisn || !kelas || !gender) {
          return res.status(400).json({ error: "Data tidak lengkap" });
        }

        const email = `${nisn}@siswa.sekolah.id`;
        const password = generatePassword(8);

        // 1. Buat akun auth
        const user = await admin.auth().createUser({
          email,
          password,
          displayName: nama
        });

        // 2. Simpan ke Firestore (INISIALISASI LENGKAP)
await admin.firestore().collection("users").doc(user.uid).set({
  uid: user.uid,
  nama,
  nisn,
  kelas,
  gender,
  role: "student",

  // 🔑 WAJIB ADA SEJAK AWAL
  jumlahMain: 0,
  skorTerbaik: 0,
  poinTotal: 0,

  mustChangePassword: true,
  createdAt: admin.firestore.FieldValue.serverTimestamp()
});


        res.json({
          uid: user.uid,
          email,
          password
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
      }
    });
  }
);


// ==========================================
// 🔥 CLEANUP ANONYMOUS USERS (PRO LEVEL)
// ==========================================
exports.cleanupAnonymousUsers = functions.https.onRequest(async (req, res) => {
  try {
    let deletedCount = 0;
    let nextPageToken = undefined;

    do {
      const result = await admin.auth().listUsers(1000, nextPageToken);
      nextPageToken = result.pageToken;

      for (const user of result.users) {
        if (user.providerData.length === 0) {
          // user anonymous
          await admin.auth().deleteUser(user.uid);
          deletedCount++;
        }
      }
    } while (nextPageToken);

    return res.status(200).send(
      `✅ Cleanup selesai. ${deletedCount} anonymous users dihapus`
    );
  } catch (error) {
    console.error("Cleanup error:", error);
    return res.status(500).send(
      "❌ Gagal cleanup anonymous users: " + error.message
    );
  }
});
