import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Shield, FileAudio, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ITEMS_PER_PAGE = 25;

export default function Results() {
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    try {
      const storedHistory = JSON.parse(localStorage.getItem("audioHistory") || "[]");
      setResults(storedHistory);
    } catch (error) {
      console.error("Failed to parse audio history from localStorage", error);
      setResults([]);
    }
  }, []);

  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentResults = results.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            歷史辨識結果
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            查看您過去所有音訊檔案的辨識紀錄與詳細分析。
          </p>
        </div>

        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileAudio className="w-5 h-5 text-purple-600" />
              <span>辨識紀錄</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">檔案名稱</th>
                    <th scope="col" className="px-6 py-3">辨識日期</th>
                    <th scope="col" className="px-6 py-3">辨識結果</th>
                    <th scope="col" className="px-6 py-3">可信度</th>
                    <th scope="col" className="px-6 py-3">使用模型</th>
                  </tr>
                </thead>
                <tbody>
                  {currentResults.length > 0 ? (
                    currentResults.map((result) => (
                      <tr key={result.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{result.filename}</td>
                        <td className="px-6 py-4">{result.date}</td>
                        <td className="px-6 py-4">
                          {result.is_fake ? (
                            <Badge variant="destructive" className="flex items-center w-fit">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              偽造語音
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="flex items-center w-fit bg-green-100 text-green-800">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              真實語音
                            </Badge>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span>{(result.confidence).toFixed(1)}%</span>
                            <div className="w-24 h-2 bg-gray-200 rounded-full">
                              <div
                                className={`h-2 rounded-full ${
                                  result.is_fake ? "bg-red-500" : "bg-green-500"
                                }`}
                                style={{ width: `${result.confidence}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="flex items-center w-fit">
                            <Shield className="w-4 h-4 mr-1" />
                            {result.model || "VoiceGuard v2.1"}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center text-gray-500 py-8">
                        目前沒有任何辨識紀錄
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="outline"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  上一頁
                </Button>
                <span className="text-sm text-gray-700">
                  第 {currentPage} / {totalPages} 頁
                </span>
                <Button
                  variant="outline"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  下一頁
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}