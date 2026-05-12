import express from "express";
import { ParseTemplateUseCase } from "./application/ParseTemplateUseCase";
import { ParseTemplateController } from "./infrastructure/ParseTemplateController";
import { ExpressServer } from "./infrastructure/ExpressServer";

const port = 3000;

const useCase = new ParseTemplateUseCase();
const controller = new ParseTemplateController(useCase);

const router = express.Router();
router.post("/parse", controller.handle);

const server = new ExpressServer(router);
server.listen(port);
