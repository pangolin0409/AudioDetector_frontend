import React, { useState, useRef } from "react";
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileAudio, X, Play, Pause, Loader } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CoreApi } from "@/integrations/Core";

export default function FileUpload({ onFileSelected }) {
  const { t } = useTranslation();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const audioRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleFileSelection = (file) => {
    setError(null);
    
    const validTypes = ['audio/flac', 'audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/webm', 'audio/ogg'];
    if (!validTypes.includes(file.type)) {
      setError(t('error_invalid_file_type'));
      // return;
    }
    
    if (file.size > 20 * 1024 * 1024) {
      setError(t('error_file_size_exceeded'));
      return;
    }
    
    setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  };

  const playFile = () => {
    if (selectedFile && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        if (!audioRef.current.src) {
          audioRef.current.src = URL.createObjectURL(selectedFile);
        }
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };


  const handleloading = async (file) => {
    setIsLoading(true);
    setError(null);
    try {
      await onFileSelected(file);
    } catch (err) {
      setError(err.message || t('error_analysis'));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-8">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {!selectedFile ? (
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              dragActive
                ? "border-blue-400 bg-blue-50 scale-105"
                : "border-gray-300 hover:border-blue-300 hover:bg-blue-50/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".wav,.mp3,.webm,.ogg,audio/*"
              onChange={handleFileInput}
              className="hidden"
            />
            
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <Upload className="w-8 h-8 text-white" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {t('upload_audio_file')}
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  {t('drag_and_drop_or_select')}
                </p>
              </div>
              
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                {t('select_file')}
              </Button>
              
              <div className="text-xs text-gray-400 space-y-1">
                <p>{t('supported_formats')}</p>
                <p>{t('file_size_limit')}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                <FileAudio className="w-6 h-6 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-700 truncate">
                  {selectedFile.name}
                </h4>
                <p className="text-sm text-gray-500">
                  {formatFileSize(selectedFile.size)} • {selectedFile.type}
                </p>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  onClick={playFile}
                  variant="outline"
                  size="sm"
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                
                <Button
                  onClick={removeFile}
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <audio
              ref={audioRef}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
            
            <Button
              onClick={() => handleloading(selectedFile)}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  {t('identifying')}
                </>
              ) : (
                t('start_identification')
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}