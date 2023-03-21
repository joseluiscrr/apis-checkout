export async function pay(ctx: Context, next: () => Promise<any>) {
  const { state: { placeOrder } } = ctx

  const {
    clients: {
      checkout: { pay }
    }
  } = ctx

  await pay(placeOrder)

  ctx.body = { message: "Cart completed" }

  ctx.set('Cache-Control', 'no-cache')
  await next()
}
