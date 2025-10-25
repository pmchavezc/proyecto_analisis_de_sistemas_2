FROM eclipse-temurin:17-jdk-alpine

# Crear carpeta de trabajo
WORKDIR /app

# Copiar el .jar del backend
COPY target/MantenimientoUrbano-Backend-0.0.1-SNAPSHOT.jar app.jar

# Copiar el frontend ya compilado
COPY frontend/dist/ src/main/resources/static/

# Exponer el puerto
EXPOSE 8080

# Comando de arranque
ENTRYPOINT ["java", "-jar", "app.jar"]
