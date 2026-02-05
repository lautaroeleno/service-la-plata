// Listados de configuración
const ubicacionesConocidas = ['la plata', 'berisso', 'ensenada', 'los hornos', 'city bell', 'villa elisa', 'villa elvira', 'tolosa'];
const marcasConocidas = ['orbis', 'volcan', 'rheem', 'saiar', 'longvie', 'escorial', 'universal', 'eskabe', 'señorial'];

const capitalizarTexto = (str) => {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

fetch('https://ipwho.is/')
    .then(response => response.json())
    .then(data => {
        const urlParams = new URLSearchParams(window.location.search);
        const queryRaw = (urlParams.get('q') || urlParams.get('utm_term') || "").toLowerCase();

        // 1. --- LÓGICA DE UBICACIÓN ---
        let city = "";
        const ubicacionEncontrada = ubicacionesConocidas.find(u => queryRaw.includes(u));
        city = ubicacionEncontrada ? capitalizarTexto(ubicacionEncontrada) : (data.city ? capitalizarTexto(data.city) : "La Plata");

        // 2. --- LÓGICA DE PALABRAS CLAVE (KEYWORD) ---
        let textoKeyword = "Service de Calefones y Termotanques"; // Default
        if (queryRaw.includes('reparacion') || queryRaw.includes('reparación')) {
            textoKeyword = "Reparación de Calefones y Termotanques";
        } else if (queryRaw.includes('técnico') || queryRaw.includes('tecnico') || queryRaw.includes('servicio técnico')) {
            textoKeyword = "Técnicos en Calefones y Termotanques";
        } else if (queryRaw.includes('service')) {
            textoKeyword = "Service de Calefones y Termotanques";
        }

        // 3. --- LÓGICA DE MARCA ---
        let marca = "";
        let marcaDetectada = false;
        const marcaEncontrada = marcasConocidas.find(m => queryRaw.includes(m));
        
        if (marcaEncontrada) {
            marca = capitalizarTexto(marcaEncontrada);
            marcaDetectada = true;
        }

        // 4. --- LÓGICA DE TIPO DE EQUIPO (Singular/Plural) ---
        let equipo_sing = "equipo";
        let equipo_plu = "equipos";
        let equipoDetectado = false;

        if (queryRaw.includes('calefon')) {
            equipo_sing = "calefón";
            equipo_plu = "calefones";
            equipoDetectado = true;
        } else if (queryRaw.includes('termotanque')) {
            equipo_sing = "termotanque";
            equipo_plu = "termotanques";
            equipoDetectado = true;
        }

        // --- INYECCIÓN EN EL HTML ---

        // Inyectar Ciudad
        document.querySelectorAll('.ciudad').forEach(el => {
            el.innerHTML = `Cubrimos <span class="font-bold text-green-600">${city}</span> y Alrededores`;
        });
        // Inyectar Ciudad solo como palabra
        document.querySelectorAll('.ciudad-palabra').forEach(el => {
            el.innerHTML = `<span class="font-bold text-green-600">${city}</span>`;
        });

        // Inyectar Keyword (Service, Técnico, etc.)
        document.querySelectorAll('.keyword-text').forEach(el => {
            el.innerText = textoKeyword;
        });

        // Inyectar solo el nombre de la marca específica (si se detectó)
        document.querySelectorAll('.marca').forEach(el => {
            if (marcaDetectada) {
                el.innerHTML = `${marca}`;
                el.style.display = "inline-block";
            } else {
                el.style.display = "none";
            }
        });

        // Inyectar Marcas con condicional "Nos destacamos en..."
        document.querySelectorAll('.contenedor-marca').forEach(el => {
            if (marcaDetectada || equipoDetectado) {
                el.innerHTML = `Nos destacamos en ${equipo_plu} <span class="font-bold text-green-600">${marca}</span>`;
                el.style.display = "block"; 
            } else {
                el.innerHTML = "";
                el.style.display = "none";
            }
        });

        // Inyectar Singular y Plural de Equipos
        document.querySelectorAll('.equipo-singular').forEach(el => {
            el.innerText = equipo_sing;
        });
        document.querySelectorAll('.equipo-plural').forEach(el => {
            el.innerText = equipo_plu;
        });

        // Título dinámico basado en equipo detectado
        document.querySelectorAll('.titulo-dinamico').forEach(el => {
            if (equipoDetectado) {
                el.innerHTML = `Service de <span class="font-bold text-green-600">${capitalizarTexto(equipo_plu)}</span>`;
            } else {
                el.innerHTML = `Service La Plata`;
            }
        });

    })
    .catch(error => {
        console.error("Error:", error);
    });