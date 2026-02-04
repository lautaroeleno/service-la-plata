// Listados de configuración para la lógica de búsqueda
const ubicacionesConocidas = ['la plata', 'berisso', 'ensenada', 'los hornos', 'city bell', 'villa elisa', 'villa elvira', 'tolosa'];
const marcasConocidas = ['orbis', 'volcan', 'rheem', 'saiar', 'longvie', 'escorial', 'universal', 'eskabe', 'señorial'];

// Función auxiliar para capitalizar strings (maneja palabras compuestas como "La Plata")
const capitalizarTexto = (str) => {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

// Al final de toda la inyección de textos...
if (window.location.hash === '#seccion-marcas') {
    const elemento = document.getElementById('seccion-marcas');
    if (elemento) {
        // Esperamos un brevísimo instante para que el DOM se asiente
        setTimeout(() => {
            elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
}

fetch('https://ipwho.is/')
    .then(response => response.json())
    .then(data => {
        // 1. Lógica de Búsqueda (URL)
        const urlParams = new URLSearchParams(window.location.search);
        // Captura 'q' o 'utm_term' y lo limpia
        const queryRaw = (urlParams.get('q') || urlParams.get('utm_term') || "").toLowerCase();
        
        // --- LÓGICA DE UBICACIÓN ---
        let city = "";
        const ubicacionEncontrada = ubicacionesConocidas.find(u => queryRaw.includes(u));
        
        if (ubicacionEncontrada) {
            // Si el usuario buscó una ciudad específica en la URL
            city = capitalizarTexto(ubicacionEncontrada);
        } else {
            // Si no hay búsqueda, usamos la de la API o "La Plata" como último recurso
            city = data.city ? capitalizarTexto(data.city) : "La Plata";
        }

        // --- LÓGICA DE EQUIPO (Singular y Plural) ---
        let productoSingular = ""; 
        let productoPlural = "";

        if (queryRaw.includes('calefon')) {
            productoSingular = "calefón";
            productoPlural = "Calefones";
        } else if (queryRaw.includes('termotanque')) {
            productoSingular = "termotanque";
            productoPlural = "Termotanques";
        } else if (queryRaw.includes('estufa')) {
            productoSingular = "estufa";
            productoPlural = "Estufas";
        }

        // --- LÓGICA DE MARCA ---
        let marcaDetectada = "";
        const marcaEncontrada = marcasConocidas.find(m => queryRaw.includes(m));
        if (marcaEncontrada) {
            marcaDetectada = capitalizarTexto(marcaEncontrada);
        }

        // --- INYECCIÓN EN EL HTML ---

        // 1. Cartel de Cobertura (.ciudad)
        document.querySelectorAll('.ciudad').forEach(el => {
            el.innerHTML = `Cubrimos <span class="font-bold text-green-600">${city}</span> y Alrededores`;
        });

        // 2. Intención (.busqueda) - SIEMPRE SINGULAR
        document.querySelectorAll('.busqueda').forEach(el => {
            if (productoSingular) {
                el.innerHTML = `Reparamos tu <span class="font-bold text-green-600">${productoSingular}</span>`;
            } else {
                el.innerHTML = `Reparamos tu <span class="font-bold text-green-600">equipo</span>`;
            }
        });

        // 3. Título Dinámico (.titulo-dinamico) - SIEMPRE PLURAL
        document.querySelectorAll('.titulo-dinamico').forEach(el => {
            if (productoPlural) {
                el.innerHTML = `Service de <span class="font-bold text-green-600">${productoPlural}</span>`;
            } else {
                el.innerText = "Service La Plata";
            }
        });

        // 4. Sección de Marcas (.seccion-marca)
        // --- LÓGICA DE MARCA Y PÁRRAFOS ---

        // A. Primero actualizamos el Título Principal (H1)
        document.querySelectorAll('.seccion-marca').forEach(el => {
            if (marcaDetectada) {
                el.innerHTML = `Especialistas en equipos <span class="font-bold text-green-600">${marcaDetectada}</span>`;
            } else {
                el.innerHTML = `Especialistas en <span class="font-bold text-green-600">calefones y termotanques</span>`;
            }
        });

        // B. Luego actualizamos todos los [marca] que pusimos en los párrafos
        const spansMarca = document.querySelectorAll('.nombre-marca');

    spansMarca.forEach((el, index) => {
        if (marcaDetectada) {
            el.innerHTML = `<span class="font-semibold">${marcaDetectada}</span>`;
        } else {
            if (index === 0) {
                el.innerText = "multimarca";
            } else {
                el.innerText = "de agua"; 
            }
        }
    });

    })
    .catch(error => {
        console.error("Error en la carga dinámica:", error);
        // Fallback preventivo
        const fallbackCity = "La Plata";
        document.querySelectorAll('.ciudad').forEach(el => {
            el.innerHTML = `Cubrimos <span class="font-bold text-green-600">${fallbackCity}</span> y Alrededores`;
        });
        document.querySelectorAll('.titulo-dinamico').forEach(el => el.innerText = "Service La Plata");
    });