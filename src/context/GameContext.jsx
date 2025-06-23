import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  players: [],
  gamePhase: 'night', // 'night', 'day'
  phaseStep: 0,
  zkProof: null
};

// Action types
const ACTIONS = {
  SET_PLAYERS: 'SET_PLAYERS',
  NEW_GAME: 'NEW_GAME',
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
    
    case ACTIONS.NEW_GAME:
      return {
        ...initialState,
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
        gamePhase: state.gamePhase,
        phaseStep: state.phaseStep,
        zkProof: state.zkProof
      }));
    }
  }, [state.players, state.gamePhase, state.phaseStep, state.zkProof]);

  // Actions
  const actions = {
    setPlayers: (players) => dispatch({ type: ACTIONS.SET_PLAYERS, payload: players }),
    newGame: () => {
      localStorage.removeItem('zkWerewolfPlayers');
      localStorage.removeItem('zkWerewolfGameState');
      dispatch({ type: ACTIONS.NEW_GAME });
    },
    setGamePhase: (phase) => dispatch({ type: ACTIONS.SET_GAME_PHASE, payload: phase }),
    setPhaseStep: (step) => dispatch({ type: ACTIONS.SET_PHASE_STEP, payload: step }),
    setZkProof: (proof) => dispatch({ type: ACTIONS.SET_ZK_PROOF, payload: proof }),
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