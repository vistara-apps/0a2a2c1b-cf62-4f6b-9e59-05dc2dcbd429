'use client';

import { useState, useRef } from 'react';
import { Mic, Square, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecordButtonProps {
  variant?: 'start' | 'stop';
  onRecordingStart?: () => void;
  onRecordingStop?: (blob: Blob) => void;
  className?: string;
}

export function RecordButton({ 
  variant = 'start', 
  onRecordingStart,
  onRecordingStop,
  className 
}: RecordButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        onRecordingStop?.(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      onRecordingStart?.();
      
      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className={cn('flex flex-col items-center space-y-4', className)}>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={cn(
          'recording-button',
          isRecording ? 'recording-active' : 'recording-inactive'
        )}
      >
        {isRecording ? (
          <Square className="w-8 h-8 text-white" />
        ) : (
          <Mic className="w-8 h-8 text-white" />
        )}
      </button>
      
      {isRecording && (
        <div className="text-center">
          <div className="text-lg font-mono text-white">
            {formatTime(recordingTime)}
          </div>
          <div className="text-sm text-white text-opacity-80">
            Recording...
          </div>
        </div>
      )}
      
      {!isRecording && recordingTime === 0 && (
        <div className="text-center">
          <div className="text-sm text-white text-opacity-80">
            Tap to start recording
          </div>
        </div>
      )}
    </div>
  );
}
