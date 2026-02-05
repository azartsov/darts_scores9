export type Language = "en" | "ru"

export interface Translations {
  // App
  appTitle: string
  appSubtitle: string

  // Game Setup
  gameType: string
  finishMode: string
  finishSimple: string
  finishSimpleDesc: string
  finishDouble: string
  finishDoubleDesc: string
  numberOfLegs: string
  leg: string
  legs: string
  legsHint: string
  players: string
  playersCount: string
  addPlayer: string
  add: string
  playerPlaceholder: string
  startGame: string
  startMatch: string

  // Game Board
  playersTitleSection: string
  legOf: string
  firstTo: string

  // Player Card
  nowThrowing: string
  bust: string
  legsWonLabel: string

  // Scoring Input
  playerTurn: string
  projectedScore: string
  winningThrow: string
  bustScoreRevert: string
  finish: string
  dart: string
  total: string
  highValues: string
  lowValues: string
  bull: string
  bullseye: string
  miss: string
  single: string
  double: string
  triple: string
  clear: string
  submitTurn: string
  multiplierHint: string
  tapToSelect: string
  doubleTapMultiplier: string

  // Game Controls
  undo: string
  howToPlay: string
  resetScores: string
  newGame: string

  // Rules Dialog
  rulesTitle: string
  rulesSimpleSubtitle: string
  rulesDoubleSubtitle: string
  objective: string
  objectiveSimpleDesc: string
  objectiveDoubleDesc: string
  scoring: string
  scoringDesc: string
  bustRule: string
  bustSimpleDesc: string
  bustDoubleDesc: string
  checkout: string
  checkoutSimpleDesc: string
  checkoutDoubleDesc: string

  // Victory Screen
  winner: string
  matchWinner: string
  legWinner: string
  finishedInTurnsDouble: string
  finishedInTurnsSimple: string
  rematch: string
  viewStats: string
  nextLeg: string
  wonLegMessage: string

  // Statistics
  statistics: string
  position: string
  playerName: string
  remainingPoints: string
  avgPer3Darts: string
  dartsThrown: string
  rounds: string
  busts: string
  legsHeader: string
  shareStats: string
  copyStats: string
  close: string
  statsCopied: string
  avgCalculationHint: string
  bustIncludedHint: string

  // Dart Input Mode
  inputModeButtons: string
  inputModeDartboard: string
  switchInputMode: string
  dartboardMiss: string

  // Dart States
  dartEmpty: string
  dartMiss: string
  fillAllDarts: string

  // Language
  language: string
  english: string
  russian: string
}

