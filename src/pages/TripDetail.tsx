import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTrip } from '../api/trips'
import backIcon from '../assets/back.svg'
import logoutIcon from '../assets/logout.svg'
import { formatDate } from '../utils/date'


function TripDetail() {
    const navigate = useNavigate()
    const [trip, setTrip] = useState<any>(null)
    const { id } = useParams()

    const handleLogout = () =>{
        localStorage.removeItem('token')
        navigate('/login')
    }

    const getDays = (startDate: string, endDate: string) => {
        const days =[]
        const current = new Date(startDate)
        const end = new Date(endDate)

        while (current <= end) {
            days.push(current.toISOString().split('T')[0])
            current.setDate(current.getDate() + 1)
        }

        return days
    }

    useEffect(() => {
        getTrip(Number(id)).then((res) => setTrip(res.data))
    }, [id])


    if (!trip) return <div className="p-8">Ładowanie...</div>

    const days = trip ? getDays(trip.start_date, trip.end_date) : []

    return (
        <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
            {/* Nagłówek */}
            <div className="bg-white shadow p-4 flex items-center justify-between flex-shrink-0 ">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(`/trips`)}
                        className="
                            flex items-center justify-center
                            w-9 h-9
                            bg-transparent
                            rounded-3xl
                            hover:bg-gray-100
                            transition-colors
                        "
                    >
                        <img src={backIcon} alt="" className="w-7 h-7" />
                    </button>
                    <h1 className='text-2xl font-bold'>{trip.title}</h1>
                    <p className="text-gray-500 text-lg">{trip.destination}</p>
                </div>
                <div className="flex items-center">
                    <p className="text-gray-500 text-lg">Wyloguj</p>
                    <button
                        onClick={handleLogout}
                        className="
                            flex items-center justify-center
                            w-9 h-9
                            bg-transparent
                            rounded-3xl
                            hover:bg-gray-100
                            transition-colors
                        "
                    >
                        <img src={logoutIcon} alt="" className="w-7 h-7" />
                    </button>
                </div>
            </div>
            
            {/* Oś czasu */}
            <div className="bg-white m-4 p-4 rounded shadow flex-shrink-0 overflow-x-auto">
                <div className="grid gap-3" style={{gridTemplateColumns: `repeat(${days.length}, 1fr)`}}>
                    {days.map((day, index) => {
                        const isFirst = index === 0
                        const isLast = index === days.length - 1
                        const label = isFirst ? 'Start' : isLast ? 'Koniec' : `Dzień ${index}`
                        
                        return (
                        <div key={day} className={`rounded-lg p-3 text-center cursor-pointer transition-colors
                            ${isFirst || isLast 
                            ? 'bg-green-100 hover:bg-green-200 border border-green-300' 
                            : 'bg-gray-100 hover:bg-blue-100'
                            }`}
                        >
                            <p className="text-sm font-bold">{label}</p>
                            <p className="text-xs text-gray-500">{formatDate(day)}</p>
                        </div>
                        )
                    })}
                </div>
            </div>
            
            {/* Główna sekcja */}
            <div className="flex m-4 gap-4 flex-1 overflow-hidden">
                <div className="w-2/6 bg-white rounded shadow p-4 overflow-y-auto">
                    lista tasków
                </div>
                <div className="flex-1 bg-white rounded shadow p-4">
                    mapa (soon)
                </div>
            </div>
        </div>
    )
}

export default TripDetail