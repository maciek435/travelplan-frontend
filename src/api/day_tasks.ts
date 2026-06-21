import client from './client'

export const getTasks = (tripId: number) => {
    return client.get(`/day-tasks/${tripId}`)
}

export const createTask = (
    title: string,
    description: string,
    date: string,
    trip_id: number,
    start_time: string, 
    lat: number | null,
    lng: number | null,
    location_name: string) => {
        return client.post(`/day-tasks/`, { title, description, date, trip_id, start_time, lat, lng, location_name})
    }

export const deleteTask = (id: number) => {
    return client.delete(`/day-tasks/${id}`)
}

export const reorderTasks = (tripId: number, taskIds: number[]) => {
    return client.put(`/day-tasks/reorder/${tripId}`, { task_ids: taskIds })
}

export const updateTask = (id: number, title: string, description: string, date: string, trip_id: number, start_time: string, lat: number | null, lng: number | null, location_name: string) => {
    return client.put(`/day-tasks/${id}`, { title, description, date, trip_id, start_time, lat, lng, location_name })
}