import { Express } from "express";

export async function initSwagger(app: Express) {
  const swaggerJsdoc = require("swagger-jsdoc");
  const swaggerUi = require("swagger-ui-express");
  const options = {
    definition: {
      openapi: "3.0.0",
      servers: [
        {
          url: "http://localhost:5000/api",
        },
      ],
      info: {
        title: "E2E Mentor Api Doc",
        version: "1.0.0",
      },
    },
    apis: ["./open_api/**/*.yml"],
  };
  const specs = swaggerJsdoc(options);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  app.get("/openapi.json", (req, res) => {
    res.json(specs);
  });
}
