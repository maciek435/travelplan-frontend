export const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-")
    return `${day}-${month}-${year}`
}

export const formatTime = (timeStr: string | null) => {
    if (!timeStr) return ''
    return timeStr?.slice(0, 5)
}