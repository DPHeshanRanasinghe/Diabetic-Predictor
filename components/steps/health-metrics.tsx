"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { WizardFormData } from "@/components/diabetes-predictor-wizard"

interface HealthMetricsStepProps {
  formData: WizardFormData
  onUpdate: (updates: Partial<WizardFormData>) => void
}

export function HealthMetricsStep({ formData, onUpdate }: HealthMetricsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="pregnancies">
          Number of Pregnancies <span className="text-xs text-muted-foreground">(0 if not applicable)</span>
        </Label>
        <Input
          id="pregnancies"
          type="number"
          min="0"
          max="20"
          value={formData.pregnancies}
          onChange={(e) => onUpdate({ pregnancies: e.target.value })}
          placeholder="0"
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="glucose">Fasting Glucose (mg/dL)</Label>
        <Input
          id="glucose"
          type="number"
          min="50"
          max="500"
          value={formData.glucose}
          onChange={(e) => onUpdate({ glucose: e.target.value })}
          placeholder="70-100 is normal"
          className="mt-2"
        />
        <p className="text-xs text-muted-foreground mt-1">Recent fasting blood test result</p>
      </div>

      <div>
        <Label htmlFor="bloodPressure">Blood Pressure (mmHg) - Diastolic</Label>
        <Input
          id="bloodPressure"
          type="number"
          min="0"
          max="200"
          value={formData.bloodPressure}
          onChange={(e) => onUpdate({ bloodPressure: e.target.value })}
          placeholder="e.g., 80"
          className="mt-2"
        />
        <p className="text-xs text-muted-foreground mt-1">Lower number (diastolic pressure)</p>
      </div>

      <div>
        <Label htmlFor="skinThickness">Triceps Skin Fold Thickness (mm)</Label>
        <Input
          id="skinThickness"
          type="number"
          min="0"
          max="100"
          value={formData.skinThickness}
          onChange={(e) => onUpdate({ skinThickness: e.target.value })}
          placeholder="0 if unavailable"
          className="mt-2"
        />
        <p className="text-xs text-muted-foreground mt-1">Medical measurement (0 if not available)</p>
      </div>

      <div>
        <Label htmlFor="insulin">Serum Insulin (mIU/L)</Label>
        <Input
          id="insulin"
          type="number"
          min="0"
          max="600"
          value={formData.insulin}
          onChange={(e) => onUpdate({ insulin: e.target.value })}
          placeholder="0 if unavailable"
          className="mt-2"
        />
        <p className="text-xs text-muted-foreground mt-1">Fasting insulin level (0 if not available)</p>
      </div>

      <div>
        <Label htmlFor="bmi">Body Mass Index (BMI)</Label>
        <Input
          id="bmi"
          type="number"
          step="0.1"
          min="10"
          max="60"
          value={formData.bmi}
          onChange={(e) => onUpdate({ bmi: e.target.value })}
          placeholder="18.5-24.9 is normal"
          className="mt-2"
        />
        <p className="text-xs text-muted-foreground mt-1">Weight (kg) / Height² (m²)</p>
      </div>

      <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
        <p className="text-sm text-foreground">
          Most recent medical test results will provide the most accurate assessment.
        </p>
      </div>
    </div>
  )
}
