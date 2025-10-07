-- Agregamos la columna area_id a la tabla cargos
ALTER TABLE cargos ADD COLUMN area_id INTEGER;

-- Agregamos la foreign key constraint
ALTER TABLE cargos ADD CONSTRAINT fk_cargos_area_id FOREIGN KEY (area_id) REFERENCES areas(id) ON DELETE CASCADE;

-- Actualizamos los cargos existentes con áreas de ejemplo
-- Asignamos algunos cargos al área 1 (ejemplo)
UPDATE cargos SET area_id = 1 WHERE id IN (1, 2, 3);

-- Asignamos algunos cargos al área 2 (si existe)
UPDATE cargos SET area_id = 2 WHERE id IN (4, 5);

-- O podemos asignar todos los cargos al área 1 por simplicidad
-- UPDATE cargos SET area_id = 1;