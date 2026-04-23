"use client"

import { LoginForm } from "@/components/login-form"
import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function LoginPage() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <Image src={mounted && theme === "dark" ? "/task-light.svg" : "/task.svg"} alt="Task" width={24} height={24} className="size-6" />
          Task Management Application
        </a>
        <LoginForm />
      </div>
    </div>
  )
}
