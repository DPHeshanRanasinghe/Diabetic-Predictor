export type ScalerParams = {
  mean: number[]
  std: number[]
}

// Default scaler parameters - replace with your training data values
export const DEFAULT_SCALER: ScalerParams = {
  mean: [50.0, 2.0, 80.0, 6.0, 7.0, 6.0, 25.9, 0.86, 116.0, 75.0, 70.0, 54.0, 103.0, 123.0],
  std: [15.0, 2.0, 40.0, 2.0, 1.0, 3.0, 5.0, 0.1, 20.0, 10.0, 15.0, 20.0, 40.0, 60.0],
}

// Numerical feature names for scaling
const NUMERICAL_FEATURES = [
  "age",
  "alcohol_consumption_per_week",
  "physical_activity_minutes_per_week",
  "diet_score",
  "sleep_hours_per_day",
  "screen_time_hours_per_day",
  "bmi",
  "waist_to_hip_ratio",
  "systolic_bp",
  "diastolic_bp",
  "heart_rate",
  "hdl_cholesterol",
  "ldl_cholesterol",
  "triglycerides",
]

// Label encoding mappings
const INCOME_MAPPING: Record<string, number> = {
  Low: 0,
  "Lower-Middle": 1,
  Middle: 2,
  "Upper-Middle": 3,
  High: 4,
}

const EDUCATION_MAPPING: Record<string, number> = {
  "No formal": 0,
  Highschool: 1,
  Graduate: 2,
  Postgraduate: 3,
}

// One-hot encoding mappings
const GENDER_CATEGORIES = ["Female", "Male", "Other"]
const ETHNICITY_CATEGORIES = ["Asian", "Black", "Hispanic", "Other", "White"]
const SMOKING_CATEGORIES = ["Current", "Former", "Never"]
const EMPLOYMENT_CATEGORIES = ["Employed", "Retired", "Student", "Unemployed"]

export type RawFormData = {
  age: number
  alcohol_consumption_per_week: number
  physical_activity_minutes_per_week: number
  diet_score: number
  sleep_hours_per_day: number
  screen_time_hours_per_day: number
  bmi: number
  waist_to_hip_ratio: number
  systolic_bp: number
  diastolic_bp: number
  heart_rate: number
  hdl_cholesterol: number
  ldl_cholesterol: number
  triglycerides: number
  education_level: string
  income_level: string
  family_history_diabetes: number
  hypertension_history: number
  cardiovascular_history: number
  gender: string
  ethnicity: string
  smoking_status: string
  employment_status: string
}

export function capPhysicalActivity(value: number): number {
  return Math.min(value, 304)
}

export function labelEncode(value: string, mapping: Record<string, number>): number {
  return mapping[value] || 0
}

export function oneHotEncode(value: string, categories: string[], dropFirst = true): number[] {
  const indices = categories.map((cat, idx) => (cat === value ? 1 : 0))
  if (dropFirst) {
    return indices.slice(1)
  }
  return indices
}

export function standardScale(value: number, mean: number, std: number): number {
  return (value - mean) / std
}

export function preprocessFeatures(rawData: RawFormData, scaler: ScalerParams): number[] {
  // Step 1: Cap physical activity
  const physicalActivityCapped = capPhysicalActivity(rawData.physical_activity_minutes_per_week)

  // Step 2: Label encode ordinal variables
  const educationEncoded = labelEncode(rawData.education_level, EDUCATION_MAPPING)
  const incomeEncoded = labelEncode(rawData.income_level, INCOME_MAPPING)

  // Step 3: One-hot encode nominal variables (using drop_first=True)
  const genderOneHot = oneHotEncode(rawData.gender, GENDER_CATEGORIES, true)
  const ethnicityOneHot = oneHotEncode(rawData.ethnicity, ETHNICITY_CATEGORIES, true)
  const smokingOneHot = oneHotEncode(rawData.smoking_status, SMOKING_CATEGORIES, true)
  const employmentOneHot = oneHotEncode(rawData.employment_status, EMPLOYMENT_CATEGORIES, true)

  // Step 4: Scale numerical features
  const numericalValues = [
    rawData.age,
    rawData.alcohol_consumption_per_week,
    physicalActivityCapped,
    rawData.diet_score,
    rawData.sleep_hours_per_day,
    rawData.screen_time_hours_per_day,
    rawData.bmi,
    rawData.waist_to_hip_ratio,
    rawData.systolic_bp,
    rawData.diastolic_bp,
    rawData.heart_rate,
    rawData.hdl_cholesterol,
    rawData.ldl_cholesterol,
    rawData.triglycerides,
  ]

  const scaledNumerical = numericalValues.map((val, idx) => standardScale(val, scaler.mean[idx], scaler.std[idx]))

  // Step 5: Arrange features in exact order
  const features = [
    ...scaledNumerical,
    educationEncoded,
    incomeEncoded,
    rawData.family_history_diabetes,
    rawData.hypertension_history,
    rawData.cardiovascular_history,
    ...genderOneHot, // gender_Male, gender_Other
    ...ethnicityOneHot, // ethnicity_Black, ethnicity_Hispanic, ethnicity_Other, ethnicity_White
    ...smokingOneHot, // smoking_Former, smoking_Never
    ...employmentOneHot, // employment_Retired, employment_Student, employment_Unemployed
  ]

  console.log("[v0] Preprocessed features length:", features.length)
  console.log("[v0] Features:", features)

  return features
}
