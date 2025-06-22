import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';

import logoImage from '../assets/logo.png';
import './WelcomePage.css';

const WelcomePage = ({ onStart }) => {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="container mx-auto px-4 py-8 md:py-12 text-center">
        {/* Logo Image */}
        <img
          src={logoImage}
          alt="zkWerewolf Logo"
          className="mx-auto w-full max-w-md md:max-w-lg h-auto"
        />

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold mt-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          zkWerewolf
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-300 mt-4 mb-8 max-w-2xl mx-auto">
          A privacy-first party game of deception and deduction.
        </p>

        {/* Play Button */}
        <button
          onClick={onStart}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg text-xl"
        >
          Play Now
        </button>
      </div>

      {/* Accordion Section */}
      <div className="max-w-4xl mx-auto px-4 pt-4 pb-12">
        <Accordion allowZeroExpanded>
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButton className="accordion__button font-semibold text-lg">
                How to Play
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel className="accordion__panel">
              <ul className="list-disc list-inside space-y-2">
                <li>5–15 players can join</li>
                <li>Each player gets a secret role</li>
                <li>Moderator guides the game through night and day cycles</li>
                <li>Night: Werewolves pick, Healer protects, Detective inspects</li>
                <li>Day: Players vote to eliminate someone</li>
                <li>Last team standing wins</li>
              </ul>
            </AccordionItemPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButton className="accordion__button font-semibold text-lg">
                Player Roles
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel className="accordion__panel">
              <ul className="list-disc list-inside space-y-2">
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
              <AccordionItemButton className="accordion__button font-semibold text-lg">
                About This App
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel className="accordion__panel">
              <p>
                zkWerewolf is a privacy-first party game using simulated ZK
                proofs to ensure secret roles and integrity. Built at ZK Hack
                Berlin 2025 for fun and experimentation.
              </p>
            </AccordionItemPanel>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500">
        <p>Developed by Devinson Peña</p>
      </footer>
    </div>
  );
};

export default WelcomePage; 