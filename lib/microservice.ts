import { Construct } from 'constructs';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';

interface EcommerceMicroservicesProps {
  productTable: ITable
}

export class EcommerceMicroservices extends Construct {
  public readonly productMicroservice: NodejsFunction

  constructor(
    scope: Construct,
    id: string,
    props: EcommerceMicroservicesProps
  ) {
    super(scope, id)

    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: [
          'aws-sdk'
        ],
        minify: true,
      },
      environment: {
        PRIMARY_KEY: 'id',
        DYNAMODB_TABLE_NAME: props.productTable.tableName
      },
      runtime: lambda.Runtime.NODEJS_16_X
    }

    // Product microservice lambda function
    const productMicroservice = new NodejsFunction(this, 'productLambdaFunction', {
      entry: join(__dirname, `/../src/product/index.ts`),
      ...nodeJsFunctionProps,
    })

    props.productTable.grantReadWriteData(productMicroservice)

    this.productMicroservice = productMicroservice
  }
}