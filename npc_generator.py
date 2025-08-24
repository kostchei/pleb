import csv
import json
import random
import sqlite3
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass


@dataclass
class NPC:
    name: str
    level: int
    strength: int
    dexterity: int
    constitution: int
    intelligence: int
    wisdom: int
    charisma: int
    primary_stat: str
    class_type: Optional[str]
    class_name: Optional[str]
    subclass: Optional[str]
    species: str
    background: str
    traits: List[str]
    origin_feats: List[str]


class NPCGenerator:
    def __init__(self, db_path: str = "npcs.db", classes_file: str = "classes.json"):
        self.db_path = db_path
        self.classes_data = self._load_classes_data(classes_file)
        self._setup_database()
        self._migrate_csv_to_db()
        self.level_distribution = self._load_distribution_from_db("level_distribution", "level")
        self.class_distribution = self._load_distribution_from_db("class_type_distribution", "class_type")
        self.species_distribution = self._load_distribution_from_db("species_distribution", "species")
        self.stat_distribution = self._load_distribution_from_db("stat_distribution", "stat")
        self.primary_stat_mapping = self._load_primary_stat_mapping()
    
    def _load_distribution_from_db(self, table_name: str, value_column: str) -> List[Tuple[str, float]]:
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute(f"SELECT {value_column}, weight FROM {table_name}")
        distribution = [(str(row[0]), row[1]) for row in cursor.fetchall()]
        conn.close()
        return distribution
    
    def _load_primary_stat_mapping(self) -> Dict[str, Dict[str, str]]:
        """Load primary stat mappings from database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT primary_stat, secondary_stat, dump_stat FROM primary_stat_mapping")
        mapping = {}
        for row in cursor.fetchall():
            primary, secondary, dump = row
            mapping[primary.lower()] = {
                'secondary': secondary.lower(),
                'dump': dump.lower()
            }
        conn.close()
        return mapping
    
    def _load_classes_data(self, filename: str) -> Dict:
        with open(filename, 'r') as file:
            return json.load(file)
    
    def _weighted_choice(self, distribution: List[Tuple[str, float]]) -> str:
        total_weight = sum(weight for _, weight in distribution)
        random_value = random.uniform(0, total_weight)
        
        cumulative = 0
        for value, weight in distribution:
            cumulative += weight
            if random_value <= cumulative:
                return value
        return distribution[-1][0]
    
    def _roll_stats(self) -> Tuple[Dict[str, int], str, str, str]:
        """Roll stats using proper CSV-based assignment. Returns (stats, primary_stat, secondary_stat, dump_stat)"""
        def roll_3d6():
            return sum([random.randint(1, 6) for _ in range(3)])
        
        # Map CSV short names to full stat names
        csv_to_full_name = {
            'str': 'strength',
            'dex': 'dexterity', 
            'con': 'constitution',
            'int': 'intelligence',
            'wis': 'wisdom',
            'cha': 'charisma'
        }
        
        # Step 1: Determine primary stat from stat_distribution.csv
        primary_stat_csv = self._weighted_choice(self.stat_distribution).lower()
        primary_stat_key = csv_to_full_name.get(primary_stat_csv, primary_stat_csv)
        
        # Step 2: Get secondary and dump stats from primary_stat.csv mapping
        stat_mapping = self.primary_stat_mapping.get(primary_stat_csv)
        if not stat_mapping:
            # Fallback if mapping not found
            secondary_stat_key = 'wisdom'
            dump_stat_key = 'intelligence'
        else:
            secondary_stat_key = csv_to_full_name.get(stat_mapping['secondary'], stat_mapping['secondary'])
            dump_stat_key = csv_to_full_name.get(stat_mapping['dump'], stat_mapping['dump'])
        
        # Step 3: Roll base stats (3d6 each)
        base_stats = {
            'strength': roll_3d6(),
            'dexterity': roll_3d6(),
            'constitution': roll_3d6(),
            'intelligence': roll_3d6(),
            'wisdom': roll_3d6(),
            'charisma': roll_3d6()
        }
        
        # Step 4: Apply minimums to base rolls first
        minimums_applied = self._apply_stat_minimums_by_role(base_stats, primary_stat_key, secondary_stat_key, dump_stat_key)
        
        # Step 5: Add +1 to primary and secondary stats after minimums
        minimums_applied[primary_stat_key] += 1
        minimums_applied[secondary_stat_key] += 1
        
        final_stats = minimums_applied
        
        return final_stats, primary_stat_key, secondary_stat_key, dump_stat_key
    
    def _apply_stat_minimums_by_role(self, stats: Dict[str, int], primary_stat: str, secondary_stat: str, dump_stat: str) -> Dict[str, int]:
        """Apply minimums based on assigned roles from CSV, not rolled values"""
        final_stats = {}
        for stat_name, value in stats.items():
            if stat_name == primary_stat:
                final_stats[stat_name] = max(value, 13)  # Primary minimum 13
            elif stat_name == secondary_stat:
                final_stats[stat_name] = max(value, 9)   # Secondary minimum 9
            elif stat_name == dump_stat:
                final_stats[stat_name] = max(value, 3)   # Dump minimum 3
            else:
                final_stats[stat_name] = max(value, 6)   # Others minimum 6
        
        return final_stats
    
    def _roll_player_stats(self, chosen_species: str = None) -> Tuple[Dict[str, int], str, str, str]:
        """Roll player stats with different rules: 4d6 keep highest 3, higher minimums, random +1 distribution"""
        def roll_4d6_keep_3():
            rolls = [random.randint(1, 6) for _ in range(4)]
            rolls.sort(reverse=True)
            return sum(rolls[:3])
        
        # Map CSV short names to full stat names
        csv_to_full_name = {
            'str': 'strength',
            'dex': 'dexterity', 
            'con': 'constitution',
            'int': 'intelligence',
            'wis': 'wisdom',
            'cha': 'charisma'
        }
        
        # Step 1: Determine primary stat from stat_distribution.csv
        primary_stat_csv = self._weighted_choice(self.stat_distribution).lower()
        primary_stat_key = csv_to_full_name.get(primary_stat_csv, primary_stat_csv)
        
        # Step 2: Get secondary and dump stats from primary_stat.csv mapping
        stat_mapping = self.primary_stat_mapping.get(primary_stat_csv)
        if not stat_mapping:
            secondary_stat_key = 'wisdom'
            dump_stat_key = 'intelligence'
        else:
            secondary_stat_key = csv_to_full_name.get(stat_mapping['secondary'], stat_mapping['secondary'])
            dump_stat_key = csv_to_full_name.get(stat_mapping['dump'], stat_mapping['dump'])
        
        # Step 3: Roll base stats (4d6 keep highest 3)
        base_stats = {
            'strength': roll_4d6_keep_3(),
            'dexterity': roll_4d6_keep_3(),
            'constitution': roll_4d6_keep_3(),
            'intelligence': roll_4d6_keep_3(),
            'wisdom': roll_4d6_keep_3(),
            'charisma': roll_4d6_keep_3()
        }
        
        # Step 4: Determine tertiary stat (highest remaining stat after primary, secondary, dump)
        remaining_stats = [stat for stat in base_stats.keys() if stat not in [primary_stat_key, secondary_stat_key, dump_stat_key]]
        sorted_remaining = sorted(remaining_stats, key=lambda x: base_stats[x], reverse=True)
        tertiary_stat_key = sorted_remaining[0]
        
        # Step 5: Apply player minimums (Primary 15, Secondary 14, Tertiary 13, others 6, dump 3)
        minimums_applied = self._apply_player_stat_minimums(base_stats, primary_stat_key, secondary_stat_key, tertiary_stat_key, dump_stat_key)
        
        # Step 6: Add random +1 bonuses (3 times, max +2 to any stat)
        final_stats = self._apply_random_bonuses(minimums_applied)
        
        return final_stats, primary_stat_key, secondary_stat_key, dump_stat_key
    
    def _apply_player_stat_minimums(self, stats: Dict[str, int], primary_stat: str, secondary_stat: str, tertiary_stat: str, dump_stat: str) -> Dict[str, int]:
        """Apply player minimums: Primary 15, Secondary 14, Tertiary 13, others 6, dump 3"""
        final_stats = {}
        for stat_name, value in stats.items():
            if stat_name == primary_stat:
                final_stats[stat_name] = max(value, 15)  # Primary minimum 15
            elif stat_name == secondary_stat:
                final_stats[stat_name] = max(value, 14)  # Secondary minimum 14
            elif stat_name == tertiary_stat:
                final_stats[stat_name] = max(value, 13)  # Tertiary minimum 13
            elif stat_name == dump_stat:
                final_stats[stat_name] = max(value, 3)   # Dump minimum 3
            else:
                final_stats[stat_name] = max(value, 6)   # Others minimum 6
        
        return final_stats
    
    def _apply_random_bonuses(self, stats: Dict[str, int]) -> Dict[str, int]:
        """Apply 3 random +1 bonuses, max +2 to any single stat"""
        final_stats = stats.copy()
        bonus_count = {stat: 0 for stat in stats.keys()}
        
        for _ in range(3):
            # Get stats that haven't reached the +2 limit
            available_stats = [stat for stat, count in bonus_count.items() if count < 2]
            if available_stats:
                chosen_stat = random.choice(available_stats)
                final_stats[chosen_stat] += 1
                bonus_count[chosen_stat] += 1
        
        return final_stats
    
    def _get_background_by_stats(self, primary_stat: str, secondary_stat: str) -> str:
        """Get a random background based on primary (75%) or secondary (25%) stat"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Map full stat names to the format used in backgrounds.csv
        stat_mapping = {
            'strength': 'Strength',
            'dexterity': 'Dexterity', 
            'constitution': 'Constitution',
            'intelligence': 'Intelligence',
            'wisdom': 'Wisdom',
            'charisma': 'Charisma'
        }
        
        # 75% chance to use primary stat, 25% chance to use secondary stat
        use_primary = random.random() < 0.75
        target_stat = primary_stat if use_primary else secondary_stat
        mapped_stat = stat_mapping.get(target_stat.lower(), target_stat.title())
        
        if use_primary:
            cursor.execute("SELECT background FROM backgrounds WHERE primary_stat = ?", (mapped_stat,))
        else:
            cursor.execute("SELECT background FROM backgrounds WHERE primary_stat = ? OR tertiary_stat = ?", (mapped_stat, mapped_stat))
        
        backgrounds = [row[0] for row in cursor.fetchall()]
        conn.close()
        
        if backgrounds:
            return random.choice(backgrounds)
        else:
            # Fallback: try the other stat if no match found
            other_stat = secondary_stat if use_primary else primary_stat
            mapped_other = stat_mapping.get(other_stat.lower(), other_stat.title())
            
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT background FROM backgrounds WHERE primary_stat = ? OR tertiary_stat = ?", (mapped_other, mapped_other))
            
            backgrounds = [row[0] for row in cursor.fetchall()]
            conn.close()
            
            return random.choice(backgrounds) if backgrounds else "Commoner"
    
    def _determine_primary_stat(self, stats: Dict[str, int]) -> str:
        return max(stats, key=stats.get)
    
    def _determine_class_info(self, primary_stat: str) -> Tuple[Optional[str], Optional[str], Optional[str]]:
        """Returns (class_type, class_name, subclass) tuple"""
        stat_mapping = {
            'strength': 'Str',
            'dexterity': 'Dex', 
            'constitution': 'Con',
            'intelligence': 'Int',
            'wisdom': 'Wis',
            'charisma': 'Cha'
        }
        
        mapped_stat = stat_mapping.get(primary_stat.lower())
        if not mapped_stat:
            return None, None, None
            
        if primary_stat.lower() in ['intelligence', 'wisdom', 'charisma']:
            class_type = self._weighted_choice(self.class_distribution)
            
            if class_type and class_type.lower() == 'blunt':
                if 'Blunt' in self.classes_data and mapped_stat in self.classes_data['Blunt']:
                    classes_list = self.classes_data['Blunt'][mapped_stat]['classes']
                    subclasses_list = self.classes_data['Blunt'][mapped_stat]['subclasses']
                    
                    class_name = random.choice(classes_list) if classes_list else None
                    subclass = random.choice(subclasses_list) if subclasses_list else None
                    
                    return class_type, class_name, subclass
            elif class_type and class_type.lower() in ['caster', 'semicaster']:
                type_key = 'Caster' if class_type.lower() == 'caster' else 'Semi Caster'
                if type_key in self.classes_data and mapped_stat in self.classes_data[type_key]:
                    classes_list = self.classes_data[type_key][mapped_stat]['classes']
                    subclasses_list = self.classes_data[type_key][mapped_stat]['subclasses']
                    
                    class_name = random.choice(classes_list) if classes_list else None
                    subclass = random.choice(subclasses_list) if subclasses_list else None
                    
                    return class_type, class_name, subclass
            
            return class_type, None, None
        else:
            if 'Blunt' in self.classes_data and mapped_stat in self.classes_data['Blunt']:
                classes_list = self.classes_data['Blunt'][mapped_stat]['classes']
                subclasses_list = self.classes_data['Blunt'][mapped_stat]['subclasses']
                
                class_name = random.choice(classes_list) if classes_list else None
                subclass = random.choice(subclasses_list) if subclasses_list else None
                
                return 'blunt', class_name, subclass
                
        return None, None, None
    
    def _setup_database(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create NPCs table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS npcs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                level INTEGER,
                strength INTEGER,
                dexterity INTEGER,
                constitution INTEGER,
                intelligence INTEGER,
                wisdom INTEGER,
                charisma INTEGER,
                primary_stat TEXT,
                class_type TEXT,
                class_name TEXT,
                subclass TEXT,
                species TEXT,
                background TEXT,
                traits TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Create distribution tables
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS level_distribution (
                level INTEGER PRIMARY KEY,
                weight REAL
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS class_type_distribution (
                class_type TEXT PRIMARY KEY,
                weight REAL
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS species_distribution (
                species TEXT PRIMARY KEY,
                weight REAL
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS backgrounds (
                background TEXT PRIMARY KEY,
                primary_stat TEXT,
                tertiary_stat TEXT
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS traits (
                virtue TEXT,
                vice TEXT
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS origin_feats (
                feat_name TEXT PRIMARY KEY,
                category TEXT,
                description TEXT,
                benefits TEXT,
                primary_stat TEXT
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS stat_distribution (
                stat TEXT PRIMARY KEY,
                weight REAL
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS primary_stat_mapping (
                primary_stat TEXT PRIMARY KEY,
                secondary_stat TEXT,
                dump_stat TEXT
            )
        ''')
        
        # Check if new columns exist and add them if they don't
        cursor.execute("PRAGMA table_info(npcs)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'class_name' not in columns:
            cursor.execute('ALTER TABLE npcs ADD COLUMN class_name TEXT')
        
        if 'subclass' not in columns:
            cursor.execute('ALTER TABLE npcs ADD COLUMN subclass TEXT')
        
        if 'background' not in columns:
            cursor.execute('ALTER TABLE npcs ADD COLUMN background TEXT')
        
        if 'name' not in columns:
            cursor.execute('ALTER TABLE npcs ADD COLUMN name TEXT')
        
        if 'traits' not in columns:
            cursor.execute('ALTER TABLE npcs ADD COLUMN traits TEXT')
        
        if 'origin_feats' not in columns:
            cursor.execute('ALTER TABLE npcs ADD COLUMN origin_feats TEXT')
        
        # Check if backgrounds table needs tertiary_stat column
        cursor.execute("PRAGMA table_info(backgrounds)")
        bg_columns = [column[1] for column in cursor.fetchall()]
        
        if 'tertiary_stat' not in bg_columns:
            cursor.execute('ALTER TABLE backgrounds ADD COLUMN tertiary_stat TEXT')
        
        # Drop old secondary_stat column if it exists (SQLite doesn't support DROP COLUMN easily, so we'll ignore it)
        
        conn.commit()
        conn.close()
    
    def _migrate_csv_to_db(self):
        """Migrate CSV data to database tables if they're empty"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Check if tables already have data
        cursor.execute("SELECT COUNT(*) FROM level_distribution")
        if cursor.fetchone()[0] == 0:
            # Migrate level distribution
            with open("character_level_distribution.csv", 'r') as file:
                reader = csv.reader(file)
                next(reader)  # Skip header
                for row in reader:
                    if len(row) >= 2 and row[0] and row[1]:
                        cursor.execute("INSERT INTO level_distribution (level, weight) VALUES (?, ?)", 
                                     (int(row[0]), float(row[1])))
        
        cursor.execute("SELECT COUNT(*) FROM class_type_distribution")
        if cursor.fetchone()[0] == 0:
            # Migrate class type distribution
            with open("class_type_distribution.csv", 'r') as file:
                reader = csv.reader(file)
                next(reader)  # Skip header
                for row in reader:
                    if len(row) >= 2 and row[0] and row[1]:
                        cursor.execute("INSERT INTO class_type_distribution (class_type, weight) VALUES (?, ?)", 
                                     (row[0], float(row[1])))
        
        cursor.execute("SELECT COUNT(*) FROM species_distribution")
        if cursor.fetchone()[0] == 0:
            # Migrate species distribution
            with open("species_distribution.csv", 'r') as file:
                reader = csv.reader(file)
                next(reader)  # Skip header
                for row in reader:
                    if len(row) >= 2 and row[0] and row[1]:
                        cursor.execute("INSERT INTO species_distribution (species, weight) VALUES (?, ?)", 
                                     (row[0], float(row[1])))
        
        # Always refresh backgrounds to get latest data
        cursor.execute("DELETE FROM backgrounds")  # Clear existing data
        # Migrate backgrounds
        with open("backgrounds.csv", 'r') as file:
            reader = csv.reader(file)
            next(reader)  # Skip header
            for row in reader:
                if len(row) >= 3 and row[0] and row[1] and row[2]:
                    cursor.execute("INSERT OR REPLACE INTO backgrounds (background, primary_stat, tertiary_stat) VALUES (?, ?, ?)", 
                                 (row[0], row[1], row[2]))
        
        cursor.execute("SELECT COUNT(*) FROM traits")
        if cursor.fetchone()[0] == 0:
            # Migrate traits
            with open("traits.csv", 'r') as file:
                reader = csv.reader(file)
                next(reader)  # Skip header
                for row in reader:
                    if len(row) >= 2 and row[0] and row[1]:
                        cursor.execute("INSERT INTO traits (virtue, vice) VALUES (?, ?)", 
                                     (row[0], row[1]))
        
        cursor.execute("SELECT COUNT(*) FROM origin_feats")
        if cursor.fetchone()[0] == 0:
            # Migrate origin feats
            with open("origin_feats.csv", 'r') as file:
                reader = csv.reader(file)
                next(reader)  # Skip header
                for row in reader:
                    if len(row) >= 5 and row[0] and row[1] and row[2] and row[3] and row[4]:
                        cursor.execute("INSERT INTO origin_feats (feat_name, category, description, benefits, primary_stat) VALUES (?, ?, ?, ?, ?)", 
                                     (row[0], row[1], row[2], row[3], row[4]))
        
        # Always refresh stat distribution to get latest data
        cursor.execute("DELETE FROM stat_distribution")
        with open("stat_distribution.csv", 'r') as file:
            reader = csv.reader(file)
            next(reader)  # Skip header
            for row in reader:
                if len(row) >= 2 and row[0] and row[1]:
                    cursor.execute("INSERT INTO stat_distribution (stat, weight) VALUES (?, ?)", 
                                 (row[0], float(row[1])))
        
        # Always refresh primary stat mapping to get latest data
        cursor.execute("DELETE FROM primary_stat_mapping")
        with open("primary_stat.csv", 'r') as file:
            reader = csv.reader(file)
            next(reader)  # Skip header
            for row in reader:
                if len(row) >= 3 and row[0] and row[1] and row[2]:
                    cursor.execute("INSERT INTO primary_stat_mapping (primary_stat, secondary_stat, dump_stat) VALUES (?, ?, ?)", 
                                 (row[0].strip(), row[1].strip(), row[2].strip()))
        
        conn.commit()
        conn.close()
    
    def _load_vowel_names(self) -> Dict[str, List[str]]:
        """Load names from vowel_names.csv grouped by vowel"""
        vowel_names = {'A': [], 'E': [], 'I': [], 'O': [], 'U': []}
        with open("vowel_names.csv", 'r') as file:
            reader = csv.reader(file)
            next(reader)  # Skip header
            for row in reader:
                if len(row) >= 2 and row[0] and row[1]:
                    vowel, name = row[0], row[1]
                    if vowel in vowel_names:
                        vowel_names[vowel].append(name)
        return vowel_names
    
    def _generate_cultural_name(self, culture: str) -> str:
        """Generate a name based on cultural syllables (simplified Python version)"""
        cultures = {
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
        }
        
        if culture not in cultures:
            return "Unknown"
        
        culture_data = cultures[culture]
        
        # 50% chance for preset name, 50% for generated
        if random.random() < 0.5 and culture_data['preset_names']:
            return random.choice(culture_data['preset_names'])
        
        # Generate name from syllables (assume 50/50 male/female for simplicity)
        is_male = random.random() < 0.5
        if is_male:
            start = random.choice(culture_data['male_starts'])
            end = random.choice(culture_data['male_ends'])
        else:
            start = random.choice(culture_data['female_starts'])  
            end = random.choice(culture_data['female_ends'])
        
        return start + end
    
    def _generate_vowel_name(self, used_vowels: set = None) -> Tuple[str, str]:
        """Generate a name from vowel_names.csv, avoiding already used vowels"""
        vowel_names = self._load_vowel_names()
        available_vowels = [v for v in vowel_names.keys() if used_vowels is None or v not in used_vowels]
        
        if not available_vowels:
            # If all vowels used, pick randomly
            available_vowels = list(vowel_names.keys())
        
        chosen_vowel = random.choice(available_vowels)
        name = random.choice(vowel_names[chosen_vowel])
        return name, chosen_vowel
    
    def _generate_traits(self) -> List[str]:
        """Generate 2-4 traits with at least 1 virtue and 1 vice"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT virtue, vice FROM traits")
        trait_pairs = cursor.fetchall()
        conn.close()
        
        if not trait_pairs:
            return ["Honest", "Deceitful"]  # Fallback if no traits in database
        
        # Collect all virtues and vices
        virtues = [pair[0] for pair in trait_pairs if pair[0]]
        vices = [pair[1] for pair in trait_pairs if pair[1]]
        
        # Determine total number of traits (2-4)
        total_traits = random.randint(2, 4)
        
        # Must have at least 1 virtue and 1 vice
        selected_traits = []
        
        # Always pick at least one virtue and one vice
        selected_traits.append(random.choice(virtues))
        selected_traits.append(random.choice(vices))
        
        # Fill remaining slots randomly
        remaining_slots = total_traits - 2
        all_available_traits = virtues + vices
        
        # Remove already selected traits to avoid duplicates
        available_traits = [trait for trait in all_available_traits if trait not in selected_traits]
        
        for _ in range(remaining_slots):
            if available_traits:
                selected_trait = random.choice(available_traits)
                selected_traits.append(selected_trait)
                available_traits.remove(selected_trait)
        
        return selected_traits
    
    def _generate_origin_feats(self, species: str, primary_stat: str) -> List[str]:
        """Generate origin feats: 50% chance for all plebs, humans get 2 separate 50% chances"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get all origin feats
        cursor.execute("SELECT feat_name, primary_stat FROM origin_feats")
        all_feats = cursor.fetchall()
        conn.close()
        
        if not all_feats:
            return []
        
        origin_feats = []
        
        # Determine number of rolls based on species
        if species.lower() == 'human':
            # Humans get 2 separate 50% chances
            rolls = 2
        else:
            # All other species get 1 50% chance
            rolls = 1
        
        for _ in range(rolls):
            # 50% chance to get an origin feat
            if random.random() < 0.5:
                # 50% chance it's random, 50% chance it relates to primary stat
                if random.random() < 0.5:
                    # Random feat
                    feat_name = random.choice([feat[0] for feat in all_feats])
                else:
                    # Primary stat related feat
                    # Map full stat names to the format used in origin_feats.csv
                    stat_mapping = {
                        'strength': 'Strength',
                        'dexterity': 'Dexterity', 
                        'constitution': 'Constitution',
                        'intelligence': 'Intelligence',
                        'wisdom': 'Wisdom',
                        'charisma': 'Charisma'
                    }
                    
                    mapped_stat = stat_mapping.get(primary_stat.lower(), primary_stat.title())
                    primary_stat_feats = [feat[0] for feat in all_feats if feat[1] == mapped_stat]
                    
                    if primary_stat_feats:
                        feat_name = random.choice(primary_stat_feats)
                    else:
                        # Fallback to random if no primary stat feats found
                        feat_name = random.choice([feat[0] for feat in all_feats])
                
                # Avoid duplicates
                if feat_name not in origin_feats:
                    origin_feats.append(feat_name)
        
        return origin_feats
    
    def _generate_player_origin_feats(self, species: str, primary_stat: str) -> List[str]:
        """Generate player origin feats: 1 guaranteed, 2 if human (50% random, 50% primary stat related)"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get all origin feats
        cursor.execute("SELECT feat_name, primary_stat FROM origin_feats")
        all_feats = cursor.fetchall()
        conn.close()
        
        if not all_feats:
            return []
        
        origin_feats = []
        
        # Determine number of feats based on species
        if species.lower() == 'human':
            # Humans get 2 guaranteed feats
            feat_count = 2
        else:
            # All other species get 1 guaranteed feat
            feat_count = 1
        
        for _ in range(feat_count):
            # 50% chance it's random, 50% chance it relates to primary stat
            if random.random() < 0.5:
                # Random feat
                feat_name = random.choice([feat[0] for feat in all_feats])
            else:
                # Primary stat related feat
                # Map full stat names to the format used in origin_feats.csv
                stat_mapping = {
                    'strength': 'Strength',
                    'dexterity': 'Dexterity', 
                    'constitution': 'Constitution',
                    'intelligence': 'Intelligence',
                    'wisdom': 'Wisdom',
                    'charisma': 'Charisma'
                }
                
                mapped_stat = stat_mapping.get(primary_stat.lower(), primary_stat.title())
                primary_stat_feats = [feat[0] for feat in all_feats if feat[1] == mapped_stat]
                
                if primary_stat_feats:
                    feat_name = random.choice(primary_stat_feats)
                else:
                    # Fallback to random if no primary stat feats found
                    feat_name = random.choice([feat[0] for feat in all_feats])
            
            # Avoid duplicates
            if feat_name not in origin_feats:
                origin_feats.append(feat_name)
        
        return origin_feats
    
    def generate_npc(self, use_cultural_name: bool = False, culture: str = None, used_vowels: set = None) -> NPC:
        level = int(self._weighted_choice(self.level_distribution))
        stats, primary_stat, secondary_stat, dump_stat = self._roll_stats()
        
        class_type, class_name, subclass = self._determine_class_info(primary_stat)
        species = self._weighted_choice(self.species_distribution)
        background = self._get_background_by_stats(primary_stat, secondary_stat)
        
        # Generate name
        if use_cultural_name and culture:
            name = self._generate_cultural_name(culture)
        else:
            name, _ = self._generate_vowel_name(used_vowels)
        
        # Generate traits
        traits = self._generate_traits()
        
        # Generate origin feats
        origin_feats = self._generate_origin_feats(species, primary_stat)
        
        npc = NPC(
            name=name,
            level=level,
            strength=stats['strength'],
            dexterity=stats['dexterity'],
            constitution=stats['constitution'],
            intelligence=stats['intelligence'],
            wisdom=stats['wisdom'],
            charisma=stats['charisma'],
            primary_stat=primary_stat,
            class_type=class_type,
            class_name=class_name,
            subclass=subclass,
            species=species,
            background=background,
            traits=traits,
            origin_feats=origin_feats
        )
        
        return npc
    
    def generate_player(self, chosen_species: str = None, use_cultural_name: bool = False, culture: str = None) -> NPC:
        """Generate a player character with different rules"""
        level = int(self._weighted_choice(self.level_distribution))
        stats, primary_stat, secondary_stat, dump_stat = self._roll_player_stats(chosen_species)
        
        class_type, class_name, subclass = self._determine_class_info(primary_stat)
        
        # Species selection
        if chosen_species:
            species = chosen_species.title()
        else:
            species = self._weighted_choice(self.species_distribution)
        
        background = self._get_background_by_stats(primary_stat, secondary_stat)
        
        # Generate name
        if use_cultural_name and culture:
            name = self._generate_cultural_name(culture)
        else:
            name, _ = self._generate_vowel_name()
        
        # Generate traits
        traits = self._generate_traits()
        
        # Generate player origin feats (guaranteed)
        origin_feats = self._generate_player_origin_feats(species, primary_stat)
        
        npc = NPC(
            name=name,
            level=level,
            strength=stats['strength'],
            dexterity=stats['dexterity'],
            constitution=stats['constitution'],
            intelligence=stats['intelligence'],
            wisdom=stats['wisdom'],
            charisma=stats['charisma'],
            primary_stat=primary_stat,
            class_type=class_type,
            class_name=class_name,
            subclass=subclass,
            species=species,
            background=background,
            traits=traits,
            origin_feats=origin_feats
        )
        
        return npc
    
    def save_npc_to_db(self, npc: NPC) -> int:
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO npcs (name, level, strength, dexterity, constitution, intelligence, 
                            wisdom, charisma, primary_stat, class_type, class_name, subclass, species, background, traits, origin_feats)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            npc.name, npc.level, npc.strength, npc.dexterity, npc.constitution,
            npc.intelligence, npc.wisdom, npc.charisma, npc.primary_stat,
            npc.class_type, npc.class_name, npc.subclass, npc.species, npc.background,
            ", ".join(npc.traits), ", ".join(npc.origin_feats)
        ))
        npc_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return npc_id
    
    def generate_and_save_npc(self) -> Tuple[NPC, int]:
        npc = self.generate_npc()
        npc_id = self.save_npc_to_db(npc)
        return npc, npc_id
    
    def get_all_npcs(self) -> List[Dict]:
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM npcs')
        columns = [description[0] for description in cursor.description]
        results = [dict(zip(columns, row)) for row in cursor.fetchall()]
        conn.close()
        return results
    
    def clear_npc_database(self) -> bool:
        """Clear all NPCs from the database and reset the auto-increment counter"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Delete all NPCs
            cursor.execute('DELETE FROM npcs')
            
            # Reset the auto-increment counter
            cursor.execute('DELETE FROM sqlite_sequence WHERE name="npcs"')
            
            conn.commit()
            conn.close()
            return True
        except Exception as e:
            print(f"Error clearing database: {e}")
            return False
    
    def generate_party_size(self) -> int:
        """Roll 1d4 and 1d6, return the higher value for party size"""
        d4_roll = random.randint(1, 4)
        d6_roll = random.randint(1, 6)
        return max(d4_roll, d6_roll)
    
    def generate_party(self) -> List[Tuple[NPC, int]]:
        """Generate a party of NPCs with plebs (3d6 stats)"""
        party_size = self.generate_party_size()
        party = []
        
        # Determine number of cultural members (1d7-1, so 0-6)
        cultural_members = random.randint(1, 7) - 1
        cultural_members = min(cultural_members, party_size)  # Can't exceed party size
        
        # Choose a random culture for cultural members
        cultures = ['aquilonian', 'barbarian', 'lusitania', 'oriental', 'qharan']
        chosen_culture = random.choice(cultures)
        
        print(f"Generating party of {party_size} members...")
        if cultural_members > 0:
            print(f"{cultural_members} member(s) will be from {chosen_culture.title()} culture")
        print()
        
        used_vowels = set()
        
        for i in range(party_size):
            # First cultural_members get cultural names, rest get vowel names
            use_cultural = i < cultural_members
            culture = chosen_culture if use_cultural else None
            
            if use_cultural:
                npc = self.generate_npc(use_cultural_name=True, culture=culture)
            else:
                npc = self.generate_npc(used_vowels=used_vowels)
                # Track used vowel for vowel name generation
                if npc.name:
                    first_letter = npc.name[0].upper()
                    if first_letter in 'AEIOU':
                        used_vowels.add(first_letter)
            
            npc_id = self.save_npc_to_db(npc)
            party.append((npc, npc_id))
            
            culture_note = f" ({chosen_culture.title()})" if use_cultural else ""
            print(f"Party Member {i+1} (ID: {npc_id}){culture_note}:")
            self.display_npc(npc)
            print()
        
        return party
    
    def display_npc(self, npc: NPC):
        """Display NPC information"""
        print(f"Name: {npc.name}")
        print(f"Level: {npc.level}")
        print(f"Species: {npc.species}")
        print(f"Stats: STR {npc.strength}, DEX {npc.dexterity}, CON {npc.constitution}")
        print(f"       INT {npc.intelligence}, WIS {npc.wisdom}, CHA {npc.charisma}")
        print(f"Primary Stat: {npc.primary_stat.title()}")
        print(f"Background: {npc.background}")
        if npc.traits:
            print(f"Traits: {', '.join(npc.traits)}")
        if npc.origin_feats:
            print(f"Origin Feats: {', '.join(npc.origin_feats)}")
        if npc.class_type:
            print(f"Class Type: {npc.class_type.title()}")
        else:
            print("Class Type: Non-caster (physical)")
        if npc.class_name:
            print(f"Class: {npc.class_name}")
        if npc.subclass:
            print(f"Subclass: {npc.subclass}")
    
    def show_menu(self):
        """Display the main menu and handle user choice"""
        while True:
            print("\n" + "="*40)
            print("NPC GENERATOR")
            print("="*40)
            print("1. Party - Generate a group of plebs")
            print("2. Individual - Generate a single NPC")
            print("3. Player - Generate player character")
            print("4. Clear Database - Remove all NPCs")
            print("5. Exit")
            print("="*40)
            
            choice = input("Select an option (1-5): ").strip()
            
            if choice == '1':
                self.generate_party()
            elif choice == '2':
                npc = self.generate_npc()
                npc_id = self.save_npc_to_db(npc)
                print(f"\nGenerated NPC (ID: {npc_id}):")
                self.display_npc(npc)
            elif choice == '3':
                self._generate_player_menu()
            elif choice == '4':
                print("\nAre you sure you want to clear all NPCs from the database?")
                confirm = input("Type 'yes' to confirm: ").strip().lower()
                if confirm == 'yes':
                    if self.clear_npc_database():
                        print("Database cleared successfully! NPC IDs will restart from 1.")
                    else:
                        print("Failed to clear database.")
                else:
                    print("Database clear cancelled.")
            elif choice == '5':
                print("Goodbye!")
                break
            else:
                print("Invalid choice. Please select 1-5.")
    
    def _generate_player_menu(self):
        """Player generation submenu"""
        print("\n" + "="*40)
        print("PLAYER CHARACTER GENERATION")
        print("="*40)
        print("Choose species:")
        print("1. Random species")
        print("2. Human")
        print("3. Back to main menu")
        print("="*40)
        
        choice = input("Select an option (1-3): ").strip()
        
        if choice == '1':
            # Random species
            player = self.generate_player()
            player_id = self.save_npc_to_db(player)
            print(f"\nGenerated Player Character (ID: {player_id}):")
            self.display_npc(player)
        elif choice == '2':
            # Human
            player = self.generate_player(chosen_species="Human")
            player_id = self.save_npc_to_db(player)
            print(f"\nGenerated Player Character (ID: {player_id}):")
            self.display_npc(player)
        elif choice == '3':
            return  # Back to main menu
        else:
            print("Invalid choice. Please select 1-3.")
            self._generate_player_menu()  # Try again


def main():
    generator = NPCGenerator()
    generator.show_menu()


if __name__ == "__main__":
    main()