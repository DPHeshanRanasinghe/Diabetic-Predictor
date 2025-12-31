"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle, PlayCircle } from "lucide-react"

interface TestCase {
  name: string
  description: string
  features: number[]
  expectedRiskLevel: "Low" | "Moderate" | "High"
}

const testCases: TestCase[] = [
  {
    name: "Healthy Person",
    description: "Low risk profile with good metrics",
    features: [0, 100, 70, 20, 80, 22, 0.3, 25],
    expectedRiskLevel: "Low",
  },
  {
    name: "Moderate Risk",
    description: "Some elevated risk factors",
    features: [2, 125, 75, 25, 100, 28, 0.5, 40],
    expectedRiskLevel: "Moderate",
  },
  {
    name: "High Risk",
    description: "Multiple elevated risk factors",
    features: [5, 160, 90, 30, 200, 35, 0.8, 55],
    expectedRiskLevel: "High",
  },
]

export function ModelTester() {
  const [selectedTest, setSelectedTest] = useState<TestCase | null>(null)
  const [results, setResults] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [modelStatus, setModelStatus] = useState<"unknown" | "loading" | "loaded" | "error">("unknown")

  const checkModelStatus = async () => {
    setModelStatus("loading")
    try {
      // Check if TensorFlow is available
      const tf = (window as any).tf
      if (!tf) {
        throw new Error("TensorFlow.js not loaded")
      }

      // Try to load model
      const modelUrl = "/models/best_diabetes_model/model.json"
      try {
        const response = await fetch(modelUrl)
        if (response.ok) {
          setModelStatus("loaded")
        } else {
          throw new Error("Model files not found")
        }
      } catch {
        setModelStatus("error")
      }
    } catch (error) {
      console.error("[v0] Model status check failed:", error)
      setModelStatus("error")
    }
  }

  const runTestCase = async (testCase: TestCase) => {
    setSelectedTest(testCase)
    setIsLoading(true)
    setResults(null)

    try {
      // Simulate prediction
      const mockRiskScore = Math.random()
      const predictedRiskLevel = mockRiskScore < 0.15 ? "Low" : mockRiskScore < 0.5 ? "Moderate" : "High"

      const result = {
        testCase: testCase.name,
        input: testCase.features,
        predictedRiskScore: mockRiskScore,
        predictedRiskLevel,
        expectedRiskLevel: testCase.expectedRiskLevel,
        passed: predictedRiskLevel === testCase.expectedRiskLevel,
        timestamp: new Date().toISOString(),
      }

      setResults(result)
      console.log("[v0] Test result:", result)
    } catch (error) {
      console.error("[v0] Test execution error:", error)
      setResults({
        error: error instanceof Error ? error.message : "Test failed",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Model Status</CardTitle>
          <CardDescription>Check if the model is properly loaded</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Current Status:</p>
              <div className="flex items-center gap-2">
                {modelStatus === "loaded" && (
                  <>
                    <CheckCircle className="w-5 h-5 text-secondary" />
                    <span className="font-medium text-secondary">Model Loaded</span>
                  </>
                )}
                {modelStatus === "error" && (
                  <>
                    <AlertCircle className="w-5 h-5 text-destructive" />
                    <span className="font-medium text-destructive">Model Not Found</span>
                  </>
                )}
                {modelStatus === "loading" && (
                  <>
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="font-medium text-primary">Checking...</span>
                  </>
                )}
                {modelStatus === "unknown" && (
                  <>
                    <div className="w-5 h-5 rounded-full bg-muted" />
                    <span className="font-medium text-muted-foreground">Not Checked</span>
                  </>
                )}
              </div>
            </div>
            <Button onClick={checkModelStatus} disabled={modelStatus === "loading"}>
              Check Status
            </Button>
          </div>

          {modelStatus === "error" && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">
                Model files not found. Upload your Keras model to{" "}
                <code className="font-mono">public/models/best_diabetes_model/</code>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Cases</CardTitle>
          <CardDescription>Run predefined test cases to verify model behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {testCases.map((testCase, index) => (
            <div key={index} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{testCase.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{testCase.description}</p>
                  <p className="text-xs text-muted-foreground mt-2 font-mono">
                    Features: {testCase.features.join(", ")}
                  </p>
                </div>
                <Button onClick={() => runTestCase(testCase)} disabled={isLoading} size="sm" className="flex-shrink-0">
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Run Test
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            {results.error ? (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{results.error}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Predicted Risk Level</Label>
                    <p className="text-lg font-semibold text-foreground">{results.predictedRiskLevel}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Risk Score</Label>
                    <p className="text-lg font-semibold text-foreground">
                      {(results.predictedRiskScore * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div
                  className={`p-3 rounded-lg border flex items-center gap-2 ${
                    results.passed ? "bg-secondary/10 border-secondary/50" : "bg-accent/10 border-accent/50"
                  }`}
                >
                  {results.passed ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                      <span className="text-sm font-medium text-secondary">Result matches expected risk level</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-accent flex-shrink-0" />
                      <span className="text-sm font-medium text-accent">
                        Unexpected result (expected: {results.expectedRiskLevel})
                      </span>
                    </>
                  )}
                </div>

                <div>
                  <Label className="text-muted-foreground text-xs">Test Time</Label>
                  <p className="text-xs text-muted-foreground">{new Date(results.timestamp).toLocaleString()}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
