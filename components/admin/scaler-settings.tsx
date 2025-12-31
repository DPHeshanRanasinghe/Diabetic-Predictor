"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { defaultScalerParams, FeatureScaler } from "@/lib/scaler"
import { CheckCircle, Copy } from "lucide-react"

interface ScalerData {
  mean: number[]
  std: number[]
}

export function ScalerSettings() {
  const [scalerData, setScalerData] = useState<ScalerData>(defaultScalerParams)
  const [jsonInput, setJsonInput] = useState(JSON.stringify(defaultScalerParams, null, 2))
  const [copied, setCopied] = useState(false)
  const [validated, setValidated] = useState(false)

  const handleJsonImport = () => {
    try {
      const parsed = JSON.parse(jsonInput)

      if (!Array.isArray(parsed.mean) || !Array.isArray(parsed.std)) {
        throw new Error("mean and std must be arrays")
      }

      if (parsed.mean.length !== parsed.std.length) {
        throw new Error("mean and std arrays must have same length")
      }

      setScalerData(parsed)
      setValidated(true)

      // Test scaler
      try {
        const scaler = new FeatureScaler(parsed)
        const testFeatures = [3.8, 120.9, 69.1, 20.5, 79.8, 31.9, 0.471, 33]
        const normalized = scaler.normalize(testFeatures)
        console.log("[v0] Scaler validation successful. Normalized sample:", normalized)
      } catch (scalerError) {
        console.error("[v0] Scaler validation error:", scalerError)
        setValidated(false)
        throw new Error("Scaler validation failed")
      }
    } catch (error) {
      alert(`Error parsing JSON: ${error instanceof Error ? error.message : "Unknown error"}`)
      setValidated(false)
    }
  }

  const handleCopyConfig = async () => {
    const configText = `export const customScalerParams = ${JSON.stringify(scalerData, null, 2)}`
    await navigator.clipboard.writeText(configText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadConfig = () => {
    const config = {
      scaler: scalerData,
      timestamp: new Date().toISOString(),
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

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `scaler-config-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Import Scaler Parameters</CardTitle>
          <CardDescription>Paste your training data mean and std values in JSON format</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="scalerJson">Scaler Configuration (JSON)</Label>
            <Textarea
              id="scalerJson"
              placeholder='{"mean": [...], "std": [...]}'
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="mt-2 font-mono text-sm"
              rows={12}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleJsonImport} className="flex-1">
              Import & Validate
            </Button>
            <Button onClick={handleDownloadConfig} variant="outline">
              Download Config
            </Button>
          </div>

          {validated && (
            <div className="p-3 bg-secondary/20 border border-secondary/50 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
              <span className="text-sm text-secondary font-medium">Configuration validated successfully</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Configuration</CardTitle>
          <CardDescription>Mean and standard deviation values</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Mean Values</Label>
            <div className="mt-2 p-3 bg-background rounded border border-border">
              <p className="text-sm font-mono text-foreground">{JSON.stringify(scalerData.mean, null, 2)}</p>
            </div>
          </div>

          <div>
            <Label>Standard Deviation Values</Label>
            <div className="mt-2 p-3 bg-background rounded border border-border">
              <p className="text-sm font-mono text-foreground">{JSON.stringify(scalerData.std, null, 2)}</p>
            </div>
          </div>

          <Button onClick={handleCopyConfig} className="w-full bg-transparent" variant="outline">
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy as TypeScript Constant
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
