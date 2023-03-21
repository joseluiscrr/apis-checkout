import { IOClients } from '@vtex/api'

import Checkout from './checkout'
import PaymentsGateway from './paymentsGateway'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get checkout() {
    return this.getOrSet('Checkout', Checkout)
  }

  public get paymentsGateway() {
    return this.getOrSet('PaymentsGateway', PaymentsGateway)
  }
}
