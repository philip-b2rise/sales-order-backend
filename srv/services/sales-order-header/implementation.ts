import { SalesOrderHeader } from "@models/sales";
import { CustomerModel } from "srv/models/customer";
import { ProductModel } from "srv/models/product";
import { SalesOrderHeaderModel } from "srv/models/sales-order-header";
import { SalesOrderItemModel } from "srv/models/sales-order-item";
import { CustomerRepository } from "srv/repositories/customer/protocols";
import { ProductRepository } from "srv/repositories/product/protocols";
import { CreationPayloadValidationResult, SalesOrderHeaderService } from "./protocols";

export class SalesOrderHeaderServiceImpl implements SalesOrderHeaderService {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly customerRepository: CustomerRepository
    ) {}

    public async beforeCreate(params: SalesOrderHeader): Promise<CreationPayloadValidationResult> {
        const products = await this.getProductsByIds(params);

        if (!products) {
            return {
                hasError: true,
                error: new Error('Products not found')
            }
        }

        const items = this.getSalesOrderItems(params, products);
        const header = this.getSalesOrderHeader(params, items);
        const customer = await this.getCustomerById(params);

        if (!customer) {
            return {
                hasError: true,
                error: new Error('Customer not found')
            }
        }

        const headerValidationResult = header.validateCreationPayload({customer_id: customer.id});


        if (headerValidationResult.hasError) {
            return headerValidationResult;
        }

        return {
            hasError: false,
            totalAmount: header.calculateDiscount()
        }
    }

    private async getProductsByIds(params: SalesOrderHeader): Promise<ProductModel[] | null> {
        const productsIds: string[] = params.items?.map((item) => item.product_id as string) as string[];
        const products = await this.productRepository.findByIds(productsIds);

        return products;
    }

    private getSalesOrderItems(params: SalesOrderHeader, products: ProductModel[]): SalesOrderItemModel[] {
        const items = params.items?.map((item) => SalesOrderItemModel.create({
            productId: item.product_id as string,
            price: item.price as number,
            quantity: item.quantity as number,
            products
        })) as SalesOrderItemModel[];

        return items;
    }

    private getSalesOrderHeader(params: SalesOrderHeader, items: SalesOrderItemModel[]): SalesOrderHeaderModel {
        const header = SalesOrderHeaderModel.create({
            customerId: params.customer_id as string,
            items
        });

        return header;
    }

    private async getCustomerById(params: SalesOrderHeader): Promise<CustomerModel | null> {
        const customerId = params.customer_id as string;
        const customer = await this.customerRepository.findById(customerId);

        return customer;
    }
}

