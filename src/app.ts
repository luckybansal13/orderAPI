import express, { Request, Response, Application, NextFunction } from 'express';
import ip from 'ip';
import cors from 'cors';
import orderRoutes from './routes/orders.routes';
import { HttpResponse } from './domain/response';
import { Code } from './enum/code.enum';
import { Status } from './enum/status.enum';
import { PORT } from './config/config';

export class App {
  private readonly app: Application;
  private readonly APPLICATION_RUNNING = 'application is running on:';
  private readonly ROUTE_NOT_FOUND = 'Route does not exist on the server';

  constructor(private readonly port: (string | number) = PORT || 3000) {
    this.app = express();
    this.middleWare();
    this.routes();
  }

  listen(): void {
    this.app.listen(this.port);
    console.info(`${this.APPLICATION_RUNNING} ${ip.address()}:${this.port}`);
  }

  private middleWare(): void {
    this.app.use(cors({ origin: '*' }));
    this.app.use(express.json());
    this.app.use((req: Request, res: Response, next: NextFunction) => { this.logRequest(req); next();})
  }

  private logRequest(req: Request): void {
    console.log(JSON.stringify({
      message: `Request received`,
      type: "REQUEST",
      url: req.url,
      ip: req.ip,
      extra: JSON.stringify({body: req.body, params: req.params, query: req.query}),
      headers: JSON.stringify({agent: req.headers['user-agent']})
    }))
  }

  private routes(): void {
    this.app.use('/orders', orderRoutes);
    this.app.get('/', (_: Request, res: Response)=> res.status(Code.OK).send(new HttpResponse(Code.OK, Status.OK, 'Welcome to the Order Service!')));
    this.app.all('*', (_: Request, res: Response)=> res.status(Code.NOT_FOUND).send(new HttpResponse(Code.NOT_FOUND, Status.NOT_FOUND, this.ROUTE_NOT_FOUND)));
  }
}
