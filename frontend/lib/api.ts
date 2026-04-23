const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5204/api';

export async function getTasks(uid: string) {
    const response = await fetch(`${API_URL}/tasks?uid=${uid}`)
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
}

export async function createTask(data: { title: string; description: string; firebaseUid: string }) {
    const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, isCompleted: false }),
    })
    if (!response.ok) throw new Error('Failed to create task');
    return response.json();
}

export async function updateTask(id: number, data: { title: string; description: string; isCompleted: boolean; firebaseUid: string }) {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
    })
    if (!response.ok) throw new Error('Failed to update task');
}

export async function deleteTask(id: number) {
    const response = await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('Failed to delete task');
}