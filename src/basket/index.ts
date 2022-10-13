import { APIGatewayEvent } from 'aws-lambda'
import { checkoutBasket } from './checkoutBasket'
import { createBasket } from './createBasket'
import { deleteBasket } from './deleteBasket'
import { getAllBaskets } from './getAllBaskets'
import { getBasket } from './getBasket'

export const handler = async (
  event: APIGatewayEvent
) => {
  try {

    let body
    switch (event.httpMethod) {
      case 'GET':
        if (event.pathParameters !== null) {
          body = await getBasket(event.pathParameters.userName) // GET basket/{userName}
        } else {
          body = await getAllBaskets() // GET /basket
        }
        break;
      case 'POST':
        if (event.path == '/basket/checkout') {
          body = await checkoutBasket(event) // POST /basket/checkout
        } else {
          body = await createBasket(event) // POST /basket
        }
        break;
      case 'DELETE':
        body = await deleteBasket(event.pathParameters!.userName) // DELETE /basket/{userName}
        break;
      default:
        throw new Error(`Unsupported route: "${event.httpMethod}"`)
    }

    console.log(body)
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Successfully finished operation: "${event.httpMethod}"`,
        body: body,
      })
    }
  } catch (err: unknown) {
    console.error(err)
    if (err instanceof Error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Failed to perform operation.',
          errorMsg: err.message,
          errorStack: err.stack
        })
      }
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to perform operation.',
        errorMsg: err
      })
    }
  }
}
