import { ddbClient } from "./ddbClient"
import { UpdateItemCommand, UpdateItemCommandInput } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { APIGatewayEvent } from 'aws-lambda';

export const updateProduct = async (event: APIGatewayEvent) => {

  try {
    // TODO productRequest type
    const requestBody = JSON.parse(String(event.body))
    const objKeys = Object.keys(requestBody)

    const params: UpdateItemCommandInput = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ id: event.pathParameters!.id }),
      UpdateExpression: `SET ${objKeys.map((_, index) => `#key${index} = :value${index}`).join(", ")}`,
      ExpressionAttributeNames: objKeys.reduce((acc, key, index) => ({
        ...acc,
        [`#key${index}`]: key,
      }), {}),
      ExpressionAttributeValues: marshall(objKeys.reduce((acc, key, index) => ({
        ...acc,
        [`:value${index}`]: requestBody![key],
      }), {})),
    }

    const updateResult = await ddbClient.send(new UpdateItemCommand(params))

    console.log(updateResult)
    return updateResult

  } catch (err) {
    console.error(err)
    throw err
  }
}