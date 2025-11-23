import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import path from "path";
import routes from "./routes";

export const createApp = (): Application => {
  const app = express();

  // Middleware
  app.use(express.static(path.join(__dirname, "../public")));
  app.use(fileUpload());
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // Routes
  app.get("/", (req, res) => {
    res.send("Luckyman API");
  });
  app.use("/", routes);

  return app;
};

