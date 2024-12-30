import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = () => (
  createSwaggerSpec({
    apiFolder: "src/app/api", // define api folder under app folder
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Movie Database",
        version: "1.0",
      },
      security: [],
    },
  })
);
