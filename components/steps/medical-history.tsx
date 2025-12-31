"use client"

import { Label } from "@/components/ui/label"
import type { WizardFormData } from "@/components/diabetes-predictor-wizard"

interface MedicalHistoryStepProps {
  formData: WizardFormData
  onUpdate: (updates: Partial<WizardFormData>) => void
}

export function MedicalHistoryStep({ formData, onUpdate }: MedicalHistoryStepProps) {
  const OptionButton = ({
    label,
    value,
    isSelected,
    onClick,
  }: {
    label: string
    value: number
    isSelected: boolean
    onClick: () => void
  }) => (
    <button
      onClick={onClick}
      className={`flex-1 py-3 px-4 rounded-lg font-semibold text-base transition-all duration-200 border-2 ${
        isSelected
          ? "bg-blue-600 text-white border-blue-600 shadow-lg scale-105"
          : "bg-white text-slate-700 border-slate-300 hover:border-blue-400 hover:bg-blue-50"
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <h3 className="font-semibold text-lg text-slate-800 mb-6">Medical History</h3>

        {/* Family History */}
        <div className="space-y-4 p-5 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-slate-200 hover:border-blue-300 transition-colors">
          <div>
            <Label className="text-base font-bold text-slate-900">Family History of Diabetes</Label>
            <p className="text-sm text-slate-600 mt-2">Parent, sibling, or grandparent with diabetes</p>
          </div>
          <div className="flex gap-3 pt-2">
            <OptionButton
              label="Yes"
              value={1}
              isSelected={formData.family_history_diabetes === 1}
              onClick={() => onUpdate({ family_history_diabetes: 1 })}
            />
            <OptionButton
              label="No"
              value={0}
              isSelected={formData.family_history_diabetes === 0}
              onClick={() => onUpdate({ family_history_diabetes: 0 })}
            />
          </div>
        </div>

        {/* Hypertension History */}
        <div className="space-y-4 p-5 rounded-xl bg-gradient-to-br from-slate-50 to-amber-50 border-2 border-slate-200 hover:border-amber-300 transition-colors">
          <div>
            <Label className="text-base font-bold text-slate-900">History of Hypertension</Label>
            <p className="text-sm text-slate-600 mt-2">High blood pressure diagnosis</p>
          </div>
          <div className="flex gap-3 pt-2">
            <OptionButton
              label="Yes"
              value={1}
              isSelected={formData.hypertension_history === 1}
              onClick={() => onUpdate({ hypertension_history: 1 })}
            />
            <OptionButton
              label="No"
              value={0}
              isSelected={formData.hypertension_history === 0}
              onClick={() => onUpdate({ hypertension_history: 0 })}
            />
          </div>
        </div>

        {/* Cardiovascular History */}
        <div className="space-y-4 p-5 rounded-xl bg-gradient-to-br from-slate-50 to-red-50 border-2 border-slate-200 hover:border-red-300 transition-colors">
          <div>
            <Label className="text-base font-bold text-slate-900">History of Cardiovascular Disease</Label>
            <p className="text-sm text-slate-600 mt-2">Heart disease, stroke, or related conditions</p>
          </div>
          <div className="flex gap-3 pt-2">
            <OptionButton
              label="Yes"
              value={1}
              isSelected={formData.cardiovascular_history === 1}
              onClick={() => onUpdate({ cardiovascular_history: 1 })}
            />
            <OptionButton
              label="No"
              value={0}
              isSelected={formData.cardiovascular_history === 0}
              onClick={() => onUpdate({ cardiovascular_history: 0 })}
            />
          </div>
        </div>
      </div>

      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mt-6">
        <p className="text-sm text-slate-700">
          Family history and previous conditions are important risk factors in diabetes development.
        </p>
      </div>
    </div>
  )
}
