'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  RotateCcw,
  Users,
  Bot,
  Trophy,
  History,
  Undo2,
  Sparkles,
  X as XIcon,
  Circle,
  Volume2,
  VolumeX,
  Handshake,
  Frown,
} from 'lucide-react';

type Player = 'X' | 'O' | null;
type GameMode = 'pvp' | 'ai';
type Difficulty = 'easy' | 'hard';
type ThemeMode = 'light' | 'dark';
type LanguageCode = 'en' | 'id' | 'su' | 'jv' | 'bt' | 'ms' | 'bbc';

interface WinResult {
  winner: 'X' | 'O';
  line: number[];
}

interface TranslationSet {
  label: string;
  subtitle: string;
  twoPlayers: string;
  vsAi: string;
  diffEasy: string;
  diffHard: string;
  playerX: string;
  playerO: string;
  aiBot: string;
  draws: string;
  turnPrefix: string;
  aiThinking: string;
  youWin: string;
  playerXWin: string;
  playerOWin: string;
  aiWin: string;
  drawResult: string;
  winSubYou: string;
  winSubPlayer: string;
  loseSubAi: string;
  drawSub: string;
  tryAgain: string;
  viewBoard: string;
  undo: string;
  newRound: string;
  resetScore: string;
  historyLabel: string;
  start: string;
  themeLight: string;
  themeDark: string;
}

