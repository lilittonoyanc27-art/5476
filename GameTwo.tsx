import React, { useState } from 'react';
import { Volume2, CheckCircle2, XCircle, RotateCcw, Calculator, Award, MessageSquare, Brain, Send } from 'lucide-react';
import { GAME_TWO_QUESTIONS, COACH_QUESTIONS, MENTAL_MATH_ITEMS, FINAL_ROLE_TASKS } from './gameData';
import { GameTwoQuestion } from './types';
import { speakSpanish, sounds } from './audio';

interface GameTwoProps {
  globalShowTranslations: boolean;
}

export const GameTwo: React.FC<GameTwoProps> = ({ globalShowTranslations }) => {
  const [activeTab, setActiveTab] = useState<'math' | 'coach' | 'mental' | 'roles'>('math');
  const [selectedRound, setSelectedRound] = useState<number | 'all'>('all');
  
  // Multiple Choice Questions State
  const [userAnswers, setUserAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [score, setScore] = useState(0);
  const [revealedTranslations, setRevealedTranslations] = useState<Record<string, boolean>>({});
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  // Coach Questions Reveal State
  const [revealedCoach, setRevealedCoach] = useState<Record<number, boolean>>({});

  // Mental Math Reveal State & Interactive Input
  const [mentalRevealed, setMentalRevealed] = useState<Record<number, boolean>>({});
  const [mentalInputs, setMentalInputs] = useState<Record<number, string>>({});

  // Final role builder student input
  const [customRoleSentences, setCustomRoleSentences] = useState<Record<string, string>>({
    futbolista: '',
    entrenador: '',
    aficionado: '',
  });
  const [completedRoles, setCompletedRoles] = useState<Record<string, boolean>>({});

  const filteredQuestions = selectedRound === 'all'
    ? GAME_TWO_QUESTIONS
    : GAME_TWO_QUESTIONS.filter((q) => q.round === selectedRound);

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

  const handleSelectAnswer = (q: GameTwoQuestion, selected: 'A' | 'B' | 'C' | 'D') => {
    if (userAnswers[q.id]) return;

    const isCorrect = selected === q.correctAnswer;
    if (isCorrect) {
      sounds.playCorrect();
      setScore((s) => s + 1);
    } else {
      sounds.playIncorrect();
    }

    setUserAnswers((prev) => ({
      ...prev,
      [q.id]: selected,
    }));
  };

  const resetGame = () => {
    sounds.playWhistle();
    setUserAnswers({});
    setScore(0);
    setRevealedTranslations({});
    setRevealedCoach({});
    setMentalRevealed({});
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Game Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 border border-slate-700/80 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none select-none text-8xl font-black text-emerald-400">
          📐
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 text-emerald-400 font-semibold tracking-wide text-xs uppercase">
              <span>⚽ 🇪🇸 🇦🇲</span>
              <span>Matemáticas y Fútbol | Futuro Simple</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Matemática del futbolista — Մտածիր ֆուտբոլիստի պես
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Լսիր իսպաներեն հարցը, հաշվիր մաթեմատիկական խնդիրը, սովորիր Futuro Simple ժամանակաձևն ու ֆուտբոլային մարտավարությունը։
              <br />
              <span className="text-emerald-300 font-medium inline-flex items-center gap-1 mt-1">
                👉 Կտտացրեք ցանկացած իսպաներեն տեքստի վրա՝ հայերեն թարգմանությունը բացելու համար։
              </span>
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-700/90 rounded-xl p-4 flex md:flex-col items-center justify-between gap-3 shrink-0">
            <div className="text-center">
              <div className="text-xs text-slate-400">Ճիշտ հաշվարկ</div>
              <div className="text-2xl font-black text-emerald-400">{score} / {GAME_TWO_QUESTIONS.length}</div>
            </div>
            <button
              onClick={resetGame}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Վերսկսել
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-slate-700/60">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('math');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'math'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Calculator className="w-4 h-4" /> Փուլեր 1–3: Հաշվարկ և Գիտելիք (16)
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('coach');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'coach'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Փուլ 4: Դու մարզիչն ես (4)
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('mental');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'mental'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Brain className="w-4 h-4" /> Մտավոր հաշվարկ (Mini desafío)
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('roles');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'roles'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" /> Վերջնական առաջադրանք (3 դերեր)
          </button>
        </div>
      </div>

      {/* SECTION 1: ROUNDS 1 - 3 (Questions 1 to 16) */}
      {activeTab === 'math' && (
        <div className="space-y-6">
          {/* Sub-Round Filter */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-xs text-slate-400 mr-1">Փուլեր:</span>
            {[
              { id: 'all', label: 'Բոլոր 16-ը' },
              { id: 1, label: 'Փուլ 1: Հաշվիր (1–6)' },
              { id: 2, label: 'Փուլ 2: Ի՞նչ իմանալ (7–12)' },
              { id: 3, label: 'Փուլ 3: Ապագա չեմպիոն (13–16)' },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  sounds.playClick();
                  setSelectedRound(r.id as number | 'all');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedRound === r.id
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Cards List */}
          <div className="space-y-6">
            {filteredQuestions.map((q) => {
              const sitTransKey = `math_sit_${q.id}`;
              const isSitOpen = isTranslationVisible(sitTransKey);
              const userAnswer = userAnswers[q.id];

              return (
                <div
                  key={q.id}
                  className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-md hover:border-slate-600 transition-all"
                >
                  {/* Title & Speak */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {q.roundTitleHy}
                      </span>
                      <h3
                        onClick={() => toggleTranslation(`math_title_${q.id}`)}
                        className="text-lg font-bold text-white mt-1.5 cursor-pointer hover:text-emerald-300 transition-colors flex items-center gap-2 group"
                      >
                        <span>{q.id}. {q.titleEs}</span>
                        <span className="text-xs font-normal text-slate-400 group-hover:text-emerald-300">
                          {isTranslationVisible(`math_title_${q.id}`) ? `🇦🇲 ${q.titleHy}` : '🇦🇲 [Կտտացրեք]'}
                        </span>
                      </h3>
                    </div>

                    <button
                      onClick={(e) => handleSpeak(`${q.titleEs}. ${q.contextEs} ${q.questionEs}`, e)}
                      className={`p-2 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-colors shrink-0 cursor-pointer ${
                        speakingText?.includes(q.titleEs) ? 'animate-bounce text-amber-300' : ''
                      }`}
                      title="Լսել իսպաներենով"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Context & Question (Click to reveal Armenian) */}
                  <div
                    onClick={() => toggleTranslation(sitTransKey)}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/60 hover:border-emerald-500/40 cursor-pointer transition-all mb-4 group"
                  >
                    <div className="text-slate-100 font-medium leading-relaxed">
                      <p>
                        <span className="text-emerald-400 font-bold mr-1.5">🇪🇸</span>
                        {q.contextEs}
                      </p>
                      <p className="mt-1.5 font-bold text-emerald-300">
                        <span className="text-emerald-400 font-bold mr-1.5">🇪🇸</span>
                        {q.questionEs}
                      </p>
                    </div>

                    {isSitOpen ? (
                      <div className="mt-3 pt-3 border-t border-slate-800 text-emerald-300 text-sm leading-relaxed animate-in fade-in duration-200">
                        <p>
                          <span className="font-bold mr-1">🇦🇲</span>
                          {q.contextHy}
                        </p>
                        <p className="mt-1 font-bold text-emerald-400">
                          <span className="font-bold mr-1">🇦🇲</span>
                          {q.questionHy}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-2 text-xs text-slate-500 italic">
                        🇦🇲 Կտտացրեք թարգմանության համար
                      </div>
                    )}
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                    {q.options.map((opt) => {
                      const isCorrect = q.correctAnswer === opt.key;
                      const isChosen = userAnswer === opt.key;
                      const optTransKey = `math_opt_${q.id}_${opt.key}`;
                      const showOpt = isTranslationVisible(optTransKey);

                      let style = 'bg-slate-900/50 border-slate-700 text-slate-200 hover:border-emerald-400';
                      if (userAnswer) {
                        if (isCorrect) {
                          style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500';
                        } else if (isChosen) {
                          style = 'bg-rose-950/60 border-rose-500 text-rose-200 ring-1 ring-rose-500';
                        } else {
                          style = 'bg-slate-900/30 border-slate-800 text-slate-500 opacity-60';
                        }
                      }

                      return (
                        <div
                          key={opt.key}
                          onClick={() => handleSelectAnswer(q, opt.key)}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${style}`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-sm">
                              <span className="text-emerald-400 mr-2">{opt.key})</span>
                              {opt.textEs}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleTranslation(optTransKey);
                                }}
                                className="text-[11px] text-slate-400 hover:text-emerald-300 p-1"
                                title="Թարգմանել"
                              >
                                🇦🇲
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSpeak(opt.textEs);
                                }}
                                className="text-slate-400 hover:text-emerald-300 p-1"
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

                  {/* Detailed explanation and formula when answered */}
                  {userAnswer && (
                    <div
                      className={`p-4 rounded-xl border mt-3 animate-in fade-in duration-200 ${
                        userAnswer === q.correctAnswer
                          ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                          : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {userAnswer === q.correctAnswer ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                        )}
                        <div className="space-y-1 text-sm">
                          <p className="font-bold">
                            ✅ Ճիշտ պատասխան: {q.correctAnswer}) {q.explanationEs}
                          </p>
                          <p className="text-xs md:text-sm text-slate-300">
                            🇦🇲 {q.explanationHy}
                          </p>
                          {q.formula && (
                            <div className="mt-1 font-mono text-xs text-amber-300 bg-slate-900/80 px-2 py-1 rounded inline-block">
                              Հաշվարկ՝ {q.formula}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: ROUND 4 — ERES EL ENTRENADOR (Questions 17 to 20) */}
      {activeTab === 'coach' && (
        <div className="space-y-6">
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              Ronda 4 — Eres el entrenador (Դու մարզիչն ես)
            </h2>
            <p className="text-sm text-slate-300">
              Մարզիչը պատասխանում է ապառնի ժամանակով (Futuro Simple)։ Կարդացեք իրավիճակը, մտածեք ձեր պատասխանը, այնուհետև բացեք մարզչի պատասխանը և լսեք արտասանությունը։
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {COACH_QUESTIONS.map((cq) => {
              const isRevealed = !!revealedCoach[cq.id];
              const sitTransKey = `coach_sit_${cq.id}`;
              const isSitOpen = isTranslationVisible(sitTransKey);

              return (
                <div
                  key={cq.id}
                  className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Հարց {cq.id}
                    </span>
                    <button
                      onClick={(e) => handleSpeak(`${cq.situationEs} ${cq.questionEs}`, e)}
                      className="p-2 rounded-xl bg-slate-900 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-colors"
                      title="Լսել հարցը"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Situation box */}
                  <div
                    onClick={() => toggleTranslation(sitTransKey)}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/60 hover:border-emerald-500/40 cursor-pointer transition-all mb-4"
                  >
                    <p className="text-slate-100 font-medium">
                      🇪🇸 {cq.situationEs} <strong className="text-emerald-300">{cq.questionEs}</strong>
                    </p>
                    {isSitOpen ? (
                      <div className="mt-2.5 pt-2.5 border-t border-slate-800 text-emerald-300 text-sm animate-in fade-in duration-200">
                        🇦🇲 {cq.situationHy} <strong className="text-emerald-400">{cq.questionHy}</strong>
                      </div>
                    ) : (
                      <div className="mt-1.5 text-xs text-slate-500 italic">
                        🇦🇲 Կտտացրեք թարգմանության համար
                      </div>
                    )}
                  </div>

                  {/* Reveal Coach Answer */}
                  {!isRevealed ? (
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setRevealedCoach((prev) => ({ ...prev, [cq.id]: true }));
                      }}
                      className="w-full py-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>👀 Տեսնել մարզչի պատասխանը (Ver respuesta)</span>
                    </button>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/50 space-y-3 animate-in fade-in duration-200">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                            Մարզչի պատասխանը (Respuesta del entrenador):
                          </div>
                          <p className="text-base font-bold text-white">
                            🇪🇸 {cq.sampleAnswerEs}
                          </p>
                          <p className="text-sm font-medium text-emerald-300 mt-1">
                            🇦🇲 {cq.sampleAnswerHy}
                          </p>
                        </div>
                        <button
                          onClick={() => handleSpeak(cq.sampleAnswerEs)}
                          className="p-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors shrink-0"
                          title="Լսել պատասխանը"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Key verbs */}
                      <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-2">
                        <span className="text-xs text-slate-400">Օգտագործված բայեր՝</span>
                        {cq.keyVerbs.map((v, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-mono text-xs border border-slate-700"
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 3: MINI DESAFÍO — MENTAL MATH */}
      {activeTab === 'mental' && (
        <div className="space-y-6">
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Brain className="w-5 h-5 text-amber-400" />
              ⚡ Mini desafío — Calcula mentalmente y dilo en español
            </h2>
            <p className="text-sm text-slate-300">
              Մտքում հաշվիր գործողությունը և բարձրաձայն ասա իսպաներենով։ Կտտացրու քարտի վրա՝ իսպաներեն և հայերեն թվանունները տեսնելու և լսելու համար։
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MENTAL_MATH_ITEMS.map((item) => {
              const isRevealed = !!mentalRevealed[item.id];
              const userInput = mentalInputs[item.id] || '';
              const isUserCorrect = userInput.trim() === String(item.resultNum);

              return (
                <div
                  key={item.id}
                  className="bg-slate-800/90 border border-slate-700 hover:border-amber-500/50 rounded-2xl p-5 shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="text-2xl font-black text-amber-300 font-mono tracking-wider">
                      {item.operation}
                    </span>
                    <button
                      onClick={() => handleSpeak(`${item.operation.replace('−', 'menos').replace('×', 'por').replace('+', 'más')} es igual a ${item.spanishText}`)}
                      className="p-2 rounded-xl bg-slate-900 text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-colors"
                      title="Լսել ամբողջ գործողությունը"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Interactive input test */}
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="number"
                      placeholder="Մուտքագրեք արդյունքը..."
                      value={userInput}
                      onChange={(e) =>
                        setMentalInputs((prev) => ({ ...prev, [item.id]: e.target.value }))
                      }
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-sm text-white focus:outline-none focus:border-amber-400 flex-1"
                    />
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setMentalRevealed((prev) => ({ ...prev, [item.id]: true }));
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                    >
                      Ստուգել
                    </button>
                  </div>

                  {/* Feedback and Reveal */}
                  {isRevealed && (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 space-y-2 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-bold text-emerald-400">
                          = {item.resultNum} {userInput && (isUserCorrect ? '🎯 Ճիշտ է' : '❌')}
                        </span>
                        <button
                          onClick={() => handleSpeak(item.spanishText)}
                          className="p-1 rounded text-amber-400 hover:bg-slate-800"
                          title="Լսել թվանունը"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-sm font-bold text-white">
                        🇪🇸 {item.spanishText}
                      </div>
                      <div className="text-xs font-medium text-emerald-300">
                        🇦🇲 {item.armenianText}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 4: FINAL ROLE TASK */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Վերջնական առաջադրանք — 3 Դերեր (Futbolista, Entrenador, Aficionado)
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Աշակերտը պետք է օգտագործի <strong className="text-amber-300">Futuro Simple</strong> և կազմի երեք նախադասություն՝ որպես ֆուտբոլիստ, մարզիչ և երկրպագու։
              Ներքևում կարող եք տեսնել օրինակները, լսել դրանք, և ինքնուրույն գրել ձեր սեփական տարբերակները։
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FINAL_ROLE_TASKS.map((rt, idx) => {
              const roleKey = idx === 0 ? 'futbolista' : idx === 1 ? 'entrenador' : 'aficionado';
              const isDone = !!completedRoles[roleKey];

              return (
                <div
                  key={idx}
                  className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">{rt.icon}</span>
                      <button
                        onClick={() => handleSpeak(rt.sentenceEs)}
                        className="p-2 rounded-xl bg-slate-900 text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-colors"
                        title="Լսել օրինակը"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="font-bold text-white text-base">
                      {rt.role} — <span className="text-emerald-400 font-medium">{rt.roleHy}</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 mb-3">{rt.promptHy}</p>

                    {/* Standard example */}
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 mb-4">
                      <div className="text-xs text-slate-400 font-semibold uppercase">Օրինակային նախադասություն՝</div>
                      <p className="text-sm font-bold text-amber-300">🇪🇸 {rt.sentenceEs}</p>
                      <p className="text-xs text-emerald-300">🇦🇲 {rt.sentenceHy}</p>
                      <div className="mt-1 pt-1 border-t border-slate-800 text-[11px] font-mono text-slate-400">
                        Բայ՝ {rt.verbUsed}
                      </div>
                    </div>
                  </div>

                  {/* Student practice box */}
                  <div className="space-y-2 pt-2 border-t border-slate-700/60">
                    <label className="text-xs text-slate-300 font-medium block">
                      Գրիր քո նախադասությունը՝
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={`${rt.role}, yo...`}
                        value={customRoleSentences[roleKey]}
                        onChange={(e) =>
                          setCustomRoleSentences((prev) => ({
                            ...prev,
                            [roleKey]: e.target.value,
                          }))
                        }
                        className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white flex-1 focus:outline-none focus:border-emerald-400"
                      />
                      <button
                        onClick={() => {
                          if (customRoleSentences[roleKey].trim()) {
                            sounds.playCorrect();
                            setCompletedRoles((prev) => ({ ...prev, [roleKey]: true }));
                          }
                        }}
                        className="p-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-colors cursor-pointer"
                        title="Հաստատել"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {isDone && (
                      <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Գերազանց է! Պահպանված է։
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
