import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, File } from 'lucide-react';
import { motion } from 'framer-motion';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/markdown': ['.md'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    disabled: isLoading
  });

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
        ${isDragActive 
          ? 'border-purple-400 bg-purple-500/10' 
          : 'border-gray-600 hover:border-purple-500 bg-gray-800/50'
        }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center space-y-4">
        {isDragActive ? (
          <Upload className="w-12 h-12 text-purple-400" />
        ) : (
          <div className="flex space-x-2">
            <FileText className="w-12 h-12 text-gray-400" />
            <File className="w-12 h-12 text-gray-400" />
          </div>
        )}
        
        <div>
          <p className="text-lg font-medium text-gray-200">
            {isDragActive ? 'Drop your file here' : 'Upload Document'}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Drag & drop or click to select<br />
            Supports PDF, Markdown (.md), and Text files
          </p>
        </div>
      </div>
    </motion.div>
  );
};