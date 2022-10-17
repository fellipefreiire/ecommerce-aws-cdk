import { createOrder } from './createOrder';

export const sqsInvocation = async (event: any) => {
  console.log(`sqsInvocation function. event: "${event}"`)
  console.log(event.Records)

  for (const record of event.Records) {
    console.log('Record: %j', record)
    const checkoutEventRequest = JSON.parse(record.body)
    await createOrder(checkoutEventRequest.detail)
      .then((res) => {
        console.log(res)
      })
      .catch((error) => console.error(error))
  }
}