'use client';

import { useState, useRef } from 'react';
import { createWorker } from 'tesseract.js';
import { useLanguage } from '@/lib/use-language';
import NavigationButtons from '@/components/navigation-buttons';

export function OCRPageClient() {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setRecognizedText('');
      };
      reader.readAsDataURL(file);
    }
  };

  const recognizeText = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setProgress(0);
    setRecognizedText('');

    try {
      const worker = await createWorker('rus+eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      const {
        data: { text },
      } = await worker.recognize(selectedImage);
      setRecognizedText(text);

      await worker.terminate();
    } catch {
      // Error recognizing text
      setRecognizedText(t.ocrError || 'Error recognizing text');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setRecognizedText('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <NavigationButtons levelUp="tools" showLanguageSwitcher showThemeSwitcher />

      <div className="container mx-auto px-4 py-14 md:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">{t.ocrTitle || 'Image Text Recognition'}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t.ocrSubtitle ||
                'Extract text from images with support for Russian, English, and digits'}
            </p>
          </div>

          {/* Upload Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              {!selectedImage ? (
                <>
                  <div className="mb-4">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {t.ocrUploadText || 'Drag and drop an image or click to select'}
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer transition-colors"
                  >
                    {t.ocrSelectImage || 'Select Image'}
                  </label>
                </>
              ) : (
                <div className="space-y-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedImage}
                    alt="Uploaded"
                    className="max-w-full max-h-96 mx-auto rounded-lg shadow-md"
                  />
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={recognizeText}
                      disabled={isProcessing}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {isProcessing ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          {t.ocrProcessing || 'Processing'}... {progress}%
                        </>
                      ) : (
                        t.ocrRecognizeText || 'Recognize Text'
                      )}
                    </button>
                    <button
                      onClick={clearImage}
                      disabled={isProcessing}
                      className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                    >
                      {t.ocrClear || 'Clear'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {isProcessing && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <div className="mb-2">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>{t.ocrProgress || 'Progress'}</span>
                  <span>{progress}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Results Section */}
          {recognizedText && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">{t.ocrResult || 'Recognized Text'}</h2>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono">
                  {recognizedText}
                </pre>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(recognizedText)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  {t.ocrCopyText || 'Copy Text'}
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([recognizedText], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'recognized-text.txt';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  {t.ocrDownloadFile || 'Download File'}
                </button>
              </div>
            </div>
          )}

          {/* Info Section */}
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-200">
              {t.ocrSupportedFormats || 'Supported Formats'}
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              {(
                t.ocrFormatsList || [
                  'JPG, PNG, WEBP, BMP',
                  'Russian and English text',
                  'Numbers and special characters',
                ]
              ).map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
