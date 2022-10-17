
export const prepareOrderPayload = (checkoutRequest: any, basket: Record<string, any>) => {
  console.log('prepareOrderPayload')

  try {
    if (basket === null || basket.items === null) {
      throw new Error(`basket should exist in items: "${basket}"`)
    }

    let totalPrice = 0
    basket.items.forEach((item: any) => totalPrice = totalPrice + item.price)
    checkoutRequest.totalPrice = totalPrice
    console.log(checkoutRequest)

    Object.assign(checkoutRequest, basket)
    console.log('Success prepareOrderPayload, orderPayload:', checkoutRequest)

    return checkoutRequest
  } catch (err) {
    console.error(err)
    throw err
  }
}