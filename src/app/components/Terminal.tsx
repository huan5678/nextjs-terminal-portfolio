'use client';
import React, { useState, useEffect, useRef } from 'react';
import About from '@/app/components/About';
import Skills from '@/app/components/Skills';
import Projects from '@/app/components/Projects';
import Contact from '@/app/components/Contact';
import { useChat } from 'ai/react';
import CommandPanel from '@/app/components/CommandPanel';
import ProgressBar from '@/app/components/ProgressBar';
import dynamic from 'next/dynamic';
import { useTheme } from '@/contexts/ThemeContext';
import { themes } from '@/config/themes';

import PixelSmash from './PixelSmash';

export default function TerminalController({ isChatMode, onExitChat, onEnterChat }) {
  const [history, setHistory] = useState<React.ReactNode[]>([]);
  const [prompt, setPrompt] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showCommandPanel, setShowCommandPanel] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const { setTheme, availableThemes, currentTheme } = useTheme();

  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, setMessages, setInput, isLoading } = useChat({
    streamProtocol: 'text',
  });

  const commandDescriptions: { [key: string]: string } = {
    about: 'About me',
    skills: 'My professional skills',
    projects: 'My featured projects',
    contact: 'How to reach me',
    game: 'Run the PIXEL_SMASH game',
    theme: 'Change terminal theme (theme <color>)',
    help: 'Shows this help message',
    command: 'Show command panel',
    clear: 'Clears the terminal history',
  };

  const commandList = Object.keys(commandDescriptions);

  const HelpComponent = () => (
    <div>
      <p className="mb-2 text-neutral-300">Available commands:</p>
      <ul className="list-none pl-2">
        {commandList.map((cmd) => (
          <li key={cmd} className="flex items-center gap-x-4">
            <span className="theme-accent w-20">{cmd}</span>
            <span className="text-neutral-400">{commandDescriptions[cmd]}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const processCommand = (command: string) => {
    const newHistory = [...history, <div key={history.length}><span className="theme-accent">&gt;</span> {command}</div>];
    const cmd = command.toLowerCase().trim();
    const args = cmd.split(' ');
    const mainCmd = args[0];
    let output: React.ReactNode = null;

    switch (mainCmd) {
      case 'about':
        output = <About />;
        break;
      case 'skills':
        output = <Skills />;
        break;
      case 'projects':
        output = <Projects />;
        break;
      case 'contact':
        output = <Contact />;
        break;
      case 'help':
        output = <HelpComponent />;
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'command':
        setShowCommandPanel(true);
        break;
      case 'game':
        setShowGame(true);
        output = <p>Launching PIXEL_SMASH.EXE...</p>;
        break;
      case 'theme':
        if (args.length < 2) {
          output = (
            <div>
              <p className="theme-warning">Available themes:</p>
              <ul className="ml-4 mt-2">
                {availableThemes.map((theme) => (
                  <li key={theme} className="theme-accent">
                    {theme} - {themes[theme].displayName}
                  </li>
                ))}
              </ul>
              <p className="theme-text-secondary mt-2">Usage: theme &lt;color&gt;</p>
              <p className="theme-text-secondary">Current theme: {currentTheme.displayName}</p>
            </div>
          );
        } else {
          const themeName = args[1];
          if (availableThemes.includes(themeName as any)) {
            setTheme(themeName as any);
            output = <p className="theme-success">Theme changed to: {themes[themeName as keyof typeof themes].displayName}</p>;
          } else {
            output = <p className="theme-error">Unknown theme: {themeName}. Type 'theme' to see available themes.</p>;
          }
        }
        break;
      case '':
        break;
      default:
        output = (
          <p className="theme-error">
            Command not found: {cmd}. Type 'help' for available commands.
          </p>
        );
        break;
    }

    if (output) {
      newHistory.push(<div key={newHistory.length}>{output}</div>);
    }
    setHistory(newHistory);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      if (!isChatMode && commandHistory.length > 0) {
        e.preventDefault();
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setPrompt(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      if (!isChatMode && historyIndex !== -1) {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          setPrompt(commandHistory[newIndex]);
        } else {
          setHistoryIndex(-1);
          setPrompt('');
        }
      }
    } else if (e.key === 'Enter') {
      if (isChatMode) {
        if (input.trim().toLowerCase() === 'exit') {
          onExitChat();
          setMessages([]); // Clear chat history when exiting
        } else {
          handleSubmit(e as any);
        }
      } else {
        if (prompt.trim() !== '') {
          setCommandHistory([...commandHistory, prompt]);
        }
        processCommand(prompt);
        setPrompt('');
        setHistoryIndex(-1);
      }
    }
  };

  // Handle chat mode entry/exit and initial welcome message
  useEffect(() => {
    if (isChatMode) {
        setHistory([
            <div key="chat-welcome">
                <p>You are now in chat mode. Type 'exit' to return to the main menu.</p>
            </div>
        ]);
        setPrompt(''); // Clear prompt when entering chat mode
        setInput(''); // Clear chat input when entering chat mode
    } else {
        setHistory([
            <div key="welcome">
                <p>Welcome to my interactive terminal portfolio.</p>
                <p className="mt-1">
                    Type &apos;<span className="theme-accent">help</span>&apos; to see the list of available commands.
                </p>
            </div>
        ]);
        setPrompt(''); // Clear prompt when exiting chat mode
        setInput(''); // Clear chat input when exiting chat mode
    }
    inputRef.current?.focus();
  }, [isChatMode, setInput]);

  // MutationObserver for scrolling
  useEffect(() => {
    const observer = new MutationObserver(() => {
        bottomRef.current?.scrollIntoView();
    });

    if (terminalRef.current) {
        observer.observe(terminalRef.current, { childList: true, subtree: true });
    }

    return () => {
        observer.disconnect();
    };
  }, []);

  const handleClick = () => {
    inputRef.current?.focus();
  }

  const promptPrefix = isChatMode ? 'chat' : '';
  const promptSuffix = '>';

  return (
    <>
      {showGame && <PixelSmash onClose={() => setShowGame(false)} />}
            <div
          className="h-[400px] w-full border theme-border/30 theme-background p-4 rounded-md font-mono flex flex-col text-lg theme-glow"
          onClick={handleClick}
      >
          <div className="flex-grow overflow-y-auto" ref={terminalRef}>
              {!isChatMode && history}
              {isChatMode && (
                  <>
                      {history} {/* Display chat mode welcome/hint */}
                      {messages.map(m => (
                          <div key={m.id} className="mb-1">
                              <strong>{`${m.role === 'user' ? 'You' : 'AI'}: `}</strong>
                              <span className={`${m.role === 'assistant' ? 'theme-primary' : 'theme-text'}`}>
                                  {m.content}
                              </span>
                          </div>
                      ))}
                      {isLoading && <ProgressBar isLoading={true} />}
                  </>
              )}
              <div ref={bottomRef} />
          </div>
          {showCommandPanel && (
              <CommandPanel
                  onKonamiCode={() => {
                      onEnterChat();
                      setShowCommandPanel(false);
                  }}
                  onClose={() => setShowCommandPanel(false)}
              />
          )}
          <div className="flex items-center mt-2 flex-shrink-0">
                        {promptPrefix && <span className="theme-accent mr-1">{promptPrefix}</span>}
          <span className="theme-accent">{promptSuffix}</span>
              <input
                  ref={inputRef}
                  type="text"
                  value={isChatMode ? input : prompt}
                  onChange={isChatMode ? handleInputChange : (e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent border-none text-white focus:outline-none w-full ml-2"
              />
          </div>
      </div>
    </>
  );
}
