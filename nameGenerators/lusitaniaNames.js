// lusitaniaNames.js

// ------------------------------
// MALE NAME SYLLABLES
// ------------------------------
const maleStart = [
    "Al", "Fer", "Mar", "Gui", "Ema", "Ro", "Dal", "Gio", "Alv", "Vin",
  ];
  const maleMid = [
    "an", "di", "do", "ro", "ma", "ber", "car", "ver", "ri", "se",
  ];
  const maleEnd = [
    "io", "so", "to", "ar", "ar", "o", "ino", "es", "el", "al",
  ];
  
  // ------------------------------
  // FEMALE NAME SYLLABLES
  // ------------------------------
  const femaleStart = [
    "Ma", "Al", "Ro", "Li", "Eu", "An", "Be", "Ca", "El", "Si",
  ];
  const femaleMid = [
    "ri", "sa", "ta", "di", "bo", "lis", "ra", "me", "do", "co",
  ];
  const femaleEnd = [
    "na", "lia", "ta", "ra", "ia", "la", "ria", "ela", "sa", "nda",
  ];
  
  // ------------------------------
  // PREDEFINED LUSITANIAN NAMES
  // ------------------------------
  const lusitanianMaleNames = [
    // Portuguese/Venetian-inspired male names
    "Afonso", "Rodrigo", "Mateus", "Tomas", "João",
    "Lorenzo", "Henrique", "Gaspar", "Rui", "Vicente",
    "Carlos", "Guilherme", "António", "Eduardo", "Bernardo",
    "Francesco", "Marco", "Pietro", "Vittorio", "Duarte",
  ];
  
  const lusitanianFemaleNames = [
    // Portuguese/Venetian-inspired female names
    "Isabela", "Sofia", "Ana", "Lúcia", "Teresa",
    "Helena", "Beatriz", "Mariana", "Luísa", "Catarina",
    "Gabriela", "Diana", "Amélia", "Carlota", "Patrícia",
    "Elena", "Francesca", "Valentina", "Chiara", "Leonor",
  ];
  
  /**
   * Generates a Lusitanian name (Portuguese/Venetian-inspired).
   * 50% chance to use syllable-based, 50% chance to use predefined lists.
   * @param {"male"|"female"} gender
   * @returns {string} The generated name
   */
  function generateName(gender) {
    // 50% chance to use syllable-based approach vs. predefined
    if (Math.random() < 0.5) {
      let syllables = [];
      // Syllable count between 2 and 5
      const syllableCount = Math.floor(Math.random() * 4) + 2;
  
      if (gender === "male") {
        syllables.push(randomChoice(maleStart));
        for (let i = 0; i < syllableCount - 2; i++) {
          syllables.push(randomChoice(maleMid));
        }
        syllables.push(randomChoice(maleEnd));
      } else {
        syllables.push(randomChoice(femaleStart));
        for (let i = 0; i < syllableCount - 2; i++) {
          syllables.push(randomChoice(femaleMid));
        }
        syllables.push(randomChoice(femaleEnd));
      }
  
      // Combine and capitalize properly
      const name = syllables.join("");
      return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    } else {
      // Use predefined arrays
      const nameList =
        gender === "male" ? lusitanianMaleNames : lusitanianFemaleNames;
      return randomChoice(nameList);
    }
  }
  
  /**
   * Utility: pick a random element from an array
   */
  function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  
  export default generateName;