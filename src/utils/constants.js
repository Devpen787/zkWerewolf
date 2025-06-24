// API Endpoints
export const TINYURL_API = 'https://tinyurl.com/api-create.php';

// Share URLs
export const WHATSAPP_SHARE_URL = 'https://wa.me/?text=';
export const TELEGRAM_SHARE_URL = 'https://t.me/share/url?text=';

// Messages
export const SHARE_MESSAGES = {
  INTRO: 'Welcome to the game! 🎲',
  INSTRUCTIONS: 'Only click on your own name to see your role:',
  OUTRO: 'Good luck, and may the odds be in your favor! 🍀'
};

// Toast Messages
export const TOAST_MESSAGES = {
  COPY_SUCCESS: 'Copied all player links!',
  INVALID_GAME_LINK: 'Invalid game link.',
  URL_SHORTEN_FAILED: 'Failed to shorten some URLs, using original links.'
};

// Error Messages
export const ERROR_MESSAGES = {
  PARSE_GAME_DATA: 'Failed to parse game data from URL',
  LOAD_STORAGE: 'Failed to load game state from localStorage',
  INVALID_TINYURL_RESPONSE: 'Invalid response from TinyURL'
};

// Configuration
export const TINYURL_CONFIG = {
  MAX_RETRIES: 2,
  RETRY_DELAY: 1000, // milliseconds
  TIMEOUT: 5000 // milliseconds
}; 