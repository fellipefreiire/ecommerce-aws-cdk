import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { EventBus, Rule } from 'aws-cdk-lib/aws-events';
import { SqsQueue } from 'aws-cdk-lib/aws-events-targets';
import { IQueue } from 'aws-cdk-lib/aws-sqs';

interface EcommerceEventBusProps {
  publisherFunction: IFunction
  targetQueue: IQueue
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
        source: ['com.ecommerce.basket.checkoutbasket'],
        detailType: ['CheckoutBasket']
      },
      ruleName: 'CheckoutBasketRule'
    })

    checkoutBasketRule.addTarget(new SqsQueue(props.targetQueue))

    eventBus.grantPutEventsTo(props.publisherFunction)
  }

}