
'use client';
import React, { useState, useEffect, useRef } from 'react';
import About from '@/app/components/About';
import Skills from '@/app/components/Skills';
import Projects from '@/app/components/Projects';
import Contact from '@/app/components/Contact';
import { useChat } from 'ai/react';
import CommandPanel from '@/app/components/CommandPanel';
import ProgressBar from '@/app/components/ProgressBar';

export default function TerminalController({ isChatMode, onExitChat, onEnterChat }) {
  const [history, setHistory] = useState<React.ReactNode[]>([]);
  const [prompt, setPrompt] = useState('');
  const [showCommandPanel, setShowCommandPanel] = useState(false);
  
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
            <span className="text-cyan-400 w-20">{cmd}</span>
            <span className="text-neutral-400">{commandDescriptions[cmd]}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const processCommand = (command: string) => {
    const newHistory = [...history, <div key={history.length}><span className="text-cyan-400">&gt;</span> {command}</div>];
    const cmd = command.toLowerCase().trim();
    let output: React.ReactNode = null;

    switch (cmd) {
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
      case '':
        break;
      default:
        output = (
          <p className="text-red-400">
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
    if (e.key === 'Enter') {
        if (isChatMode) {
            if (input.trim().toLowerCase() === 'exit') {
                onExitChat();
                setMessages([]); // Clear chat history when exiting
            } else {
                handleSubmit(e as any);
            }
        } else {
            processCommand(prompt);
            setPrompt('');
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
                    Type &apos;<span className="text-cyan-400">help</span>&apos; to see the list of available commands.
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
    <div 
        className="h-[400px] w-full border border-green-600/30 bg-black p-4 rounded-md font-mono flex flex-col text-lg"
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
                            <span className={`${m.role === 'assistant' ? 'text-green-400' : 'text-white'}`}>
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
            {promptPrefix && <span className="text-cyan-400 mr-1">{promptPrefix}</span>}
            <span className="text-cyan-400">{promptSuffix}</span>
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
  );
}
