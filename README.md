# Animals-Memory-Blocks

**By [Saif Abdelrazek](https://github.com/SaifAbdelrazek011)**  

The game is a simple memory block game with animal icons. The techniques used are HTML, CSS, and TypeScript. The website contains dark and light modes and contains the ability to choose the time for the game and the number of different images (remember blocks = 2 * number of different images). Remember to watch the time and end the game in the least wrong attempts possible. And finally, don't forget to always have fun.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/SaifAbdelrazek011/speed-typing-game/blob/main/LICENSE)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9%2B-3178C6.svg)

--------------------------------------------------------------------------------------

## 🎮 Features

- **Customizable Game Settings**:
  - ⏲ Time Limits: 10 seconds to 4 minutes
  - 🐘 Animal Variety: Choose 4-10 different animals (8-20 blocks)
- **Progress Tracking**:
  - ⏱ Previous game time displayed before new rounds
  - 📊 Best time preserved in local storage
- **Theme Control**:
  - 🌓 Light/dark mode toggle
  - 🎨 Persistent theme preference
- **Responsive Design**:
  - 📱 Adapts to all screen sizes
  - 🖥 Optimized grid layouts

## ⚙️ Installation

```bash
git clone https://github.com/SaifAbdelrazek011/Animals-Memory-Blocks.git
cd Animals-Memory-Blocks
npm install
npm run dev
```

## 🕹️ How to Play

1. **Game Setup**:
   - Select number of animals (4-10)
   - Set timer duration (10s-4m)
   - Click "New Game"

2. **Gameplay**:
   - Match animal pairs before time expires
   - Each selection reveals an animal
   - Mismatches auto-flip after 1 second
   - Previous game time shown at round start

3. **Winning**:
   - Success: Match all pairs in time
   - Failure: Time runs out
   - Restart with same/different settings

## 🧰 Technical Implementation

- **Core Stack**:
  - TypeScript
  - CSS Grid/Flexbox
  - HTML5

- **Data Management**:
  ```typescript
  interface GameConfig {
    animals: number; // 4-10
    timeLimit: number; // 10-240 seconds
    previousTime?: number;
  }
  
  // Local storage implementation
  localStorage.setItem('memoryConfig', JSON.stringify(config));
  ```

## 🤝 Contributing

Contributions welcome! Please follow:
1. Fork repository
2. Create feature branch (`feature/your-feature`)
3. Submit PR with detailed description

## 📄 License

MIT Licensed - See [LICENSE](LICENSE) for details

## 🙏 Acknowledgements

- Original concept inspiration from Elzero
- Browser Storage API for state persistence
```
