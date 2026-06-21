import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTrip } from '../api/trips'
import backIcon from '../assets/back.svg'
import logoutIcon from '../assets/logout.svg'
import { formatDate, formatTime } from '../utils/date'
import { getTasks, createTask, deleteTask, reorderTasks, updateTask } from '../api/day_tasks'
import addIcon from '../assets/add.svg'
import { DndContext, closestCenter } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import SortableTask from '../components/SortableTask'
import Map from '../components/Map'
import { searchLocation } from '../utils/geocoding'
import TaskForm from '../components/TaskForm'



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
    const [showEditTaskForm, setShowEditTaskForm] = useState(false)
    const [taskToEdit, setTaskToEdit] = useState<any>(null)
    const [locationQuery, setLocationQuery] = useState('')
    const [locationResults, setLocationResults] = useState<any[]>([])
    const [taskLat, setTaskLat] = useState<number | null>(null)
    const [taskLng, setTaskLng] = useState<number | null>(null)
    const [taskLocationName, setTaskLocationName] = useState('')

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    const handleCreateTask = async (e: any) => {
        e.preventDefault()
        await createTask(taskTitle, taskDescription, taskDate || selectedDay || '', Number(id), taskTime, taskLat, taskLng, taskLocationName)
        getTasks(Number(id)).then((res) => setTasks(res.data))
        setShowTaskForm(false)
        setTaskTitle('')
        setTaskDescription('')
    }

    const handleEditTaskClick = (task: any) => {
        setTaskToEdit(task)
        setTaskTitle(task.title)
        setTaskDescription(task.description || '')
        setTaskTime(task.start_time || '')
        setTaskLat(task.lat)
        setTaskLng(task.lng)
        setLocationQuery(task.location_name || '')
        setShowEditTaskForm(true)
    }

    const handleEditTaskSave = async (e: any) => {
        e.preventDefault()
        await updateTask(taskToEdit.id, taskTitle, taskDescription, taskToEdit.date, Number(id), taskTime, taskLat, taskLng, taskLocationName)
        getTasks(Number(id)).then((res) => setTasks(res.data))
        setShowEditTaskForm(false)
    }

    const handleDeleteTask = async (taskId: number) => {
        await deleteTask(taskId)
        getTasks(Number(id)).then((res) => setTasks(res.data))
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const oldIndex = filteredTasks.findIndex(t => t.id === active.id)
        const newIndex = filteredTasks.findIndex(t => t.id === over.id)
        const newOrder = arrayMove(filteredTasks, oldIndex, newIndex)
        
        setTasks(prev => {
            const otherTasks = prev.filter(t => t.date !== selectedDay)
            return [...otherTasks, ...newOrder]
        })

        await reorderTasks(Number(id), newOrder.map(t => t.id))
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

    const handleLocationSearch = async () => {
        const results = await searchLocation(locationQuery)
        setLocationResults(results)
    }

    useEffect(() => {
        getTrip(Number(id)).then((res) => {
            setTrip(res.data)
            setSelectedDay(res.data.start_date)
        })
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
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={filteredTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                            {filteredTasks.map((task: any) => (
                                <SortableTask key={task.id} task={task} onDelete={handleDeleteTask} onEdit={handleEditTaskClick}/>
                            ))}
                        </SortableContext>
                    </DndContext>
                    {showTaskForm && (
                        <TaskForm
                            title="Nowy task"
                            taskTitle={taskTitle}
                            taskDescription={taskDescription}
                            taskTime={taskTime}
                            taskLat={taskLat || null}
                            taskLng={taskLng || null}
                            locationQuery={locationQuery}
                            locationResults={locationResults}
                            onTitleChange={setTaskTitle}
                            onDescriptionChange={setTaskDescription}
                            onTimeChange={setTaskTime}
                            onLocationQueryChange={setLocationQuery}
                            onLocationSearch={handleLocationSearch}
                            onLocationSelect={(result) => {
                            setTaskLat(result.lat)
                            setTaskLng(result.lng)
                            setTaskLocationName(result.name)
                            setLocationResults([])
                            setLocationQuery(result.name)
                            }}
                            onSubmit={handleCreateTask}
                            onCancel={() => setShowTaskForm(false)}
                        />
                    )}
                    {showEditTaskForm && taskToEdit && (
                        <TaskForm
                            title="Edytuj task"
                            taskTitle={taskTitle}
                            taskDescription={taskDescription}
                            taskTime={taskTime}
                            taskLat={taskLat || null}
                            taskLng={taskLng || null}
                            locationQuery={locationQuery}
                            locationResults={locationResults}
                            onTitleChange={setTaskTitle}
                            onDescriptionChange={setTaskDescription}
                            onTimeChange={setTaskTime}
                            onLocationQueryChange={setLocationQuery}
                            onLocationSearch={handleLocationSearch}
                            onLocationSelect={(result) => {
                            setTaskLat(result.lat)
                            setTaskLng(result.lng)
                            setTaskLocationName(result.name)
                            setLocationResults([])
                            setLocationQuery(result.name)
                            }}
                            onSubmit={handleEditTaskSave}
                            onCancel={() => setShowEditTaskForm(false)}
                        />
                    )}
                </div>
                <div className="flex-1 rounded shadow overflow-hidden">
                    <Map tasks={filteredTasks} />
                </div>
            </div>
        </div>
    )
}

export default TripDetail