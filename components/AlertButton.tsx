'use client';

import { useState } from 'react';
import { AlertTriangle, Send, X, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCurrentLocation, formatLocation } from '@/lib/utils';
import { EMERGENCY_MESSAGE_TEMPLATE } from '@/lib/constants';

interface AlertButtonProps {
  variant?: 'trigger' | 'cancel';
  onAlertSent?: (location: string, message: string) => void;
  className?: string;
}

export function AlertButton({ 
  variant = 'trigger', 
  onAlertSent,
  className 
}: AlertButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<string>('');
  
  const handleTriggerAlert = async () => {
    setIsLoading(true);
    
    try {
      const coords = await getCurrentLocation();
      if (coords) {
        const locationStr = formatLocation(coords.latitude, coords.longitude);
        setLocation(locationStr);
        setShowConfirm(true);
      }
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const sendAlert = () => {
    const message = EMERGENCY_MESSAGE_TEMPLATE
      .replace('{location}', location)
      .replace('{timestamp}', new Date().toLocaleString());
    
    onAlertSent?.(location, message);
    setShowConfirm(false);
  };
  
  if (showConfirm) {
    return (
      <div className={cn('glass-card-strong p-6 space-y-4', className)}>
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-6 h-6 text-orange-400" />
          <h3 className="font-semibold text-lg">Send Emergency Alert?</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm text-white text-opacity-80">
            <MapPin className="w-4 h-4" />
            <span>Location: {location}</span>
          </div>
          
          <p className="text-sm text-white text-opacity-90">
            This will send an alert to your emergency contacts with your current location and timestamp.
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={sendAlert}
            className="btn-alert flex-1 flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Send Alert</span>
          </button>
          
          <button
            onClick={() => setShowConfirm(false)}
            className="btn-secondary px-4"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <button
      onClick={handleTriggerAlert}
      disabled={isLoading}
      className={cn(
        'btn-alert w-full flex items-center justify-center space-x-3',
        isLoading && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <AlertTriangle className="w-5 h-5" />
      <span>{isLoading ? 'Getting Location...' : 'Emergency Alert'}</span>
    </button>
  );
}
