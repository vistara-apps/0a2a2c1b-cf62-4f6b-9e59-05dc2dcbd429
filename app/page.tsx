'use client';

import { useState, useEffect } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { AppFrame } from '@/components/AppFrame';
import { Header } from '@/components/Header';
import { LegalCard } from '@/components/LegalCard';
import { ScriptButton } from '@/components/ScriptButton';
import { RecordButton } from '@/components/RecordButton';
import { AlertButton } from '@/components/AlertButton';
import { ContactSelector } from '@/components/ContactSelector';
import { 
  BookOpen, 
  MessageSquare, 
  Mic, 
  AlertTriangle, 
  Share2, 
  MapPin,
  Shield,
  Users,
  FileText
} from 'lucide-react';
import { SAMPLE_LEGAL_GUIDES, SAMPLE_SCRIPTS, INTERACTION_SCENARIOS } from '@/lib/constants';
import { getUserLocation } from '@/lib/utils';
import type { Contact } from '@/components/ContactSelector';

export default function HomePage() {
  const { setFrameReady } = useMiniKit();
  const [activeTab, setActiveTab] = useState<'guides' | 'scripts' | 'record' | 'alert' | 'share'>('guides');
  const [userLocation, setUserLocation] = useState<{ state: string; city?: string } | null>(null);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [selectedScenario, setSelectedScenario] = useState('traffic_stop');
  
  useEffect(() => {
    setFrameReady();
    
    // Get user location
    getUserLocation().then(setUserLocation);
  }, [setFrameReady]);
  
  const handleRecordingStart = () => {
    console.log('Recording started');
  };
  
  const handleRecordingStop = (blob: Blob) => {
    console.log('Recording stopped, blob size:', blob.size);
    // In a real app, upload to IPFS via Pinata
  };
  
  const handleAlertSent = (location: string, message: string) => {
    console.log('Alert sent:', { location, message, contacts: selectedContacts });
    // In a real app, send via Farcaster/SMS
  };
  
  const handleShareRightsCard = () => {
    console.log('Sharing rights card for state:', userLocation?.state);
    // In a real app, generate and share via Farcaster
  };
  
  const currentGuide = userLocation ? SAMPLE_LEGAL_GUIDES[userLocation.state as keyof typeof SAMPLE_LEGAL_GUIDES] : null;
  const currentScripts = SAMPLE_SCRIPTS[selectedScenario as keyof typeof SAMPLE_SCRIPTS] || [];
  
  return (
    <AppFrame variant="constrained">
      <Header />
      
      {/* Hero Section */}
      <div className="glass-card-strong p-6 mb-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-shadow">Know Your Rights</h2>
        <p className="text-white text-opacity-80 mb-4">
          Your pocket guide to rights during police interactions
        </p>
        {userLocation && (
          <div className="flex items-center justify-center space-x-2 text-sm text-white text-opacity-70">
            <MapPin className="w-4 h-4" />
            <span>{userLocation.city}, {userLocation.state}</span>
          </div>
        )}
      </div>
      
      {/* Navigation Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {[
          { id: 'guides', label: 'Legal Guides', icon: BookOpen },
          { id: 'scripts', label: 'Scripts', icon: MessageSquare },
          { id: 'record', label: 'Record', icon: Mic },
          { id: 'alert', label: 'Alert', icon: AlertTriangle },
          { id: 'share', label: 'Share', icon: Share2 },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
              activeTab === id 
                ? 'bg-white bg-opacity-20 text-white' 
                : 'glass-card text-white text-opacity-70 hover:text-white hover:bg-opacity-15'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </div>
      
      {/* Content Sections */}
      {activeTab === 'guides' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">State-Specific Legal Guides</h3>
            <div className="text-sm text-white text-opacity-70">
              {userLocation?.state || 'Select State'}
            </div>
          </div>
          
          {currentGuide ? (
            <LegalCard
              title={currentGuide.title}
              content={currentGuide.content}
              variant="detailed"
            />
          ) : (
            <div className="glass-card p-6 text-center">
              <FileText className="w-12 h-12 text-white text-opacity-50 mx-auto mb-4" />
              <h4 className="font-semibold mb-2">No Guide Available</h4>
              <p className="text-sm text-white text-opacity-70">
                Legal guide for your state is being generated...
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(SAMPLE_LEGAL_GUIDES).map(([state, guide]) => (
              <LegalCard
                key={state}
                title={`${state} Rights`}
                content={guide.content}
                variant="base"
                onClick={() => console.log('View guide for', state)}
              />
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'scripts' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Communication Scripts</h3>
            
            {/* Scenario Selector */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {INTERACTION_SCENARIOS.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => setSelectedScenario(scenario.id)}
                  className={`glass-card p-4 text-left transition-all duration-200 ${
                    selectedScenario === scenario.id 
                      ? 'bg-opacity-25 ring-2 ring-purple-400' 
                      : 'hover:bg-opacity-20'
                  }`}
                >
                  <div className="text-2xl mb-2">{scenario.icon}</div>
                  <div className="font-medium text-sm">{scenario.title}</div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            {currentScripts.map((script) => (
              <ScriptButton
                key={script.id}
                title={script.title}
                content={script.content}
                language={script.language}
              />
            ))}
          </div>
          
          {currentScripts.length === 0 && (
            <div className="glass-card p-6 text-center">
              <MessageSquare className="w-12 h-12 text-white text-opacity-50 mx-auto mb-4" />
              <h4 className="font-semibold mb-2">No Scripts Available</h4>
              <p className="text-sm text-white text-opacity-70">
                Scripts for this scenario are being generated...
              </p>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'record' && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">One-Tap Recording</h3>
            <p className="text-white text-opacity-80 mb-8">
              Instantly start recording audio or video of your interaction
            </p>
          </div>
          
          <div className="glass-card-strong p-8">
            <RecordButton
              onRecordingStart={handleRecordingStart}
              onRecordingStop={handleRecordingStop}
              className="w-full"
            />
          </div>
          
          <div className="glass-card p-4">
            <h4 className="font-semibold mb-3 flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Recording Tips</span>
            </h4>
            <ul className="space-y-2 text-sm text-white text-opacity-80">
              <li>• Keep your phone visible and announce you're recording</li>
              <li>• Stay calm and don't interfere with police duties</li>
              <li>• Recording is legal in public spaces</li>
              <li>• Recordings are automatically saved securely</li>
            </ul>
          </div>
        </div>
      )}
      
      {activeTab === 'alert' && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Emergency Alert</h3>
            <p className="text-white text-opacity-80 mb-6">
              Send your location and situation to trusted contacts
            </p>
          </div>
          
          <ContactSelector
            selectedContacts={selectedContacts}
            onContactsChange={setSelectedContacts}
          />
          
          <AlertButton
            onAlertSent={handleAlertSent}
            className="w-full"
          />
          
          <div className="glass-card p-4">
            <h4 className="font-semibold mb-3 flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Alert Information</span>
            </h4>
            <ul className="space-y-2 text-sm text-white text-opacity-80">
              <li>• Sends your exact GPS location</li>
              <li>• Includes timestamp and situation details</li>
              <li>• Works via Farcaster, SMS, or email</li>
              <li>• Contacts can track your situation in real-time</li>
            </ul>
          </div>
        </div>
      )}
      
      {activeTab === 'share' && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Share Rights Card</h3>
            <p className="text-white text-opacity-80 mb-6">
              Generate and share know-your-rights information
            </p>
          </div>
          
          {currentGuide && (
            <LegalCard
              title={`${userLocation?.state} Rights Card`}
              content={currentGuide.content}
              variant="shareable"
              onShare={handleShareRightsCard}
            />
          )}
          
          <div className="space-y-4">
            <button 
              onClick={handleShareRightsCard}
              className="btn-primary w-full flex items-center justify-center space-x-3"
            >
              <Share2 className="w-5 h-5" />
              <span>Share on Farcaster</span>
            </button>
            
            <button className="btn-secondary w-full flex items-center justify-center space-x-3">
              <FileText className="w-5 h-5" />
              <span>Generate PDF</span>
            </button>
          </div>
          
          <div className="glass-card p-4">
            <h4 className="font-semibold mb-3 flex items-center space-x-2">
              <Share2 className="w-5 h-5" />
              <span>Sharing Options</span>
            </h4>
            <ul className="space-y-2 text-sm text-white text-opacity-80">
              <li>• Share as Farcaster cast with your network</li>
              <li>• Generate downloadable PDF for offline use</li>
              <li>• Create shareable link for social media</li>
              <li>• Mint as NFT for permanent record</li>
            </ul>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-white border-opacity-20">
        <div className="text-center text-sm text-white text-opacity-60">
          <p>RightsSphere - Empowering citizens with legal knowledge</p>
          <p className="mt-2">Always consult with a qualified attorney for legal advice</p>
        </div>
      </div>
    </AppFrame>
  );
}
