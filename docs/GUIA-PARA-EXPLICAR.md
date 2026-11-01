# Guía para entender y explicar conecTaco

Esta guía explica el proyecto con palabras sencillas, para poder presentarlo y contestar preguntas.

---

## 1. La idea general

El proyecto tiene **3 partes** que hablan entre sí:

```
FRONTEND (React)  --- JSON --->  BACKEND (Spring Boot)  --- SQL --->  BASE DE DATOS (MySQL)
 lo que ve el usuario  <--- JSON ---  la lógica y las reglas  <--- datos ---  donde se guarda todo
 localhost:5173                       localhost:8080
```

- **React** dibuja las pantallas. No guarda nada por sí mismo.
- **Spring Boot** recibe peticiones, aplica las reglas y habla con MySQL.
- **MySQL** guarda los datos.
- **Node.js** es el programa que nos deja instalar las librerías de React (`npm install`) y correr el frontend (`npm run dev`). El backend no usa Node, usa Java con Spring Boot.

Es lo mismo que hacen en Postman, pero las peticiones las hace React en lugar de una persona.

---

## 2. Ejemplo completo: crear una cuenta

Este recorrido es el mejor para explicar todo el proyecto.

1. **`pages/Registro.jsx`**: el usuario llena el formulario y da clic. React llama a `api.post('/auth/registro', {...})`.
2. **`lib/api.js`**: hace el `fetch`, igual que un POST en Postman, con los datos en JSON.
3. **`controller/AuthController.java`**: recibe el POST en `/v1/auth/registro` y llama al service.
4. **`service/impl/AuthServiceImpl.java`**: revisa los datos, cifra la contraseña y guarda:
   - en `Usuarios` siempre;
   - en `Turistas` (más su mascota) o en `Negocios`, según el tipo.
5. **`repository/UsuarioRepository.java`**: es quien guarda en MySQL con `save()`.
6. La respuesta regresa por el mismo camino como JSON, y React guarda la sesión y cambia de página.

---

## 3. Backend: las capas (igual que en clase)

| Carpeta | Qué hace | Ejemplo |
|---|---|---|
| `controller` | Recibe las peticiones HTTP | `@GetMapping("/lugares")` |
| `service` | Las reglas del negocio | Sumar XP, revisar si ya completó la actividad |
| `repository` | Habla con la base de datos | `findById`, `save`, `delete` |
| `entity` | Una clase por cada tabla | `LugarEntity` es la tabla `Lugar` |
| `dto` | Lo que viaja en el JSON | `LugarDTO` |
| `mapper` | Convierte entity a DTO | `toLugarDTO` |

**¿Por qué existe el DTO si ya existe la entity?** Porque no siempre queremos mandar lo mismo que hay en la tabla. Por ejemplo, `LugarDTO` agrega el nombre de la categoría y si el lugar es favorito, y `UsuarioDTO` nunca regresa la contraseña.

### Cosas del backend que no vimos en clase

| Lo que vas a ver | Qué significa |
|---|---|
| `public record LugarRequest(String nombre, ...)` | Un `record` es una clase corta de Java: solo guarda datos. Java crea sola el constructor y los getters. El getter se llama `request.nombre()`, sin el `get`. |
| `findById(id).orElse(null)` | `findById` puede no encontrar nada. `orElse(null)` significa: "dame el registro o, si no existe, `null`". Por eso después sigue un `if (x == null)`. |
| `@Transactional` | Todo lo del método se guarda junto o no se guarda nada. Si falla a la mitad, se deshace. |
| `throw ApiException.noEncontrado("...")` | Lanza un error con su código HTTP (404) y su mensaje. |
| `exception/ManejadorErrores.java` | Atrapa esos errores y los convierte en `{"error": "mensaje"}`, para que React lo pueda mostrar. |
| `@Query("select ...")` | Una consulta escrita a mano. Se usa cuando el nombre del método no alcanza, como al buscar con varios filtros. |
| `config/CorsConfig.java` | Le da permiso al frontend (puerto 5173) de hablar con el backend (puerto 8080). |

### Archivos que NO hace falta explicar a detalle

- **`util/PasswordUtil.java`**: cifra las contraseñas. Basta con saber que tiene dos funciones: `cifrar()` al registrarse y `coincide()` al iniciar sesión. En la base nunca se guarda la contraseña real.
- **`config/DatosIniciales.java`**: llena la base con lugares y cuentas de ejemplo la primera vez que arranca. Son solo datos de prueba.

### Reglas del juego

- Cada **500 XP** se sube un nivel: `xp / 500 + 1` (`util/Niveles.java`).
- Completar una actividad da XP al turista y a su mascota, y solo se puede hacer una vez.
- Alimentar o jugar da +10 XP solo a la mascota.
- Una recompensa se canjea cuando el turista llega a sus XP.

---

## 4. Frontend: lo que hay que saber de React

Cada pantalla es una **función** que regresa lo que se ve (`pages/...`). Casi todas tienen la misma forma:

