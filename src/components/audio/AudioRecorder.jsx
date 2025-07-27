import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MicOff, Square, Play, Pause, Download } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import toWav from 'audiobuffer-to-wav';

export default function AudioRecorder({ onRecordingComplete }) {
  const { t } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      const chunks = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        
        stream.getTracks().forEach(track => track.stop());
        
        if (onRecordingComplete) {
          const file = new File([blob], `recording-${Date.now()}.webm`, { type: 'audio/webm' });
          onRecordingComplete(file);
        }
      };
      
      // Setup audio visualization
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Start visualization
      draw();
      
    } catch (err) {
      setError(t('error_mic_access'));
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  };

  const draw = () => {
    if (!isRecording || !canvasRef.current || !analyserRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyserRef.current.frequencyBinCount;
    
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    
    ctx.fillStyle = 'rgb(15, 23, 42)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArrayRef.current[i] / 255) * canvas.height;
      
      const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
      gradient.addColorStop(0, '#3b82f6');
      gradient.addColorStop(1, '#1e40af');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      
      x += barWidth + 1;
    }
    
    animationRef.current = requestAnimationFrame(draw);
  };

  const playRecording = () => {
    if (audioRef.current && audioURL) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const downloadRecording = async () => {
    if (!recordedBlob) return;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const arrayBuffer = await recordedBlob.arrayBuffer();

    audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
      const wavBuffer = toWav(audioBuffer);

      const wavBlob = new Blob([new DataView(wavBuffer)], {
        type: 'audio/wav',
      });

      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recording-${new Date().toISOString().slice(0, 19)}.wav`;
      a.click();
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* Visualization Canvas */}
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={400}
              height={120}
              className="w-full h-20 bg-slate-900 rounded-lg shadow-inner"
            />
            {!isRecording && !recordedBlob && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-400 text-sm">{t('waveform_display_area')}</p>
              </div>
            )}
          </div>

          {/* Recording Timer */}
          <div className="text-3xl font-mono font-bold text-gray-700">
            {formatTime(recordingTime)}
          </div>

          {/* Recording Controls */}
          <div className="flex justify-center space-x-4">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                size="lg"
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Mic className="w-6 h-6 mr-2" />
                {t('start_recording')}
              </Button>
            ) : (
              <Button
                onClick={stopRecording}
                size="lg"
                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Square className="w-6 h-6 mr-2" />
                {t('stop_recording')}
              </Button>
            )}
          </div>

          {/* Playback Controls */}
          {recordedBlob && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <audio
                ref={audioRef}
                src={audioURL}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
              
              <div className="flex justify-center space-x-3">
                <Button
                  onClick={playRecording}
                  variant="outline"
                  size="sm"
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {isPlaying ? t('pause') : t('play')}
                </Button>
                
                <Button
                  onClick={downloadRecording}
                  variant="outline"
                  size="sm"
                  className="border-green-300 text-green-600 hover:bg-green-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t('download')}
                </Button>
              </div>
              
              <p className="text-sm text-gray-500">
                {t('recording_complete_message')}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
