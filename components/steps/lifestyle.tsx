"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InputSlider } from "@/components/input-slider"
import type { WizardFormData } from "@/components/diabetes-predictor-wizard"

interface LifestyleStepProps {
  formData: WizardFormData
  onUpdate: (updates: Partial<WizardFormData>) => void
}

export function LifestyleStep({ formData, onUpdate }: LifestyleStepProps) {
  return (
    <div className="space-y-6">
      {/* Alcohol Consumption */}
      <InputSlider
        label="Alcohol Consumption"
        value={formData.alcohol_consumption_per_week}
        min={1}
        max={9}
        unit="drinks/week"
        onChange={(value) => onUpdate({ alcohol_consumption_per_week: value })}
        tooltip="Number of drinks per week (1 drink = 12oz beer, 5oz wine, 1.5oz spirit)"
        ranges={[
          { min: 1, max: 2, color: "bg-green-500", label: "Low" },
          { min: 2, max: 5, color: "bg-yellow-500", label: "Moderate" },
          { min: 5, max: 9, color: "bg-red-500", label: "High" },
        ]}
      />

      {/* Physical Activity */}
      <InputSlider
        label="Physical Activity"
        value={formData.physical_activity_minutes_per_week}
        min={1}
        max={304}
        unit="minutes/week"
        onChange={(value) => onUpdate({ physical_activity_minutes_per_week: value })}
        tooltip="Total minutes of moderate to vigorous exercise per week"
        ranges={[
          { min: 1, max: 75, color: "bg-red-500", label: "Insufficient" },
          { min: 75, max: 150, color: "bg-yellow-500", label: "Adequate" },
          { min: 150, max: 304, color: "bg-green-500", label: "Excellent" },
        ]}
      />

      {/* Diet Score */}
      <InputSlider
        label="Diet Quality Score"
        value={formData.diet_score}
        min={0.1}
        max={9.9}
        step={0.1}
        unit="score"
        onChange={(value) => onUpdate({ diet_score: value })}
        tooltip="Overall diet quality (0.1 = poor, 9.9 = excellent)"
        ranges={[
          { min: 0.1, max: 3, color: "bg-red-500", label: "Poor" },
          { min: 3, max: 6, color: "bg-yellow-500", label: "Fair" },
          { min: 6, max: 9.9, color: "bg-green-500", label: "Good" },
        ]}
      />

      {/* Sleep Hours */}
      <InputSlider
        label="Sleep Hours Per Day"
        value={formData.sleep_hours_per_day}
        min={3.1}
        max={9.9}
        step={0.1}
        unit="hours"
        onChange={(value) => onUpdate({ sleep_hours_per_day: value })}
        tooltip="Average hours of sleep per night (7-9 hours recommended)"
        ranges={[
          { min: 3.1, max: 6, color: "bg-red-500", label: "Insufficient" },
          { min: 6, max: 7, color: "bg-yellow-500", label: "Low" },
          { min: 7, max: 9, color: "bg-green-500", label: "Optimal" },
          { min: 9, max: 9.9, color: "bg-yellow-500", label: "Excess" },
        ]}
      />

      {/* Screen Time */}
      <InputSlider
        label="Screen Time Per Day"
        value={formData.screen_time_hours_per_day}
        min={0.6}
        max={16.5}
        step={0.1}
        unit="hours"
        onChange={(value) => onUpdate({ screen_time_hours_per_day: value })}
        tooltip="Daily hours spent on screens (phone, computer, TV)"
        ranges={[
          { min: 0.6, max: 3, color: "bg-green-500", label: "Low" },
          { min: 3, max: 8, color: "bg-yellow-500", label: "Moderate" },
          { min: 8, max: 16.5, color: "bg-red-500", label: "High" },
        ]}
      />

      {/* Smoking Status */}
      <div>
        <Label htmlFor="smoking" className="text-base font-semibold mb-2 block">
          Smoking Status
        </Label>
        <Select value={formData.smoking_status} onValueChange={(value) => onUpdate({ smoking_status: value })}>
          <SelectTrigger id="smoking" className="h-10">
            <SelectValue placeholder="Select your smoking status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Never">Never smoked</SelectItem>
            <SelectItem value="Former">Former smoker</SelectItem>
            <SelectItem value="Current">Current smoker</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mt-6">
        <p className="text-sm text-slate-700">
          Lifestyle factors significantly impact diabetes risk and can be modified through behavior change.
        </p>
      </div>
    </div>
  )
}
