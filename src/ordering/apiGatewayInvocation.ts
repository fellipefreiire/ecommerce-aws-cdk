import { APIGatewayEvent } from "aws-lambda"
import { getAllOrders } from "./getAllOrders"
import { getOrder } from "./getOrder"

export const apiGatewayInvocation = async (event: APIGatewayEvent) => {
  let body

  try {
    switch (event.httpMethod) {
      case "GET":
        if (event.pathParameters !== null) {
          body = await getOrder(event)
        } else {
          body = await getAllOrders()
        }
        break
      default:
        throw new Error(`Unsupported route: "${event.httpMethod}"`)
    }

    console.log(body)
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Successfully finished operation: "${event.httpMethod}"`,
        body,
      })
    }
  } catch (err) {
    console.error(err)
    throw err
  }
}