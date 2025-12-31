"use client"

import { DiabetesPredictorWizard } from "@/components/diabetes-predictor-wizard"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-50">
      <DiabetesPredictorWizard />
    </main>
  )
}