export const translations: Record<Language, Translations> = {
  en: {
    // App
    appTitle: "Darts",
    appSubtitle: "Set up and play",

    // Game Setup
    gameType: "Mode",
    finishMode: "Finish",
    finishSimple: "Simple",
    finishSimpleDesc: "Any dart to zero wins",
    finishDouble: "Double",
    finishDoubleDesc: "Must end on a double",
    numberOfLegs: "Legs",
    leg: "Leg",
    legs: "Legs",
    legsHint: "First to {count} wins",
    players: "Players",
    playersCount: "Players ({count}/10)",
    addPlayer: "+Player",
    add: "+",
    playerPlaceholder: "Player {num}",
    startGame: "Start",
    startMatch: "Start Match",

    // Game Board
    playersTitleSection: "Players",
    legOf: "Leg {current}/{total}",
    firstTo: "First to {count}",

    // Player Card
    nowThrowing: "Throwing",
    bust: "BUST",
    legsWonLabel: "Legs",

    // Scoring Input
    playerTurn: "{player}",
    projectedScore: "Projected",
    winningThrow: "Win!",
    bustScoreRevert: "BUST!",
    finish: "Finish",
    dart: "Dart",
    total: "Total",
    highValues: "High",
    lowValues: "Low",
    bull: "Bull",
    bullseye: "Bullseye",
    miss: "Miss",
    single: "x1",
    double: "x2",
    triple: "x3",
    clear: "Clear",
    submitTurn: "Submit",
    multiplierHint: "2x tap = multiplier",
    tapToSelect: "Select",
    doubleTapMultiplier: "2x tap",

    // Game Controls
    undo: "Undo",
    howToPlay: "Help",
    resetScores: "Reset",
    newGame: "New",

    // Rules Dialog
    rulesTitle: "How to Play",
    rulesSimpleSubtitle: "Simple Mode - Any finish to zero",
    rulesDoubleSubtitle: "Double Mode - Must finish on a double",
    objective: "Objective",
    objectiveSimpleDesc:
      "Reduce your score from 301 or 501 to exactly zero. Any dart that brings your score to 0 wins.",
    objectiveDoubleDesc:
      "Reduce your score from 301 or 501 to exactly zero. The final dart must be a double or bullseye.",
    scoring: "Scoring",
    scoringDesc:
      "Each turn, throw 3 darts. Enter each dart value (1-20, 25 bull, 50 bullseye) with single, double, or triple multiplier.",
    bustRule: "Bust Rule",
    bustSimpleDesc:
      "If your score goes below 0, it's a bust. Your score reverts to what it was at the start of your turn.",
    bustDoubleDesc:
      "If your score goes below 2 or to exactly 1, it's a bust. Your score reverts to what it was at the start of your turn.",
    checkout: "Checkout",
    checkoutSimpleDesc:
      "When your score is 170 or less, suggestions appear showing ways to finish.",
    checkoutDoubleDesc:
      "When your score is 170 or less, suggestions appear to help you finish with a double.",

    // Victory Screen
    winner: "Winner!",
    matchWinner: "Match Winner!",
    legWinner: "Leg Won!",
    finishedInTurnsDouble: "Double out in {turns} turns",
    finishedInTurnsSimple: "Finished in {turns} turns",
    rematch: "Rematch",
    viewStats: "Stats",
    nextLeg: "Next Leg",
    wonLegMessage: "{player} wins Leg {leg}!",

    // Statistics
    statistics: "Statistics",
    position: "#",
    playerName: "Player",
    remainingPoints: "Rem.",
    avgPer3Darts: "Avg/3",
    dartsThrown: "Darts",
    rounds: "Rnds",
    busts: "Busts",
    legsHeader: "Legs",
    shareStats: "Share",
    copyStats: "Copy",
    close: "Close",
    statsCopied: "Copied!",
    avgCalculationHint: "Avg/3 = (Points / Darts) x 3",
    bustIncludedHint: "Bust rounds included (0 pts)",

    // Dart Input Mode
    inputModeButtons: "Buttons",
    inputModeDartboard: "Board",
    switchInputMode: "Switch input",
    dartboardMiss: "Miss",

    // Dart States
    dartEmpty: "-",
    dartMiss: "Miss",
    fillAllDarts: "Fill all darts",

    // Language
    language: "Language",
    english: "English",
    russian: "Russian",
  },
  ru: {
    // App
    appTitle: "Darts",
    appSubtitle: "Set up and play",

    // Game Setup
    gameType: "Mode",
    finishMode: "Finish",
    finishSimple: "Simple",
    finishSimpleDesc: "Any dart to zero wins",
    finishDouble: "Double",
    finishDoubleDesc: "Must end on a double",
    numberOfLegs: "Legs",
    leg: "Leg",
    legs: "Legs",
    legsHint: "First to {count} wins",
    players: "Players",
    playersCount: "Players ({count}/10)",
    addPlayer: "+Player",
    add: "+",
    playerPlaceholder: "Player {num}",
    startGame: "Start",
    startMatch: "Start Match",

    // Game Board
    playersTitleSection: "Players",
    legOf: "Leg {current}/{total}",
    firstTo: "First to {count}",

    // Player Card
    nowThrowing: "Throwing",
    bust: "BUST",
    legsWonLabel: "Legs",

    // Scoring Input
    playerTurn: "{player}",
    projectedScore: "Projected",
    winningThrow: "Win!",
    bustScoreRevert: "BUST!",
    finish: "Finish",
    dart: "Dart",
    total: "Total",
    highValues: "High",
    lowValues: "Low",
    bull: "Bull",
    bullseye: "Bullseye",
    miss: "Miss",
    single: "x1",
    double: "x2",
    triple: "x3",
    clear: "Clear",
    submitTurn: "Submit",
    multiplierHint: "2x tap = multiplier",
    tapToSelect: "Select",
    doubleTapMultiplier: "2x tap",

    // Game Controls
    undo: "Undo",
    howToPlay: "Help",
    resetScores: "Reset",
    newGame: "New",

    // Rules Dialog
    rulesTitle: "How to Play",
    rulesSimpleSubtitle: "Simple - Any finish to zero",
    rulesDoubleSubtitle: "Double - Must finish on a double",
    objective: "Objective",
    objectiveSimpleDesc:
      "Reduce your score from 301 or 501 to exactly zero. Any dart that brings your score to 0 wins.",
    objectiveDoubleDesc:
      "Reduce your score from 301 or 501 to exactly zero. The final dart must be a double or bullseye.",
    scoring: "Scoring",
    scoringDesc:
      "Each turn, throw 3 darts. Enter each dart value (1-20, 25 bull, 50 bullseye) with single, double, or triple multiplier.",
    bustRule: "Bust Rule",
    bustSimpleDesc:
      "If your score goes below 0, it's a bust. Your score reverts to what it was at the start of your turn.",
    bustDoubleDesc:
      "If your score goes below 2 or to exactly 1, it's a bust. Your score reverts to what it was at the start of your turn.",
    checkout: "Checkout",
    checkoutSimpleDesc:
      "When your score is 170 or less, suggestions appear showing ways to finish.",
    checkoutDoubleDesc:
      "When your score is 170 or less, suggestions appear to help you finish with a double.",

    // Victory Screen
    winner: "Winner!",
    matchWinner: "Match Winner!",
    legWinner: "Leg Won!",
    finishedInTurnsDouble: "Double out in {turns} turns",
    finishedInTurnsSimple: "Finished in {turns} turns",
    rematch: "Rematch",
    viewStats: "Stats",
    nextLeg: "Next Leg",
    wonLegMessage: "{player} wins Leg {leg}!",

    // Statistics
    statistics: "Statistics",
    position: "#",
    playerName: "Player",
    remainingPoints: "Rem.",
    avgPer3Darts: "Avg/3",
    dartsThrown: "Darts",
    rounds: "Rnds",
    busts: "Busts",
    legsHeader: "Legs",
    shareStats: "Share",
    copyStats: "Copy",
    close: "Close",
    statsCopied: "Copied!",
    avgCalculationHint: "Avg/3 = (Points / Darts) x 3",
    bustIncludedHint: "Bust rounds included (0 pts)",

    // Dart Input Mode
    inputModeButtons: "Кнопки",
    inputModeDartboard: "Мишень",
    switchInputMode: "Сменить ввод",
    dartboardMiss: "Мимо",

    // Dart States
    dartEmpty: "-",
    dartMiss: "Miss",
    fillAllDarts: "Fill all darts",

    // Language
    language: "Language",
    english: "English",
    russian: "Russian",
  },
}
