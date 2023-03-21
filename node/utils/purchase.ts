import { UserInputError } from '@vtex/api'

interface Product {
  quantity: number
  seller: string
  id: string
}

export function validate(product: Product) {
  if (
    !product.hasOwnProperty("quantity") || typeof product.quantity !== "number" ||
    !product.hasOwnProperty("seller") || typeof product.seller !== "string" ||
    !product.hasOwnProperty("id") || typeof product.id !== "string"
  ) throw new UserInputError("The object does not meet the expected properties")

  return true;
}
