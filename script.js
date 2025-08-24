// NPC Generator Web App
class NPCGenerator {
    constructor() {
        this.characters = [];
        this.maxCharacters = 6;
        
        // Initialize data
        this.initializeData();
        
        // Bind event listeners
        this.bindEvents();
        
        // Initialize UI
        this.updateCharacterGrid();
    }
    
    initializeData() {
        // Stat distribution data
        this.statDistribution = [
            ['Str', 24], ['Dex', 20], ['Con', 18], 
            ['Int', 15], ['Wis', 13], ['Cha', 10]
        ];
        
        // Primary stat mapping
        this.primaryStatMapping = {
            'str': { secondary: 'wis', dump: 'int' },
            'dex': { secondary: 'cha', dump: 'wis' },
            'con': { secondary: 'dex', dump: 'wis' },
            'cha': { secondary: 'int', dump: 'con' },
            'int': { secondary: 'wis', dump: 'str' },
            'wis': { secondary: 'con', dump: 'dex' }
        };
        
        // Species distribution
        this.speciesDistribution = [
            ['Human', 35], ['Elf', 20], ['Dwarf', 15], 
            ['Halfling', 12], ['Orc', 8], ['Tiefling', 10]
        ];
        
        // Level distribution  
        this.levelDistribution = [
            [1, 40], [2, 25], [3, 15], [4, 10], [5, 10]
        ];
        
        // Class type distribution
        this.classTypeDistribution = [
            ['Blunt', 50], ['Caster', 30], ['Semicaster', 20]
        ];
        
        // Sample backgrounds
        this.backgrounds = [
            { name: 'Acolyte', primary: 'Wisdom', tertiary: 'Charisma' },
            { name: 'Criminal', primary: 'Dexterity', tertiary: 'Charisma' },
            { name: 'Folk Hero', primary: 'Strength', tertiary: 'Constitution' },
            { name: 'Noble', primary: 'Charisma', tertiary: 'Wisdom' },
            { name: 'Scholar', primary: 'Intelligence', tertiary: 'Wisdom' },
            { name: 'Soldier', primary: 'Strength', tertiary: 'Constitution' }
        ];
        
        // Sample traits
        this.virtues = ['Honest', 'Brave', 'Loyal', 'Kind', 'Wise', 'Patient', 'Generous', 'Humble'];
        this.vices = ['Greedy', 'Cowardly', 'Cruel', 'Arrogant', 'Lazy', 'Deceitful', 'Envious', 'Wrathful'];
        
        // Origin feats
        this.originFeats = [
            { name: 'Lucky', primaryStat: 'Charisma' },
            { name: 'Tough', primaryStat: 'Constitution' },
            { name: 'Alert', primaryStat: 'Dexterity' },
            { name: 'Skilled', primaryStat: 'Intelligence' },
            { name: 'Healer', primaryStat: 'Wisdom' },
            { name: 'Savage Attacker', primaryStat: 'Strength' }
        ];
        
        // Load card data directly (embedded to avoid CORS issues)
        this.cardData = this.getCardData();
    }
    
