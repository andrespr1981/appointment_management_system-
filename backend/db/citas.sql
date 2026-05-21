-- ====================================================
-- MODELO DE BASE DE DATOS
-- ====================================================

-- 1. Tabla de Tenants 
CREATE TABLE tenants (
    id_tenant INT AUTO_INCREMENT PRIMARY KEY,
    nombre_organizacion VARCHAR(150) NOT NULL,
    dominio VARCHAR(100) UNIQUE,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Roles 
CREATE TABLE roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    nombre_rol VARCHAR(50) NOT NULL,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id_tenant) ON DELETE CASCADE
);

-- 3. Tabla de Especialidades 
CREATE TABLE especialidades (
    id_especialidad INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id_tenant) ON DELETE CASCADE
);

-- 4. Tabla de Usuarios
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    id_rol INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL,
    telefono VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (tenant_id, correo), -- Permite el mismo correo en distintos tenants
    FOREIGN KEY (tenant_id) REFERENCES tenants(id_tenant) ON DELETE CASCADE,
    FOREIGN KEY (id_rol) REFERENCES roles (id_rol)
);

-- 5. Tabla de Especialistas
CREATE TABLE especialistas (
    id_especialista INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    id_usuario INT NOT NULL,
    id_especialidad INT NOT NULL,
    cedula_profesional VARCHAR(50) NOT NULL,
    costo_consulta DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id_tenant) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_especialidad) REFERENCES especialidades(id_especialidad) ON DELETE CASCADE
);

-- 6. Horarios Disponibles
CREATE TABLE horarios_disponibles (
    id_horario INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    id_especialista INT NOT NULL,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    disponible BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id_tenant) ON DELETE CASCADE,
    FOREIGN KEY (id_especialista) REFERENCES especialistas(id_especialista) ON DELETE CASCADE
);

-- 7. Citas
CREATE TABLE citas (
    id_cita INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    id_paciente INT NOT NULL,
    id_especialista INT NOT NULL,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    estado ENUM('PROGRAMADA', 'COMPLETADA', 'CANCELADA', 'REPROGRAMADA') DEFAULT 'PROGRAMADA',
    motivo_consulta TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id_tenant) ON DELETE CASCADE,
    FOREIGN KEY (id_paciente) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_especialista) REFERENCES especialistas(id_especialista)
);

-- 8. Cancelaciones
CREATE TABLE cancelaciones (
    id_cancelacion INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    id_cita INT NOT NULL,
    cancelado_por INT NOT NULL,
    tipo_cancelacion ENUM('NORMAL', 'EMERGENCIA') NOT NULL,
    motivo TEXT NOT NULL,
    fecha_cancelacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id_tenant) ON DELETE CASCADE,
    FOREIGN KEY (id_cita) REFERENCES citas(id_cita),
    FOREIGN KEY (cancelado_por) REFERENCES usuarios(id_usuario)
);

-- 9. Reprogramaciones
CREATE TABLE reprogramaciones (
    id_reprogramacion INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    id_cita_original INT NOT NULL,
    id_cita_nueva INT NOT NULL,
    reprogramado_por INT NOT NULL,
    fecha_reprogramacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id_tenant) ON DELETE CASCADE,
    FOREIGN KEY (id_cita_original) REFERENCES citas(id_cita),
    FOREIGN KEY (id_cita_nueva) REFERENCES citas(id_cita),
    FOREIGN KEY (reprogramado_por) REFERENCES usuarios(id_usuario)
);

-- 10. Pagos
CREATE TABLE pagos (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    id_cita INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    estado_pago ENUM('PENDIENTE', 'PAGADO', 'REEMBOLSADO') DEFAULT 'PENDIENTE',
    metodo_pago ENUM('EFECTIVO', 'TARJETA', 'TRANSFERENCIA') NOT NULL,
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id_tenant) ON DELETE CASCADE,
    FOREIGN KEY (id_cita) REFERENCES citas(id_cita)
);

-- 11. Refresh Tokens
CREATE TABLE refresh_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    user_id INT NOT NULL,
    refresh_token VARCHAR(512) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP NULL,
    dispositivo VARCHAR(100) NULL,
    esta_revocado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id_tenant) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- ====================================================
-- TRIGGERS 
-- ====================================================

DELIMITER //

-- Generar un pago de la cita
CREATE TRIGGER generar_pago_pendiente
AFTER INSERT ON citas
FOR EACH ROW
BEGIN
    DECLARE costo_actual DECIMAL(10,2);
    
    SELECT costo_consulta INTO costo_actual 
    FROM especialistas 
    WHERE id_especialista = NEW.id_especialista AND tenant_id = NEW.tenant_id;
    
    INSERT INTO pagos (tenant_id, id_cita, monto, estado_pago, metodo_pago)
    VALUES (NEW.tenant_id, NEW.id_cita, costo_actual, 'PENDIENTE', 'EFECTIVO');
END //

-- Sincronización de horarios disponibles
CREATE TRIGGER ocupar_horario
AFTER INSERT ON citas
FOR EACH ROW
BEGIN
    UPDATE horarios_disponibles
    SET disponible = FALSE
    WHERE id_especialista = NEW.id_especialista
      AND fecha = NEW.fecha
      AND hora_inicio = NEW.hora_inicio
      AND tenant_id = NEW.tenant_id;
END //

-- Liberar horario por cancelación
CREATE TRIGGER liberar_horario_cancelacion
AFTER INSERT ON cancelaciones
FOR EACH ROW
BEGIN
    DECLARE v_id_especialista INT;
    DECLARE v_fecha DATE;
    DECLARE v_hora_inicio TIME;

    UPDATE citas 
    SET estado = 'CANCELADA' 
    WHERE id_cita = NEW.id_cita AND tenant_id = NEW.tenant_id;

    SELECT id_especialista, fecha, hora_inicio 
    INTO v_id_especialista, v_fecha, v_hora_inicio
    FROM citas 
    WHERE id_cita = NEW.id_cita AND tenant_id = NEW.tenant_id;

    UPDATE horarios_disponibles
    SET disponible = TRUE
    WHERE id_especialista = v_id_especialista 
      AND fecha = v_fecha 
      AND hora_inicio = v_hora_inicio
      AND tenant_id = NEW.tenant_id;
END //

-- Actualización en cascada por reprogramación
CREATE TRIGGER actualizar_reprogramacion
AFTER INSERT ON reprogramaciones
FOR EACH ROW
BEGIN
    DECLARE v_id_especialista INT;
    DECLARE v_fecha DATE;
    DECLARE v_hora_inicio TIME;

    UPDATE citas 
    SET estado = 'REPROGRAMADA' 
    WHERE id_cita = NEW.id_cita_original AND tenant_id = NEW.tenant_id;

    SELECT id_especialista, fecha, hora_inicio 
    INTO v_id_especialista, v_fecha, v_hora_inicio
    FROM citas 
    WHERE id_cita = NEW.id_cita_original AND tenant_id = NEW.tenant_id;

    UPDATE horarios_disponibles
    SET disponible = TRUE
    WHERE id_especialista = v_id_especialista 
      AND fecha = v_fecha 
      AND hora_inicio = v_hora_inicio
      AND tenant_id = NEW.tenant_id;
END //

DELIMITER ;