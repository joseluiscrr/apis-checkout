import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

export default class Checkout extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        'Proxy-Authorization': context.authToken,
        Accept: 'application/json',
        'content-Type': 'application/json',
        VtexIdclientAuthCookie: context.authToken,
      },
    })
  }

  public orderForm = async (orderFormId: any): Promise<any> => await this.http.get(`/api/checkout/pub/orderForm/${orderFormId}`)

  public newPurchase = async (): Promise<any> => {
    const { headers: { 'set-cookie': setCookie }, data } = await this.http.getRaw('/api/checkout/pub/orderForm')
    return {
      cookie: setCookie[0].split(';')[0].replace('checkout.vtex.com=', ''),
      orderFormId: data.orderFormId
    }
  }

  public addItems = async (orderFormId: string, request: any): Promise<any> => {
    const body = { orderItems: request }
    return await this.http.post(`/api/checkout/pub/orderForm/${orderFormId}/items`, body)
  }

  public addProfileData = async (orderFormId: any, { email, firstName, lastName, document, phone }: any): Promise<any> => {
    const body = {
      email,
      firstName,
      lastName,
      document,
      documentType: "cedulaCOL",
      phone: `+57${phone}`,
      corporateName: null,
      tradeName: null,
      corporateDocument: null,
      stateInscription: null,
      corporatePhone: null,
      isCorporate: false
    }
    return await this.http.post(`/api/checkout/pub/orderForm/${orderFormId}/attachments/clientProfileData`, body)
  }

  public addShippingData = async (orderFormId: any, { firstName, lastName, city, state, street, selectedSla }: any, addressId: any): Promise<any> => {
    const body = {
      clearAddressIfPostalCodeNotFound: false,
      selectedAddresses: [
        {
          addressType: "residential",
          receiverName: `${firstName} ${lastName}`,
          addressId,
          isDisposable: false,
          postalCode: "11001",
          city,
          state,
          country: "COL",
          street,
          number: null,
          neighborhood: null,
          complement: null,
          reference: null,
          geoCoordinates: []
        }
      ],
      logisticsInfo: [
        {
          deliveryWindow: {
            startDateUtc: '2023-03-30T00:00:00+00:00',
            endDateUtc: '2023-03-30T23:59:59+00:00',
            price: 0,
            lisPrice: 0,
            tax: 0
        },
          addressId,
          itemIndex: 0,
          selectedDeliveryChannel: 'delivery',
          selectedSla
        }
      ]
    }
    return await this.http.post(`/api/checkout/pub/orderForm/${orderFormId}/attachments/shippingData`, body)
  }

  public addPaymentData = async (orderFormId: any, data: any, shippingData: any): Promise<any> => {
    const paymentSystem = data.paymentSystem
    const value = shippingData.value
    const body = {
      payments: [
        {
          paymentSystem,
          bin: null,
          accountId: null,
          tokenId: null,
          installments: 1,
          referenceValue: value,
          value,
          merchantSellerPayments: [
            {
              id: "ITGLOBERS",
              installments: 1,
              referenceValue: value,
              value,
              interestRate: 0,
              installmentValue: value
            }
          ]
        }
      ]
    }
    return await this.http.post(`/api/checkout/pub/orderForm/${orderFormId}/attachments/paymentData`, body)
  }

  public setPlaceOrder = async (orderFormId: any, data: any): Promise<any> => {
    const value = data.value
    const body = {
      referenceId: orderFormId,
      savePersonalData: true,
      optinNewsLetter: false,
      value,
      referenceValue: value,
      interestValue: 0
    }
    const { headers, data: orderForm } = await this.http.postRaw(`/api/checkout/pub/orderForm/${orderFormId}/transaction`, body)
    return {
      Vtex_CHKO_Auth: headers['set-cookie'][0].split(";")[0].replace("Vtex_CHKO_Auth=", ""),
      orderForm
    }
  }

  public pay = async (placeOrder: any): Promise<any> => {
    const { Vtex_CHKO_Auth, orderForm: { orderGroup } } = placeOrder
    const config = {
      headers: {
        Cookie: `Vtex_CHKO_Auth=${Vtex_CHKO_Auth};`,
      },
    }
    return await this.http.post(`/api/checkout/pub/gatewayCallback/${orderGroup}`, {}, config)
  }
}
