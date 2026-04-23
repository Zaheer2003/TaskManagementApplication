"use client"

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ListTodo, CheckCircle2, Clock, TrendingUp } from "lucide-react"

type Props = {
  data?: any[]
}

export function SectionCards({ data = [] }: Props) {

  const total = data.length
  const done = data.filter((i) => i.isCompleted === true).length
  const inProgress = data.filter((i) => i.isCompleted === false).length
  const completionRate = total === 0 ? 0 : Math.round((done / total) * 100)

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardDescription>Total Items</CardDescription>
              <CardTitle>{total}</CardTitle>
            </div>
            <ListTodo className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardDescription>Completed</CardDescription>
              <CardTitle>{done}</CardTitle>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardDescription>In Progress</CardDescription>
              <CardTitle>{inProgress}</CardTitle>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardDescription>Completion Rate</CardDescription>
              <CardTitle>{completionRate}%</CardTitle>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
        </CardHeader>
      </Card>

    </div>
  )
}