# Imagen base ligera con JDK 17
FROM eclipse-temurin:17-jdk-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar el JAR compilado al contenedor
COPY target/MantenimientoUrbano-Backend-0.0.1-SNAPSHOT.jar app.jar

# Exponer el puerto para el backend
EXPOSE 8080

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]