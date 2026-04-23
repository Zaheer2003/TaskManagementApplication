"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, User } from "firebase/auth"
import { auth } from "@/lib/firebase"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import TaskList from "@/components/TaskList"
import TaskCreate from "@/components/TaskCreate"

type Task = {
  id: number
  title: string
  description: string
  isCompleted: boolean
  firebaseUid: string
}

export default function TaskPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState(0)
  const [open, setOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)

  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) router.push("/login")
      else setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [router])

  const handleOpenCreate = () => {
    setEditTask(null)
    setOpen(true)
  }

  const handleOpenEdit = (task: Task) => {
    setEditTask(task)
    setOpen(true)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-screen">Loading...</div>
  )

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-6 p-4">
          <div className="px-4 lg:px-6 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Task Management</h1>
              <p className="text-muted-foreground">Manage and track all your tasks</p>
            </div>
            <Button onClick={handleOpenCreate}>
              <PlusIcon className="size-4 mr-1" />
              Add New Task
            </Button>
          </div>

          <div className="px-4 lg:px-6">
            <TaskList
              refresh={refresh}
              onAdd={handleOpenCreate}
              onEdit={handleOpenEdit}
            />
          </div>
        </div>

        <TaskCreate
          open={open}
          onOpenChange={(v) => { setOpen(v); if (!v) setEditTask(null) }}
          onCreated={() => setRefresh((r) => r + 1)}
          editTask={editTask}
        />
      </SidebarInset>
    </SidebarProvider>
  )
}
