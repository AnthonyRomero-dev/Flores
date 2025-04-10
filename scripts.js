// Función para ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Configuración de la galería
    const galleryConfig = {
        // Rutas de imágenes (actualiza estas rutas a tus propias imágenes)
        images: [
            'https://picsum.photos/id/1/800/600',
            'https://picsum.photos/id/10/800/600',
            'https://picsum.photos/id/100/800/600',
            'https://picsum.photos/id/1000/800/600',
            'https://picsum.photos/id/1001/800/600',
            'https://picsum.photos/id/1002/800/600',
            'https://picsum.photos/id/1003/800/600',
            'https://picsum.photos/id/1004/800/600',
            'https://picsum.photos/id/1005/800/600'
        ],
        // Tiempo máximo de carga (ms)
        loadTimeout: 10000
    };
    
    // Elementos del DOM
    const gallery = document.getElementById('gallery');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.getElementById('closeModal');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const galleryLoading = document.getElementById('gallery-loading');
    const modalLoading = document.getElementById('modal-loading');
    const modalError = document.getElementById('modal-error');
    
    // Estado actual
    let currentIndex = 0;
    
    // Inicializar la galería
    initGallery();
    
    // Función para inicializar la galería
    function initGallery() {
        // Mostrar indicador de carga
        galleryLoading.style.display = 'block';
        
        // Limpiar la galería antes de agregar nuevos elementos
        while (gallery.firstChild) {
            gallery.removeChild(gallery.firstChild);
        }
        
        // Crear elementos de la galería
        galleryConfig.images.forEach((src, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.dataset.index = index;
            
            const img = document.createElement('img');
            img.className = 'gallery-img';
            img.alt = `Imagen ${index + 1}`;
            img.dataset.src = src; // Guardar la URL para carga diferida
            
            // Mostrar imagen en miniatura con carga diferida
            const tempImg = new Image();
            const loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'loading';
            loadingIndicator.style.display = 'block';
            
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'Error al cargar';
            
            item.appendChild(loadingIndicator);
            item.appendChild(errorMessage);
            
            // Configurar tiempo límite para la carga
            const timeout = setTimeout(() => {
                if (!tempImg.complete) {
                    tempImg.src = ''; // Abortar carga
                    loadingIndicator.style.display = 'none';
                    errorMessage.style.display = 'block';
                }
            }, galleryConfig.loadTimeout);
            
            tempImg.onload = function() {
                clearTimeout(timeout);
                loadingIndicator.style.display = 'none';
                img.src = src;
                item.appendChild(img);
            };
            
            tempImg.onerror = function() {
                clearTimeout(timeout);
                loadingIndicator.style.display = 'none';
                errorMessage.style.display = 'block';
            };
            
            tempImg.src = src;
            
            // Evento de clic para abrir el modal
            item.addEventListener('click', function() {
                openModal(index);
            });
            
            gallery.appendChild(item);
        });
        
        galleryLoading.style.display = 'none';
    }
    
    // Función para abrir el modal
    function openModal(index) {
        currentIndex = index;
        modalImg.src = '';
        modalLoading.style.display = 'block';
        modalError.style.display = 'none';
        modal.classList.add('active');
        
        // Cargar la imagen
        const img = new Image();
        
        // Configurar tiempo límite para la carga
        const timeout = setTimeout(() => {
            if (!img.complete) {
                img.src = ''; // Abortar carga
                modalLoading.style.display = 'none';
                modalError.style.display = 'block';
            }
        }, galleryConfig.loadTimeout);
        
        img.onload = function() {
            clearTimeout(timeout);
            modalLoading.style.display = 'none';
            modalImg.src = galleryConfig.images[currentIndex];
            modalImg.style.display = 'block';
        };
        
        img.onerror = function() {
            clearTimeout(timeout);
            modalLoading.style.display = 'none';
            modalError.style.display = 'block';
            modalImg.style.display = 'none';
        };
        
        img.src = galleryConfig.images[currentIndex];
        
        // Deshabilitar desplazamiento en el fondo
        document.body.style.overflow = 'hidden';
    }
    
    // Función para cerrar el modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    // Función para ir a la imagen anterior
    function prevImage() {
        currentIndex = (currentIndex - 1 + galleryConfig.images.length) % galleryConfig.images.length;
        openModal(currentIndex);
    }
    
    // Función para ir a la siguiente imagen
    function nextImage() {
        currentIndex = (currentIndex + 1) % galleryConfig.images.length;
        openModal(currentIndex);
    }
    
    // Eventos
    closeBtn.addEventListener('click', closeModal);
    prevBtn.addEventListener('click', prevImage);
    nextBtn.addEventListener('click', nextImage);
    
    // Cerrar modal al hacer clic fuera de la imagen
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Soporte para teclas (ESC para cerrar, flechas para navegar)
    document.addEventListener('keydown', function(e) {
        if (!modal.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    });
    
    // Función para manejar la redimensión de la ventana
    window.addEventListener('resize', function() {
        if (modal.classList.contains('active')) {
            // Ajustar el tamaño del modal si es necesario
            const modalContent = document.querySelector('.modal-content');
            modalContent.style.maxHeight = window.innerHeight * 0.9 + 'px';
        }
    });
    
    // Detectar si hay problemas de conexión
    window.addEventListener('offline', function() {
        alert('Se ha perdido la conexión. Es posible que algunas imágenes no se carguen correctamente.');
    });
});
