import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { toast } from 'react-hot-toast';
import LZString from 'lz-string';

const InvitePlayers = () => {
  const [inviteMessage, setInviteMessage] = useState('');
  const { state } = useGame();

  const encodedGameData = useMemo(() => {
    if (state.players.length === 0) return '';
    const json = JSON.stringify(state.players);
    return LZString.compressToEncodedURIComponent(json);
  }, [state.players]);

  const generateAndCopyMessage = () => {
    if (state.players.length === 0) {
      toast.error("No players to invite!");
      return;
    }

    const baseUrl = 'https://zk-werewolf.vercel.app';
    let message = "Join our zkWerewolf game 🐺\n\n";
    message += "Only click on *your* name — don't peek at others 😉\n\n";

    const playerLinks = state.players.map(player => {
      const playerUrl = `${baseUrl}/player/${player.playerId}?game=${encodedGameData}`;
      return `${player.name}:\n${playerUrl}`;
    }).join('\n\n');

    const finalMessage = `${message}${playerLinks}`;
    
    setInviteMessage(finalMessage);
    navigator.clipboard.writeText(finalMessage);
    toast.success("Invite message copied to clipboard!");
  };

  return (
    <div className="bg-[#fdfaf6] rounded-xl p-8 shadow-strong">
      <h2 className="text-2xl font-semibold mb-4 font-fredoka text-center text-brand-brown-800 drop-shadow-soft">
        💌 Invite Players
      </h2>
      <p className="text-center text-brand-brown-700 mb-6">
        Click the button to generate and copy a message with links for all players.
      </p>
      
      <div className="space-y-4">
        <pre className="text-xs whitespace-pre-wrap bg-brand-brown-50 p-4 rounded-lg border border-brand-brown-200 text-brand-brown-800 shadow-inner min-h-[100px] overflow-auto">{inviteMessage || "Click below to generate the invite message."}</pre>
        <button
          onClick={generateAndCopyMessage}
          className="w-full bg-gradient-to-r from-brand-terracotta-500 to-brand-terracotta-400 hover:from-brand-terracotta-600 hover:to-brand-terracotta-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-strong text-lg font-fredoka tracking-wide drop-shadow-soft"
        >
          Generate & Copy Invite
        </button>
      </div>
    </div>
  );
};

export default InvitePlayers; 