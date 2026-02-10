# Stage 1: Build the application
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy maven settings and pom.xml first to cache dependencies
COPY pom.xml .
# If you have a settings.xml, copy it too
# COPY settings.xml /root/.m2/settings.xml

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code and build
COPY src ./src
RUN mvn package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:17-jre-focal

WORKDIR /app

# Copy the jar file from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Environment variables
ENV JAVA_OPTS=""
ENV SPRING_PROFILES_ACTIVE="prod"

# Run command
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