const TRANSLATIONS: Record<LanguageCode, TranslationSet> = {
  en: {
    label: 'English',
    subtitle: 'Classic Strategy Game',
    twoPlayers: '2P',
    vsAi: 'VS AI Bot',
    diffEasy: 'Casual',
    diffHard: 'Unbeatable',
    playerX: 'Player X',
    playerO: 'Player O',
    aiBot: 'AI Bot (O)',
    draws: 'Draws',
    turnPrefix: 'Turn:',
    aiThinking: 'AI is thinking...',
    youWin: 'You Win!',
    playerXWin: 'Player X Wins!',
    playerOWin: 'Player O Wins!',
    aiWin: 'AI Bot Wins!',
    drawResult: "It's a Draw!",
    winSubYou: 'Awesome! You defeated the AI.',
    winSubPlayer: 'Congratulations on the victory!',
    loseSubAi: 'Nice try! Give it another shot.',
    drawSub: 'Evenly matched! Nobody loses.',
    tryAgain: 'Try Again',
    viewBoard: 'View Board',
    undo: 'Undo',
    newRound: 'New Round',
    resetScore: 'Reset Score',
    historyLabel: 'Move History',
    start: 'Start',
    themeLight: 'Light',
    themeDark: 'Dark',
  },
  id: {
    label: 'Indonesia',
    subtitle: 'Permainan Strategi Klasik',
    twoPlayers: '2P',
    vsAi: 'Lawan AI Bot',
    diffEasy: 'Santai',
    diffHard: 'Tak Terkalahkan',
    playerX: 'Pemain X',
    playerO: 'Pemain O',
    aiBot: 'AI Bot (O)',
    draws: 'Seri',
    turnPrefix: 'Giliran:',
    aiThinking: 'AI sedang berpikir...',
    youWin: 'Anda Menang!',
    playerXWin: 'Pemain X Menang!',
    playerOWin: 'Pemain O Menang!',
    aiWin: 'AI Bot Menang!',
    drawResult: 'Hasil Seri!',
    winSubYou: 'Hebat! Anda berhasil mengalahkan AI.',
    winSubPlayer: 'Selamat atas kemenangannya!',
    loseSubAi: 'Coba lagi! Anda pasti bisa menang.',
    drawSub: 'Pertandingan sengit dan seimbang!',
    tryAgain: 'Main Lagi',
    viewBoard: 'Lihat Papan',
    undo: 'Mundur',
    newRound: 'Ronde Baru',
    resetScore: 'Reset Skor',
    historyLabel: 'Riwayat Langkah',
    start: 'Mulai',
    themeLight: 'Terang',
    themeDark: 'Gelap',
  },
  su: {
    label: 'Sunda',
    subtitle: 'Kaulinan Stratégi Klasik',
    twoPlayers: '2P',
    vsAi: 'Lawan AI Bot',
    diffEasy: 'Santai',
    diffHard: 'Hésé Éléh',
    playerX: 'Pamaén X',
    playerO: 'Pamaén O',
    aiBot: 'AI Bot (O)',
    draws: 'Seri',
    turnPrefix: 'Giliran:',
    aiThinking: 'AI nuju mikir...',
    youWin: 'Anjeun Meunang!',
    playerXWin: 'Pamaén X Meunang!',
    playerOWin: 'Pamaén O Meunang!',
    aiWin: 'AI Bot Meunang!',
    drawResult: 'Hasilna Seri!',
    winSubYou: 'Alus pisan! Anjeun tiasa ngéléhkeun AI.',
    winSubPlayer: 'Wilujeng kana kameunanganana!',
    loseSubAi: 'Cobian deui! Ulah nyerah.',
    drawSub: 'Sami kuat! Teu aya nu éléh.',
    tryAgain: 'Maén Deui',
    viewBoard: 'Tingali Papan',
    undo: 'Mundur',
    newRound: 'Babak Anyar',
    resetScore: 'Reset Skor',
    historyLabel: 'Riwayat Léngkah',
    start: 'Mimiti',
    themeLight: 'Caang',
    themeDark: 'Poék',
  },
  jv: {
    label: 'Jawa',
    subtitle: 'Dolanan Strategi Klasik',
    twoPlayers: '2P',
    vsAi: 'Lawan AI Bot',
    diffEasy: 'Santai',
    diffHard: 'Angel Kalah',
    playerX: 'Pemain X',
    playerO: 'Pemain O',
    aiBot: 'AI Bot (O)',
    draws: 'Seri',
    turnPrefix: 'Giliran:',
    aiThinking: 'AI lagi mikir...',
    youWin: 'Sampeyan Menang!',
    playerXWin: 'Pemain X Menang!',
    playerOWin: 'Pemain O Menang!',
    aiWin: 'AI Bot Menang!',
    drawResult: 'Hasile Seri!',
    winSubYou: 'Apik tenan! Sampeyan iso ngalahke AI.',
    winSubPlayer: 'Sugeng menang ing babak iki!',
    loseSubAi: 'Coba maneh! Ojo gampang nyerah.',
    drawSub: 'Podho kuate! Ora ono sing kalah.',
    tryAgain: 'Main Maneh',
    viewBoard: 'Delok Papan',
    undo: 'Mundur',
    newRound: 'Babak Anyar',
    resetScore: 'Reset Skor',
    historyLabel: 'Riwayat Langkah',
    start: 'Wiwit',
    themeLight: 'Padhang',
    themeDark: 'Peteng',
  },
  bt: {
    label: 'Betawi',
    subtitle: 'Maenan Strategi Klasik',
    twoPlayers: '2P',
    vsAi: 'Lawan AI Bot',
    diffEasy: 'Santai',
    diffHard: 'Susah Kalah',
    playerX: 'Pemain X',
    playerO: 'Pemain O',
    aiBot: 'AI Bot (O)',
    draws: 'Seri',
    turnPrefix: 'Giliran:',
    aiThinking: 'AI lagi mikir...',
    youWin: 'Lu Menang!',
    playerXWin: 'Pemain X Menang!',
    playerOWin: 'Pemain O Menang!',
    aiWin: 'AI Bot Menang!',
    drawResult: 'Seri Dah!',
    winSubYou: 'Jago bener! Lu berhasil ngalahin AI.',
    winSubPlayer: 'Mantap dah menang ronde ini!',
    loseSubAi: 'Coba lagi dah! Jangan nyerah.',
    drawSub: 'Sama kuat! Kagak ada nyang kalah.',
    tryAgain: 'Maen Lagi',
    viewBoard: 'Liat Papan',
    undo: 'Mundur',
    newRound: 'Ronde Baru',
    resetScore: 'Reset Skor',
    historyLabel: 'Catetan Langkah',
    start: 'Mulai',
    themeLight: 'Terang',
    themeDark: 'Gelap',
  },
  ms: {
    label: 'Melayu',
    subtitle: 'Permainan Strategi Klasik',
    twoPlayers: '2P',
    vsAi: 'Lawan AI Bot',
    diffEasy: 'Santai',
    diffHard: 'Sukar Kalah',
    playerX: 'Pemain X',
    playerO: 'Pemain O',
    aiBot: 'AI Bot (O)',
    draws: 'Seri',
    turnPrefix: 'Giliran:',
    aiThinking: 'AI sedang berfikir...',
    youWin: 'Anda Menang!',
    playerXWin: 'Pemain X Menang!',
    playerOWin: 'Pemain O Menang!',
    aiWin: 'AI Bot Menang!',
    drawResult: 'Keputusan Seri!',
    winSubYou: 'Hebat! Anda berjaya menewaskan AI.',
    winSubPlayer: 'Tahniah atas kemenangan ini!',
    loseSubAi: 'Cuba lagi! Jangan berputus asa.',
    drawSub: 'Sama handal! Tiada yang kalah.',
    tryAgain: 'Main Lagi',
    viewBoard: 'Lihat Papan',
    undo: 'Undur',
    newRound: 'Pusingan Baru',
    resetScore: 'Set Semula Skor',
    historyLabel: 'Sejarah Langkah',
    start: 'Mula',
    themeLight: 'Cerah',
    themeDark: 'Gelap',
  },
  bbc: {
    label: 'Batak',
    subtitle: 'Parmeaman Strategi Klasik',
    twoPlayers: '2P',
    vsAi: 'Alo AI Bot',
    diffEasy: 'Santai',
    diffHard: 'Maol Talu',
    playerX: 'Parmain X',
    playerO: 'Parmain O',
    aiBot: 'AI Bot (O)',
    draws: 'Seri',
    turnPrefix: 'Giliran:',
    aiThinking: 'AI lagi marpingkir...',
    youWin: 'Hamu Monang!',
    playerXWin: 'Parmain X Monang!',
    playerOWin: 'Parmain O Monang!',
    aiWin: 'AI Bot Monang!',
    drawResult: 'Hasil Seri!',
    winSubYou: 'Mantap! Berhasil do hamu manaluhon AI.',
    winSubPlayer: 'Selamat di hamonangan on!',
    loseSubAi: 'Cuba muse! Unang mandele.',
    drawSub: 'Sarupa gogo! Ndang adong na talu.',
    tryAgain: 'Main Muse',
    viewBoard: 'Bereng Papan',
    undo: 'Mulak',
    newRound: 'Ronde Imbaru',
    resetScore: 'Reset Skor',
    historyLabel: 'Riwayat Langka',
    start: 'Mulai',
    themeLight: 'Tiur',
    themeDark: 'Golap',
  },
};

