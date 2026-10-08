export interface QuestionOption {
  key: 'A' | 'B' | 'C' | 'D';
  textEs: string;
  textHy: string;
}

export interface GameOneQuestion {
  id: number;
  round: number;
  roundTitleEs: string;
  roundTitleHy: string;
  titleEs: string;
  titleHy: string;
  situationEs: string;
  situationHy: string;
  questionEs: string;
  questionHy: string;
  options: QuestionOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  verbInFocus?: string;
  explanationHy?: string;
}

export interface GameTwoQuestion {
  id: number;
  round: number;
  roundTitleEs: string;
  roundTitleHy: string;
  titleEs: string;
  titleHy: string;
  contextEs: string;
  contextHy: string;
  questionEs: string;
  questionHy: string;
  options: QuestionOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanationEs: string;
  explanationHy: string;
  formula?: string;
}

export interface CoachQuestion {
  id: number;
  situationEs: string;
  situationHy: string;
  questionEs: string;
  questionHy: string;
  sampleAnswerEs: string;
  sampleAnswerHy: string;
  keyVerbs: string[];
}

export interface MentalMathItem {
  id: number;
  operation: string;
  resultNum: number;
  spanishText: string;
  armenianText: string;
}

export interface FinalRoleTask {
  role: string;
  roleHy: string;
  icon: string;
  promptHy: string;
  sentenceEs: string;
  sentenceHy: string;
  verbUsed: string;
}
