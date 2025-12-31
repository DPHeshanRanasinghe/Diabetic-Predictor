// Main prediction engine for diabetes risk assessment
// Integrates model inference with result interpretation

import type { WizardFormData } from "@/components/diabetes-predictor-wizard"
import { extractFeatures, getFeaturesArray } from "./feature-extraction"
import { defaultScaler } from "./scaler"
import { getModel } from "./model-loader"

export interface PredictionResult {
  riskScore: number // 0-1 probability
  riskLevel: "Low" | "Moderate" | "High"
  explanation: string
  features: {
    name: string
    value: number | string
  }[]
  recommendations: string[]
}

/**
 * Predict diabetes risk from form data
 * Uses TensorFlow.js model for inference
 */
export async function predictDiabetesRisk(formData: WizardFormData): Promise<PredictionResult> {
  try {
    // Extract and validate features
    const features = extractFeatures(formData)
    if (!features) {
      throw new Error("Invalid form data")
    }

    // Get feature array in correct order
    const featuresArray = getFeaturesArray(features)

    // Normalize features using scaler
    const normalizedFeatures = defaultScaler.normalize(featuresArray)

    // Load model
    const model = await getModel()

    let riskScore = 0.5 // Default fallback

    if (model) {
      try {
        // Perform inference using TensorFlow.js
        const input = (window as any).tf?.tensor2d([normalizedFeatures])
        const prediction = model.predict(input)
        const result = await prediction.data()

        riskScore = result[0]

        // Cleanup
        input?.dispose()
        prediction?.dispose()

        console.log("[v0] Model prediction:", riskScore)
      } catch (modelError) {
        console.warn("[v0] Model inference failed, using fallback:", modelError)
        // Use fallback risk calculation if model fails
        riskScore = calculateFallbackRisk(formData, features)
      }
    } else {
      // Fallback if model couldn't be loaded
      console.warn("[v0] Model not available, using fallback risk calculation")
      riskScore = calculateFallbackRisk(formData, features)
    }

    // Ensure risk score is in valid range
    riskScore = Math.max(0, Math.min(1, riskScore))

    // Determine risk level
    const riskLevel = getRiskLevel(riskScore)

    // Generate explanation
    const explanation = generateExplanation(riskScore, riskLevel, formData, features)

    // Generate recommendations
    const recommendations = generateRecommendations(riskLevel, formData, features)

    // Format feature display
    const featureDisplay = formatFeatures(features, formData)

    return {
      riskScore,
      riskLevel,
      explanation,
      features: featureDisplay,
      recommendations,
    }
  } catch (error) {
    console.error("[v0] Prediction error:", error)
    throw new Error("Failed to generate prediction. Please check your inputs and try again.")
  }
}

/**
 * Fallback risk calculation when model is unavailable
 * Uses rule-based heuristics based on medical guidelines
 */
function calculateFallbackRisk(formData: WizardFormData, features: any): number {
  let riskScore = 0.2 // Base risk

  // Glucose is a strong predictor
  if (features.glucose > 125) {
    riskScore += 0.2
  }
  if (features.glucose > 140) {
    riskScore += 0.1
  }

  // BMI is a significant factor
  if (features.bmi > 25) {
    riskScore += 0.1
  }
  if (features.bmi > 30) {
    riskScore += 0.1
  }

  // Family history
  if (formData.familyHistory) {
    riskScore += 0.15
  }

  // Age factor
  if (features.age > 45) {
    riskScore += 0.1
  }

  // Physical inactivity
  if (formData.physicalActivity === "sedentary" || formData.physicalActivity === "light") {
    riskScore += 0.1
  }

  // Poor diet
  if (formData.diet === "poor") {
    riskScore += 0.1
  }

  // Previous gestational diabetes
  if (formData.previousGestational) {
    riskScore += 0.15
  }

  return Math.min(riskScore, 1)
}

/**
 * Determine risk level category based on score
 */
function getRiskLevel(riskScore: number): "Low" | "Moderate" | "High" {
  if (riskScore < 0.15) return "Low"
  if (riskScore < 0.5) return "Moderate"
  return "High"
}

/**
 * Generate detailed explanation based on risk factors
 */
