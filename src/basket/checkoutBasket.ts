import { APIGatewayEvent } from "aws-lambda";

export const checkoutBasket = async (event: APIGatewayEvent) => {
  // publish an event to eventBridge - this will subscribe by order microservice and start ordering process.
}