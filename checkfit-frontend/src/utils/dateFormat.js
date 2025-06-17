/**
 * Formata uma data/hora para formato brasileiro amigável
 * De: "2025-06-17T18:00:00" para "17/06/2025 18:00"
 */
export const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    
    try {
        const date = new Date(dateTimeString);
        
        // Formatar data: DD/MM/AAAA
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        
        // Formatar hora: HH:MM
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
        console.error('Erro ao formatar data:', error);
        return dateTimeString; // Retorna original se der erro
    }
};

/**
 * Formata apenas a hora
 * De: "2025-06-17T18:00:00" para "18:00"
 */
export const formatTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    
    try {
        const date = new Date(dateTimeString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        return `${hours}:${minutes}`;
    } catch (error) {
        console.error('Erro ao formatar hora:', error);
        return dateTimeString;
    }
};

/**
 * Formata intervalo de tempo para o mesmo dia
 * De: startTime="2025-06-17T18:00:00", endTime="2025-06-17T19:00:00" 
 * Para: "17/06/2025 18:00 - 19:00"
 */
export const formatTimeRange = (startTime, endTime) => {
    if (!startTime || !endTime) return '';
    
    try {
        const startDate = new Date(startTime);
        const endDate = new Date(endTime);
        
        // Verificar se é o mesmo dia
        const sameDay = startDate.toDateString() === endDate.toDateString();
        
        if (sameDay) {
            const day = startDate.getDate().toString().padStart(2, '0');
            const month = (startDate.getMonth() + 1).toString().padStart(2, '0');
            const year = startDate.getFullYear();
            
            const startHour = formatTime(startTime);
            const endHour = formatTime(endTime);
            
            return `${day}/${month}/${year} ${startHour} - ${endHour}`;
        } else {
            // Dias diferentes, mostrar data completa para ambos
            return `${formatDateTime(startTime)} - ${formatDateTime(endTime)}`;
        }
    } catch (error) {
        console.error('Erro ao formatar intervalo:', error);
        return `${startTime} - ${endTime}`;
    }
};

/**
 * Formata apenas a data
 * De: "2025-06-17T18:00:00" para "17/06/2025"
 */
export const formatDate = (dateTimeString) => {
    if (!dateTimeString) return '';
    
    try {
        const date = new Date(dateTimeString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    } catch (error) {
        console.error('Erro ao formatar data:', error);
        return dateTimeString;
    }
}; 