import { ddbClient } from './ddbClient';
import { GetItemCommand, GetItemCommandInput } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

export const getBasket = async (userName: string | undefined) => {
  console.log('getBasket')

  try {
    const params: GetItemCommandInput = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ userName: userName })
    }

    const { Item } = await ddbClient.send(new GetItemCommand(params))

    console.log(Item)
    return (Item) ? unmarshall(Item) : {}

  } catch (err) {
    console.error(err)
    throw err
  }
}