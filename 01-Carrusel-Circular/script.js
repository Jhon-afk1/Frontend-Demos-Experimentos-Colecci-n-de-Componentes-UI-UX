document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================
    // 1. DEFINICIÓN DE TEMAS Y ESTRUCTURA DE DATOS
    // ==========================================================

    const themes = [
        { 
            id: 'elegant', 
            name: 'Elejante', 
            icon: '🍎', 
            description: 'Tema Formal: Diseño limpio, tipografía nítida y foco en la jerarquía visual. Perfecto para destacar la eficiencia y el detalle.',
            className: 'theme-elegant',
            imageURL: 'assets/img/elegant.jpg' 
        },
        { 
            id: 'minimalist', 
            name: 'Minimalista', 
            icon: '⚪', 
            description: 'Tema Minimalista: Amplio espacio en blanco, tipografía elegante y contraste alto. Prioriza la claridad y la usabilidad sencilla.',
            className: 'theme-minimalist',
            imageURL: 'assets/img/minimalist.jpg'
        },
        { 
            id: 'carnival', 
            name: 'Carnaval', 
            icon: '🎭', 
            description: 'Tema Carnaval: Fondo oscuro con tonos neón. Demuestra creatividad, audacia y la habilidad para manejar diseños complejos.',
            className: 'theme-carnival',
            imageURL: 'assets/img/carnaval.png' 
        },
        { 
            id: 'frutigeraero', 
            name: 'Frutiger Aero', 
            icon: '💧', 
            description: 'Tema Frutiger Aero: Estética de inicios de los 2000, con elementos de cristal, brillo y texturas de agua/cielo. Enfoque en diseño nostálgico.',
            className: 'theme-frutigeraero',
            imageURL: 'assets/img/frutigeraero.png' 
        },
        { 
            id: 'dreamcore', 
            name: 'Dream Core', 
            icon: '☁️', 
            description: 'Tema Dream Core (Synthwave): Tonalidades Púrpura/Neón. Experiencia inmersiva y audaz con efectos de resplandor.',
            className: 'theme-dreamcore',
            imageURL: 'assets/img/dreamcore.jpg' 
        },
    ];

    let currentThemeIndex = 0;
    const themeCarousel = document.getElementById('theme-carousel');
    const themeDescription = document.getElementById('current-theme-description'); 
    const totalItems = themes.length;
    
    // ==========================================================
    // 2. LÓGICA DEL CARRUSEL CIRCULAR 360°
    // ==========================================================

    /**
     * Aplica la clase de tema al <body> y actualiza la descripción.
     */
    function changeTheme(themeData) {
        document.body.className = document.body.className.split(' ').filter(c => !c.startsWith('theme-') && c !== 'dreamcore-active').join(' '); 
        document.body.classList.add(themeData.className); 
        if (themeData.id === 'dreamcore') {
            document.body.classList.add('dreamcore-active');
        }
        themeDescription.textContent = themeData.description;
    }

    // --- 2.1 Lógica de Rotación Circular (updateCarousel) ---
    /**
     * Calcula la posición (x, y) de cada ítem en un círculo de 360 grados.
     */
    function updateCarousel() {
        const items = Array.from(document.querySelectorAll('.carousel-item'));
        const total = items.length;
        const radius = 180; // Radio del círculo
        const angleStep = (2 * Math.PI) / total;

        let activeThemeData = themes[currentThemeIndex];
        let newActiveIndex = currentThemeIndex;

        items.forEach((item, index) => {
            // Calcular el ángulo, ajustando para que el ítem activo (currentThemeIndex)
            // esté centrado en la parte inferior (Math.PI / 2 o 90 grados).
            let angle = ((index - currentThemeIndex) * angleStep) + (Math.PI / 2);

            // Posición circular (y es el eje vertical)
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius; 

            item.style.left = `calc(50% + ${x}px)`;
            item.style.top = `calc(50% + ${y}px)`;

            // Escala y Opacidad: basado en la posición Y (más abajo = más al frente)
            // Fórmula de escala: 0.8 (base) + 0.4 * (0 a 1, donde 1 es el punto más bajo)
            const scaleFactor = 0.8 + 0.4 * (1 + y / radius); 
            // Fórmula de opacidad: 0.5 (base) + 0.5 * (0 a 1)
            const opacityFactor = 0.5 + 0.5 * (1 + y / radius); 
            
            item.style.transform = `translate(-50%, -50%) scale(${scaleFactor})`;
            item.style.opacity = opacityFactor;
            // Z-Index: mayor Y (más abajo) significa más al frente
            item.style.zIndex = Math.round(opacityFactor * 10); 

            // Determinar si es el ítem activo (el que está más cerca de la posición y = radius)
            // Umbral de detección para el centro inferior
            if (Math.abs(y - radius) < 10 && Math.abs(x) < 30) {
                item.classList.add('active');
                activeThemeData = themes[index]; // Actualizar los datos del tema activo
                newActiveIndex = index;
            } else {
                item.classList.remove('active');
            }
        });
        
        // Aseguramos que el índice activo refleje la realidad después de la rotación
        currentThemeIndex = newActiveIndex;

        // Aplicar el tema del item activo (el que está en la parte inferior)
        changeTheme(activeThemeData);
    }


    // --- 2.2 Inicialización del Carrusel (initializeCarousel) ---
    function initializeCarousel() {
        themeCarousel.innerHTML = ''; 

        themes.forEach((theme, index) => {
            const item = document.createElement('div');
            item.className = `carousel-item`; 
            item.dataset.themeId = theme.id;
            item.classList.add(theme.id);
            
            if (theme.imageURL) {
                item.style.backgroundImage = `url(${theme.imageURL})`;
            }
            item.innerHTML = `<span class="carousel-item-icon">${theme.icon}</span>`; 
            
            item.addEventListener('click', () => {
                currentThemeIndex = index; // Si se hace clic, se convierte en el nuevo índice central
                updateCarousel();
            });

            themeCarousel.appendChild(item);
        });

        // Inicializar la vista
        setTimeout(() => {
            updateCarousel(); 
        }, 50);
    }


    // --- 2.3 Botones de navegación ---
    
    // Flecha DERECHA (Siguiente - Rotación Horaria)
    document.getElementById('next-btn').addEventListener('click', () => {
        // Al rotar en sentido horario, el índice incrementa
        currentThemeIndex = (currentThemeIndex + 1) % totalItems;
        updateCarousel();
    });

    // Flecha IZQUIERDA (Anterior - Rotación Anti-horaria)
    document.getElementById('prev-btn').addEventListener('click', () => {
        // Al rotar en sentido anti-horario, el índice disminuye
        currentThemeIndex = (currentThemeIndex - 1 + totalItems) % totalItems;
        updateCarousel();
    });
    
    // ==========================================================
    // 3. EFECTO DE ROTACIÓN DE PALABRAS (MANTENER)
    // ==========================================================
    const rotatingWordElement = document.getElementById('rotating-word');
    const words = ['🛠️ Funcionales', '♻️ Sostenibles', "🎯 Prácticas", "🚀 Eficientes"]; 
    let wordIndex = 0; 
    
    function rotateWord() {
        rotatingWordElement.classList.add('fade-out');
        
        setTimeout(() => {
            rotatingWordElement.textContent = words[wordIndex];
            wordIndex = (wordIndex + 1) % words.length; 
            rotatingWordElement.classList.remove('fade-out');
        }, 200); 
    }

    setInterval(rotateWord, 2000); 

    // ¡Llamada de inicio!
    initializeCarousel();
});