'use client';

import { Shield, Menu, User } from 'lucide-react';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name } from '@coinbase/onchainkit/identity';

export function Header() {
  return (
    <header className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-shadow">RightsSphere</h1>
          <p className="text-sm text-white text-opacity-80">Know Your Rights</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Wallet>
          <ConnectWallet className="btn-secondary text-sm px-4 py-2">
            <Name />
          </ConnectWallet>
        </Wallet>
        <button className="glass-card p-2 rounded-lg">
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
