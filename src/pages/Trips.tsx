import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createTrips, deleteTrips, getTrips, updateTrip } from '../api/trips'
import addIcon from '../assets/add.svg'
import deleteIcon from '../assets/delete.svg'
import startIcon from '../assets/start.svg'
import endIcon from '../assets/end.svg'
import logoutIcon from '../assets/logout.svg'
import editIcon from '../assets/edit.svg'
import { formatDate } from '../utils/date'


function Trips() {
    const [trips, setTrips] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [title, setTitle] = useState('')
    const [destination, setDestination] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [tripToDelete, setTripToDelete] = useState<number | null>(null)
    const [showEditForm, setShowEditForm] = useState(false)
    const [tripToEdit, setTripToEdit] = useState<any>(null)

    const handleEditClick = (e: any, trip: any) => {
          e.stopPropagation()
        setTripToEdit(trip)
        setShowEditForm(true)
    }

    const navigate = useNavigate()

    const handleLogout = () =>{
        localStorage.removeItem('token')
        navigate('/login')
    }

    const handleCreate = async (e: any) => {
        e.preventDefault()
        await createTrips(title, destination, startDate, endDate)
        getTrips().then((response) => setTrips(response.data))
        setShowForm(false)
    }

    const handleDeleteClick = (id: number) => {
        setTripToDelete(id)
        setShowDeleteConfirm(true)
    }

    const handleDeleteConfirm = async () => {
        if (!tripToDelete) return
        await deleteTrips(tripToDelete)
        getTrips().then((response) => setTrips(response.data))
        setShowDeleteConfirm(false)
        setTripToDelete(null)
    }

    const handleEditSave = async (e: any) => {
        e.preventDefault()
        await updateTrip(tripToEdit.id, tripToEdit.title, tripToEdit.destination, tripToEdit.start_date, tripToEdit.end_date)
        getTrips().then((response) => setTrips(response.data))
        setShowEditForm(false)
    }

    useEffect(() => {
        getTrips().then((response) => {
            setTrips(response.data)
        })
    }, [])
    
    return (
        <div>
            <nav className='flex items-center gap-4 mb-6 sticky top-0 z-50 bg-white pl-10 pr-10 pt-6 pb-6 justify-between'>
                    <div className="flex items center gap-4">
                        <h1 className="text-2xl font-bold">Moje podróże</h1>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="
                                flex items-center justify-center
                                w-9 h-9
                                bg-green-600
                                rounded-lg
                                hover:bg-green-700
                                transition-colors
                            "
                        >
                            <img src={addIcon} alt="" className="w-7 h-7" />
                        </button>
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
                        {showForm && (
                            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                                <div className="bg-white p-8 rounded-lg shadow-md w-96">
                                    <h1 className='text-2xl font-bold mb-6'>Nowa podróż</h1>
                                    <form onSubmit={handleCreate} className='w-full max-w-xs'>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                                Tytuł
                                            </label>
                                            <input
                                                value={title} 
                                                onChange={(e) => setTitle(e.target.value)}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="title" type="text" placeholder="Tytuł"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="destination">
                                                Destynacja
                                            </label>
                                            <input
                                                value={destination}
                                                onChange={(e) => setDestination(e.target.value)} 
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="destiation" type="text" placeholder="Destynacja"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDate">
                                                Początek podróży
                                            </label>
                                            <input
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)} 
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="startDate" type="date" placeholder="Początek"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDate">
                                                Koniec podróży
                                            </label>
                                            <input   
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)} 
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="endDate" type="date" placeholder="Koniec"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <button 
                                                onClick={() => setShowForm(false)}
                                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                                            Anuluj
                                            </button>
                                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                            Zapisz
                                            </button>
                                            
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                        {showEditForm && tripToEdit && (
                            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                                <div className="bg-white p-8 rounded-lg shadow-md w-96">
                                <h1 className='text-2xl font-bold mb-6'>Edytuj podróż</h1>
                                <form onSubmit={handleEditSave} className='w-full max-w-xs'>
                                    <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Tytuł</label>
                                    <input
                                        value={tripToEdit.title}
                                        onChange={(e) => setTripToEdit({...tripToEdit, title: e.target.value})}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" type="text"
                                    />
                                    </div>
                                    <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Destynacja</label>
                                    <input
                                        value={tripToEdit.destination}
                                        onChange={(e) => setTripToEdit({...tripToEdit, destination: e.target.value})}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" type="text"
                                    />
                                    </div>
                                    <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Początek</label>
                                    <input
                                        value={tripToEdit.start_date}
                                        onChange={(e) => setTripToEdit({...tripToEdit, start_date: e.target.value})}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" type="date"
                                    />
                                    </div>
                                    <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Koniec</label>
                                    <input
                                        value={tripToEdit.end_date}
                                        onChange={(e) => setTripToEdit({...tripToEdit, end_date: e.target.value})}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" type="date"
                                    />
                                    </div>
                                    <div className="flex items-center justify-between">
                                    <button onClick={() => setShowEditForm(false)} type="button"
                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                                        Anuluj
                                    </button>
                                    <button type="submit"
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                        Zapisz
                                    </button>
                                    </div>
                                </form>
                                </div>
                            </div>
                            )}
            </nav>
            <div className="p-8 pt-0">
                {trips.map((trip: any) => (
                    <div key={trip.id}
                        onClick={() => navigate(`/trips/${trip.id}`)} 
                        className='bg-white p-4 rounded shadow mb-4 hover:bg-gray-100 cursor-pointer'>
                        <div className='grid grid-cols-4 items-center'>
                            <div>
                                <h2 className='text-lg font-bold'>{trip.title}</h2>
                                <p className="text-gray-500">{trip.destination}</p>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <img src={startIcon} className="w-4 h-4" />
                                <p className="text-gray-600">{formatDate(trip.start_date)}</p>
                            </div>
                            <div className='flex gap-2 items-center'>
                                <img src={endIcon} className="w-4 h-4" />
                                <p className="text-gray-600">{formatDate(trip.end_date)}</p>
                            </div>
                            <div className='flex justify-end'>
                                <button 
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleEditClick(e, trip)
                                }}
                                className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                >
                                <img src={editIcon} className="w-5 h-5" />
                                </button>
                                <button 
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteClick(trip.id)
                                }}
                                className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                >
                                <img src={deleteIcon} className="w-5 h-5" />
                                </button>
                                {showDeleteConfirm && (
                                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                                        <div className="bg-white p-8 rounded-lg shadow-md w-96">
                                            <h1 className='text-2xl font-bold mb-6'>Usunąć podróż?</h1>
                                                <div className="flex items-center justify-between">
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setShowDeleteConfirm(false)
                                                        }}
                                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                                                    Anuluj
                                                    </button>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleDeleteConfirm()
                                                        }}
                                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                                        Tak
                                                    </button>
                                                </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Trips