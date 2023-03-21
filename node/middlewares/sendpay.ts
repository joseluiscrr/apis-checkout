export async function sendpay(ctx: Context, next: () => Promise<any>) {
  const { state: { placeOrder } } = ctx

  const {
    clients: {
      paymentsGateway: { payment }
    }
  } = ctx

  await payment(placeOrder)

  ctx.set('Cache-Control', 'no-cache')
  await next()
}
