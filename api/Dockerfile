# Estágio de Build: Usa o Maven para compilar o .jar
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -f pom.xml clean package -DskipTests

# Estágio de Execução: Usa uma imagem Java leve para rodar a aplicação
FROM openjdk:17-jre-slim
WORKDIR /app
# Copia o .jar do estágio de build
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]