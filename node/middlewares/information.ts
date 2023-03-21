import { json } from 'co-body'
import { validate } from '../utils/information'

export async function information(ctx: Context, next: () => Promise<any>) {
  const {
    clients: {
      checkout: { addProfileData, addShippingData, addPaymentData }
    },
    vtex: {
      route: { params: { orderFormId } }
    }
  } = ctx

  const data = await json(ctx.req)
  validate(orderFormId, data)

  const addressId = await addProfileData(orderFormId, data)
  const shippingData = await addShippingData(orderFormId, data, addressId.shippingData.selectedAddresses[0].addressId)
  const orderform = await addPaymentData(orderFormId, data, shippingData)

  ctx.body = orderform
  ctx.set('Cache-Control', 'no-cache')
  await next()
}
