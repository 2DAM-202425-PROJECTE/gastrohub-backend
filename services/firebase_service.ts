import admin from "firebase-admin";
import path from "path";

// Inicializa solo una vez
if (admin.apps.length === 0) {
  const serviceAccount = require(path.resolve(
    __dirname,
    "../../firebaseAccountKey.json" // Ajusta si está más arriba
  ));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log("✅ Firebase initialized (from firebase.ts)");
}

export default admin;
