
'use client';
import React, { useState, useEffect, useRef } from 'react';
import About from '@/app/components/About';
import Skills from '@/app/components/Skills';
import Projects from '@/app/components/Projects';
import Contact from '@/app/components/Contact';

export default function TerminalController() {
  const [history, setHistory] = useState<React.ReactNode[]>([]);
  const [prompt, setPrompt] = useState('');

  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const commandDescriptions: { [key: string]: string } = {
    about: 'About me',
    skills: 'My professional skills',
    projects: 'My featured projects',
    contact: 'How to reach me',
    help: 'Shows this help message',
    clear: 'Clears the terminal history',
  };

  const commandList = Object.keys(commandDescriptions);

  const HelpComponent = () => (
    <div>
      <p className="mb-2 text-neutral-300">Available commands:</p>
      <ul className="list-none pl-2">
        {commandList.map((cmd) => (
          <li key={cmd} className="flex items-center gap-x-4 text-lg">
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
      case '':
        break;
      default:
        output = (
          <p className="text-red-400 text-lg">
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
      processCommand(prompt);
      setPrompt('');
    }
  };

  // Initial welcome message
  useEffect(() => {
    setHistory([
        <div key="welcome">
            <p className="text-lg">Welcome to my interactive terminal portfolio.</p>
            <p className="mt-1 text-lg">
                Type &apos;<span className="text-cyan-400">help</span>&apos; to see the list of available commands.
            </p>
        </div>
    ]);
    inputRef.current?.focus();
  }, []);

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

  return (
    <div
        className="h-[400px] w-full border border-green-600/30 bg-black p-4 rounded-md font-mono flex flex-col"
        onClick={handleClick}
    >
        <div className="flex-grow overflow-y-auto" ref={terminalRef}>
            {history}
            <div ref={bottomRef} />
        </div>
        <div className="flex items-center mt-2 flex-shrink-0">
            <span className="text-cyan-400 text-lg">&gt;</span>
            <input
                ref={inputRef}
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-transparent border-none text-white focus:outline-none w-full ml-2 text-lg"
            />
        </div>
    </div>
  );
}
