"use client"

import { type Player, type FinishMode, type TotalLegs, CHECKOUT_MAP, getSimpleFinishSuggestion } from "@/lib/game-types"
import { useI18n } from "@/lib/i18n/context"
import { Card, CardContent } from "@/components/ui/card"
import { User, History } from "lucide-react"

interface PlayerCardProps {
  player: Player
  isActive: boolean
  position: number
  finishMode: FinishMode
  totalLegs: TotalLegs
}

export function PlayerCard({ player, isActive, position, finishMode, totalLegs }: PlayerCardProps) {
  const { t } = useI18n()
  const isMultiLeg = totalLegs > 1
  
  const getCheckout = (): string | null => {
    if (player.currentScore > 170 || player.currentScore < 1) return null
    if (finishMode === "simple") {
      return getSimpleFinishSuggestion(player.currentScore)
    }
    return CHECKOUT_MAP[player.currentScore] || null
  }
  
  const checkout = getCheckout()
  const lastTurn = player.history[player.history.length - 1]

  return (
    <Card
      className={`transition-all duration-300 ${
        isActive
          ? "ring-2 ring-primary bg-card border-primary shadow-md shadow-primary/10"
          : "bg-card/50 border-border opacity-75"
      }`}
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between gap-3">
          {/* Player Info */}
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
              }`}
            >
              {position}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="font-medium text-foreground truncate text-sm">{player.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {isActive && <span className="text-[10px] text-primary font-medium">{t.nowThrowing}</span>}
                {isMultiLeg && (
                  <span className="text-[10px] text-accent font-medium">
                    {t.legsWonLabel}: {player.legsWon}/{totalLegs}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Score Display */}
          <div className="text-right shrink-0">
            <div
              className={`text-3xl font-bold tabular-nums ${
                isActive ? "text-foreground" : "text-foreground/70"
              }`}
            >
              {player.currentScore}
            </div>
            {checkout && <div className="text-[10px] text-accent font-medium">{checkout}</div>}
          </div>
        </div>

        {/* Last Turn History */}
        {lastTurn && (
          <div
            className={`mt-2 pt-2 border-t border-border/50 flex items-center gap-1.5 text-xs ${
              lastTurn.wasBust ? "text-destructive" : "text-muted-foreground"
            }`}
          >
            <History className="w-3 h-3 shrink-0" />
            <span className="truncate">
              {lastTurn.darts.join(", ")} = {lastTurn.wasBust ? t.bust : `-${lastTurn.total}`}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
