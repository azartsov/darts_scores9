export type GameType = 301 | 501
export type FinishMode = "simple" | "double"
export type TotalLegs = 1 | 3 | 5 | 7 | 9

export interface Player {
  id: string
  name: string
  startingScore: number
  currentScore: number
  history: TurnHistory[]
  legsWon: number
}

export interface TurnHistory {
  darts: [number, number, number]
  dartDetails: [DartInput, DartInput, DartInput]
  total: number
  scoreAfter: number
  wasBust: boolean
  isWinningRound?: boolean
  dartsActuallyThrown: number
  legNumber: number
}

export type DartState = "empty" | "miss" | "scored"

export interface DartInput {
  value: number | null
  multiplier: 1 | 2 | 3
  state: DartState
}

export type GamePhase = "setup" | "playing" | "legFinished" | "finished"

export interface GameState {
  phase: GamePhase
  gameType: GameType
  finishMode: FinishMode
  totalLegs: TotalLegs
  currentLeg: number
  players: Player[]
  activePlayerIndex: number
  winner: Player | null
  legWinner: Player | null
  startTime: number
}

// Helper function to calculate simple finish suggestions
export function getSimpleFinishSuggestion(score: number): string | null {
  if (score > 170 || score < 1) return null
  
  if (score >= 1 && score <= 20) return `S${score}`
  if (score === 25) return "Bull"
  if (score === 50) return "Bullseye"
  
  for (let first = 20; first >= 1; first--) {
    const remaining = score - first
    if (remaining >= 1 && remaining <= 20) return `S${first} S${remaining}`
    if (remaining === 25) return `S${first} Bull`
    if (remaining === 50) return `S${first} Bullseye`
  }
  
  if (score > 25) {
    const afterBull = score - 25
    if (afterBull >= 1 && afterBull <= 20) return `Bull S${afterBull}`
    if (afterBull === 25) return "Bull Bull"
    if (afterBull === 50) return "Bull Bullseye"
  }
  
  if (score > 50) {
    const afterBullseye = score - 50
    if (afterBullseye >= 1 && afterBullseye <= 20) return `Bullseye S${afterBullseye}`
    if (afterBullseye === 25) return "Bullseye Bull"
    if (afterBullseye === 50) return "Bullseye Bullseye"
  }
  
  for (let d = 20; d >= 1; d--) {
    const remaining = score - (d * 2)
    if (remaining >= 1 && remaining <= 20) return `D${d} S${remaining}`
    if (remaining === 25) return `D${d} Bull`
    if (remaining === 50) return `D${d} Bullseye`
    if (remaining === 0) return `D${d}`
  }
  
  for (let t = 20; t >= 1; t--) {
    const remaining = score - (t * 3)
    if (remaining >= 1 && remaining <= 20) return `T${t} S${remaining}`
    if (remaining === 25) return `T${t} Bull`
    if (remaining === 50) return `T${t} Bullseye`
    if (remaining === 0) return `T${t}`
  }
  
  for (let first = 20; first >= 1; first--) {
    for (let second = 20; second >= 1; second--) {
      const remaining = score - first - second
      if (remaining >= 1 && remaining <= 20) return `S${first} S${second} S${remaining}`
      if (remaining === 25) return `S${first} S${second} Bull`
      if (remaining === 50) return `S${first} S${second} Bullseye`
    }
  }
  
  for (let t = 20; t >= 10; t--) {
    for (let s = 20; s >= 1; s--) {
      const remaining = score - (t * 3) - s
      if (remaining >= 1 && remaining <= 20) return `T${t} S${s} S${remaining}`
      if (remaining === 25) return `T${t} S${s} Bull`
      if (remaining === 0) return `T${t} S${s}`
    }
  }
  
  if (score >= 120) {
    const remaining1 = score - 60
    if (remaining1 >= 60) {
      const remaining2 = remaining1 - 60
      if (remaining2 >= 1 && remaining2 <= 20) return `T20 T20 S${remaining2}`
      if (remaining2 === 0) return "T20 T20"
      if (remaining2 <= 60 && remaining2 % 3 === 0) return `T20 T20 T${remaining2 / 3}`
    }
    for (let t2 = 20; t2 >= 1; t2--) {
      const remaining2 = remaining1 - (t2 * 3)
      if (remaining2 >= 1 && remaining2 <= 20) return `T20 T${t2} S${remaining2}`
      if (remaining2 === 25) return `T20 T${t2} Bull`
      if (remaining2 === 50) return `T20 T${t2} Bullseye`
      if (remaining2 === 0) return `T20 T${t2}`
    }
  }
  
  return null
}

export const SIMPLE_CHECKOUT_MAP: Record<number, string> = {
  1: "S1", 2: "S2", 3: "S3", 4: "S4", 5: "S5",
  6: "S6", 7: "S7", 8: "S8", 9: "S9", 10: "S10",
  11: "S11", 12: "S12", 13: "S13", 14: "S14", 15: "S15",
  16: "S16", 17: "S17", 18: "S18", 19: "S19", 20: "S20",
  25: "Bull", 50: "Bullseye",
  21: "S20 S1", 22: "S20 S2", 23: "S20 S3", 24: "S20 S4",
  26: "S20 S6", 27: "S20 S7", 28: "S20 S8", 29: "S20 S9", 30: "S20 S10",
  31: "S20 S11", 32: "S20 S12", 33: "S20 S13", 34: "S20 S14", 35: "S20 S15",
  36: "S20 S16", 37: "S20 S17", 38: "S20 S18", 39: "S20 S19", 40: "S20 S20",
  41: "S16 Bull", 42: "S17 Bull", 43: "S18 Bull", 44: "S19 Bull", 45: "S20 Bull",
  51: "S1 Bullseye", 52: "S2 Bullseye", 53: "S3 Bullseye", 54: "S4 Bullseye", 55: "S5 Bullseye",
  56: "S6 Bullseye", 57: "S7 Bullseye", 58: "S8 Bullseye", 59: "S9 Bullseye", 60: "S10 Bullseye",
  46: "S20 S18 S8", 47: "S20 S20 S7", 48: "S20 S20 S8", 49: "S20 S20 S9",
  61: "S20 S20 S20 S1", 
  70: "S20 Bullseye", 75: "Bull Bullseye",
  100: "Bullseye Bullseye",
  120: "T20 S20 S20 S20",
  140: "T20 T20 S20",
  150: "T20 T20 S30",
  160: "T20 T20 S20 S20",
  170: "T20 T20 Bull S25",
  180: "T20 T20 T20",
}

