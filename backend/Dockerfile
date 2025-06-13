# Use official OpenJDK 17 image
FROM openjdk:17-jdk-slim

# Set working directory inside the container
WORKDIR /app

# Copy Gradle wrapper and build files
COPY gradlew build.gradle settings.gradle ./
COPY gradle ./gradle

# Download dependencies (cache layer)
RUN ./gradlew build -x test || true

# Copy the rest of the project
COPY . .

# Build Spring Boot application
RUN ./gradlew bootJar -x test

# Run the built JAR
CMD ["java", "-jar", "build/libs/backend-0.0.1-SNAPSHOT.jar"]
