function toDateKey(dateTime) {
    if (!dateTime) return null;
    const date = new Date(dateTime);
    if (Number.isNaN(date.getTime())) return null;
    return date.toISOString().split("T")[0];
}

export function getUniqueCheckinDates(history) {
    return [...new Set(
        history
            .map((item) => toDateKey(item.checkinTime))
            .filter(Boolean)
    )].sort().reverse();
}

export function calculateConsecutiveDays(history) {
    const uniqueDates = getUniqueCheckinDates(history);
    if (uniqueDates.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayKey = toDateKey(today);
    const yesterdayKey = toDateKey(yesterday);

    if (!uniqueDates.includes(todayKey) && !uniqueDates.includes(yesterdayKey)) {
        return 0;
    }

    let streak = 0;
    const cursor = new Date(uniqueDates.includes(todayKey) ? today : yesterday);

    while (true) {
        const key = toDateKey(cursor);
        if (!uniqueDates.includes(key)) break;
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
}

export function calculateWeeklyCheckins(history) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);

    return history.filter((item) => {
        const date = new Date(item.checkinTime);
        return !Number.isNaN(date.getTime()) && date >= weekAgo;
    }).length;
}
