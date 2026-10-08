import React, { useState } from 'react';
import { Volume2, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import { speakSpanish, sounds } from './audio';

interface VerbEnding {
  pronoun: string;
  ending: string;
  example: string;
  translationHy: string;
}

const REGULAR_ENDINGS: VerbEnding[] = [
  { pronoun: 'Yo', ending: '-é', example: 'jugaré (խաղալու եմ / կխաղամ)', translationHy: 'կխաղամ' },
  { pronoun: 'Tú', ending: '-ás', example: 'jugarás (կխաղաս)', translationHy: 'կխաղաս' },
  { pronoun: 'Él / Ella / Usted', ending: '-á', example: 'jugará (կխաղա)', translationHy: 'կխաղա' },
  { pronoun: 'Nosotros / Nosotras', ending: '-emos', example: 'jugaremos (կխաղանք)', translationHy: 'կխաղանք' },
  { pronoun: 'Vosotros / Vosotras', ending: '-éis', example: 'jugaréis (կխաղաք)', translationHy: 'կխաղաք' },
  { pronoun: 'Ellos / Ellas / Ustedes', ending: '-án', example: 'jugarán (կխաղան)', translationHy: 'կխաղան' },
];

const IRREGULAR_VERBS = [
  { inf: 'hacer (անել)', stem: 'har-', yo: 'haré', tu: 'harás', el: 'hará', hy: 'կանեմ, կանես, կանի...' },
  { inf: 'decir (ասել)', stem: 'dir-', yo: 'diré', tu: 'dirás', el: 'dirá', hy: 'կասեմ, կասես, կասի...' },
  { inf: 'tener (ունենալ)', stem: 'tendr-', yo: 'tendré', tu: 'tendrás', el: 'tendrá', hy: 'կունենամ, կունենաս...' },
  { inf: 'poder (կարողանալ)', stem: 'podr-', yo: 'podré', tu: 'podrás', el: 'podrá', hy: 'կկարողանամ...' },
  { inf: 'salir (դուրս գալ)', stem: 'saldr-', yo: 'saldré', tu: 'saldrás', el: 'saldrá', hy: 'դուրս կգամ...' },
  { inf: 'poner (դնել)', stem: 'pondr-', yo: 'pondré', tu: 'pondrás', el: 'pondrá', hy: 'կդնեմ, կդնես...' },
  { inf: 'venir (գալ)', stem: 'vendr-', yo: 'vendré', tu: 'vendrás', el: 'vendrá', hy: 'կգամ, կգաս...' },
  { inf: 'querer (ուզել, սիրել)', stem: 'querr-', yo: 'querré', tu: 'querrás', el: 'querrá', hy: 'կուզեմ, կուզես...' },
  { inf: 'saber (իմանալ)', stem: 'sabr-', yo: 'sabré', tu: 'sabrás', el: 'sabrá', hy: 'կիմանամ, կիմանաս...' },
  { inf: 'haber (լինել/կա)', stem: 'habr-', yo: '—', tu: '—', el: 'habrá', hy: 'կլինի (միայն 3-րդ դեմքով)' },
];

const FOOTBALL_VOCABULARY = [
  { es: 'el delantero', hy: 'հարձակվող' },
  { es: 'el centrocampista', hy: 'կիսապաշտպան' },
  { es: 'el defensa', hy: 'պաշտպան' },
  { es: 'el portero', hy: 'դարպասապահ' },
  { es: 'el árbitro', hy: 'մրցավար' },
  { es: 'el entrenador', hy: 'մարզիչ' },
  { es: 'el aficionado', hy: 'երկրպագու' },
  { es: 'el penalti', hy: 'տասնմեկմետրանոց' },
  { es: 'la portería', hy: 'դարպաս' },
  { es: 'el estadio', hy: 'մարզադաշտ' },
  { es: 'el tiempo añadido', hy: 'ավելացված ժամանակ' },
  { es: 'el calentamiento', hy: 'նախավարժանք' },
  { es: 'la entrada', hy: 'տոմս' },
  { es: 'la copa', hy: 'գավաթ' },
];

export const GrammarGuide: React.FC = () => {
  const [revealedVocab, setRevealedVocab] = useState<Record<number, boolean>>({});
  const [speakingWord, setSpeakingWord] = useState<string | null>(null);

  const toggleVocab = (idx: number) => {
    sounds.playClick();
    setRevealedVocab((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleSpeak = (text: string) => {
    sounds.playClick();
    setSpeakingWord(text);
    speakSpanish(text, () => setSpeakingWord(null));
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Intro Header */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Futuro Simple — Իսպաներենի Ապառնի Ժամանակը</h2>
            <p className="text-slate-300 leading-relaxed">
              Futuro Simple-ը ցույց է տալիս գործողություն, որը տեղի կունենա ապագայում («կանեմ», «կխաղամ», «կհաղթենք») կամ ներկայում ենթադրություն։
              Կազմվում է չափազանց պարզ՝ <span className="text-amber-300 font-semibold">բայի անորոշ ձևին (Infinitivo)</span> ավելացնելով նույն վերջավորությունները բոլոր երեք խմբերի (-ar, -er, -ir) համար։
            </p>
          </div>
        </div>
      </div>

      {/* Regular Endings Table */}
      <div className="bg-slate-800/70 border border-slate-700 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          Կանոնավոր բայերի վերջավորությունները (Endings)
        </h3>
        <p className="text-sm text-slate-400 mb-4">
          Օրինակ՝ <strong className="text-white">JUGAR</strong> (խաղալ) բայը։ Վերջավորությունները ավելանում են ամբողջական բային՝ <span className="text-amber-300 font-mono">jugar + é = jugaré</span>:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {REGULAR_ENDINGS.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-xl p-3.5 transition-all"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs uppercase tracking-wider text-slate-400">{item.pronoun}</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-sm">
                  {item.ending}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-medium text-slate-200">{item.example}</span>
                <button
                  onClick={() => handleSpeak(item.example.split(' ')[0])}
                  className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors"
                  title="Լսել արտասանությունը"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Irregular Verbs */}
      <div className="bg-slate-800/70 border border-slate-700 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          Անկանոն բայերի արմատները (Verbos Irregulares)
        </h3>
        <p className="text-sm text-slate-400 mb-4">
          Անկանոն բայերը պահպանում են նույն վերջավորությունները (-é, -ás, -á, -emos, -éis, -án), սակայն փոխում են արմատը:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Բայ (Infinitivo)</th>
                <th className="py-3 px-4">Ապառնիի արմատ</th>
                <th className="py-3 px-4">Yo (ես)</th>
                <th className="py-3 px-4">Tú (դու)</th>
                <th className="py-3 px-4">Հայերեն իմաստ</th>
                <th className="py-3 px-4 text-center">Լսել</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {IRREGULAR_VERBS.map((v, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-2.5 px-4 font-semibold text-white">{v.inf}</td>
                  <td className="py-2.5 px-4 font-mono text-amber-300">{v.stem}</td>
                  <td className="py-2.5 px-4 font-medium text-emerald-300">{v.yo}</td>
                  <td className="py-2.5 px-4 font-medium text-emerald-300">{v.tu}</td>
                  <td className="py-2.5 px-4 text-slate-400 text-xs">{v.hy}</td>
                  <td className="py-2.5 px-4 text-center">
                    <button
                      onClick={() => handleSpeak(`${v.yo}, ${v.tu}`)}
                      className="p-1 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors inline-flex"
                      title="Լսել"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Football Vocabulary with Tap-to-Reveal */}
      <div className="bg-slate-800/70 border border-slate-700 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span>⚽</span> Ֆուտբոլային բառապաշար (Vocabulario de Fútbol)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Կտտացրեք իսպաներեն բառի վրա՝ հայերեն թարգմանությունը տեսնելու համար։
            </p>
          </div>
          <button
            onClick={() => {
              const allOpen = Object.keys(revealedVocab).length === FOOTBALL_VOCABULARY.length;
              if (allOpen) {
                setRevealedVocab({});
              } else {
                const next: Record<number, boolean> = {};
                FOOTBALL_VOCABULARY.forEach((_, i) => (next[i] = true));
                setRevealedVocab(next);
              }
              sounds.playClick();
            }}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors self-start sm:self-auto cursor-pointer"
          >
            {Object.keys(revealedVocab).length === FOOTBALL_VOCABULARY.length ? 'Թաքցնել բոլորը' : 'Բացել բոլորը'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {FOOTBALL_VOCABULARY.map((item, idx) => {
            const isRevealed = !!revealedVocab[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleVocab(idx)}
                className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-xl p-3 cursor-pointer transition-all hover:scale-[1.01] group select-none"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white group-hover:text-amber-300 transition-colors">
                    🇪🇸 {item.es}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeak(item.es);
                    }}
                    className={`p-1 rounded text-slate-400 hover:text-amber-400 ${speakingWord === item.es ? 'text-amber-400 animate-pulse' : ''}`}
                    title="Լսել"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-800/80">
                  {isRevealed ? (
                    <span className="text-xs font-medium text-emerald-400 animate-in fade-in duration-200 flex items-center gap-1">
                      🇦🇲 {item.hy}
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-500 italic">
                      Կտտացրեք թարգմանության համար 🇦🇲
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
