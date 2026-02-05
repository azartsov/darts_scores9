"use client"

import React from "react"

import { useRef, useState, useCallback, useMemo } from "react"
import { useI18n } from "@/lib/i18n/context"

interface InteractiveDartboardProps {
  onDartSelected: (value: number, multiplier: 1 | 2 | 3) => void
}

// Standard dartboard sector layout (clockwise from top)
const SECTORS = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5]

// Board geometry as fractions of outer radius
const ZONE = {
  BULLSEYE_R: 0.04,
  BULL_R: 0.10,
  INNER_SINGLE_END: 0.30,
  TRIPLE_START: 0.30,
  TRIPLE_END: 0.37,
  OUTER_SINGLE_END: 0.87,
  DOUBLE_START: 0.87,
  DOUBLE_END: 1.0,
}

const BOARD_SIZE = 360
const CENTER = BOARD_SIZE / 2
const R = 155 // outer radius in SVG units
const SECTOR_ANGLE = (2 * Math.PI) / 20

// Alternating color scheme matching real dartboard
// Even index = dark, Odd index = light
function sectorColors(idx: number): { single: string; ring: string } {
  // Standard dartboard: alternates between black/white for single, red/green for rings
  // For dark theme: using muted tones
  if (idx % 2 === 0) {
    return { single: "#1a1a1a", ring: "#c0392b" } // black area, red ring
  }
  return { single: "#f5f0e1", ring: "#1e8449" } // cream area, green ring
}

function sectorTextColor(idx: number): string {
  return idx % 2 === 0 ? "#f5f0e1" : "#1a1a1a"
}

// SVG arc path builder
function arcPath(
  cx: number, cy: number,
  r1: number, r2: number,
  a1: number, a2: number
): string {
  const x1i = cx + r1 * Math.cos(a1)
  const y1i = cy + r1 * Math.sin(a1)
  const x1o = cx + r2 * Math.cos(a1)
  const y1o = cy + r2 * Math.sin(a1)
  const x2o = cx + r2 * Math.cos(a2)
  const y2o = cy + r2 * Math.sin(a2)
  const x2i = cx + r1 * Math.cos(a2)
  const y2i = cy + r1 * Math.sin(a2)
  const lg = a2 - a1 > Math.PI ? 1 : 0
  return [
    `M ${x1i} ${y1i}`,
    `L ${x1o} ${y1o}`,
    `A ${r2} ${r2} 0 ${lg} 1 ${x2o} ${y2o}`,
    `L ${x2i} ${y2i}`,
    `A ${r1} ${r1} 0 ${lg} 0 ${x1i} ${y1i}`,
    "Z",
  ].join(" ")
}

interface HitInfo {
  value: number
  multiplier: 1 | 2 | 3
  label: string
  zone: string
}

