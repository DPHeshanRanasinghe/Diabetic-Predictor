// Extract and prepare features from form data for model prediction

import type { WizardFormData } from "@/components/diabetes-predictor-wizard"

export interface ExtractedFeatures {
  pregnancies: number
  glucose: number
  bloodPressure: number
  skinThickness: number
  insulin: number
  bmi: number
  diabetesPedigreeFunction: number
  age: number
  [key: string]: number | string
}

/**
 * Calculate Diabetes Pedigree Function (DPF) based on medical history
 */
function calculateDPF(formData: WizardFormData): number {
  let dpf = 0.5

  if (formData.familyHistory) {
    dpf += 0.3
  }

  if (formData.previousGestational) {
    dpf += 0.2
  }

  const age = Number.parseInt(formData.age) || 0
  if (age > 45) {
    dpf += 0.1
  }

  if (formData.stressLevel === "high" || formData.stressLevel === "very-high") {
    dpf += 0.1
  }

  if (Number.parseInt(formData.sleepHours) < 7) {
    dpf += 0.05
  }

  return Math.min(dpf, 2.42)
}

/**
 * Extract and validate features from form data
 * Maps 30 form input fields to model features
 */
export function extractFeatures(formData: WizardFormData): ExtractedFeatures | null {
  try {
    // Core 8 features
    const pregnancies = Number.parseFloat(formData.pregnancies) || 0
    const glucose = Number.parseFloat(formData.glucose) || 100
    const bloodPressure = Number.parseFloat(formData.bloodPressure) || 70
    const skinThickness = Number.parseFloat(formData.skinThickness) || 0
    const insulin = Number.parseFloat(formData.insulin) || 0
    const bmi = Number.parseFloat(formData.bmi) || 25
    const age = Number.parseFloat(formData.age) || 30
    const diabetesPedigreeFunction = calculateDPF(formData)

    // Validate core ranges
    if (pregnancies < 0 || pregnancies > 20) {
      throw new Error("Invalid pregnancies value")
    }
    if (glucose < 50 || glucose > 500) {
      throw new Error("Invalid glucose value")
    }
    if (age < 18 || age > 120) {
      throw new Error("Invalid age value")
    }
    if (bmi < 10 || bmi > 60) {
      throw new Error("Invalid BMI value")
    }

    // Additional 22 features from lifestyle, physical, lab, and medical sections
    const additionalFeatures: { [key: string]: number } = {
      // Lifestyle features
      alcohol: encodeCategorical(formData.alcohol || "none", ["none", "light", "moderate", "heavy"]),
      physicalActivity: encodeCategorical(formData.physicalActivity || "moderate", [
        "sedentary",
        "light",
        "moderate",
        "active",
        "very-active",
      ]),
      diet: encodeCategorical(formData.diet || "moderate", ["poor", "moderate", "good", "excellent"]),
      sleepHours: Number.parseFloat(formData.sleepHours) || 7,
      screenTime: Number.parseFloat(formData.screenTime) || 4,
      smoking: formData.smoking === "yes" ? 1 : 0,

      // Physical measurements
      waistHipRatio: Number.parseFloat(formData.waistHipRatio) || 0.9,
      heartRate: Number.parseFloat(formData.heartRate) || 70,
      systolicBP: Number.parseFloat(formData.systolicBP) || 120,

      // Lab results
      hdlCholesterol: Number.parseFloat(formData.hdlCholesterol) || 50,
      ldlCholesterol: Number.parseFloat(formData.ldlCholesterol) || 100,
      triglycerides: Number.parseFloat(formData.triglycerides) || 150,

      // Medical history features
      familyHistory: formData.familyHistory ? 1 : 0,
      hypertension: formData.hypertension ? 1 : 0,
      cardiovascularDisease: formData.cardiovascularDisease ? 1 : 0,
      previousGestational: formData.previousGestational ? 1 : 0,

      // Additional features for 30-feature model
      gender: formData.gender === "male" ? 1 : 0,
      ethnicity: encodeCategorical(formData.ethnicity || "other", [
        "asian",
        "caucasian",
        "african",
        "hispanic",
        "other",
      ]),
      education: encodeCategorical(formData.education || "high_school", [
        "elementary",
        "high_school",
        "associate",
        "bachelor",
        "graduate",
      ]),
      income: encodeCategorical(formData.income || "moderate", ["low", "moderate", "high", "very_high"]),
      employment: encodeCategorical(formData.employment || "employed", [
        "unemployed",
        "employed",
        "self_employed",
        "retired",
        "student",
      ]),
      stressLevel: encodeCategorical(formData.stressLevel || "moderate", ["low", "moderate", "high", "very-high"]),
    }

    return {
      pregnancies,
      glucose,
      bloodPressure,
      skinThickness,
      insulin,
      bmi,
      diabetesPedigreeFunction,
      age,
      ...additionalFeatures,
    }
  } catch (error) {
    console.error("[v0] Error extracting features:", error)
    return null
  }
}

/**
 * Encode categorical features to numeric values
 */
function encodeCategorical(value: string, categories: string[]): number {
  const index = categories.indexOf(value.toLowerCase())
  return index >= 0 ? index : 0
}

/**
 * Get feature array in the correct order for the 30-feature model
 */
export function getFeaturesArray(features: ExtractedFeatures): number[] {
  return [
    features.pregnancies as number,
    features.glucose as number,
    features.bloodPressure as number,
    features.skinThickness as number,
    features.insulin as number,
    features.bmi as number,
    features.diabetesPedigreeFunction as number,
    features.age as number,
    // Additional 22 features in order
    features.alcohol as number,
    features.physicalActivity as number,
    features.diet as number,
    features.sleepHours as number,
    features.screenTime as number,
    features.smoking as number,
    features.waistHipRatio as number,
    features.heartRate as number,
    features.systolicBP as number,
    features.hdlCholesterol as number,
    features.ldlCholesterol as number,
    features.triglycerides as number,
    features.familyHistory as number,
    features.hypertension as number,
    features.cardiovascularDisease as number,
    features.previousGestational as number,
    features.gender as number,
    features.ethnicity as number,
    features.education as number,
    features.income as number,
    features.employment as number,
    features.stressLevel as number,
  ]
}
