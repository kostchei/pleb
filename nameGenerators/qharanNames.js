// qharanNames.js

// Predefined Q'haran names
const QHARAN_NAMES = {
  male: [
      // Traditional Q'haran names
      "Malik", "Hassan", "Karim", "Jamal", "Rashid", 
      "Tariq", "Zafar", "Qadir", "Nasir", "Khalil",
      "Azim", "Hakim", "Salim", "Wasim", "Basil",
      "Farid", "Zahir", "Rafik", "Nabil", "Samir",
      // Mystical/Religious names
      "Al-Hazir", "Nur-Din", "Saif-Allah", "Badr-El", "Zul-Qar",
      "Asad-Din", "Najm-El", "Shams-Din", "Imad-Din", "Fakhr-El"
  ],
  female: [
      // Traditional Q'haran names
      "Amira", "Layla", "Nadia", "Samira", "Karima",
      "Jamila", "Nadira", "Zahra", "Malika", "Safiya",
      "Naima", "Rania", "Dalila", "Farida", "Hasina",
      "Jalila", "Latifa", "Nabila", "Qamara", "Sabrina",
      // Mystical/Religious names
      "Nur-El", "Badr-El", "Qamar-Din", "Shams-El", "Zain-El",
      "Amat-Allah", "Sitt-El", "Durr-El", "Fakhr-El", "Husn-El"
  ]
};

// Q'haran name patterns
const NAME_PATTERNS = {
  start: [
      "Al", "El", "Qa", "Sa", "Za", "Ba", "Na", "Ma", "Ka", "Ha"
  ],
  middle: [
      "li", "ri", "si", "mi", "di", "fi", "hi", "zi", "ni", "qi"
  ],
  end: [
      "m", "r", "d", "f", "l", "n", "b", "h", "k", "q"
  ],
  titles: [
      "al-Din", "el-Haq", "al-Nur", "el-Qadir", "al-Azim",
      "el-Hakim", "al-Rashid", "el-Karim", "al-Malik"
  ]
};

/**
* Generates a Q'haran name
* @param {"male"|"female"} gender - The gender to generate a name for
* @returns {string} The generated name
*/
function generateName(gender) {
  // 50% chance to use predefined names
  if (Math.random() < 0.5) {
      return randomChoice(QHARAN_NAMES[gender]);
  }
  
  // Otherwise generate a new name
  return generateQharanName(gender);
}

/**
* Generates a new Q'haran name using patterns
* @param {"male"|"female"} gender - The gender to generate for
* @returns {string} The generated name
*/
function generateQharanName(gender) {
  const parts = [];
  
  // Add starting part
  parts.push(randomChoice(NAME_PATTERNS.start));
  
  // Always add middle part to avoid overly short names
  parts.push(randomChoice(NAME_PATTERNS.middle));
  
  // Add end part
  parts.push(randomChoice(NAME_PATTERNS.end));
  
  // Base name
  let name = parts.join("");
  name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  
  // 30% chance to add a title
  if (Math.random() < 0.3) {
      name = name + " " + randomChoice(NAME_PATTERNS.titles);
  }
  
  return name;
}

/**
* Picks a random element from an array
*/
function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default generateName;