import { UserInputError } from '@vtex/api'

interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  document: string;
  phone: number;
  city: string;
  state: string;
  selectedSla: string;
  street: string;
  paymentSystem: string;
}

export function validate(orderFormId: string | string[], data: UserData) {
  if (orderFormId.includes(':')) throw new UserInputError('orderFormId is required')
  if (orderFormId.length !== 32 || !/^[a-zA-Z0-9]+$/.test(orderFormId.toString())) throw new UserInputError('orderFormId invalid')

  if (
    !data.hasOwnProperty('email') || typeof data.email !== 'string' ||
    !data.hasOwnProperty('firstName') || typeof data.firstName !== 'string' ||
    !data.hasOwnProperty('lastName') || typeof data.lastName !== 'string' ||
    !data.hasOwnProperty('document') || typeof data.document !== 'string' ||
    !data.hasOwnProperty('phone') || typeof data.phone !== 'number' ||
    !data.hasOwnProperty('city') || typeof data.city !== 'string' ||
    !data.hasOwnProperty('state') || typeof data.state !== 'string' ||
    !data.hasOwnProperty('selectedSla') || typeof data.selectedSla !== 'string' ||
    !data.hasOwnProperty('street') || typeof data.street !== 'string' ||
    !data.hasOwnProperty('paymentSystem') || typeof data.paymentSystem !== 'string'
  ) throw new UserInputError('invalid data')
}
