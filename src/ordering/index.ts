import { apiGatewayInvocation } from "./apiGatewayInvocation";
import { eventBridgeInvocation } from "./eventBridgeInvocation";
import { sqsInvocation } from "./sqsInvocation";

export const handler = async (event: any) => {
  try {
    console.log('request:', JSON.stringify(event, undefined, 2))

    if (event.Records !== undefined) {
      await sqsInvocation(event)
    }
    else if (event['detail-type'] !== undefined) {
      await eventBridgeInvocation(event)
    } else {
      return await apiGatewayInvocation(event)
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

