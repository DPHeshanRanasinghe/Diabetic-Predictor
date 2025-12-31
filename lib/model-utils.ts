import * as tf from "@tensorflow/tfjs"

let loadedModel: tf.LayersModel | null = null
let modelLoading = false

export async function loadModel(): Promise<tf.LayersModel | null> {
  if (loadedModel) return loadedModel
  if (modelLoading) {
    // Wait for the loading to complete
    while (modelLoading) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
    return loadedModel
  }

  try {
    modelLoading = true
    
    // Skip IndexedDB cache to avoid loading corrupted models - always load fresh from HTTP
    // This ensures we get the latest fixed model.json
    console.log("[v0] Loading model from HTTP...")
    const model = await tf.loadLayersModel("/models/best_diabetes_model/model.json")
    loadedModel = model
    
    // Try to save to IndexedDB for future use
    try {
      await model.save("indexeddb://best_diabetes_model")
      console.log("[v0] Model saved to IndexedDB for caching")
    } catch (saveError) {
      console.warn("[v0] Failed to save model to IndexedDB:", saveError)
    }
    
    console.log("[v0] Model loaded successfully from HTTP")
    return model
  } catch (error: any) {
    console.error("[v0] Model loading failed, will use fallback calculation")
    console.error("[v0] Error details:", error?.message || error)
    if (error?.stack) {
      console.error("[v0] Stack trace:", error.stack)
    }
    return null
  } finally {
    modelLoading = false
  }
}

export async function predictDiabetesRisk(features: number[]): Promise<number> {
  try {
    // Validate input features
    if (!features || features.length !== 30) {
      console.error(`[v0] Invalid features array length: ${features?.length || 0}, expected 30`)
      return calculateFallbackRisk(features || [])
    }

    const model = await loadModel()
    if (!model) {
      console.log("[v0] No model available, using fallback calculation")
      return calculateFallbackRisk(features)
    }

    console.log("[v0] Making prediction with model, input shape:", [1, 30])
    
    // Ensure features are numbers and create tensor with explicit dtype
    const numericFeatures = features.map(f => typeof f === 'number' ? f : parseFloat(String(f)) || 0)
    const inputTensor = tf.tensor2d([numericFeatures], [1, 30], 'float32')
    
    console.log("[v0] Input tensor dtype:", inputTensor.dtype)
    console.log("[v0] Model input shape:", model.inputs[0]?.shape)
    
    const prediction = model.predict(inputTensor) as tf.Tensor
    const probability = await prediction.data()
    
    console.log("[v0] Model prediction result:", probability[0])
    
    inputTensor.dispose()
    prediction.dispose()

    return Math.min(Math.max(probability[0], 0), 1)
  } catch (error: any) {
    console.error("[v0] Prediction error, using fallback")
    console.error("[v0] Error details:", error?.message || error)
    return calculateFallbackRisk(features || [])
  }
}

// Fallback risk calculation based on medical guidelines
export function calculateFallbackRisk(features: number[]): number {
  // Features array structure after preprocessing:
  // 0-13: scaled numerical features
  // 14: education_level
  // 15: income_level
  // 16: family_history_diabetes
  // 17: hypertension_history
  // 18: cardiovascular_history
  // 19-20: gender one-hot
  // 21-24: ethnicity one-hot
  // 25-26: smoking one-hot
  // 27-29: employment one-hot

  let riskScore = 0.3 // baseline

  // BMI (index 6 - scaled)
  const bmiScaled = features[6]
  riskScore += bmiScaled > 0.5 ? 0.15 : 0
  riskScore += bmiScaled > 1.0 ? 0.1 : 0

  // Waist-to-hip ratio (index 7 - scaled)
  const whRatioScaled = features[7]
  riskScore += whRatioScaled > 0.3 ? 0.1 : 0

  // Systolic BP (index 8 - scaled)
  const systolicScaled = features[8]
  riskScore += systolicScaled > 0.5 ? 0.1 : 0

  // Family history (index 16)
  riskScore += features[16] === 1 ? 0.2 : 0

  // Hypertension (index 17)
  riskScore += features[17] === 1 ? 0.15 : 0

  // Cardiovascular history (index 18)
  riskScore += features[18] === 1 ? 0.1 : 0

  // Smoking status (index 25: Former, 26: Never - Current is baseline)
  if (features[25] === 0 && features[26] === 0) {
    riskScore += 0.1 // Current smoker
  }

  return Math.min(Math.max(riskScore, 0), 1)
}

export function getRiskLevel(probability: number): {
  level: string
  color: string
  description: string
} {
  if (probability < 0.4) {
    return {
      level: "Low",
      color: "bg-green-500",
      description: "Your diabetes risk is low. Continue healthy lifestyle habits.",
    }
  } else if (probability < 0.7) {
    return {
      level: "Moderate",
      color: "bg-orange-500",
      description: "Your diabetes risk is moderate. Consider consulting a healthcare provider.",
    }
  } else {
    return {
      level: "High",
      color: "bg-red-500",
      description: "Your diabetes risk is high. Please consult a healthcare professional.",
    }
  }
}
