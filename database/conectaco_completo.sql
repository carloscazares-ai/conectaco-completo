-- -----------------------------------------------------
-- conecTaco - script de la base de datos
-- Ejecutar completo en MySQL Workbench (rayito).
-- Si ya existia una version anterior: DROP SCHEMA conectaco_completo; y volver a correrlo.
-- Los datos de ejemplo (lugares, misiones, usuarios demo) los crea la aplicacion
-- la primera vez que arranca, si la base esta vacia.
-- -----------------------------------------------------

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE SCHEMA IF NOT EXISTS `conectaco_completo` DEFAULT CHARACTER SET utf8mb4;
USE `conectaco_completo`;

-- -----------------------------------------------------
-- Usuarios
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Usuarios` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `tipo_usuario` ENUM('Turista', 'Negocio') NOT NULL,
  `fecha_registro` DATE NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Turistas
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Turistas` (
  `id_turista` INT NOT NULL AUTO_INCREMENT,
  `idioma_preferido` VARCHAR(45) NOT NULL,
  `nivel` INT NOT NULL,
  `puntos_experiencia` INT NOT NULL,
  `fk_id_usuario` INT NOT NULL,
  PRIMARY KEY (`id_turista`),
  UNIQUE INDEX `fk_id_usuario_UNIQUE` (`fk_id_usuario` ASC) VISIBLE,
  CONSTRAINT `fk_Turistas_Usuarios1`
    FOREIGN KEY (`fk_id_usuario`) REFERENCES `Usuarios` (`id_usuario`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Negocios
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Negocios` (
  `id_negocio` INT NOT NULL AUTO_INCREMENT,
  `rfc` VARCHAR(45) NULL,
  `telefono` VARCHAR(45) NULL,
  `horario` VARCHAR(100) NULL,
  `estado_verificacion` ENUM('PENDIENTE', 'APROBADO', 'RECHAZADO') NOT NULL DEFAULT 'PENDIENTE',
  `fk_id_usuario` INT NOT NULL,
  PRIMARY KEY (`id_negocio`),
  UNIQUE INDEX `fk_id_usuario_UNIQUE` (`fk_id_usuario` ASC) VISIBLE,
  CONSTRAINT `fk_Negocios_Usuarios1`
    FOREIGN KEY (`fk_id_usuario`) REFERENCES `Usuarios` (`id_usuario`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Categoria
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Categoria` (
  `id_categoria` INT NOT NULL AUTO_INCREMENT,
  `nombre_categoria` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id_categoria`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Lugar
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Lugar` (
  `id_lugar` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `descripcion` VARCHAR(500) NOT NULL,
  `direccion` VARCHAR(150) NOT NULL,
  `latitud` DECIMAL(10,8) NOT NULL,
  `longitud` DECIMAL(11,8) NOT NULL,
  `horario` VARCHAR(100) NOT NULL,
  `costo` VARCHAR(45) NOT NULL,
  `calificacion_promedio` FLOAT NOT NULL DEFAULT 0,
  `imagen_url` VARCHAR(255) NULL,
  `fk_id_categoria` INT NOT NULL,
  `fk_id_negocio` INT NULL,
  PRIMARY KEY (`id_lugar`),
  INDEX `fk_Lugar_Categoria1_idx` (`fk_id_categoria` ASC) VISIBLE,
  INDEX `fk_Lugar_Negocios1_idx` (`fk_id_negocio` ASC) VISIBLE,
  CONSTRAINT `fk_Lugar_Categoria1`
    FOREIGN KEY (`fk_id_categoria`) REFERENCES `Categoria` (`id_categoria`),
  CONSTRAINT `fk_Lugar_Negocios1`
    FOREIGN KEY (`fk_id_negocio`) REFERENCES `Negocios` (`id_negocio`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Recuerdo (lo que el turista guarda de un lugar; su resena es la opinion del lugar)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Recuerdo` (
  `id_recuerdo` INT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(100) NOT NULL,
  `resena` VARCHAR(500) NOT NULL,
  `calificacion` INT NULL,
  `fecha` DATE NOT NULL,
  `imagen_url` VARCHAR(255) NULL,
  `cancion_url` VARCHAR(255) NULL,
  `fk_id_turista` INT NOT NULL,
  `fk_id_lugar` INT NOT NULL,
  PRIMARY KEY (`id_recuerdo`),
  INDEX `fk_Recuerdo_Turistas1_idx` (`fk_id_turista` ASC) VISIBLE,
  INDEX `fk_Recuerdo_Lugar1_idx` (`fk_id_lugar` ASC) VISIBLE,
  CONSTRAINT `fk_Recuerdo_Turistas1`
    FOREIGN KEY (`fk_id_turista`) REFERENCES `Turistas` (`id_turista`),
  CONSTRAINT `fk_Recuerdo_Lugar1`
    FOREIGN KEY (`fk_id_lugar`) REFERENCES `Lugar` (`id_lugar`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Foto (fotos extra de un recuerdo)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Foto` (
  `id_foto` INT NOT NULL AUTO_INCREMENT,
  `url` VARCHAR(255) NOT NULL,
  `fk_id_recuerdo` INT NOT NULL,
  PRIMARY KEY (`id_foto`),
  INDEX `fk_Foto_Recuerdo1_idx` (`fk_id_recuerdo` ASC) VISIBLE,
  CONSTRAINT `fk_Foto_Recuerdo1`
    FOREIGN KEY (`fk_id_recuerdo`) REFERENCES `Recuerdo` (`id_recuerdo`) ON DELETE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Recompensa
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Recompensa` (
  `id_recompensa` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `tipo` VARCHAR(45) NOT NULL,
  `descripcion` VARCHAR(500) NOT NULL,
  `imagen_url` VARCHAR(255) NULL,
  `requisito_xp` INT NOT NULL,
  PRIMARY KEY (`id_recompensa`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Mascota
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Mascota` (
  `id_mascota` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `nivel` INT NOT NULL,
  `experiencia` INT NOT NULL,
  `fk_id_turista` INT NOT NULL,
  `fk_id_recompensa_equipada` INT NULL,
  PRIMARY KEY (`id_mascota`),
  UNIQUE INDEX `fk_id_turista_UNIQUE` (`fk_id_turista` ASC) VISIBLE,
  CONSTRAINT `fk_Mascota_Turistas1`
    FOREIGN KEY (`fk_id_turista`) REFERENCES `Turistas` (`id_turista`),
  CONSTRAINT `fk_Mascota_Recompensa1`
    FOREIGN KEY (`fk_id_recompensa_equipada`) REFERENCES `Recompensa` (`id_recompensa`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Misiones (las "actividades" de un lugar)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Misiones` (
  `id_mision` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `descripcion` VARCHAR(255) NOT NULL,
  `tipo` VARCHAR(45) NOT NULL,
  `puntos_xp` INT NOT NULL,
  `activa` TINYINT(1) NOT NULL,
  `fk_id_lugar` INT NOT NULL,
  PRIMARY KEY (`id_mision`),
  INDEX `fk_Misiones_Lugar1_idx` (`fk_id_lugar` ASC) VISIBLE,
  CONSTRAINT `fk_Misiones_Lugar1`
    FOREIGN KEY (`fk_id_lugar`) REFERENCES `Lugar` (`id_lugar`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Test (preguntas de intereses del usuario)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Test` (
  `id_test` INT NOT NULL AUTO_INCREMENT,
  `pregunta` VARCHAR(100) NOT NULL,
  `respuesta` ENUM('Me gusta', 'No me gusta', 'Me da igual') NOT NULL,
  `fk_id_usuario` INT NOT NULL,
  PRIMARY KEY (`id_test`),
  INDEX `fk_Test_Usuarios1_idx` (`fk_id_usuario` ASC) VISIBLE,
  CONSTRAINT `fk_Test_Usuarios1`
    FOREIGN KEY (`fk_id_usuario`) REFERENCES `Usuarios` (`id_usuario`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Inventario_turista (recompensas canjeadas)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Inventario_turista` (
  `id_inventario` INT NOT NULL AUTO_INCREMENT,
  `fecha_canje` DATE NOT NULL,
  `estado` ENUM('DISPONIBLE', 'USADO', 'EXPIRADO') NOT NULL,
  `fk_id_turista` INT NOT NULL,
  `fk_id_recompensa` INT NOT NULL,
  PRIMARY KEY (`id_inventario`),
  UNIQUE INDEX `turista_recompensa_UNIQUE` (`fk_id_turista` ASC, `fk_id_recompensa` ASC) VISIBLE,
  CONSTRAINT `fk_Inventario_turista_Turistas1`
    FOREIGN KEY (`fk_id_turista`) REFERENCES `Turistas` (`id_turista`),
  CONSTRAINT `fk_Inventario_turista_Recompensa1`
    FOREIGN KEY (`fk_id_recompensa`) REFERENCES `Recompensa` (`id_recompensa`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Progreso_mision
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Progreso_mision` (
  `id_progreso_mision` INT NOT NULL AUTO_INCREMENT,
  `fk_id_mision` INT NOT NULL,
  `fk_id_turista` INT NOT NULL,
  `estado` ENUM('PENDIENTE', 'EN_PROGRESO', 'COMPLETADA') NOT NULL,
  `fecha_asignacion` DATETIME NOT NULL,
  `fecha_completado` DATETIME NULL,
  PRIMARY KEY (`id_progreso_mision`),
  UNIQUE INDEX `mision_turista_UNIQUE` (`fk_id_mision` ASC, `fk_id_turista` ASC) VISIBLE,
  CONSTRAINT `fk_Progreso_mision_Misiones1`
    FOREIGN KEY (`fk_id_mision`) REFERENCES `Misiones` (`id_mision`) ON DELETE CASCADE,
  CONSTRAINT `fk_Progreso_mision_Turistas1`
    FOREIGN KEY (`fk_id_turista`) REFERENCES `Turistas` (`id_turista`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Promocion (promociones que publica un negocio)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Promocion` (
  `id_promocion` INT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(100) NOT NULL,
  `descripcion` VARCHAR(255) NULL,
  `fecha_fin` DATE NOT NULL,
  `activa` TINYINT(1) NOT NULL,
  `imagen_url` VARCHAR(255) NULL,
  `fk_id_negocio` INT NOT NULL,
  PRIMARY KEY (`id_promocion`),
  INDEX `fk_Promocion_Negocios1_idx` (`fk_id_negocio` ASC) VISIBLE,
  CONSTRAINT `fk_Promocion_Negocios1`
    FOREIGN KEY (`fk_id_negocio`) REFERENCES `Negocios` (`id_negocio`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Visita (cada vez que un turista abre el detalle de un lugar)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Visita` (
  `id_visita` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATETIME NOT NULL,
  `fk_id_turista` INT NULL,
  `fk_id_lugar` INT NOT NULL,
  PRIMARY KEY (`id_visita`),
  INDEX `fk_Visita_Lugar1_idx` (`fk_id_lugar` ASC) VISIBLE,
  CONSTRAINT `fk_Visita_Turistas1`
    FOREIGN KEY (`fk_id_turista`) REFERENCES `Turistas` (`id_turista`),
  CONSTRAINT `fk_Visita_Lugar1`
    FOREIGN KEY (`fk_id_lugar`) REFERENCES `Lugar` (`id_lugar`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Favorito (lugares guardados por un turista = seguidores del negocio)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Favorito` (
  `id_favorito` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATETIME NOT NULL,
  `fk_id_turista` INT NOT NULL,
  `fk_id_lugar` INT NOT NULL,
  PRIMARY KEY (`id_favorito`),
  UNIQUE INDEX `turista_lugar_UNIQUE` (`fk_id_turista` ASC, `fk_id_lugar` ASC) VISIBLE,
  CONSTRAINT `fk_Favorito_Turistas1`
    FOREIGN KEY (`fk_id_turista`) REFERENCES `Turistas` (`id_turista`),
  CONSTRAINT `fk_Favorito_Lugar1`
    FOREIGN KEY (`fk_id_lugar`) REFERENCES `Lugar` (`id_lugar`))
ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
