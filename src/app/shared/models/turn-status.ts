import { OrderStatus } from './order-status';
import { ActionTypeRepair } from './action-type-repair';
import { Owner } from './owner';


export class Turnstatus {

  id: number;
  code: string;
  description: string;
   owner :Owner;
}
