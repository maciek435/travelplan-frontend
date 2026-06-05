import { useState, useEffect } from 'react'
import { getTrips } from '../api/trips'

function Trips() {
    const [trips, setTrips] = useState([])

    useEffect(() => {
        getTrips().then((response) => {
            setTrips(response.data)
        })
    }, [])
    
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Moje podróże</h1>
            {trips.map((trip: any) => (
                <div key={trip.id} className='bg-white p-4 rounded shadow mb-4'>
                    <h2 className='text-lg font-bold'>{trip.title}</h2>
                    <p className="text-gray-600">{trip.destination}</p>
                </div>
            ))}
        </div>
    )
}

export default Trips