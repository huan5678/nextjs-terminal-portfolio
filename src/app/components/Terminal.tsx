'use client';
import React, { useState } from 'react';
import Terminal, { ColorMode, TerminalOutput } from 'react-terminal-ui';
import AsciiHero from '@/app/components/AsciiHero';
import ProgressBar from '@/app/components/ProgressBar';

export default function TerminalController() {
  const [terminalLineData, setTerminalLineData] = useState([
    <TerminalOutput key="progress">
      <ProgressBar />
    </TerminalOutput>,
    <TerminalOutput key="hero">
      <AsciiHero />
    </TerminalOutput>,
    <TerminalOutput key="welcome">Type help then Enter</TerminalOutput>
  ]);

  const onInput = (input: string) => {
    let newTerminalLineData = [...terminalLineData];
    newTerminalLineData.push(<TerminalOutput key={`input-${Date.now()}`}>{`$ ${input}`}</TerminalOutput>);

    const cmd = input.toLocaleLowerCase().trim();

    if (cmd === 'help') {
      newTerminalLineData.push(<TerminalOutput key={`help-${Date.now()}`}>help / clear / about</TerminalOutput>);
    } else if (cmd === 'about') {
      newTerminalLineData.push(<TerminalOutput key={`about-${Date.now()}`}>{`Pure front-end demo - ${new Date().toLocaleDateString()}`}</TerminalOutput>);
    } else if (cmd === 'clear') {
      newTerminalLineData = [];
    } else if (cmd) {
      newTerminalLineData.push(<TerminalOutput key={`not-found-${Date.now()}`}>{`command not found: ${cmd}`}</TerminalOutput>);
    }

    setTerminalLineData(newTerminalLineData);
  };

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
