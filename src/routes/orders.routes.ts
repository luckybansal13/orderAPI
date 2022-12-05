import { Router } from 'express';
import { placeOrder } from '../controller/order.controller';
import { checkApiKey } from '../security/api.security';
const orderRoutes = Router();

orderRoutes.post('/placeOrder', checkApiKey, placeOrder);

export default orderRoutes;
