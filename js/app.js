/**
 * FetchJS.guide - JavaScript Application Logic
 * Explaining and Demonstrating JS Fetch API with REST Countries API
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM (manteniendo IDs del template o adaptables)
    const countryInput = document.getElementById('pokemonInput'); // Input de búsqueda
    const btnFetchAsync = document.getElementById('btnFetchAsync');
    const btnFetchPromises = document.getElementById('btnFetchPromises');
    const metricsBar = document.getElementById('metricsBar');
    const metricStatus = document.getElementById('metricStatus');
    const metricTime = document.getElementById('metricTime');
    const metricType = document.getElementById('metricType');
    const metricMode = document.getElementById('metricMode');
    const countryCardDisplay = document.getElementById('pokemonCardDisplay'); // Contenedor de tarjeta
    const jsonOutput = document.getElementById('jsonOutput');
    const codeSnippetContent = document.getElementById('codeSnippetContent');
    const codeTitle = document.getElementById('codeTitle');
    const btnCopyJson = document.getElementById('btnCopyJson');
    const btnCopyCode = document.getElementById('btnCopyCode');

    let lastFetchedJsonString = '';

    // Inicializar Event Listeners
    btnFetchAsync.addEventListener('click', () => fetchCountryAsync(countryInput.value.trim().toLowerCase()));
    btnFetchPromises.addEventListener('click', () => fetchCountryPromises(countryInput.value.trim().toLowerCase()));

    // Búsqueda al presionar Enter
    countryInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            fetchCountryAsync(countryInput.value.trim().toLowerCase());
        }
    });

    // Control de pestañas (Tabs)
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Copiar al portapapeles
    btnCopyJson.addEventListener('click', () => {
        if (!lastFetchedJsonString) return;
        navigator.clipboard.writeText(lastFetchedJsonString).then(() => {
            const originalText = btnCopyJson.textContent;
            btnCopyJson.textContent = '✅ ¡Copiado!';
            setTimeout(() => btnCopyJson.textContent = originalText, 2000);
        });
    });

    btnCopyCode.addEventListener('click', () => {
        const codeText = codeSnippetContent.textContent;
        navigator.clipboard.writeText(codeText).then(() => {
            const originalText = btnCopyCode.textContent;
            btnCopyCode.textContent = '✅ ¡Copiado!';
            setTimeout(() => btnCopyCode.textContent = originalText, 2000);
        });
    });

    /**
     * Opción 1: Fetch usando async / await
     */
    async function fetchCountryAsync(query = 'nicaragua') {
        const targetQuery = query || 'nicaragua';
        const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(targetQuery)}`;

        showLoadingState();
        updateCodeDisplayAsync(targetQuery);

        const startTime = performance.now();

        try {
            // Paso 1: Ejecutar petición HTTP GET
            const response = await fetch(url);
            const endTime = performance.now();
            const latency = Math.round(endTime - startTime);

            // Paso 2: Validar respuesta HTTP
            if (!response.ok) {
                updateMetrics(response.status, `${response.status} ${response.statusText}`, latency, 'async/await', false);
                throw new Error(`País "${targetQuery}" no encontrado (Código HTTP ${response.status})`);
            }

            // Paso 3: Parsear JSON (REST Countries devuelve un array de coincidencias)
            const dataList = await response.json();
            const data = dataList[0];

            // Actualizar métricas
            updateMetrics(response.status, `${response.status} OK`, latency, 'async/await', true);

            // Renderizar resultados
            renderCountryCard(data);
            renderJsonOutput(data);

        } catch (error) {
            renderErrorState(error.message);
            jsonOutput.textContent = `// Error:\n${error.message}`;
        }
    }

    /**
     * Opción 2: Fetch usando Promesas tradicionales (.then / .catch)
     */
    function fetchCountryPromises(query = 'nicaragua') {
        const targetQuery = query || 'nicaragua';
        const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(targetQuery)}`;

        showLoadingState();
        updateCodeDisplayPromises(targetQuery);

        const startTime = performance.now();

        fetch(url)
            .then(response => {
                const endTime = performance.now();
                const latency = Math.round(endTime - startTime);

                if (!response.ok) {
                    updateMetrics(response.status, `${response.status} ${response.statusText}`, latency, '.then() / Promesas', false);
                    throw new Error(`País "${targetQuery}" no encontrado (Código HTTP ${response.status})`);
                }

                updateMetrics(response.status, `${response.status} OK`, latency, '.then() / Promesas', true);
                return response.json();
            })
            .then(dataList => {
                const data = dataList[0];
                renderCountryCard(data);
                renderJsonOutput(data);
            })
            .catch(error => {
                renderErrorState(error.message);
                jsonOutput.textContent = `// Error:\n${error.message}`;
            });
    }

    // Funciones auxiliares de Interfaz

    function showLoadingState() {
        metricsBar.classList.remove('hidden');
        countryCardDisplay.innerHTML = `
            <div class="spinner-container">
                <div class="spinner"></div>
                <p>Realizando petición <code>fetch()</code> a REST Countries...</p>
            </div>
        `;
        jsonOutput.textContent = '// Cargando datos del país...';
    }

    function updateMetrics(status, statusText, latency, mode, isSuccess) {
        metricStatus.textContent = statusText;
        metricStatus.className = isSuccess ? 'badge badge-success' : 'badge badge-danger';
        metricTime.textContent = `${latency} ms`;
        metricType.textContent = 'application/json';
        metricMode.textContent = mode;
    }

    function renderCountryCard(data) {
        const commonName = data.name?.common || 'Desconocido';
        const officialName = data.name?.official || '';
        const flagImg = data.flags?.svg || data.flags?.png || '';
        const coatOfArms = data.coatOfArms?.svg || data.coatOfArms?.png || '';
        const capital = data.capital ? data.capital.join(', ') : 'N/A';
        const region = `${data.region || 'N/A'} (${data.subregion || 'N/A'})`;
        const population = data.population ? data.population.toLocaleString('es-NI') : '0';
        
        // Mapear idiomas
        const languages = data.languages ? Object.values(data.languages).join(', ') : 'N/A';

        // Mapear monedas (código, nombre y símbolo)
        const currencies = data.currencies 
            ? Object.values(data.currencies).map(c => `${c.name} (${c.symbol || ''})`).join(', ')
            : 'N/A';

        // Generar etiquetas de región y continente
        const badgesHtml = `
            <span class="type-tag" style="background:#2563eb33; border: 1px solid #2563eb; color:#2563eb; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">${data.continents ? data.continents[0] : data.region}</span>
            <span class="type-tag" style="background:#05966933; border: 1px solid #059669; color:#059669; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">${data.cca2 || ''} / ${data.cca3 || ''}</span>
        `;

        countryCardDisplay.innerHTML = `
            <div class="pokemon-card" style="display: flex; gap: 1.5rem; align-items: flex-start; padding: 1.25rem;">
                <div class="pokemon-img-box" style="flex: 0 0 160px; text-align: center;">
                    <img src="${flagImg}" alt="Bandera de ${commonName}" style="width: 100%; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); object-fit: cover;">
                    ${coatOfArms ? `<img src="${coatOfArms}" alt="Escudo" style="max-height: 50px; margin-top: 10px; opacity: 0.85;">` : ''}
                </div>
                <div class="pokemon-info" style="flex: 1;">
                    <div class="pokemon-title-row" style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem;">
                        <div>
                            <h3 class="pokemon-name" style="margin: 0; font-size: 1.4rem;">${commonName}</h3>
                            <small style="color: #6b7280;">${officialName}</small>
                        </div>
                        <span class="pokemon-id" style="font-weight: bold; color: #4b5563;">${data.flag || ''}</span>
                    </div>

                    <div class="types-list" style="margin-bottom: 1rem; display: flex; gap: 0.5rem;">
                        ${badgesHtml}
                    </div>

                    <div class="pokemon-stats" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                        <div class="stat-item">
                            <span class="stat-label" style="font-weight: 600; font-size: 0.85rem; color: #6b7280; display: block;">Capital</span>
                            <span class="stat-val" style="font-size: 0.95rem;">${capital}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label" style="font-weight: 600; font-size: 0.85rem; color: #6b7280; display: block;">Población</span>
                            <span class="stat-val" style="font-size: 0.95rem;">${population} hab.</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label" style="font-weight: 600; font-size: 0.85rem; color: #6b7280; display: block;">Región / Subregión</span>
                            <span class="stat-val" style="font-size: 0.95rem;">${region}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label" style="font-weight: 600; font-size: 0.85rem; color: #6b7280; display: block;">Moneda</span>
                            <span class="stat-val" style="font-size: 0.95rem;">${currencies}</span>
                        </div>
                        <div class="stat-item" style="grid-column: 1 / -1;">
                            <span class="stat-label" style="font-weight: 600; font-size: 0.85rem; color: #6b7280; display: block;">Idiomas</span>
                            <span class="stat-val" style="font-size: 0.95rem;">${languages}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderJsonOutput(data) {
        lastFetchedJsonString = JSON.stringify(data, null, 2);
        jsonOutput.textContent = lastFetchedJsonString;
    }

    function renderErrorState(message) {
        countryCardDisplay.innerHTML = `
            <div class="placeholder-state" style="color: #f87171; text-align: center; padding: 2rem;">
                <span class="placeholder-icon" style="font-size: 2rem;">⚠️</span>
                <h3>Error en la Petición Fetch</h3>
                <p>${message}</p>
            </div>
        `;
    }

    function updateCodeDisplayAsync(query) {
        codeTitle.textContent = 'Código JavaScript (async / await)';
        codeSnippetContent.textContent =
`// Petición HTTP a REST Countries usando async / await
async function obtenerPais() {
  const url = 'https://restcountries.com/v3.1/name/${query}';

  try {
    // 1. Iniciar la petición fetch
    const respuesta = await fetch(url);

    // 2. Verificar estado HTTP (200 OK)
    if (!respuesta.ok) {
      throw new Error(\`Error HTTP: \${respuesta.status}\`);
    }

    // 3. Convertir cuerpo de la respuesta a JSON (devuelve un array)
    const [pais] = await respuesta.json();
    
    console.log('Datos de ${query}:', pais);
    return pais;
  } catch (error) {
    console.error('Error al realizar fetch:', error);
  }
}

obtenerPais();`;
    }

    function updateCodeDisplayPromises(query) {
        codeTitle.textContent = 'Código JavaScript (Promesas .then / .catch)';
        codeSnippetContent.textContent =
`// Petición HTTP a REST Countries usando Promesas (.then / .catch)
function obtenerPaisConPromesas() {
  const url = 'https://restcountries.com/v3.1/name/${query}';

  fetch(url)
    .then(respuesta => {
      // 1. Verificar estado HTTP
      if (!respuesta.ok) {
        throw new Error(\`Error HTTP: \${respuesta.status}\`);
      }
      // 2. Retornar la promesa de transformación a JSON
      return respuesta.json();
    })
    .then(dataList => {
      const pais = dataList[0];
      console.log('Datos de ${query}:', pais);
    })
    .catch(error => {
      console.error('Error al realizar fetch:', error);
    });
}

obtenerPaisConPromesas();`;
    }

    // Carga inicial automática con un país por defecto
    fetchCountryAsync('nicaragua');
});