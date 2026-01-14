/**
 * ARABIC UTILITIES
 * Helper functions for Arabic text handling and keyboard logic.
 */

// Normalizes Arabic text by removing harakat and standardizing spacing
export function normalizeArabic(text) {
    if (!text) return "";
    return text.trim()
             .replace(/\s+/g, " ")
             .replace(/[\u064B-\u0652\u0670\u06D6-\u06ED]/g, "") // Remove Harakat & Marks
             .replace(/ـ/g, ""); // Remove Tatweel/Kashida
}

// Handles inserting Arabic characters with intelligent harakat merging
// ported from student-games-engine.js and harakat-game.js
export function insertArabicChar(inputElement, char) {
    if (!inputElement) return;

    const HARAKAT_GROUPS = {
        vowel: ["َ", "ِ", "ُ", "ً", "ٍ", "ٌ"],
        sukun: ["ْ"],
        shadda: ["ّ"]
    };

    function getType(c) {
        for (const t in HARAKAT_GROUPS) {
            if (HARAKAT_GROUPS[t].includes(c)) return t;
        }
        return null;
    }

    function isHarakat(c) { 
        return /[\u064B-\u0652]/.test(c); 
    }

    const value = inputElement.value;
    const type = getType(char);

    // If it's a normal letter (not harakat), just append
    if (!type) {
        inputElement.value += char;
        // Trigger input event for frameworks/listeners
        inputElement.dispatchEvent(new Event('input'));
        return;
    }

    // If it's a Harakat, find the base character to attach to
    let i = value.length - 1;
    while (i >= 0 && isHarakat(value[i])) i--;
    
    if (i < 0) {
        // No base char found, arguably shouldn't add harakat at start, but let's allow append for flexibility
        inputElement.value += char;
        return;
    }

    const base = value.slice(0, i + 1);
    let existingHarakat = value.slice(i + 1);

    // Logic to merge/replace harakat
    // Shadda + Vowel is allowed. Vowel + Vowel is replaced.
    if (type === "sukun") {
        // Sukun removes previous vowels, keeps Shadda
        existingHarakat = existingHarakat.split("").filter(h => getType(h) === "shadda").join("");
    } else if (type === "vowel") {
        // New vowel replaces old vowel, keeps Shadda
        existingHarakat = existingHarakat.split("").filter(h => getType(h) === "shadda").join("");
    } else if (type === "shadda") {
       // Shadda is added if not present
       if (existingHarakat.includes(char)) return; // Already has shadda
    }
    
    // Prevent duplicates of the exact same char just in case
    existingHarakat = existingHarakat.split("").filter(h => h !== char).join("");
    
    inputElement.value = base + existingHarakat + char;
    inputElement.dispatchEvent(new Event('input'));
}
