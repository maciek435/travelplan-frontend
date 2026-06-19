import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import deleteIcon from '../assets/delete.svg'
import editIcon from '../assets/edit.svg'
import clockIcon from '../assets/clock.svg'
import { formatTime } from '../utils/date'

interface Props {
  task: any
  onDelete: (id: number) => void
}

function SortableTask({ task, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
      className="bg-gray-100 rounded p-3 mb-2 cursor-grab active:cursor-grabbing">
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
            onPointerDown={(e) => e.stopPropagation()}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <img src={editIcon} className="w-5 h-5" />
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onDelete(task.id)}
            className="p-2 hover:bg-red-100 rounded-lg transition-colors">
            <img src={deleteIcon} className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default SortableTask