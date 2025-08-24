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
        
        // Load card data (will be loaded from external file)
        this.loadCardData();
    }
    
    async loadCardData() {
        try {
            const response = await fetch('cards.json');
            this.cardData = await response.json();
        } catch (error) {
            console.warn('Could not load card data, using fallback');
            this.cardData = [
                {
                    title: "BALANCE",
                    upright_meaning: {
                        person: "A fair-minded person who can see multiple perspectives.",
                        situation: "A situation where maintaining balance is important."
                    },
                    reversed_meaning: {
                        person: "A judgmental person ignoring one perspective.",
                        situation: "Something being over- or undervalued."
                    }
                }
            ];
        }
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
        const name = this.generateName();
        
        return { level, species, name };
    }
    
    generateName() {
        const firstNames = ['Aiden', 'Brenna', 'Connor', 'Dara', 'Ewan', 'Fiona', 'Gareth', 'Hilda', 'Ivan', 'Jade'];
        const lastNames = ['Blackwood', 'Stormwind', 'Ironforge', 'Goldleaf', 'Silvermoon', 'Darkbane'];
        
        const first = firstNames[Math.floor(Math.random() * firstNames.length)];
        const last = lastNames[Math.floor(Math.random() * lastNames.length)];
        
        return `${first} ${last}`;
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
        if (!this.cardData || this.cardData.length === 0) return null;
        
        const card = this.cardData[Math.floor(Math.random() * this.cardData.length)];
        const roll = Math.floor(Math.random() * 10) + 1;
        
        const isReversed = roll > 5;
        const meanings = isReversed ? card.reversed_meaning : card.upright_meaning;
        
        const meaningTypes = ['person', 'creature_or_trap', 'place', 'treasure', 'situation'];
        let meaningType;
        
        if (roll === 1 || roll === 6) meaningType = 'person';
        else if (roll === 2 || roll === 7) meaningType = 'creature_or_trap';
        else if (roll === 3 || roll === 8) meaningType = 'place';
        else if (roll === 4 || roll === 9) meaningType = 'treasure';
        else meaningType = 'situation';
        
        const meaningText = meanings[meaningType] || meanings[Object.keys(meanings)[0]];
        
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
            
            // Generate party tarot card
            const partyTarot = this.generateTarotCard();
            
            for (let i = 0; i < partySize; i++) {
                const { level, species, name } = this.generateBasicInfo();
                const { stats, primaryStat, secondaryStat, dumpStat } = this.generatePlebStats();
                const background = this.generateBackground(primaryStat, secondaryStat);
                const traits = this.generateTraits();
                const originFeats = this.generateOriginFeats(species, primaryStat);
                
                // Individual tarot for one random member
                const individualTarot = (i === Math.floor(Math.random() * partySize)) ? this.generateTarotCard() : null;
                
                const character = {
                    id: Date.now() + i,
                    name,
                    level,
                    species,
                    stats,
                    primaryStat,
                    background,
                    traits,
                    originFeats,
                    isPlayer: false,
                    partyTarot: i === 0 ? partyTarot : null, // Only show on first character
                    individualTarot
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
            const { level, species, name } = this.generateBasicInfo();
            const { stats, primaryStat, secondaryStat, dumpStat } = this.generatePlebStats();
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
            const { level, name } = this.generateBasicInfo();
            const species = forceHuman ? 'Human' : this.weightedChoice(this.speciesDistribution);
            const { stats, primaryStat, secondaryStat, dumpStat } = this.generatePlayerStats();
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
                </div>
                
                <div class="stats-grid">
                    ${Object.entries(character.stats).map(([stat, value]) => `
                        <div class="stat-item">
                            <span class="stat-label">${statAbbr[stat]}</span>
                            <span class="stat-value">${value}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="traits-section">
                    <div class="section-title">Traits</div>
                    <div class="traits-list">${character.traits.join(', ')}</div>
                </div>
                
                ${character.originFeats.length > 0 ? `
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