    getCardData() {
        // Embedded card data to avoid CORS issues
        return [
            {
                title: "BALANCE",
                upright_meaning: {
                    person: "A fair-minded person who can see multiple perspectives and judge impartially.",
                    creature_or_trap: "A trap, a Beast, a Construct, or an otherwise impartial foe.",
                    place: "A place where different forces exist in balance—such as a civilization in balance with nature.",
                    treasure: "A treasure with value to two competing factions, or with two equal magical powers.",
                    situation: "A situation where maintaining balance is important: keeping rivals satisfied, preserving the balance of power."
                },
                reversed_meaning: {
                    person: "A judgmental or biased person willfully ignoring one perspective in favor of another.",
                    creature_or_trap: "A Celestial, a Fiend, or some other creature strongly associated with a particular alignment.",
                    place: "A place where the balance of elemental or natural forces has been upset, with negative consequences.",
                    treasure: "A treasure valuable only to certain people, or that can be used only in a very specific way.",
                    situation: "Something being over- or undervalued."
                }
            },
            {
                title: "BEAST",
                upright_meaning: {
                    person: "A person who avoids the comforts of civilization or indulges predatory attitudes.",
                    creature_or_trap: "A Beast, or a similar creature (such as a Fey or a Monstrosity) that is animal-like; alternatively, a pit or other confined space with a trapped animal within.",
                    place: "A place where animals roam freely.",
                    treasure: "A treasure that incorporates fur, feathers, bones, or claws from a Beast, or a magic item that allows transformation into a Beast (such as a Cloak of the Bat or Staff of the Python).",
                    situation: "A situation involving hunting animals or animals preying on people."
                },
                reversed_meaning: {
                    person: "A person who fiercely represses urges they deem 'bestial' in themselves or others.",
                    creature_or_trap: "A domesticated animal or a familiar.",
                    place: "A place where animals are contained, such as a farm or a zoo.",
                    treasure: "An ornate saddle, a goad, or another item related to the use of domestic animals, or a magic item that allows control of Beasts (such as a Potion of Animal Friendship).",
                    situation: "Domestic animals rebelling against people's control."
                }
            },
            {
                title: "BOOK",
                upright_meaning: {
                    person: "A writer, poet, or compulsive note-taker.",
                    creature_or_trap: "A creature that keeps an exhaustive diary in some form, or that seeks a scribe to record its deeds.",
                    place: "A scriptorium or printing press.",
                    treasure: "A valuable or magical pen, an ink vial, or a set of pigments (such as Nolzur's Marvelous Pigments).",
                    situation: "A situation that requires gleaning information from written clues."
                },
                reversed_meaning: {
                    person: "A well-educated person who reads often.",
                    creature_or_trap: "A trap involving written runes (such as a Glyph of Warding or Symbol spell).",
                    place: "A library or archive.",
                    treasure: "A spellbook, a manual that increases an ability score, or another book with magical properties.",
                    situation: "A situation involving censorship or book burning."
                }
            },
            {
                title: "COMET",
                upright_meaning: {
                    person: "A person who heralds a new age or brings significant change.",
                    creature_or_trap: "A creature from the far realm or outer planes.",
                    place: "A place touched by cosmic forces or celestial events.",
                    treasure: "A meteorite, star metal weapon, or item of cosmic significance.",
                    situation: "A rare celestial event or prophecy coming to pass."
                },
                reversed_meaning: {
                    person: "A person clinging to the old ways, resistant to change.",
                    creature_or_trap: "A creature corrupted by cosmic forces.",
                    place: "A place scarred by celestial impact or cosmic disaster.",
                    treasure: "A cursed item of stellar origin.",
                    situation: "A missed opportunity or failed prophecy."
                }
            },
            {
                title: "CROWN",
                upright_meaning: {
                    person: "A ruler, leader, or person of high social standing.",
                    creature_or_trap: "A creature that rules over others of its kind.",
                    place: "A palace, throne room, or seat of power.",
                    treasure: "A crown, scepter, or other regalia of office.",
                    situation: "A situation involving politics, succession, or the exercise of authority."
                },
                reversed_meaning: {
                    person: "A person who has lost or rejected authority, or who rebels against established power.",
                    creature_or_trap: "A creature that has been dethroned or cast out from its position.",
                    place: "A ruined palace or abandoned seat of power.",
                    treasure: "A broken crown or symbol of fallen authority.",
                    situation: "A revolution, coup, or the collapse of established order."
                }
            }
        ];
    }
    
    bindEvents() {
        document.getElementById('generate-party').addEventListener('click', () => this.generateParty());
        document.getElementById('generate-individual').addEventListener('click', () => this.generateIndividual());
        document.getElementById('generate-player').addEventListener('click', () => this.generatePlayer());
        document.getElementById('clear-screen').addEventListener('click', () => this.clearScreen());
        document.getElementById('clear-database').addEventListener('click', () => this.clearDatabase());
    }
    
    // Utility functions
    weightedChoice(distribution) {
        const totalWeight = distribution.reduce((sum, [_, weight]) => sum + weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const [value, weight] of distribution) {
            random -= weight;
            if (random <= 0) return value;
        }
        return distribution[distribution.length - 1][0];
    }
    
