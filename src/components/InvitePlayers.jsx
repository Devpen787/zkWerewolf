import React from 'react';
import { useGame } from '../context/GameContext';
import { toast } from 'react-hot-toast';

const InvitePlayers = ({ encodedGameData }) => {
  const { state } = useGame();

  const getInviteMessage = () => {
    const inviteUrl = `${window.location.origin}/invite?game=${encodedGameData}`;
    return `You're invited to a game of zkWerewolf!\n\nUse this link to join the game and see your role:\n${inviteUrl}`;
  };

  const copyInvite = () => {
    if (state.players.length === 0) {
      toast.error("No players to invite!");
      return;
    }
    navigator.clipboard.writeText(getInviteMessage());
    toast.success("Invite message copied to clipboard!");
  };

  const shareToWhatsApp = () => {
    if (state.players.length === 0) {
      toast.error("No players to invite!");
      return;
    }
    const message = encodeURIComponent(getInviteMessage());
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const shareToTelegram = () => {
    if (state.players.length === 0) {
      toast.error("No players to invite!");
      return;
    }
    const inviteUrl = `${window.location.origin}/invite?game=${encodedGameData}`;
    const text = `You're invited to a game of zkWerewolf!`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(inviteUrl)}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-[#fdfaf6] rounded-xl p-8 shadow-strong">
      <h2 className="text-2xl font-semibold mb-4 font-fredoka text-center text-brand-brown-800 drop-shadow-soft">
        💌 Invite Players
      </h2>
      <p className="text-center text-brand-brown-700 mb-6">
        Share the game link with all players.
      </p>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={copyInvite}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-soft font-fredoka flex items-center justify-center"
          >
            📋 Copy Invite
          </button>
          <button
            onClick={shareToWhatsApp}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-soft font-fredoka flex items-center justify-center"
          >
            💬 WhatsApp
          </button>
          <button
            onClick={shareToTelegram}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-soft font-fredoka flex items-center justify-center"
          >
            ✈️ Telegram
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvitePlayers; 