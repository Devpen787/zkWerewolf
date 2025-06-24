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
  const [verified, setVerified] = useState(false);
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
          requestId,
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
          console.log('Request received - user scanned QR code');
          setVerificationStatus('scanning');
        });

        onGeneratingProof(() => {
          console.log('Generating proof');
          setVerificationStatus('generating');
        });

        onProofGenerated(({ proof, vkeyHash, version, name }) => {
          console.log('Proof generated:', { proof, vkeyHash, version, name });
        });

        onResult(({ uniqueIdentifier, verified: isVerified, result }) => {
          console.log('Verification result:', { uniqueIdentifier, isVerified, result });
          
          if (isVerified) {
            setVerified(true);
            setIsVerifying(false);
            setError(null);
            setVerificationStatus('success');
            localStorage.setItem('zkPassportVerified', 'true');
            localStorage.setItem('zkPassportUserId', uniqueIdentifier);
          } else {
            setError('Verification failed. Please try again.');
            setIsVerifying(false);
            setVerificationStatus('error');
          }
        });

        onReject(() => {
          console.log('Verification rejected by user');
          setError('Verification was rejected by user.');
          setIsVerifying(false);
          setVerificationStatus('error');
        });

        onError((error) => {
          console.error('Verification error:', error);
          setError(`Verification error: ${error}`);
          setIsVerifying(false);
          setVerificationStatus('error');
        });

      } catch (err) {
        console.error('ZKPassport initialization error:', err);
        setError(err?.message || 'Failed to initialize verification. Please try again.');
        setIsVerifying(false);
        setVerificationStatus('error');
      }
    };

    if (!verified && !qrCodeUrl) {
      initZKPassport();
    }
  }, [verified, qrCodeUrl]);

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-cream-50 px-4 relative">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 bg-white border border-brand-brown-200 text-brand-brown-700 hover:bg-brand-cream-100 hover:text-brand-terracotta-600 font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors flex items-center gap-2"
      >
        <span className="text-lg">←</span> Back
      </button>
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center border border-brand-brown-200 mt-8">
        <h1 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
          <span className="text-3xl">🛡️</span> ZK Passport Verification
        </h1>
        {/* Download ZKPassport App Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Download ZKPassport</h2>
          <p className="text-sm text-brand-brown-700 mb-3">Select your platform and scan the QR code or tap the button to download the app.</p>
          <div className="flex justify-center gap-2 mb-3">
            <button
              className={`px-4 py-2 rounded-l-lg border border-brand-brown-200 font-semibold transition-colors ${platform === 'iphone' ? 'bg-brand-terracotta-500 text-white' : 'bg-brand-brown-50 text-brand-brown-700 hover:bg-brand-brown-100'}`}
              onClick={() => setPlatform('iphone')}
            >
              iPhone
            </button>
            <button
              className={`px-4 py-2 rounded-r-lg border border-brand-brown-200 font-semibold transition-colors ${platform === 'android' ? 'bg-brand-terracotta-500 text-white' : 'bg-brand-brown-50 text-brand-brown-700 hover:bg-brand-brown-100'}`}
              onClick={() => setPlatform('android')}
            >
              Android
            </button>
          </div>
          <div className="flex flex-col items-center gap-2">
            <img
              src={platform === 'iphone' ? IOS_QR : ANDROID_QR}
              alt={platform === 'iphone' ? 'iPhone QR' : 'Android QR'}
              className="w-32 h-32 mx-auto rounded-lg border border-brand-brown-200 bg-white"
            />
            <a
              href={platform === 'iphone' ? IOS_URL : ANDROID_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 bg-brand-terracotta-500 hover:bg-brand-terracotta-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors text-base shadow-soft"
            >
              {platform === 'iphone' ? 'Download on the App Store' : 'Get it on Google Play'}
            </a>
          </div>
        </div>
        {/* Privacy/Safety Disclaimer */}
        <div className="mb-4 p-4 bg-brand-brown-50 border border-brand-brown-200 rounded-lg text-left text-sm text-brand-brown-700">
          <strong>Your privacy is protected.</strong> This process uses zero-knowledge proofs (ZKPs) to verify you're a real person—<span className="font-semibold text-brand-terracotta-600">without uploading your ID or any personal documents</span>. Only a cryptographic proof is shared, not your identity. <a href="https://zkpassport.id/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-terracotta-600 underline">Learn more about ZK Passport privacy</a>.
        </div>
        {/* How it Works Accordion */}
        <Accordion allowZeroExpanded className="mb-4 text-left">
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButton className="accordion__button">
                How ZK Verification Works
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel className="accordion__panel">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  <strong>Zero-Knowledge Proofs (ZKPs):</strong> These are special cryptographic proofs that let you prove something is true (like "I'm a real person") <span className="font-semibold">without revealing any private details</span>.
                </li>
                <li>
                  <strong>What you do:</strong> You use the ZK Passport app to scan your ID <span className="italic">(on your phone only)</span> and generate a proof.
                </li>
                <li>
                  <strong>What you upload:</strong> Only the proof—<span className="font-semibold text-brand-terracotta-600">never your ID or personal info</span>.
                </li>
                <li>
                  <strong>What the game sees:</strong> Just a "yes/no" answer: is this a real, unique person? No other data is shared.
                </li>
                <li>
                  <strong>Why trust it?</strong> ZKPs are used in privacy-first apps and blockchains. <a href="https://zkpassport.id/" target="_blank" rel="noopener noreferrer" className="text-brand-terracotta-600 underline">Read more</a>.
                </li>
              </ul>
            </AccordionItemPanel>
          </AccordionItem>
        </Accordion>
        {!verified ? (
          <>
            <ol className="text-left mb-4 text-sm text-brand-brown-700 list-decimal list-inside space-y-1">
              <li>Download the ZK Passport app and scan your ID</li>
              <li>Generate a privacy-proof on your phone</li>
              <li>Scan the QR code below to complete verification</li>
            </ol>
            <div className="flex flex-col items-center mb-4">
              {qrCodeUrl ? (
                <div className="text-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeUrl)}`}
                    alt="ZKPassport QR Code"
                    className="w-48 h-48 mx-auto rounded-lg border border-brand-brown-200 bg-white"
                  />
                  <p className="text-xs text-brand-brown-600 mt-2">
                    {getStatusMessage()}
                  </p>
                </div>
              ) : (
                <div className="w-48 h-48 bg-gray-100 rounded-lg border border-brand-brown-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-terracotta-500 mx-auto mb-2"></div>
                    <p className="text-sm text-brand-brown-600">Initializing verification...</p>
                  </div>
                </div>
              )}
            </div>
            {isVerifying && <div className="mb-2 text-brand-brown-600">Verifying...</div>}
            {error && <div className="mb-2 text-red-600">{error}</div>}
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