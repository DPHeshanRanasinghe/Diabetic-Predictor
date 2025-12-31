import type { ReactNode } from "react"

export const metadata = {
  title: "Admin Dashboard | Diabetes Predictor",
  description: "Manage model configuration and testing",
}

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  return <>{children}</>
}
