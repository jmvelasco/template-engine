import express, { type Express, type Router } from "express";
import cors from "cors";

export class ExpressServer {
  private readonly app: Express;

  constructor(router: Router) {
    this.app = express();
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(router);
  }

  listen(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }

  getApp(): Express {
    return this.app;
  }
}
