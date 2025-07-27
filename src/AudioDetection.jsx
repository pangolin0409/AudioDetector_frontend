import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Zap, Upload, Mic } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import AudioRecorder from "@/components/audio/AudioRecorder";
import FileUpload from "@/components/audio/FileUpload";
import ResultCard from "@/components/audio/ResultCard";

export default function AudioDetection() {
  const { t } = useTranslation();
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const handlePredictionComplete = (result, file) => {
    const newResult = {
      ...result,
      id: new Date().toISOString(),
      filename: file.name,
      date: new Date().toISOString(),
      // file_url: URL.createObjectURL(file),
    };

    setAnalysisResult(newResult);
    setError(null);

    // Save to local storage
    const history = JSON.parse(localStorage.getItem("audioHistory") || "[]");
    history.unshift(newResult);
    localStorage.setItem("audioHistory", JSON.stringify(history));
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
    setError(null);
  };

  const handleAnalysis = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const API_URL = import.meta.env.VITE_APP_API_URL;
      const response = await fetch(API_URL+'/predict', {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const result = await response.json();
      handlePredictionComplete(result, file);
    } catch (err) {
      setError(err.message || t('error_analysis'));
      setAnalysisResult(null);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            {t('audio_detection_title')}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('audio_detection_subtitle')}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Input Section */}
        {!analysisResult ? (
          <Card className="mb-8 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <span>{t('select_analysis_method')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="upload" className="flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>{t('upload_file')}</span>
                  </TabsTrigger>
                  <TabsTrigger value="record" className="flex items-center space-x-2">
                    <Mic className="w-4 h-4" />
                    <span>{t('real_time_recording')}</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload" className="space-y-4">
                  <FileUpload onFileSelected={handleAnalysis} />
                </TabsContent>
                
                <TabsContent value="record" className="space-y-4">
                  <AudioRecorder onFileSelected={handleAnalysis} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <ResultCard result={analysisResult} />
            
            <div className="text-center">
              <Button
                onClick={resetAnalysis}
                variant="outline"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                {t('analyze_new_file')}
              </Button>
            </div>
          </div>
        )}

        {/* Info Section */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{t('high_accuracy_identification')}</h3>
                <p className="text-sm text-gray-600">
                  {t('high_accuracy_identification_desc')}
                </p>
              </div>
              
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{t('multi_format_support')}</h3>
                <p className="text-sm text-gray-600">
                  {t('multi_format_support_desc')}
                </p>
              </div>
              
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mic className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{t('real_time_recording')}</h3>
                <p className="text-sm text-gray-600">
                  {t('real_time_recording_desc')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
