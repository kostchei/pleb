# Pleb Generator - NPC & Player Character Creator

A web-based D&D character generator that creates NPCs (plebs) and player characters with detailed stats, backgrounds, traits, and origin feats. Features tarot card readings for narrative hooks.

## Features

### Character Generation
- **Party Generation**: Create groups of 1-6 NPCs with cultural naming
- **Individual NPCs**: Single character generation with enhanced tarot readings
- **Player Characters**: Stronger stats with 4d6 drop lowest and guaranteed origin feats

### Game Mechanics
- **Pleb Stats**: 3d6 base rolls with +1 to primary/secondary stats
- **Player Stats**: 4d6 drop lowest with higher minimums and random +1 distribution
- **Origin Feats**: 50% chance for plebs, guaranteed for players (2 for humans)
- **Backgrounds**: Context-aware selection based on primary/secondary stats
- **Traits**: Random virtue/vice combinations

### Tarot Integration
- **Party Reading**: 1 group card + 1 individual card for random member
- **Individual/Player**: 2 cards each for narrative hooks
- **Dynamic Display**: Cards appear contextually with character generation

## Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript ES6+
- **Hosting**: Azure Static Web Apps
- **Data**: JSON configuration files for cards, classes, and distributions
- **Design**: Responsive grid layout with 15% border for custom artwork

## Local Development

1. Clone the repository
2. Open `index.html` in a modern web browser
3. All functionality works client-side with no backend required

## Deployment to Azure

1. Fork this repository
2. Create an Azure Static Web App resource
3. Connect to your GitHub repository
4. The included workflow will automatically deploy on push to main

## Character Display

- **Grid Layout**: Last 6 characters in 2 rows of 3
- **Character Cards**: Detailed stats, backgrounds, traits, and feats
- **Tarot Integration**: Cards appear inline with character information
- **Player Distinction**: Special styling for player characters

## File Structure

```
├── index.html              # Main application page
├── styles.css              # Complete styling with responsive design
├── script.js               # All generation logic and UI management
├── cards.json              # Tarot card definitions
├── classes.json            # Class and subclass data
├── staticwebapp.config.json # Azure Static Web App configuration
└── .github/workflows/       # CI/CD pipeline for Azure deployment
```

## Customization

The app is designed with a 15% border around the content area specifically for adding custom artwork or branding. Simply modify the CSS background or add overlay elements within the border space.

All generation data is stored in JSON files for easy modification of:
- Character backgrounds and traits
- Origin feats and their stat associations
- Species and class distributions
- Tarot card definitions and meanings

## License

Open source - feel free to modify and adapt for your gaming needs!