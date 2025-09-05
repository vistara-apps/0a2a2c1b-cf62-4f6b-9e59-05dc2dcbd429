'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Square, Play, Pause, Upload, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import toast from 'react-hot-toast';

interface RecordButtonProps {
  onRecordingStart?: () => void;
  onRecordingStop?: (blob: Blob) => void;
  onRecordingUploaded?: (result: any) => void;
  className?: string;
  variant?: 'start' | 'stop';
  autoUpload?: boolean;
}

export function RecordButton({
  onRecordingStart,
  onRecordingStop,
  onRecordingUploaded,
  className,
  variant = 'start',
  autoUpload = false
}: RecordButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [uploadResult, setUploadResult] = useState<any>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { user, userLocation, setRecording, setRecordingBlob } = useAppStore();

  useEffect(() => {
    setRecording(isRecording);
    setRecordingBlob(recordedBlob);
  }, [isRecording, recordedBlob, setRecording, setRecordingBlob]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        },
        video: false 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setRecordedBlob(blob);
        onRecordingStop?.(blob);
        
        // Auto-upload if enabled
        if (autoUpload && user) {
          await uploadRecording(blob);
        }
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        toast.success('Recording completed successfully!');
      };
      
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setRecordingTime(0);
      onRecordingStart?.();
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      toast.success('Recording started');
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const uploadRecording = async (blob?: Blob) => {
    const recordingToUpload = blob || recordedBlob;
    if (!recordingToUpload || !user) {
      toast.error('No recording to upload or user not authenticated');
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('recording', recordingToUpload, `recording_${Date.now()}.webm`);
      formData.append('userId', user.id);
      
      if (userLocation) {
        formData.append('location', JSON.stringify(userLocation));
      }

      const response = await fetch('/api/recordings/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        setUploadResult(result);
        onRecordingUploaded?.(result);
        toast.success('Recording uploaded to IPFS successfully!');
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading recording:', error);
      toast.error('Failed to upload recording');
    } finally {
      setIsUploading(false);
    }
  };

  const playRecording = () => {
    if (recordedBlob && !isPlaying) {
      const audioUrl = URL.createObjectURL(recordedBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.play();
      setIsPlaying(true);
    }
  };

  const pausePlayback = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const downloadRecording = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `police_interaction_${new Date().toISOString().split('T')[0]}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Recording downloaded');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn('flex flex-col items-center space-y-4', className)}>
      {/* Main Record Button */}
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isUploading}
        className={cn(
          'w-24 h-24 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg relative',
          isRecording
            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
          isUploading && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isRecording ? (
          <Square className="w-8 h-8 text-white" />
        ) : (
          <Mic className="w-8 h-8 text-white" />
        )}
        
        {/* Recording indicator */}
        {isRecording && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full animate-ping" />
        )}
      </button>

      {/* Recording Status */}
      {isRecording && (
        <div className="text-center">
          <div className="text-red-500 font-semibold flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span>Recording...</span>
          </div>
          <div className="text-sm text-white text-opacity-70 font-mono">
            {formatTime(recordingTime)}
          </div>
        </div>
      )}

      {/* Upload Status */}
      {isUploading && (
        <div className="text-center">
          <div className="text-blue-400 font-semibold">Uploading to IPFS...</div>
          <div className="w-32 h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
            <div className="h-full bg-blue-400 rounded-full animate-pulse" />
          </div>
        </div>
      )}

      {/* Upload Success */}
      {uploadResult && (
        <div className="text-center p-3 glass-card rounded-lg">
          <div className="text-green-400 font-semibold mb-2">✅ Uploaded Successfully</div>
          <div className="text-xs text-white text-opacity-70 break-all">
            IPFS: {uploadResult.ipfsHash.substring(0, 20)}...
          </div>
        </div>
      )}

      {/* Playback and Action Controls */}
      {recordedBlob && !isRecording && (
        <div className="flex items-center space-x-3">
          <button
            onClick={isPlaying ? pausePlayback : playRecording}
            className="glass-card p-3 rounded-full hover:bg-opacity-20 transition-all duration-200"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white" />
            ) : (
              <Play className="w-5 h-5 text-white" />
            )}
          </button>
          
          <button
            onClick={downloadRecording}
            className="glass-card p-3 rounded-full hover:bg-opacity-20 transition-all duration-200"
            title="Download Recording"
          >
            <Download className="w-5 h-5 text-white" />
          </button>
          
          {!uploadResult && user && (
            <button
              onClick={() => uploadRecording()}
              disabled={isUploading}
              className="glass-card p-3 rounded-full hover:bg-opacity-20 transition-all duration-200 disabled:opacity-50"
              title="Upload to IPFS"
            >
              <Upload className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
      )}

      {/* Recording Tips */}
      {!isRecording && !recordedBlob && (
        <div className="text-center text-sm text-white text-opacity-60 max-w-xs">
          <p>Tap to start recording. Keep your device visible and announce you're recording.</p>
        </div>
      )}
    </div>
  );
}
