import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { AudioWaveform, BarChart3, History, Shield } from "lucide-react";
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

export default function Layout({ children, currentPageName }) {
  const { t } = useTranslation();
  const location = useLocation();

  const navigationItems = [
    {
      title: t('audio_detection'),
      url: createPageUrl("AudioDetection"),
      icon: AudioWaveform,
    },
    
    {
      title: t('history'),
      url: createPageUrl("History"),
      icon: History,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <style>
        {`
          :root {
            --primary-gradient: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
            --secondary-gradient: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
            --accent-gradient: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
          }
        `}
      </style>
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {t('lab_title')}
                </h1>
                <p className="text-xs text-gray-500">{t('lab_subtitle')}</p>
              </div>
            </div>
            
            
            <nav className="hidden md:flex space-x-1 items-center">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    location.pathname === item.url
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              ))}

              {/* 語言切換按鈕組 */}
              <div className="flex space-x-1 ml-4">
                <button
                  onClick={() => i18n.changeLanguage("en")}
                  className="px-3 py-1 text-sm rounded-md font-medium text-gray-600 hover:bg-gray-100"
                >
                  <span className="ml-1">EN</span>
                </button>
                <button
                  onClick={() => i18n.changeLanguage("zh-TW")}
                  className="px-3 py-1 text-sm rounded-md font-medium text-gray-600 hover:bg-gray-100"
                >
                  <span className="ml-1">中文</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white border-b border-gray-200">
        <div className="px-4 py-2">
          <div className="flex space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.title}
                to={item.url}
                className={`flex-1 flex flex-col items-center py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === item.url
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                <item.icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              {t('footer_copyright')}
            </p>
            <p className="text-red-500 text-xs mt-2">
              {t('footer_warning')}
            </p>
            <div className="mt-2 flex justify-center space-x-4 text-xs text-gray-400">
              <span>{t('footer_support_format')}</span>
              <span>•</span>
              <span>{t('footer_real_time_recording')}</span>
              <span>•</span>
              <span>{t('footer_high_accuracy_model')}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}