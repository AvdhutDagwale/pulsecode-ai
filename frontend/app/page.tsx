'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setAnalysis('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setAnalysis(data.analysis);
    } catch (err) {
      console.error(err);
      setAnalysis('Error connecting to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center p-8">
      <div className="max-w-3xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            PulseCode AI
          </h1>
          <p className="text-gray-400">
            Convert your architecture diagrams into Docker Compose configurations using Gemma 4.
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-xl p-6 hover:border-blue-500 transition cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
              />
              <span className="text-xs text-gray-500 mt-2">Upload PNG, JPG, or WEBP architecture diagram</span>
            </div>

            <button
              type="submit"
              disabled={loading || !file}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 font-semibold rounded-xl transition shadow-lg"
            >
              {loading ? 'Analyzing Diagram with Gemma 4...' : 'Generate Docker Compose'}
            </button>
          </form>
        </div>

        {/* Output Result */}
        {analysis && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-blue-400">Generated Configuration:</h2>
            <pre className="bg-black/50 p-4 rounded-xl overflow-x-auto text-sm text-green-400 font-mono whitespace-pre-wrap">
              {analysis}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}