    roll3d6() {
        return Array.from({length: 3}, () => Math.floor(Math.random() * 6) + 1).reduce((a, b) => a + b);
    }
    
    roll4d6KeepHighest3() {
        const rolls = Array.from({length: 4}, () => Math.floor(Math.random() * 6) + 1);
        rolls.sort((a, b) => b - a);
        return rolls.slice(0, 3).reduce((a, b) => a + b);
    }
    
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    // Stat generation
    generatePlebStats() {
        const primaryStat = this.weightedChoice(this.statDistribution).toLowerCase();
        const mapping = this.primaryStatMapping[primaryStat];
        const secondaryStat = mapping.secondary;
        const dumpStat = mapping.dump;
        
        const statNames = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
        const stats = {};
        
        // Roll base stats
        statNames.forEach(stat => {
            stats[stat] = this.roll3d6();
        });
        
        // Apply minimums first
        stats[primaryStat] = Math.max(stats[primaryStat], 13);
        stats[secondaryStat] = Math.max(stats[secondaryStat], 9);
        stats[dumpStat] = Math.max(stats[dumpStat], 3);
        
        statNames.forEach(stat => {
            if (stat !== primaryStat && stat !== secondaryStat && stat !== dumpStat) {
                stats[stat] = Math.max(stats[stat], 6);
            }
        });
        
        // Add +1 to primary and secondary after minimums
        stats[primaryStat] += 1;
        stats[secondaryStat] += 1;
        
        return { stats, primaryStat, secondaryStat, dumpStat };
    }
    
    generatePlayerStats() {
        const primaryStat = this.weightedChoice(this.statDistribution).toLowerCase();
        const mapping = this.primaryStatMapping[primaryStat];
        const secondaryStat = mapping.secondary;
        const dumpStat = mapping.dump;
        
        const statNames = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
        const stats = {};
        
        // Roll base stats (4d6 keep highest 3)
        statNames.forEach(stat => {
            stats[stat] = this.roll4d6KeepHighest3();
        });
        
        // Determine tertiary stat (highest remaining after primary, secondary, dump)
        const remaining = statNames.filter(s => s !== primaryStat && s !== secondaryStat && s !== dumpStat);
        const tertiaryStat = remaining.reduce((max, stat) => stats[stat] > stats[max] ? stat : max);
        
        // Apply player minimums
        stats[primaryStat] = Math.max(stats[primaryStat], 15);
        stats[secondaryStat] = Math.max(stats[secondaryStat], 14);
        stats[tertiaryStat] = Math.max(stats[tertiaryStat], 13);
        stats[dumpStat] = Math.max(stats[dumpStat], 3);
        
        statNames.forEach(stat => {
            if (stat !== primaryStat && stat !== secondaryStat && stat !== tertiaryStat && stat !== dumpStat) {
                stats[stat] = Math.max(stats[stat], 6);
            }
        });
        
        // Apply 3 random +1 bonuses (max +2 per stat)
        const bonusCount = {};
        statNames.forEach(stat => bonusCount[stat] = 0);
        
        for (let i = 0; i < 3; i++) {
            const availableStats = statNames.filter(stat => bonusCount[stat] < 2);
            if (availableStats.length > 0) {
                const chosenStat = availableStats[Math.floor(Math.random() * availableStats.length)];
                stats[chosenStat] += 1;
                bonusCount[chosenStat] += 1;
            }
        }
        
        return { stats, primaryStat, secondaryStat, dumpStat };
    }
    
    // Character generation
    generateBasicInfo() {
        const level = parseInt(this.weightedChoice(this.levelDistribution));
        const species = this.weightedChoice(this.speciesDistribution);
        
        return { level, species };
    }
    
