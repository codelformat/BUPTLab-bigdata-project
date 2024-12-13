'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileIcon, UploadCloudIcon, XIcon } from 'lucide-react';
import { documentService } from '@/services/api/endpoints';

interface UploadedFile {
  id: string;
  name: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

export default function DocumentUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      progress: 0,
      status: 'uploading' as const,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Upload each file
    newFiles.forEach(async (fileInfo, index) => {
      const file = acceptedFiles[index];

      try {
        await documentService.upload(file);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileInfo.id
              ? { ...f, status: 'completed', progress: 100 }
              : f
          )
        );
      } catch (error) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileInfo.id
              ? {
                  ...f,
                  status: 'error',
                  error: error instanceof Error ? error.message : 'Upload failed',
                }
              : f
          )
        );
      }
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    multiple: true,
  });

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="w-full max-w-[90%] md:max-w-[60%] space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragActive
            ? 'border-purple-400 bg-purple-50'
            : 'border-gray-200 hover:border-purple-400 hover:bg-purple-50'
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive
            ? 'Drop your PDF files here...'
            : 'Drag & drop PDF files here, or click to select files'}
        </p>
        <p className="mt-1 text-xs text-gray-500">Only PDF files are accepted</p>
      </div>

      {files.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
            >
              <FileIcon className="h-8 w-8 text-purple-500 flex-shrink-0" />
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                
                {file.status === 'uploading' && (
                  <div className="mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {file.status === 'completed' && (
                  <p className="text-xs text-green-600">Upload complete</p>
                )}
                
                {file.status === 'error' && (
                  <p className="text-xs text-red-600">{file.error}</p>
                )}
              </div>

              <button
                onClick={() => removeFile(file.id)}
                className="p-1 hover:bg-gray-200 rounded-full"
              >
                <XIcon className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 