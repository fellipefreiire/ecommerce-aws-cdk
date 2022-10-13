import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EcommerceDatabase } from './database';
import { EcommerceApiGateway } from './apigateway';
import { EcommerceMicroservices } from './microservice';
import { EcommerceEventBus } from './eventbus';


export class EcommerceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const database = new EcommerceDatabase(this, 'Database')

    const microservices = new EcommerceMicroservices(this, 'Microservices', {
      productTable: database.productTable,
      basketTable: database.basketTable,
      orderTable: database.orderTable,
    })

    const apiGateway = new EcommerceApiGateway(this, 'ApiGateway', {
      productMicroservice: microservices.productMicroservice,
      basketMicroservice: microservices.basketMicroservice,
    })

    const eventBus = new EcommerceEventBus(this, 'EventBus', {
      publisherFunction: microservices.basketMicroservice,
      targetFunction: microservices.orderingMicroservice,
    })
  }
}