    generateClassInfo(primaryStat) {
        // Simple class assignment based on primary stat
        const classMap = {
            'strength': { type: 'Blunt', name: 'Fighter', subclass: 'Champion' },
            'dexterity': { type: 'Blunt', name: 'Rogue', subclass: 'Thief' },
            'constitution': { type: 'Blunt', name: 'Barbarian', subclass: 'Berserker' },
            'intelligence': { type: 'Caster', name: 'Wizard', subclass: 'Evocation' },
            'wisdom': { type: 'Semicaster', name: 'Cleric', subclass: 'Life' },
            'charisma': { type: 'Caster', name: 'Sorcerer', subclass: 'Draconic' }
        };
        
        const classInfo = classMap[primaryStat] || { type: 'Blunt', name: 'Fighter', subclass: 'Champion' };
        
        // Add some randomization
        const alternatives = {
            'strength': [
                { type: 'Blunt', name: 'Paladin', subclass: 'Devotion' },
                { type: 'Blunt', name: 'Fighter', subclass: 'Champion' }
            ],
            'dexterity': [
                { type: 'Blunt', name: 'Ranger', subclass: 'Hunter' },
                { type: 'Blunt', name: 'Rogue', subclass: 'Thief' }
            ],
            'intelligence': [
                { type: 'Caster', name: 'Wizard', subclass: 'Evocation' },
                { type: 'Caster', name: 'Artificer', subclass: 'Alchemist' }
            ],
            'wisdom': [
                { type: 'Semicaster', name: 'Cleric', subclass: 'Life' },
                { type: 'Semicaster', name: 'Druid', subclass: 'Land' }
            ],
            'charisma': [
                { type: 'Caster', name: 'Sorcerer', subclass: 'Draconic' },
                { type: 'Caster', name: 'Warlock', subclass: 'Fiend' }
            ]
        };
        
        if (alternatives[primaryStat]) {
            const options = alternatives[primaryStat];
            return options[Math.floor(Math.random() * options.length)];
        }
        
        return classInfo;
    }
    
    generateVowelName(usedVowels = new Set()) {
        // Vowel names from the original script's vowel_names.csv
        const vowelNames = {
            'A': ['Aelred', 'Aevar', 'Agnar', 'Alric', 'Arnulf', 'Asmund', 'Athelstan'],
            'E': ['Eadric', 'Edmund', 'Edwin', 'Egbert', 'Eldred', 'Eric', 'Ethelred'],
            'I': ['Ingvar', 'Ivar', 'Ivo', 'Igor', 'Isidor', 'Ilbert', 'Imar'],
            'O': ['Osric', 'Oswald', 'Ottar', 'Olaf', 'Orme', 'Oscar', 'Otto'],
            'U': ['Ulf', 'Ulric', 'Urien', 'Uthred', 'Unwin', 'Uriah', 'Ulbert']
        };
        
        // Get available vowels (not used)
        const availableVowels = Object.keys(vowelNames).filter(v => !usedVowels.has(v));
        const vowelsToUse = availableVowels.length > 0 ? availableVowels : Object.keys(vowelNames);
        
        const chosenVowel = vowelsToUse[Math.floor(Math.random() * vowelsToUse.length)];
        const nameList = vowelNames[chosenVowel];
        const name = nameList[Math.floor(Math.random() * nameList.length)];
        
        return { name, vowel: chosenVowel };
    }
    
