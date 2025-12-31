"use client"

import { useCallback } from "react"
import { cn } from "@/lib/utils"

interface InputSliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  unit?: string
  tooltip?: string
  ranges?: {
    min: number
    max: number
    color: string
    label: string
  }[]
}

export function InputSlider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  unit = "",
  tooltip = "",
  ranges = [],
}: InputSliderProps) {
  const getBackgroundColor = useCallback(() => {
    if (ranges.length === 0) return "from-blue-400 to-blue-600"

    for (const range of ranges) {
      if (value >= range.min && value <= range.max) {
        return range.color
      }
    }
    return "from-blue-400 to-blue-600"
  }, [value, ranges])

  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <label className="text-sm font-semibold text-foreground block">{label}</label>
          {tooltip && <p className="text-xs text-muted-foreground mt-1">{tooltip}</p>}
        </div>
        <div className="text-lg font-bold text-primary">
          {value.toFixed(step < 1 ? 1 : 0)} {unit}
        </div>
      </div>

      <div className="relative pt-2 px-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number.parseFloat(e.target.value))}
          className="w-full appearance-none cursor-pointer slider-enhanced"
          style={{
            background: `linear-gradient(to right, #2563eb 0%, #2563eb ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
          }}
        />
      </div>

      {ranges.length > 0 && (
        <div className="flex gap-2 text-xs">
          {ranges.map((range, idx) => (
            <div key={idx} className="flex items-center gap-1">
              <div className={cn("w-3 h-3 rounded-full", range.color)} />
              <span className="text-muted-foreground">{range.label}</span>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .slider-enhanced {
          height: 8px;
          border-radius: 8px;
          outline: none;
          -webkit-appearance: none;
          width: 100%;
        }

        .slider-enhanced::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
          border: 3px solid white;
          transition: all 0.2s ease;
        }

        .slider-enhanced::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.6);
        }

        .slider-enhanced::-moz-range-thumb {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
          border: 3px solid white;
          transition: all 0.2s ease;
        }

        .slider-enhanced::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.6);
        }

        .slider-enhanced::-moz-range-track {
          background: transparent;
          border: none;
        }

        .slider-enhanced::-moz-range-border {
          border: none;
        }
      `}</style>
    </div>
  )
}
