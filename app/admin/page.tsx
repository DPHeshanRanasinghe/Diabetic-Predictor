"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScalerSettings } from "@/components/admin/scaler-settings"
import { ModelTester } from "@/components/admin/model-tester"
import { defaultScalerParams } from "@/lib/scaler"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("scaler")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Admin Dashboard</h1>
          <p className="text-lg text-muted-foreground">Manage model configuration and testing</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="scaler">Scaler Settings</TabsTrigger>
            <TabsTrigger value="tester">Model Tester</TabsTrigger>
          </TabsList>

          <TabsContent value="scaler" className="space-y-4">
            <ScalerSettings />
          </TabsContent>

          <TabsContent value="tester" className="space-y-4">
            <ModelTester />
          </TabsContent>
        </Tabs>

        <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
          <h3 className="font-semibold text-foreground mb-2">Current Scaler Parameters</h3>
          <pre className="text-xs overflow-auto bg-background p-3 rounded border border-border text-muted-foreground">
            {JSON.stringify(defaultScalerParams, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
