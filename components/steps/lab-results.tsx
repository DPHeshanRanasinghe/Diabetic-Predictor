"use client"

import { InputSlider } from "@/components/input-slider"
import type { WizardFormData } from "@/components/diabetes-predictor-wizard"

interface LabResultsStepProps {
  formData: WizardFormData
  onUpdate: (updates: Partial<WizardFormData>) => void
}

export function LabResultsStep({ formData, onUpdate }: LabResultsStepProps) {
  return (
    <div className="space-y-6">
      {/* HDL Cholesterol */}
      <InputSlider
        label="HDL Cholesterol (Good Cholesterol)"
        value={formData.hdl_cholesterol}
        min={21}
        max={90}
        unit="mg/dL"
        onChange={(value) => onUpdate({ hdl_cholesterol: value })}
        tooltip="Higher levels are better for heart health"
        ranges={[
          { min: 21, max: 40, color: "bg-red-500", label: "Low" },
          { min: 40, max: 60, color: "bg-yellow-500", label: "Borderline" },
          { min: 60, max: 90, color: "bg-green-500", label: "Optimal" },
        ]}
      />

      {/* LDL Cholesterol */}
      <InputSlider
        label="LDL Cholesterol (Bad Cholesterol)"
        value={formData.ldl_cholesterol}
        min={51}
        max={205}
        unit="mg/dL"
        onChange={(value) => onUpdate({ ldl_cholesterol: value })}
        tooltip="Lower levels reduce cardiovascular risk"
        ranges={[
          { min: 51, max: 100, color: "bg-green-500", label: "Optimal" },
          { min: 100, max: 130, color: "bg-yellow-500", label: "Borderline" },
          { min: 130, max: 205, color: "bg-red-500", label: "High" },
        ]}
      />

      {/* Triglycerides */}
      <InputSlider
        label="Triglycerides"
        value={formData.triglycerides}
        min={31}
        max={290}
        unit="mg/dL"
        onChange={(value) => onUpdate({ triglycerides: value })}
        tooltip="Type of fat in blood; lower levels are better"
        ranges={[
          { min: 31, max: 150, color: "bg-green-500", label: "Normal" },
          { min: 150, max: 200, color: "bg-yellow-500", label: "Borderline" },
          { min: 200, max: 290, color: "bg-red-500", label: "High" },
        ]}
      />

      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mt-6">
        <p className="text-sm text-slate-700">
          These lipid panel results are important indicators of cardiovascular and metabolic health.
        </p>
      </div>
    </div>
  )
}
