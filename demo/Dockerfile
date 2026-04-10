FROM eclipse-temurin:17

WORKDIR /app

# Copy all project files
COPY . .

# Build the project (creates jar)
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Run the jar
CMD ["java", "-jar", "target/*.jar"]