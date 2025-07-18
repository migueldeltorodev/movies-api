# Documentación del Proyecto: API de Películas (.NET 7)

Este documento proporciona una guía completa para entender, configurar y ejecutar este proyecto de API RESTful. La API está construida con .NET 7, sigue los principios de la arquitectura limpia y utiliza Minimal APIs para la definición de endpoints.

## 1. Puesta en Marcha (Setup)

Sigue estos pasos para configurar tu entorno de desarrollo local.

### Prerrequisitos

- [.NET 7 SDK o superior](https://dotnet.microsoft.com/en-us/download/dotnet/7.0)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Paso 1: Iniciar la Base de Datos con Docker

La base de datos PostgreSQL se gestiona a través de Docker Compose.

1.  Abre una terminal en la raíz del proyecto (`rest-api-course-final-master`).
2.  Ejecuta el siguiente comando para iniciar el contenedor de la base de datos en segundo plano:

    ```bash
    docker-compose up -d
    ```

Esto levantará un servidor PostgreSQL accesible en `localhost:5432`. Las credenciales y el nombre de la base de datos están definidos en el archivo `compose.yaml`:

- **Usuario:** `migueldeltorodev`
- **Contraseña:** `migueldeltorodev`
- **Base de Datos:** `movies`

### Paso 2: Configurar los Secretos de la Aplicación

La aplicación necesita secretos (user-secrets) para la conexión a la base de datos y la configuración de JWT. La forma recomendada de gestionarlos localmente es a través de "User Secrets".

1.  Navega al directorio del proyecto de la API:

    ```bash
    cd "1.GettingStarted\Movies.Api"
    ```

2.  Inicializa los User Secrets para el proyecto:

    ```bash
    dotnet user-secrets init
    ```

3.  Añade los siguientes secretos:

    ```bash
    dotnet user-secrets set "Database:ConnectionString" "Server=localhost;Port=5432;Database=movies;User Id=migueldeltorodev;Password=migueldeltorodev;"
    dotnet user-secrets set "Jwt:Key" "unaClaveSecretaSuperLargaYComplejaParaJwt"
    dotnet user-secrets set "Jwt:Issuer" "https://localhost:5001"
    dotnet user-secrets set "Jwt:Audience" "https://localhost:5001"
    dotnet user-secrets set "ApiKey" "unaApiKeySuperSecretaParaUsuariosAdmin"
    ```

    **Nota:** Puedes cambiar los valores de `Jwt:Key` y `ApiKey` por los que prefieras.

### Paso 3: Ejecutar la Aplicación

Una vez configurada la base de datos y los secretos, ya puedes ejecutar la API.

1.  Asegúrate de estar en el directorio `1.GettingStarted\Movies.Api`.
2.  Ejecuta la aplicación:
    `bash
dotnet run
`
    La primera vez que se ejecute, el `DbInitializer` creará automáticamente el esquema de la base de datos y la llenará con datos de ejemplo.
3.  Ejecuta la aplicación de Identity para crear un token de JWT Bearer el cual será utilizado para autenticarte y poder usar los endpoints.

La API estará disponible en la URL que indique la consola (generalmente `https://localhost:5001` o similar).

## 2. Arquitectura del Proyecto

El proyecto está organizado siguiendo una arquitectura limpia para separar responsabilidades.

- **`RestApiCourse.sln`**: El archivo de solución que agrupa todos los proyectos.

- **`Movies.Api`**: El proyecto principal y punto de entrada.

  - **Responsabilidades**: Define los endpoints (Minimal APIs), configura el pipeline de peticiones HTTP (autenticación, CORS, etc.), gestiona la inyección de dependencias y aloja la configuración de Swagger. No contiene lógica de negocio.

- **`Movies.Application`**: La capa de lógica de negocio.

  - **Responsabilidades**: Contiene los servicios (`MovieService`, `RatingService`) que orquestan la lógica de negocio. Define las interfaces de los repositorios (`IMovieRepository`) y los modelos de dominio. Es el corazón de la aplicación.

- **`Movies.Contracts`**: La capa de contratos de datos (DTOs).

  - **Responsabilidades**: Define los objetos de transferencia de datos (Data Transfer Objects) que se usan para las peticiones (`Requests`) y respuestas (`Responses`) de la API. Esto desacopla los modelos internos de la aplicación de la interfaz pública de la API.

- **`Helpers/Identity.Api`**: Un proyecto de utilidad.

  - **Responsabilidades**: Es una API mínima e independiente cuya única función es generar tokens JWT para facilitar las pruebas de los endpoints protegidos.

- **`Movies.Api.Sdk` y `Movies.Api.Sdk.Consumer`**: Proyectos de ejemplo.
  - **Responsabilidades**: Demuestran cómo se podría construir y consumir un SDK de cliente para esta API.

## 3. Documentación de la API (Endpoints)

La forma más sencilla de explorar la API es a través de la interfaz de Swagger. Una vez que la aplicación esté en ejecución, navega a:

**`https://localhost:5001/swagger`**

Ahí encontrarás una lista interactiva de todos los endpoints, sus parámetros, y podrás ejecutarlos directamente desde el navegador.

### Resumen de Endpoints

#### Películas (`/api/movies`)

- `GET /api/movies`: Obtiene una lista paginada de películas. (Público)
- `GET /api/movies/{idOrSlug}`: Obtiene una película por su ID o slug. (Público)
- `POST /api/movies`: Crea una nueva película. (Requiere autorización `TrustedMember`)
- `PUT /api/movies/{id}`: Actualiza una película existente. (Requiere autorización `Admin`)
- `DELETE /api/movies/{id}`: Elimina una película. (Requiere autorización `Admin`)

#### Calificaciones (`/api/movies/{id}/ratings`)

- `POST /api/movies/{id}/ratings`: Añade una calificación a una película. (Requiere autorización `TrustedMember`)
- `DELETE /api/movies/{id}/ratings`: Elimina la calificación de un usuario para una película. (Requiere autorización `TrustedMember`)

#### Calificaciones de Usuario (`/api/ratings`)

- `GET /api/ratings/me`: Obtiene todas las calificaciones del usuario autenticado. (Requiere autorización `TrustedMember`)

## 4. Autenticación y Autorización

### Obtener un Token de Acceso

Para probar los endpoints protegidos, necesitas un token JWT.

1.  Ejecuta el proyecto `Identity.Api` (puedes hacerlo desde tu IDE o con `dotnet run` en su directorio `Helpers/Identity.Api`).
2.  Envía una petición `POST` a `https://localhost:7148/token` (verifica el puerto en la consola) con el siguiente cuerpo:
    ```json
    {
      "userId": "d8566459-5958-45ff-b7d4-9486514a2897",
      "email": "test@test.com",
      "customClaims": {
        "trusted_member": "true"
      }
    }
    ```
3.  La respuesta contendrá un `accessToken`.

### Usar el Token

Para realizar una petición a un endpoint protegido, añade la siguiente cabecera:

`Authorization: Bearer <tu_access_token>`

### Políticas de Autorización

- **Público**: No se requiere token.
- **`TrustedMember`**: Requiere un token JWT válido con el claim `"trusted_member": "true"`.
- **`Admin`**: Requiere una cabecera de API Key: `x-api-key: <tu_api_key_secreta>`. El valor de la clave es el que configuraste en los User Secrets.