    generateCulturalName(culture) {
        // Cultural name generation from the original script
        const cultures = {
            'aquilonian': {
                'male_starts': ["Ar", "Ca", "Mer", "Mor", "Per", "Lan", "Vi", "Ig", "Ka"],
                'male_ends': ["gon", "loc", "lon", "din", "der", "lan", "thur", "gaw"],
                'female_starts': ["An", "Mor", "Gua", "Hel", "Is", "Ela", "Vi", "Gly", "Ca"],
                'female_ends': ["wen", "lin", "vyr", "min", "sir", "lott", "ryn", "dell"],
                'preset_names': ["Lancelot", "Gawain", "Percival", "Guinevere", "Morgan", "Elaine"]
            },
            'barbarian': {
                'male_starts': ["Kon", "Grom", "Bru", "Thor", "Ulf", "Rag", "Bor", "Grimm"],
                'male_ends': ["an", "gar", "ulf", "grim", "lok", "thor", "bane", "axe"],
                'female_starts': ["Val", "Sig", "Frey", "Ing", "Ast", "Ran", "Sol", "Bri"],
                'female_ends': ["rid", "run", "dis", "wyn", "hild", "gard", "borg", "dís"],
                'preset_names': ["Conan", "Valeria", "Thulsa", "Belit", "Subotai", "Thorgrim"]
            },
            'lusitania': {
                'male_starts': ["Car", "Fer", "Al", "Rod", "San", "Gon", "Die", "Pedr"],
                'male_ends': ["los", "nando", "dro", "rico", "tiago", "mingo", "berto"],
                'female_starts': ["Mar", "Isa", "Cat", "Con", "Ter", "Lu", "Clar", "Bea"],
                'female_ends': ["ía", "bella", "ncia", "suela", "mén", "cedes", "lores"],
                'preset_names': ["Carlos", "Fernando", "Isabella", "Esperanza", "Diego", "Carmen"]
            },
            'oriental': {
                'male_starts': ["Li", "Wang", "Chen", "Zhang", "Liu", "Yang", "Huang", "Zhao"],
                'male_ends': ["wei", "ming", "feng", "jun", "hao", "ping", "gang", "lei"],
                'female_starts': ["Li", "Wang", "Chen", "Liu", "Yang", "Zhou", "Wu", "Xu"],
                'female_ends': ["na", "ying", "fang", "mei", "lan", "yan", "xin", "hui"],
                'preset_names': ["Li Wei", "Wang Ming", "Chen Mei", "Liu Yan", "Zhang Feng", "Yang Lan"]
            },
            'qharan': {
                'male_starts': ["Ab", "Ibn", "Mu", "Al", "Ha", "Sa", "Om", "Kha"],
                'male_ends': ["med", "mad", "san", "lim", "tar", "rim", "eed", "bad"],
                'female_starts': ["Fat", "Ay", "Zay", "Leil", "Jas", "Sor", "Nal", "Zul"],
                'female_ends': ["ima", "sha", "nab", "ara", "eika", "orah", "ina", "ida"],
                'preset_names': ["Ahmed", "Hassan", "Fatima", "Aisha", "Omar", "Leila"]
            }
        };
        
        if (!cultures[culture]) return "Unknown";
        
        const cultureData = cultures[culture];
        
        // 50% chance for preset name, 50% for generated
        if (Math.random() < 0.5 && cultureData.preset_names.length > 0) {
            return cultureData.preset_names[Math.floor(Math.random() * cultureData.preset_names.length)];
        }
        
        // Generate name from syllables (50/50 male/female)
        const isMale = Math.random() < 0.5;
        let start, end;
        
        if (isMale) {
            start = cultureData.male_starts[Math.floor(Math.random() * cultureData.male_starts.length)];
            end = cultureData.male_ends[Math.floor(Math.random() * cultureData.male_ends.length)];
        } else {
            start = cultureData.female_starts[Math.floor(Math.random() * cultureData.female_starts.length)];
            end = cultureData.female_ends[Math.floor(Math.random() * cultureData.female_ends.length)];
        }
        
        return start + end;
    }
    
    generateBackground(primaryStat, secondaryStat) {
        const targetStat = Math.random() < 0.75 ? primaryStat : secondaryStat;
        const mapped = this.capitalizeFirst(targetStat);
        
        const matchingBgs = this.backgrounds.filter(bg => 
            bg.primary === mapped || bg.tertiary === mapped
        );
        
        if (matchingBgs.length > 0) {
            return matchingBgs[Math.floor(Math.random() * matchingBgs.length)].name;
        }
        
        return this.backgrounds[Math.floor(Math.random() * this.backgrounds.length)].name;
    }
    
    generateTraits() {
        const virtue = this.virtues[Math.floor(Math.random() * this.virtues.length)];
        const vice = this.vices[Math.floor(Math.random() * this.vices.length)];
        
        const traits = [virtue, vice];
        
        // 50% chance for additional traits
        if (Math.random() < 0.5) {
            const allTraits = [...this.virtues, ...this.vices];
            const additional = allTraits.filter(t => !traits.includes(t));
            if (additional.length > 0) {
                traits.push(additional[Math.floor(Math.random() * additional.length)]);
            }
        }
        
        return traits;
    }
    
