# zkWerewolf

A minimal React + Vite application that demonstrates zero-knowledge proof concepts in a Werewolf game setting with individual player pages and moderator controls.

## Features

- **Player Management**: Add 4-15 players with automatic role assignment
- **Random Role Assignment**: 1-4 werewolves, 1 healer, 1 detective, and villagers based on player count
- **Individual Player Pages**: Unique URLs for each player to view their secret role
- **Moderator View**: Complete game control with step-by-step phase management
- **Poseidon Hash Commitments**: Cryptographic commitments for each player's role
- **ZK Proof Simulation**: Demonstrates proving the existence of at least one werewolf without revealing identities
- **Modern UI**: Beautiful interface built with Tailwind CSS and React Router

## Game Roles

- **Werewolf**: Work with your team to eliminate villagers without being discovered
- **Healer**: Each night, you can save one player from being killed by werewolves
- **Detective**: Each night, you can investigate one player to learn their role
- **Villager**: Work with other villagers to identify and eliminate the werewolves

## Game Rules

- **4-6 players**: 1 werewolf, 1 healer, 1 detective, 1+ villagers
- **7-10 players**: 2 werewolves, 1 healer, 1 detective, 3+ villagers
- **11-13 players**: 3 werewolves, 1 healer, 1 detective, 6+ villagers
- **14-15 players**: 4 werewolves, 1 healer, 1 detective, 8+ villagers

## How to Play

### Setup Phase
1. Choose the number of players (4-15)
2. Enter each player's name
3. Start the game to generate individual player links

### Individual Player Experience
- Each player gets a unique URL like `/player/maya-abc123`
- Players can view their secret role and commitment
- Roles auto-hide after 10 seconds for privacy
- Players can manually show/hide their role

### Moderator Experience
- Access the moderator view at `/moderator`
- See all players and their roles
- Control game phases (Night/Day) with step-by-step instructions
- Generate ZK proofs to verify werewolf presence
- Follow scripted narration for smooth gameplay

### Game Flow
1. **Night Phase**: Werewolves choose targets, Healer saves, Detective investigates
2. **Day Phase**: Players discuss and vote to eliminate suspected werewolves
3. **Repeat**: Continue until all werewolves are eliminated or villagers are outnumbered

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd zkWerewolf
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technical Implementation

### Routing Structure
- `/` - Main game setup and player link generation
- `/player/:playerId` - Individual player role page
- `/moderator` - Moderator control panel

### ZK Proof System
- `proveWerewolfPresence(commitments, players)` - Verifies werewolf existence
- Uses Poseidon-like hash commitments
- Generates complete proof structure with public inputs and verification

### Cryptographic Features
- **Commitment Generation**: Each role is hashed with player-specific data
- **Unique Player IDs**: Generated from names with timestamps for URL sharing
- **Role Privacy**: Auto-hiding roles with manual toggle controls

## Technical Details

- **Frontend**: React 18 with Vite and React Router
- **Styling**: Tailwind CSS with responsive design
- **Cryptography**: CryptoJS for hash functions (simulated Poseidon)
- **State Management**: React hooks (useState, useEffect)
- **Routing**: React Router for individual player pages and moderator view

## Future Enhancements

- Real Poseidon hash implementation
- Actual ZK proof generation using libraries like Circom or Halo2
- Multiplayer support with real-time synchronization
- Game phase management with action tracking
- Role reveal mechanisms with cryptographic verification
- Mobile-optimized player interfaces
- Game history and statistics tracking

## License

This project is licensed under the MIT License.