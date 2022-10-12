import { ddbClient } from "./ddbClient";
import { QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { APIGatewayEvent } from "aws-lambda";

export const getProductsByCategory = async (event: APIGatewayEvent) => {
  console.log('getProductsByCategory')

  try {
    const productId = event.pathParameters!.id
    const category = event.queryStringParameters!.category

    //TODO query type
    const params: QueryCommandInput = {
      KeyConditionExpression: 'id = :productId',
      FilterExpression: 'contains (category, :category)',
      ExpressionAttributeValues: {
        ':productId': { S: productId },
        ':category': { S: category },
      },
      TableName: process.env.DYNAMODB_TABLE_NAME
    }

    const { Items } = await ddbClient.send(new QueryCommand(params))

    console.log(Items)
    return Items?.map((item) => unmarshall(item))

  } catch (err) {
    console.error(err)
    throw err
  }
}