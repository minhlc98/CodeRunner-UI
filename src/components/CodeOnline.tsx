import React, { useState, useRef, useEffect } from 'react';
import { runCode, checkStatus, fetchLanguages, ProgrammingLanguage } from '../services/apiService';
import { parseEscapeSequences } from '../helper/index'
import './CodeOnline.css';

const CodeOnline: React.FC = () => {
  const [languages, setLanguages] = useState<ProgrammingLanguage[]>([]);
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('');
  const [isLoadingLanguages, setIsLoadingLanguages] = useState<boolean>(true);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const lineNumbersRef = useRef<HTMLDivElement | null>(null);

  // Fetch languages from API on component mount
  useEffect(() => {
    const loadLanguages = async () => {
      try {
        setIsLoadingLanguages(true);
        const fetchedLanguages = await fetchLanguages();
        setLanguages(fetchedLanguages);
        
        // Set first language as default if available
        if (fetchedLanguages.length > 0) {
          const firstLanguage = fetchedLanguages[0];
          setSelectedLanguageId(firstLanguage.id);
          const defaultCode = firstLanguage.defaultCode ?? '';
          setCode(parseEscapeSequences(defaultCode));
        }
      } catch (err) {
        setError('Failed to load programming languages. Please refresh the page.');
        console.error('Error loading languages:', err);
      } finally {
        setIsLoadingLanguages(false);
      }
    };

    loadLanguages();
  }, []);

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguageId = event.target.value;
    setSelectedLanguageId(newLanguageId);
    
    // Find selected language and set its default code
    const selectedLanguage = languages.find(lang => lang.id === newLanguageId);
    const defaultCode = selectedLanguage?.defaultCode ?? '';
    setCode(parseEscapeSequences(defaultCode));
    
    clearOutput();
  };

  const handleCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(event.target.value);
  };

  const handleEditorScroll = () => {
    if (!textAreaRef.current || !lineNumbersRef.current) return;
    const scrollTop = textAreaRef.current.scrollTop;
    lineNumbersRef.current.style.transform = `translateY(${-scrollTop}px)`;
  };

  const clearOutput = () => {
    setOutput('');
    setError('');
    setStatus('');
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      setError('Please enter some code to run.');
      return;
    }

    setIsRunning(true);
    setError('');
    setOutput('');
    setStatus('Running...');

    if (!selectedLanguageId) {
      setError('Please select a programming language.');
      return;
    }

    try {
      // Chọn API dựa trên environment
      const response = await runCode(selectedLanguageId, code);

      if (response.success) {
        const { id } = response;
        setStatus("Code submitted successfully. Checking status...");
        
        // Bắt đầu check status với setInterval
        startStatusCheck(id);
      } else {
        setError('Failed to submit code. Please try again.');
        setIsRunning(false);
        setStatus('');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      setIsRunning(false);
      setStatus('');
    }
  };

  const startStatusCheck = (id: string) => {
    let attempts = 0;
    const maxAttempts = 15; // 30 giây
    
    intervalRef.current = setInterval(async () => {
      attempts++;
      
      try {
        const response = await checkStatus(id);
        const { status: currentStatus, output: currentOutput, error: currentError } = response;
        
        if (currentStatus === 'COMPLETED') {
          setOutput(currentOutput);
          setStatus('Execution completed successfully!');
          setIsRunning(false);
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
        } else if (currentStatus === 'ERROR') {
          setError(currentError || 'An error occurred during execution.');
          setStatus('Execution failed.');
          setIsRunning(false);
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
        } else if (currentStatus === 'RUNNING') {
          setStatus(`Code is running...`);
        } else {
          setStatus(`Status: WAITING`);
        }
        
        // Dừng interval sau 30 giây
        if (attempts >= maxAttempts) {
          setError('Execution timeout. Please try again.');
          setStatus('Execution timed out after 30 seconds.');
          setIsRunning(false);
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
        }
      } catch (err) {
        attempts++;
        setStatus(`Checking status... Network error`);
        
        if (attempts >= maxAttempts) {
          setError('Failed to check status. Please try again.');
          setStatus('Status check failed.');
          setIsRunning(false);
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
        }
      }
    }, 2000);
  };

  const stopExecution = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    setStatus('Execution stopped by user.');
  };

  // Cleanup interval khi component unmount
  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const totalLines = Math.max(1, code.split('\n').length);
  const lineNumbers = Array.from({ length: totalLines }, (_, index) => index + 1);

  return (
    <div className="code-online">
      <div className="header">
        <h1>🖥️ Code Runner</h1>
        <p>Write, run, and test your code in multiple programming languages</p>
      </div>

      <div className="main-container">
        <div className="left-panel">
          <div className="language-selector">
            <label htmlFor="language">Programming Language:</label>
            <select
              id="language"
              value={selectedLanguageId}
              onChange={handleLanguageChange}
              disabled={isRunning || isLoadingLanguages}
            >
              {isLoadingLanguages ? (
                <option value="">Loading languages...</option>
              ) : languages.length === 0 ? (
                <option value="">No languages available</option>
              ) : (
                languages.map(lang => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="code-editor">
            <div className="editor-header">
              <span>Code Editor</span>
              <button 
                className="clear-btn"
                onClick={clearOutput}
                disabled={isRunning}
              >
                Clear Output
              </button>
            </div>
            <div className="editor-body">
              <div className="line-numbers">
                <div ref={lineNumbersRef} className="line-numbers-content">
                  {lineNumbers.map(n => (
                    <div key={n} className="line-number">{n}</div>
                  ))}
                </div>
              </div>
              <textarea
                ref={textAreaRef}
                value={code}
                onChange={handleCodeChange}
                onScroll={handleEditorScroll}
                placeholder="Enter your code here..."
                disabled={isRunning}
                className="code-textarea"
              />
            </div>
          </div>

          <div className="action-buttons">
            <button
              className={`run-btn ${isRunning ? 'running' : ''}`}
              onClick={handleRunCode}
              disabled={isRunning}
            >
              {isRunning ? '🔄 Running...' : '▶️ Run Code'}
            </button>
            
            {isRunning && (
              <button
                className="stop-btn"
                onClick={stopExecution}
              >
                ⏹️ Stop
              </button>
            )}
          </div>
        </div>

        <div className="right-panel">
          <div className="output-container">
            <div className="output-header">
              <span>Output</span>
              {status && <span className="status">{status}</span>}
            </div>
            
            {error && (
              <div className="error-output">
                <h4>❌ Error:</h4>
                <pre>{error}</pre>
              </div>
            )}
            
            {output && (
              <div className="success-output">
                <h4>✅ Output:</h4>
                <pre>{output}</pre>
              </div>
            )}
            
            {!output && !error && !isRunning && (
              <div className="empty-output">
                <p>Output will appear here after running your code.</p>
              </div>
            )}
            
            {isRunning && !output && !error && (
              <div className="running-output">
                <p>🔄 Code is running...</p>
                <div className="loading-spinner"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="footer">
        <p>💡 Tip: You can modify the default code examples or write your own code from scratch!</p>
      </div>
    </div>
  );
};

export default CodeOnline; 