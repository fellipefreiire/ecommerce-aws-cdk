import { Construct } from "constructs";
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { IFunction } from "aws-cdk-lib/aws-lambda";

interface EcommerceApiGatewayProps {
  productMicroservice: IFunction
  basketMicroservice: IFunction
  orderingMicroservice: IFunction
}

export class EcommerceApiGateway extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: EcommerceApiGatewayProps
  ) {
    super(scope, id)

    this.createProductApi(props.productMicroservice) // Product api gateway
    this.createBasketApi(props.basketMicroservice) // Basket api gateway
    this.createOrderApi(props.orderingMicroservice)
  }

  private createProductApi(productMicroservice: IFunction) {
    // Product microservice api gateway

    // root name = product
    // GET /product
    // POST / product

    // Single product with id parameter
    // GET /product/{id}
    // PUT /product/{id}
    // DELETE /product/{id}

    const productAgw = new apigateway.LambdaRestApi(this, 'productAPI', {
      restApiName: 'Product Service',
      handler: productMicroservice,
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

  private createBasketApi(basketMicroservice: IFunction) {
    // Basket microservice api gateway
    // root name = basket

    // GET /basket
    // POST / basket

    // resource name = basket/{userName}

    // GET /basket/{userName}
    // DELETE /basket/{userName}

    // POST /basket/checkout

    const basketAgw = new apigateway.LambdaRestApi(this, 'basketAPI', {
      restApiName: 'Basket Service',
      handler: basketMicroservice,
      proxy: false,
    })

    const basket = basketAgw.root.addResource('basket')
    basket.addMethod('GET') // GET /basket
    basket.addMethod('POST') // POST /basket

    const singleBasket = basket.addResource('{userName}') // basket/{userName}
    singleBasket.addMethod('GET') // GET /basket/{userName}
    singleBasket.addMethod('DELETE') // DELETE /basket/{userName}

    const basketCheckout = basket.addResource('checkout')
    basketCheckout.addMethod('POST') // POST /basket/checkout
    // expected request payload: { username: swn }
  }

  private createOrderApi(orderingMicroservice: IFunction) {
    // Ordering microservices api gateway
    // root name = order

    // GET /order
    // GET /order/{userName}
    // expected request : xxx/order/ecommerce?orderDate=timestamp
    // ordering ms grap input and query parameters and filter to dynamo db

    const orderAgw = new apigateway.LambdaRestApi(this, 'orderApi', {
      restApiName: 'Order Serivce',
      handler: orderingMicroservice,
      proxy: false
    })

    const order = orderAgw.root.addResource('order')
    order.addMethod('GET') // GET /order

    const singleOrder = order.addResource('{username}')
    singleOrder.addMethod('GET') // GET /order/{userName}
    // expected request : xxx/order/ecommerce?orderDate=timestamp
    // ordering ms grap input and query parameters and filter to dynamo db
  }
}