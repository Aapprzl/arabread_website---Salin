import { db, collection, getDocs } from './firebase-config.js';

export let THEME_REGISTRY = {};

export async function fetchThemes() {
  try {
    const querySnapshot = await getDocs(collection(db, "themes"));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Add to registry (override if exists)
      THEME_REGISTRY[doc.id] = {
        id: doc.id,
        title: data.title,
        arTitle: data.arTitle,
        desc: data.desc,
        color: data.color || "blue",
        vocabFilter: doc.id,
        vocabData: data.vocabData,   // Direct data if stored in DB
        readData: data.readData,     // Direct data
        quizData: data.quizData,     // Direct data
        isVisible: data.isVisible,   // Boolean visibility toggle
        source: "firestore"
      };
    });
    console.log("Themes Loaded:", THEME_REGISTRY);
    return THEME_REGISTRY;
  } catch (e) {
    console.warn("Failed to load themes from Firestore, using local backup", e);
    return THEME_REGISTRY;
  }
}
