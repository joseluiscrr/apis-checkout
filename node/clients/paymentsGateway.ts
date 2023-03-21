import { ExternalClient, InstanceOptions, IOContext } from "@vtex/api";

export default class PaymentsGateway extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super("http://itglobers.vtexpayments.com.br", context, {
      ...options,
      headers: {
        "Proxy-Authorization": context.authToken,
        Accept: "application/json",
        "content-Type": "application/json",
        VtexIdclientAuthCookie: context.authToken,
        'X-Vtex-Use-Https': 'true',
      },
    })
  }

  public payment = async (orderform: any): Promise<any> => {
    const {
      orderForm: {
        merchantTransactions: [{ transactionId, merchantName }],
        value,
        paymentData: { payments: [{ paymentSystem }]}
      }
    } = orderform

    const body = [
      {
        paymentSystem,
        installments: 1,
        currencyCode: 'COP',
        value,
        installmentsInterestRate: 0,
        installmentsValue: value,
        referenceValue: value,
        fields: {
          holderName: null,
          cardNumber: null,
          validationCode: null,
          dueDate: null,
          document: 8041734561,
          accountId: '',
          address: null,
          callbackUrl: ''
        },
        transaction: {
          id: transactionId,
          merchantName: merchantName
        }
      }
    ]

    await this.http.post(`/api/pub/transactions/${transactionId}/payments`, body)
  }
}
