# FetchJS.guide - Guía Interactiva con REST Countries API

Una aplicación web educativa e interactiva diseñada para aprender y experimentar con la función nativa `fetch()` de JavaScript, comparando flujos de trabajo con `async/await` versus promesas clásicas (`.then()` / `.catch()`) consumiendo la API pública [REST Countries](https://restcountries.com/).

---

## 🚀 Características

- **Laboratorio Interactivo:** Consulta países en tiempo real y visualiza los datos renderizados directamente en una tarjeta de interfaz.
- **Comparación de Paradigmas:**
  - Sintaxis moderna con `async/await` y bloques `try...catch`.
  - Manejo tradicional mediante encadenamiento de Promesas (`.then()`, `.catch()`).
- **Métricas en Vivo:** Inspección de latencia en milisegundos ($ms$), código de estado HTTP y encabezado `Content-Type`.
- **Explorador JSON:** Inspección de la carga útil (*payload*) original en formato JSON crudo con botón de copia rápida al portapapeles.
- **Snippet Dinámico:** Muestra el código JavaScript exacto que se ejecuta tras cada consulta.
- **Sin Dependencias:** Construido exclusivamente con HTML5, CSS3 y Vanilla JavaScript.

---

## 📁 Estructura del Proyecto

```text
├── index.html       # Estructura del laboratorio, pestañas y secciones didácticas
├── css/
│   └── styles.css   # Estilos de interfaz, tarjetas y bloques de código
├── js/
│   └── app.js       # Lógica de consumo de la API, métricas y renderizado DOM
└── README.md        # Documentación del proyecto
```

---

## 🌐 API Consumida

- **Proveedor:** [REST Countries v3.1](https://restcountries.com/)
- **Endpoint principal:**
  ```http
  GET https://restcountries.com/v3.1/name/{country_name}
  ```
- **Autenticación:** Ninguna (*No-Auth / Public API*).
- **CORS:** Habilitado para navegación web abierta (`Access-Control-Allow-Origin: *`).

---

## 💻 Ejemplos de Implementación

### 1. Enfoque Moderno (`async / await`)

```javascript
async function obtenerPais(nombre) {
  const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(nombre)}`;

  try {
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    // La API devuelve un array de coincidencias
    const [pais] = await respuesta.json();
    return pais;
  } catch (error) {
    console.error('Fallo en la petición:', error.message);
  }
}
```

### 2. Enfoque con Promesas (`.then / .catch`)

```javascript
function obtenerPaisConPromesas(nombre) {
  const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(nombre)}`;

  fetch(url)
    .then(respuesta => {
      if (!respuesta.ok) {
        throw new Error(`Error HTTP: ${respuesta.status}`);
      }
      return respuesta.json();
    })
    .then(dataList => {
      const pais = dataList[0];
      console.log('Datos obtenidos:', pais);
    })
    .catch(error => {
      console.error('Fallo en la petición:', error.message);
    });
}
```

---

## 🛠️ Instalación y Uso Local

1. Clona o descarga los archivos en tu equipo:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd <NOMBRE_DEL_DIRECTORIO>
   ```

2. Abre `index.html` en cualquier navegador moderno:
   - Puedes abrirlo directamente con doble clic.
   - O servirlo mediante una extensión local como **Live Server** en VS Code o usando Python:
     ```bash
     # Python 3
     python -m http.server 8000
     ```

3. Ingresa cualquier país en la barra de búsqueda (por ejemplo: `nicaragua`, `japan`, `spain`, `canada`) y haz clic en **Ejecutar**.

---

## 📌 Puntos Clave Aprendidos

1. **`fetch()` no falla ante errores 404 o 500:** La promesa únicamente se rechaza si hay un fallo de conexión a nivel de red (DNS, sin internet). Siempre se debe validar `response.ok`.
2. **Doble resolución de promesas:** La primera promesa resuelve los encabezados y metadatos (`fetch()`), mientras que la segunda resuelve la lectura completa del cuerpo en bytes hacia JSON (`response.json()`).
3. **Estructura devuelta por REST Countries:** Las búsquedas por nombre devuelven un arreglo con los países que coinciden con el término de búsqueda, requiriendo indexación o desestructuración (`[pais]`).