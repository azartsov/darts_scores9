"use client"

import { useState, useEffect, useCallback } from "react"
import { GameSetup } from "@/components/game-setup"
import { GameBoard } from "@/components/game-board"
import { VictoryScreen } from "@/components/victory-screen"
import { LegTransition } from "@/components/leg-transition"
import type { GameState, Player, GameType, TurnHistory, DartInput, FinishMode, TotalLegs } from "@/lib/game-types"
import { saveGameState, loadGameState, clearGameState } from "@/lib/game-storage"

const initialGameState: GameState = {
  phase: "setup",
  gameType: 501,
  finishMode: "double",
  totalLegs: 1,
  currentLeg: 1,
  players: [],
  activePlayerIndex: 0,
  winner: null,
  legWinner: null,
  startTime: Date.now(),
}

export default function DartMasterPro() {
  const [gameState, setGameState] = useState<GameState>(initialGameState)
  const [undoStack, setUndoStack] = useState<GameState[]>([])

  // Load game state from session storage on mount
  useEffect(() => {
    const saved = loadGameState()
    if (saved) {
      if (!saved.finishMode) {
        saved.finishMode = "double"
      }
      if (!saved.totalLegs) {
        saved.totalLegs = 1
      }
      if (!saved.currentLeg) {
        saved.currentLeg = 1
      }
      if (!saved.startTime) {
        saved.startTime = Date.now()
      }
      // Ensure players have legsWon
      saved.players = saved.players.map(p => ({
        ...p,
        legsWon: p.legsWon ?? 0,
      }))
      setGameState(saved)
    }
  }, [])

  // Save game state whenever it changes
  useEffect(() => {
    if (gameState.phase !== "setup") {
      saveGameState(gameState)
    }
  }, [gameState])

  const handleStartGame = useCallback((players: Player[], gameType: GameType, finishMode: FinishMode, totalLegs: TotalLegs) => {
    const newState: GameState = {
      phase: "playing",
      gameType,
      finishMode,
      totalLegs,
      currentLeg: 1,
      players,
      activePlayerIndex: 0,
      winner: null,
      legWinner: null,
      startTime: Date.now(),
    }
    setGameState(newState)
    setUndoStack([])
  }, [])

  const handleSubmitTurn = useCallback((darts: [number, number, number], dartDetails: [DartInput, DartInput, DartInput]) => {
    setGameState((prev) => {
      setUndoStack((stack) => [...stack.slice(-9), prev])

      const activePlayer = prev.players[prev.activePlayerIndex]
      const totalScore = darts.reduce((sum, d) => sum + d, 0)
      const newScore = activePlayer.currentScore - totalScore

      const dartsActuallyThrown = dartDetails.filter(d => d.state !== "empty").length

      let isBust: boolean
      if (prev.finishMode === "simple") {
        isBust = newScore < 0
      } else {
        isBust = newScore < 0 || newScore === 1
      }

      let isWin = false
      if (newScore === 0) {
        if (prev.finishMode === "simple") {
          isWin = true
        } else {
          let lastScoringDartIndex = -1
          for (let i = dartDetails.length - 1; i >= 0; i--) {
            const dart = dartDetails[i]
            if (dart && dart.state === "scored" && dart.value !== null && dart.value > 0) {
              lastScoringDartIndex = i
              break
            }
          }
          
          if (lastScoringDartIndex >= 0) {
            const lastDart = dartDetails[lastScoringDartIndex]
            if (lastDart && lastDart.value !== null) {
              isWin = lastDart.multiplier === 2 || lastDart.value === 50
            }
          }
        }
      }

      const turnHistory: TurnHistory = {
        darts,
        dartDetails,
        total: totalScore,
        scoreAfter: isBust ? activePlayer.currentScore : newScore,
        wasBust: isBust,
        isWinningRound: isWin,
        dartsActuallyThrown,
        legNumber: prev.currentLeg,
      }

      const updatedPlayers = prev.players.map((player, index) => {
        if (index === prev.activePlayerIndex) {
          return {
            ...player,
            currentScore: isBust ? player.currentScore : newScore,
            history: [...player.history, turnHistory],
          }
        }
        return player
      })

      if (isWin) {
        const winningPlayer = updatedPlayers[prev.activePlayerIndex]
        const updatedWithLeg = updatedPlayers.map((player, index) => {
          if (index === prev.activePlayerIndex) {
            return { ...player, legsWon: player.legsWon + 1 }
          }
          return player
        })
        
        const legsToWin = Math.ceil(prev.totalLegs / 2)
        const playerLegsAfterWin = winningPlayer.legsWon + 1
        
        if (prev.totalLegs === 1 || playerLegsAfterWin >= legsToWin) {
          // Match is over
          return {
            ...prev,
            phase: "finished" as const,
            players: updatedWithLeg,
            winner: updatedWithLeg[prev.activePlayerIndex],
            legWinner: null,
          }
        }
        
        // Leg won, but match continues - show leg transition
        return {
          ...prev,
          phase: "legFinished" as const,
          players: updatedWithLeg,
          legWinner: updatedWithLeg[prev.activePlayerIndex],
        }
      }

      const nextPlayerIndex = (prev.activePlayerIndex + 1) % prev.players.length

      return {
        ...prev,
        players: updatedPlayers,
        activePlayerIndex: nextPlayerIndex,
      }
    })
  }, [])

  const handleNextLeg = useCallback(() => {
    setGameState((prev) => {
      const nextLeg = prev.currentLeg + 1
      
      // Reset player scores for new leg, keep history and legsWon
      const resetPlayers = prev.players.map((player) => ({
        ...player,
        currentScore: player.startingScore,
      }))

      return {
        ...prev,
        phase: "playing" as const,
        currentLeg: nextLeg,
        players: resetPlayers,
        activePlayerIndex: 0,
        legWinner: null,
      }
    })
    setUndoStack([])
  }, [])

  const handleUndo = useCallback(() => {
    const prevState = undoStack[undoStack.length - 1]
    if (prevState) {
      setGameState(prevState)
      setUndoStack((stack) => stack.slice(0, -1))
    }
  }, [undoStack])

  const handleNewGame = useCallback(() => {
    clearGameState()
    setGameState(initialGameState)
    setUndoStack([])
  }, [])

  const handleResetGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      phase: "playing" as const,
      currentLeg: 1,
      activePlayerIndex: 0,
      winner: null,
      legWinner: null,
      startTime: Date.now(),
      players: prev.players.map((player) => ({
        ...player,
        currentScore: player.startingScore,
        history: [],
        legsWon: 0,
      })),
    }))
    setUndoStack([])
  }, [])

  // Render based on game phase
  if (gameState.phase === "setup") {
    return <GameSetup onStartGame={handleStartGame} />
  }

  if (gameState.phase === "legFinished" && gameState.legWinner) {
    return (
      <LegTransition
        legWinner={gameState.legWinner}
        players={gameState.players}
        currentLeg={gameState.currentLeg}
        totalLegs={gameState.totalLegs}
        gameType={gameState.gameType}
        finishMode={gameState.finishMode}
        onNextLeg={handleNextLeg}
        onNewGame={handleNewGame}
      />
    )
  }

  if (gameState.phase === "finished" && gameState.winner) {
    return (
      <VictoryScreen 
        winner={gameState.winner} 
        players={gameState.players}
        gameType={gameState.gameType}
        finishMode={gameState.finishMode}
        totalLegs={gameState.totalLegs}
        currentLeg={gameState.currentLeg}
        onRematch={handleResetGame} 
        onNewGame={handleNewGame} 
      />
    )
  }

  return (
    <GameBoard
      players={gameState.players}
      activePlayerIndex={gameState.activePlayerIndex}
      gameType={gameState.gameType}
      finishMode={gameState.finishMode}
      totalLegs={gameState.totalLegs}
      currentLeg={gameState.currentLeg}
      onSubmitTurn={handleSubmitTurn}
      onUndo={handleUndo}
      onNewGame={handleNewGame}
      onResetGame={handleResetGame}
      canUndo={undoStack.length > 0}
    />
  )
}
