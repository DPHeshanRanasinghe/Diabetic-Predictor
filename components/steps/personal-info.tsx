"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InputSlider } from "@/components/input-slider"
import type { WizardFormData } from "@/components/diabetes-predictor-wizard"

interface PersonalInfoStepProps {
  formData: WizardFormData
  onUpdate: (updates: Partial<WizardFormData>) => void
}

export function PersonalInfoStep({ formData, onUpdate }: PersonalInfoStepProps) {
  return (
    <div className="space-y-6">
      {/* Age Slider */}
      <InputSlider
        label="Age"
        value={formData.age}
        min={19}
        max={89}
        unit="years"
        onChange={(value) => onUpdate({ age: value })}
        tooltip="Your current age in years"
        ranges={[
          { min: 19, max: 40, color: "bg-green-500", label: "Younger" },
          { min: 40, max: 65, color: "bg-yellow-500", label: "Middle" },
          { min: 65, max: 89, color: "bg-red-500", label: "Older" },
        ]}
      />

      {/* Gender Select */}
      <div>
        <Label htmlFor="gender" className="text-base font-semibold mb-2 block">
          Gender
        </Label>
        <Select value={formData.gender} onValueChange={(value) => onUpdate({ gender: value })}>
          <SelectTrigger id="gender" className="h-10">
            <SelectValue placeholder="Select your gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Female">Female</SelectItem>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Ethnicity Select */}
      <div>
        <Label htmlFor="ethnicity" className="text-base font-semibold mb-2 block">
          Ethnicity
        </Label>
        <Select value={formData.ethnicity} onValueChange={(value) => onUpdate({ ethnicity: value })}>
          <SelectTrigger id="ethnicity" className="h-10">
            <SelectValue placeholder="Select your ethnicity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="White">White</SelectItem>
            <SelectItem value="Hispanic">Hispanic</SelectItem>
            <SelectItem value="Black">Black</SelectItem>
            <SelectItem value="Asian">Asian</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Education Level Select */}
      <div>
        <Label htmlFor="education" className="text-base font-semibold mb-2 block">
          Education Level
        </Label>
        <Select value={formData.education_level} onValueChange={(value) => onUpdate({ education_level: value })}>
          <SelectTrigger id="education" className="h-10">
            <SelectValue placeholder="Select your education level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="No formal">No formal education</SelectItem>
            <SelectItem value="Highschool">High school</SelectItem>
            <SelectItem value="Graduate">Graduate degree</SelectItem>
            <SelectItem value="Postgraduate">Postgraduate degree</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Income Level Select */}
      <div>
        <Label htmlFor="income" className="text-base font-semibold mb-2 block">
          Income Level
        </Label>
        <Select value={formData.income_level} onValueChange={(value) => onUpdate({ income_level: value })}>
          <SelectTrigger id="income" className="h-10">
            <SelectValue placeholder="Select your income level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Lower-Middle">Lower-Middle</SelectItem>
            <SelectItem value="Middle">Middle</SelectItem>
            <SelectItem value="Upper-Middle">Upper-Middle</SelectItem>
            <SelectItem value="High">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Employment Status Select */}
      <div>
        <Label htmlFor="employment" className="text-base font-semibold mb-2 block">
          Employment Status
        </Label>
        <Select value={formData.employment_status} onValueChange={(value) => onUpdate({ employment_status: value })}>
          <SelectTrigger id="employment" className="h-10">
            <SelectValue placeholder="Select your employment status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Employed">Employed</SelectItem>
            <SelectItem value="Unemployed">Unemployed</SelectItem>
            <SelectItem value="Retired">Retired</SelectItem>
            <SelectItem value="Student">Student</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mt-6">
        <p className="text-sm text-slate-700">
          This information helps us understand demographic factors that may influence diabetes risk assessment.
        </p>
      </div>
    </div>
  )
}
