import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTrip } from '../api/trips'
import backIcon from '../assets/back.svg'
import logoutIcon from '../assets/logout.svg'
import { formatDate, formatTime } from '../utils/date'
import { getTasks, createTask, deleteTask } from '../api/day_tasks'
import addIcon from '../assets/add.svg'
import deleteIcon from '../assets/delete.svg'
import clockIcon from '../assets/clock.svg'
import editIcon from '../assets/edit.svg'


function TripDetail() {
    const navigate = useNavigate()
    const [trip, setTrip] = useState<any>(null)
    const { id } = useParams()
    const [tasks, setTasks] = useState<any[]>([])
    const [selectedDay, setSelectedDay] = useState<string | null>(null)
    const [showTaskForm, setShowTaskForm] = useState(false)
    const [taskTitle, setTaskTitle] = useState('')
    const [taskDate, setTaskDate] = useState('')
    const [taskTime, setTaskTime] = useState('')
    const [taskDescription, setTaskDescription] = useState('')

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    const handleCreateTask = async (e: any) => {
        e.preventDefault()
        await createTask(taskTitle, taskDescription, taskDate || selectedDay || '', Number(id), taskTime)
        getTasks(Number(id)).then((res) => setTasks(res.data))
        setShowTaskForm(false)
        setTaskTitle('')
        setTaskDescription('')
    }

    const handleDeleteTask = async (taskId: number) => {
        await deleteTask(taskId)
        getTasks(Number(id)).then((res) => setTasks(res.data))
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
        getTrip(Number(id)).then((res) => setTrip(res.data)),
        getTasks(Number(id)).then((res) => setTasks(res.data))
    }, [id])


    if (!trip) return <div className="p-8">Ładowanie...</div>

    const days = trip ? getDays(trip.start_date, trip.end_date) : []

    const filteredTasks = selectedDay 
        ? tasks.filter(task => task.date === selectedDay)
        : tasks

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
                        <div key={day} 
                            onClick={() => setSelectedDay(selectedDay === day ? null : day)}
                            className={`rounded-lg p-3 text-center cursor-pointer transition-colors
                            ${isFirst || isLast 
                            ? 'bg-green-100 hover:bg-green-200 border border-green-300' 
                            : 'bg-gray-100 hover:bg-blue-100'
                            }
                            ${selectedDay === day ? 'ring-2 ring-blue-500' : ''}
                            `}
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
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-lg">Taski</h2>
                        <button 
                            onClick={() => {
                                setTaskDate(selectedDay || '')
                                setShowTaskForm(true)
                            }}
                            className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center hover:bg-green-700">
                        <img src={addIcon} className="w-5 h-5" />
                        </button>
                    </div>
                    {filteredTasks.map((task: any) => (
                        <div key={task.id} className="bg-gray-100 rounded p-3 mb-2">
                            <div className='grid grid-cols-3 items-center'>
                                <div className='flex gap-2 items-center'>
                                    <img src={clockIcon} className="w-4 h-4" />
                                    <p className="text-gray-600">{formatTime(task.start_time)}</p>
                                </div>
                                <div>
                                    <p className="font-bold">{task.title}</p>
                                    <p className="text-gray-500 text-sm">{task.description}</p>
                                </div>
                                <div className='flex justify-end'>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            // handleEditClick(e, trip)
                                        }}
                                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                        >
                                        <img src={editIcon} className="w-5 h-5" />
                                        </button>
                                        <button 
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleDeleteTask(task.id)
                                        }}
                                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                        >
                                        <img src={deleteIcon} className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>                        
                    ))}
                    {showTaskForm && (
                        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                            <h1 className='text-2xl font-bold mb-6'>Nowy task</h1>
                            <form onSubmit={handleCreateTask} className='w-full max-w-xs'>
                                <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Tytuł</label>
                                <input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)}
                                    className="shadow border rounded w-full py-2 px-3 text-gray-700" type="text" placeholder="Tytuł"/>
                                </div>
                                <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Opis</label>
                                <input value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)}
                                    className="shadow border rounded w-full py-2 px-3 text-gray-700" type="text" placeholder="Opis"/>
                                </div>
                                <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Czas</label>
                                <input value={taskTime} onChange={(e) => setTaskTime(e.target.value)}
                                    className="shadow border rounded w-full py-2 px-3 text-gray-700" type="time"/>
                                </div>
                                <div className="flex items-center justify-between">
                                <button onClick={() => setShowTaskForm(false)} type="button"
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Anuluj</button>
                                <button type="submit"
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Zapisz</button>
                                </div>
                            </form>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex-1 bg-white rounded shadow p-4">
                    mapa (soon)
                </div>
            </div>
        </div>
    )
}

export default TripDetail