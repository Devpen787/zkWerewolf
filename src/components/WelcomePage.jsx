import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import logoImage from '../assets/logo.png';
import villager from '../assets/villager head.png';
import healer from '../assets/healer head.png';
import detective from '../assets/detective head.png';
import werewolf from '../assets/werewolf head.png';
import './WelcomePage.css';

const roles = [
  { name: 'villager', img: villager },
  { name: 'healer', img: healer },
  { name: 'detective', img: detective },
  { name: 'werewolf', img: werewolf },
];

const WelcomePage = ({ onStart }) => {
  const navigate = useNavigate();

  const handleZKPassportClick = () => {
    navigate('/zk-verification');
  };

  return (
    <div className="min-h-screen text-[#4a3f3c] flex flex-col">
      <main className="container mx-auto px-4 py-16 flex-grow">
        <div className="flex flex-col items-center text-center gap-8">
          {/* Logo Image */}
          <img
            src={logoImage}
            alt="zkWerewolf Logo"
            className="w-full max-w-lg object-contain drop-shadow-soft"
          />

          {/* Animated Role Heads */}
          <div className="flex justify-center gap-3 mt-[-12px] mb-2">
            {roles.map((role, index) => (
              <motion.img
                key={role.name}
                src={role.img}
                alt={role.name}
                className="w-16 h-16 rounded-full object-contain"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  rotate: [0, -3, 3, -3, 3, 0],
                }}
                transition={{
                  delay: index * 0.25,
                  scale: { type: 'spring', stiffness: 300, damping: 20 },
                  rotate: {
                    repeat: Infinity,
                    duration: 4,
                    repeatType: 'loop',
                    ease: 'easeInOut',
                    delay: index * 0.25 + 1.5, // start after pop-in
                  },
                }}
              />
            ))}
          </div>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-brand-brown-800 max-w-2xl font-fredoka leading-relaxed drop-shadow-soft">
            A privacy-first party game of deception and deduction.
          </p>

          {/* Play Button */}
          <button
            onClick={onStart}
            className="bg-gradient-to-r from-brand-terracotta-500 to-brand-terracotta-400 hover:from-brand-terracotta-600 hover:to-brand-terracotta-500 text-white font-bold py-4 px-12 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-strong text-xl font-fredoka tracking-wide drop-shadow-soft"
          >
            Play Now
          </button>

          {/* Play with ZK Verification Button */}
          <button
            onClick={handleZKPassportClick}
            className="mt-2 bg-white border border-brand-terracotta-500 text-brand-terracotta-600 font-bold py-3 px-12 rounded-lg transition-all duration-300 transform hover:bg-brand-terracotta-50 hover:scale-105 shadow-soft text-lg font-fredoka tracking-wide flex items-center gap-2"
          >
            <span className="text-xl">🛡️</span> Play with ZK Verification
          </button>

          {/* ZK Passport Option (optional, can be removed if redundant) */}
          {/*
          <div className="mt-8 p-4 bg-gradient-to-r from-brand-cream-50 to-brand-cream-100 rounded-lg border border-brand-brown-200 max-w-md">
            <h3 className="font-bold text-brand-brown-800 mb-2 flex items-center gap-2">
              <span className="text-lg">🛡️</span>
              Optional: ZK Passport Verification
            </h3>
            <p className="text-sm text-brand-brown-600 mb-3">
              Prove you're a real person without sharing any personal information using zero-knowledge proofs.
            </p>
            <button
              onClick={handleZKPassportClick}
              className="bg-brand-terracotta-500 hover:bg-brand-terracotta-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Learn More
            </button>
          </div>
          */}

          {/* Accordion Section */}
          <div className="w-full max-w-4xl mt-8">
            <Accordion allowZeroExpanded>
              <AccordionItem>
                <AccordionItemHeading>
                  <AccordionItemButton className="accordion__button">
                    How to Play
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel className="accordion__panel">
                  <ul className="list-disc list-inside space-y-3 text-left">
                    <li>5–15 players can join</li>
                    <li>Each player gets a secret role</li>
                    <li>Moderator guides the game through night and day cycles</li>
                    <li>
                      <strong>Night:</strong> Werewolves pick, Healer protects, Detective
                      inspects
                    </li>
                    <li>
                      <strong>Day:</strong> Players vote to eliminate someone
                    </li>
                    <li>Last team standing wins</li>
                  </ul>
                </AccordionItemPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionItemHeading>
                  <AccordionItemButton className="accordion__button">
                    Player Roles
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel className="accordion__panel">
                  <ul className="list-disc list-inside space-y-3 text-left">
                    <li>
                      <strong>Villager Pig:</strong> No powers, vote to find the
                      werewolves
                    </li>
                    <li>
                      <strong>Werewolf:</strong> Eliminate villagers, remain hidden
                    </li>
                    <li>
                      <strong>Healer Pig:</strong> Protect one person per night
                    </li>
                    <li>
                      <strong>Detective Pig:</strong> Inspect one player each night
                    </li>
                    <li>
                      <strong>Moderator:</strong> Orchestrates the flow and reveals
                      results
                    </li>
                  </ul>
                </AccordionItemPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionItemHeading>
                  <AccordionItemButton className="accordion__button">
                    About This App
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel className="accordion__panel text-left">
                  <p>
                    zkWerewolf is a privacy-first party game using simulated ZK
                    proofs to ensure secret roles and integrity. Built at ZK Hack
                    Berlin 2025 for fun and experimentation.
                  </p>
                </AccordionItemPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionItemHeading>
                  <AccordionItemButton className="accordion__button">
                    Why ZK?
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel className="accordion__panel text-left">
                  <div className="space-y-4">
                    <p>
                      Ever wished you could prove you're a Villager without showing everyone your card? That's the magic of Zero-Knowledge (ZK) proofs! In games like Werewolf, ZK tech lets you verify facts about your secret role without revealing the role itself. It's like a secret handshake that only the game's rules can understand.
                    </p>
                    <ul className="list-disc list-inside space-y-3">
                      <li>
                        <strong>True Digital Privacy:</strong> Your role stays completely secret. You can prove you're not a werewolf without ever showing your 'card', preventing accidental reveals or screen-peeking.
                      </li>
                      <li>
                        <strong>No More Peeking!</strong> ZK proofs create a 'trustless' system. You don't need to trust a human moderator (who might make mistakes) to confirm roles. The math does it for you, perfectly every time.
                      </li>
                      <li>
                        <strong>The Future is Decentralized:</strong> Imagine a fully decentralized Werewolf game running on a blockchain. ZK proofs are the key to making that happen, enabling complex, private interactions on public systems.
                      </li>
                    </ul>
                  </div>
                </AccordionItemPanel>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-brand-brown-700 font-fredoka">
        <p>Developed by Devinson Peña</p>
      </footer>
    </div>
  );
};

export default WelcomePage; 