import { UserInputError } from "@vtex/api"

export async function process(ctx: Context, next: () => Promise<any>) {
  const {
    clients: {
      checkout: { orderForm, setPlaceOrder }
    },
    vtex: {
      route: { params: { orderFormId } }
    }
  } = ctx

  if (orderFormId.includes(':')) throw new UserInputError('orderFormId is required')
  if (orderFormId.length !== 32 || !/^[a-zA-Z0-9]+$/.test(orderFormId.toString())) throw new UserInputError('orderFormId invalid')

  const data = await orderForm(orderFormId)
  const placeOrder = await setPlaceOrder(orderFormId, data)

  ctx.state.placeOrder = placeOrder
  ctx.set('Cache-Control', 'no-cache')
  await next()
}
