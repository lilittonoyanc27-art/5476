import React, { useState } from 'react';
import { GameOne } from './GameOne';
import { GameTwo } from './GameTwo';
import { GrammarGuide } from './GrammarGuide';
import { sounds } from './audio';
import { Trophy, BookOpen, Sparkles, Volume2, Globe, HelpCircle } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'game1' | 'game2' | 'grammar'>('game1');
  const [globalShowTranslations, setGlobalShowTranslations] = useState<boolean>(false);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);

  const switchTab = (tab: 'game1' | 'game2' | 'grammar') => {
    sounds.playClick();
    setCurrentTab(tab);
  };

  const toggleGlobalTranslations = () => {
    sounds.playClick();
    setGlobalShowTranslations((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-md shadow-amber-500/20">
              ⚽
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider">
                <span>🇪🇸 🇦🇲 FUTURO SIMPLE</span>
              </div>
              <h1 className="text-base md:text-lg font-bold text-white tracking-tight leading-none">
                Fútbol y Español <span className="text-slate-400 font-normal hidden sm:inline">| Ֆուտբոլ և Իսպաներեն</span>
              </h1>
            </div>
          </div>

          {/* Quick Actions & Translation Mode Toggle */}
          <div className="flex items-center gap-2">
            {/* Global Translation Switch */}
            <button
              onClick={toggleGlobalTranslations}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                globalShowTranslations
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title="Միացնել կամ անջատել բոլոր թարգմանությունների ցուցադրումը"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {globalShowTranslations ? 'Թարգմանությունները՝ Բաց' : 'Թարգմանությունը՝ Հպումով'}
              </span>
              <span className="sm:hidden font-mono">🇦🇲 {globalShowTranslations ? 'ON' : 'TAP'}</span>
            </button>

            {/* Whistle sound button */}
            <button
              onClick={() => sounds.playWhistle()}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
              title="Մրցավարի սուլիչ 🔔"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            {/* Help / Guide modal trigger */}
            <button
              onClick={() => {
                sounds.playClick();
                setShowHowToPlay((p) => !p);
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
              title="Ինչպես խաղալ"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <div className="max-w-6xl mx-auto px-4 pb-2.5 pt-1 overflow-x-auto flex items-center gap-2">
          <button
            onClick={() => switchTab('game1')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              currentTab === 'game1'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <span>⚽</span> Խաղ 1: ¿Qué pasará? (25 իրավիճակ)
          </button>

          <button
            onClick={() => switchTab('game2')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              currentTab === 'game2'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <span>📐</span> Խաղ 2: Matemáticas y fútbol (Մաթեմատիկա)
          </button>

          <button
            onClick={() => switchTab('grammar')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              currentTab === 'grammar'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Քերականություն & Բառապաշար
          </button>
        </div>
      </header>

      {/* Helper notice / How to play drop-down */}
      {showHowToPlay && (
        <div className="bg-slate-900 border-b border-amber-500/30 px-4 py-3 animate-in fade-in duration-200">
          <div className="max-w-4xl mx-auto flex items-start justify-between gap-4">
            <div className="text-xs md:text-sm text-slate-300 space-y-1">
              <p className="font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Ինչպե՞ս սովորել և խաղալ.
              </p>
              <p>
                1. <strong>Կտտացրեք ցանկացած իսպաներեն նախադասության կամ տարբերակի վրա</strong> — անմիջապես կբացվի հայերեն թարգմանությունը։
              </p>
              <p>
                2. <strong>Սեղմեք բարձրախոսի կոճակը (🔊)</strong>՝ իսպաներեն ճիշտ արտասանությունը լսելու համար։
              </p>
              <p>
                3. <strong>Բոլոր ճիշտ պատասխանները</strong> օգտագործում են <strong>Futuro Simple</strong> ժամանակաձևը (ապառնի)։
              </p>
            </div>
            <button
              onClick={() => setShowHowToPlay(false)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded-lg cursor-pointer"
            >
              Փակել
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 pt-6">
        {currentTab === 'game1' && <GameOne globalShowTranslations={globalShowTranslations} />}
        {currentTab === 'game2' && <GameTwo globalShowTranslations={globalShowTranslations} />}
        {currentTab === 'grammar' && <GrammarGuide />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-400">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>⚽🇪🇸🇦🇲 Futuro Simple</span>
            <span>&bull;</span>
            <span>Nivel A2–B1</span>
            <span>&bull;</span>
            <span>Español & Հայերեն</span>
          </div>
          <div>
            Ինտերակտիվ ուսումնական հավելված իսպաներեն սովորողների համար
          </div>
        </div>
      </footer>
    </div>
  );
}
