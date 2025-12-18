/* Placeholder para JavaScript del cliente */
console.log('ManosSeguras - App loaded');

// Auto-cerrar alerts después de 5 segundos (excepto errores)
document.addEventListener('DOMContentLoaded', function() {
    const alerts = document.querySelectorAll('.alert:not(.alert-error)');
    alerts.forEach(function(alert) {
        setTimeout(function() {
            alert.style.opacity = '0';
            setTimeout(function() {
                alert.style.display = 'none';
            }, 300);
        }, 5000);
    });
});
