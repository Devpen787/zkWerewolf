import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom'
import CryptoJS from 'crypto-js'

import WelcomePage from './components/WelcomePage';

// Import role images
import villagerImage from './assets/villager.png';
import werewolfImage from './assets/werewolf.png';
import healerImage from './assets/healer.png';
import detectiveImage from './assets/detective.png';

// Game roles
const ROLES = {
  WEREWOLF: 'werewolf',
  VILLAGER: 'villager',
  HEALER: 'healer',
  DETECTIVE: 'detective'
}

// Game phases
const PHASES = {
  SETUP: 'setup',
  NIGHT: 'night',
  DAY: 'day'
}

// Poseidon-like hash function (simplified for demo)
const poseidonHash = (input) => {
  const salt = 'zkwerewolf_salt_2024'
  const combined = input + salt + Date.now().toString()
  const hash = CryptoJS.SHA256(combined).toString()
  const mixed = CryptoJS.SHA256(hash + salt).toString()
  return mixed.substring(0, 64)
}

// Generate unique player ID
const generatePlayerId = (name) => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  const nameSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 10)
  return `${nameSlug}-${timestamp}${random}`
}

// Role assignment logic based on player count
const assignRoles = (playerCount) => {
  const players = []
  let werewolfCount = 0
  
  // Determine number of werewolves based on player count
  if (playerCount <= 6) {
    werewolfCount = 1
  } else if (playerCount <= 10) {
    werewolfCount = 2
  } else if (playerCount <= 13) {
    werewolfCount = 3
  } else {
    werewolfCount = 4
  }
  
  // Create player array with roles
  for (let i = 0; i < playerCount; i++) {
    let role = ROLES.VILLAGER
    
    if (i < werewolfCount) {
      role = ROLES.WEREWOLF
    } else if (i === werewolfCount) {
      role = ROLES.HEALER
    } else if (i === werewolfCount + 1) {
      role = ROLES.DETECTIVE
    }
    
    players.push({
      id: i,
      name: `Player ${i + 1}`,
      role: role,
      commitment: null,
      playerId: null
    })
  }
  
  // Shuffle the array to randomize role distribution
  for (let i = players.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[players[i], players[j]] = [players[j], players[i]]
  }
  
  return players
}

// Generate commitments for all players
const generateCommitments = (players) => {
  return players.map(player => ({
    ...player,
    commitment: poseidonHash(`${player.name}:${player.role}:${player.id}`),
    playerId: generatePlayerId(player.name)
  }))
}

// ZK Proof system to verify werewolf presence
const proveWerewolfPresence = (commitments, players) => {
  const werewolves = players.filter(p => p.role === ROLES.WEREWOLF)
  
  if (werewolves.length === 0) {
    return {
      success: false,
      message: 'No werewolves found - cannot generate proof',
      proof: null
    }
  }
  
  // Simulate ZK proof generation
  const proofData = {
    publicInput: {
      totalPlayers: players.length,
      werewolfCount: werewolves.length,
      commitmentRoot: poseidonHash(commitments.join('')),
      timestamp: new Date().toISOString()
    },
    proof: {
      witness: werewolves.map(w => w.commitment),
      challenge: poseidonHash(`challenge:${Date.now()}`),
      response: poseidonHash(`response:${werewolves.length}:${Date.now()}`),
      merkleRoot: poseidonHash(commitments.join(''))
    },
    verification: {
      isValid: true,
      werewolfExists: true,
      timestamp: new Date().toISOString()
    }
  }
  
  return {
    success: true,
    proof: proofData,
    message: `ZK Proof generated successfully! Proves existence of ${werewolves.length} werewolf(ves)`,
    werewolfCount: werewolves.length
  }
}

