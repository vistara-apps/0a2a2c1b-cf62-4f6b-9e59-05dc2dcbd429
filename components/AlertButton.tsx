'use client';

import { useState } from 'react';
import { AlertTriangle, Send, X, MapPin, Clock, Users, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCurrentLocation, formatLocation } from '@/lib/utils';
import { EMERGENCY_MESSAGE_TEMPLATE } from '@/lib/constants';
import { useAppStore } from '@/lib/store';
import toast from 'react-hot-toast';

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
  const [isSending, setIsSending] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const [location, setLocation] = useState<any>(null);
  const [alertResult, setAlertResult] = useState<any>(null);
  
  const { user, selectedContacts, userLocation } = useAppStore();
  
  const handleTriggerAlert = async () => {
    if (!user) {
      toast.error('Please authenticate to send alerts');
      return;
    }

    if (selectedContacts.length === 0) {
      toast.error('Please select emergency contacts first');
      return;
    }

    setIsLoading(true);
    
    try {
      // Try to get current location, fallback to stored location
      let currentLocation = userLocation;
      
      try {
        const coords = await getCurrentLocation();
        if (coords) {
          currentLocation = {
            state: userLocation?.state || 'Unknown',
            city: userLocation?.city,
            latitude: coords.latitude,
            longitude: coords.longitude
          };
        }
      } catch (error) {
        console.warn('Could not get current location, using stored location');
      }
      
      if (!currentLocation) {
        toast.error('Location is required for emergency alerts');
        return;
      }
      
      setLocation(currentLocation);
      setShowConfirm(true);
    } catch (error) {
      console.error('Error preparing alert:', error);
      toast.error('Failed to prepare emergency alert');
    } finally {
      setIsLoading(false);
    }
  };
  
  const sendAlert = async () => {
    if (!user || !location) return;
    
    setIsSending(true);
    
    try {
      const locationString = location.latitude && location.longitude
        ? `${location.latitude}, ${location.longitude}`
        : `${location.city}, ${location.state}`;
      
      const message = EMERGENCY_MESSAGE_TEMPLATE
        .replace('{location}', locationString)
        .replace('{timestamp}', new Date().toLocaleString());

      const response = await fetch('/api/alerts/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          location,
          contacts: selectedContacts,
          customMessage: message,
          alertType: 'emergency'
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setAlertResult(result);
        setAlertSent(true);
        onAlertSent?.(locationString, message);
        toast.success(`Alert sent to ${result.sentCount} contacts successfully!`);
      } else {
        throw new Error(result.error || 'Failed to send alert');
      }
    } catch (error) {
      console.error('Error sending alert:', error);
      toast.error('Failed to send emergency alert');
    } finally {
      setIsSending(false);
    }
  };

  const resetAlert = () => {
    setShowConfirm(false);
    setAlertSent(false);
    setAlertResult(null);
    setLocation(null);
  };
  
  // Alert sent confirmation
  if (alertSent && alertResult) {
    return (
      <div className={cn('glass-card-strong p-6 space-y-4', className)}>
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-6 h-6 text-green-400" />
          <h3 className="font-semibold text-lg text-green-400">Alert Sent Successfully!</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm text-white text-opacity-80">
            <Users className="w-4 h-4" />
            <span>Sent to {alertResult.sentCount} contacts</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-white text-opacity-80">
            <Clock className="w-4 h-4" />
            <span>Sent at {new Date().toLocaleTimeString()}</span>
          </div>
          
          {location && (
            <div className="flex items-center space-x-2 text-sm text-white text-opacity-80">
              <MapPin className="w-4 h-4" />
              <span>
                {location.latitude && location.longitude 
                  ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
                  : `${location.city}, ${location.state}`
                }
              </span>
            </div>
          )}
        </div>
        
        <button
          onClick={resetAlert}
          className="btn-secondary w-full"
        >
          Close
        </button>
      </div>
    );
  }
  
  // Confirmation dialog
  if (showConfirm) {
    return (
      <div className={cn('glass-card-strong p-6 space-y-4', className)}>
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-6 h-6 text-orange-400" />
          <h3 className="font-semibold text-lg">Send Emergency Alert?</h3>
        </div>
        
        <div className="space-y-3">
          {location && (
            <div className="flex items-center space-x-2 text-sm text-white text-opacity-80">
              <MapPin className="w-4 h-4" />
              <span>
                Location: {location.latitude && location.longitude 
                  ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
                  : `${location.city}, ${location.state}`
                }
              </span>
            </div>
          )}
          
          <div className="flex items-center space-x-2 text-sm text-white text-opacity-80">
            <Users className="w-4 h-4" />
            <span>Contacts: {selectedContacts.length} selected</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-white text-opacity-80">
            <Clock className="w-4 h-4" />
            <span>Time: {new Date().toLocaleString()}</span>
          </div>
          
          <p className="text-sm text-white text-opacity-90">
            This will send an emergency alert to your selected contacts with your current location and timestamp.
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={sendAlert}
            disabled={isSending}
            className={cn(
              'btn-alert flex-1 flex items-center justify-center space-x-2',
              isSending && 'opacity-50 cursor-not-allowed'
            )}
          >
            <Send className="w-4 h-4" />
            <span>{isSending ? 'Sending...' : 'Send Alert'}</span>
          </button>
          
          <button
            onClick={() => setShowConfirm(false)}
            disabled={isSending}
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
      disabled={isLoading || !user}
      className={cn(
        'btn-alert w-full flex items-center justify-center space-x-3',
        (isLoading || !user) && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <AlertTriangle className="w-5 h-5" />
      <span>
        {isLoading 
          ? 'Getting Location...' 
          : !user 
            ? 'Sign In to Send Alerts'
            : selectedContacts.length === 0
              ? 'Select Contacts First'
              : 'Emergency Alert'
        }
      </span>
    </button>
  );
}
