import client from './client'

export const getTrips = () => {
    return client.get('/trips')
}

export const createTrips = (
    title: string, 
    destination: string,
    start_date: Date,
    end_date: Date) => {
        return client.post('/trips/', { title, destination, start_date, end_date })
}

export const deleteTrips = (id: number) => {
    return client.delete(`/trips/${id}`)
}