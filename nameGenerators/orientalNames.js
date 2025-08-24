// orientalNames.js
// ------------------------------
// MALE NAME SYLLABLES
// ------------------------------
const maleStart = [
    // Japanese
    "Kai", "Ryu", "Ken", "Shin", "Taka", "Hiro", "Yasu", "Masa", "Nobu", "Toshi",
    // Mandarin
    "Zhe", "Jin", "Chen", "Xia", "Bao", "Feng", "Hui", "Jian", "Ming", "Wei",
    // Khmer/Lao
    "Som", "Sou", "Pon", "Bun", "Chan", "Kham", "Phon", "Seng", "Vieng", "Xay"
];

const maleMid = [
    // Japanese
    "shu", "kun", "suke", "chi", "roku", "nori", "hiko", "taka", "yuki", "moto",
    // Mandarin
    "long", "wei", "ming", "rou", "feng", "hua", "xiang", "zhong", "yang", "ping",
    // Khmer/Lao
    "sam", "nak", "phet", "thong", "vong", "lay", "keo", "song", "phan", "rack"
];

const maleEnd = [
    // Japanese
    "shi", "ro", "to", "ki", "ru", "ji", "ya", "zo", "ke", "ma",
    // Mandarin
    "tao", "gan", "lin", "hui", "dong", "jun", "cao", "bin", "fei", "wu",
    // Khmer/Lao
    "seng", "rak", "thy", "nan", "lok", "vong", "lay", "det", "von", "sinh"
];

// ------------------------------
// FEMALE NAME SYLLABLES
// ------------------------------
const femaleStart = [
    // Japanese
    "Mei", "Saku", "Aki", "Haru", "Kyo", "Mido", "Nao", "Rei", "Sae", "Yuka",
    // Mandarin
    "Hua", "Lin", "Yue", "Xiu", "Bai", "Fei", "Jing", "Lan", "Qing", "Zhi",
    // Khmer/Lao
    "Som", "Chan", "Kham", "Phim", "Seng", "Thy", "Vien", "Xay", "Keo", "Nou"
];

const femaleMid = [
    // Japanese
    "mi", "ko", "ra", "yu", "rei", "chi", "na", "rin", "sa", "tsu",
    // Mandarin
    "ying", "hua", "xia", "mei", "li", "zhen", "qian", "feng", "wei", "ju",
    // Khmer/Lao
    "tha", "ny", "ly", "phi", "si", "vi", "ma", "ri", "sa", "da"
];

const femaleEnd = [
    // Japanese
    "ko", "mi", "ka", "ri", "na", "ho", "yo", "ki", "ne", "me",
    // Mandarin
    "mei", "ling", "yan", "pin", "fen", "xue", "yue", "hua", "zhi", "qi",
    // Khmer/Lao
    "ny", "thy", "ry", "sy", "ly", "vy", "dy", "py", "my", "ky"
];

// ------------------------------
// ORIENTAL NAMES
// ------------------------------
const orientalMaleNames = [
    // Japanese names
    "Akira", "Daisuke", "Haruki", "Hiroshi", "Ichiro", "Kaito", "Kenji", 
    "Masashi", "Takeshi", "Yamato", "Satoshi", "Ryota", "Kazuki", "Daiki",
    "Takashi", "Shigeru", "Yosuke", "Tatsuya", "Kazuo", "Noboru",
    // Chinese names
    "Wei Ming", "Jian Yu", "Feng Jun", "Chen Gang", "Hong Long", "Tao Bo",
    "Lei Ping", "Wu Chen", "Xiang Zhe", "Yuan Ting", "Li Wei", "Zhang Min",
    "Wang Lei", "Liu Yang", "Sun Tzu", "Zhao Yun", "Guo Jing", "Huang Fu",
    "Cao Wei", "Shen Yi",
    // Khmer names
    "Sokha", "Vibol", "Chamroeun", "Dara", "Kosal", "Nimol", "Phirun",
    "Rith", "Sophal", "Thearith", "Ponlok", "Makara", "Vannak", "Sovann",
    "Piseth", "Rithy", "Sambath", "Veasna", "Chantha", "Chann"
];

const orientalFemaleNames = [
    // Japanese names
    "Akane", "Yuki", "Hanako", "Kaori", "Keiko", "Kumiko", "Sakura",
    "Yumi", "Aiko", "Michiko", "Haruka", "Misaki", "Natsumi", "Rin",
    "Saki", "Ayumi", "Nanami", "Yuka", "Chihiro", "Asuka",
    // Chinese names
    "Mei Ling", "Xia Yan", "Hui Juan", "Hong Ying", "Li Feng", "Min Hua",
    "Jing Yi", "Xue Lan", "Yu Mei", "Zhen Ni", "Bai Xue", "Chen Yue",
    "Fang Hua", "Lin Qing", "Liu Yi", "Sun Li", "Wu Ying", "Xiao Mei",
    "Yang Zi", "Zhou Wei",
    // Khmer names
    "Bopha", "Channary", "Kalliyan", "Kolab", "Malis", "Romdoul",
    "Sothy", "Sopheap", "Thida", "Vanna", "Socheata", "Pich", "Rachana",
    "Sothea", "Kunthea", "Davy", "Chenda", "Sophea", "Montha", "Leakhena"
];

/**
 * Generates an Oriental name using either syllable combination or picking from predefined names
 * 
 * @param {"male"|"female"} type - Which type of name to generate
 * @returns {string} The generated name (with appropriate capitalization)
 */
function generateName(type) {
    // 50% chance to use either method
    if (Math.random() < 0.5) {
        // Use syllable-based generation
        let syllables = [];
        const syllableCount = Math.floor(Math.random() * 4) + 2; // Random number between 2-5
        
        if (type === "male") {
            syllables.push(randomChoice(maleStart));
            // Add middle syllables based on length needed
            for (let i = 0; i < syllableCount - 2; i++) {
                syllables.push(randomChoice(maleMid));
            }
            syllables.push(randomChoice(maleEnd));
        } else {
            syllables.push(randomChoice(femaleStart));
            // Add middle syllables based on length needed
            for (let i = 0; i < syllableCount - 2; i++) {
                syllables.push(randomChoice(femaleMid));
            }
            syllables.push(randomChoice(femaleEnd));
        }
        
        const name = syllables.join("");
        return name.charAt(0).toUpperCase() + name.slice(1);
    } else {
        // Use predefined Oriental names
        const nameList = type === "male" ? orientalMaleNames : orientalFemaleNames;
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