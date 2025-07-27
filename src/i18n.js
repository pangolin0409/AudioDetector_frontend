
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, 
    },
    resources: {
      en: {
        translation: {
          audio_detection: 'Audio Detection',
          history: 'History',
          lab_title: 'NCU MIS MLPLab - Audio Deepfake Detector',
          lab_subtitle: 'AI-Powered Audio Authentication',
          footer_copyright: '© 2025 NCU MIS MMLab - Audio Deepfake Detector',
          footer_warning: 'This system is for academic research, and there is still a chance of misjudgment of fake audio.',
          footer_support_format: 'Supported formats: WAV, MP3',
          footer_real_time_recording: 'Real-time recording identification',
          footer_high_accuracy_model: 'High-precision AI model',

          audio_detection_title: 'AI Audio Deepfake Detector',
          audio_detection_subtitle: 'Leveraging advanced deep learning techniques to instantly detect whether a voice recording is AI-generated or fake. Supports multiple audio formats and provides high-accuracy detection results.',
          select_analysis_method: 'Select Analysis Method',
          upload_file: 'Upload File',
          real_time_recording: 'Real-time Recording',
          analyze_new_file: 'Analyze New File',
          high_accuracy_identification: 'Low Error Rate Identification',
          high_accuracy_identification_desc: 'The system achieves a best Equal Error Rate (EER) of 4.53% on the In-the-Wild dataset.',
          multi_format_support: 'Multi-format Support',
          multi_format_support_desc: 'Supports common audio formats such as WAV, MP3, and WebM.',
          real_time_recording_desc: 'Directly use the device microphone for recording without additional software.',
          error_analysis: 'An error occurred during analysis',

          history_title: 'Identification Results Overview',
          history_subtitle: 'View all audio identification results, including detailed analysis information and statistical data.',
          total_analysis: 'Total Analysis',
          real_audio: 'Real Audio',
          fake_audio: 'Fake Audio',
          average_confidence: 'Average Confidence',
          filter_and_sort: 'Filter and Sort',
          search_filename: 'Search filename...', 
          audio_type: 'Audio Type',
          all_results: 'All Results',
          sort_by: 'Sort by',
          newest_first: 'Newest first',
          oldest_first: 'Oldest first',
          confidence_high_to_low: 'Confidence: High to Low',
          confidence_low_to_high: 'Confidence: Low to High',
          sort_by_filename: 'Sort by filename',
          analysis_results: 'Analysis Results',
          no_analysis_results: 'No analysis results yet',
          real: 'Real',
          fake: 'Fake',
          confidence: 'confidence',
          view_file: 'View File',

          error_invalid_file_type: 'Please select a valid audio file format (WAV, MP3, WebM, OGG, FLAC)',
          error_file_size_exceeded: 'File size cannot exceed 20MB',
          upload_audio_file: 'Upload Audio File',
          drag_and_drop_or_select: 'Drag and drop files here or click to select a file',
          select_file: 'Select File',
          supported_formats: 'Supported formats: WAV, MP3, WebM, OGG, FLAC',
          file_size_limit: 'File size limit: 20MB',
          identifying: 'Identifying...', 
          start_identification: 'Start Identification',

          error_mic_access: 'Unable to access the microphone, please check the browser permission settings',
          waveform_display_area: 'Audio waveform display area',
          start_recording: 'Start Recording',
          stop_recording: 'Stop Recording',
          play: 'Play',
          pause: 'Pause',
          download: 'Download',
          recording_complete_message: 'Recording complete! Click \'Play\' to preview or \'Download\' to save the file',

          identification_result: 'Identification Result',
          very_high_confidence: 'Very High Confidence',
          high_confidence: 'High Confidence',
          medium_confidence: 'Medium Confidence',
          low_confidence: 'Low Confidence',
          technical_details: 'Technical Details',
          identification_engine: 'Identification Engine'
        }
      },
      'zh-TW': {
        translation: {
          audio_detection: '音訊辨識',
          history: '歷史記錄',
          lab_title: '國立中央大學資管系多模語言研究室 - 真偽語音辨識系統',
          lab_subtitle: 'AI-Powered Audio Authentication',
          footer_copyright: '© 2025 國立中央大學資管系多模語言研究室 - 真偽語音辨識系統',
          footer_warning: '本系統是學術研究，偽造音頻仍有誤判的機率',
          footer_support_format: '支援格式：WAV, MP3',
          footer_real_time_recording: '即時錄音辨識',
          footer_high_accuracy_model: '高精度 AI 模型',

          audio_detection_title: 'AI 語音真偽辨識',
          audio_detection_subtitle: '使用先進的深度學習技術，即時辨識語音是否為 AI 生成的偽造內容。支援多種音訊格式，提供高精度的檢測結果。',
          select_analysis_method: '選擇分析方式',
          upload_file: '上傳檔案',
          real_time_recording: '即時錄音',
          analyze_new_file: '分析新檔案',
          high_accuracy_identification: '低錯誤率辨識',
          high_accuracy_identification_desc: '採用最新的深度學習模型，測試在 In the Wild 資料集上 EER 最佳可達 4.53%',
          multi_format_support: '多格式支援',
          multi_format_support_desc: '支援 WAV、MP3、WebM 等常見音訊格式',
          real_time_recording_desc: '直接使用裝置麥克風錄音，無需額外軟體',
          error_analysis: '分析時發生錯誤',

          history_title: '辨識結果總覽',
          history_subtitle: '查看所有音訊辨識結果，包含詳細的分析資訊與統計數據',
          total_analysis: '總計分析',
          real_audio: '真實語音',
          fake_audio: '偽造語音',
          average_confidence: '平均信心度',
          filter_and_sort: '篩選與排序',
          search_filename: '搜尋檔案名稱...', 
          audio_type: '音頻類別',
          all_results: '全部結果',
          sort_by: '排序方式',
          newest_first: '最新優先',
          oldest_first: '最舊優先',
          confidence_high_to_low: '信心度高→低',
          confidence_low_to_high: '信心度低→高',
          sort_by_filename: '檔名排序',
          analysis_results: '分析結果',
          no_analysis_results: '尚無分析結果',
          real: '真實',
          fake: '偽造',
          confidence: '信心度',
          view_file: '查看檔案',

          error_invalid_file_type: '請選擇有效的音訊檔案格式 (WAV, MP3, WebM, OGG, FLAC)',
          error_file_size_exceeded: '檔案大小不能超過 20MB',
          upload_audio_file: '上傳音訊檔案',
          drag_and_drop_or_select: '拖放檔案到此區域或點擊選擇檔案',
          select_file: '選擇檔案',
          supported_formats: '支援格式：WAV, MP3, WebM, OGG, FLAC',
          file_size_limit: '檔案大小限制：20MB',
          identifying: '辨識中...', 
          start_identification: '開始辨識',

          error_mic_access: '無法存取麥克風，請確認瀏覽器權限設定',
          waveform_display_area: '音訊波形顯示區域',
          start_recording: '開始錄音',
          stop_recording: '停止錄音',
          play: '播放',
          pause: '暫停',
          download: '下載',
          recording_complete_message: '錄音完成！點擊「播放」預覽或「下載」保存檔案',

          identification_result: '辨識結果',
          very_high_confidence: '極高信心',
          high_confidence: '高信心',
          medium_confidence: '中等信心',
          low_confidence: '低信心',
          technical_details: '技術詳細資訊',
          identification_engine: '辨識引擎'
        }
      }
    }
  });

export default i18n;
