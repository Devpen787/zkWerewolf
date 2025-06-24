// Game utility functions

/**
 * Calculate the number of werewolves based on player count
 * @param {number} playerCount - Total number of players
 * @returns {number} Number of werewolves
 */
export const getWerewolfCount = (playerCount) => {
  if (playerCount <= 6) return 1;
  if (playerCount <= 10) return 2;
  if (playerCount <= 13) return 3;
  return 4;
};

/**
 * Generate a random commitment for a player's role
 * @param {string} playerId - Player's unique ID
 * @param {string} role - Player's role
 * @returns {string} Commitment hash
 */
export const generateCommitment = (playerId, role) => {
  // Simple hash function for demonstration
  // In a real implementation, this would use a proper cryptographic hash
  const data = `${playerId}-${role}-${Date.now()}`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `0x${Math.abs(hash).toString(16).padStart(8, '0')}...`;
};

/**
 * Assign roles to players randomly
 * @param {Array} players - Array of player objects with names and IDs
 * @returns {Array} Array of players with assigned roles and commitments
 */
export const assignRoles = (players) => {
  const playerCount = players.length;
  const werewolfCount = getWerewolfCount(playerCount);
  
  // Create role pool
  const roles = [];
  
  // Add werewolves
  for (let i = 0; i < werewolfCount; i++) {
    roles.push('werewolf');
  }
  
  // Add special roles (always 1 each)
  roles.push('healer');
  roles.push('detective');
  
  // Add villagers to fill remaining slots
  const villagerCount = playerCount - werewolfCount - 2;
  for (let i = 0; i < villagerCount; i++) {
    roles.push('villager');
  }
  
  // Shuffle roles
  const shuffledRoles = [...roles].sort(() => Math.random() - 0.5);
  
  // Assign roles to players
  return players.map((player, index) => {
    const role = shuffledRoles[index];
    const commitment = generateCommitment(player.playerId, role);
    
    return {
      ...player,
      role,
      secret: role, // In a real implementation, this would be encrypted
      commitment
    };
  });
}; 