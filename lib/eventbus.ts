import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { EventBus, Rule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';

interface EcommerceEventBusProps {
  publisherFunction: IFunction
  targetFunction: IFunction
}

export class EcommerceEventBus extends Construct {
  constructor(scope: Construct, id: string, props: EcommerceEventBusProps) {
    super(scope, id)

    const eventBus = new EventBus(this, 'EcommerceEventBus', {
      eventBusName: 'EcommerceEventBus',
    })

    const checkoutBasketRule = new Rule(this, 'CheckoutBasketRule', {
      eventBus: eventBus,
      enabled: true,
      description: 'When Basket microservice checkout the basket',
      eventPattern: {
        source: ['com.ecommerce.basket.checkout'],
        detailType: ['CheckoutBasket']
      },
      ruleName: 'CheckoutBasketRule'
    })

    checkoutBasketRule.addTarget(new LambdaFunction(props.targetFunction))

    eventBus.grantPutEventsTo(props.publisherFunction)
  }

}