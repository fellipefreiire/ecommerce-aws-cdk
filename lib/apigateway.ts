import { Construct } from "constructs";
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { IFunction } from "aws-cdk-lib/aws-lambda";

interface EcommerceApiGatewayProps {
  productMicroservice: IFunction
}

export class EcommerceApiGateway extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: EcommerceApiGatewayProps
  ) {
    super(scope, id)

    // Product microservice api gateway
    // root name = product

    // GET /product
    // POST / product

    // GET /product/{id}
    // PUT /product/{id}
    // DELETE /product/{id}

    const productAgw = new apigateway.LambdaRestApi(this, 'productAPI', {
      restApiName: 'Product Service',
      handler: props.productMicroservice,
      proxy: false,
    })

    const product = productAgw.root.addResource('product')
    product.addMethod('GET') // GET /product
    product.addMethod('POST') // POST /product

    const singleProduct = product.addResource('{id}') // product/{id}
    singleProduct.addMethod('GET') // GET /product/{id}
    singleProduct.addMethod('PUT') // PUT /product/{id}
    singleProduct.addMethod('DELETE') // DELETE /product/{id}
  }
}