// Game Setup Component
function GameSetup({ onGameStart }) {
  const [playerCount, setPlayerCount] = useState(8)
  const [players, setPlayers] = useState([])
  const [playerNames, setPlayerNames] = useState([])
  const [currentPhase, setCurrentPhase] = useState('count') // 'count' or 'names'

  const getWerewolfCount = () => {
    if (playerCount <= 6) return 1
    if (playerCount <= 10) return 2
    if (playerCount <= 13) return 3
    return 4
  }

  const handleNextPhase = () => {
    if (currentPhase === 'count') {
      setCurrentPhase('names')
      setPlayerNames(new Array(playerCount).fill(''))
    }
  }

  const handleNameChange = (index, name) => {
    const newNames = [...playerNames]
    newNames[index] = name
    setPlayerNames(newNames)
  }

  const handleStartGame = () => {
    if (playerNames.some(name => name.trim() === '')) {
      alert('Please fill in all player names')
      return
    }

    const assignedPlayers = assignRoles(playerCount)
    const playersWithNames = assignedPlayers.map((player, index) => ({
      ...player,
      name: playerNames[index]
    }))
    const playersWithCommitments = generateCommitments(playersWithNames)
    setPlayers(playersWithCommitments)
    onGameStart(playersWithCommitments)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          zkWerewolf
        </h1>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <h2 className="text-2xl font-semibold mb-6">Game Setup</h2>
            
            {currentPhase === 'count' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Number of Players (4-15)
                  </label>
                  <input
                    type="number"
                    min="4"
                    max="15"
                    value={playerCount}
                    onChange={(e) => setPlayerCount(parseInt(e.target.value) || 4)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>Players: {playerCount}</p>
                  <p>Werewolves: {getWerewolfCount()}</p>
                  <p>Healer: 1</p>
                  <p>Detective: 1</p>
                  <p>Villagers: {Math.max(0, playerCount - getWerewolfCount() - 2)}</p>
                </div>
                <button
                  onClick={handleNextPhase}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  Next: Enter Player Names
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-medium mb-4">Enter Player Names</h3>
                {playerNames.map((name, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium mb-2">
                      Player {index + 1}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      placeholder={`Player ${index + 1} name`}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                ))}
                <div className="flex space-x-4">
                  <button
                    onClick={() => setCurrentPhase('count')}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleStartGame}
                    className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    Start Game
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Individual Player Page Component
function PlayerPage({ players }) {
  const { playerId } = useParams()
  const [showRole, setShowRole] = useState(true)
  const [autoHideTimer, setAutoHideTimer] = useState(null)
  
  const player = players.find(p => p.playerId === playerId)
  
  useEffect(() => {
    if (player) {
      // Auto-hide role after 10 seconds
      const timer = setTimeout(() => {
        setShowRole(false)
      }, 10000)
      setAutoHideTimer(timer)
      
      return () => clearTimeout(timer)
    }
  }, [player])
  
  const handleToggleRole = () => {
    if (autoHideTimer) {
      clearTimeout(autoHideTimer)
      setAutoHideTimer(null)
    }
    setShowRole(!showRole)
  }
  
  if (!player) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Player Not Found</h1>
          <p className="text-gray-300">This player link is invalid or has expired.</p>
        </div>
      </div>
    )
  }
  
  const getRoleColor = (role) => {
    switch (role) {
      case ROLES.WEREWOLF: return 'text-red-400'
      case ROLES.HEALER: return 'text-green-400'
      case ROLES.DETECTIVE: return 'text-blue-400'
      case ROLES.VILLAGER: return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }
  
  const getRoleImage = (role) => {
    switch (role) {
      case ROLES.WEREWOLF: return werewolfImage;
      case ROLES.HEALER: return healerImage;
      case ROLES.DETECTIVE: return detectiveImage;
      case ROLES.VILLAGER: return villagerImage;
      default: return null;
    }
  }
  
  const getRoleDescription = (role) => {
    switch (role) {
      case ROLES.WEREWOLF: return 'You are a Werewolf. Work with your team to eliminate villagers without being discovered.'
      case ROLES.HEALER: return 'You are the Healer. Each night, you can save one player from being killed by werewolves.'
      case ROLES.DETECTIVE: return 'You are the Detective. Each night, you can investigate one player to learn their role.'
      case ROLES.VILLAGER: return 'You are a Villager. Work with other villagers to identify and eliminate the werewolves.'
      default: return ''
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl text-center">
            <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {player.name}
            </h1>
            
            <div className="space-y-6">
              {showRole ? (
                <div className="space-y-4">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h2 className={`text-xl font-bold mb-2 ${getRoleColor(player.role)}`}>
                      {player.role.charAt(0).toUpperCase() + player.role.slice(1)}
                    </h2>
                    <img 
                      src={getRoleImage(player.role)} 
                      alt={player.role}
                      className="w-48 h-48 mx-auto rounded-lg my-4"
                    />
                    <p className="text-sm text-gray-300">
                      {getRoleDescription(player.role)}
                    </p>
                  </div>
                  
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Role Commitment</h3>
                    <p className="text-xs text-gray-300 break-all">
                      {player.commitment}
                    </p>
                  </div>
                  
                  <button
                    onClick={handleToggleRole}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    Hide Role
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h2 className="text-xl font-bold mb-2 text-gray-400">
                      Role Hidden
                    </h2>
                    <p className="text-sm text-gray-300">
                      Your role is currently hidden. Click below to reveal it again.
                    </p>
                  </div>
                  
                  <button
                    onClick={handleToggleRole}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    Show Role
                  </button>
                </div>
              )}
              
              <div className="text-xs text-gray-400 mt-6">
                <p>Player ID: {player.playerId}</p>
                <p>Share this link with {player.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Moderator View Component
function ModeratorView({ players, onPhaseChange }) {
  const [currentPhase, setCurrentPhase] = useState(PHASES.NIGHT)
  const [phaseStep, setPhaseStep] = useState(0)
  const [zkProof, setZkProof] = useState(null)
  
  const phaseSteps = {
    [PHASES.NIGHT]: [
      "Everyone close your eyes",
      "Werewolves, open your eyes and choose a target",
      "Werewolves, close your eyes",
      "Healer, open your eyes and choose someone to save",
      "Healer, close your eyes",
      "Detective, open your eyes and choose someone to investigate",
      "Detective, close your eyes",
      "Everyone open your eyes"
    ],
    [PHASES.DAY]: [
      "The night has passed",
      "Discuss what happened",
      "Vote on who to eliminate",
      "Announce the elimination"
    ]
  }
  
  const handlePhaseChange = () => {
    if (currentPhase === PHASES.NIGHT) {
      setCurrentPhase(PHASES.DAY)
      setPhaseStep(0)
    } else {
      setCurrentPhase(PHASES.NIGHT)
      setPhaseStep(0)
    }
    onPhaseChange && onPhaseChange(currentPhase === PHASES.NIGHT ? PHASES.DAY : PHASES.NIGHT)
  }
  
  const handleNextStep = () => {
    if (phaseStep < phaseSteps[currentPhase].length - 1) {
      setPhaseStep(phaseStep + 1)
    }
  }
  
  const handleGenerateZKProof = () => {
    const commitments = players.map(p => p.commitment)
    const proof = proveWerewolfPresence(commitments, players)
    setZkProof(proof)
  }
  
  const getRoleColor = (role) => {
    switch (role) {
      case ROLES.WEREWOLF: return 'text-red-400'
      case ROLES.HEALER: return 'text-green-400'
      case ROLES.DETECTIVE: return 'text-blue-400'
      case ROLES.VILLAGER: return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          Moderator View
        </h1>
        
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Game Phase Control */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Game Phase: {currentPhase.toUpperCase()}</h2>
              <button
                onClick={handlePhaseChange}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
              >
                Switch to {currentPhase === PHASES.NIGHT ? 'DAY' : 'NIGHT'}
              </button>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-medium mb-2">Current Step:</h3>
              <p className="text-gray-300 mb-4">{phaseSteps[currentPhase][phaseStep]}</p>
              <button
                onClick={handleNextStep}
                disabled={phaseStep >= phaseSteps[currentPhase].length - 1}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded-lg transition-colors"
              >
                Next Step
              </button>
            </div>
          </div>
          
          {/* Player List */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <h2 className="text-2xl font-semibold mb-4">All Players & Roles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {players.map((player) => (
                <div key={player.id} className="bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-lg">{player.name}</h3>
                  <p className={`text-sm font-medium ${getRoleColor(player.role)}`}>
                    {player.role.charAt(0).toUpperCase() + player.role.slice(1)}
                  </p>
                  <p className="text-xs text-gray-400 mt-2 break-all">
                    ID: {player.playerId}
                  </p>
                  <p className="text-xs text-gray-400 break-all">
                    Commitment: {player.commitment.substring(0, 16)}...
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* ZK Proof Section */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <h2 className="text-2xl font-semibold mb-4">Zero-Knowledge Proof</h2>
            <button
              onClick={handleGenerateZKProof}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Generate ZK Proof
            </button>
            
            {zkProof && (
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">
                  {zkProof.success ? '✅ Proof Generated' : '❌ Proof Failed'}
                </h3>
                <p className="text-gray-300 mb-4">{zkProof.message}</p>
                
                {zkProof.success && (
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-purple-400">Public Input:</h4>
                      <pre className="text-xs bg-gray-800 p-2 rounded overflow-x-auto">
                        {JSON.stringify(zkProof.proof.publicInput, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-400">Proof:</h4>
                      <pre className="text-xs bg-gray-800 p-2 rounded overflow-x-auto">
                        {JSON.stringify(zkProof.proof.proof, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-400">Verification:</h4>
                      <pre className="text-xs bg-gray-800 p-2 rounded overflow-x-auto">
                        {JSON.stringify(zkProof.proof.verification, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Main App Component with Routing
function App() {
  const [players, setPlayers] = useState([])
  const [gameStarted, setGameStarted] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true);

  // Load players from localStorage on initial component mount
  useEffect(() => {
    try {
      const savedPlayers = localStorage.getItem('zkWerewolfPlayers');
      if (savedPlayers) {
        setPlayers(JSON.parse(savedPlayers));
        setGameStarted(true);
      }
    } catch (error) {
      console.error("Failed to parse players from localStorage", error);
      // If parsing fails, clear the bad data
      localStorage.removeItem('zkWerewolfPlayers');
    }
  }, []);
  
  const handleGameStart = (gamePlayers) => {
    localStorage.setItem('zkWerewolfPlayers', JSON.stringify(gamePlayers));
    setPlayers(gamePlayers)
    setGameStarted(true)
  }

  const handleNewGame = () => {
    localStorage.removeItem('zkWerewolfPlayers');
    setPlayers([]);
    setGameStarted(false);
  }

  const handleStartFromWelcome = () => {
    setShowWelcome(false);
  };
  
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            showWelcome ? (
              <WelcomePage onStart={handleStartFromWelcome} />
            ) : gameStarted ? (
              <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
                <div className="container mx-auto px-4 py-8">
                  <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    zkWerewolf
                  </h1>
                  
                  <div className="max-w-4xl mx-auto space-y-6">
                    {/* Player Links */}
                    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
                      <h2 className="text-2xl font-semibold mb-4">Player Links</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {players.map((player) => (
                          <div key={player.id} className="bg-gray-700 rounded-lg p-4">
                            <h3 className="font-semibold text-lg mb-2">{player.name}</h3>
                            <a
                              href={`/player/${player.playerId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 text-sm break-all"
                            >
                              /player/{player.playerId}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Game Controls */}
                    <div className="flex justify-center space-x-4">
                      <a
                        href="/moderator"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                      >
                        Open Moderator View
                      </a>
                      <button
                        onClick={handleNewGame}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                      >
                        New Game
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <GameSetup onGameStart={handleGameStart} />
            )
          } 
        />
        <Route 
          path="/player/:playerId" 
          element={<PlayerPage players={players} />} 
        />
        <Route 
          path="/moderator" 
          element={<ModeratorView players={players} />} 
        />
      </Routes>
    </Router>
  )
}

export default App 