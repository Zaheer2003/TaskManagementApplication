"use client"

import { SignupForm } from "@/components/signup-form"
import Image from "next/image"

export default function SignupPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <Image src="/task.svg" alt="Task" width={24} height={24} className="size-6" />
          Task Management Application
        </a>
        <SignupForm />
      </div>
    </div>
  )
}
