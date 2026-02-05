"use client"

import type { Player, GameType, DartInput, FinishMode, TotalLegs } from "@/lib/game-types"
import { PlayerCard } from "./player-card"
import { ScoringInput } from "./scoring-input"
import { GameControls } from "./game-controls"
import { LanguageSwitcher } from "./language-switcher"
import { useI18n } from "@/lib/i18n/context"
import { Target, CircleDot, Circle } from "lucide-react"

interface GameBoardProps {
  players: Player[]
  activePlayerIndex: number
  gameType: GameType
  finishMode: FinishMode
  totalLegs: TotalLegs
  currentLeg: number
  onSubmitTurn: (darts: [number, number, number], dartDetails: [DartInput, DartInput, DartInput]) => void
  onUndo: () => void
  onNewGame: () => void
  onResetGame: () => void
  canUndo: boolean
}

export function GameBoard({
  players,
  activePlayerIndex,
  gameType,
  finishMode,
  totalLegs,
  currentLeg,
  onSubmitTurn,
  onUndo,
  onNewGame,
  onResetGame,
  canUndo,
}: GameBoardProps) {
  const { t, formatString } = useI18n()
  const activePlayer = players[activePlayerIndex]
  const isMultiLeg = totalLegs > 1

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Compact */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Target className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-bold text-foreground">{t.appTitle}</h1>
            <span className="ml-1 px-1.5 py-0.5 bg-primary/20 text-primary text-xs font-medium rounded">{gameType}</span>
            {/* Finish Mode Indicator */}
            <span className={`ml-0.5 px-1.5 py-0.5 text-[10px] font-medium rounded flex items-center gap-0.5 ${
              finishMode === "double" 
                ? "bg-amber-500/20 text-amber-500" 
                : "bg-secondary text-muted-foreground"
            }`}>
              {finishMode === "double" ? <CircleDot className="w-2.5 h-2.5" /> : <Circle className="w-2.5 h-2.5" />}
              {finishMode === "double" ? t.finishDouble : t.finishSimple}
            </span>
            {/* Leg Indicator */}
            {isMultiLeg && (
              <span className="ml-0.5 px-1.5 py-0.5 text-[10px] font-medium rounded bg-accent/20 text-accent">
                {formatString(t.legOf, { current: currentLeg, total: totalLegs })}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <GameControls onUndo={onUndo} onNewGame={onNewGame} onResetGame={onResetGame} canUndo={canUndo} finishMode={finishMode} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-3 py-3">
        <div className="grid lg:grid-cols-[1fr,340px] gap-3">
          {/* Players List */}
          <div className="space-y-2">
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.playersTitleSection}</h2>
            <div className="space-y-2">
              {players.map((player, index) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  isActive={index === activePlayerIndex}
                  position={index + 1}
                  finishMode={finishMode}
                  totalLegs={totalLegs}
                />
              ))}
            </div>
          </div>

          {/* Scoring Input */}
          <div className="lg:sticky lg:top-16 lg:self-start">
            <ScoringInput 
              playerName={activePlayer.name} 
              currentScore={activePlayer.currentScore} 
              finishMode={finishMode}
              onSubmitTurn={onSubmitTurn} 
            />
          </div>
        </div>
      </main>
    </div>
  )
}
