import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';

export class EcommerceDatabase extends Construct {
  public readonly productTable: dynamodb.ITable
  public readonly basketTable: dynamodb.ITable

  constructor(scope: Construct, id: string) {
    super(scope, id)

    this.productTable = this.createProductTable() //product table
    this.basketTable = this.createBasketTable() //basket table
  }

  private createProductTable(): ITable {
    const productTable = new dynamodb.Table(this, 'product', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      tableName: 'product',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    })

    return productTable
  }

  private createBasketTable(): ITable {
    const basketTable = new dynamodb.Table(this, 'basket', {
      partitionKey: {
        name: 'userName',
        type: dynamodb.AttributeType.STRING
      },
      tableName: 'basket',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    })

    return basketTable
  }
}