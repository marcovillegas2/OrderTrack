# OrderTrack

Sistema web de gestión de pedidos y catálogo para emprendimientos gastronómicos.

---

# Tecnologías utilizadas

* FastAPI
* SQLite
* HTML
* CSS
* JavaScript
* Pytest
* SonarQube

---

# Requisitos previos

Antes de ejecutar el proyecto, instalar:

## 1. Python 3.10+

Descargar desde:

https://www.python.org/downloads/

⚠️ IMPORTANTE:
Durante la instalación marcar:

```text
Add Python to PATH
```

---

## 2. Git

Descargar desde:

https://git-scm.com/download/win

---

## 3. PyCharm Community Edition (Recomendado)

Descargar desde:

https://www.jetbrains.com/pycharm/download/

---

# Clonar el proyecto desde GitHub

Abrir terminal o CMD y ejecutar:

```bash
git clone URL_DEL_REPOSITORIO
```

Luego entrar a la carpeta:

```bash
cd ordertrack
```

---

# Crear entorno virtual

Dentro de la carpeta del proyecto ejecutar:

```bash
python -m venv venv
```

---

# Activar entorno virtual

## Windows

```bash
venv\Scripts\activate
```

⚠️ Si todo salió bien, aparecerá algo así:

```text
(venv)
```

al inicio de la terminal.

---

# Instalar dependencias

Con el entorno virtual activado ejecutar:

```bash
pip install -r requirements.txt
```

⚠️ Esperar a que termine completamente.

---

# Ejecutar backend FastAPI

Ejecutar:

```bash
uvicorn app.main:app --reload
```

Si todo salió bien aparecerá algo parecido a:

```text
Application startup complete.
```

---

# Abrir Swagger

Entrar desde navegador:

http://127.0.0.1:8000/docs

Ahí se podrán probar los endpoints del backend.

---

# Ejecutar Frontend

Abrir la carpeta:

```text
frontend/
```

y ejecutar:

```text
login.html
```

⚠️ Recomendado:
Abrir usando Live Server o el navegador integrado de PyCharm.

---

# Usuario administrador inicial

```text
usuario: admin
contraseña: 1234
```

---

# Ejecutar tests

Con el backend cerrado o abierto, ejecutar:

```bash
pytest --cov=app
```

Si todo funciona correctamente aparecerá algo parecido a:

```text
4 passed
```

y el porcentaje de coverage.

---

# Estructura del proyecto

```text
OrderTrack/
│
├── app/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── models/
│   ├── schemas/
│   └── tests/
│
├── frontend/
│
├── requirements.txt
├── pytest.ini
└── README.md
```

---

# Flujo básico del sistema

## Login

* Ingresar usuario y contraseña
* Validación contra SQLite

## Dashboard

* El administrador puede:

  * crear operadores
  * crear productos
  * visualizar catálogo

* El operador puede:

  * visualizar catálogo

---

# Problemas comunes

## Error:

```text
uvicorn no se reconoce
```

### Solución:

Activar primero el entorno virtual:

```bash
venv\Scripts\activate
```

---

## Error:

```text
ModuleNotFoundError
```

### Solución:

Instalar dependencias nuevamente:

```bash
pip install -r requirements.txt
```

---

## Error:

```text
Address already in use
```

### Solución:

Cerrar la terminal anterior donde estaba ejecutándose FastAPI.

---

## Error:

```text
pytest no se reconoce
```

### Solución:

Instalar pytest:

```bash
pip install pytest pytest-cov
```

---

# Recomendaciones

* No modificar la arquitectura del proyecto sin coordinación.
* Ejecutar tests antes de subir cambios.
* Mantener el entorno virtual activado durante el desarrollo.
* No subir la carpeta `venv/` a GitHub.

---

# Sprint 1 completado

Funcionalidades implementadas:

* Login funcional
* Gestión básica de operadores
* Gestión de productos
* Frontend mínimo funcional
* Tests con pytest
* Coverage superior al 90%
