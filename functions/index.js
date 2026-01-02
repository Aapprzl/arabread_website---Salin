function generatePassword(length = 8) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let pass = "";
  for (let i = 0; i < length; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}


const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

admin.initializeApp();

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

        // 2. Simpan ke Firestore
        await admin.firestore().collection("users").doc(user.uid).set({
          uid: user.uid,
          nama,
          nisn,
          kelas,
          gender,
          role: "student",
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
