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
        
        // Species distribution (from species_distribution.csv)
        this.speciesDistribution = [
            ['Human', 67], ['Dwarf', 11], ['Elf', 9], 
            ['Ogre', 8], ['Halfing', 5]
        ];
        
        // Level distribution (from character_level_distribution.csv)
        this.levelDistribution = [
            [1, 32], [2, 22], [3, 15], [4, 10], [5, 8],
            [6, 5], [7, 3], [8, 2], [9, 1], [10, 1], [11, 1]
        ];
        
        // Class type distribution (only for mental stats: Int, Wis, Cha)
        this.classTypeDistribution = [
            ['Blunt', 46], ['Caster', 33], ['Semicaster', 21]
        ];
        
        // Mental stats that use class type distribution
        this.mentalStats = ['int', 'wis', 'cha'];
        
        // Complete class data from classes.json
        this.classesData = {
            "Blunt": {
                "str": {
                    "classes": ["Fighter", "Warrior", "Champion"],
                    "subclasses": ["Champion", "Banneret", "Cavalier", "Battlemaster", "Samurai", "Gladiator", "Knight", "Weaponmaster", "Sharpshooter"]
                },
                "dex": {
                    "classes": ["Rogue", "Treasure Hunter", "Gunslinger", "Shinobi"],
                    "subclasses": ["Thief", "Assassin", "Burglar", "Agent", "Spy", "Inquisitive", "Mastermind", "Scout", "Swashbuckler", "Deadeye", "Highroller", "White Hat", "Infiltrator", "Saboteur"]
                },
                "con": {
                    "classes": ["Barbarian", "Slayer"],
                    "subclasses": ["Rider", "Foehammer", "Berserker", "Spellscorned", "Battlerager", "Beast"]
                },
                "int": {
                    "classes": ["Sage", "Scholar"],
                    "subclasses": ["Mentat", "Alchemist", "Scribe", "Healing", "Lore"]
                },
                "wis": {
                    "classes": ["Monk", "Wanderer"],
                    "subclasses": ["Open Hand", "Street", "Hunter of Beasts", "Hunter of Shadows", "Forayer"]
                },
                "cha": {
                    "classes": ["Warden", "Captain", "Messenger", "Courtier"],
                    "subclasses": ["Poisoner", "Troubadour", "Counselour", "Herald", "Bounder", "Chieftain", "Thane", "Diplomat", "Investigator"]
                }
            },
            "Caster": {
                "wis": {
                    "classes": ["Cleric", "Druid"],
                    "subclasses": ["Life", "Light", "Trickery", "War", "Apocalypse", "Harvest", "Land", "Moon", "Sea", "Stars", "Old Ways", "Symbiote", "Wicker"]
                },
                "int": {
                    "classes": ["Wizard", "Ritualist"],
                    "subclasses": ["Abjurer","Diviner", "Evoker", "Illusionist", "Bibliomancy", "Occultist", "Philosopher", "Artisan", "Elementalist", "Conjurer", "Enchanter", "Necromancer", "Transmuter", "Bladesinging"]
                },
                "cha": {
                    "classes": ["Warlock", "Sorcerer", "Bard"],
                    "subclasses": ["Dance", "Lore", "Valor","Glamour", "Drama", "Wild Magic", "Templar", "Draconic", "Aberrant", "Crimson", "Hungering Dark","Great Fool", "Horned King", "Archfey", "Infernal", "Undead", "Celestial", "Great Old One", "Exalted Assembly of the Feline Court"]
                }
            },
            "Semicaster": {
                "wis": {
                    "classes": ["Ranger", "Bushi", "Barbarian", "Monk"],
                    "subclasses": ["Trail Warden", "Hunter", "Armsmaster", "Protector", "Vanguard", "Wild Heart", "World Tree", "Mercy", "Tattoed Warrior", "Shadow", "Elements", "Cosmic Balance"]
                },
                "int": {
                    "classes": ["Binder", "Rogue", "Fighter"],
                    "subclasses": ["Knight of the Sacred Seal", "Anima Mage", "Tenebrous Apostate", "Scion of Dantalion", "Eldritch Knight", "Arcane Archer", "Arcane Trickster"]
                },
                "cha": {
                    "classes": ["Paladin", "Duelist"],
                    "subclasses": ["Devotion", "Glory", "Ancients", "Vengeance", "Castigation", "Guardian", "Blademaster", "Adept", "Death Dancer"]
                }
            }
        };
        
        // Complete backgrounds from backgrounds.csv
        this.backgrounds = [
            { name: 'Acolyte', primary: 'Wisdom', tertiary: 'Charisma' },
            { name: 'Agitator', primary: 'Charisma', tertiary: 'Wisdom' },
            { name: 'Anchorite', primary: 'Wisdom', tertiary: 'Constitution' },
            { name: 'Animal Handler', primary: 'Wisdom', tertiary: 'Strength' },
            { name: 'Apothecary', primary: 'Intelligence', tertiary: 'Wisdom' },
            { name: 'Apprentice Wizard', primary: 'Intelligence', tertiary: 'Wisdom' },
            { name: 'Archer', primary: 'Dexterity', tertiary: 'Strength' },
            { name: 'Artisan', primary: 'Intelligence', tertiary: 'Dexterity' },
            { name: 'Bailiff', primary: 'Intelligence', tertiary: 'Charisma' },
            { name: 'Bawd', primary: 'Charisma', tertiary: 'Dexterity' },
            { name: 'Beggar', primary: 'Constitution', tertiary: 'Charisma' },
            { name: 'Boatman', primary: 'Strength', tertiary: 'Constitution' },
            { name: 'Bounty Hunter', primary: 'Dexterity', tertiary: 'Wisdom' },
            { name: 'Burglar', primary: 'Dexterity', tertiary: 'Intelligence' },
            { name: 'Cavalryman', primary: 'Strength', tertiary: 'Dexterity' },
            { name: 'Charlatan', primary: 'Charisma', tertiary: 'Dexterity' },
            { name: 'Coachman', primary: 'Constitution', tertiary: 'Strength' },
            { name: 'Criminal', primary: 'Dexterity', tertiary: 'Charisma' },
            { name: 'Cultist', primary: 'Wisdom', tertiary: 'Charisma' },
            { name: 'Duellist', primary: 'Dexterity', tertiary: 'Charisma' },
            { name: 'Engineer', primary: 'Intelligence', tertiary: 'Constitution' },
            { name: 'Entertainer', primary: 'Charisma', tertiary: 'Dexterity' },
            { name: 'Envoy', primary: 'Charisma', tertiary: 'Intelligence' },
            { name: 'Fanatic', primary: 'Wisdom', tertiary: 'Constitution' },
            { name: 'Farmer', primary: 'Strength', tertiary: 'Constitution' },
            { name: 'Fence', primary: 'Charisma', tertiary: 'Intelligence' },
            { name: 'Fisher', primary: 'Constitution', tertiary: 'Wisdom' },
            { name: 'Grave Robber', primary: 'Dexterity', tertiary: 'Constitution' },
            { name: 'Guard', primary: 'Strength', tertiary: 'Wisdom' },
            { name: 'Guide', primary: 'Wisdom', tertiary: 'Dexterity' },
            { name: 'Hedge Witch', primary: 'Intelligence', tertiary: 'Wisdom' },
            { name: 'Herbalist', primary: 'Intelligence', tertiary: 'Constitution' },
            { name: 'Hermit', primary: 'Wisdom', tertiary: 'Intelligence' },
            { name: 'Investigator', primary: 'Intelligence', tertiary: 'Wisdom' },
            { name: 'Knight', primary: 'Strength', tertiary: 'Charisma' },
            { name: 'Lawyer', primary: 'Intelligence', tertiary: 'Charisma' },
            { name: 'Lookout', primary: 'Dexterity', tertiary: 'Wisdom' },
            { name: 'Merchant', primary: 'Charisma', tertiary: 'Intelligence' },
            { name: 'Messenger', primary: 'Dexterity', tertiary: 'Constitution' },
            { name: 'Miner', primary: 'Constitution', tertiary: 'Strength' },
            { name: 'Minstrel', primary: 'Charisma', tertiary: 'Dexterity' },
            { name: 'Mystic', primary: 'Wisdom', tertiary: 'Intelligence' },
            { name: 'Noble', primary: 'Charisma', tertiary: 'Wisdom' },
            { name: 'Nomad', primary: 'Constitution', tertiary: 'Dexterity' },
            { name: 'Noviate', primary: 'Wisdom', tertiary: 'Charisma' },
            { name: 'Nun', primary: 'Wisdom', tertiary: 'Constitution' },
            { name: 'Outlaw', primary: 'Dexterity', tertiary: 'Constitution' },
            { name: 'Pedlar', primary: 'Charisma', tertiary: 'Dexterity' },
            { name: 'Physician', primary: 'Intelligence', tertiary: 'Wisdom' },
            { name: 'Pit Fighter', primary: 'Strength', tertiary: 'Constitution' },
            { name: 'Priest', primary: 'Wisdom', tertiary: 'Charisma' },
            { name: 'Protagonist', primary: 'Charisma', tertiary: 'Strength' },
            { name: 'Racketeer', primary: 'Charisma', tertiary: 'Intelligence' },
            { name: 'Rat Catcher', primary: 'Dexterity', tertiary: 'Constitution' },
            { name: 'Riverwarden', primary: 'Strength', tertiary: 'Wisdom' },
            { name: 'Road Warden', primary: 'Strength', tertiary: 'Dexterity' },
            { name: 'Sage', primary: 'Intelligence', tertiary: 'Wisdom' },
            { name: 'Sailor', primary: 'Strength', tertiary: 'Dexterity' },
            { name: 'Scavenger', primary: 'Constitution', tertiary: 'Dexterity' },
            { name: 'Scholar', primary: 'Intelligence', tertiary: 'Wisdom' },
            { name: 'Seaman', primary: 'Constitution', tertiary: 'Strength' },
            { name: 'Servant', primary: 'Constitution', tertiary: 'Wisdom' },
            { name: 'Slave', primary: 'Constitution', tertiary: 'Strength' },
            { name: 'Slayer', primary: 'Strength', tertiary: 'Constitution' },
            { name: 'Smuggler', primary: 'Dexterity', tertiary: 'Charisma' },
            { name: 'Soldier', primary: 'Strength', tertiary: 'Constitution' },
            { name: 'Spy', primary: 'Dexterity', tertiary: 'Charisma' },
            { name: 'Stevedore', primary: 'Strength', tertiary: 'Constitution' },
            { name: 'Townsman', primary: 'Constitution', tertiary: 'Charisma' },
            { name: 'Trapper', primary: 'Dexterity', tertiary: 'Wisdom' },
            { name: 'Villager', primary: 'Constitution', tertiary: 'Wisdom' },
            { name: 'Warden', primary: 'Wisdom', tertiary: 'Strength' },
            { name: 'Warrior Priest', primary: 'Strength', tertiary: 'Wisdom' },
            { name: 'Watchman', primary: 'Strength', tertiary: 'Constitution' },
            { name: 'Witch Hunter', primary: 'Dexterity', tertiary: 'Wisdom' },
            { name: 'Witch', primary: 'Intelligence', tertiary: 'Charisma' },
            { name: 'Loyal Servant', primary: 'Wisdom', tertiary: 'Charisma' },
            { name: 'Doomed to Die', primary: 'Constitution', tertiary: 'Wisdom' },
            { name: 'Driven from Home', primary: 'Dexterity', tertiary: 'Constitution' },
            { name: 'Emissary of your People', primary: 'Charisma', tertiary: 'Wisdom' },
            { name: 'Fallen Scion', primary: 'Charisma', tertiary: 'Intelligence' },
            { name: 'Black Shield', primary: 'Strength', tertiary: 'Constitution' },
            { name: 'The Harrowed', primary: 'Wisdom', tertiary: 'Constitution' },
            { name: 'Hunted by Shadow', primary: 'Dexterity', tertiary: 'Wisdom' },
            { name: 'Lure of the Road', primary: 'Dexterity', tertiary: 'Charisma' },
            { name: 'The Magician', primary: 'Intelligence', tertiary: 'Wisdom' },
            { name: 'Oathsworn', primary: 'Wisdom', tertiary: 'Strength' },
            { name: 'Reluctant Adventurer', primary: 'Constitution', tertiary: 'Dexterity' },
            { name: 'Seeker of the Lost', primary: 'Intelligence', tertiary: 'Wisdom' },
            { name: 'World Weary', primary: 'Constitution', tertiary: 'Charisma' }
        ];
        
        // Complete traits from traits.csv
        this.virtues = ['Chaste', 'Energetic', 'Forgiving', 'Generous', 'Honest', 'Just', 'Merciful', 'Modest', 'Pious', 'Prudent', 'Temperate', 'Trusting', 'Valorous', 'Hospitality', 'Love', 'Loyal'];
        this.vices = ['Lustful', 'Lazy', 'Vengeful', 'Selfish', 'Deceitful', 'Arbitrary', 'Cruel', 'Proud', 'Worldly', 'Reckless', 'Indulgent', 'Suspicious', 'Cowardly', 'Churlishness', 'Hate', 'Treacherous'];
        
        // Complete origin feats from origin_feats.csv
        this.originFeats = [
            { name: 'I Fought, I Lived', primaryStat: 'Strength' },
            { name: 'I Hid from the Terror', primaryStat: 'Dexterity' },
            { name: 'I Pierced the Illusion', primaryStat: 'Wisdom' },
            { name: 'I Opened the Gate', primaryStat: 'Intelligence' },
            { name: 'I Survived to Tell the Tale', primaryStat: 'Constitution' },
            { name: 'Alert', primaryStat: 'Dexterity' },
            { name: 'Crafter', primaryStat: 'Intelligence' },
            { name: 'Healer', primaryStat: 'Wisdom' },
            { name: 'Lucky', primaryStat: 'Charisma' },
            { name: 'Magic Initiate', primaryStat: 'Intelligence' },
            { name: 'Musician', primaryStat: 'Charisma' },
            { name: 'Savage Attacker', primaryStat: 'Strength' },
            { name: 'Skilled', primaryStat: 'Intelligence' },
            { name: 'Tavern Brawler', primaryStat: 'Strength' },
            { name: 'Tough', primaryStat: 'Constitution' }
        ];
        
        // Load card data directly (embedded to avoid CORS issues)
        this.cardData = this.getCardData();
    }
    
    getCardData() {
        // Complete card data from cards.json (66 cards)
        return [
            {
                title: "BALANCE",
                upright_meaning: {
                    person: "A fair-minded person who can see multiple perspectives and judge impartially.",
                    creature_or_trap: "A trap, a Beast, a Construct, or an otherwise impartial foe.",
                    place: "A place where different forces exist in balance—such as a civilization in balance with nature, a land in balance with water, or chaos in balance with order.",
                    treasure: "A treasure with value to two competing factions, or with two equal magical powers.",
                    situation: "A situation where maintaining balance is important: keeping rivals satisfied, preserving the balance of power among different authorities, or rejecting false dichotomies and forced choices."
                },
                reversed_meaning: {
                    person: "A judgmental or biased person willfully ignoring one perspective in favor of another.",
                    creature_or_trap: "A Celestial, a Fiend, or some other creature strongly associated with a particular alignment or ideology.",
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
                    place: "A library or another storehouse of written knowledge.",
                    treasure: "A valuable or magical written work, such as a book or scroll.",
                    situation: "Secrets that should never have been discovered but were written down."
                }
            },
            {
                title: "BRIDGE",
                upright_meaning: {
                    person: "A mediator who enjoys helping others overcome misunderstandings or grievances.",
                    creature_or_trap: "Someone who coordinates the efforts of different kinds of creatures, such as a mind flayer mastermind using grimlocks and trolls as agents.",
                    place: "A bridge across a river or chasm.",
                    treasure: "An art object depicting a bridge, or a magic item intended to help overcome obstacles (such as Boots of Striding and Springing).",
                    situation: "An urgent need for bridges between long-opposed factions."
                },
                reversed_meaning: {
                    person: "A person who is part of a longstanding feud between two families or groups.",
                    creature_or_trap: "A creature that lairs near, on, or under a bridge and either collects tolls from those using the bridge or tries to eat them.",
                    place: "A river or chasm with no bridge, or where the bridge is unsafe or has collapsed.",
                    treasure: "An art object depicting walls, barriers, or a labyrinth; alternatively, a magic item that creates magical walls (such as a Cube of Force).",
                    situation: "Open conflict between two families or groups."
                }
            },
            {
                title: "CAMPFIRE",
                upright_meaning: {
                    person: "A person on vacation, enjoying time away from work and pursuing activities they enjoy.",
                    creature_or_trap: "A creature that alternates brief periods of activity with long periods of rest (as many reptiles and Dragons do); alternatively, a trap that requires a long time to reset between activations.",
                    place: "A place recently used as a campsite.",
                    treasure: "An art object depicting a peaceful scene, or a magic item that facilitates safe rest (such as a Rod of Security).",
                    situation: "A period of rest in the middle of a journey or an adventure."
                },
                reversed_meaning: {
                    person: "An exhausted person.",
                    creature_or_trap: "A creature immune to exhaustion (such as an angel, a golem, an Ooze, or an Undead), or a trap or hazard with a constant, ongoing effect.",
                    place: "Somewhere not conducive to rest, such as a busy marketplace active at all hours.",
                    treasure: "An art object that suggests frenetic activity, or a magic item that helps its user remain alert (such as a Sentinel Shield).",
                    situation: "A situation that demands unrelenting activity."
                }
            },
            {
                title: "CAVERN",
                upright_meaning: {
                    person: "A person who asks probing questions but shares little.",
                    creature_or_trap: "A creature (such as a piercer or a roper) that mimics the features of natural caverns.",
                    place: "A cavern or a cavernous building such as a large temple.",
                    treasure: "A geode, jewelry made from gems and precious metals, or a magic item that grants darkvision (such as Goggles of Night).",
                    situation: "A situation that requires delving into hidden motivations and secrets."
                },
                reversed_meaning: {
                    person: "A person who lives for the moment, avoiding introspection.",
                    creature_or_trap: "A creature that swallows prey whole, or a trap that causes a ceiling or roof to collapse.",
                    place: "A small niche or cave.",
                    treasure: "An art object that lacks a sense of depth or perspective.",
                    situation: "Everyone's motivations exposed for all to see."
                }
            },
            {
                title: "CELESTIAL",
                upright_meaning: {
                    person: "A devout person who looks for miracles and the presence of the divine in all parts of life.",
                    creature_or_trap: "A Celestial or other creature that has connections to the gods, or a trap that deals radiant damage.",
                    place: "A location on the Upper Planes, or a place suffused with their influence.",
                    treasure: "An art object depicting angels or other Celestials, treasure from the Upper Planes, or magic items made by Celestials.",
                    situation: "Communication between the Upper Planes and the Material Plane—perhaps in dreams or visions, or with Celestials as intermediaries."
                },
                reversed_meaning: {
                    person: "Someone who carries a grudge over a real or perceived injury caused by a god or Celestial.",
                    creature_or_trap: "A fallen Celestial or similar creature that has lost its connection to the divine.",
                    place: "A place intended to ward off Celestials and influence from the Upper Planes.",
                    treasure: "A treasure depicting a Celestial's fall, or a magic item useful against Celestials.",
                    situation: "A situation involving Celestials' unwelcome interference in mortal affairs."
                }
            },
            {
                title: "COMET",
                upright_meaning: {
                    person: "A serious person with a gloomy outlook, perhaps carrying bad news.",
                    creature_or_trap: "A creature regarded as an ill omen, or signs that a dire creature approaches; alternatively, a trap marked by clear signs, perhaps surrounded by the corpses of its victims.",
                    place: "A place with a connection to astronomical events: perhaps an observatory or a meteorite's crater.",
                    treasure: "A treasure that carries a curse, or one whose power is destined to be used for destructive ends.",
                    situation: "A crisis about to spiral out of control."
                },
                reversed_meaning: {
                    person: "A person who is grieving or delights in the suffering of others.",
                    creature_or_trap: "The destruction left in the wake of a rampaging creature, or smaller creatures fleeing from a larger one.",
                    place: "A ruin where a terrible event occurred in the past and that might now be haunted.",
                    treasure: "A treasure formed or shaped by disaster, bloodstained or haunted by former owners; alternatively, something good arising from a bad situation.",
                    situation: "The calm after a devastating storm; a situation where people are reeling from awful news or events."
                }
            },
            {
                title: "CORPSE",
                upright_meaning: {
                    person: "An evil person whose morality has rotted away.",
                    creature_or_trap: "A zombie or similar corpo- real Undead whose flesh is decaying, or a trapped corpse.",
                    place: "Somewhere things are left to rot, such as a graveyard or charnel house.",
                    treasure: "An art object depicting dead bodies, a corpse just starting to decay, or a magic item that causes decay (such as a Staff of Withering).",
                    situation: "An organization or institution over- whelmed by corruption."
                },
                reversed_meaning: {
                    person: "A good person who remains uncorrupted despite being surrounded by wickedness.",
                    creature_or_trap: "An Ooze or fungus creature that facilitates the decomposition of corpses.",
                    place: "A place where fungus grows abundantly on a diet of rotting flesh.",
                    treasure: "A treasure that remains uncorrupted in the midst of rot.",
                    situation: "An attempt to corrupt a respected and noble organization."
                }
            },
            {
                title: "DONJON",
                upright_meaning: {
                    person: "A prisoner, or a person who feels trapped.",
                    creature_or_trap: "A creature that grapples or swal- lows prey whole.",
                    place: "A place of imprisonment, such as a literal dungeon or a menagerie.",
                    treasure: "A treasure locked in a vault, or magic with the power to bind or imprison.",
                    situation: "An impasse, a situation that threatens someone's freedom, or a situation where some- one's indecision is keeping everyone in suspense."
                },
                reversed_meaning: {
                    person: "A recently freed or escaped prisoner, or a free thinker who rejects social norms.",
                    creature_or_trap: "A creature that has escaped from captivity or gone feral.",
                    place: "A prison broken open, or a place associated with liberation (such as a monument commemo- rating emancipation).",
                    treasure: "A treasure that once held a being captive, such as an Efreeti Bottle that has lost its magic or an empty Iron Flask.",
                    situation: "A situation that requires creative solu- tions, or an effort to free people or creatures from Captivity."
                }
            },
            {
                title: "DRAGON",
                upright_meaning: {
                    person: "A dragonborn, a person who uses draconic magic, a person who is fascinated by dragons, or a person who hoards wealth or other goods.",
                    creature_or_trap: "A Dragon or similar creature.",
                    place: "The lair of a Dragon or some other impres- sive creature, or a site of great magical power.",
                    treasure: "Large quantities of treasure, though not necessarily of great monetary value (for example, many copper coins or a large collection of cheap statuettes).",
                    situation: "Someone hoarding resources that are widely needed or desired."
                },
                reversed_meaning: {
                    person: "Someone with a grudge against a particu- lar Dragon or against Dragons in general.",
                    creature_or_trap: "A dracolich or another Undead dragon, a Construct that resembles a Dragon, or another Dragon-like creature.",
                    place: "A place where a Dragon was slain, leaving a magical or physical scar on the land.",
                    treasure: "An art object depicting the death of a Dragon, or a magic item useful against Dragons (such as a Dragon Slayer).",
                    situation: "A group that plans to drive a Dragon from its lair, steal from its hoard, or kill it."
                }
            },
            {
                title: "EURYALE",
                upright_meaning: {
                    person: "A person who observes without becoming involved or attached.",
                    creature_or_trap: "A medusa or another creature with the power to petrify or a gaze attack.",
                    place: "Somewhere with commanding views, such as a watchtower or a high promontory.",
                    treasure: "A landscape painting or tapestry, or a magic item that enhances vision (such as Goggles of Night).",
                    situation: "A situation that rewards or requires care- ful observation, such as a surveillance operation."
                },
                reversed_meaning: {
                    person: "A nosy person who inserts themself into situations where they don't belong.",
                    creature_or_trap: "A creature made of or associated with stone.",
                    place: "A place with narrow windows (perhaps arrow slits) or with a limited view, perhaps underground.",
                    treasure: "A valuable sculpture or statue, a gem- stone, or a magic item made from stone, such as a Figurine of Wondrous Power.",
                    situation: "A situation arising from people's unwill- ingness to observe things as they are, or their ten- dency to project their own feelings and opinions onto others."
                }
            },
            {
                title: "FATES",
                upright_meaning: {
                    person: "A person perhaps nearing the end of their life, troubled by past mistakes or reflecting on prior decisions.",
                    creature_or_trap: "A supernatural creature con- nected to fate, such as a Celestial, modron, or hag.",
                    place: "Somewhere meant for literal or metaphor- ical reflection, such as a room full of mirrors, a still mountain lake, a monastery, a hermitage, or a library.",
                    treasure: "An ornate or magical mirror, tapestry, or other woven treasure; alternatively, magic that can alter fate.",
                    situation: "A situation ordained by fate, perhaps in- volving a supernatural punishment or reward."
                },
                reversed_meaning: {
                    person: "A person driven by the desire to escape whatever fate has in store.",
                    creature_or_trap: "A creature strongly associated with chaos, such as a demon or a slaad.",
                    place: "A place that discourages reflection, such as a dark place or a noisy, busy one.",
                    treasure: "An art object depicting the effort to escape fate, or a magic item powered by chaos.",
                    situation: "An unjust situation where evil is re- warded and good is punished."
                }
            },
            {
                title: "FIEND",
                upright_meaning: {
                    person: "A tiefling, warlock of the Fiend, member of a Fiend-worshipping cult, or person who seeks to manipulate others into harmful contracts.",
                    creature_or_trap: "A Fiend of any sort.",
                    place: "A place on the Lower Planes, or a location suffused with their influence.",
                    treasure: "An art object depicting Fiends, treasure from the Lower Planes, or magic items made by Fiends.",
                    situation: "Interaction between the Lower Planes and the Material Plane—perhaps an infernal bar- gain or demonic destruction."
                },
                reversed_meaning: {
                    person: "A person who carries a grudge over a real or perceived injury caused by a Fiend, or a person trapped in a bargain with a Fiend.",
                    creature_or_trap: "A redeemed Fiend or simi- lar creature that has lost its connection to the Lower Planes.",
                    place: "A place intended to ward off Fiends and in- fluence from the Lower Planes.",
                    treasure: "A treasure depicting a Fiend's redemp- tion, or a magic item useful against Fiends.",
                    situation: "A situation involving Fiends' unwelcome interference in mortal affairs."
                }
            },
            {
                title: "FOOL",
                upright_meaning: {
                    person: "An innocent or naive person blissfully igno- rant of the world's sinister side, possibly a child.",
                    creature_or_trap: "A naive Celestial or a flighty Fey, or a trap with a simple or obvious means of avoiding it.",
                    place: "A place connected with children, such as a nursery, an orphanage, or a school.",
                    treasure: "A portrait of a child, jewelry meant for a child, or a magic item connected to the Upper Planes.",
                    situation: "A situation requiring trust, honesty, and a leap of faith."
                },
                reversed_meaning: {
                    person: "A con artist who preys on the innocent and gullible while presenting a trustworthy facade.",
                    creature_or_trap: "A creature that changes its shape to appear harmless so it can get close to its prey, or a trap that is difficult to avoid.",
                    place: "A place tied to the loss of innocence, such as a harsh orphanage or exploitative workhouse.",
                    treasure: "A treasure stolen from a child or naive person, or magic intended to deceive (such as a Hat of Disguise).",
                    situation: "A guileless person being manipulated by schemers."
                }
            },
            {
                title: "GIANT",
                upright_meaning: {
                    person: "A family member, a dear friend, or another personally important individual; alternatively, a very tall person.",
                    creature_or_trap: "A Giant, a giant animal, or an- other big creature.",
                    place: "A place constructed by Giants, or a place of great personal significance.",
                    treasure: "A treasure made by Giants, or one of great sentimental value.",
                    situation: "Someone attaching outsize importance to one element of the situation, to the neglect of other factors."
                },
                reversed_meaning: {
                    person: "A person who seems insignificant.",
                    creature_or_trap: "A Tiny creature that's a greater threat than its size suggests.",
                    place: "Somewhere destroyed by Giants.",
                    treasure: "A treasure depicting or commemorating the slaying of a Giant, or a magic item useful against Giants (such as a Giant Slayer).",
                    situation: "Someone unable or unwilling to recog- nize the importance of a critical factor."
                }
            },
            {
                title: "JESTER",
                upright_meaning: {
                    person: "An optimistic person who laughs at their own misfortune.",
                    creature_or_trap: "A monster some consider silly, such as a flumph, an owlbear, or a gelat- inous cube.",
                    place: "A place dedicated to amusement, such as a fairground or a feasting hall.",
                    treasure: "A humorous art object or magic item, such as a Wand of Wonder.",
                    situation: "A hilarious situation stemming from mis- communication and misplaced assumptions."
                },
                reversed_meaning: {
                    person: "A person who laughs at the misfortunes of others.",
                    creature_or_trap: "A creature with an unsettling laugh, such as a gnoll or hyena, or a creature with a cruel sense of humor.",
                    place: "A place associated with cruelty and pain, such as a torture chamber.",
                    treasure: "An art object depicting pain or humilia- tion, or a magic item meant to inflict pain (such as a Sword of Wounding).",
                    situation: "One misfortune piling on another in a way that would be humorous—if it weren't disastrous."
                }
            },
            {
                title: "KNIGHT",
                upright_meaning: {
                    person: "A trustworthy person who honors their commitments.",
                    creature_or_trap: "A creature bound by oaths or who serves someone else.",
                    place: "A place of sanctuary, where strong traditions protect those who take shelter inside.",
                    treasure: "A treasure celebrating or commemorat- ing an oath (such as a wedding ring), or magic weapons or armor associated with knights or paladins.",
                    situation: "A situation that requires loyalty in one's companions and faithfulness to them."
                },
                reversed_meaning: {
                    person: "A person who can't be trusted, or a traitor posing as a loyal friend.",
                    creature_or_trap: "A knight who has failed to live up to their code of honor (such as a death knight).",
                    place: "A place where a great betrayal took place, or a location with treacherous terrain or traps.",
                    treasure: "A treasure that carries a hidden curse, or a magic item that fails when it's needed most.",
                    situation: "A situation involving the betrayal of trust, or rampant suspicion."
                }
            },
            {
                title: "MAGE",
                upright_meaning: {
                    person: "A person (perhaps a sorcerer, warlock, or wizard) who uses arcane magic or other special- ized learning.",
                    creature_or_trap: "A creature with abilities similar to those of a sorcerer, warlock, or wizard.",
                    place: "A place dedicated to the study of arcane magic or that is suffused with such magic.",
                    treasure: "A magic item such as a wand or staff, or a wizard's spellbook.",
                    situation: "A situation that requires and rewards the correct use of arcane magic."
                },
                reversed_meaning: {
                    person: "A person who wrongly believes their good luck is the result of innate magical ability or a magical good luck charm.",
                    creature_or_trap: "A creature that resists or negates magic.",
                    place: "A place where magic has caused destruc- tion, doesn't work (like the effect of an Antimagic Field), or works unpredictably (perhaps triggering wild magic surges).",
                    treasure: "An art object created by the use of magic, or a magic item with unpredictable effects (such as a Wand of Wonder).",
                    situation: "A situation caused by magic misused or out of control."
                }
            },
            {
                title: "MAZE",
                upright_meaning: {
                    person: "A person who feels lost in their own life, unsure how to affect change, or a person with a wandering mind who takes their time getting to the point.",
                    creature_or_trap: "A minotaur or another creature that hunts in a maze or is imprisoned in a maze.",
                    place: "A maze, or a region (such as a forest or des- ert) where becoming lost is very easy.",
                    treasure: "An art object depicting confusion or disorientation, or a magic item that can cause these states.",
                    situation: "A confusing situation where it's difficult to perceive all the factors at play."
                },
                reversed_meaning: {
                    person: "A person running from expectations placed on them by family and society, trying to find a new path in life.",
                    creature_or_trap: "A creature whose behavior is unpredictable.",
                    place: "A simple labyrinth designed for meditation or to provide private nooks, or a location in which one is unlikely to get lost (such as a cave with only one exit).",
                    treasure: "An art object incorporating a laby- rinth design.",
                    situation: "A search for something or someone that has gone missing."
                }
            },
            {
                title: "MONSTROSITY",
                upright_meaning: {
                    person: "A familiar person whose behavior suddenly turns threatening.",
                    creature_or_trap: "A Monstrosity, especially one that superficially resembles an ordinary animal or person (such as a displacer beast or doppelganger).",
                    place: "A familiar place that has become dangerous.",
                    treasure: "An art object depicting a Monstrosity or that incorporates claws, fur, or feathers from such a creature.",
                    situation: "A situation involving something or someone becoming more monstrous (literally or figuratively)."
                },
                reversed_meaning: {
                    person: "A person who seems dangerous or bizarre but is friendly and helpful.",
                    creature_or_trap: "A Monstrosity that is a potential ally, such as a hippogriff.",
                    place: "A place that offers refuge in unfamiliar or dangerous terrain.",
                    treasure: "A dead Monstrosity preserved by taxidermy, or a magic item useful against Mon- strosities.",
                    situation: "Something that appears monstrous but is actually benign."
                }
            },
            {
                title: "OOZE",
                upright_meaning: {
                    person: "A quiet, unassuming person who has hid- den power or secret knowledge.",
                    creature_or_trap: "An Ooze or another creature that seems unimportant, or a trap that is surprisingly simple and straightforward.",
                    place: "A humble place of surprising comfort or importance.",
                    treasure: "A treasure that is valuable but not beauti- ful, such as a poorly crafted piece of jewelry incor- porating precious stones.",
                    situation: "Something important that has been over- looked because it seems ordinary."
                },
                reversed_meaning: {
                    person: "A quiet, unassuming person completely out of their depth.",
                    creature_or_trap: "An Ooze that has developed curiosity, unexpected intelligence, and a way to communicate, or a dangerous trap that is difficult to detect.",
                    place: "A humble place with little to offer.",
                    treasure: "An art object depicting an Ooze or the destruction of a particularly notable Ooze; alter- natively, a magic item useful against Oozes (such as a Ring of Acid Resistance).",
                    situation: "A situation complicated by the sheer number of minor factors tangled within it."
                }
            },
            {
                title: "PIT",
                upright_meaning: {
                    person: "A person who has lost significant wealth, social status, or favor.",
                    creature_or_trap: "A pit trap, or a scavenger lurking at the bottom of a pit.",
                    place: "A pit or cliff that creates the risk of a fall.",
                    treasure: "An art object depicting someone's calam- itous fall, or a magic item that allows falling safely (such as a Ring of Feather Falling).",
                    situation: "A situation involving someone's fall from grace."
                },
                reversed_meaning: {
                    person: "A person in a precarious position who soon will have a calamitous fall.",
                    creature_or_trap: "A creature (such as a piercer) that attacks by falling on prey.",
                    place: "An abandoned mansion or palace that is in disrepair due to the owner's downfall.",
                    treasure: "An art object depicting flight or incorpo- rating feathers, or a magic item that grants flight (such as Winged Boots or a Cloak of the Bat).",
                    situation: "A conspiracy to cause the downfall of a wealthy or prominent person."
                }
            },
            {
                title: "PRIEST",
                upright_meaning: {
                    person: "A person (perhaps a cleric, druid, or pala- din) who uses divine magic or is very pious.",
                    creature_or_trap: "A creature with abilities similar to those of a cleric, druid, or paladin.",
                    place: "A temple, shrine, or similar place conse- crated to a deity or natural force.",
                    treasure: "A magic item such as a Staff of Healing or a Holy Avenger; alternatively, valuable temple accoutrements.",
                    situation: "A problem that requires and rewards piety or the use of divine magic."
                },
                reversed_meaning: {
                    person: "A person devoted to a false god, or a cause that isn't worthy of devotion.",
                    creature_or_trap: "A demon or another creature op- posed to the gods.",
                    place: "A place that was consecrated but that has been abandoned or converted to secular use.",
                    treasure: "An idol depicting an invented god or a demon lord.",
                    situation: "A situation caused by impiety or mis- guided zealotry."
                }
            },
            {
                title: "PUZZLE",
                upright_meaning: {
                    person: "A person with a keen mind for puzzles, or one who delights in clever banter and wordplay.",
                    creature_or_trap: "A brilliant creature that relies on careful plans and tactics rather than brute strength, or a trap that can be bypassed by solv- ing a puzzle or riddle.",
                    place: "A place with hidden doors and other secrets.",
                    treasure: "A treasure whose function or value isn't immediately apparent.",
                    situation: "A complex situation with many inter- connected factors."
                },
                reversed_meaning: {
                    person: "A person who is very literal and direct.",
                    creature_or_trap: "A creature that delights in straightforward melee combat, relying on strength to overpower its foes.",
                    place: "A place with a simple, symmetrical floor plan.",
                    treasure: "Coins or other treasure whose value is obvious and almost universally understood.",
                    situation: "A situation that's exactly what it appears to be."
                }
            },
            {
                title: "ROGUE",
                upright_meaning: {
                    person: "A deceptive person hiding a sinister secret; pursuit of their own aims trumps any friendship or loyalty.",
                    creature_or_trap: "A dangerous creature that strikes by surprise or from darkness.",
                    place: "A front for a criminal operation, or a mon- ster's lair.",
                    treasure: "A treasure that hides a deadly secret, such as a ring with a spring-loaded poison needle, a Dagger of Venom, or a cursed magic item.",
                    situation: "A situation rooted in or destined for betrayal."
                },
                reversed_meaning: {
                    person: "A good-hearted person entangled in a criminal or evil organization who is desperate for a way out.",
                    creature_or_trap: "A creature unwillingly bound to the service of villains.",
                    place: "An oasis of compassion surrounded by violence.",
                    treasure: "A treasure caked in grime or hidden in a filthy place.",
                    situation: "Good characters who are part of an evil organization or who plot to subvert it."
                }
            },
            {
                title: "SAGE",
                upright_meaning: {
                    person: "A person who offers helpful advice in diffi- cult circumstances.",
                    creature_or_trap: "A helpful creature that leads the way to safety or a goal.",
                    place: "A place dedicated to knowledge and wisdom, such as a library or university.",
                    treasure: "A valuable or magical book or scroll, or a sentient magic item that is known to provide helpful advice.",
                    situation: "An opportunity to provide valuable ad- vice on a familiar subject."
                },
                reversed_meaning: {
                    person: "Someone who helpfully offers bad advice.",
                    creature_or_trap: "A creature that tries to lead the way into danger or a trap.",
                    place: "A place whose structural flaws threaten its integrity.",
                    treasure: "A device valuable for its components that doesn't function as intended, or a sentient magic item that provides bad but well-intentioned advice.",
                    situation: "An opportunity to provide advice on a completely unfamiliar subject."
                }
            },
            {
                title: "SHIP",
                upright_meaning: {
                    person: "A person who routinely travels long dis- tances, such as a sailor, pilgrim, or nomad.",
                    creature_or_trap: "A creature that hunts a large ter- ritory or migrates great distances.",
                    place: "A port city, harbor, caravansary, or similar hub for travelers.",
                    treasure: "An art object depicting ships or travel, or a magic item that facilitates travel (such as a Folding Boat).",
                    situation: "A situation that requires travel, or one that unfolds while traveling."
                },
                reversed_meaning: {
                    person: "A person who dreams of travel but has never wandered far from home.",
                    creature_or_trap: "A creature that rarely leaves its lair—and is more powerful there.",
                    place: "An isolated place that rarely sees travelers.",
                    treasure: "A treasure still in the hands of the per- son who made it, or a magic item (such as Dimen- sional Shackles) that prevents magical movement.",
                    situation: "A situation arising from someone's in- ability or unwillingness to travel."
                }
            },
            {
                title: "STAFF",
                upright_meaning: {
                    person: "A person who offers physical, financial, or emotional support.",
                    creature_or_trap: "A creature used as a mount or a tracker, or another sort of ally.",
                    place: "A place where support is offered or found, such as a library or a tavern.",
                    treasure: "A magic staff, a jeweled cane or mobility aid, or a similar treasure.",
                    situation: "A group or organization that offers much- needed support."
                },
                reversed_meaning: {
                    person: "A person in desperate need of assistance.",
                    creature_or_trap: "A creature that's helpless or ineffective unless it can possess or be carried by another creature.",
                    place: "A place in immediate crisis, such as a loca- tion suddenly imperiled by fire or flood.",
                    treasure: "A treasure that needs repair before re- gaining its full value or magical potency.",
                    situation: "A group of people who need help from others."
                }
            },
            {
                title: "STAR",
                upright_meaning: {
                    person: "A person focused on improving a particular area of skill or behavior.",
                    creature_or_trap: "A creature that has trained to improve itself (perhaps having several skill or saving throw proficiencies), or a trap that requires teamwork to avoid or escape.",
                    place: "A place dedicated to study or training, such as a university or gymnasium.",
                    treasure: "An art object that reflects the skill of its creator, or a magic item that grants proficiency.",
                    situation: "A situation that requires or rewards training and practice."
                },
                reversed_meaning: {
                    person: "A person with natural ability but little patience for training or study.",
                    creature_or_trap: "A creature that relies on its nat- ural abilities instead of training (perhaps with no skill or saving throw proficiencies).",
                    place: "A place of untouched natural beauty.",
                    treasure: "Unrefined ore or uncut gems, or a magic item that improves an ability score.",
                    situation: "A situation resulting from someone's refusal to practice or train."
                }
            },
            {
                title: "SUN",
                upright_meaning: {
                    person: "A person with an unflappable and opti- mistic outlook, confident in the power of good triumphing over evil and obstacles.",
                    creature_or_trap: "An angel or a similar creature that embodies hope and good.",
                    place: "A place that embodies hope in the face of despair, such as a temple next to a graveyard or a town rebuilding after a natural disaster.",
                    treasure: "A valuable religious object devoted to good, or a holy or protective magic item.",
                    situation: "A difficult situation where hope neverthe- less continues to shine like a beacon."
                },
                reversed_meaning: {
                    person: "A naively positive person who spouts empty platitudes about everything turning out for the best.",
                    creature_or_trap: "A creature (perhaps a flumph or a pixie) that offers aid but is too weak to provide meaningful help.",
                    place: "A desecrated temple or similar place where dirt or corruption has eliminated all evidence of goodness and holiness.",
                    treasure: "A religious object or holy magic item that has been desecrated.",
                    situation: "Idealistic optimism that prevents people from responding to real danger."
                }
            },
            {
                title: "TAVERN",
                upright_meaning: {
                    person: "A genial person who delights in telling sto- ries in good company.",
                    creature_or_trap: "A social creature that travels in packs.",
                    place: "A tavern, restaurant, or similar place where people gather and eat socially.",
                    treasure: "A jeweled goblet or other treasure related to eating and drinking.",
                    situation: "A tavern brawl."
                },
                reversed_meaning: {
                    person: "A person who ruins the happiness of pleas- ant company.",
                    creature_or_trap: "A parasite, vampire, or similar creature that siphons strength, happiness, or vitality from others, or a trap designed to separate those caught in it.",
                    place: "A place once used for social gatherings but now abandoned.",
                    treasure: "A jeweled goblet or similar treasure stained with blood or holding the remnants of poison.",
                    situation: "An attempt to kill many people at once as they gather for a meal."
                }
            },
            {
                title: "THRONE",
                upright_meaning: {
                    person: "A person who enjoys exercising authority over others and expects to be obeyed.",
                    creature_or_trap: "A creature that leads others of its kind; alternatively, one with magical powers of influence or command.",
                    place: "A place of authority, such as a palace or a mayor's office.",
                    treasure: "A ruler's regalia, or a magic item (such as a Rod of Rulership) that imparts magical authority.",
                    situation: "A contest over who rightfully holds authority."
                },
                reversed_meaning: {
                    person: "A person who resents authority im- posed on them.",
                    creature_or_trap: "A creature that unwillingly serves another.",
                    place: "A place at the edge of a ruler's authority or on the border between rival nations.",
                    treasure: "An art object created as an act of resis- tance to tyranny, or a magic item that protects against restraint (such as a Ring of Free Action).",
                    situation: "A group of people rebelling against a ruler or an authority figure."
                }
            },
            {
                title: "TOWER",
                upright_meaning: {
                    person: "A person who prefers solitude to the com- pany of others.",
                    creature_or_trap: "A reclusive creature.",
                    place: "A remote tower or similar place of isolation.",
                    treasure: "An art object depicting an isolated place or a lonely person; alternatively, Daern's Instant Fortress or a similar magic item.",
                    situation: "A situation that requires assistance or information from a reclusive person."
                },
                reversed_meaning: {
                    person: "A desperately lonely person who craves close companionship.",
                    creature_or_trap: "A creature cut off from others of its kind that is trying to find them, or a trap that targets a single creature.",
                    place: "A place that discourages interaction with others, such as a library or monastery, where rules of silence are strictly enforced.",
                    treasure: "An art object expressing the artist's pro- found loneliness.",
                    situation: "A situation arising from someone's lone- liness or boredom."
                }
            },
            {
                title: "UNDEAD",
                upright_meaning: {
                    person: "A person nursing a grudge beyond reason.",
                    creature_or_trap: "An Undead creature sustained by a thirst for revenge or an unfinished task, such as a ghost or revenant.",
                    place: "A place haunted (literally or emotionally) by a terrible event that happened there.",
                    treasure: "A treasure depicting the dead or an Un- dead, something made from bones, or a magic item made by or for an Undead.",
                    situation: "Someone who refuses to leave the past in the past."
                },
                reversed_meaning: {
                    person: "A person too quick to forgive and for- get, who never holds anyone accountable for their misdeeds.",
                    creature_or_trap: "An Undead creature that craves an end to its miserable, interminable existence.",
                    place: "A place whose denizens have forgotten sig- nificant events that happened there.",
                    treasure: "An art object depicting the destruction of an Undead, or a magic item particularly useful against Undead (such as a Mace of Disruption).",
                    situation: "A serial criminal who has been par- doned for past misdeeds and now continues their wicked ways."
                }
            },
            {
                title: "WARRIOR",
                upright_meaning: {
                    person: "A person (perhaps a barbarian, fighter, or monk) who has trained in combat or served in the military.",
                    creature_or_trap: "A creature with abilities like those of a barbarian, fighter, or monk.",
                    place: "A training yard or fort where warriors learn combat skills.",
                    treasure: "A valuable or magical weapon or suit of armor.",
                    situation: "A situation that requires and rewards the skilled application of physical force."
                },
                reversed_meaning: {
                    person: "A bully who uses physical strength to in- timidate others.",
                    creature_or_trap: "A creature that relies on brute strength, or a trap that can be escaped through the application of brute strength.",
                    place: "A harsh environment where only the physi- cally powerful survive.",
                    treasure: "An unsubtle work of art.",
                    situation: "A situation involving bullying or extortion."
                }
            },
            {
                title: "WELL",
                upright_meaning: {
                    person: "A familiar person who is a reliable source of information and aid.",
                    creature_or_trap: "A familiar kind of creature, whose abilities are well understood.",
                    place: "A well, a familiar shop, or a place where fresh water can be found.",
                    treasure: "A reliable treasure (such as gold coins), or a magic item that produces food or water (such as a Decanter of Endless Water or an Al- chemy Jug).",
                    situation: "A familiar situation with a predict- able outcome."
                },
                reversed_meaning: {
                    person: "A familiar person who refuses to provide expected aid.",
                    creature_or_trap: "A familiar kind of creature whose behavior or abilities are surprising.",
                    place: "A well that has gone dry, or a familiar place that no longer offers the comforts it used to.",
                    treasure: "A treasure with unexpected proper- ties—a hidden compartment or magical quirk that's not immediately evident.",
                    situation: "A familiar situation that ends up defying expectations."
                }
            },
            {
                title: "VOID",
                upright_meaning: {
                    person: "A person trapped in despair.",
                    creature_or_trap: "A Fiend or an Undead that threatens annihilation of body and soul, or a trap with no easy exit or escape.",
                    place: "A place deep underground, underwater, or in space, where little light and air are available.",
                    treasure: "An art object that reflects its creator's de- spair or sadness, or a Sphere of Annihilation.",
                    situation: "A situation that seems to have no good— or even survivable—outcome."
                },
                reversed_meaning: {
                    person: "A person who has lost everything and has no place left to go but up.",
                    creature_or_trap: "A skeleton, zombie, or similar Undead remnant of a living creature; alternatively, a trap that's broken and nonfunctional.",
                    place: "A place of utter carnage, where a terrible bat- tle or massacre took place.",
                    treasure: "A treasure promised but not actually present, such as an empty treasure chest or a looted vault.",
                    situation: "The aftermath of a destructive event, where the few survivors must figure out how to go on living."
                }
            },
            {
                title: "TREE",
                upright_meaning: {
                    person: "A strong-willed person determined to per- severe despite hostile conditions.",
                    creature_or_trap: "A creature that thrives in a hos- tile environment.",
                    place: "Somewhere vegetation makes an unex- pected appearance: a park in a busy urban center or a tree growing on barren rock.",
                    treasure: "A treasure featuring diamonds, pearls, or precious wood, or a magic item that increases endurance (such as an Amulet of Health).",
                    situation: "A small outpost or lone individual hold- ing back a much larger force."
                },
                reversed_meaning: {
                    person: "Someone barely hanging on in hostile conditions.",
                    creature_or_trap: "A creature driven from its pre- ferred environment and struggling to survive in a new region.",
                    place: "A place cleared of natural growth.",
                    treasure: "An art object or a magic item made from the wood of a tree struck by lightning.",
                    situation: "An overwhelming threat against a small outpost or lone individual."
                }
            },
            {
                title: "TOMB",
                upright_meaning: {
                    person: "A person with a secret or a gap in their memory.",
                    creature_or_trap: "A mummy, wight, or similar Undead that lairs in its own tomb.",
                    place: "A tomb, especially one that is forgotten.",
                    treasure: "Valuable or magical funerary treasure.",
                    situation: "A situation no one wants to talk about or even acknowledge."
                },
                reversed_meaning: {
                    person: "A person trying to atone for a dreadful secret in their past.",
                    creature_or_trap: "An incorporeal Undead (such as a wraith or specter) that's not linked to the place of its death, burial place, or body.",
                    place: "A memorial structure that doesn't contain a body.",
                    treasure: "An art object depicting a dead individual as they were in life.",
                    situation: "A situation stemming from a buried secret that recently came to light."
                }
            },
            {
                title: "TEMPLE",
                upright_meaning: {
                    person: "A devout person who performs frequent rituals to invoke divine favor.",
                    creature_or_trap: "A temple guardian—perhaps a Celestial, Construct, or guardian naga.",
                    place: "A temple, shrine, or other place of worship.",
                    treasure: "A valuable ritual object, such as a candelabra or sacrificial knife, or a magic item linked to worship or divine magic (such as a Candle of Invocation).",
                    situation: "A situation best resolved by an appeal to divine power or spiritual authorities."
                },
                reversed_meaning: {
                    person: "A superstitious person who performs frequent rituals to ward off supernatural evil.",
                    creature_or_trap: "A creature that bestows curses (such as a fomorian, rakshasa, or mummy).",
                    place: "An area where crime, vice, or other impious behaviors are widespread.",
                    treasure: "A treasure with superstitious meaning—perhaps an amulet meant to ward off evil (such as a Scarab of Protection).",
                    situation: "A situation stemming from a superstitious fear of curses or bad luck."
                }
            },
            {
                title: "TALONS",
                upright_meaning: {
                    person: "A person who preys on other folk to acquire wealth or power.",
                    creature_or_trap: "A predator, especially one that preys on people or slowly drains their life (such as a vampire).",
                    place: "A place where the rich benefit from the labor of the poor.",
                    treasure: "A treasure that is a collector's prized possession or the object of a heist.",
                    situation: "A situation driven by someone's avarice."
                },
                reversed_meaning: {
                    person: "A person trapped by predatory debt or victimized by a monster that slowly drains the person's life.",
                    creature_or_trap: "A creature hunted for parts of its body that are considered valuable, or for the treasure it hoards.",
                    place: "A tenement or workhouse where oppressed victims of the rich live in squalor.",
                    treasure: "A treasure that was stolen from its rightful owner.",
                    situation: "A situation driven by a desperate individual victimized by the greedy."
                }
            },
            {
                title: "CONSTRUCT",
                upright_meaning: {
                    person: "An artisan who delights in handcrafted goods.",
                    creature_or_trap: "A Construct, particularly one designed to be animated (like a golem) as opposed to an ordinary object (like a broom or rug) that has been animated.",
                    place: "A workshop or art studio.",
                    treasure: "An exquisitely crafted art object (especially one with practical use) or magical tools.",
                    situation: "An artisan attempting to bring a Construct to life."
                },
                reversed_meaning: {
                    person: "A person who scorns the idea of working with their hands.",
                    creature_or_trap: "A creature able to destroy buildings and objects, such as one with the Siege Monster trait.",
                    place: "A garbage heap or another place where objects are discarded.",
                    treasure: "An object fashioned with minimum alteration of its raw materials, or a magic item useful against Constructs (such as a Mace of Smiting).",
                    situation: "A rueful artisan attempting to destroy a Construct that has broken free of all restraint."
                }
            },
            {
                title: "CROSSROADS",
                upright_meaning: {
                    person: "A person agonizing about a difficult decision or who regrets a recent decision.",
                    creature_or_trap: "A creature that induces confusion or erratic behavior (such as an umber hulk).",
                    place: "A crossroads, or a settlement where trade routes cross.",
                    treasure: "An art object that depicts a crossroads or cross patterns, or a magic item with multiple properties or uses (such as a staff).",
                    situation: "A choice between two options that are equally appealing or equally disastrous."
                },
                reversed_meaning: {
                    person: "A person who refuses to make decisions, relying instead on inaction or random determination.",
                    creature_or_trap: "A creature that prevents others from acting (such as a ghoul).",
                    place: "A place that constrains movement, such as a narrow ravine or passage.",
                    treasure: "An art object featuring overlapping circular patterns, or magic items that does only one thing a limited number of times (such as a wand).",
                    situation: "A situation stemming from someone's refusal to act or choose."
                }
            },
            {
                title: "DOOR",
                upright_meaning: {
                    person: "Someone trying to make amends for past misdeeds and adopt a better way of life.",
                    creature_or_trap: "A creature that changes form, or a trapped door.",
                    place: "A place, another doorway, or a passage from various perspectives.",
                    treasure: "An art object that looks very different from various perspectives, or a magic item that creates portals or allows teleportation (such as an Amulet of the Planes).",
                    situation: "An opportunity to deal with a situation differently than you have in the past."
                },
                reversed_meaning: {
                    person: "A person who keeps repeating the same mistakes and misdeeds.",
                    creature_or_trap: "A creature that causes its prey or enemies to change, such as a lycanthrope or slaad.",
                    place: "A locked door or barricaded passage.",
                    treasure: "A jeweled chest or lockbox, or a magic item that resists change (such as an Immovable Rod).",
                    situation: "A situation that keeps recurring."
                }
            },
            {
                title: "ELEMENTAL",
                upright_meaning: {
                    person: "A person who uses magic tied to the elements or who can shift dimensional boundaries.",
                    creature_or_trap: "An Elemental creature tied to an Elemental Plane or imagery of the elements, or a magic item that conjures or controls Elementals (such as a Ring of Elemental Command).",
                    place: "A place influenced by the Elemental Planes, or associated with an element (such as a cave, a mountain, a volcano, or a river).",
                    treasure: "An art object that depicts material from an Elemental Plane or imagery of the elements, or a magic item that conjures or controls Elementals (such as a Ring of Elemental Command).",
                    situation: "Forces from the Elemental Planes spilling into the world."
                },
                reversed_meaning: {
                    person: "A person driven by an internal conflict between two opposed tendencies or influences.",
                    creature_or_trap: "A creature that combines the substance of two Elemental Planes or creatures from opposing Elemental Planes.",
                    place: "A place where forces of the Elemental Planes are in opposition to each other.",
                    treasure: "An art object that incorporates material from multiple Elemental Planes.",
                    situation: "Elemental opposition, a magic item useful against Elementals, or forces from two or more Elemental Planes entering the world."
                }
            },
            {
                title: "EXPERT",
                upright_meaning: {
                    person: "A person (perhaps a bard, a rogue, a ranger, or an artificer) with exactly the right skills for the task at hand.",
                    creature_or_trap: "A creature with abilities similar to those of a bard, ranger, or rogue, such as expertise in one or more skills.",
                    place: "A place (such as a guild hall) where skilled folk gather to share their expertise.",
                    treasure: "A treasure with practical use, such as a musical instrument or a tool.",
                    situation: "A situation that requires and rewards the expert application of practical skills."
                },
                reversed_meaning: {
                    person: "A person who believes themself an expert but isn't actually helpful.",
                    creature_or_trap: "A creature that relies on brute strength instead of skill or stealth.",
                    place: "A place where children learn the basics of useful skills.",
                    treasure: "A wildly impractical treasure with no actual use, unwieldy to wear or display.",
                    situation: "A situation stemming from someone's expertise being overlooked or ignored."
                }
            },
            {
                title: "FEY",
                upright_meaning: {
                    person: "A person with Fey ancestry or some other connection to the Fey (such as a warlock of the Archfey), or a person with a whimsical sense of humor.",
                    creature_or_trap: "A Fey creature or some other creature with connections to the Feywild.",
                    place: "A place in the Feywild, somewhere that allows passage to the Feywild, or a location where Fey magic is active.",
                    treasure: "An art object depicting Fey or the Feywild, or magic that uses Fey magic.",
                    situation: "An unusual situation that shouldn't be taken too seriously."
                },
                reversed_meaning: {
                    person: "A gloomy person with no sense of humor, or a person who uses shadow-based magic.",
                    creature_or_trap: "A creature from the Shadowfell or one transformed by shadow energy (such as a shadow dragon).",
                    place: "A place in the Shadowfell, somewhere that allows passage to the Shadowfell, or a location where Shadow magic is active.",
                    treasure: "An art object depicting the Shadowfell or magic that uses Shadow magic.",
                    situation: "A gloomy situation that offers little hope of success or escape."
                }
            },
            {
                title: "FLAMES",
                upright_meaning: {
                    person: "A person carrying a bitter, possibly violent, judgment of those involved, or someone's thirst for revenge.",
                    creature_or_trap: "A vengeful Undead (such as a ghost or revenant) or a creature dedicated to pursuing designated prey (such as an invisible stalker).",
                    place: "A place of bloodshed, or a place with a connection to the Lower Planes.",
                    treasure: "A treasure that has been the subject of intense discord or rivalry, or a magic item originating on the Lower Planes.",
                    situation: "A conflict motivated by deep-seated enmity that clouds the judgment of those involved."
                },
                reversed_meaning: {
                    person: "A person who is being hunted or persecuted unjustly.",
                    creature_or_trap: "A creature fleeing from a larger or more dangerous foe.",
                    place: "A place of sanctuary for refugees and fugitives.",
                    treasure: "A treasure symbolizing or commemorating the end of a feud or war, or a magic item that can charm or calm creatures (such as a Rod of Rulership).",
                    situation: "Unjust persecution or prejudicial hatred."
                }
            },
            {
                title: "GEM",
                upright_meaning: {
                    person: "Someone who inherited wealth or whose wealth is the result of good fortune.",
                    creature_or_trap: "A creature connected with wealth, such as a Dragon or xorn, or a treasure hoard.",
                    place: "A mine or a treasure vault.",
                    treasure: "A valuable treasure or a magical gem.",
                    situation: "A situation driven by greed, such as sibling rivalry, inheritance, or someone hunting for a lost treasure."
                },
                reversed_meaning: {
                    person: "A person who has lost wealth or power through a stroke of bad luck.",
                    creature_or_trap: "A trap or creature that uses the appearance of treasure as bait, such as a mimic.",
                    place: "A place associated with poverty, such as a tenement or slum.",
                    treasure: "An item that appears valuable but isn't, or a magic item with a curse.",
                    situation: "A situation stemming from the loss of wealth, such as a person trying to recover money given to a con artist or stolen by a thief."
                }
            },
            {
                title: "HUMANOID",
                upright_meaning: {
                    person: "An empathetic person who's deeply concerned about the suffering of others.",
                    creature_or_trap: "A shape-shifter that takes on Humanoid appearance to prey on others or learn from them, or to influence them for their good.",
                    place: "A place where diverse people live together in harmony.",
                    treasure: "A treasure representing the collaboration of different artisans (such as a finely cut gem set in exquisite jewelry), or a magic item that facilitates cooperation.",
                    situation: "A situation that calls for empathy and compassion, if it is to be resolved without violence."
                },
                reversed_meaning: {
                    person: "Someone who feels no empathy for others.",
                    creature_or_trap: "A shape-shifter that takes on Humanoid appearance to prey on others.",
                    place: "A place where people live apart from others, by choice or by force (such as a monastery or a cultural retreat).",
                    treasure: "An art object depicting or celebrating war, alternatively, a magic item made to be used in war, or that is especially useful against Humanoids.",
                    situation: "A violent situation arising from a lack of empathy."
                }
            },
            {
                title: "KEY",
                upright_meaning: {
                    person: "A person with the skills or tools needed to solve the current problem.",
                    creature_or_trap: "A creature that preys on the party's weaknesses, or a trap that can be disarmed only with a key.",
                    place: "A place through which only certain people are allowed to pass, or where a key is required.",
                    treasure: "A magic item needed to overcome an obstacle or defeat an enemy, or the means to unlock a treasure (such as a Chime of Opening).",
                    situation: "A situation that can be resolved successfully only by taking a specific action."
                },
                reversed_meaning: {
                    person: "A person ill equipped for the challenges they face.",
                    creature_or_trap: "A creature with vulnerabilities, or a trap that's bizarrely complex.",
                    place: "An open and easily accessed place.",
                    treasure: "A treasure in a locked container, or magic that slows creatures.",
                    situation: "A situation that can be successfully resolved in many ways."
                }
            },
            {
                title: "LANCE",
                upright_meaning: {
                    person: "A surgeon, or someone (such as a guard or soldier) who uses violence in pursuit of worthy societal goals.",
                    creature_or_trap: "A creature trained to fight alongside guards or soldiers.",
                    place: "A place where surgery is performed.",
                    treasure: "A treasure made at great cost, or a magic weapon.",
                    situation: "A situation in which additional pain is required to bring healing."
                },
                reversed_meaning: {
                    person: "A person committed to pacifism or avoiding harm.",
                    creature_or_trap: "A creature uninterested in fighting or a trap that restrains but doesn't cause damage.",
                    place: "A place where violence is forbidden.",
                    treasure: "A treasure celebrating the end of hostilities or the ideal of peace, or a magic item intended to prevent or end conflict.",
                    situation: "A situation complicated by people avoiding any hint of conflict."
                }
            },
            {
                title: "MAP",
                upright_meaning: {
                    person: "A person who acts as a guide, showing the way forward.",
                    creature_or_trap: "A creature that tracks by scent.",
                    place: "A path or road.",
                    treasure: "A valuable map (perhaps a jeweled globe or rare atlas), or a magic item that provides direction.",
                    situation: "A situation best navigated with a guide."
                },
                reversed_meaning: {
                    person: "Someone who tries to lead you on the wrong path.",
                    creature_or_trap: "A creature (such as a will-o'-wisp) that leads travelers astray.",
                    place: "A demiplane or similar place that can't be found on maps, or a location hidden behind a secret door.",
                    treasure: "A treasure from another plane of existence, or a magic item that creates or accesses an extradimensional space (like a Portable Hole).",
                    situation: "No guide or direction is available."
                }
            },
            {
                title: "MINE",
                upright_meaning: {
                    person: "A miner or an archaeologist.",
                    creature_or_trap: "A creature that burrows underground, especially one that delves into the earth in search of prey (such as a giant weasel).",
                    place: "A mine, an archaeological dig, or a similar excavated site.",
                    treasure: "A treasure from the earth, such as metal ore or gems, or any treasure that has been buried.",
                    situation: "Something unearthed that should have remained buried."
                },
                reversed_meaning: {
                    person: "Someone who places things in the earth, such as a gardener or an undertaker.",
                    creature_or_trap: "A creature that lives underground but hunts above ground (such as an ankheg or a bulette).",
                    place: "A place that has sunk into the earth, perhaps swallowed in a sinkhole or covered in a mudslide.",
                    treasure: "A treasure buried in the earth.",
                    situation: "The retrieval of something buried."
                }
            },
            {
                title: "MOON",
                upright_meaning: {
                    person: "Someone whose fine qualities are masked by one annoying trait.",
                    creature_or_trap: "A lycanthrope, or a creature that appears to be an inanimate object until it strikes (such as a gargoyle).",
                    place: "A secret chamber, or a place concealed by terrain; alternatively, a place larger or more elaborate on the inside than it seems from outside.",
                    treasure: "A treasure whose value isn't immediately apparent, or a magic item that appears to be a mundane object.",
                    situation: "A problem that requires investigation and is more complicated than it appears."
                },
                reversed_meaning: {
                    person: "A person who seems competent but bungles everything they attempt.",
                    creature_or_trap: "A creature that uses its fearsome appearance to frighten away others because it is too weak to fight.",
                    place: "A place with an impressive exterior but a dingy, poorly maintained interior.",
                    treasure: "A treasure that seems more valuable than it is, perhaps an ordinary item that falsely appears magical.",
                    situation: "A situation that seems—and is—too good to be true."
                }
            },
            {
                title: "PATH",
                upright_meaning: {
                    person: "A goal-oriented person who knows exactly what they want and has a clear plan to get it.",
                    creature_or_trap: "A single-minded predator pursuing prey, or something deadly acting on instinct or purpose; it might be a trapped room navigable by only a single path.",
                    place: "A road or trail.",
                    treasure: "An art object depicting a road or path.",
                    situation: "A situation that demands unwavering focus on the goal."
                },
                reversed_meaning: {
                    person: "An aimless person who doesn't know what they want and has no idea how to decide.",
                    creature_or_trap: "A creature that reacts to provocation without a plan or purpose.",
                    place: "A trackless wilderness or an underground complex that is very difficult to traverse.",
                    treasure: "An abstract art object, or a magic item that foils divination (such as an Amulet of Proof against Detection and Location).",
                    situation: "A series of distractions that deflect attention from an important goal."
                }
            },
            {
                title: "PLANT",
                upright_meaning: {
                    person: "A person who lives in the wilderness among trees and other growing things.",
                    creature_or_trap: "A plant creature, a creature that affects the growth of plants, or an awakened tree or shrub.",
                    place: "A verdant place where vegetation grows wild, untouched by people's hands.",
                    treasure: "An art object crafted from wood or incorporating leaves; alternatively, a magic item that allows uncontrolled vegetation growth (such as a Bag of Beans).",
                    situation: "Something growing out of control with surprising, even supernatural speed."
                },
                reversed_meaning: {
                    person: "A quiet person who enjoys gardening or farming, finding greenery more relatable than people.",
                    creature_or_trap: "A domesticated plant given artificial animation, such as an awakened tree or shrub.",
                    place: "A place full of carefully pruned and neatly controlled vegetation, such as a topiary garden.",
                    treasure: "A treasure that incorporates living greenery, such as an ornate terrarium, or a magic item that controls vegetation growth (such as a Staff of the Woodlands).",
                    situation: "A conflict between a region suffering a famine and a region with abundant crops."
                }
            },
            {
                title: "PRISONER",
                upright_meaning: {
                    person: "A person held captive or bound by expectations.",
                    creature_or_trap: "A creature locked away to prevent it from harming people.",
                    place: "A place where things are put to keep them out of reach and memory, such as a securely locked area or a jail.",
                    treasure: "A treasure stored in a locked container, or a magic item that contains a creature (such as an Elemental Gem or an Iron Flask).",
                    situation: "A situation arising from efforts to keep a person, an object, or information out of reach."
                },
                reversed_meaning: {
                    person: "An individual who defies societal norms and expectations.",
                    creature_or_trap: "A creature that grapples, swallows, or otherwise binds or imprisons its prey.",
                    place: "A place where something or someone is kept on public display.",
                    treasure: "A prominently displayed treasure, such as a ruler's regalia.",
                    situation: "The theft or liberation of a person, or an object on public display."
                }
            },
            {
                title: "RING",
                upright_meaning: {
                    person: "Someone scrupulously faithful to a promise.",
                    creature_or_trap: "A creature that has promised to serve someone.",
                    place: "A place where oaths are sworn, such as a temple or courthouse.",
                    treasure: "A ring, either jewelry or a magic item.",
                    situation: "A situation complicated by a person's promise to do something."
                },
                reversed_meaning: {
                    person: "A person who resents being bound to an oath sworn in haste or duress.",
                    creature_or_trap: "A creature unwillingly bound to serve someone (such as an invisible stalker).",
                    place: "A place where a legendary figure was coerced into swearing an oath that led to their downfall.",
                    treasure: "A bracelet or magic bracers.",
                    situation: "A situation arising from someone trying to abjure an oath."
                }
            },
            {
                title: "RUIN",
                upright_meaning: {
                    person: "A person who has renounced material attachments, such as a religious ascetic.",
                    creature_or_trap: "A creature that destroys equipment, such as a rust monster or a black pudding.",
                    place: "A ruin, or a retreat for ascetics.",
                    treasure: "A treasure that is broken or in disrepair.",
                    situation: "A situation involving the decay of objects or relationships over a long period of time."
                },
                reversed_meaning: {
                    person: "A person excessively attached to material goods (not necessarily excessive wealth).",
                    creature_or_trap: "A Construct, especially an animated object.",
                    place: "A place meant to store goods, such as a warehouse or an armory.",
                    treasure: "Valuable trade goods, well-made equipment, or a deed to property.",
                    situation: "A situation involving the production or transportation of goods for sale."
                }
            },
            {
                title: "SHIELD",
                upright_meaning: {
                    person: "A protective parent or sibling, or a professional protector such as a sentry or guard.",
                    creature_or_trap: "A creature that protects others, such as a watchdog or shield guardian, or a warding trap designed to repel invaders.",
                    place: "A defensive structure, such as a fortress or a wall.",
                    treasure: "A suit of armor that is valuable or magical.",
                    situation: "Someone who must protect those who can't protect themselves."
                },
                reversed_meaning: {
                    person: "A guarded person who carefully shields themself from physical or emotional harm.",
                    creature_or_trap: "A heavily armored creature.",
                    place: "A hermitage or retreat meant to isolate one person from others.",
                    treasure: "A suit of armor that is valuable but impractical.",
                    situation: "A situation arising from someone selfishly protecting themself without heed to others."
                }
            },
            {
                title: "SKULL",
                upright_meaning: {
                    person: "A person facing imminent death, or one who wields necromantic power.",
                    creature_or_trap: "An Undead creature, or a trap that deals necrotic damage.",
                    place: "A place of solitude and isolation, or a place where someone died recently.",
                    treasure: "A treasure associated with death (perhaps funerary implements), or a magic item with necromantic power.",
                    situation: "A person's life in peril."
                },
                reversed_meaning: {
                    person: "Someone haunted by the inevitability of death and seeking to escape it, or a person who has returned from death.",
                    creature_or_trap: "An immortal creature or one that doesn't age, such as an angel, a Fiend, or a naga.",
                    place: "A graveyard or another place where the dead are gathered.",
                    treasure: "An art object that celebrates or depicts deliverance from death, or a magic item that wards off death (such as a Periapt of Wound Closure or a Scarab of Protection).",
                    situation: "Many lives at stake."
                }
            },
            {
                title: "STAIRWAY",
                upright_meaning: {
                    person: "A person who makes every task more difficult than it needs to be, adding complications and getting in the way.",
                    creature_or_trap: "A creature that grows in power as battle continues (such as a black pudding or a hydra).",
                    place: "A place reached by descending stairs, such as a basement or a lower level of a dungeon.",
                    treasure: "An intricate treasure that was difficult to create, or a magic item that helps accomplish difficult tasks (such as an Ioun Stone of Mastery).",
                    situation: "A situation more complicated or challenging than it appears."
                },
                reversed_meaning: {
                    person: "A helpful, friendly person who makes everything easier (or at least more pleasant).",
                    creature_or_trap: "A creature that is difficult to fight at first but becomes easier to defeat as the battle proceeds.",
                    place: "A place reached by ascending stairs, such as an attic or upper level of a dungeon.",
                    treasure: "A treasure that is simple and elegant.",
                    situation: "A situation much simpler than it appears."
                }
            },
            {
                title: "STATUE",
                upright_meaning: {
                    person: "Someone who takes great pride in a prominent ancestor.",
                    creature_or_trap: "An ancient creature that played an important part in a historical event.",
                    place: "A park or plaza built around a statue.",
                    treasure: "A statuette or sculpture, either valuable or magical (such as a Figurine of Wondrous Power).",
                    situation: "A situation with remarkable similarities to a significant historical event."
                },
                reversed_meaning: {
                    person: "A person who lives in the shadow of a famous or important ancestor.",
                    creature_or_trap: "A creature that clings to a memory of fallen glory (such as a storm giant or a mind flayer), or a creature in the guise of a statue (such as a mimic), or a statue that functions as a trap.",
                    place: "An immense ruin left behind by an ancient civilization.",
                    treasure: "An art object made in imitation of a more famous and valuable piece.",
                    situation: "An attempt to re-create a historical situation or rebuild a fallen empire."
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
        
        // Convert abbreviated stats to full names
        const statMap = {
            'str': 'strength',
            'dex': 'dexterity', 
            'con': 'constitution',
            'int': 'intelligence',
            'wis': 'wisdom',
            'cha': 'charisma'
        };
        
        const primaryStatFull = statMap[primaryStat];
        const secondaryStatFull = statMap[secondaryStat];
        const dumpStatFull = statMap[dumpStat];
        
        const statNames = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
        const stats = {};
        
        // Roll base stats
        statNames.forEach(stat => {
            stats[stat] = this.roll3d6();
        });
        
        // Apply minimums first
        stats[primaryStatFull] = Math.max(stats[primaryStatFull], 13);
        stats[secondaryStatFull] = Math.max(stats[secondaryStatFull], 9);
        stats[dumpStatFull] = Math.max(stats[dumpStatFull], 3);
        
        statNames.forEach(stat => {
            if (stat !== primaryStatFull && stat !== secondaryStatFull && stat !== dumpStatFull) {
                stats[stat] = Math.max(stats[stat], 6);
            }
        });
        
        // Add +1 to primary and secondary after minimums
        stats[primaryStatFull] += 1;
        stats[secondaryStatFull] += 1;
        
        return { stats, primaryStat, secondaryStat, dumpStat };
    }
    
    generatePlayerStats() {
        const primaryStat = this.weightedChoice(this.statDistribution).toLowerCase();
        const mapping = this.primaryStatMapping[primaryStat];
        const secondaryStat = mapping.secondary;
        const dumpStat = mapping.dump;
        
        // Convert abbreviated stats to full names
        const statMap = {
            'str': 'strength',
            'dex': 'dexterity', 
            'con': 'constitution',
            'int': 'intelligence',
            'wis': 'wisdom',
            'cha': 'charisma'
        };
        
        const primaryStatFull = statMap[primaryStat];
        const secondaryStatFull = statMap[secondaryStat];
        const dumpStatFull = statMap[dumpStat];
        
        const statNames = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
        const stats = {};
        
        // Roll base stats (4d6 keep highest 3)
        statNames.forEach(stat => {
            stats[stat] = this.roll4d6KeepHighest3();
        });
        
        // Determine tertiary stat (highest remaining after primary, secondary, dump)
        const remaining = statNames.filter(s => s !== primaryStatFull && s !== secondaryStatFull && s !== dumpStatFull);
        const tertiaryStat = remaining.reduce((max, stat) => stats[stat] > stats[max] ? stat : max);
        
        // Apply player minimums
        stats[primaryStatFull] = Math.max(stats[primaryStatFull], 15);
        stats[secondaryStatFull] = Math.max(stats[secondaryStatFull], 14);
        stats[tertiaryStat] = Math.max(stats[tertiaryStat], 13);
        stats[dumpStatFull] = Math.max(stats[dumpStatFull], 3);
        
        statNames.forEach(stat => {
            if (stat !== primaryStatFull && stat !== secondaryStatFull && stat !== tertiaryStat && stat !== dumpStatFull) {
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
        // Step 1: Determine class type based on primary stat
        let classType;
        if (this.mentalStats.includes(primaryStat)) {
            // Mental stats: use weighted class type distribution
            classType = this.weightedChoice(this.classTypeDistribution);
        } else {
            // Physical stats: always Blunt
            classType = 'Blunt';
        }
        
        // Step 2: Get class data for this type and primary stat
        const classData = this.classesData[classType][primaryStat];
        if (!classData) {
            // Fallback to basic Fighter if no data found
            return { type: 'Blunt', name: 'Fighter', subclass: 'Champion' };
        }
        
        // Step 3: Randomly select class and subclass
        const className = classData.classes[Math.floor(Math.random() * classData.classes.length)];
        const subclass = classData.subclasses[Math.floor(Math.random() * classData.subclasses.length)];
        
        return {
            type: classType,
            name: className,
            subclass: subclass
        };
    }
    
    generateVowelName(usedVowels = new Set()) {
        // Complete vowel names from vowel_names.csv
        const vowelNames = {
            'A': ['Abel', 'Abraham', 'Achilleus', 'Adalbert', 'Adela', 'Adelheid', 'Adrian', 'Aegidius', 'Agatha', 'Agnes', 'Agrippa', 'Alaric', 'Albert', 'Alcuin', 'Aldous', 'Aleida', 'Alessio', 'Alexios', 'Alfonso', 'Alistair', 'Alphonse', 'Amalric', 'Ambrose', 'Amina', 'Ammon', 'Amos', 'Anselm', 'Anshel', 'Anton', 'Antonia', 'Anubis', 'Apollonia', 'Aramis', 'Arbogast', 'Arend', 'Ariadne', 'Arminius', 'Arnulf', 'Arsenius', 'Arthur', 'Ascanio', 'Ashur', 'Aspasia', 'Astolfo', 'Athanasius', 'Atreus', 'Attila', 'Aubert', 'Augustine', 'Aurelian'],
            'E': ['Ebba', 'Ebenezer', 'Eberhard', 'Eckhart', 'Edgar', 'Edmund', 'Edric', 'Edward', 'Egbert', 'Ehrenfried', 'Elanor', 'Elias', 'Elijah', 'Elinor', 'Elisabeth', 'Eliza', 'Elleonor', 'Eloi', 'Eloise', 'Elvira', 'Emeric', 'Emilian', 'Emma', 'Erasmus', 'Erhard', 'Eric', 'Erland', 'Ernest', 'Erwin', 'Esau', 'Esmeralda', 'Esther', 'Etienne', 'Eudo', 'Eugenia', 'Eulalia', 'Euphemia', 'Euripides', 'Eusebius', 'Eva', 'Evangeline', 'Everard', 'Ewald', 'Ewan', 'Exuperius', 'Eystein', 'Ezio', 'Ezra', 'Ezron', 'Ezzelin'],
            'I': ['Iacobus', 'Iago', 'Ianus', 'Iason', 'Ignatius', 'Igor', 'Ilaria', 'Ildefonso', 'Ilias', 'Ilse', 'Immanuel', 'Imogen', 'Ingmar', 'Ingo', 'Inocencio', 'Ioan', 'Ioanna', 'Ioannes', 'Ioel', 'Ion', 'Ippolito', 'Irene', 'Irina', 'Irnerius', 'Isaak', 'Isabel', 'Isabella', 'Isabeau', 'Isadora', 'Isambard', 'Isandro', 'Isarn', 'Ishmael', 'Isidore', 'Iskander', 'Isolde', 'Itherius', 'Ithiel', 'Ivan', 'Ivane', 'Ivanna', 'Ivar', 'Ivo', 'Ivonette', 'Ivonne', 'Iwein', 'Izsak', 'Izydor', 'Izyaslav', 'Izolda'],
            'O': ['Obadiah', 'Octavia', 'Octavian', 'Oda', 'Oddmund', 'Odette', 'Odile', 'Odilo', 'Odo', 'Odovacar', 'Oengus', 'Olaf', 'Olav', 'Oleksiy', 'Oliver', 'Olivier', 'Olwen', 'Omar', 'Omer', 'Onesimus', 'Onfroi', 'Onuphrius', 'Ophelia', 'Origen', 'Orin', 'Orlando', 'Orm', 'Ormond', 'Orpheus', 'Orsola', 'Osbert', 'Osborn', 'Oscar', 'Oskar', 'Osmaer', 'Osmund', 'Osric', 'Oswald', 'Oswin', 'Ottilia', 'Otto', 'Ovid', 'Owein', 'Owyn', 'Ozias', 'Oziel', 'Oznat', 'Ozymandias', 'Ozyas', 'Ozer'],
            'U': ['Ubaldo', 'Ubertino', 'Udo', 'Ugo', 'Uhtred', 'Ulbrecht', 'Ulfric', 'Ulf', 'Ulfhild', 'Uliana', 'Ulises', 'Ulman', 'Ulmo', 'Ulrich', 'Ultan', 'Ulyana', 'Umar', 'Umberto', 'Umi', 'Unai', 'Uncas', 'Undine', 'Unger', 'Unni', 'Urbain', 'Urban', 'Urbanus', 'Uriah', 'Urias', 'Urien', 'Ursella', 'Ursula', 'Urszula', 'Ursus', 'Urte', 'Urzica', 'Usama', 'Usher', 'Uskald', 'Ustinya', 'Uta', 'Utku', 'Uther', 'Uto', 'Utta', 'Uvaldo', 'Uzair', 'Uzi', 'Uziel', 'Uzziah']
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
        // Convert abbreviated stats to full names
        const statMap = {
            'str': 'Strength',
            'dex': 'Dexterity', 
            'con': 'Constitution',
            'int': 'Intelligence',
            'wis': 'Wisdom',
            'cha': 'Charisma'
        };
        
        const targetStat = Math.random() < 0.75 ? primaryStat : secondaryStat;
        const mapped = statMap[targetStat] || this.capitalizeFirst(targetStat);
        
        const matchingBgs = this.backgrounds.filter(bg => 
            bg.primary === mapped || bg.tertiary === mapped
        );
        
        if (matchingBgs.length > 0) {
            return matchingBgs[Math.floor(Math.random() * matchingBgs.length)].name;
        }
        
        return this.backgrounds[Math.floor(Math.random() * this.backgrounds.length)].name;
    }
    
    generateTraits() {
        // Generate 2-4 traits total, must have at least 1 virtue and 1 vice
        const traitCount = Math.floor(Math.random() * 3) + 2; // 2, 3, or 4 traits
        const traits = [];
        const usedTraits = new Set();
        
        // Ensure at least 1 virtue
        let virtue = this.virtues[Math.floor(Math.random() * this.virtues.length)];
        traits.push(virtue);
        usedTraits.add(virtue);
        
        // Ensure at least 1 vice
        let vice = this.vices[Math.floor(Math.random() * this.vices.length)];
        traits.push(vice);
        usedTraits.add(vice);
        
        // Fill remaining slots with random virtues or vices, avoiding duplicates
        while (traits.length < traitCount) {
            const allTraits = [...this.virtues, ...this.vices];
            const availableTraits = allTraits.filter(trait => !usedTraits.has(trait));
            
            if (availableTraits.length === 0) break; // No more unique traits available
            
            const randomTrait = availableTraits[Math.floor(Math.random() * availableTraits.length)];
            traits.push(randomTrait);
            usedTraits.add(randomTrait);
        }
        
        return traits;
    }
    
    generateOriginFeats(species, primaryStat, isPlayer = false) {
        // Convert abbreviated stats to full names
        const statMap = {
            'str': 'Strength',
            'dex': 'Dexterity', 
            'con': 'Constitution',
            'int': 'Intelligence',
            'wis': 'Wisdom',
            'cha': 'Charisma'
        };
        
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
                const mapped = statMap[primaryStat] || this.capitalizeFirst(primaryStat);
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