    generateOriginFeats(species, primaryStat, isPlayer = false) {
        const feats = [];
        let fCount = 1;
        
        if (isPlayer) {
            fCount = species.toLowerCase() === 'human' ? 2 : 1;
        } else {
            // Plebs: 50% chance, humans get 2 separate 50% rolls
            if (species.toLowerCase() === 'human') {
                fCount = 0;
                for (let i = 0; i < 2; i++) {
                    if (Math.random() < 0.5) fCount++;
                }
            } else {
                fCount = Math.random() < 0.5 ? 1 : 0;
            }
        }
        
        for (let i = 0; i < fCount; i++) {
            let feat;
            if (Math.random() < 0.5) {
                // Random feat
                feat = this.originFeats[Math.floor(Math.random() * this.originFeats.length)];
            } else {
                // Primary stat related feat
                const mapped = this.capitalizeFirst(primaryStat);
                const matching = this.originFeats.filter(f => f.primaryStat === mapped);
                if (matching.length > 0) {
                    feat = matching[Math.floor(Math.random() * matching.length)];
                } else {
                    feat = this.originFeats[Math.floor(Math.random() * this.originFeats.length)];
                }
            }
            
            if (!feats.some(f => f.name === feat.name)) {
                feats.push(feat);
            }
        }
        
        return feats.map(f => f.name);
    }
    
    generateTarotCard() {
        if (!this.cardData || this.cardData.length === 0) {
            console.warn('No card data available, using fallback');
            return {
                title: "BALANCE",
                orientation: "Upright",
                type: "person", 
                text: "A fair-minded person who can see multiple perspectives."
            };
        }
        
        // Add some randomness by using current time as seed modifier
        const randomSeed = Date.now() + Math.random() * 1000;
        const cardIndex = Math.floor((randomSeed % this.cardData.length));
        const card = this.cardData[cardIndex];
        
        // Use a different random approach for the roll
        const roll = Math.floor(Math.random() * 10) + 1;
        
        const isReversed = roll > 5;
        const meanings = isReversed ? card.reversed_meaning : card.upright_meaning;
        
        if (!meanings) {
            console.warn('Card missing meanings:', card);
            return {
                title: card.title || "UNKNOWN",
                orientation: isReversed ? 'Reversed' : 'Upright',
                type: "situation",
                text: "The meaning of this card is unclear."
            };
        }
        
        let meaningType;
        if (roll === 1 || roll === 6) meaningType = 'person';
        else if (roll === 2 || roll === 7) meaningType = 'creature_or_trap';
        else if (roll === 3 || roll === 8) meaningType = 'place';
        else if (roll === 4 || roll === 9) meaningType = 'treasure';
        else meaningType = 'situation';
        
        const meaningText = meanings[meaningType] || meanings[Object.keys(meanings)[0]] || "Unknown meaning";
        
        console.log(`Generated tarot: ${card.title}, roll: ${roll}, type: ${meaningType}`);
        
        return {
            title: card.title,
            orientation: isReversed ? 'Reversed' : 'Upright',
            type: meaningType,
            text: meaningText
        };
    }
    
