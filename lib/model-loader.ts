let model: any = null
let isLoading = false
let modelPromise: Promise<any> | null = null

async function loadModel() {
  if (model) return model
  if (isLoading) return modelPromise

  isLoading = true

  try {
    // Load the model from public directory using HTTP path
    // The model expects model.json and model.weights.bin in the same directory
    model = await (window as any).tf
      ?.loadLayersModel(
        "indexeddb://best_diabetes_model", // Try IndexedDB first
      )
      .catch(async () => {
        // Fall back to HTTP if IndexedDB doesn't have cached model
        return await (window as any).tf?.loadLayersModel("/models/best_diabetes_model/model.json")
      })

    if (!model) {
      throw new Error("Failed to load model from both IndexedDB and HTTP sources")
    }

    console.log("[v0] Model loaded successfully")
    console.log("[v0] Model summary:", model.summary())
    return model
  } catch (error) {
    console.error("[v0] Error loading model:", error)
    // Return null if model fails to load - fallback prediction will be used
    return null
  } finally {
    isLoading = false
  }
}

export async function getModel() {
  if (!modelPromise) {
    modelPromise = loadModel()
  }
  return modelPromise
}

// Optional: Save model to IndexedDB for offline support
export async function saveModelToIndexedDB() {
  const model = await getModel()
  if (model) {
    try {
      await model.save("indexeddb://best_diabetes_model")
      console.log("[v0] Model saved to IndexedDB successfully")
    } catch (error) {
      console.error("[v0] Error saving model to IndexedDB:", error)
    }
  }
}
