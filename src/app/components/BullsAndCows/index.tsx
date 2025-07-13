'use client';

import React, { useState, useEffect, useRef } from 'react';
import { BullsAndCowsEngine, GuessResult } from './engine';
import { submitScore } from '@/utils/scoreApi';

interface BullsAndCowsProps {
  onClose: () => void;
}

const BullsAndCows: React.FC<BullsAndCowsProps> = ({ onClose }) => {
  const [engine, setEngine] = useState(new BullsAndCowsEngine());
  const [guess, setGuess] = useState('');
  const [totalScore, setTotalScore] = useState(0);
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.length === 4 && !engine.isGameOver) {
      const result = engine.submitGuess(guess);
      if (result && engine.isGameWon) {
        setTotalScore(prevScore => prevScore + engine.score);
      }
      setGuess('');
    }
  };

  const handleNextGame = () => {
    setEngine(new BullsAndCowsEngine());
  };

  const handleGameOver = async () => {
    if (totalScore > 0) {
      setIsSubmitting(true);
      try {
        await submitScore(totalScore);
        setSubmissionMessage('Score submitted successfully!');
      } catch (error) {
        setSubmissionMessage('Failed to submit score.');
      }
      setIsSubmitting(false);
    }
    setEngine(new BullsAndCowsEngine());
    setTotalScore(0);
  };

  const handleScoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setSubmissionMessage('Please enter your name.');
      return;
    }
    setIsSubmitting(true);
    try {
      await submitScore(engine.score);
      setSubmissionMessage('Score submitted successfully!');
    } catch (error) {
      setSubmissionMessage('Failed to submit score.');
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [engine.isGameOver]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 font-mono">
      <div className="bg-[#0c0c0c] border-2 border-[#4a4a4a] rounded-lg p-6 w-[400px] text-white">
        <h2 className="text-2xl text-center mb-4 theme-primary">Guess Digit - Total Score: {totalScore}</h2>
        <div className="h-64 overflow-y-auto mb-4 p-2 border border-[#4a4a4a] bg-[#1a1a1a]">
          {engine.history.map((result, index) => (
            <div key={index} className="flex justify-between">
              <span>{index + 1}. {result.guess}</span>
              <span>A: {result.bulls}, B: {result.cows}</span>
            </div>
          ))}
          {engine.isGameOver && (
            <div className="mt-4 text-center">
              {engine.isGameWon ? (
                <div>
                  <p className="text-green-500">You won! The code was {engine.getSecretCode()}.</p>
                  <p className="text-yellow-500">Your score for this round: {engine.score}</p>
                  <button onClick={handleNextGame} className="w-full bg-green-500 text-white p-2 mt-2 rounded-md">Next Game</button>
                </div>
              ) : (
                <p className="text-red-500">Game Over! The code was {engine.getSecretCode()}.</p>
              )}
            </div>
          )}
        </div>
        {!engine.isGameOver ? (
          <form onSubmit={handleGuessSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              maxLength={4}
              className="w-full bg-[#1a1a1a] border border-[#4a4a4a] p-2 text-center text-lg"
              placeholder="Enter 4 digits"
            />
            <button type="submit" className="w-full bg-[#ff9f43] text-black p-2 mt-2 rounded-md">Guess</button>
          </form>
        ) : (
          <button onClick={handleGameOver} className="w-full bg-red-500 text-white p-2 mt-2 rounded-md">Over Game</button>
        )}
        <button onClick={onClose} className="w-full bg-gray-600 text-white p-2 mt-2 rounded-md">Close</button>
      </div>
    </div>
  );
};

export default BullsAndCows;