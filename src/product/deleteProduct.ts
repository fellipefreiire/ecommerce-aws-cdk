import { ddbClient } from "./ddbClient"
import { DeleteItemCommand, DeleteItemCommandInput } from "@aws-sdk/client-dynamodb"
import { marshall } from "@aws-sdk/util-dynamodb"

export const deleteProduct = async (productId: string | undefined) => {
  console.log(`deleteProduct function. productId: "${productId}"`)

  try {
    const params: DeleteItemCommandInput = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ id: productId })
    }

    const deleteResult = await ddbClient.send(new DeleteItemCommand(params))

    console.log(deleteResult)
    return deleteResult

  } catch (err) {
    console.error(err)
    throw err
  }
}