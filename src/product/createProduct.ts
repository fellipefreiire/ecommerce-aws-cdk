import { ddbClient } from "./ddbClient"
import { PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb"
import { marshall } from "@aws-sdk/util-dynamodb"
import { APIGatewayEvent } from "aws-lambda"
import { v4 as uuidv4 } from 'uuid'

export const createProduct = async (event: APIGatewayEvent) => {
  console.log(`createProduct function. event: ${event}`)

  try {
    // TODO productRequest type
    const productRequest = JSON.parse(String(event.body))

    const productId = uuidv4()
    productRequest!.id = productId

    const params: PutItemCommandInput = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: marshall(productRequest || {})
    }

    const createResult = await ddbClient.send(new PutItemCommand(params))

    console.log(createResult)
    return createResult

  } catch (err) {
    console.error(err)
    throw err
  }
}