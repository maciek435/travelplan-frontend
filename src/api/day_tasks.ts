import client from './client'

export const getTasks = (tripId: number) => {
    return client.get(`/day-tasks/${tripId}`)
}

export const createTask = (
    title: string,
    description: string,
    date: string,
    trip_id: number,
    start_time: string) => {
        return client.post(`/day-tasks/`, { title, description, date, trip_id, start_time})
    }

export const deleteTask = (id: number) => {
    return client.delete(`/day-tasks/${id}`)
}