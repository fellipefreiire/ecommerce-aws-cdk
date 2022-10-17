import { PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb"
import { marshall } from "@aws-sdk/util-dynamodb"
import { ddbClient } from "./ddbClient"

export const createOrder = async (basketCheckoutEvent: any) => {
  try {
    console.log(`createOrder function. event : "${basketCheckoutEvent}"`)

    const orderDate = new Date().toISOString()
    basketCheckoutEvent.orderDate = orderDate
    console.log(basketCheckoutEvent)

    const params: PutItemCommandInput = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: marshall(basketCheckoutEvent || {})
    }

    const createResult = await ddbClient.send(new PutItemCommand(params))
    console.log(createResult)

    return createResult
  } catch (err) {
    console.error(err)
    throw err
  }
}