"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StepIndicator } from "@/components/step-indicator"
import { PersonalInfoStep } from "@/components/steps/personal-info"
import { LifestyleStep } from "@/components/steps/lifestyle"
import { PhysicalMeasurementsStep } from "@/components/steps/physical-measurements"
import { LabResultsStep } from "@/components/steps/lab-results"
import { MedicalHistoryStep } from "@/components/steps/medical-history"
import { ReviewStep } from "@/components/steps/review"
import { ResultsStep } from "@/components/steps/results"
import { ChevronLeft, ChevronRight } from "lucide-react"

export type WizardFormData = {
  // Personal Information Section
  age: number
  gender: string
  ethnicity: string
  education_level: string
  income_level: string
  employment_status: string

  // Lifestyle Section
  alcohol_consumption_per_week: number
  physical_activity_minutes_per_week: number
  diet_score: number
  sleep_hours_per_day: number
  screen_time_hours_per_day: number
  smoking_status: string

  // Physical Measurements
  bmi: number
  waist_to_hip_ratio: number
  systolic_bp: number
  diastolic_bp: number
  heart_rate: number

  // Lab Results
  hdl_cholesterol: number
  ldl_cholesterol: number
  triglycerides: number

  // Medical History
  family_history_diabetes: number
  hypertension_history: number
  cardiovascular_history: number

  // Results
  riskScore?: number
  riskLevel?: string
  riskDescription?: string
}

const STEPS = [
  { title: "Personal Information", description: "Demographics and background" },
  { title: "Lifestyle Factors", description: "Daily habits and activities" },
  { title: "Physical Measurements", description: "Body metrics and vitals" },
  { title: "Lab Results", description: "Cholesterol and triglycerides" },
  { title: "Medical History", description: "Health background" },
]

export function DiabetesPredictorWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<WizardFormData>({
    age: 50,
    gender: "",
    ethnicity: "",
    education_level: "",
    income_level: "",
    employment_status: "",
    alcohol_consumption_per_week: 2,
    physical_activity_minutes_per_week: 80,
    diet_score: 6.0,
    sleep_hours_per_day: 7.0,
    screen_time_hours_per_day: 6.0,
    smoking_status: "",
    bmi: 25.9,
    waist_to_hip_ratio: 0.86,
    systolic_bp: 116,
    diastolic_bp: 75,
    heart_rate: 70,
    hdl_cholesterol: 54,
    ldl_cholesterol: 103,
    triglycerides: 123,
    family_history_diabetes: 0,
    hypertension_history: 0,
    cardiovascular_history: 0,
  })

  const updateFormData = (updates: Partial<WizardFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleReset = () => {
    setCurrentStep(0)
    setFormData({
      age: 50,
      gender: "",
      ethnicity: "",
      education_level: "",
      income_level: "",
      employment_status: "",
      alcohol_consumption_per_week: 2,
      physical_activity_minutes_per_week: 80,
      diet_score: 6.0,
      sleep_hours_per_day: 7.0,
      screen_time_hours_per_day: 6.0,
      smoking_status: "",
      bmi: 25.9,
      waist_to_hip_ratio: 0.86,
      systolic_bp: 116,
      diastolic_bp: 75,
      heart_rate: 70,
      hdl_cholesterol: 54,
      ldl_cholesterol: 103,
      triglycerides: 123,
      family_history_diabetes: 0,
      hypertension_history: 0,
      cardiovascular_history: 0,
    })
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoStep formData={formData} onUpdate={updateFormData} />
      case 1:
        return <LifestyleStep formData={formData} onUpdate={updateFormData} />
      case 2:
        return <PhysicalMeasurementsStep formData={formData} onUpdate={updateFormData} />
      case 3:
        return <LabResultsStep formData={formData} onUpdate={updateFormData} />
      case 4:
        return <MedicalHistoryStep formData={formData} onUpdate={updateFormData} />
      case 5:
        return <ReviewStep formData={formData} onUpdate={updateFormData} onComplete={handleNext} />
      case 6:
        return <ResultsStep formData={formData} />
      default:
        return null
    }
  }

  const isReviewStep = currentStep === 5
  const isResultsStep = currentStep === 6

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
            Diabetes Risk Assessment
          </h1>
          <p className="text-lg text-slate-600">AI-Powered Health Prediction Tool</p>
          <p className="text-sm text-slate-500 mt-2">
            Professional assessment using advanced machine learning analysis
          </p>
        </div>

        {currentStep < STEPS.length && <StepIndicator steps={STEPS} currentStep={currentStep} />}

        <Card className="shadow-xl border-slate-200 mt-8">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
            {!isResultsStep && (
              <>
                <CardTitle className="text-2xl text-blue-900">{STEPS[currentStep]?.title}</CardTitle>
                <CardDescription className="text-blue-700">{STEPS[currentStep]?.description}</CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="pt-8">
            {renderStepContent()}

            <div className="flex gap-4 justify-between mt-8">
              <Button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                variant="outline"
                className="flex items-center gap-2 bg-transparent"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <div className="text-sm text-slate-600 flex items-center">
                {!isResultsStep && `Step ${currentStep + 1} of ${STEPS.length}`}
              </div>

              {!isResultsStep && (
                <Button onClick={handleNext} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                  {isReviewStep ? "Calculate Risk" : "Next"}
                  {!isReviewStep && <ChevronRight className="w-4 h-4" />}
                </Button>
              )}

              {isResultsStep && (
                <Button onClick={handleReset} className="bg-blue-600 hover:bg-blue-700">
                  Start Over
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center text-sm text-slate-700">
          <p className="font-semibold text-blue-900 mb-1">Medical Disclaimer</p>
          <p>
            This tool is for informational purposes only and does not replace professional medical advice. Please
            consult with a healthcare professional for accurate diagnosis and treatment.
          </p>
        </div>
      </div>
    </div>
  )
}
