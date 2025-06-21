// src/app/hangman/page.tsx
"use client";

import { useState, FormEvent, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import HangmanCanvas from '@/components/HangmanCanvas';
// Import styles nếu bạn vẫn dùng Home.module.css cho các class không phải Tailwind
// import styles from '@/styles/Home.module.css';

// Danh sách từ cho trò chơi Hangman
const WORDS = ["APPLE", "BANANA", "ORANGE", "GRAPE", "STRAWBERRY", "BLUEBERRY", "KIWI", "MANGO", "COMPUTER", "KEYBOARD", "MOUSE", "PROGRAMMING", "JAVASCRIPT", "PYTHON", "DEVELOPER"];

const MAX_GUESSES = 6;

// Mảng chứa tất cả các chữ cái trong bảng chữ cái tiếng Anh
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function HangmanPage() {
  const [wordToGuess, setWordToGuess] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [fullWordGuessInput, setFullWordGuessInput] = useState('');

  const startNewGame = useCallback(() => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWordToGuess(randomWord);
    setGuessedLetters(new Set());
    setWrongGuesses(0);
    setGameStatus('playing');
    setFullWordGuessInput('');
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  useEffect(() => {
    if (wordToGuess && gameStatus === 'playing') {
      const isWordGuessed = wordToGuess.split('').every(letter => guessedLetters.has(letter));
      if (isWordGuessed) {
        setGameStatus('won');
      } else if (wrongGuesses >= MAX_GUESSES) {
        setGameStatus('lost');
      }
    }
  }, [guessedLetters, wrongGuesses, wordToGuess, gameStatus]);

  const handleLetterGuess = (letter: string) => {
    if (gameStatus !== 'playing' || guessedLetters.has(letter)) {
      return;
    }

    setGuessedLetters(prev => new Set(prev).add(letter));

    if (!wordToGuess.includes(letter)) {
      setWrongGuesses(prev => prev + 1);
    }
  };

  const handleFullWordGuess = (e: FormEvent) => {
    e.preventDefault();
    if (gameStatus !== 'playing') return;

    const guess = fullWordGuessInput.toUpperCase().trim();
    setFullWordGuessInput('');

    if (!guess) {
      alert("Vui lòng nhập từ bạn muốn đoán.");
      return;
    }

    if (guess === wordToGuess) {
      setGameStatus('won');
    } else {
      setWrongGuesses(prev => prev + 1);
      alert("Đoán sai từ rồi! Thử lại nhé.");
    }
  };

  const getDisplayedWord = () => {
    return wordToGuess.split('').map(letter => guessedLetters.has(letter) ? letter : '_').join(' ');
  };

  return (
    // Điều chỉnh padding và background của container chính
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 sm:p-6 md:p-8">
      <Head>
        <title>Hangman Game - English Quest</title>
        <meta name="description" content="Play Hangman to learn English vocabulary." />
      </Head>

      {/* Main Content: Hangman Game */}
      {/* Giảm padding và gap của main, tăng max-w để nội dung có thể gọn hơn */}
      <main className="w-full max-w-2xl flex flex-col items-center p-6 bg-white rounded-lg shadow-xl space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-4">Hangman: Guess the English Word!</h1>

        {/* Khối game Hangman */}
        {/* Giảm padding và gap của hangmanGame */}
        <div className="flex flex-col items-center gap-4 bg-white p-6 rounded-lg w-full">
          {/* Hiển thị hình ảnh Hangman bằng Canvas component */}
          <div className="relative w-[150px] h-[200px] mb-2 flex justify-center items-center"> {/* Thu nhỏ Canvas container */}
            <HangmanCanvas wrongGuesses={wrongGuesses} /> {/* Đảm bảo CanvasProps có width/height tương ứng */}
          </div>

          {/* Điều chỉnh kích thước và khoảng cách cho chữ */}
          <div className="text-5xl sm:text-6xl font-extrabold tracking-wider text-blue-600 mb-2">
            {getDisplayedWord()}
          </div>

          {/* Điều chỉnh kích thước và màu sắc cho Wrong Guesses */}
          <p className="text-lg sm:text-xl font-bold text-red-500 mb-4">Wrong Guesses: {wrongGuesses} / {MAX_GUESSES}</p>

          {gameStatus === 'playing' && (
            <>
              {/* Đoán cả từ - Đã di chuyển lên trên bàn phím ảo */}
              <form onSubmit={handleFullWordGuess} className="flex flex-col sm:flex-row gap-3 w-full justify-center items-center mb-4">
                <input
                  type="text"
                  value={fullWordGuessInput}
                  onChange={(e) => setFullWordGuessInput(e.target.value)}
                  className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-base uppercase max-w-sm text-center focus:outline-none focus:border-blue-500" // Điều chỉnh kích thước input
                  placeholder="Guess the whole word..."
                  disabled={gameStatus !== 'playing'}
                />
                <button type="submit" className="px-5 py-2 text-base bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300" disabled={gameStatus !== 'playing'}>
                  Guess Word
                </button>
              </form>

              {/* Bàn phím ảo */}
              {/* Giảm gap, padding và font-size của các nút */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2 w-full max-w-lg">
                {ALPHABET.map(letter => (
                  <button
                    key={letter}
                    onClick={() => handleLetterGuess(letter)}
                    disabled={guessedLetters.has(letter) || gameStatus !== 'playing'}
                    className={`
                      p-3 text-lg sm:text-xl font-bold rounded-md shadow-sm
                      transition-colors duration-200 ease-in-out
                      ${guessedLetters.has(letter)
                        ? (wordToGuess.includes(letter)
                            ? 'bg-green-500 text-white cursor-not-allowed opacity-70'
                            : 'bg-red-500 text-white cursor-not-allowed opacity-70')
                        : 'bg-green-600 text-white hover:bg-blue-700'}
                    `}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </>
          )}

          {gameStatus !== 'playing' && (
            <div className="text-center mt-6">
              {gameStatus === 'won' && (
                <p className="text-xl sm:text-2xl font-bold text-green-600">
                  Congratulations! You guessed the word: <span className="text-blue-600 underline">{wordToGuess}</span>
                </p>
              )}
              {gameStatus === 'lost' && (
                <p className="text-xl sm:text-2xl font-bold text-red-600">
                  Game Over! The word was: <span className="text-blue-600 underline">{wordToGuess}</span>
                </p>
              )}
              <button onClick={startNewGame} className="mt-4 px-5 py-2 text-base bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition-colors duration-300">
                Play Again
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}