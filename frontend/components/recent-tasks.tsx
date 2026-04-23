"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock } from "lucide-react"

type Task = {
  id: number
  title: string
  description: string
  isCompleted: boolean
  firebaseUid: string
}

export function RecentTasks({ tasks }: { tasks: Task[] }) {
  const recent = tasks.slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Tasks</CardTitle>
        <CardDescription>Your latest 5 tasks</CardDescription>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
            No tasks yet. Start by creating your first task.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {recent.map((task) => (
              <div
                key={task.id}
                className="flex items-start justify-between gap-3 border-b pb-3 last:border-b-0 last:pb-0"
              >
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  {task.isCompleted ? (
                    <CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
                  ) : (
                    <Clock className="size-4 text-yellow-600 mt-0.5 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${task.isCompleted ? "line-through text-muted-foreground" : ""}`}>
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-xs text-muted-foreground truncate">{task.description}</p>
                    )}
                  </div>
                </div>
                <Badge variant={task.isCompleted ? "secondary" : "outline"} className="shrink-0">
                  {task.isCompleted ? "Done" : "Pending"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
