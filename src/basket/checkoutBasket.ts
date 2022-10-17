import { APIGatewayEvent } from "aws-lambda";
import { deleteBasket } from "./deleteBasket";
import { getBasket } from "./getBasket";
import { prepareOrderPayload } from "./prepareOrderPayload";
import { publishCheckoutBasketEvent } from "./publishCheckoutBasketEvent";

export const checkoutBasket = async (event: APIGatewayEvent) => {
  console.log('checkoutBasket')

  const checkoutRequest = JSON.parse(event.body!)

  if (checkoutRequest == null || checkoutRequest.userName == null) {
    throw new Error(`userName should exist in checkoutRequest: "${checkoutRequest}"`)
  }

  const basket = await getBasket(checkoutRequest.userName)

  const checkoutPayload = prepareOrderPayload(checkoutRequest, basket)

  await publishCheckoutBasketEvent(checkoutPayload)

  await deleteBasket(checkoutRequest.userName)
}