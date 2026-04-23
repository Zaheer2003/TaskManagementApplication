"use client"

import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { getTasks, updateTask, deleteTask } from "@/lib/api"
import { toast } from "sonner"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from "@/components/ui/empty"
import { InboxIcon, Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"

type Task = {
  id: number
  title: string
  description: string
  isCompleted: boolean
  firebaseUid: string
}

const PAGE_SIZE = 5

export default function TaskList({
  refresh,
  onAdd,
  onEdit,
}: {
  refresh: number
  onAdd: () => void
  onEdit: (task: Task) => void
}) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all")
  const [page, setPage] = useState(1)

  useEffect(() => {
    const fetchTasks = async () => {
      const user = auth.currentUser
      if (!user) { toast.error("Not logged in"); setLoading(false); return }
      try {
        const data = await getTasks(user.uid)
        setTasks(data)
      } catch {
        toast.error("Failed to load tasks")
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [refresh])

  // reset to page 1 when filter changes
  useEffect(() => { setPage(1) }, [filter])

  const handleToggle = async (task: Task) => {
    try {
      await updateTask(task.id, { ...task, isCompleted: !task.isCompleted })
      setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, isCompleted: !t.isCompleted } : t))
    } catch {
      toast.error("Failed to update task")
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id)
      setTasks((prev) => prev.filter((t) => t.id !== id))
      toast.success("Task deleted")
    } catch {
      toast.error("Failed to delete task")
    }
  }

  const filtered = tasks.filter((t) =>
    filter === "all" ? true : filter === "completed" ? t.isCompleted : !t.isCompleted
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push("ellipsis")
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i)
      if (currentPage < totalPages - 2) pages.push("ellipsis")
      pages.push(totalPages)
    }
    return pages
  }

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <p className="text-muted-foreground">Loading tasks...</p>
    </div>
  )

  return (
    <div className="flex flex-col gap-4">
      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(["all", "pending", "completed"] as const).map((f) => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon"><InboxIcon className="size-6" /></EmptyMedia>
            <EmptyTitle>No tasks</EmptyTitle>
            <EmptyDescription>No {filter === "all" ? "" : filter} tasks found.</EmptyDescription>
          </EmptyHeader>
          {filter === "all" && (
            <Button onClick={onAdd} className="mt-2">Add New Task</Button>
          )}
        </Empty>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {paginated.map((task) => (
              <div key={task.id} className="border p-4 rounded-lg flex justify-between items-center hover:bg-accent/50 transition-colors">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={task.isCompleted}
                    onCheckedChange={() => handleToggle(task)}
                    className="mt-1"
                  />
                  <div>
                    <h3 className={`font-semibold text-base ${task.isCompleted ? "line-through text-muted-foreground" : ""}`}>
                      {task.title}
                    </h3>
                    {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${
                    task.isCompleted
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  }`}>
                    {task.isCompleted ? "Completed" : "Pending"}
                  </span>

                  <Button variant="ghost" size="icon" onClick={() => onEdit(task)}>
                    <Pencil className="size-4" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Task</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete &quot;{task.title}&quot;? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction variant="destructive" onClick={() => handleDelete(task.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    aria-disabled={currentPage === 1}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {getPageNumbers().map((p, i) =>
                  p === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${i}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={p}>
                      <PaginationLink
                        isActive={p === currentPage}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    aria-disabled={currentPage === totalPages}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  )
}
