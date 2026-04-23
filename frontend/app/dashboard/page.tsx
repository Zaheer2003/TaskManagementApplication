"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, User } from "firebase/auth"
import { auth } from "@/lib/firebase"

import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { RecentTasks } from "@/components/recent-tasks"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

type Task = {
  id: number
  title: string
  description: string
  isCompleted: boolean
  firebaseUid: string
}

export default function Page() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<Task[]>([])

  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) router.push("/login")
      else setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5204/api"
        const res = await fetch(`${apiUrl}/tasks?uid=${user!.uid}`)
        const data = await res.json()
        setTasks(data)
      } catch (err) {
        console.error(err)
      }
    }
    if (user) fetchData()
  }, [user])

  if (loading) return (
    <div className="flex items-center justify-center h-screen">Loading...</div>
  )

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-6 p-4">

          {/* KPI Cards */}
          <SectionCards data={tasks} />

          {/* Chart + Recent Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 lg:px-6">
            <ChartAreaInteractive tasks={tasks} />
            <RecentTasks tasks={tasks} />
          </div>

        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
