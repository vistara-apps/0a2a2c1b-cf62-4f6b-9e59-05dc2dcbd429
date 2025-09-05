import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Get user's approximate location based on IP (mock implementation)
export async function getUserLocation(): Promise<{ state: string; city?: string }> {
  // In a real implementation, this would use IP geolocation or browser geolocation API
  // For demo purposes, return a default location
  return { state: 'California', city: 'San Francisco' };
}

// Format timestamp for display
export function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Copy text to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
}

// Get current location coordinates (mock implementation)
export async function getCurrentLocation(): Promise<{ latitude: number; longitude: number } | null> {
  return new Promise((resolve) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          // Return mock coordinates for demo
          resolve({ latitude: 37.7749, longitude: -122.4194 });
        }
      );
    } else {
      resolve({ latitude: 37.7749, longitude: -122.4194 });
    }
  });
}

// Format location for display
export function formatLocation(latitude: number, longitude: number): string {
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
}