export const CHECKOUT_MAP: Record<number, string> = {
  170: "T20 T20 Bull",
  167: "T20 T19 Bull",
  164: "T20 T18 Bull",
  161: "T20 T17 Bull",
  160: "T20 T20 D20",
  158: "T20 T20 D19",
  157: "T20 T19 D20",
  156: "T20 T20 D18",
  155: "T20 T19 D19",
  154: "T20 T18 D20",
  153: "T20 T19 D18",
  152: "T20 T20 D16",
  151: "T20 T17 D20",
  150: "T20 T18 D18",
  149: "T20 T19 D16",
  148: "T20 T20 D14",
  147: "T20 T17 D18",
  146: "T20 T18 D16",
  145: "T20 T19 D14",
  144: "T20 T20 D12",
  143: "T20 T17 D16",
  142: "T20 T14 D20",
  141: "T20 T19 D12",
  140: "T20 T20 D10",
  139: "T20 T13 D20",
  138: "T20 T18 D12",
  137: "T20 T19 D10",
  136: "T20 T20 D8",
  135: "T20 T17 D12",
  134: "T20 T14 D16",
  133: "T20 T19 D8",
  132: "T20 T16 D12",
  131: "T20 T13 D16",
  130: "T20 T18 D8",
  129: "T19 T16 D12",
  128: "T18 T14 D16",
  127: "T20 T17 D8",
  126: "T19 T19 D6",
  125: "T20 T19 D4",
  124: "T20 T14 D11",
  123: "T19 T16 D9",
  122: "T18 T18 D7",
  121: "T20 T11 D14",
  120: "T20 S20 D20",
  119: "T19 T12 D13",
  118: "T20 S18 D20",
  117: "T20 S17 D20",
  116: "T20 S16 D20",
  115: "T20 S15 D20",
  114: "T20 S14 D20",
  113: "T20 S13 D20",
  112: "T20 T12 D8",
  111: "T20 S11 D20",
  110: "T20 S10 D20",
  109: "T20 S9 D20",
  108: "T20 S8 D20",
  107: "T19 S10 D20",
  106: "T20 S6 D20",
  105: "T20 S5 D20",
  104: "T18 S10 D20",
  103: "T19 S6 D20",
  102: "T20 S10 D16",
  101: "T17 S10 D20",
  100: "T20 D20",
  99: "T19 S10 D16",
  98: "T20 D19",
  97: "T19 D20",
  96: "T20 D18",
  95: "T19 D19",
  94: "T18 D20",
  93: "T19 D18",
  92: "T20 D16",
  91: "T17 D20",
  90: "T18 D18",
  89: "T19 D16",
  88: "T20 D14",
  87: "T17 D18",
  86: "T18 D16",
  85: "T19 D14",
  84: "T20 D12",
  83: "T17 D16",
  82: "T14 D20",
  81: "T19 D12",
  80: "T20 D10",
  79: "T13 D20",
  78: "T18 D12",
  77: "T19 D10",
  76: "T20 D8",
  75: "T17 D12",
  74: "T14 D16",
  73: "T19 D8",
  72: "T16 D12",
  71: "T13 D16",
  70: "T18 D8",
  69: "T19 D6",
  68: "T20 D4",
  67: "T17 D8",
  66: "T10 D18",
  65: "T19 D4",
  64: "T16 D8",
  63: "T13 D12",
  62: "T10 D16",
  61: "T15 D8",
  60: "S20 D20",
  59: "S19 D20",
  58: "S18 D20",
  57: "S17 D20",
  56: "S16 D20",
  55: "S15 D20",
  54: "S14 D20",
  53: "S13 D20",
  52: "S12 D20",
  51: "S11 D20",
  50: "S10 D20",
  49: "S9 D20",
  48: "S8 D20",
  47: "S7 D20",
  46: "S6 D20",
  45: "S5 D20",
  44: "S4 D20",
  43: "S3 D20",
  42: "S10 D16",
  41: "S9 D16",
  40: "D20",
  39: "S7 D16",
  38: "D19",
  37: "S5 D16",
  36: "D18",
  35: "S3 D16",
  34: "D17",
  33: "S1 D16",
  32: "D16",
  31: "S7 D12",
  30: "D15",
  29: "S5 D12",
  28: "D14",
  27: "S3 D12",
  26: "D13",
  25: "S1 D12",
  24: "D12",
  23: "S3 D10",
  22: "D11",
  21: "S5 D8",
  20: "D10",
  19: "S3 D8",
  18: "D9",
  17: "S1 D8",
  16: "D8",
  15: "S3 D6",
  14: "D7",
  13: "S1 D6",
  12: "D6",
  11: "S3 D4",
  10: "D5",
  9: "S1 D4",
  8: "D4",
  7: "S3 D2",
  6: "D3",
  5: "S1 D2",
  4: "D2",
  3: "S1 D1",
  2: "D1",
}
