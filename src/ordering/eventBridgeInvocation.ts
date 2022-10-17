import { createOrder } from "./createOrder"

export const eventBridgeInvocation = async (event: any) => {
  console.log(`eventBridgeInvocation function. event : "${event}"`)

  await createOrder(event.detail)
}