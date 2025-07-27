import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertTriangle,
  Calendar,
  Clock,
  FileAudio,
  TrendingUp,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function History() {
  const { t } = useTranslation();
  const [history, setHistory] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [audioPlaying, setAudioPlaying] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useMemo(() => new Audio(), []);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("audioHistory") || "[]");
    setHistory(stored);
  }, []);

  const filtered = useMemo(() => {
    return history
      .filter((item) => {
        const typeMatch =
          filterType === "all" || item.prediction.toLowerCase() === filterType.toLowerCase();
        const searchMatch = item.filename
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        return typeMatch && searchMatch;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "oldest":
            return new Date(a.id) - new Date(b.id);
          case "confidence_desc":
            return b.confidence - a.confidence;
          case "confidence_asc":
            return a.confidence - b.confidence;
          default:
            return new Date(b.id) - new Date(a.id); // newest
        }
      });
  }, [history, filterType, searchTerm, sortBy]);

  const stats = useMemo(() => {
    const total = history.length;
    const real = history.filter((item) => item.prediction === "REAL").length;
    const fake = total - real;
    const avgConfidence =
      total > 0
        ? history.reduce((acc, cur) => acc + cur.confidence, 0) / total
        : 0;
    return { total, real, fake, avgConfidence };
  }, [history]);

  const handleDelete = (id) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem("audioHistory", JSON.stringify(updated));
  };

  const togglePlay = (url, id) => {
    if (audioPlaying === id) {
      audioRef.pause();
      setAudioPlaying(null);
    } else {
      audioRef.src = url;
      audioRef.play();
      setAudioPlaying(id);
    }
  };

  const handleDeleteResult = (id) => {
    const updated = history.filter(result => result.id !== id);
    setHistory(updated);
    localStorage.setItem("audioHistory", JSON.stringify(updated));
  };

  const filterTypeLabels = {
    all: t('all_results'),
    REAL: t('real_audio'),
    FAKE: t('fake_audio'),
  };

  const sortByLabels = {
    newest: t('newest_first'),
    oldest: t('oldest_first'),
    confidence_desc: t('confidence_high_to_low'),
    confidence_asc: t('confidence_low_to_high'),
    filename: t('sort_by_filename'),
  };
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            {t('history_title')}
          </h1>
          <p className="text-gray-600">
            {t('history_subtitle')}
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">{t('total_analysis')}</p>
                  <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">{t('real_audio')}</p>
                  <p className="text-2xl font-bold text-green-700">{stats.real}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 font-medium">{t('fake_audio')}</p>
                  <p className="text-2xl font-bold text-red-700">{stats.fake}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">{t('average_confidence')}</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {Math.round(stats.avgConfidence)}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8 shadow-lg border-0 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-blue-600" />
              <span>{t('filter_and_sort')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t('search_filename')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterTypeLabels[filterType]} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder={t('audio_type')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('all_results')}</SelectItem>
                  <SelectItem value="REAL">{t('real_audio')}</SelectItem>
                  <SelectItem value="FAKE">{t('fake_audio')}</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortByLabels[sortBy]} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder={t('sort_by')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{t('newest_first')}</SelectItem>
                  <SelectItem value="oldest">{t('oldest_first')}</SelectItem>
                  <SelectItem value="confidence_desc">{t('confidence_high_to_low')}</SelectItem>
                  <SelectItem value="confidence_asc">{t('confidence_low_to_high')}</SelectItem>
                  <SelectItem value="filename">{t('sort_by_filename')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results List */}
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <FileAudio className="w-5 h-5 text-blue-600" />
                <span>{t('analysis_results')} ({filtered.length})</span>
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12">
                <FileAudio className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">{t('no_analysis_results')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((result) => (
                  <div key={stats.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      result.prediction === "REAL" ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {result.prediction === "REAL" ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {result.filename}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{format(new Date(result.date), "yyyy-MM-dd")}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{format(new Date(result.date), "HH:mm")}</span>
                        </span>
                        {result.processing_time && (
                          <span>{result.processing_time}ms</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <Badge 
                        variant={result.prediction === "REAL" ? "default" : "destructive"}
                        className={`mb-1 ${
                          result.prediction === "REAL" 
                            ? 'bg-green-100 text-green-800 border-green-300' 
                            : 'bg-red-100 text-red-800 border-red-300'
                        }`}
                      >
                        {result.prediction === "REAL" ? t('real') : t('fake')}
                      </Badge>
                      <p className="text-sm text-gray-600">
                        {Math.round(result.confidence)}% {t('confidence')}
                      </p>
                    </div>
                    
                    {/* <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(result.file_url, '_blank')}
                    >
                      {t('view_file')}
                    </Button> */}

                    <Button
                      variant="outline"
                              size="sm"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteResult(result.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}