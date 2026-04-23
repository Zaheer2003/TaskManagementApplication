"use client"

import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { createTask, updateTask } from "@/lib/api"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

type Task = {
  id: number
  title: string
  description: string
  isCompleted: boolean
  firebaseUid: string
}

export default function TaskCreate({
  open,
  onOpenChange,
  onCreated,
  editTask,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
  editTask?: Task | null
}) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title)
      setDescription(editTask.description ?? "")
    } else {
      setTitle("")
      setDescription("")
    }
  }, [editTask, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return toast.error("Title is required")

    const user = auth.currentUser
    if (!user) return toast.error("Not logged in")

    setLoading(true)
    try {
      if (editTask) {
        await updateTask(editTask.id, { title, description, isCompleted: editTask.isCompleted, firebaseUid: user.uid })
        toast.success("Task updated")
      } else {
        await createTask({ title, description, firebaseUid: user.uid })
        toast.success("Task created")
      }
      onCreated()
      onOpenChange(false)
    } catch {
      toast.error(editTask ? "Failed to update task" : "Failed to create task")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editTask ? "Edit Task" : "New Task"}</DialogTitle>
          <DialogDescription className="sr-only">
            {editTask ? "Update the task details." : "Fill in the details to create a new task."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            placeholder="Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? (editTask ? "Saving..." : "Creating...") : (editTask ? "Save Changes" : "Add Task")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
