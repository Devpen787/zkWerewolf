import React, { useEffect, useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { toast } from 'react-hot-toast';
import { WhatsAppIcon, TelegramIcon } from './Icons';
import { 
  TINYURL_API, 
  WHATSAPP_SHARE_URL, 
  TELEGRAM_SHARE_URL, 
  SHARE_MESSAGES, 
  TOAST_MESSAGES, 
  ERROR_MESSAGES, 
  TINYURL_CONFIG 
} from '../utils/constants';
import PropTypes from 'prop-types';

const InvitePlayers = ({ encodedGameData }) => {
  const { state } = useGame();
  const [shortLinks, setShortLinks] = useState({});
  const [loadingLinks, setLoadingLinks] = useState({});
  const [showTelegramModal, setShowTelegramModal] = useState(false);

  // Generate a unique invite link for a player
  const getPlayerInviteUrl = (playerId) => {
    return `${window.location.origin}/player/${playerId}?game=${encodedGameData}`;
  };

  // Helper to fetch short URL for a single player (for Retry)
  const fetchShortUrlForPlayer = useCallback((player) => {
    const longUrl = `${window.location.origin}/player/${player.playerId}?game=${encodedGameData}`;
    setLoadingLinks((prev) => ({ ...prev, [player.playerId]: true }));
    const fetchShortUrl = async (retryCount = 0) => {
      try {
        const response = await fetch(
          `${TINYURL_API}?url=${encodeURIComponent(longUrl)}`
        );
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const shortUrl = await response.text();
        if (shortUrl && shortUrl.startsWith('http')) {
          setShortLinks((prev) => ({ ...prev, [player.playerId]: shortUrl }));
        } else {
          throw new Error(ERROR_MESSAGES.INVALID_TINYURL_RESPONSE);
        }
      } catch (error) {
        if (retryCount < TINYURL_CONFIG.MAX_RETRIES) {
          setTimeout(() => fetchShortUrl(retryCount + 1), TINYURL_CONFIG.RETRY_DELAY);
          return;
        }
        setShortLinks((prev) => ({ ...prev, [player.playerId]: longUrl }));
        console.warn(`Failed to shorten URL for ${player.name} after ${retryCount + 1} attempts:`, error.message);
      } finally {
        setLoadingLinks((prev) => ({ ...prev, [player.playerId]: false }));
      }
    };
    fetchShortUrl();
  }, [encodedGameData]);

  // Fetch short URLs for all players when component mounts or data changes
  useEffect(() => {
    // Only proceed if we have players and encoded game data
    if (!state.players?.length || !encodedGameData) {
      return;
    }

    // Reset state for fresh generation
    setShortLinks({});
    setLoadingLinks({});
    
    state.players.forEach((player) => {
      fetchShortUrlForPlayer(player);
    });
  }, [state.players, encodedGameData, fetchShortUrlForPlayer]);

  // Generate the formatted list of player links (using short links if available)
  const getFormattedLinks = () => {
    const intro = `${SHARE_MESSAGES.INTRO}

${SHARE_MESSAGES.INSTRUCTIONS}
`;
    const links = state.players
      .map((player) => `${player.name}: ${shortLinks[player.playerId] || getPlayerInviteUrl(player.playerId)}`)
      .join('\n\n'); // Extra line between each player

    const outro = `

${SHARE_MESSAGES.OUTRO}`;

    return `${intro}\n${links}${outro}`;
  };

  // Copy all links to clipboard
  const copyAllLinks = () => {
    const links = getFormattedLinks();
    navigator.clipboard.writeText(links);
    toast.success(TOAST_MESSAGES.COPY_SUCCESS);
  };

  // WhatsApp and Telegram share URLs
  const getWhatsappShareUrl = () => {
    return `${WHATSAPP_SHARE_URL}${encodeURIComponent(getFormattedLinks())}`;
  };
  const getTelegramShareUrl = () => {
    return `https://t.me/share/url?text=${encodeURIComponent(getFormattedLinks())}`;
  };
  const getTelegramDeepLink = () => {
    return `tg://share?text=${encodeURIComponent(getFormattedLinks())}`;
  };

  // Telegram share modal handlers
  const handleTelegramShare = (e) => {
    e.preventDefault();
    setShowTelegramModal(true);
  };
  const handleOpenTelegram = () => {
    // Try tg:// deep link first
    window.location.href = getTelegramDeepLink();
    // Fallback to https after 1 second
    setTimeout(() => {
      window.open(getTelegramShareUrl(), '_blank', 'noopener');
    }, 1000);
    setShowTelegramModal(false);
  };
  const handleCopyTelegram = () => {
    navigator.clipboard.writeText(getFormattedLinks());
    toast.success('Copied invite message to clipboard!');
    setShowTelegramModal(false);
  };
  const handleCancelTelegram = () => {
    setShowTelegramModal(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-[#fdfaf6] rounded-xl p-8 shadow-strong mb-8">
      <h2 className="text-3xl font-semibold mb-4">Invite Players</h2>
      <div className="mb-6">
        <h3 className="text-xl font-medium mb-2">Players</h3>
        <ul className="list-disc pl-6">
          {state.players.map((player) => (
            <li key={player.playerId} className="mb-1">{player.name}</li>
          ))}
        </ul>
      </div>
      <hr className="my-6" />
      <div className="mb-6">
        <h3 className="text-xl font-medium mb-2">Player Links</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="text-left font-semibold pb-2 pr-4">Name</th>
                <th className="text-left font-semibold pb-2">Invite Link</th>
              </tr>
            </thead>
            <tbody>
              {state.players.map((player) => (
                <tr key={player.playerId}>
                  <td className="pr-4 py-1 align-top whitespace-nowrap">{player.name}</td>
                  <td className="py-1 align-top">
                    {loadingLinks[player.playerId] ? (
                      <span className="text-gray-400 italic">Shortening...</span>
                    ) : (
                      <>
                        <a
                          href={shortLinks[player.playerId] || getPlayerInviteUrl(player.playerId)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline break-all hover:text-blue-800"
                        >
                          {shortLinks[player.playerId] || getPlayerInviteUrl(player.playerId)}
                        </a>
                        {/* Retry button if shortening failed */}
                        {shortLinks[player.playerId] === getPlayerInviteUrl(player.playerId) && (
                          <button
                            className="ml-2 px-2 py-1 bg-yellow-200 text-yellow-900 rounded text-xs font-semibold border border-yellow-400 hover:bg-yellow-300 transition"
                            onClick={() => fetchShortUrlForPlayer(player)}
                            disabled={loadingLinks[player.playerId]}
                            title="Retry shortening this link"
                          >
                            Retry
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition"
          onClick={copyAllLinks}
          title="Copy all player links to clipboard"
        >
          Copy All Links
        </button>
        <a
          href={getWhatsappShareUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white px-4 py-2 rounded flex items-center justify-center hover:bg-green-600 transition"
          title="Share all links via WhatsApp"
        >
          <WhatsAppIcon /> Share via WhatsApp
        </a>
        <button
          onClick={handleTelegramShare}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center hover:bg-blue-600 transition"
          title="Share all links via Telegram"
        >
          <TelegramIcon /> Share via Telegram
        </button>
      </div>
      {/* Telegram Share Modal */}
      {showTelegramModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-xs w-full text-center border border-brand-brown-200">
            <h3 className="text-lg font-bold mb-2">Share on Telegram</h3>
            <p className="text-sm text-brand-brown-700 mb-4">Do you want to open Telegram to share the invite, or copy the message to your clipboard?</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleOpenTelegram}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Open Telegram
              </button>
              <button
                onClick={handleCopyTelegram}
                className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={handleCancelTelegram}
                className="bg-gray-200 hover:bg-gray-300 text-brand-brown-700 font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

InvitePlayers.propTypes = {
  encodedGameData: PropTypes.string.isRequired,
};

export default InvitePlayers; 