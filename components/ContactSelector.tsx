'use client';

import { useState } from 'react';
import { Users, Plus, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Contact {
  id: string;
  name: string;
  type: 'farcaster' | 'sms' | 'email';
  value: string;
}

interface ContactSelectorProps {
  variant?: 'single' | 'multiple';
  selectedContacts?: Contact[];
  onContactsChange?: (contacts: Contact[]) => void;
  className?: string;
}

const SAMPLE_CONTACTS: Contact[] = [
  { id: '1', name: 'Emergency Contact', type: 'sms', value: '+1234567890' },
  { id: '2', name: 'Family Member', type: 'farcaster', value: '@family' },
  { id: '3', name: 'Legal Aid', type: 'email', value: 'help@legalaid.org' },
];

export function ContactSelector({ 
  variant = 'multiple', 
  selectedContacts = [],
  onContactsChange,
  className 
}: ContactSelectorProps) {
  const [contacts] = useState<Contact[]>(SAMPLE_CONTACTS);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const toggleContact = (contact: Contact) => {
    if (variant === 'single') {
      onContactsChange?.([contact]);
      return;
    }
    
    const isSelected = selectedContacts.some(c => c.id === contact.id);
    if (isSelected) {
      onContactsChange?.(selectedContacts.filter(c => c.id !== contact.id));
    } else {
      onContactsChange?.([...selectedContacts, contact]);
    }
  };
  
  const isSelected = (contact: Contact) => 
    selectedContacts.some(c => c.id === contact.id);
  
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Emergency Contacts</span>
        </h3>
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="glass-card p-2 rounded-lg hover:bg-opacity-20 transition-all duration-200"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>
      
      <div className="space-y-2">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            onClick={() => toggleContact(contact)}
            className={cn(
              'glass-card p-4 cursor-pointer transition-all duration-200',
              isSelected(contact) ? 'bg-opacity-25 ring-2 ring-green-400' : 'hover:bg-opacity-20'
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{contact.name}</div>
                <div className="text-sm text-white text-opacity-70">
                  {contact.type}: {contact.value}
                </div>
              </div>
              
              {isSelected(contact) && (
                <Check className="w-5 h-5 text-green-400" />
              )}
            </div>
          </div>
        ))}
      </div>
      
      {showAddForm && (
        <div className="glass-card-strong p-4 space-y-3">
          <h4 className="font-medium">Add New Contact</h4>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Contact Name"
              className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-3 py-2 text-white placeholder-white placeholder-opacity-60"
            />
            <select className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-3 py-2 text-white">
              <option value="sms">SMS</option>
              <option value="farcaster">Farcaster</option>
              <option value="email">Email</option>
            </select>
            <input
              type="text"
              placeholder="Contact Info"
              className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-3 py-2 text-white placeholder-white placeholder-opacity-60"
            />
          </div>
          <button className="btn-primary w-full">Add Contact</button>
        </div>
      )}
    </div>
  );
}
