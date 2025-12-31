"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { WizardFormData } from "@/components/diabetes-predictor-wizard"
import { predictDiabetesRisk } from "@/lib/model-utils"
import { preprocessFeatures, type RawFormData } from "@/lib/preprocessing"
import { Loader2 } from "lucide-react"

interface ReviewStepProps {
  formData: WizardFormData
  onUpdate: (updates: Partial<WizardFormData>) => void
  onComplete?: () => void
}

export function ReviewStep({ formData, onUpdate, onComplete }: ReviewStepProps) {
  const [isCalculating, setIsCalculating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCalculate = async () => {
    setError(null)
    setIsCalculating(true)

    try {
      // Prepare raw data for preprocessing
      const rawData: RawFormData = {
        age: formData.age,
        alcohol_consumption_per_week: formData.alcohol_consumption_per_week,
        physical_activity_minutes_per_week: formData.physical_activity_minutes_per_week,
        diet_score: formData.diet_score,
        sleep_hours_per_day: formData.sleep_hours_per_day,
        screen_time_hours_per_day: formData.screen_time_hours_per_day,
        bmi: formData.bmi,
        waist_to_hip_ratio: formData.waist_to_hip_ratio,
        systolic_bp: formData.systolic_bp,
        diastolic_bp: formData.diastolic_bp,
        heart_rate: formData.heart_rate,
        hdl_cholesterol: formData.hdl_cholesterol,
        ldl_cholesterol: formData.ldl_cholesterol,
        triglycerides: formData.triglycerides,
        education_level: formData.education_level,
        income_level: formData.income_level,
        family_history_diabetes: formData.family_history_diabetes,
        hypertension_history: formData.hypertension_history,
        cardiovascular_history: formData.cardiovascular_history,
        gender: formData.gender,
        ethnicity: formData.ethnicity,
        smoking_status: formData.smoking_status,
        employment_status: formData.employment_status,
      }

      // Preprocess features
      const processedFeatures = preprocessFeatures(rawData, {
        mean: [50, 2, 80, 6, 7, 6, 25.9, 0.86, 116, 75, 70, 54, 103, 123],
        std: [15, 2, 40, 2, 1, 3, 5, 0.1, 20, 10, 15, 20, 40, 60],
      })

      // Get prediction
      const probability = await predictDiabetesRisk(processedFeatures)

      // Determine risk level
      let riskLevel = "Low"
      let riskDescription = ""
      if (probability < 0.4) {
        riskLevel = "Low"
        riskDescription =
          "Your diabetes risk is low. Continue maintaining your current healthy lifestyle habits. Regular check-ups are recommended."
      } else if (probability < 0.7) {
        riskLevel = "Moderate"
        riskDescription =
          "Your diabetes risk is moderate. Consider consulting with a healthcare provider and implementing lifestyle modifications to reduce risk."
      } else {
        riskLevel = "High"
        riskDescription =
          "Your diabetes risk is high. Please consult with a healthcare professional for proper evaluation and personalized treatment plan."
      }

      onUpdate({
        riskScore: probability,
        riskLevel: riskLevel,
        riskDescription: riskDescription,
      })
      
      // Navigate to results step after successful calculation
      if (onComplete) {
        setTimeout(() => {
          onComplete()
        }, 500) // Small delay for better UX
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred during calculation"
      setError(errorMessage)
      console.error("Prediction error:", err)
    } finally {
      setIsCalculating(false)
    }
  }

  const isFormComplete =
    formData.gender &&
    formData.ethnicity &&
    formData.education_level &&
    formData.income_level &&
    formData.employment_status &&
    formData.smoking_status

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {/* Personal Information */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-blue-900">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-600 text-xs font-semibold">AGE</span>
              <p className="font-semibold text-slate-900">{formData.age} years</p>
            </div>
            <div>
              <span className="text-slate-600 text-xs font-semibold">GENDER</span>
              <p className="font-semibold text-slate-900">{formData.gender || "—"}</p>
            </div>
            <div>
              <span className="text-slate-600 text-xs font-semibold">ETHNICITY</span>
              <p className="font-semibold text-slate-900">{formData.ethnicity || "—"}</p>
            </div>
            <div>
              <span className="text-slate-600 text-xs font-semibold">EDUCATION</span>
              <p className="font-semibold text-slate-900">{formData.education_level || "—"}</p>
            </div>
            <div>
              <span className="text-slate-600 text-xs font-semibold">INCOME</span>
              <p className="font-semibold text-slate-900">{formData.income_level || "—"}</p>
            </div>
            <div>
              <span className="text-slate-600 text-xs font-semibold">EMPLOYMENT</span>
              <p className="font-semibold text-slate-900">{formData.employment_status || "—"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Lifestyle */}
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-green-900">Lifestyle Factors</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-600 text-xs font-semibold">ALCOHOL</span>
              <p className="font-semibold text-slate-900">{formData.alcohol_consumption_per_week} drinks/wk</p>
            </div>
            <div>
              <span className="text-slate-600 text-xs font-semibold">EXERCISE</span>
              <p className="font-semibold text-slate-900">{formData.physical_activity_minutes_per_week} min/wk</p>
            </div>
            <div>
              <span className="text-slate-600 text-xs font-semibold">DIET SCORE</span>
              <p className="font-semibold text-slate-900">{formData.diet_score.toFixed(1)}</p>
            </div>
            <div>
              <span className="text-slate-600 text-xs font-semibold">SLEEP</span>
              <p className="font-semibold text-slate-900">{formData.sleep_hours_per_day.toFixed(1)} hrs</p>
            </div>
            <div>
              <span className="text-slate-600 text-xs font-semibold">SCREEN TIME</span>
              <p className="font-semibold text-slate-900">{formData.screen_time_hours_per_day.toFixed(1)} hrs</p>
            </div>
            <div>
              <span className="text-slate-600 text-xs font-semibold">SMOKING</span>
              <p className="font-semibold text-slate-900">{formData.smoking_status || "—"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Physical Measurements */}
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-orange-900">Physical Measurements</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-600 text-xs font-semibold">BMI</span>
              <p className="font-semibold text-slate-900">{formData.bmi.toFixed(1)}</p>
            </div>
            <div>
              <span className="text-slate-600 text-xs font-semibold">WAIST/HIP</span>
              <p className="font-semibold text-slate-900">{formData.waist_to_hip_ratio.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-slate-600 text-xs font-semibold">SYSTOLIC BP</span>
              <p className="font-semibold text-slate-900">{formData.systolic_bp} mmHg</p>
            </div>
            <div>
              <span className="text-slate-600 text-xs font-semibold">DIASTOLIC BP</span>
              <p className="font-semibold text-slate-900">{formData.diastolic_bp} mmHg</p>
            </div>
            <div className="col-span-2">
              <span className="text-slate-600 text-xs font-semibold">HEART RATE</span>
              <p className="font-semibold text-slate-900">{formData.heart_rate} bpm</p>
            </div>
          </CardContent>
        </Card>

        {/* Lab Results */}
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-red-900">Lab Results</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-600 text-xs font-semibold">HDL</span>
              <p className="font-semibold text-slate-900">{formData.hdl_cholesterol} mg/dL</p>
            </div>
            <div>
              <span className="text-slate-600 text-xs font-semibold">LDL</span>
              <p className="font-semibold text-slate-900">{formData.ldl_cholesterol} mg/dL</p>
            </div>
            <div className="col-span-2">
              <span className="text-slate-600 text-xs font-semibold">TRIGLYCERIDES</span>
              <p className="font-semibold text-slate-900">{formData.triglycerides} mg/dL</p>
            </div>
          </CardContent>
        </Card>

        {/* Medical History */}
        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-purple-900">Medical History</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Family History of Diabetes:</span>
              <span className="font-semibold text-slate-900">
                {formData.family_history_diabetes === 1 ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Hypertension History:</span>
              <span className="font-semibold text-slate-900">{formData.hypertension_history === 1 ? "Yes" : "No"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Cardiovascular History:</span>
              <span className="font-semibold text-slate-900">
                {formData.cardiovascular_history === 1 ? "Yes" : "No"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 font-medium">Error: {error}</p>
        </div>
      )}

      {!isFormComplete && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 font-medium">
            Please complete all required fields before calculating risk.
          </p>
        </div>
      )}

      <Button
        onClick={handleCalculate}
        disabled={!isFormComplete || isCalculating}
        size="lg"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-semibold"
      >
        {isCalculating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {isCalculating ? "Calculating Risk..." : "Calculate Diabetes Risk"}
      </Button>
    </div>
  )
}
