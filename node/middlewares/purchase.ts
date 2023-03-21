import { json } from 'co-body'
import { validate } from '../utils/purchase'

export async function purchase(ctx: Context, next: () => Promise<any>) {
  const {
    clients: {
      checkout: { newPurchase, addItems }
    },
    vtex: {
      host
    }
  } = ctx

  const request = await json(ctx.req)

  for (const product of request) validate(product)

  const { cookie, orderFormId } = await newPurchase()
  const orderform = await addItems(orderFormId, request)

  const date = new Date();
  date.setMonth(date.getMonth() + 6)
  date.setHours(23)
  const settings = { expires: date, domain: host }

  ctx.cookies.set('checkout.vtex.com', cookie, settings)
  ctx.body = orderform
  ctx.set('Cache-Control', 'no-cache')

  console.log(ctx.req)
  await next()
}
