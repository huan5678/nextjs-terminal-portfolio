'use client';
import React, { useState, useEffect } from 'react';
import Terminal, { ColorMode, TerminalOutput } from 'react-terminal-ui';
import AsciiHero from '@/app/components/AsciiHero';
import ProgressBar from '@/app/components/ProgressBar';
import About from '@/app/components/About';
import Skills from '@/app/components/Skills';
import Projects from '@/app/components/Projects';
import Contact from '@/app/components/Contact';

export default function TerminalController() {
  const commandDescriptions: { [ key: string ]: string } = {
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
          <li key={cmd} className="flex items-center gap-x-4">
            <span className="text-cyan-400 w-20">{cmd}</span>
            <span className="text-neutral-400">{commandDescriptions[ cmd ]}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const [terminalLineData, setTerminalLineData] = useState([
    <TerminalOutput key="progress">
      <ProgressBar />
    </TerminalOutput>,
    <TerminalOutput key="hero">
      <AsciiHero />
    </TerminalOutput>,
    <TerminalOutput key="welcome">
      <p>Welcome to my interactive terminal portfolio.</p>
      <p className="mt-1">
        Type &apos;<span className="text-cyan-400">help</span>&apos; to see the list of available commands.
      </p>
    </TerminalOutput>
  ]);

  const onInput = (input: string) => {
    let newTerminalLineData = [...terminalLineData];
    newTerminalLineData.push(<TerminalOutput key={`input-${Date.now()}`}>{`$ ${input}`}</TerminalOutput>);

    const cmd = input.toLocaleLowerCase().trim();
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
        newTerminalLineData = [];
        break;
      case '':
        break;
      default:
        output = (
          <p className="text-red-400">
            Command not found: {cmd}. Type &apos;help&apos; for available commands.
          </p>
        );
        break;
    }

    if (output) {
      newTerminalLineData.push(<TerminalOutput key={`output-${Date.now()}`}>{output}</TerminalOutput>);
    }

    setTerminalLineData(newTerminalLineData);
  };

  useEffect(() => {
    const terminal = document.querySelector('[data-rbd-droppable-id="terminal-wrapper"] > div');

    if (terminal) {
      const observer = new MutationObserver(() => {
        terminal.scrollTop = terminal.scrollHeight;
      });

      observer.observe(terminal, { childList: true, subtree: true });

      return () => {
        observer.disconnect();
      };
    }
  }, [terminalLineData]);

  return (
    <div className="h-[400px] w-full border border-green-600/30">
        <Terminal
            name="Terminal"
            colorMode={ ColorMode.Dark }
            onInput={ onInput }
            prompt=">"
        >
            { terminalLineData }
        </Terminal>
    </div>
  );
}