export function InteractiveDartboard({ onDartSelected }: InteractiveDartboardProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hovered, setHovered] = useState<HitInfo | null>(null)
  const [flash, setFlash] = useState<{ x: number; y: number; label: string } | null>(null)
  const { t } = useI18n()

  // Calculate hit from mouse/touch coordinates
  const getHit = useCallback((clientX: number, clientY: number): HitInfo | null => {
    if (!svgRef.current) return null
    const rect = svgRef.current.getBoundingClientRect()
    const scale = BOARD_SIZE / rect.width
    const x = (clientX - rect.left) * scale - CENTER
    const y = (clientY - rect.top) * scale - CENTER
    const dist = Math.sqrt(x * x + y * y)
    const norm = dist / R

    if (norm > 1.08) return null // outside board

    // Bullseye
    if (norm <= ZONE.BULLSEYE_R) {
      return { value: 50, multiplier: 1, label: "Bull", zone: "bullseye" }
    }
    // Bull
    if (norm <= ZONE.BULL_R) {
      return { value: 25, multiplier: 1, label: "25", zone: "bull" }
    }

    // Determine sector
    let angle = Math.atan2(y, x)
    // Rotate so sector 20 is at top (SVG coords: top = -PI/2)
    angle = angle + Math.PI / 2
    if (angle < 0) angle += 2 * Math.PI
    // Offset by half a sector so sector boundaries align
    const adjusted = (angle + SECTOR_ANGLE / 2) % (2 * Math.PI)
    const idx = Math.floor(adjusted / SECTOR_ANGLE)
    const sector = SECTORS[idx]

    // Determine zone
    if (norm <= ZONE.TRIPLE_START) {
      return { value: sector, multiplier: 1, label: `${sector}`, zone: "innerSingle" }
    }
    if (norm <= ZONE.TRIPLE_END) {
      return { value: sector, multiplier: 3, label: `T${sector}`, zone: "triple" }
    }
    if (norm <= ZONE.DOUBLE_START) {
      return { value: sector, multiplier: 1, label: `${sector}`, zone: "outerSingle" }
    }
    if (norm <= ZONE.DOUBLE_END) {
      return { value: sector, multiplier: 2, label: `D${sector}`, zone: "double" }
    }

    return null
  }, [])

  const handlePointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    const hit = getHit(e.clientX, e.clientY)
    setHovered(hit)
  }, [getHit])

  const handlePointerLeave = useCallback(() => {
    setHovered(null)
  }, [])

  const handleClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const hit = getHit(e.clientX, e.clientY)
    if (!hit) return

    onDartSelected(hit.value, hit.multiplier)

    // Flash feedback
    const rect = svgRef.current?.getBoundingClientRect()
    if (rect) {
      const scale = BOARD_SIZE / rect.width
      const fx = (e.clientX - rect.left) * scale
      const fy = (e.clientY - rect.top) * scale
      const score = hit.value === 50 || hit.value === 25 ? hit.value : hit.value * hit.multiplier
      setFlash({ x: fx, y: fy, label: `${score}` })
      setTimeout(() => setFlash(null), 600)
    }
  }, [getHit, onDartSelected])

  // Memoize all sector SVG paths
  const sectors = useMemo(() => {
    const result: React.ReactNode[] = []

    for (let i = 0; i < 20; i++) {
      const a1 = -Math.PI / 2 + i * SECTOR_ANGLE - SECTOR_ANGLE / 2
      const a2 = a1 + SECTOR_ANGLE
      const col = sectorColors(i)
      const num = SECTORS[i]

      // Inner single (bull ring -> triple)
      result.push(
        <path
          key={`is-${i}`}
          d={arcPath(CENTER, CENTER, R * ZONE.BULL_R, R * ZONE.TRIPLE_START, a1, a2)}
          fill={col.single}
          stroke="#333"
          strokeWidth={0.5}
          className="dartboard-zone"
          data-zone="innerSingle"
          data-sector={num}
        />
      )

      // Triple ring
      result.push(
        <path
          key={`tr-${i}`}
          d={arcPath(CENTER, CENTER, R * ZONE.TRIPLE_START, R * ZONE.TRIPLE_END, a1, a2)}
          fill={col.ring}
          stroke="#333"
          strokeWidth={0.5}
          className="dartboard-zone dartboard-ring"
          data-zone="triple"
          data-sector={num}
        />
      )

      // Outer single (triple -> double)
      result.push(
        <path
          key={`os-${i}`}
          d={arcPath(CENTER, CENTER, R * ZONE.TRIPLE_END, R * ZONE.DOUBLE_START, a1, a2)}
          fill={col.single}
          stroke="#333"
          strokeWidth={0.5}
          className="dartboard-zone"
          data-zone="outerSingle"
          data-sector={num}
        />
      )

      // Double ring
      result.push(
        <path
          key={`db-${i}`}
          d={arcPath(CENTER, CENTER, R * ZONE.DOUBLE_START, R * ZONE.DOUBLE_END, a1, a2)}
          fill={col.ring}
          stroke="#333"
          strokeWidth={0.5}
          className="dartboard-zone dartboard-ring"
          data-zone="double"
          data-sector={num}
        />
      )
    }

    return result
  }, [])

  // Memoize number labels
  const numberLabels = useMemo(() => {
    return SECTORS.map((num, i) => {
      const angle = -Math.PI / 2 + i * SECTOR_ANGLE
      const labelR = R * 1.09
      const x = CENTER + labelR * Math.cos(angle)
      const y = CENTER + labelR * Math.sin(angle)
      return (
        <text
          key={`lbl-${num}`}
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="central"
          className="select-none pointer-events-none"
          fill="#e0e0e0"
          fontSize={13}
          fontWeight={700}
        >
          {num}
        </text>
      )
    })
  }, [])

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Hovered value indicator */}
      <div className="h-6 flex items-center justify-center">
        {hovered ? (
          <span className={`text-sm font-bold px-3 py-0.5 rounded-full ${
            hovered.zone === "triple"
              ? "bg-orange-500/30 text-orange-400"
              : hovered.zone === "double"
                ? "bg-sky-500/30 text-sky-400"
                : hovered.zone === "bullseye"
                  ? "bg-destructive/30 text-destructive"
                  : hovered.zone === "bull"
                    ? "bg-primary/30 text-primary"
                    : "bg-secondary text-secondary-foreground"
          }`}>
            {hovered.label}
            {hovered.zone === "triple" && " (x3)"}
            {hovered.zone === "double" && " (x2)"}
            {" = "}
            {hovered.value === 50 || hovered.value === 25
              ? hovered.value
              : hovered.value * hovered.multiplier}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">{t.tapToSelect}</span>
        )}
      </div>

      {/* SVG Dartboard */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${BOARD_SIZE} ${BOARD_SIZE}`}
        className="w-full max-w-[320px] aspect-square cursor-pointer touch-manipulation select-none"
        style={{ shapeRendering: "geometricPrecision" }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        role="img"
        aria-label="Interactive dartboard"
      >
        {/* Outer wire ring */}
        <circle cx={CENTER} cy={CENTER} r={R + 2} fill="#222" stroke="#555" strokeWidth={1} />

        {/* All sector paths */}
        {sectors}

        {/* Bull (25) */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={R * ZONE.BULL_R}
          fill="#1e8449"
          stroke="#333"
          strokeWidth={0.8}
          className="dartboard-zone"
          data-zone="bull"
        />

        {/* Bullseye (50) */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={R * ZONE.BULLSEYE_R}
          fill="#c0392b"
          stroke="#333"
          strokeWidth={0.8}
          className="dartboard-zone"
          data-zone="bullseye"
        />

        {/* Number labels outside the board */}
        {numberLabels}

        {/* Hover highlight overlay */}
        {hovered && (
          <circle
            cx={CENTER}
            cy={CENTER}
            r={R * 1.01}
            fill="none"
            stroke="none"
            pointerEvents="none"
          />
        )}

        {/* Click flash animation */}
        {flash && (
          <g>
            <circle
              cx={flash.x}
              cy={flash.y}
              r={8}
              fill="none"
              stroke="var(--primary)"
              strokeWidth={2}
              opacity={0.8}
            >
              <animate attributeName="r" from="4" to="20" dur="0.5s" fill="freeze" />
              <animate attributeName="opacity" from="0.9" to="0" dur="0.5s" fill="freeze" />
            </circle>
            <text
              x={flash.x}
              y={flash.y - 16}
              textAnchor="middle"
              dominantBaseline="central"
              fill="var(--primary)"
              fontSize={16}
              fontWeight={800}
              className="pointer-events-none"
            >
              <animate attributeName="y" from={flash.y - 10} to={flash.y - 30} dur="0.5s" fill="freeze" />
              <animate attributeName="opacity" from="1" to="0" dur="0.5s" fill="freeze" />
              {flash.label}
            </text>
          </g>
        )}
      </svg>

      {/* Miss button below dartboard */}
      <button
        type="button"
        onClick={() => onDartSelected(0, 1)}
        className="w-full max-w-[320px] h-9 rounded-lg bg-destructive/20 text-destructive text-sm font-medium hover:bg-destructive/30 transition-colors"
      >
        {t.dartboardMiss}
      </button>
    </div>
  )
}
