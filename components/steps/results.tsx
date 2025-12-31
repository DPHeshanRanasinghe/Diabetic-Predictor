"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { WizardFormData } from "@/components/diabetes-predictor-wizard"
import { AlertCircle, CheckCircle, TrendingUp } from "lucide-react"

interface ResultsStepProps {
  formData: WizardFormData
}

export function ResultsStep({ formData }: ResultsStepProps) {
  const riskLevel = formData.riskLevel || "Unknown"
  const riskScore = formData.riskScore || 0
  const riskDescription = formData.riskDescription || ""

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "low":
        return {
          bgCard: "bg-gradient-to-br from-green-50 to-emerald-50",
          border: "border-green-300",
          icon: CheckCircle,
          iconColor: "text-green-600",
          badgeBg: "bg-green-100",
          badgeText: "text-green-900",
        }
      case "moderate":
        return {
          bgCard: "bg-gradient-to-br from-orange-50 to-amber-50",
          border: "border-orange-300",
          icon: AlertCircle,
          iconColor: "text-orange-600",
          badgeBg: "bg-orange-100",
          badgeText: "text-orange-900",
        }
      case "high":
        return {
          bgCard: "bg-gradient-to-br from-red-50 to-rose-50",
          border: "border-red-300",
          icon: TrendingUp,
          iconColor: "text-red-600",
          badgeBg: "bg-red-100",
          badgeText: "text-red-900",
        }
      default:
        return {
          bgCard: "bg-gradient-to-br from-slate-50 to-slate-100",
          border: "border-slate-300",
          icon: AlertCircle,
          iconColor: "text-slate-600",
          badgeBg: "bg-slate-100",
          badgeText: "text-slate-900",
        }
    }
  }

  const colors = getRiskColor(riskLevel)
  const IconComponent = colors.icon
  const riskPercentage = (riskScore * 100).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Main Results Card */}
      <Card className={`border-2 ${colors.border} ${colors.bgCard} overflow-hidden`}>
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            <div className={`${colors.iconColor} flex-shrink-0`}>
              <IconComponent className="w-16 h-16" />
            </div>
            <div className="flex-1">
              <p className="text-slate-600 text-sm font-semibold mb-2">DIABETES RISK ASSESSMENT</p>
              <div className="mb-4">
                <span
                  className={`inline-block ${colors.badgeBg} ${colors.badgeText} px-4 py-2 rounded-full font-bold text-lg`}
                >
                  {riskLevel}
                </span>
              </div>
              <p className="text-4xl font-bold text-slate-900 mb-2">{riskPercentage}%</p>
              <p className="text-slate-600">Risk Probability</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assessment Details */}
      <Card className="border-blue-200">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-lg text-blue-900">Assessment Results</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-slate-700 leading-relaxed text-base">{riskDescription}</p>
        </CardContent>
      </Card>

      {/* Risk Level Guide */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base">Risk Level Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900">Low Risk (&lt;40%)</p>
              <p className="text-sm text-slate-600">Continue current healthy habits and regular check-ups</p>
            </div>
          </div>

          <div className="flex gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900">Moderate Risk (40-70%)</p>
              <p className="text-sm text-slate-600">Consult healthcare provider and implement lifestyle changes</p>
            </div>
          </div>

          <div className="flex gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
            <TrendingUp className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900">High Risk (&gt;70%)</p>
              <p className="text-sm text-slate-600">Consult healthcare professional immediately for evaluation</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base">Recommended Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <p className="font-semibold text-slate-900">Schedule Doctor Appointment</p>
              <p className="text-sm text-slate-600">
                Share these results with your healthcare provider for professional evaluation
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <p className="font-semibold text-slate-900">Lifestyle Modifications</p>
              <p className="text-sm text-slate-600">
                Adjust diet, increase physical activity, improve sleep, and manage stress
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <p className="font-semibold text-slate-900">Regular Monitoring</p>
              <p className="text-sm text-slate-600">
                Schedule periodic health checkups and repeat this assessment annually
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-900 font-semibold mb-2">Medical Disclaimer</p>
        <p className="text-sm text-red-800">
          This assessment is for informational purposes only and does not replace professional medical diagnosis. Always
          consult with a qualified healthcare provider for medical advice, diagnosis, or treatment.
        </p>
      </div>
    </div>
  )
}