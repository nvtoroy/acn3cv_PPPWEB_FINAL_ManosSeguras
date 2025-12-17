/**
 * УТИЛИТЫ: ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
 * 
 * Функции для форматирования данных, которые используются
 * в шаблонах EJS и контроллерах
 */

/**
 * Форматировать дату для отображения на испанском
 * 
 * @param {Date|string} date - дата для форматирования
 * @returns {string} - отформатированная дата (ejemplo: "15 de diciembre de 2025")
 */
function formatDate(date) {
    if (!date) return '';
    
    // Преобразуем в объект Date если это строка
    const d = date instanceof Date ? date : new Date(date);
    
    // Проверяем что дата валидна
    if (isNaN(d.getTime())) return '';
    
    // Форматируем на испанском для Аргентины
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    return d.toLocaleDateString('es-AR', options);
}

/**
 * Форматировать дату и время
 * 
 * @param {Date|string} date - дата для форматирования
 * @returns {string} - дата и время (ejemplo: "15/12/2025 14:30")
 */
function formatDateTime(date) {
    if (!date) return '';
    
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    return d.toLocaleString('es-AR', options);
}

/**
 * Форматировать сумму денег (песо аргентино)
 * 
 * @param {number} amount - сумма
 * @returns {string} - отформатированная сумма (ejemplo: "$ 35.000,00")
 */
function formatMoney(amount) {
    if (!amount && amount !== 0) return '$ 0';
    
    // Форматируем с разделителями тысяч и 2 десятичными знаками
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
    }).format(amount);
}

/**
 * Перевести статус solicitud на испанский
 * 
 * @param {string} estado - статус на английском/испанском
 * @returns {string} - читабельное название статуса
 */
function translateEstado(estado) {
    const estados = {
        'pendiente': 'Pendiente',
        'aceptada': 'Aceptada',
        'en_progreso': 'En Progreso',
        'completada': 'Completada',
        'rechazada': 'Rechazada',
        'cancelada': 'Cancelada'
    };
    
    return estados[estado] || estado;
}

/**
 * Получить CSS класс для badge статуса
 * 
 * @param {string} estado - статус solicitud
 * @returns {string} - CSS класс для badge
 */
function estadoBadgeClass(estado) {
    const classes = {
        'pendiente': 'warning',
        'aceptada': 'info',
        'en_progreso': 'primary',
        'completada': 'success',
        'rechazada': 'danger',
        'cancelada': 'secondary'
    };
    
    return classes[estado] || 'secondary';
}

/**
 * Обрезать длинный текст с добавлением "..."
 * 
 * @param {string} text - текст для обрезки
 * @param {number} maxLength - максимальная длина (по умолчанию 100)
 * @returns {string} - обрезанный текст
 */
function truncate(text, maxLength = 100) {
    if (!text || text.length <= maxLength) return text || '';
    return text.substring(0, maxLength) + '...';
}

/**
 * Получить иконку для типа профессии
 * 
 * @param {string} especialidad - специальность (electricista, plomero, gasista)
 * @returns {string} - emoji иконка
 */
function getEspecialidadIcon(especialidad) {
    const icons = {
        'electricista': '⚡',
        'plomero': '🔧',
        'gasista': '🔥'
    };
    
    return icons[especialidad] || '👷';
}

module.exports = {
    formatDate,
    formatDateTime,
    formatMoney,
    translateEstado,
    estadoBadgeClass,
    truncate,
    getEspecialidadIcon
};