    // Main generation functions
    generateParty() {
        this.showLoading();
        
        setTimeout(() => {
            const partySize = Math.max(Math.floor(Math.random() * 4) + 1, Math.floor(Math.random() * 6) + 1);
            const party = [];
            
            // Determine cultural members (1d7-1, so 0-6)
            const culturalMembers = Math.max(0, Math.floor(Math.random() * 7));
            const culturalMembersCount = Math.min(culturalMembers, partySize);
            
            // Choose random culture
            const cultures = ['aquilonian', 'barbarian', 'lusitania', 'oriental', 'qharan'];
            const chosenCulture = cultures[Math.floor(Math.random() * cultures.length)];
            
            const usedVowels = new Set();
            const tarotMemberIndex = Math.floor(Math.random() * partySize);
            
            // Generate party tarot card
            const partyTarot = this.generateTarotCard();
            
            for (let i = 0; i < partySize; i++) {
                const { level, species } = this.generateBasicInfo();
                
                // Name generation: cultural vs vowel
                let name;
                const useCultural = i < culturalMembersCount;
                
                if (useCultural) {
                    name = this.generateCulturalName(chosenCulture);
                } else {
                    const { name: vowelName, vowel } = this.generateVowelName(usedVowels);
                    name = vowelName;
                    usedVowels.add(vowel);
                }
                
                const { stats, primaryStat, secondaryStat, dumpStat } = this.generatePlebStats();
                const classInfo = this.generateClassInfo(primaryStat);
                const background = this.generateBackground(primaryStat, secondaryStat);
                const traits = this.generateTraits();
                const originFeats = this.generateOriginFeats(species, primaryStat);
                
                // Individual tarot for randomly selected member
                const individualTarot = (i === tarotMemberIndex) ? this.generateTarotCard() : null;
                
                const character = {
                    id: Date.now() + i,
                    name,
                    level,
                    species,
                    stats,
                    primaryStat,
                    classType: classInfo.type,
                    className: classInfo.name,
                    subclass: classInfo.subclass,
                    background,
                    traits,
                    originFeats,
                    isPlayer: false,
                    partyTarot: i === 0 ? partyTarot : null, // Only show on first character
                    individualTarot,
                    culture: useCultural ? chosenCulture : null
                };
                
                party.push(character);
            }
            
            this.addCharacters(party);
            this.hideLoading();
        }, 1000);
    }
    
    generateIndividual() {
        this.showLoading();
        
        setTimeout(() => {
            const { level, species } = this.generateBasicInfo();
            const { name } = this.generateVowelName();
            const { stats, primaryStat, secondaryStat, dumpStat } = this.generatePlebStats();
            const classInfo = this.generateClassInfo(primaryStat);
            const background = this.generateBackground(primaryStat, secondaryStat);
            const traits = this.generateTraits();
            const originFeats = this.generateOriginFeats(species, primaryStat);
            
            const character = {
                id: Date.now(),
                name,
                level,
                species,
                stats,
                primaryStat,
                classType: classInfo.type,
                className: classInfo.name,
                subclass: classInfo.subclass,
                background,
                traits,
                originFeats,
                isPlayer: false,
                individualTarot: this.generateTarotCard(),
                secondTarot: this.generateTarotCard() // Individuals get 2 cards
            };
            
            this.addCharacters([character]);
            this.hideLoading();
        }, 800);
    }
    
    generatePlayer() {
        this.showLoading();
        
        setTimeout(() => {
            const forceHuman = document.getElementById('force-human').checked;
            const { level } = this.generateBasicInfo();
            const { name } = this.generateVowelName();
            const species = forceHuman ? 'Human' : this.weightedChoice(this.speciesDistribution);
            const { stats, primaryStat, secondaryStat, dumpStat } = this.generatePlayerStats();
            const classInfo = this.generateClassInfo(primaryStat);
            const background = this.generateBackground(primaryStat, secondaryStat);
            const traits = this.generateTraits();
            const originFeats = this.generateOriginFeats(species, primaryStat, true);
            
            const character = {
                id: Date.now(),
                name,
                level,
                species,
                stats,
                primaryStat,
                classType: classInfo.type,
                className: classInfo.name,
                subclass: classInfo.subclass,
                background,
                traits,
                originFeats,
                isPlayer: true,
                individualTarot: this.generateTarotCard(),
                secondTarot: this.generateTarotCard() // Players get 2 cards
            };
            
            this.addCharacters([character]);
            this.hideLoading();
        }, 800);
    }
    
    // UI Management
    addCharacters(newCharacters) {
        // Add new characters to the beginning
        this.characters = [...newCharacters, ...this.characters];
        
        // Keep only the last 6 characters
        if (this.characters.length > this.maxCharacters) {
            this.characters = this.characters.slice(0, this.maxCharacters);
        }
        
        this.updateCharacterGrid();
        this.updateTarotDisplay(newCharacters);
    }
    
    updateTarotDisplay(newCharacters) {
        const tarotDisplay = document.getElementById('tarot-display');
        const tarotCard = document.getElementById('tarot-card');
        
        // Check if any character has party tarot
        const partyTarot = newCharacters.find(c => c.partyTarot)?.partyTarot;
        
        if (partyTarot) {
            tarotCard.innerHTML = `<strong>${partyTarot.title}:</strong> ${partyTarot.text}`;
            tarotDisplay.classList.remove('hidden');
            
            // Hide after 8 seconds
            setTimeout(() => {
                tarotDisplay.classList.add('hidden');
            }, 8000);
        }
    }
    
