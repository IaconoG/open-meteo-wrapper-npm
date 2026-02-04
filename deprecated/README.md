# Deprecated

Esta carpeta contiene código legado y archivos que han sido reemplazados por la nueva arquitectura.

Qué es deprecated

- Código antiguo que se mantiene para compatibilidad o referencia histórica.
- No forma parte del flujo activo del paquete publicado.

Por qué existe

- Mantener historial y permitir rollback o referencia para migraciones.

No debe usarse en código nuevo

- Evite importar desde `deprecated/*` en nuevo código.
- El contenido puede eliminarse en próximas versiones mayores.

Estructura propuesta

- deprecated/
  - adapters/
  - services/
  - models/
  - utils/
  - tests/

