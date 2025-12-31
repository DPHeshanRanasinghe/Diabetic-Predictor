"use client"
import { InputSlider } from "@/components/input-slider"
import type { WizardFormData } from "@/components/diabetes-predictor-wizard"

interface PhysicalMeasurementsStepProps {
  formData: WizardFormData
  onUpdate: (updates: Partial<WizardFormData>) => void
}

export function PhysicalMeasurementsStep({ formData, onUpdate }: PhysicalMeasurementsStepProps) {
  return (
    <div className="space-y-6">
      {/* BMI */}
      <InputSlider
        label="Body Mass Index (BMI)"
        value={formData.bmi}
        min={15.1}
        max={38.4}
        step={0.1}
        unit="kg/m²"
        onChange={(value) => onUpdate({ bmi: value })}
        tooltip="Weight in kg divided by height in meters squared"
        ranges={[
          { min: 15.1, max: 18.5, color: "bg-blue-500", label: "Underweight" },
          { min: 18.5, max: 25, color: "bg-green-500", label: "Normal" },
          { min: 25, max: 30, color: "bg-yellow-500", label: "Overweight" },
          { min: 30, max: 38.4, color: "bg-red-500", label: "Obese" },
        ]}
      />

      {/* Waist-to-Hip Ratio */}
      <InputSlider
        label="Waist-to-Hip Ratio"
        value={formData.waist_to_hip_ratio}
        min={0.68}
        max={1.05}
        step={0.01}
        unit="ratio"
        onChange={(value) => onUpdate({ waist_to_hip_ratio: value })}
        tooltip="Waist circumference divided by hip circumference"
        ranges={[
          { min: 0.68, max: 0.8, color: "bg-green-500", label: "Low Risk" },
          { min: 0.8, max: 0.95, color: "bg-yellow-500", label: "Moderate" },
          { min: 0.95, max: 1.05, color: "bg-red-500", label: "High Risk" },
        ]}
      />

      {/* Systolic Blood Pressure */}
      <InputSlider
        label="Systolic Blood Pressure"
        value={formData.systolic_bp}
        min={91}
        max={163}
        unit="mmHg"
        onChange={(value) => onUpdate({ systolic_bp: value })}
        tooltip="Upper blood pressure reading"
        ranges={[
          { min: 91, max: 120, color: "bg-green-500", label: "Normal" },
          { min: 120, max: 130, color: "bg-yellow-500", label: "Elevated" },
          { min: 130, max: 163, color: "bg-red-500", label: "High" },
        ]}
      />

      {/* Diastolic Blood Pressure */}
      <InputSlider
        label="Diastolic Blood Pressure"
        value={formData.diastolic_bp}
        min={51}
        max={104}
        unit="mmHg"
        onChange={(value) => onUpdate({ diastolic_bp: value })}
        tooltip="Lower blood pressure reading"
        ranges={[
          { min: 51, max: 80, color: "bg-green-500", label: "Normal" },
          { min: 80, max: 90, color: "bg-yellow-500", label: "Elevated" },
          { min: 90, max: 104, color: "bg-red-500", label: "High" },
        ]}
      />

      {/* Heart Rate */}
      <InputSlider
        label="Resting Heart Rate"
        value={formData.heart_rate}
        min={42}
        max={101}
        unit="bpm"
        onChange={(value) => onUpdate({ heart_rate: value })}
        tooltip="Beats per minute at rest"
        ranges={[
          { min: 42, max: 60, color: "bg-green-500", label: "Healthy" },
          { min: 60, max: 80, color: "bg-yellow-500", label: "Normal" },
          { min: 80, max: 101, color: "bg-red-500", label: "Elevated" },
        ]}
      />

      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mt-6">
        <p className="text-sm text-slate-700">
          These physical measurements help assess cardiovascular health and metabolic risk factors.
        </p>
      </div>
    </div>
  )
}
