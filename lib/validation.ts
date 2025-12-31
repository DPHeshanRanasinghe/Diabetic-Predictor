import type { WizardFormData } from "@/components/diabetes-predictor-wizard"

export function checkFormCompleteness(formData: WizardFormData): boolean {
  // Check all required fields from specification
  const isComplete =
    // Personal Information Section
    formData.age > 0 &&
    formData.gender !== "" &&
    formData.ethnicity !== "" &&
    formData.education_level !== "" &&
    formData.income_level !== "" &&
    formData.employment_status !== "" &&
    // Lifestyle Section
    formData.alcohol_consumption_per_week > 0 &&
    formData.physical_activity_minutes_per_week > 0 &&
    formData.diet_score > 0 &&
    formData.sleep_hours_per_day > 0 &&
    formData.screen_time_hours_per_day > 0 &&
    formData.smoking_status !== "" &&
    // Physical Measurements
    formData.bmi > 0 &&
    formData.waist_to_hip_ratio > 0 &&
    formData.systolic_bp > 0 &&
    formData.diastolic_bp > 0 &&
    formData.heart_rate > 0 &&
    // Lab Results
    formData.hdl_cholesterol > 0 &&
    formData.ldl_cholesterol > 0 &&
    formData.triglycerides > 0
  // Medical History (binary values, always valid)

  return isComplete
}

export function validateNumericRange(value: number, min: number, max: number): boolean {
  return !isNaN(value) && value >= min && value <= max
}

export function validateAge(age: number): boolean {
  return validateNumericRange(age, 19, 89)
}

export function validateBMI(bmi: number): boolean {
  return validateNumericRange(bmi, 15.1, 38.4)
}

export function validatePhysicalActivity(minutes: number): boolean {
  return validateNumericRange(minutes, 1, 304)
}

export function validateAlcohol(drinks: number): boolean {
  return validateNumericRange(drinks, 1, 9)
}

export function validateDietScore(score: number): boolean {
  return validateNumericRange(score, 0.1, 9.9)
}

export function validateSleep(hours: number): boolean {
  return validateNumericRange(hours, 3.1, 9.9)
}

export function validateScreenTime(hours: number): boolean {
  return validateNumericRange(hours, 0.6, 16.5)
}

export function validateWaistHipRatio(ratio: number): boolean {
  return validateNumericRange(ratio, 0.68, 1.05)
}

export function validateBloodPressure(systolic: number, diastolic: number): boolean {
  return validateNumericRange(systolic, 91, 163) && validateNumericRange(diastolic, 51, 104)
}

export function validateHeartRate(rate: number): boolean {
  return validateNumericRange(rate, 42, 101)
}

export function validateCholesterol(hdl: number, ldl: number, triglycerides: number): boolean {
  return (
    validateNumericRange(hdl, 21, 90) &&
    validateNumericRange(ldl, 51, 205) &&
    validateNumericRange(triglycerides, 31, 290)
  )
}
