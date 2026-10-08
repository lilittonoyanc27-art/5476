import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle2, XCircle, RotateCcw, ChevronLeft, ChevronRight, Eye, EyeOff, Trophy, Sparkles, Filter } from 'lucide-react';
import { GAME_ONE_QUESTIONS } from './gameData';
import { GameOneQuestion } from './types';
import { speakSpanish, sounds } from './audio';

interface GameOneProps {
  globalShowTranslations: boolean;
}

export const GameOne: React.FC<GameOneProps> = ({ globalShowTranslations }) => {
  // Modes: 'quiz' (step-by-step interactive) or 'all' (all 25 cards list for classroom/study)
  const [viewMode, setViewMode] = useState<'quiz' | 'all'>('quiz');
  const [selectedRound, setSelectedRound] = useState<number | 'all'>('all');
  
  // Quiz specific state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [score, setScore] = useState(0);
  const [revealedTranslations, setRevealedTranslations] = useState<Record<string, boolean>>({});
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  // Filter questions based on selected round
  const filteredQuestions = selectedRound === 'all'
    ? GAME_ONE_QUESTIONS
    : GAME_ONE_QUESTIONS.filter((q) => q.round === selectedRound);

  const currentQ: GameOneQuestion | undefined = filteredQuestions[currentIndex] || filteredQuestions[0];

  // Reset quiz index if round changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedRound]);

  const toggleTranslation = (idKey: string) => {
    sounds.playClick();
    setRevealedTranslations((prev) => ({
      ...prev,
      [idKey]: !prev[idKey],
    }));
  };

  const isTranslationVisible = (idKey: string) => {
    return globalShowTranslations || !!revealedTranslations[idKey];
  };

  const handleSpeak = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sounds.playClick();
    setSpeakingText(text);
    speakSpanish(text, () => setSpeakingText(null));
  };

  const handleSelectAnswer = (questionId: number, selected: 'A' | 'B' | 'C' | 'D', correct: 'A' | 'B' | 'C' | 'D') => {
    if (userAnswers[questionId]) return; // already answered

    const isCorrect = selected === correct;
    if (isCorrect) {
      sounds.playCorrect();
      setScore((s) => s + 1);
    } else {
      sounds.playIncorrect();
    }

    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: selected,
    }));
  };

  const resetQuiz = () => {
    sounds.playWhistle();
    setUserAnswers({});
    setScore(0);
    setCurrentIndex(0);
    setRevealedTranslations({});
  };

  const totalAnswered = Object.keys(userAnswers).length;
  const isFinished = filteredQuestions.length > 0 && filteredQuestions.every((q) => userAnswers[q.id]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Game Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/80 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none select-none text-8xl font-black text-amber-300">
          ⚽
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 text-amber-400 font-semibold tracking-wide text-xs uppercase">
              <span>⚽ 🇪🇸 🇦🇲</span>
              <span>Futuro Simple | Nivel A2–B1</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              ¿Qué pasará? — Լսիր, պատկերացրու և որոշիր
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Ուսուցիչը կամ աշակերտը կարդում է իրավիճակը իսպաներենով։ Ընտրեք ապառնի ժամանակով (Futuro Simple) առավել տրամաբանական քայլը։
              <br />
              <span className="text-amber-300 font-medium inline-flex items-center gap-1 mt-1">
                👉 Կտտացրեք ցանկացած իսպաներեն տեքստի վրա՝ հայերեն թարգմանությունը բացելու համար։
              </span>
            </p>
          </div>

          {/* Quick stats widget */}
          <div className="bg-slate-900/80 border border-slate-700/90 rounded-xl p-4 flex md:flex-col items-center justify-between gap-3 shrink-0">
            <div className="text-center">
              <div className="text-xs text-slate-400">Միավորներ</div>
              <div className="text-2xl font-black text-amber-400">{score} / {filteredQuestions.length}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-400">Պատասխանված</div>
              <div className="text-sm font-semibold text-slate-200">
                {totalAnswered} / {filteredQuestions.length}
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Mode Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-5 border-t border-slate-700/60">
          {/* Round Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
            <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Փուլեր:
            </span>
            {[
              { id: 'all', label: 'Բոլոր 25-ը' },
              { id: 1, label: 'Փուլ 1' },
              { id: 2, label: 'Փուլ 2' },
              { id: 3, label: 'Փուլ 3' },
              { id: 4, label: 'Փուլ 4' },
              { id: 5, label: 'Փուլ 5' },
            ].map((round) => (
              <button
                key={round.id}
                onClick={() => {
                  sounds.playClick();
                  setSelectedRound(round.id as number | 'all');
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedRound === round.id
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {round.label}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 p-1 rounded-xl flex items-center border border-slate-700">
              <button
                onClick={() => {
                  sounds.playClick();
                  setViewMode('quiz');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'quiz' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Ինտերակտիվ թեստ
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setViewMode('all');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Բոլոր քարտերը (25)
              </button>
            </div>

            <button
              onClick={resetQuiz}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-amber-400 hover:bg-slate-700 transition-colors border border-slate-700 cursor-pointer"
              title="Վերսկսել թեստը"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* QUIZ VIEW MODE */}
      {viewMode === 'quiz' && currentQ && (
        <div className="space-y-4">
          {/* Progress Bar & Quiz Nav */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              Իրավիճակ {currentIndex + 1} / {filteredQuestions.length} &bull; {currentQ.roundTitleHy}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  sounds.playClick();
                  setCurrentIndex((i) => Math.max(0, i - 1));
                }}
                disabled={currentIndex === 0}
                className="p-1 rounded bg-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-700 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-slate-200 px-1">
                {currentIndex + 1} / {filteredQuestions.length}
              </span>
              <button
                onClick={() => {
                  sounds.playClick();
                  setCurrentIndex((i) => Math.min(filteredQuestions.length - 1, i + 1));
                }}
                disabled={currentIndex === filteredQuestions.length - 1}
                className="p-1 rounded bg-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-700 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%`,
              }}
            />
          </div>

          {/* Interactive Question Card */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 md:p-8 shadow-lg">
            {/* Header info */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {currentQ.roundTitleEs}
                </span>
                <h2
                  onClick={() => toggleTranslation(`title_${currentQ.id}`)}
                  className="text-xl md:text-2xl font-bold text-white mt-2 cursor-pointer hover:text-amber-300 transition-colors flex items-center gap-2 group"
                  title="Կտտացրեք հայերեն թարգմանության համար"
                >
                  <span>{currentQ.id}. {currentQ.titleEs}</span>
                  <span className="text-xs text-slate-400 font-normal group-hover:text-amber-300">
                    {isTranslationVisible(`title_${currentQ.id}`) ? '🇦🇲 ' + currentQ.titleHy : '🇦🇲 [Կտտացրեք]'}
                  </span>
                </h2>
              </div>

              <button
                onClick={(e) => handleSpeak(`${currentQ.titleEs}. ${currentQ.situationEs} ${currentQ.questionEs}`, e)}
                className={`p-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-all shrink-0 cursor-pointer ${
                  speakingText?.includes(currentQ.titleEs) ? 'animate-bounce text-emerald-400' : ''
                }`}
                title="Լսել իրավիճակը իսպաներենով"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Situation & Question (Clickable to reveal Armenian) */}
            <div
              onClick={() => toggleTranslation(`sit_${currentQ.id}`)}
              className="p-4 md:p-5 rounded-xl bg-slate-900/80 border border-slate-700/70 hover:border-amber-500/40 cursor-pointer transition-all mb-6 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <p className="text-base md:text-lg text-slate-100 font-medium leading-relaxed">
                    <span className="font-bold text-amber-400 mr-2">🇪🇸</span>
                    {currentQ.situationEs}
                  </p>
                  <p className="text-base md:text-lg text-amber-300 font-semibold mt-2">
                    <span className="font-bold text-amber-400 mr-2">🇪🇸</span>
                    {currentQ.questionEs}
                  </p>
                </div>
                <div className="text-slate-400 group-hover:text-amber-400 shrink-0 p-1">
                  {isTranslationVisible(`sit_${currentQ.id}`) ? (
                    <EyeOff className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </div>
              </div>

              {/* Translation revealed on click */}
              {isTranslationVisible(`sit_${currentQ.id}`) ? (
                <div className="mt-3 pt-3 border-t border-slate-800 text-emerald-300 text-sm md:text-base leading-relaxed animate-in fade-in duration-200">
                  <div className="font-semibold flex items-center gap-1.5 text-emerald-400">
                    <span>🇦🇲</span> {currentQ.situationHy}
                  </div>
                  <div className="mt-1 font-bold text-emerald-300">
                    <span>🇦🇲</span> {currentQ.questionHy}
                  </div>
                </div>
              ) : (
                <div className="mt-2 text-xs text-slate-500 italic flex items-center gap-1">
                  <span>🇦🇲 Կտտացրեք այստեղ՝ հայերեն թարգմանությունը բացելու համար</span>
                </div>
              )}
            </div>

            {/* Answer Options */}
            <div className="space-y-3 mb-6">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center justify-between">
                <span>Ընտրեք ճիշտ տարբերակը (Opciones):</span>
                <span className="text-[11px] text-slate-500 lowercase">կտտացրեք 🇦🇲 նշանի վրա թարգմանության համար</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {currentQ.options.map((opt) => {
                  const hasAnswered = !!userAnswers[currentQ.id];
                  const isSelected = userAnswers[currentQ.id] === opt.key;
                  const isCorrect = currentQ.correctAnswer === opt.key;
                  const optTransKey = `opt_${currentQ.id}_${opt.key}`;
                  const showOptTrans = isTranslationVisible(optTransKey);

                  let btnStyle = 'bg-slate-900/60 border-slate-700 text-slate-200 hover:border-amber-400 hover:bg-slate-900';
                  if (hasAnswered) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200 ring-1 ring-rose-500';
                    } else {
                      btnStyle = 'bg-slate-900/30 border-slate-800 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <div
                      key={opt.key}
                      className={`border rounded-xl p-3.5 transition-all ${btnStyle}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        {/* Clickable option selection */}
                        <button
                          onClick={() => handleSelectAnswer(currentQ.id, opt.key, currentQ.correctAnswer)}
                          disabled={hasAnswered}
                          className="flex items-center gap-3 text-left flex-1 cursor-pointer disabled:cursor-default"
                        >
                          <span
                            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                              hasAnswered && isCorrect
                                ? 'bg-emerald-500 text-slate-950'
                                : hasAnswered && isSelected
                                ? 'bg-rose-500 text-white'
                                : 'bg-slate-800 text-amber-300'
                            }`}
                          >
                            {opt.key}
                          </span>
                          <span className="text-sm md:text-base font-semibold">{opt.textEs}</span>
                        </button>

                        {/* Actions: Speak & Toggle Armenian */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => toggleTranslation(optTransKey)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors cursor-pointer text-xs flex items-center gap-1"
                            title="Թարգմանել հայերեն"
                          >
                            <span className="font-mono text-xs">🇦🇲</span>
                          </button>
                          <button
                            onClick={(e) => handleSpeak(opt.textEs, e)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Լսել"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Revealed Armenian translation */}
                      {showOptTrans && (
                        <div className="mt-2 pt-2 border-t border-slate-800/80 text-xs md:text-sm text-emerald-300 font-medium animate-in fade-in duration-200">
                          🇦🇲 {opt.textHy}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Feedback / Explanation Box */}
            {userAnswers[currentQ.id] && (
              <div
                className={`p-4 rounded-xl border animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                  userAnswers[currentQ.id] === currentQ.correctAnswer
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {userAnswers[currentQ.id] === currentQ.correctAnswer ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p className="font-bold text-sm">
                      {userAnswers[currentQ.id] === currentQ.correctAnswer
                        ? '🎉 Ճիշտ է! (¡Correcto!)'
                        : `❌ Սխալ է: Ճիշտ պատասխանն է ${currentQ.correctAnswer}:`}
                    </p>
                    {currentQ.explanationHy && (
                      <p className="text-xs md:text-sm text-slate-300 leading-relaxed mt-1">
                        {currentQ.explanationHy}
                      </p>
                    )}
                    {currentQ.verbInFocus && (
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/80 text-amber-300 font-mono text-xs">
                        <Sparkles className="w-3.5 h-3.5" />
                        Բայ՝ {currentQ.verbInFocus}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700/60">
              <button
                onClick={() => {
                  sounds.playClick();
                  setCurrentIndex((i) => Math.max(0, i - 1));
                }}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-700 transition-colors flex items-center gap-2 text-sm cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" /> Նախորդը
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setCurrentIndex((i) => Math.min(filteredQuestions.length - 1, i + 1));
                }}
                disabled={currentIndex === filteredQuestions.length - 1}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all flex items-center gap-2 text-sm shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Հաջորդը <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Finished Celebration */}
          {isFinished && (
            <div className="bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-indigo-500/20 border border-amber-500/40 rounded-2xl p-6 text-center space-y-3">
              <Trophy className="w-12 h-12 text-amber-400 mx-auto" />
              <h3 className="text-xl font-extrabold text-white">Դուք ավարտեցիք բոլոր իրավիճակները!</h3>
              <p className="text-slate-300 text-sm">
                Ձեր արդյունքը՝ <strong className="text-amber-400">{score}</strong> / {filteredQuestions.length} ({Math.round((score / filteredQuestions.length) * 100)}%)
              </p>
              <button
                onClick={resetQuiz}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Կրկնել խաղը
              </button>
            </div>
          )}
        </div>
      )}

      {/* ALL CARDS VIEW MODE (Study / Teacher Mode for all 25) */}
      {viewMode === 'all' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2 text-sm text-slate-300">
            <span>Ցուցադրված են {filteredQuestions.length} իրավիճակներ</span>
            <span className="text-xs text-amber-300">💡 Կտտացրեք ցանկացած տողի վրա թարգմանության համար</span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {filteredQuestions.map((q) => {
              const sitTransKey = `sit_${q.id}`;
              const isSitOpen = isTranslationVisible(sitTransKey);
              const userAnswer = userAnswers[q.id];

              return (
                <div
                  key={q.id}
                  className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-md transition-all hover:border-slate-600"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <span className="text-xs text-indigo-400 font-semibold">{q.roundTitleHy}</span>
                      <h3
                        onClick={() => toggleTranslation(`title_${q.id}`)}
                        className="text-lg font-bold text-white hover:text-amber-300 cursor-pointer transition-colors mt-0.5"
                      >
                        {q.id}. {q.titleEs} — <span className="text-slate-400 font-normal">{q.titleHy}</span>
                      </h3>
                    </div>
                    <button
                      onClick={(e) => handleSpeak(`${q.titleEs}. ${q.situationEs} ${q.questionEs}`, e)}
                      className="p-2 rounded-xl bg-slate-900 text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-colors shrink-0 cursor-pointer"
                      title="Լսել"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Situation box */}
                  <div
                    onClick={() => toggleTranslation(sitTransKey)}
                    className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/60 hover:border-amber-500/40 cursor-pointer transition-all mb-4"
                  >
                    <p className="text-slate-100 font-medium leading-relaxed">
                      🇪🇸 {q.situationEs} <strong className="text-amber-300">{q.questionEs}</strong>
                    </p>
                    {isSitOpen ? (
                      <div className="mt-2.5 pt-2.5 border-t border-slate-800 text-emerald-300 text-sm leading-relaxed animate-in fade-in duration-200">
                        🇦🇲 {q.situationHy} <strong className="text-emerald-400">{q.questionHy}</strong>
                      </div>
                    ) : (
                      <div className="mt-1.5 text-xs text-slate-500 italic">
                        🇦🇲 Կտտացրեք թարգմանության համար
                      </div>
                    )}
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    {q.options.map((opt) => {
                      const isCorrect = q.correctAnswer === opt.key;
                      const isChosen = userAnswer === opt.key;
                      const optTransKey = `opt_${q.id}_${opt.key}`;
                      const showOpt = isTranslationVisible(optTransKey);

                      return (
                        <div
                          key={opt.key}
                          onClick={() => handleSelectAnswer(q.id, opt.key, q.correctAnswer)}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                            userAnswer
                              ? isCorrect
                                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                                : isChosen
                                ? 'bg-rose-950/60 border-rose-500 text-rose-200'
                                : 'bg-slate-900/40 border-slate-800 text-slate-500'
                              : 'bg-slate-900/50 border-slate-800 text-slate-200 hover:border-amber-400'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-sm">
                              <span className="text-amber-400 mr-1.5">{opt.key})</span>
                              {opt.textEs}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleTranslation(optTransKey);
                                }}
                                className="text-[11px] text-slate-400 hover:text-amber-400 p-1"
                                title="Թարգմանել"
                              >
                                🇦🇲
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSpeak(opt.textEs);
                                }}
                                className="text-slate-400 hover:text-amber-400 p-1"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          {showOpt && (
                            <div className="mt-1.5 text-xs text-emerald-300 border-t border-slate-800 pt-1">
                              🇦🇲 {opt.textHy}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Correct Answer Note */}
                  {userAnswer && (
                    <div className="mt-3 p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                      <strong className="text-emerald-400">✅ Ճիշտ պատասխան: {q.correctAnswer}</strong> — {q.explanationHy}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
