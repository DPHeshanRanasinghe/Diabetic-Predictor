// Feature scaler for normalizing input data
// Uses mean and standard deviation values to scale features

export interface ScalerParams {
  mean: number[]
  std: number[]
}

// Default scaler parameters - replace these with your actual values from the training data
export const defaultScalerParams: ScalerParams = {
  mean: [3.8, 120.9, 69.1, 20.5, 79.8, 31.9, 0.471, 33],
  std: [3.369, 31.97, 19.4, 15.95, 115, 7.88, 0.331, 11.76],
}

export class FeatureScaler {
  private mean: number[]
  private std: number[]

  constructor(params: ScalerParams) {
    this.mean = params.mean
    this.std = params.std
  }

  /**
   * Normalize features using z-score normalization: (x - mean) / std
   */
  normalize(features: number[]): number[] {
    return features.map((value, index) => {
      const std = this.std[index]
      if (std === 0) return 0 // Prevent division by zero
      return (value - this.mean[index]) / std
    })
  }

  /**
   * Denormalize features back to original scale
   */
  denormalize(normalizedFeatures: number[]): number[] {
    return normalizedFeatures.map((value, index) => value * this.std[index] + this.mean[index])
  }

  /**
   * Get scaler statistics for display/debugging
   */
  getStats() {
    return {
      mean: this.mean,
      std: this.std,
      features: [
        "Pregnancies",
        "Glucose",
        "Blood Pressure",
        "Skin Thickness",
        "Insulin",
        "BMI",
        "DiabetesPedigreeFunction",
        "Age",
      ],
    }
  }
}

// Create default scaler instance
export const defaultScaler = new FeatureScaler(defaultScalerParams)
