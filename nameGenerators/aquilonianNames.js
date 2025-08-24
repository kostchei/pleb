// aquilonianNames.js
// ------------------------------
// MALE NAME SYLLABLES
// ------------------------------
const maleStart = ["Ar", "Ca", "Mer", "Mor", "Per", "Lan", "Vi", "Ig", "Ka"];
const maleMid   = ["bel", "cal", "gal", "mor", "tar", "uth", "win", "nor"];
const maleEnd   = ["gon", "loc", "lon", "din", "der", "lan", "thur", "gaw"];

// ------------------------------
// FEMALE NAME SYLLABLES
// ------------------------------
const femaleStart = ["An", "Mor", "Gua", "Hel", "Is", "Ela", "Vi", "Gly", "Ca"];
const femaleMid   = ["a", "e", "i", "o", "ia", "ora", "ella", "lyn", "thea"];
const femaleEnd   = ["wen", "lin", "vyr", "min", "sir", "lott", "ryn", "dell"];

// ------------------------------
// ARTHURIAN NAMES
// ------------------------------
const arthurianMaleNames = [
    "Lancelot", "Gawain", "Percival", "Galahad", "Kay", "Bedivere", "Tristan",
    "Gaheris", "Gareth", "Lamorak", "Bors", "Lionel", "Agravain", "Palamedes",
    "Safir", "Ector", "Calogrenant", "Uther", "Lot", "Mark", "Pellinore", "Ban",
    "Caradoc", "Gorlois", "Uriens", "Merlin", "Yvain", "Sagramore", "Brunor",
    "Dinadan", "Morien", "Pelleas", "Tor", "Meliant", "Brandiles", "Dagonet",
    "Culhwch", "Goreu", "Cei", "Menw", "Geraint", "Owain", "Accolon",
    "Louen", "Calard", "Tancred", "Bohemond", "Gaston", "Cassyon", "Reynard",
    "Childebert", "Thierulf", "Adalhard", "Theoderic", "Arthur", "Segwarides",
    "Claudas", "Helias", "Maugantius", "Pellam", "Drystan", "Esclabor"
];

const arthurianFemaleNames = [
    "Guinevere", "Morgan", "Morgause", "Igraine", "Elaine", "Lynette",
    "Lyonesse", "Isolde", "Nimue", "Viviane", "Enide", "Laudine", "Lunete",
    "Blanchefleur", "Ragnell", "Clarissant", "Hellawes", "Sebile", "Angharad",
    "Amalberga", "Bertilde", "Chlotilde", "Fastrada", "Ermengarde", "Richilde",
    "Repanse", "Olwen", "Ganieda", "Blasine", "Ninianne", "Rotrud"
];

/**
 * Generates a name either using syllable combination or picking from Arthurian names
 * 
 * @param {"male"|"female"} type - Which type of name to generate.
 * @returns {string} The generated name (with the first letter capitalized).
 */
function generateName(type) {
    // 50% chance to use either method
    if (Math.random() < 0.5) {
        // Use original syllable-based generation
        let syllables = [];
        const syllableCount = Math.random() < 0.5 ? 2 : 3;
        
        if (type === "male") {
            syllables.push(randomChoice(maleStart));
            if (syllableCount === 3) {
                syllables.push(randomChoice(maleMid));
            }
            syllables.push(randomChoice(maleEnd));
        } else {
            syllables.push(randomChoice(femaleStart));
            if (syllableCount === 3) {
                syllables.push(randomChoice(femaleMid));
            }
            syllables.push(randomChoice(femaleEnd));
        }
        
        const name = syllables.join("");
        return name.charAt(0).toUpperCase() + name.slice(1);
    } else {
        // Use Arthurian names
        const nameList = type === "male" ? arthurianMaleNames : arthurianFemaleNames;
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