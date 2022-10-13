import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EcommerceDatabase } from './database';
import { EcommerceApiGateway } from './apigateway';
import { EcommerceMicroservices } from './microservice';

export class EcommerceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const database = new EcommerceDatabase(this, 'Database')

    const microservices = new EcommerceMicroservices(this, 'Microservices', {
      productTable: database.productTable,
      basketTable: database.basketTable,
    })

    const apiGateway = new EcommerceApiGateway(this, 'ApiGateway', {
      productMicroservice: microservices.productMicroservice,
      basketMicroservice: microservices.basketMicroservice,
    })
  }
}