```jsx
export default function Actividades() {
  const sesion = obtenerSesion();                // quién inició sesión
  const [misiones, setMisiones] = useState([]);  // 1. los datos de la pantalla

  useEffect(() => {                              // 2. al abrir la página...
    cargar();
  }, []);

  async function cargar() {                      // 3. ...pedimos los datos al backend
    setMisiones(await api.get('/turistas/1/misiones'));
  }

  return (                                       // 4. y los dibujamos
    <div>
      {misiones.map((mision) => (
        <p key={mision.idMision}>{mision.nombre}</p>
      ))}
    </div>
  );
}
```

| Concepto | Qué es |
|---|---|
| **Componente** | Una función que regresa lo que se ve, como `LugarCard` o `Mapa`. Se reutiliza como si fuera una etiqueta: `<LugarCard lugar={lugar} />`. |
| **Props** | Los datos que le pasas a un componente, como parámetros. En `<LugarCard lugar={lugar} />`, `lugar` es una prop. |
| **`useState`** | Una variable que, cuando cambia, hace que la pantalla se vuelva a dibujar. `setMisiones(...)` la cambia. |
| **`useEffect`** | Código que se ejecuta al abrir la página. La lista del final dice cuándo repetirlo: `[]` es solo una vez, `[filtro]` es cada vez que cambie el filtro. |
| **`async` / `await`** | Espera a que el backend conteste antes de seguir. |
| **`.map()`** | Recorre una lista y dibuja algo por cada elemento. Es el `for` de React. |
| **`{condicion && <algo />}`** | Dibuja `<algo />` solo si la condición es verdadera. |
| **`{a ? <x /> : <y />}`** | Un if/else dentro de lo que se dibuja. |
| **`{ ...form, nombre: 'x' }`** | Copia el objeto `form` y cambia solo `nombre`. |
| **JSX** | El HTML dentro de JavaScript. Se usa `className` en lugar de `class`. |

### Archivos importantes del frontend

| Archivo | Qué hace |
|---|---|
| `src/main.jsx` | Arranca React |
| `src/App.jsx` | Dice qué página va en cada URL y protege las páginas privadas |
| `src/lib/api.js` | Funciones `get`, `post`, `put`, `del` para hablar con el backend |
| `src/lib/sesion.js` | Guarda quién inició sesión en el navegador (`localStorage`) |
| `src/components/` | Piezas reutilizables: menú, mapa, gráfica, ventana, aviso, mascota |
| `src/pages/turista/` | Las pantallas del turista |
| `src/pages/negocio/` | Las pantallas del negocio |
| `vite.config.js` | Manda las llamadas de `/v1` al backend |

### Librerías que usamos

| Librería | Para qué |
|---|---|
| `react`, `react-dom` | Las pantallas |
| `react-router-dom` | Cambiar de página sin recargar |
| `leaflet`, `react-leaflet` | El mapa |
| `recharts` | La gráfica de visitas |
| `lucide-react` | Los iconos |
| `vite` | Corre el frontend mientras programamos |

---

## 5. La base de datos

- Son 16 tablas (`database/conectaco_completo.sql`).
- `Usuarios` tiene lo común. `Turistas` y `Negocios` tienen lo de cada tipo, unidos con `fk_id_usuario`.
- `Misiones` son las actividades de un lugar. `Progreso_mision` guarda qué turista ya completó cuál.
- `Visita` se llena cuando un turista abre un lugar, y de ahí salen las estadísticas del negocio.
- `Favorito` son los lugares guardados, y cuentan como "seguidores" del negocio.

---

## 6. Preguntas que les pueden hacer

**¿Cómo se comunica el frontend con el backend?**
Con peticiones HTTP que llevan JSON. Las hace `fetch` en `lib/api.js`.

**¿Dónde se guarda quién inició sesión?**
En `localStorage`, en el navegador. Es sencillo, pero no es seguro para una app real: ahí se usaría Spring Security con tokens.

**¿Cómo se sabe si la contraseña es correcta si está cifrada?**
Se cifra lo que escribió el usuario de la misma forma y se compara con lo guardado. Eso hace `PasswordUtil.coincide()`.

**¿Qué pasa al completar una actividad?**
`TuristaServiceImpl.completarMision()` revisa que exista, que esté activa y que no esté completada; la marca como completada y suma XP al turista y a la mascota. Si con eso sube de nivel, la respuesta lo indica.

**¿Cómo se calculan las estadísticas?**
`NegocioServiceImpl.estadisticas()` cuenta las visitas, actividades y seguidores del periodo, y las compara con el periodo anterior del mismo tamaño para sacar el porcentaje.

**¿Por qué el service y su `Impl`?**
La interfaz dice qué se puede hacer y la clase `Impl` dice cómo. Es la misma estructura del proyecto `store` de clase.

**¿Para qué sirve `@Transactional` al registrar?**
Para que no quede un usuario guardado sin su registro en `Turistas` o `Negocios` si algo falla a la mitad.
