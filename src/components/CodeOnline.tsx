import React, { useState, useRef } from 'react';
import { runCode as realRunCode, checkStatus } from '../services/apiService';
import './CodeOnline.css';
import _CONST from '../shared/_CONST';

const CodeOnline: React.FC = () => {
  const defaultLanguage = 'JAVASCRIPT';
  const [selectedLanguage, setSelectedLanguage] = useState<string>(defaultLanguage);
  const [code, setCode] = useState<string>(_CONST.LANGUAGE_INFO[defaultLanguage].default_code);
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('');
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const lineNumbersRef = useRef<HTMLDivElement | null>(null);

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = event.target.value;
    const languageInfo = _CONST.LANGUAGE_INFO[newLanguage];
    setSelectedLanguage(newLanguage);
    setCode(languageInfo?.default_code || '');
    setOutput('');
    setError('');
    setStatus('');
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

  const runCode = async () => {
    if (!code.trim()) {
      setError('Please enter some code to run.');
      return;
    }

    setIsRunning(true);
    setError('');
    setOutput('');
    setStatus('Running...');

    try {
      // Chọn API dựa trên environment
      const response = await realRunCode(selectedLanguage, code);

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
              value={selectedLanguage}
              onChange={handleLanguageChange}
              disabled={isRunning}
            >
              {_CONST.LIST_LANGUAGE_INFO.map(lang => (
                <option key={lang.value} value={lang.value}>
                  {lang.name}
                </option>
              ))}
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
              onClick={runCode}
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