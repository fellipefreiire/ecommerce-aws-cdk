import { APIGatewayEvent } from 'aws-lambda'

export const handler = async (
  event: APIGatewayEvent
) => {
  try {
    let body
    switch (event.httpMethod) {
      case 'GET':
        if (event.queryStringParameters !== null) {
          // body = await getProductsByCategory(event) // Get product/1234?category=Phone
        } else if (event.pathParameters !== null) {
          // body = await getProduct(event.pathParameters.id) // GET product/{id}
        } else {
          // body = await getAllProducts() // GET product
        }
        break;
      case 'POST':
        // body = await createProduct(event) // POST /product
        break;
      case 'DELETE':
        // body = await deleteProduct(event.pathParameters!.id) // DELETE /product/{id}
        break;
      case 'PUT':
        // body = await updateProduct(event) // PUT /product/{id}
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
