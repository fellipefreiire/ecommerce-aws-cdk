import { QueryCommand, QueryCommandInput } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { APIGatewayEvent } from 'aws-lambda';
import { ddbClient } from './ddbClient';

export const getOrder = async (event: APIGatewayEvent) => {
  console.log('getOrder')
  try {

    const userName = event.pathParameters!.userName
    const orderDate = event.queryStringParameters!.orderDate

    const params: QueryCommandInput = {
      KeyConditionExpression: "userName = :userName and orderDate = :orderDate",
      ExpressionAttributeValues: {
        ":userName": { S: userName },
        ":orderDate": { S: orderDate },
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