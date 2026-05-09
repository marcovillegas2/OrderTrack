# OrderTrack

Sistema web de gestión de pedidos y catálogo para emprendimientos gastronómicos.

## Tecnologías
- FastAPI
- SQLite
- HTML/CSS/JavaScript
- Pytest
- SonarQube

## Instalación

### Crear entorno virtual
python -m venv venv

### Activar entorno virtual
venv\Scripts\activate

### Instalar dependencias
pip install -r requirements.txt

## Ejecutar backend
uvicorn app.main:app --reload

## Ejecutar tests
pytest --cov=app

## Probar en el navegador
- Buscar frontend/login.html
- Dale clic derecho y selecciona "Open in Browser"

## Usuario administrador
usuario: admin
password: 1234

## Usuario operador
usuario: user1
password: 1234