const WINNING_COMBINATIONS: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function calculateWinner(squares: Player[]): WinResult | null {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a] as 'X' | 'O', line: [a, b, c] };
    }
  }
  return null;
}

function getBestMove(squares: Player[]): number {
  const minimax = (board: Player[], depth: number, isMaximizing: boolean): number => {
    const result = calculateWinner(board);
    if (result?.winner === 'O') return 10 - depth;
    if (result?.winner === 'X') return depth - 10;
    if (board.every((cell) => cell !== null)) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = 'O';
          const score = minimax(board, depth + 1, false);
          board[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = 'X';
          const score = minimax(board, depth + 1, true);
          board[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  let bestScore = -Infinity;
  let move = -1;
  const boardCopy = [...squares];

  for (let i = 0; i < 9; i++) {
    if (boardCopy[i] === null) {
      boardCopy[i] = 'O';
      const score = minimax(boardCopy, 0, false);
      boardCopy[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function getCasualMove(squares: Player[]): number {
  const available = squares
    .map((val, idx) => (val === null ? idx : null))
    .filter((val): val is number => val !== null);
  if (available.length === 0) return -1;
  if (Math.random() < 0.38) {
    return available[Math.floor(Math.random() * available.length)];
  }
  return getBestMove(squares);
}

export default function TicTacToePage() {
  const [history, setHistory] = useState<{ squares: Player[]; position: number | null }[]>([
    { squares: Array(9).fill(null), position: null },
  ]);
  const [stepNumber, setStepNumber] = useState<number>(0);
  const [mode, setMode] = useState<GameMode>('ai');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [scoredStep, setScoredStep] = useState<number | null>(null);

  // Theme, Bahasa, Pop-up, & SFX
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [lang, setLang] = useState<LanguageCode>('en');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const t = TRANSLATIONS[lang];
  const isDark = theme === 'dark';

  const getAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (!audioCtxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playSfx = useCallback(
    (type: 'moveX' | 'moveO' | 'win' | 'lose' | 'draw' | 'click') => {
      if (!soundEnabled) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      const playTone = (
        freqStart: number,
        freqEnd: number,
        startTime: number,
        duration: number,
        wave: OscillatorType = 'sine',
        gainPeak = 0.14
      ) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = wave;
        osc.frequency.setValueAtTime(freqStart, startTime);
        osc.frequency.exponentialRampToValueAtTime(Math.max(40, freqEnd), startTime + duration);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(gainPeak, startTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration + 0.01);
      };

      if (type === 'moveX') {
        playTone(520, 740, now, 0.09, 'triangle', 0.15);
      } else if (type === 'moveO') {
        playTone(400, 560, now, 0.09, 'sine', 0.15);
      } else if (type === 'click') {
        playTone(620, 480, now, 0.05, 'sine', 0.08);
      } else if (type === 'win') {
        playTone(523.25, 523.25, now, 0.12, 'triangle', 0.16);
        playTone(659.25, 659.25, now + 0.11, 0.12, 'triangle', 0.16);
        playTone(783.99, 783.99, now + 0.22, 0.14, 'triangle', 0.16);
        playTone(1046.5, 1046.5, now + 0.34, 0.32, 'triangle', 0.18);
      } else if (type === 'lose') {
        playTone(440, 415, now, 0.16, 'sawtooth', 0.09);
        playTone(392, 360, now + 0.17, 0.18, 'sawtooth', 0.09);
        playTone(329.63, 280, now + 0.35, 0.32, 'sawtooth', 0.09);
      } else if (type === 'draw') {
        playTone(440, 440, now, 0.13, 'sine', 0.12);
        playTone(440, 440, now + 0.16, 0.18, 'sine', 0.12);
      }
    },
    [soundEnabled, getAudioContext]
  );

  const currentSquares = history[stepNumber].squares;
  const isXNext = stepNumber % 2 === 0;
  const winInfo = calculateWinner(currentSquares);
  const winnerSymbol = winInfo?.winner ?? null;
  const isDraw = !winnerSymbol && currentSquares.every((cell) => cell !== null);
  const isAiThinking = mode === 'ai' && !isXNext && !winnerSymbol && !isDraw;

  // Hitung skor & mainkan SFX saat ronde selesai
  useEffect(() => {
    if ((!winnerSymbol && !isDraw) || scoredStep === stepNumber) return;

    setScoredStep(stepNumber);
    if (winnerSymbol) {
      setScores((prev) => ({
        ...prev,
        [winnerSymbol]: prev[winnerSymbol] + 1,
      }));
      if (mode === 'ai' && winnerSymbol === 'O') {
        playSfx('lose');
      } else {
        playSfx('win');
      }
    } else if (isDraw) {
      setScores((prev) => ({
        ...prev,
        draws: prev.draws + 1,
      }));
      playSfx('draw');
    }
  }, [winnerSymbol, isDraw, stepNumber, scoredStep, mode, playSfx]);

  // Tampilkan jendela pop-up di tengah layar saat menang / kalah / seri
  useEffect(() => {
    if (winnerSymbol || isDraw) {
      const modalTimer = setTimeout(() => {
        setShowModal(true);
      }, 280);
      return () => clearTimeout(modalTimer);
    } else {
      setShowModal(false);
    }
  }, [winnerSymbol, isDraw, stepNumber]);

  // Giliran AI Bot
  useEffect(() => {
    if (!isAiThinking) return;

    const timer = setTimeout(() => {
      const moveIdx =
        difficulty === 'hard' ? getBestMove(currentSquares) : getCasualMove(currentSquares);
      if (moveIdx !== -1) {
        const nextSquares = [...currentSquares];
        nextSquares[moveIdx] = 'O';
        playSfx('moveO');
        setHistory((prev) => [
          ...prev.slice(0, stepNumber + 1),
          { squares: nextSquares, position: moveIdx },
        ]);
        setStepNumber((prev) => prev + 1);
      }
    }, 320);

    return () => clearTimeout(timer);
  }, [isAiThinking, difficulty, currentSquares, stepNumber, playSfx]);

  const handleCellClick = (index: number) => {
    if (currentSquares[index] || winnerSymbol || isDraw || isAiThinking) return;

    const nextSquares = [...currentSquares];
    nextSquares[index] = isXNext ? 'X' : 'O';
    playSfx(isXNext ? 'moveX' : 'moveO');

    setHistory((prev) => [
      ...prev.slice(0, stepNumber + 1),
      { squares: nextSquares, position: index },
    ]);
    setStepNumber((prev) => prev + 1);
  };

  const resetRound = () => {
    playSfx('click');
    setShowModal(false);
    setHistory([{ squares: Array(9).fill(null), position: null }]);
    setStepNumber(0);
    setScoredStep(null);
  };

  const resetAll = () => {
    resetRound();
    setScores({ X: 0, O: 0, draws: 0 });
  };

  const switchMode = (newMode: GameMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    resetAll();
  };

  const handleUndo = () => {
    if (stepNumber === 0 || isAiThinking) return;
    playSfx('click');
    setShowModal(false);
    const targetStep = mode === 'ai' && stepNumber >= 2 ? stepNumber - 2 : stepNumber - 1;
    setStepNumber(Math.max(0, targetStep));
    setScoredStep(null);
  };

  const getResultTitle = () => {
    if (winnerSymbol) {
      if (mode === 'ai') {
        return winnerSymbol === 'X' ? t.youWin : t.aiWin;
      }
      return winnerSymbol === 'X' ? t.playerXWin : t.playerOWin;
    }
    return t.drawResult;
  };

  const getResultSubtitle = () => {
    if (winnerSymbol) {
      if (mode === 'ai') {
        return winnerSymbol === 'X' ? t.winSubYou : t.loseSubAi;
      }
      return t.winSubPlayer;
    }
    return t.drawSub;
  };

  const isPlayerLoss = Boolean(winnerSymbol && mode === 'ai' && winnerSymbol === 'O');

  return (
    <main
      className={`min-h-screen flex flex-col items-center justify-center p-3 sm:p-5 transition-colors duration-200 ${
        isDark ? 'bg-slate-950 text-slate-50' : 'bg-slate-100 text-slate-900'
      }`}
    >
      <div
        className={`w-full max-w-md rounded-2xl border p-4 sm:p-5 shadow-md space-y-3.5 transition-colors duration-200 ${
          isDark
            ? 'bg-slate-900 border-slate-700 text-slate-50'
            : 'bg-white border-slate-300 text-slate-900'
        }`}
      >
        {/* Top Bar: Judul + Dropdown Bahasa & Theme di Kanan Atas */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="truncate">Tic-Tac-Toe</span>
            </h1>
            <p className={`text-[11px] ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {t.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <select
              aria-label="Language"
              value={lang}
              onChange={(e) => {
                setLang(e.target.value as LanguageCode);
                playSfx('click');
              }}
              className={`rounded-lg border px-2 py-1 text-xs font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                isDark
                  ? 'bg-slate-800 border-slate-600 text-slate-100'
                  : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            >
              {(Object.keys(TRANSLATIONS) as LanguageCode[]).map((code) => (
                <option key={code} value={code}>
                  {TRANSLATIONS[code].label}
                </option>
              ))}
            </select>

            <select
              aria-label="Theme"
              value={theme}
              onChange={(e) => {
                setTheme(e.target.value as ThemeMode);
                playSfx('click');
              }}
              className={`rounded-lg border px-2 py-1 text-xs font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                isDark
                  ? 'bg-slate-800 border-slate-600 text-slate-100'
                  : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            >
              <option value="light">☀️ {t.themeLight}</option>
              <option value="dark">🌙 {t.themeDark}</option>
            </select>

            <button
              type="button"
              onClick={() => setSoundEnabled((prev) => !prev)}
              aria-label="Toggle Sound"
              title={soundEnabled ? 'SFX On' : 'SFX Off'}
              className={`p-1.5 rounded-lg border transition cursor-pointer ${
                isDark
                  ? 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700'
                  : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {/* Baris Kontrol Mode (2P / VS AI Bot) + Dropdown Tingkat Kesulitan Sejajar */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div
            className={`inline-flex rounded-lg border p-1 ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300'
            }`}
          >
            <button
              type="button"
              onClick={() => switchMode('pvp')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                mode === 'pvp'
                  ? isDark
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-950 shadow-xs'
                  : isDark
                  ? 'text-slate-300 hover:text-white'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              {t.twoPlayers}
            </button>
            <button
              type="button"
              onClick={() => switchMode('ai')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                mode === 'ai'
                  ? isDark
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-950 shadow-xs'
                  : isDark
                  ? 'text-slate-300 hover:text-white'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              {t.vsAi}
            </button>
          </div>

          {mode === 'ai' && (
            <select
              aria-label="AI Difficulty"
              value={difficulty}
              onChange={(e) => {
                setDifficulty(e.target.value as Difficulty);
                resetRound();
              }}
              className={`rounded-lg border px-2.5 py-1.5 text-xs font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                isDark
                  ? 'bg-slate-800 border-slate-600 text-emerald-400'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-800'
              }`}
            >
              <option value="easy">{t.diffEasy}</option>
              <option value="hard">{t.diffHard}</option>
            </select>
          )}
        </div>

        {/* Scoreboard */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div
            className={`rounded-xl border py-1.5 px-2 ${
              isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-300'
            }`}
          >
            <p className={`text-[11px] font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {t.playerX}
            </p>
            <p className="text-base sm:text-lg font-extrabold">{scores.X}</p>
          </div>
          <div
            className={`rounded-xl border py-1.5 px-2 ${
              isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-300'
            }`}
          >
            <p className={`text-[11px] font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {t.draws}
            </p>
            <p className="text-base sm:text-lg font-extrabold">{scores.draws}</p>
          </div>
          <div
            className={`rounded-xl border py-1.5 px-2 ${
              isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-300'
            }`}
          >
            <p className={`text-[11px] font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {mode === 'ai' ? t.aiBot : t.playerO}
            </p>
            <p className="text-base sm:text-lg font-extrabold text-emerald-500">{scores.O}</p>
          </div>
        </div>

        {/* Status Giliran Ringkas */}
        <div
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs sm:text-sm font-bold ${
            winnerSymbol
              ? isDark
                ? 'bg-emerald-950/70 border-emerald-700 text-emerald-300'
                : 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : isDraw
              ? isDark
                ? 'bg-amber-950/70 border-amber-700 text-amber-300'
                : 'bg-amber-50 border-amber-300 text-amber-800'
              : isDark
              ? 'bg-slate-800 border-slate-700 text-slate-200'
              : 'bg-slate-50 border-slate-300 text-slate-800'
          }`}
        >
          {winnerSymbol ? (
            <>
              <Trophy className="w-4 h-4 text-emerald-500" />
              <span>{getResultTitle()}</span>
            </>
          ) : isDraw ? (
            <span>{t.drawResult}</span>
          ) : isAiThinking ? (
            <span>{t.aiThinking}</span>
          ) : (
            <span>
              {t.turnPrefix}{' '}
              <strong className={isXNext ? '' : 'text-emerald-500'}>
                {isXNext ? t.playerX : mode === 'ai' ? t.aiBot : t.playerO}
              </strong>
            </span>
          )}
        </div>

        {/* Papan 3x3 (Ukuran 80%) */}
        <div className="w-[80%] max-w-[275px] mx-auto grid grid-cols-3 gap-2">
          {currentSquares.map((value, idx) => {
            const isWinningCell = winInfo?.line.includes(idx);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleCellClick(idx)}
                disabled={Boolean(value) || Boolean(winnerSymbol) || isDraw || isAiThinking}
                aria-label={`Cell ${idx + 1}`}
                className={`aspect-square rounded-xl border-2 flex items-center justify-center transition-all duration-150 ${
                  isWinningCell
                    ? 'bg-emerald-500 border-emerald-600 text-white shadow-md scale-[1.03]'
                    : value
                    ? isDark
                      ? 'bg-slate-800 border-slate-600 text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                    : isDark
                    ? 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 hover:border-slate-500 active:scale-95 cursor-pointer'
                    : 'bg-slate-50 border-slate-300 hover:bg-slate-100 hover:border-slate-400 active:scale-95 cursor-pointer'
                }`}
              >
                {value === 'X' && (
                  <XIcon
                    className={`w-8 h-8 sm:w-9 sm:h-9 stroke-[3] ${
                      isWinningCell ? 'text-white' : isDark ? 'text-slate-100' : 'text-slate-900'
                    }`}
                  />
                )}
                {value === 'O' && (
                  <Circle
                    className={`w-7 h-7 sm:w-8 sm:h-8 stroke-[3] ${
                      isWinningCell ? 'text-white' : 'text-emerald-500'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tombol Kontrol */}
        <div className="flex gap-2 pt-0.5">
          <button
            type="button"
            onClick={handleUndo}
            disabled={stepNumber === 0 || isAiThinking}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-bold disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer ${
              isDark
                ? 'bg-slate-800 border-slate-600 text-slate-100 hover:bg-slate-700'
                : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Undo2 className="w-3.5 h-3.5" />
            {t.undo}
          </button>
          <button
            type="button"
            onClick={resetRound}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-2.5 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {t.newRound}
          </button>
          <button
            type="button"
            onClick={resetAll}
            className={`inline-flex items-center justify-center rounded-lg border px-2.5 py-2 text-xs font-bold transition cursor-pointer ${
              isDark
                ? 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {t.resetScore}
          </button>
        </div>

        {/* Riwayat Langkah */}
        <div
          className={`border-t pt-2.5 ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          <div
            className={`flex items-center gap-1.5 text-[11px] font-semibold mb-1.5 ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>
              {t.historyLabel} ({stepNumber}/9)
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {history.map((_, move) => (
              <button
                key={move}
                type="button"
                onClick={() => {
                  playSfx('click');
                  setStepNumber(move);
                  setScoredStep(null);
                  setShowModal(false);
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-bold border transition cursor-pointer ${
                  move === stepNumber
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : isDark
                    ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                }`}
              >
                {move === 0 ? t.start : `#${move}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Jendela Pop-up Hasil Menang / Kalah / Seri di Tengah Layar */}
      {showModal && (winnerSymbol || isDraw) && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
        >
          <div
            className={`w-full max-w-xs sm:max-w-sm rounded-2xl border-2 p-6 text-center shadow-2xl space-y-4 ${
              isDark
                ? 'bg-slate-900 border-emerald-500/60 text-slate-50'
                : 'bg-white border-emerald-500 text-slate-900'
            }`}
          >
            <div
              className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                isDraw
                  ? 'bg-amber-500/20 text-amber-500'
                  : isPlayerLoss
                  ? 'bg-rose-500/20 text-rose-500'
                  : 'bg-emerald-500/20 text-emerald-500'
              }`}
            >
              {isDraw ? (
                <Handshake className="w-9 h-9" />
              ) : isPlayerLoss ? (
                <Frown className="w-9 h-9" />
              ) : (
                <Trophy className="w-9 h-9" />
              )}
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold tracking-tight">{getResultTitle()}</h2>
              <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {getResultSubtitle()}
              </p>
            </div>

            {/* Ringkasan Skor di Pop-up */}
            <div
              className={`grid grid-cols-3 gap-2 rounded-xl border py-2.5 px-3 text-xs ${
                isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div>
                <span className="block opacity-75">{t.playerX}</span>
                <strong className="text-sm font-extrabold">{scores.X}</strong>
              </div>
              <div>
                <span className="block opacity-75">{t.draws}</span>
                <strong className="text-sm font-extrabold">{scores.draws}</strong>
              </div>
              <div>
                <span className="block opacity-75">{mode === 'ai' ? 'AI' : t.playerO}</span>
                <strong className="text-sm font-extrabold text-emerald-500">{scores.O}</strong>
              </div>
            </div>

            {/* Tombol Main Lagi / Try Again & Lihat Papan */}
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                type="button"
                onClick={resetRound}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-extrabold text-white hover:bg-emerald-500 shadow-md transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                {t.tryAgain}
              </button>
              <button
                type="button"
                onClick={() => {
                  playSfx('click');
                  setShowModal(false);
                }}
                className={`inline-flex items-center justify-center rounded-xl border px-3.5 py-2.5 text-xs font-bold transition cursor-pointer ${
                  isDark
                    ? 'bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700'
                    : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.viewBoard}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
