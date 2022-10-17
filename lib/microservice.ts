import { Construct } from 'constructs';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { join } from 'path';

interface EcommerceMicroservicesProps {
  productTable: ITable
  basketTable: ITable
  orderTable: ITable
}

export class EcommerceMicroservices extends Construct {
  public readonly productMicroservice: NodejsFunction
  public readonly basketMicroservice: NodejsFunction
  public readonly orderingMicroservice: NodejsFunction

  constructor(
    scope: Construct,
    id: string,
    props: EcommerceMicroservicesProps
  ) {
    super(scope, id)

    //product microservice
    this.productMicroservice = this.createProductFunction(props.productTable)
    //basket microservice
    this.basketMicroservice = this.createBasketFunction(props.basketTable)
    //order microservice
    this.orderingMicroservice = this.createOrderingMicroservice(props.orderTable)
  }

  private createProductFunction(productTable: ITable): NodejsFunction {
    const productFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: [
          'aws-sdk'
        ],
        minify: true,
      },
      environment: {
        PRIMARY_KEY: 'id',
        DYNAMODB_TABLE_NAME: productTable.tableName
      },
      runtime: lambda.Runtime.NODEJS_16_X
    }

    const productFunction = new NodejsFunction(this, 'productLambdaFunction', {
      entry: join(__dirname, `/../src/product/index.ts`),
      ...productFunctionProps,
    })

    productTable.grantReadWriteData(productFunction)

    return productFunction
  }

  private createBasketFunction(basketTable: ITable): NodejsFunction {
    const basketFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: [
          'aws-sdk'
        ],
        minify: true,
      },
      environment: {
        PRIMARY_KEY: 'userName',
        DYNAMODB_TABLE_NAME: basketTable.tableName,
        EVENT_SOURCE: 'com.ecommerce.basket.checkoutbasket',
        EVENT_DETAIL_TYPE: 'CheckoutBasket',
        EVENT_BUS_NAME: "EcommerceEventBus"
      },
      runtime: lambda.Runtime.NODEJS_16_X
    }

    const basketFunction = new NodejsFunction(this, 'basketLambdaFunction', {
      entry: join(__dirname, `/../src/basket/index.ts`),
      ...basketFunctionProps,
    })

    basketTable.grantReadWriteData(basketFunction)

    return basketFunction
  }

  private createOrderingMicroservice(orderTable: ITable): NodejsFunction {
    const orderingFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: [
          'aws-sdk'
        ],
        minify: true,
      },
      environment: {
        PRIMARY_KEY: 'userName',
        SORT_KEY: 'orderDate',
        DYNAMODB_TABLE_NAME: orderTable.tableName
      },
      runtime: lambda.Runtime.NODEJS_16_X
    }

    const orderingFunction = new NodejsFunction(this, 'orderingLambdaFunction', {
      entry: join(__dirname, `/../src/ordering/index.ts`),
      ...orderingFunctionProps,
    })

    orderTable.grantReadWriteData(orderingFunction)

    return orderingFunction
  }
}