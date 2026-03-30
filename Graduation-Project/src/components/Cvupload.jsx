import { useState, useRef } from 'react';

const CVUpload = ({ onFileSelect, currentCV }) => {
  const [fileName, setFileName] = useState(currentCV || '');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setFileName(file.name);
        onFileSelect(file);
      } else {
        alert('Please upload a PDF file');
        e.target.value = '';
      }
    }
  };

  const handleRemove = () => {
    setFileName('');
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Upload CV (PDF)
      </label>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
        {fileName ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center text-blue-600">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-900">{fileName}</p>
            <button
              type="button"
              onClick={handleRemove}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Remove File
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-center text-gray-400">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <button
                type="button"
                onClick={handleButtonClick}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
              >
                Choose File
              </button>
              <p className="text-xs text-gray-500 mt-2">PDF files only</p>
            </div>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default CVUpload;