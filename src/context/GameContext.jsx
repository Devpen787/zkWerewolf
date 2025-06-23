import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  players: [],
  uiState: 'welcome', // 'welcome', 'setup', 'game'
  gameStarted: false,
  showWelcome: true,
  currentPhase: 'setup', // 'setup', 'playing', 'ended'
  gamePhase: 'night', // 'night', 'day'
  phaseStep: 0,
  zkProof: null
};

// Action types
const ACTIONS = {
  SET_PLAYERS: 'SET_PLAYERS',
  SET_UI_STATE: 'SET_UI_STATE',
  START_GAME: 'START_GAME',
  NEW_GAME: 'NEW_GAME',
  BACK_TO_WELCOME: 'BACK_TO_WELCOME',
  SET_WELCOME: 'SET_WELCOME',
  SET_PHASE: 'SET_PHASE',
  SET_GAME_PHASE: 'SET_GAME_PHASE',
  SET_PHASE_STEP: 'SET_PHASE_STEP',
  SET_ZK_PROOF: 'SET_ZK_PROOF',
  LOAD_FROM_STORAGE: 'LOAD_FROM_STORAGE'
};

// Reducer function
const gameReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_PLAYERS:
      return {
        ...state,
        players: action.payload
      };
    
    case ACTIONS.SET_UI_STATE:
      return {
        ...state,
        uiState: action.payload
      };
    
    case ACTIONS.START_GAME:
      return {
        ...state,
        players: action.payload,
        gameStarted: true,
        showWelcome: false,
        currentPhase: 'playing'
      };
    
    case ACTIONS.NEW_GAME:
      return {
        ...initialState,
        showWelcome: true
      };
    
    case ACTIONS.SET_WELCOME:
      return {
        ...state,
        showWelcome: action.payload
      };
    
    case ACTIONS.SET_PHASE:
      return {
        ...state,
        currentPhase: action.payload
      };
    
    case ACTIONS.SET_GAME_PHASE:
      return {
        ...state,
        gamePhase: action.payload
      };
    
    case ACTIONS.SET_PHASE_STEP:
      return {
        ...state,
        phaseStep: action.payload
      };
    
    case ACTIONS.SET_ZK_PROOF:
      return {
        ...state,
        zkProof: action.payload
      };
    
    case ACTIONS.LOAD_FROM_STORAGE:
      return {
        ...state,
        ...action.payload
      };
    
    case ACTIONS.BACK_TO_WELCOME:
      return {
        ...state,
        showWelcome: true,
        gameStarted: false,
        currentPhase: 'setup'
      };
    
    default:
      return state;
  }
};

// Create context
const GameContext = createContext();

// Provider component
export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedPlayers = localStorage.getItem('zkWerewolfPlayers');
      const savedGameState = localStorage.getItem('zkWerewolfGameState');
      
      if (savedPlayers && savedGameState) {
        const players = JSON.parse(savedPlayers);
        const gameState = JSON.parse(savedGameState);
        
        dispatch({
          type: ACTIONS.LOAD_FROM_STORAGE,
          payload: {
            players,
            gameStarted: true,
            showWelcome: false,
            ...gameState
          }
        });
      }
    } catch (error) {
      console.error("Failed to load game state from localStorage", error);
      localStorage.removeItem('zkWerewolfPlayers');
      localStorage.removeItem('zkWerewolfGameState');
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (state.players.length > 0) {
      localStorage.setItem('zkWerewolfPlayers', JSON.stringify(state.players));
      localStorage.setItem('zkWerewolfGameState', JSON.stringify({
        currentPhase: state.currentPhase,
        gamePhase: state.gamePhase,
        phaseStep: state.phaseStep,
        zkProof: state.zkProof
      }));
    }
  }, [state.players, state.currentPhase, state.gamePhase, state.phaseStep, state.zkProof]);

  // Actions
  const actions = {
    setPlayers: (players) => dispatch({ type: ACTIONS.SET_PLAYERS, payload: players }),
    setUiState: (uiState) => dispatch({ type: ACTIONS.SET_UI_STATE, payload: uiState }),
    startGame: (players) => dispatch({ type: ACTIONS.START_GAME, payload: players }),
    newGame: () => {
      localStorage.removeItem('zkWerewolfPlayers');
      localStorage.removeItem('zkWerewolfGameState');
      dispatch({ type: ACTIONS.NEW_GAME });
    },
    setWelcome: (show) => dispatch({ type: ACTIONS.SET_WELCOME, payload: show }),
    setPhase: (phase) => dispatch({ type: ACTIONS.SET_PHASE, payload: phase }),
    setGamePhase: (phase) => dispatch({ type: ACTIONS.SET_GAME_PHASE, payload: phase }),
    setPhaseStep: (step) => dispatch({ type: ACTIONS.SET_PHASE_STEP, payload: step }),
    setZkProof: (proof) => dispatch({ type: ACTIONS.SET_ZK_PROOF, payload: proof }),
    backToWelcome: () => dispatch({ type: ACTIONS.BACK_TO_WELCOME })
  };

  return (
    <GameContext.Provider value={{ state, actions }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the context
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 