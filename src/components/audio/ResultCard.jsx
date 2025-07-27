import React from "react";
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertTriangle, Cpu } from "lucide-react";

export default function ResultCard({ result }) {
  const { t } = useTranslation();
  const isReal = result.prediction === "REAL";
  const model_name = result.model_name;
  const confidencePercent = Math.round(result.confidence);

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return "text-green-600";
    if (confidence >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getConfidenceDescription = (confidence) => {
    if (confidence >= 90) return t('very_high_confidence');
    if (confidence >= 80) return t('high_confidence');
    if (confidence >= 60) return t('medium_confidence');
    return t('low_confidence');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isReal ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {isReal ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-red-600" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {t('identification_result')}
            </h3>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Main Result */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <Badge 
              variant={isReal ? "default" : "destructive"}
              className={`text-lg px-4 py-2 font-bold ${
                isReal 
                  ? 'bg-green-100 text-green-800 border-green-300' 
                  : 'bg-red-100 text-red-800 border-red-300'
              }`}
            >
              {isReal ? t('real_audio') : t('fake_audio')}
            </Badge>
            
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-sm text-gray-600">{t('confidence')}：</span>
                <span className={`text-lg font-bold ${getConfidenceColor(confidencePercent)}`}>
                  {confidencePercent}%
                </span>
                <span className="text-sm text-gray-500">
                  ({getConfidenceDescription(confidencePercent)})
                </span>
              </div>
              
              <Progress 
                value={confidencePercent} 
                className="h-2 w-full max-w-xs mx-auto"
              />
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h4 className="font-medium text-gray-700 flex items-center space-x-2">
            <Cpu className="w-4 h-4" />
            <span>{t('technical_details')}</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{t('identification_engine')}：</span>
              <span className="font-medium">{model_name}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
