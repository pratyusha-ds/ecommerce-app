import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";
import schema from "./graphql/schema";
import { getUserFromToken } from "./utils/auth";
import { handleStripeWebhook } from "./graphql/webhook/stripeWebhook";
import bodyParser from "body-parser";
import path from "path";

async function startServer() {
  const app = express();

  app.use(
    "/images",
    express.static(path.join(__dirname, "..", "public/images"))
  );

  app.post(
    "/webhook",
    bodyParser.raw({ type: "application/json" }),
    handleStripeWebhook
  );

  app.use(express.json({ type: (req) => !req.url?.startsWith("/webhook") }));

  app.use(cors());

  const server = new ApolloServer({ schema });
  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => {
        const user = getUserFromToken(req);
        return { user };
      },
    })
  );

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}/graphql`);
  });
}

startServer();
