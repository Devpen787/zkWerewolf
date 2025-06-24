import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import { ZKPassport } from '@zkpassport/sdk';

const IOS_URL = 'https://apps.apple.com/us/app/zkpassport/id6477371975';
const ANDROID_URL = 'https://play.google.com/store/apps/details?id=app.zkpassport.zkpassport';

const IOS_QR = 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=' + encodeURIComponent(IOS_URL);
const ANDROID_QR = 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=' + encodeURIComponent(ANDROID_URL);

const ZKVerificationPage = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(null);
  const [platform, setPlatform] = useState('iphone');
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('idle'); // idle, scanning, generating, success, error
  const navigate = useNavigate();

  useEffect(() => {
    const initZKPassport = async () => {
      try {
        setIsVerifying(true);
        setError(null);
        setVerificationStatus('idle');

        // Initialize ZKPassport with your domain
        const zkPassport = new ZKPassport(window.location.origin);

        // Create the verification request
        const queryBuilder = await zkPassport.request({
          name: 'zkWerewolf',
          logo: 'https://zkwerewolf.com/logo.png', // Replace with your actual logo URL
          purpose: 'Verify you are a real person to play zkWerewolf',
          scope: 'zkwerewolf-verification',
        });

        // Set up the verification requirements
        const {
          url,
          onRequestReceived,
          onGeneratingProof,
          onProofGenerated,
          onResult,
          onReject,
          onError,
        } = queryBuilder
          .gte('age', 18) // Require user to be 18 or older
          .done();

        // Set the QR code URL
        setQrCodeUrl(url);

        // Set up event handlers
        onRequestReceived(() => {
          setVerificationStatus('scanning');
        });

        onGeneratingProof(() => {
          setVerificationStatus('generating');
        });

        onProofGenerated(({ proof: _, vkeyHash: __, version: ___, name: ____ }) => {
          setVerificationStatus('success');
        });

        onResult(({ uniqueIdentifier: _, isVerified: __, result: ___ }) => {
          setVerificationStatus('success');
        });

        onReject(() => {
          setVerificationStatus('rejected');
          setError('Verification was rejected by the user.');
        });

        onError(() => {
          setVerificationStatus('error');
          setError('Verification failed. Please try again.');
        });

      } catch (err) {
        setError('Failed to initialize verification. Please try again.');
      } finally {
        setIsVerifying(false);
      }
    };

    if (!qrCodeUrl) {
      initZKPassport();
    }
  }, [qrCodeUrl]);

  const handleContinue = () => {
    navigate('/');
  };

  const handleBack = () => {
    navigate('/');
  };

  const getStatusMessage = () => {
    switch (verificationStatus) {
      case 'scanning':
        return 'QR code scanned! Processing...';
      case 'generating':
        return 'Generating privacy proof...';
      case 'success':
        return 'Verification successful!';
      case 'error':
        return 'Verification failed';
      default:
        return 'Scan the QR code with ZKPassport app';
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-cream-50 px-2 sm:px-4 relative">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-3 left-3 sm:top-6 sm:left-6 bg-white border border-brand-brown-200 text-brand-brown-700 hover:bg-brand-cream-100 hover:text-brand-terracotta-600 font-semibold py-1 px-3 sm:py-2 sm:px-4 rounded-lg shadow-sm transition-colors flex items-center gap-2 text-sm sm:text-base"
      >
        <span className="text-lg">←</span> Back
      </button>
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md text-center border border-brand-brown-200 mt-4 sm:mt-8 px-2 py-4 sm:px-8 sm:py-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 flex items-center justify-center gap-2">
          <span className="text-2xl sm:text-3xl">🛡️</span> ZK Passport Verification
        </h1>
        {/* MOCK/DEMO NOTICE */}
        <div className="mb-4 p-2 sm:p-4 bg-yellow-100 border border-yellow-400 text-yellow-900 rounded-lg text-left text-xs sm:text-sm font-semibold flex items-center gap-2">
          <span className="text-lg">⚠️</span>
          <span>This is a <span className="underline">mock/demo</span> of the ZK verification process. Real verification will be available once our domain is registered with ZKPassport.</span>
        </div>
        {/* Consolidated Accordions */}
        <Accordion allowZeroExpanded className="mb-3 text-left">
          {/* 1. Download App */}
          <AccordionItem uuid="download">
            <AccordionItemHeading>
              <AccordionItemButton className="accordion__button text-sm font-semibold flex items-center gap-2">
                <span>📲</span> Download ZKPassport App
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel className="accordion__panel">
              <p className="text-xs sm:text-sm text-brand-brown-700 mb-2">Select your platform and scan the QR code or tap the button to download the app.</p>
              <div className="flex justify-center gap-2 mb-2">
                <button
                  className={`px-3 py-1 rounded-l-lg border border-brand-brown-200 font-semibold transition-colors text-xs sm:text-base ${platform === 'iphone' ? 'bg-brand-terracotta-500 text-white' : 'bg-brand-brown-50 text-brand-brown-700 hover:bg-brand-brown-100'}`}
                  onClick={() => setPlatform('iphone')}
                >
                  iPhone
                </button>
                <button
                  className={`px-3 py-1 rounded-r-lg border border-brand-brown-200 font-semibold transition-colors text-xs sm:text-base ${platform === 'android' ? 'bg-brand-terracotta-500 text-white' : 'bg-brand-brown-50 text-brand-brown-700 hover:bg-brand-brown-100'}`}
                  onClick={() => setPlatform('android')}
                >
                  Android
                </button>
              </div>
              <div className="flex flex-col items-center gap-1">
                <img
                  src={platform === 'iphone' ? IOS_QR : ANDROID_QR}
                  alt={platform === 'iphone' ? 'iPhone QR' : 'Android QR'}
                  className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-lg border border-brand-brown-200 bg-white"
                />
                <a
                  href={platform === 'iphone' ? IOS_URL : ANDROID_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 sm:mt-2 bg-brand-terracotta-500 hover:bg-brand-terracotta-600 text-white font-semibold py-1 px-4 sm:py-2 sm:px-6 rounded-lg transition-colors text-xs sm:text-base shadow-soft"
                >
                  {platform === 'iphone' ? 'App Store' : 'Google Play'}
                </a>
              </div>
            </AccordionItemPanel>
          </AccordionItem>
          {/* 2. Privacy & How it Works */}
          <AccordionItem uuid="privacy">
            <AccordionItemHeading>
              <AccordionItemButton className="accordion__button text-sm font-semibold flex items-center gap-2">
                <span>🔒</span> Privacy & How it Works
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel className="accordion__panel">
              <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                <li><strong>Zero-Knowledge Proofs (ZKPs):</strong> Prove you're a real person <span className="font-semibold">without sharing your ID or personal info</span>.</li>
                <li><strong>What you upload:</strong> Only a cryptographic proof, never your documents.</li>
                <li><strong>What the game sees:</strong> Just a yes/no answer: are you a real, unique person?</li>
                <li><strong>Why trust it?</strong> ZKPs are used in privacy-first apps and blockchains. <a href="https://zkpassport.id/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-terracotta-600 underline">Learn more</a>.</li>
              </ul>
            </AccordionItemPanel>
          </AccordionItem>
          {/* 3. How to Verify (all steps inside) */}
          <AccordionItem uuid="steps">
            <AccordionItemHeading>
              <AccordionItemButton className="accordion__button text-sm font-semibold flex items-center gap-2">
                <span>✅</span> How to Verify
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel className="accordion__panel">
              <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm">
                <li>Install ZKPassport and follow the in-app steps. Your ID stays on your phone.</li>
                <li>The app creates a privacy proof that you're a real, unique person. No personal data leaves your device.</li>
                <li>Open ZKPassport, select 'Scan QR', and scan the code below. <span className="font-semibold text-yellow-700">This is a demo – no real verification yet.</span></li>
              </ol>
            </AccordionItemPanel>
          </AccordionItem>
        </Accordion>
        {/* QR Code Section with Small Demo Badge */}
        {!qrCodeUrl ? (
          <>
            <div className="flex flex-col items-center mb-3">
              <span className="inline-block bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide mb-1">Demo Mode</span>
              {qrCodeUrl ? (
                <div className="text-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrCodeUrl)}`}
                    alt="ZKPassport QR Code"
                    className="w-36 h-36 sm:w-48 sm:h-48 mx-auto rounded-lg border border-brand-brown-200 bg-white"
                  />
                  <p className="text-[11px] sm:text-xs text-brand-brown-600 mt-1">
                    {getStatusMessage()}
                  </p>
                </div>
              ) : (
                <div className="w-36 h-36 sm:w-48 sm:h-48 bg-gray-100 rounded-lg border border-brand-brown-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-brand-terracotta-500 mx-auto mb-1"></div>
                    <p className="text-xs text-brand-brown-600">Initializing verification...</p>
                  </div>
                </div>
              )}
            </div>
            {isVerifying && <div className="mb-1 text-brand-brown-600 text-xs">Verifying...</div>}
            {error && <div className="mb-1 text-red-600 text-xs">{error}</div>}
          </>
        ) : (
          <>
            <div className="mb-4 text-green-700 font-semibold flex flex-col items-center gap-2">
              <span className="text-3xl">✅</span>
              Verification successful!<br/>
              You'll see your badge throughout the game.
            </div>
            <button
              onClick={handleContinue}
              className="bg-brand-terracotta-500 hover:bg-brand-terracotta-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors text-base mt-2"
            >
              Continue to Game
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ZKVerificationPage; 