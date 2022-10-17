import { PutEventsCommand, PutEventsCommandInput } from "@aws-sdk/client-eventbridge"
import { ebClient } from "./eventBridgeClient"

export const publishCheckoutBasketEvent = async (checkoutPayload: any) => {
  console.log('publishCheckoutBasketEvent with payload :', checkoutPayload)

  try {
    const params: PutEventsCommandInput = {
      Entries: [
        {
          Source: process.env.EVENT_SOURCE,
          Detail: JSON.stringify(checkoutPayload),
          DetailType: process.env.EVENT_DETAIL_TYPE,
          Resources: [],
          EventBusName: process.env.EVENT_BUS_NAME
        }
      ]
    }

    const data = await ebClient.send(new PutEventsCommand(params))

    console.log('Success, event sent; requestID:', data)

    return data
  } catch (err) {
    console.error(err)
    throw err
  }
}