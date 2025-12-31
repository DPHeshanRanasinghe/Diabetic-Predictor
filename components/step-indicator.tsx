"use client"

interface StepIndicatorProps {
  steps: Array<{ title: string; description: string }>
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-1">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-md ${
                  index === currentStep
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white scale-110"
                    : index < currentStep
                      ? "bg-green-500 text-white"
                      : "bg-slate-200 text-slate-600"
                }`}
              >
                {index < currentStep ? "✓" : index + 1}
              </div>
              <span
                className={`mt-2 text-xs font-semibold text-center hidden sm:block max-w-20 transition-colors duration-300 ${
                  index === currentStep ? "text-blue-700" : index < currentStep ? "text-green-700" : "text-slate-500"
                }`}
              >
                {step.title}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`h-1 flex-1 mx-1 rounded-full transition-all duration-300 ${
                  index < currentStep ? "bg-green-500" : "bg-slate-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Mobile Step Indicator */}
      <div className="sm:hidden mt-4 text-center">
        <p className="text-sm font-semibold text-blue-700">{steps[currentStep].title}</p>
        <p className="text-xs text-slate-600">{steps[currentStep].description}</p>
      </div>
    </div>
  )
}
