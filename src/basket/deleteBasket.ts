import { ddbClient } from "./ddbClient"
import { DeleteItemCommand, DeleteItemCommandInput } from "@aws-sdk/client-dynamodb"
import { marshall } from "@aws-sdk/util-dynamodb"

export const deleteBasket = async (userName: string | undefined) => {
  console.log(`deleteBasket function. userName: "${userName}"`)

  try {
    const params: DeleteItemCommandInput = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ userName })
    }

    const deleteResult = await ddbClient.send(new DeleteItemCommand(params))

    console.log(deleteResult)
    return deleteResult

  } catch (err) {
    console.error(err)
    throw err
  }
}