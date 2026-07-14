FROM sbtscala/scala-sbt:eclipse-temurin-17.0.15_6_1.12.11_2.12.21 AS build
WORKDIR /app
COPY . .
RUN sbt assembly

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/target/scala-2.13/SistemaGestion-assembly-0.1.jar app.jar
CMD ["java", "-jar", "app.jar"]
