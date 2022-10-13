import { ddbClient } from "./ddbClient"
import { ScanCommand, ScanCommandInput } from "@aws-sdk/client-dynamodb"
import { unmarshall } from "@aws-sdk/util-dynamodb"

export const getAllBaskets = async () => {
  console.log('getAllBaskets')

  try {
    const params: ScanCommandInput = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
    }

    const { Items } = await ddbClient.send(new ScanCommand(params))

    console.log(Items)
    return (Items) ? Items.map((item) => unmarshall(item)) : {}

  } catch (err) {
    console.error(err)
    throw err
  }
}