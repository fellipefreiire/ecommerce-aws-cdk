import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class EcommerceDatabase extends Construct {
  public readonly productTable: dynamodb.ITable
  public readonly basketTable: dynamodb.ITable

  constructor(scope: Construct, id: string) {
    super(scope, id)

    // Product DynamoDb Table Creation
    const productTable = new dynamodb.Table(this, 'product', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      tableName: 'product',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    })

    // Basket DynamoDb Table Creation
    const basketTable = new dynamodb.Table(this, 'basket', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      tableName: 'basket',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    })

    this.productTable = productTable
    this.basketTable = basketTable
  }
}