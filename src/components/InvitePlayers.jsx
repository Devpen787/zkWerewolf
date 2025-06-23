import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { toast } from 'react-hot-toast';

const InvitePlayers = () => {
  const [inviteMessage, setInviteMessage] = useState('');
  const { state } = useGame();
  const { players } = state;

  const generateInviteMessage = (players) => {
    const base = `Join our zkWerewolf game 🐺\n\nOnly click on *your* name — don't peek at others 😉\n\n`;
    
    // Encode the entire player list into a single string
    const encodedPlayers = btoa(JSON.stringify(players));
    const productionUrl = 'https://zk-werewolf.vercel.app';

    const links = players.map(p => `${p.name}:\n${productionUrl}/player/${p.playerId}?game=${encodedPlayers}`).join('\n\n');
    return base + links;
  };

  const handleCopyInvite = () => {
    if (players.length === 0) {
      toast.error("No players to invite!");
      return;
    }
    const message = generateInviteMessage(players);
    setInviteMessage(message);
    navigator.clipboard.writeText(message);
    toast.success("Copied player links to clipboard!");
  };

  return (
    <div className="bg-[#fdfaf6] rounded-xl p-8 shadow-strong">
      <h2 className="text-2xl font-semibold mb-4 font-fredoka text-brand-brown-800 drop-shadow-soft">📨 Invite Players</h2>
      <p className="text-sm mb-4 text-brand-brown-700 font-fredoka">Click the button to generate and copy a message with links for all players.</p>
      <pre className="text-xs whitespace-pre-wrap bg-brand-brown-50 p-4 rounded-lg border border-brand-brown-200 text-brand-brown-800 shadow-inner min-h-[100px]">{inviteMessage || "Click below to generate the invite message."}</pre>
      <button
        onClick={handleCopyInvite}
        className="mt-4 w-full bg-gradient-to-r from-brand-terracotta-500 to-brand-terracotta-400 hover:from-brand-terracotta-600 hover:to-brand-terracotta-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-strong text-lg font-fredoka tracking-wide drop-shadow-soft"
      >
        📋 Copy Player Links & Message
      </button>
    </div>
  );
};

export default InvitePlayers; 