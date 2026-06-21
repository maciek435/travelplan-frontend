import PreviewMap from './LocationPreview'

interface TaskFormProps {
    title: string
    taskTitle: string
    taskTime: string
    taskDescription: string
    taskLat: number | null
    taskLng: number | null
    locationQuery: string
    locationResults: any[]
    
    onTitleChange: (value: string) => void
    onDescriptionChange: (value: string) => void
    onTimeChange: (value: string) => void
    onLocationQueryChange: (value: string) => void
    onLocationSearch: () => void
    onLocationSelect: (result: any) => void
    onSubmit: (e: any) => void
    onCancel: () => void
}

function TaskForm({
    title,
    taskTitle,
    taskTime,
    taskDescription,
    taskLat,
    taskLng,
    locationQuery,
    locationResults,
    onTitleChange,
    onDescriptionChange,
    onTimeChange,
    onLocationQueryChange,
    onLocationSearch,
    onLocationSelect,
    onSubmit,
    onCancel
}: TaskFormProps) {
    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-md flex" style={{ width: '80vw', height: '80vh' }}>
                <div className="w-96 p-8 overflow-y-auto flex-shrink-0">
                    <h1 className='text-2xl font-bold mb-6'>{title}</h1>
                    <form onSubmit={onSubmit} className='w-full max-w-xs'>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Tytuł</label>
                            <input value={taskTitle} onChange={(e) => onTitleChange(e.target.value)}
                                className="shadow border rounded w-full py-2 px-3 text-gray-700" type="text" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Opis</label>
                            <input value={taskDescription || ''} onChange={(e) => onDescriptionChange(e.target.value)}
                                className="shadow border rounded w-full py-2 px-3 text-gray-700" type="text" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Czas</label>
                            <input value={taskTime || ''} onChange={(e) => onTimeChange(e.target.value)}
                                className="shadow border rounded w-full py-2 px-3 text-gray-700" type="time" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Lokalizacja</label>
                            <div className='relative'>
                                <div className="flex gap-2">
                                    <input value={locationQuery} onChange={(e) => onLocationQueryChange(e.target.value)}
                                        className="shadow border rounded w-full py-2 px-3 text-gray-700" type="text" placeholder="Szukaj adresu..." />
                                    <button type="button" onClick={onLocationSearch}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded">
                                        Szukaj
                                    </button>
                                </div>
                                {locationResults.length > 0 && (
                                    <div className='absolute top-full left-0 right-0 bg-white border rounded shadow-lg z-10 max-h-48 overflow-y-auto'>
                                        {locationResults.map((result, index) => (
                                            <div key={index} onClick={() => {onLocationSelect(result)}}
                                                className="p-2 hover:bg-gray-100 cursor-pointer text-sm border-b">
                                                {result.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="flex-1 overflow-hidden rounded-r-lg">
                                    <PreviewMap lat={taskLat} lng={taskLng} />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <button onClick={onCancel} type="button"
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Anuluj</button>
                            <button type="submit"
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Zapisz</button>
                        </div>
                    </form>
                </div>
                <div className="flex-1 overflow-hidden rounded-r-lg">
                    <PreviewMap lat={taskLat} lng={taskLng} />
                </div>
            </div>
        </div>
    )
}

export default TaskForm