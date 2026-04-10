FROM eclipse-temurin:17

COPY target/moviebooking-0.0.1-SNAPSHOT.jar app.jar

ENV SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/rkdb

ENTRYPOINT ["java", "-jar", "app.jar"]