function generateExplanation(riskScore: number, riskLevel: string, formData: WizardFormData, features: any): string {
  const riskPercentage = (riskScore * 100).toFixed(1)
  let explanation = `Based on the analysis of your health metrics and lifestyle factors, your assessed diabetes risk level is **${riskLevel}** with a calculated probability of ${riskPercentage}%.\n\n`

  // Identify key risk factors
  const riskFactors: string[] = []

  if (features.glucose > 125) {
    riskFactors.push(`Elevated fasting glucose (${features.glucose} mg/dL) is a significant risk factor`)
  }

  if (features.bmi > 30) {
    riskFactors.push(`Higher BMI (${features.bmi}) increases diabetes risk`)
  }

  if (formData.familyHistory) {
    riskFactors.push("Strong family history of diabetes significantly increases your risk")
  }

  if (formData.previousGestational) {
    riskFactors.push("Previous gestational diabetes increases risk of type 2 diabetes")
  }

  if (formData.physicalActivity === "sedentary") {
    riskFactors.push("Sedentary lifestyle is a major risk factor for diabetes")
  }

  if (formData.diet === "poor") {
    riskFactors.push("Diet high in processed foods and sugar increases diabetes risk")
  }

  if (features.age > 65) {
    riskFactors.push(`Age over 65 is associated with increased diabetes risk`)
  }

  if (riskFactors.length > 0) {
    explanation += "**Key Risk Factors Identified:**\n"
    riskFactors.forEach((factor) => {
      explanation += `• ${factor}\n`
    })
  }

  // Positive factors
  const positiveFactors: string[] = []

  if (features.bmi < 25) {
    positiveFactors.push("Healthy BMI is a positive factor")
  }

  if (formData.physicalActivity === "active" || formData.physicalActivity === "very-active") {
    positiveFactors.push("Regular physical activity reduces diabetes risk")
  }

  if (formData.diet === "good" || formData.diet === "excellent") {
    positiveFactors.push("Healthy diet supports diabetes prevention")
  }

  if (features.glucose < 100) {
    positiveFactors.push("Normal fasting glucose is a positive indicator")
  }

  if (positiveFactors.length > 0) {
    explanation += "\n**Positive Factors:**\n"
    positiveFactors.forEach((factor) => {
      explanation += `• ${factor}\n`
    })
  }

  return explanation
}

/**
 * Generate personalized recommendations based on risk profile
 */
function generateRecommendations(riskLevel: string, formData: WizardFormData, features: any): string[] {
  const recommendations: string[] = []

  // General recommendations for all risk levels
  recommendations.push("Schedule regular health checkups with your healthcare provider")
  recommendations.push("Monitor your blood glucose levels regularly")

  if (riskLevel === "Low") {
    recommendations.push("Continue your current healthy lifestyle habits")
    recommendations.push("Maintain regular physical activity (at least 150 minutes per week)")
    recommendations.push("Conduct annual diabetes screening")
  }

  if (riskLevel === "Moderate" || riskLevel === "High") {
    if (features.bmi > 25) {
      recommendations.push(`Work on achieving a healthy BMI (current: ${features.bmi})`)
      recommendations.push("Even 5-10% weight loss can significantly reduce diabetes risk")
    }

    if (features.glucose > 100) {
      recommendations.push("Focus on reducing refined carbohydrates and sugar intake")
      recommendations.push("Consider consulting a registered dietitian")
    }

    if (formData.physicalActivity === "sedentary" || formData.physicalActivity === "light") {
      recommendations.push("Increase physical activity gradually (start with 30 minutes daily)")
      recommendations.push("Incorporate both aerobic exercise and resistance training")
    }

    if (formData.sleepHours && Number.parseFloat(formData.sleepHours) < 7) {
      recommendations.push("Aim for 7-9 hours of quality sleep per night")
    }

    if (formData.stressLevel === "high" || formData.stressLevel === "very-high") {
      recommendations.push("Implement stress reduction techniques (meditation, yoga, etc.)")
    }
  }

  if (riskLevel === "High") {
    recommendations.push("Consult with an endocrinologist or diabetes specialist")
    recommendations.push("Consider joining a diabetes prevention program")
    recommendations.push("Get tested for diabetes (A1C test, oral glucose tolerance test)")
  }

  recommendations.push("Re-assess your diabetes risk annually or after significant lifestyle changes")

  return recommendations
}

/**
 * Format features for display in results
 */
function formatFeatures(features: any, formData: WizardFormData): Array<{ name: string; value: number | string }> {
  return [
    { name: "Age", value: `${features.age} years` },
    { name: "Gender", value: formData.gender },
    { name: "BMI", value: features.bmi.toFixed(1) },
    { name: "Fasting Glucose", value: `${features.glucose} mg/dL` },
    { name: "Blood Pressure (Diastolic)", value: `${features.bloodPressure} mmHg` },
    { name: "Insulin Level", value: `${features.insulin} mIU/L` },
    { name: "Physical Activity", value: formData.physicalActivity },
    { name: "Family History of Diabetes", value: formData.familyHistory ? "Yes" : "No" },
  ]
}
