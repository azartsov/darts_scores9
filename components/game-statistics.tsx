"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useI18n } from "@/lib/i18n/context"
import type { Player, GameType, FinishMode, TotalLegs } from "@/lib/game-types"
import { BarChart3, Share2, Copy, Check, Info } from "lucide-react"

interface GameStatisticsProps {
  players: Player[]
  gameType: GameType
  finishMode: FinishMode
  winner: Player
  totalLegs: TotalLegs
  currentLeg: number
}

interface PlayerStats {
  player: Player
  totalDarts: number
  totalPointsScored: number
  avgPer3Darts: number
  totalRounds: number
  bustRounds: number
  position: number
}

export function GameStatistics({ players, gameType, finishMode, winner, totalLegs, currentLeg }: GameStatisticsProps) {
  const { t, language } = useI18n()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [canShare, setCanShare] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    const hasShareAPI = typeof navigator !== "undefined" && 
      "share" in navigator && 
      typeof navigator.share === "function"
    setCanShare(hasShareAPI)
    
    checkMobile()
    window.addEventListener("resize", checkMobile)
    
    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // Calculate statistics - bust rounds INCLUDED (0 points, but darts count)
  const calculateStats = (): PlayerStats[] => {
    const stats = players.map((player) => {
      let totalDarts = 0
      let totalPointsScored = 0
      let totalRounds = 0
      let bustRounds = 0
      
      player.history.forEach((turn) => {
        totalRounds++
        
        // Count darts for ALL rounds (including bust)
        const dartsInTurn = turn.dartsActuallyThrown ?? 3
        totalDarts += dartsInTurn
        
        if (turn.wasBust) {
          // Bust round: count darts but 0 points
          bustRounds++
          // totalPointsScored += 0 (implicit)
        } else {
          totalPointsScored += turn.total
        }
      })
      
      // Average per 3 darts: (points / darts) x 3
      const avgPer3Darts = totalDarts > 0 ? (totalPointsScored / totalDarts) * 3 : 0

      return {
        player,
        totalDarts,
        totalPointsScored,
        avgPer3Darts,
        totalRounds,
        bustRounds,
        position: 0,
      }
    })

    // Sort: by legs won (desc), then remaining points (asc), then average (desc)
    stats.sort((a, b) => {
      if (b.player.legsWon !== a.player.legsWon) return b.player.legsWon - a.player.legsWon
      if (a.player.currentScore !== b.player.currentScore) {
        return a.player.currentScore - b.player.currentScore
      }
      return b.avgPer3Darts - a.avgPer3Darts
    })
    
    stats.forEach((stat, index) => {
      stat.position = index + 1
    })

    return stats
  }

  const stats = calculateStats()
  const isMultiLeg = totalLegs > 1

  // Generate Telegram-optimized share text
  const generateShareText = (): string => {
    const modeText = finishMode === "double" ? "Double Out" : "Simple"
    const date = new Date().toLocaleDateString(language === "ru" ? "ru-RU" : "en-US", {
      day: "2-digit",
      month: "2-digit", 
      year: "numeric",
    })
    const time = new Date().toLocaleTimeString(language === "ru" ? "ru-RU" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })

    // Calculate max name length for alignment (cap at 10)
    const maxNameLen = Math.min(Math.max(...players.map(p => p.name.length), 6), 10)
    
    let text = ""
    text += "DART STATISTICS\n"
    text += "========================\n"
    
    if (isMultiLeg) {
      text += `Game: ${gameType} | Legs: ${totalLegs} | ${modeText}\n`
    } else {
      text += `Game: ${gameType} | ${modeText}\n`
    }
    text += `Date: ${date} ${time}\n\n`
    
    // Table header
    text += "```\n"
    if (isMultiLeg) {
      text += `${"#".padEnd(3)}${"Player".padEnd(maxNameLen + 1)}${"Legs".padStart(4)} ${"Avg3".padStart(5)} ${"Darts".padStart(5)}\n`
      text += `${"=".repeat(3 + maxNameLen + 1 + 4 + 1 + 5 + 1 + 5)}\n`
    } else {
      text += `${"#".padEnd(3)}${"Player".padEnd(maxNameLen + 1)}${"Rem".padStart(4)} ${"Avg3".padStart(5)} ${"Darts".padStart(5)}\n`
      text += `${"=".repeat(3 + maxNameLen + 1 + 4 + 1 + 5 + 1 + 5)}\n`
    }
    
    stats.forEach((stat) => {
      const name = stat.player.name.length > maxNameLen
        ? `${stat.player.name.substring(0, maxNameLen - 1)}.`
        : stat.player.name.padEnd(maxNameLen)
      
      const pos = `${stat.position}. `.padEnd(3)
      const avg = stat.avgPer3Darts.toFixed(1).padStart(5)
      const darts = String(stat.totalDarts).padStart(5)
      
      if (isMultiLeg) {
        const legs = `${stat.player.legsWon}/${totalLegs}`.padStart(4)
        text += `${pos}${name} ${legs} ${avg} ${darts}\n`
      } else {
        const rem = String(stat.player.currentScore).padStart(4)
        text += `${pos}${name} ${rem} ${avg} ${darts}\n`
      }
    })
    
    text += "```\n\n"
    text += `Winner: ${winner.name}\n`
    text += `Avg/3 = (Pts/Darts) x 3\n`
    text += `Busts included (0 pts)`
    
    return text
  }

  const handleShare = async () => {
    const statsText = generateShareText()

    if (canShare && "share" in navigator && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: `Darts ${gameType} Statistics`,
          text: statsText,
        })
        return
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(statsText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Silent fail
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="h-10 bg-secondary text-secondary-foreground text-sm">
          <BarChart3 className="w-4 h-4 mr-1.5" />
          {t.viewStats}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-foreground flex items-center gap-2 text-base">
            <BarChart3 className="w-4 h-4 text-primary" />
            {t.statistics}
          </DialogTitle>
        </DialogHeader>

        {/* Game Info */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3 flex-wrap">
          <span className="px-1.5 py-0.5 bg-primary/20 text-primary rounded text-[11px]">{gameType}</span>
          <span className="px-1.5 py-0.5 bg-secondary text-secondary-foreground rounded text-[11px]">
            {finishMode === "double" ? t.finishDouble : t.finishSimple}
          </span>
          {isMultiLeg && (
            <span className="px-1.5 py-0.5 bg-accent/20 text-accent rounded text-[11px]">
              {t.legs}: {totalLegs}
            </span>
          )}
          <span className="text-[11px]">{players.length} {t.players}</span>
        </div>

        {/* Statistics Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-1.5 px-1 text-muted-foreground font-medium">{t.position}</th>
                <th className="text-left py-1.5 px-1 text-muted-foreground font-medium">{t.playerName}</th>
                {isMultiLeg && (
                  <th className="text-right py-1.5 px-1 text-muted-foreground font-medium">{t.legsHeader}</th>
                )}
                <th className="text-right py-1.5 px-1 text-muted-foreground font-medium">{t.remainingPoints}</th>
                <th className="text-right py-1.5 px-1 text-muted-foreground font-medium">{t.avgPer3Darts}</th>
                <th className="text-right py-1.5 px-1 text-muted-foreground font-medium">{t.dartsThrown}</th>
                <th className="text-right py-1.5 px-1 text-muted-foreground font-medium">{t.rounds}</th>
                <th className="text-right py-1.5 px-1 text-muted-foreground font-medium">{t.busts}</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((stat) => (
                <tr 
                  key={stat.player.id} 
                  className={`border-b border-border/50 ${
                    stat.position === 1 ? "bg-primary/10" : ""
                  }`}
                >
                  <td className="py-1.5 px-1 text-foreground font-medium">{stat.position}</td>
                  <td className="py-1.5 px-1 text-foreground truncate max-w-[80px]">
                    {stat.player.name}
                    {stat.position === 1 && <span className="ml-0.5 text-primary">*</span>}
                  </td>
                  {isMultiLeg && (
                    <td className="py-1.5 px-1 text-right text-foreground font-medium">
                      {stat.player.legsWon}/{totalLegs}
                    </td>
                  )}
                  <td className="py-1.5 px-1 text-right text-foreground">{stat.player.currentScore}</td>
                  <td className="py-1.5 px-1 text-right text-foreground font-medium">{stat.avgPer3Darts.toFixed(1)}</td>
                  <td className="py-1.5 px-1 text-right text-foreground">{stat.totalDarts}</td>
                  <td className="py-1.5 px-1 text-right text-foreground">{stat.totalRounds}</td>
                  <td className="py-1.5 px-1 text-right text-muted-foreground">{stat.bustRounds}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Stats Notes */}
        <div className="mt-2 pt-2 border-t border-border/50 space-y-0.5">
          <div className="flex items-start gap-1 text-[10px] text-muted-foreground">
            <Info className="w-3 h-3 mt-0.5 shrink-0" />
            <span>{t.avgCalculationHint}</span>
          </div>
          <div className="flex items-start gap-1 text-[10px] text-muted-foreground">
            <Info className="w-3 h-3 mt-0.5 shrink-0" />
            <span>{t.bustIncludedHint}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          {isMobile && (
            <Button 
              variant="secondary" 
              className="flex-1 bg-secondary text-secondary-foreground h-9 text-sm"
              onClick={handleShare}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1.5 text-primary" />
                  {t.statsCopied}
                </>
              ) : (
                <>
                  {canShare ? <Share2 className="w-3.5 h-3.5 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
                  {t.shareStats}
                </>
              )}
            </Button>
          )}
          {!isMobile && (
            <Button 
              variant="secondary" 
              className="flex-1 bg-secondary text-secondary-foreground h-9 text-sm"
              onClick={handleShare}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1.5 text-primary" />
                  {t.statsCopied}
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  {t.copyStats}
                </>
              )}
            </Button>
          )}
          <Button 
            className="flex-1 bg-primary text-primary-foreground h-9 text-sm"
            onClick={() => setOpen(false)}
          >
            {t.close}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
