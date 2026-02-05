"use client"

import type { Player, FinishMode, GameType, TotalLegs } from "@/lib/game-types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useI18n } from "@/lib/i18n/context"
import { LanguageSwitcher } from "./language-switcher"
import { GameStatistics } from "./game-statistics"
import { Trophy, RotateCcw, Home } from "lucide-react"

interface VictoryScreenProps {
  winner: Player
  players: Player[]
  gameType: GameType
  finishMode: FinishMode
  totalLegs: TotalLegs
  currentLeg: number
  onRematch: () => void
  onNewGame: () => void
}

export function VictoryScreen({ winner, players, gameType, finishMode, totalLegs, currentLeg, onRematch, onNewGame }: VictoryScreenProps) {
  const { t, formatString } = useI18n()
  const isMultiLeg = totalLegs > 1

  const finishMessage = finishMode === "double" 
    ? formatString(t.finishedInTurnsDouble, { turns: winner.history.length })
    : formatString(t.finishedInTurnsSimple, { turns: winner.history.length })

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-3 relative">
      {/* Language Switcher */}
      <div className="absolute top-3 right-3 z-10">
        <LanguageSwitcher />
      </div>

      <Card className="w-full max-w-sm bg-card border-border text-center">
        <CardContent className="pt-6 pb-4 space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center animate-pulse">
              <Trophy className="w-8 h-8 text-accent-foreground" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              {isMultiLeg ? t.matchWinner : t.winner}
            </h1>
            <p className="text-lg text-primary font-medium">{winner.name}</p>
          </div>

          {isMultiLeg && (
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-sm text-muted-foreground">{t.legs}:</span>
              <span className="text-lg font-bold text-foreground">{winner.legsWon}/{totalLegs}</span>
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            {finishMessage}
          </p>

          {/* Legs progress */}
          {isMultiLeg && (
            <div className="flex items-center justify-center gap-3 py-2">
              {players.map((player) => (
                <div key={player.id} className="text-center">
                  <div className="text-xs text-muted-foreground truncate max-w-[80px]">{player.name}</div>
                  <div className={`text-lg font-bold ${
                    player.id === winner.id ? "text-primary" : "text-foreground/50"
                  }`}>
                    {player.legsWon}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Statistics Button */}
          <GameStatistics 
            players={players} 
            gameType={gameType} 
            finishMode={finishMode} 
            winner={winner}
            totalLegs={totalLegs}
            currentLeg={currentLeg}
          />

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button variant="secondary" className="h-10 bg-secondary text-secondary-foreground text-sm" onClick={onRematch}>
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              {t.rematch}
            </Button>
            <Button className="h-10 bg-primary text-primary-foreground text-sm" onClick={onNewGame}>
              <Home className="w-3.5 h-3.5 mr-1.5" />
              {t.newGame}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