    updateCharacterGrid() {
        const grid = document.getElementById('character-grid');
        
        if (this.characters.length === 0) {
            grid.innerHTML = `
                <div class="empty-slot">
                    <div class="empty-text">
                        <h3>Welcome to Pleb Generator!</h3>
                        <p>Generate your first party, individual, or player character to get started.</p>
                    </div>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = this.characters.map(character => this.createCharacterCard(character)).join('');
    }
    
    createCharacterCard(character) {
        const playerClass = character.isPlayer ? 'player-character' : '';
        const statAbbr = {
            strength: 'STR', dexterity: 'DEX', constitution: 'CON',
            intelligence: 'INT', wisdom: 'WIS', charisma: 'CHA'
        };
        
        let tarotSection = '';
        if (character.individualTarot) {
            tarotSection += `
                <div class="individual-tarot">
                    <strong>${character.individualTarot.title}:</strong> ${character.individualTarot.text}
                </div>
            `;
        }
        if (character.secondTarot) {
            tarotSection += `
                <div class="individual-tarot" style="margin-top: 0.5rem;">
                    <strong>${character.secondTarot.title}:</strong> ${character.secondTarot.text}
                </div>
            `;
        }
        
        return `
            <div class="character-card ${playerClass}">
                <div class="character-header">
                    <h3 class="character-name">${character.name}</h3>
                    <div class="character-level">Level ${character.level}</div>
                </div>
                
                <div class="character-info">
                    <div class="info-row">
                        <span class="info-label">Species:</span>
                        <span class="info-value">${character.species}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Primary:</span>
                        <span class="info-value">${this.capitalizeFirst(character.primaryStat)}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Background:</span>
                        <span class="info-value">${character.background}</span>
                    </div>
                    ${character.classType ? `
                    <div class="info-row">
                        <span class="info-label">Class Type:</span>
                        <span class="info-value">${character.classType}</span>
                    </div>
                    ` : ''}
                    ${character.className ? `
                    <div class="info-row">
                        <span class="info-label">Class:</span>
                        <span class="info-value">${character.className}</span>
                    </div>
                    ` : ''}
                    ${character.subclass ? `
                    <div class="info-row">
                        <span class="info-label">Subclass:</span>
                        <span class="info-value">${character.subclass}</span>
                    </div>
                    ` : ''}
                </div>
                
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-label">STR</span>
                        <span class="stat-value">${character.stats.strength}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">DEX</span>
                        <span class="stat-value">${character.stats.dexterity}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">CON</span>
                        <span class="stat-value">${character.stats.constitution}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">INT</span>
                        <span class="stat-value">${character.stats.intelligence}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">WIS</span>
                        <span class="stat-value">${character.stats.wisdom}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">CHA</span>
                        <span class="stat-value">${character.stats.charisma}</span>
                    </div>
                </div>
                
                <div class="traits-section">
                    <div class="section-title">Traits</div>
                    <div class="traits-list">${character.traits.join(', ')}</div>
                </div>
                
                ${character.originFeats && character.originFeats.length > 0 ? `
                    <div class="feats-section">
                        <div class="section-title">Origin Feats</div>
                        <div class="feats-list">${character.originFeats.join(', ')}</div>
                    </div>
                ` : ''}
                
                ${tarotSection}
            </div>
        `;
    }
    
    clearScreen() {
        this.characters = [];
        this.updateCharacterGrid();
        document.getElementById('tarot-display').classList.add('hidden');
    }
    
    clearDatabase() {
        if (confirm('Are you sure you want to clear all characters? This cannot be undone.')) {
            this.clearScreen();
        }
    }
    
    showLoading() {
        document.getElementById('loading-overlay').classList.remove('hidden');
    }
    
    hideLoading() {
        document.getElementById('loading-overlay').classList.add('hidden');
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new NPCGenerator();
});