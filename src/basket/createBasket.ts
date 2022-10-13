import { ddbClient } from "./ddbClient"
import { PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb"
import { marshall } from "@aws-sdk/util-dynamodb"
import { APIGatewayEvent } from "aws-lambda"

export const createBasket = async (event: APIGatewayEvent) => {
  console.log(`createBasket function. event: ${event}`)

  try {
    // TODO basketRequest type
    const requestBody = JSON.parse(String(event.body))
    const params: PutItemCommandInput = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: marshall(requestBody || {})
    }

    const createResult = await ddbClient.send(new PutItemCommand(params))

    console.log(createResult)
    return createResult

  } catch (err) {
    console.error(err)
    throw err
  }
}