import { User } from '@sap/cds';

import { SalesOrderHeader, SalesOrderHeaders } from '@models/sales';

import { Payload as BulkCreateSalesOrderPayload } from '@models/db/types/BulkCreateSalesOrder';
import { CustomerModel } from '@/models/customer';
import { CustomerRepository } from '@/repositories/customer/protocols';
import { LoggedUserModel } from '@/models/logged-user';
import { ProductModel } from '@/models/product';
import { ProductRepository } from '@/repositories/product/protocols';
import { SalesOrderHeaderModel } from '@/models/sales-order-header';
import { SalesOrderHeaderRepository } from '@/repositories/sales-order-header/protocol';
import { SalesOrderItemModel } from '@/models/sales-order-item';
import { SalesOrderLogModel } from '@/models/sales-order-log';
import { SalesOrderLogRepository } from '@/repositories/sales-order-log/protocols';
import { CreationPayloadValidationResult, SalesOrderHeaderService } from '@/services/sales-order-header/protocols';

export class SalesOrderHeaderServiceImpl implements SalesOrderHeaderService {
    constructor(
        private readonly salesOrderHeaderRepository: SalesOrderHeaderRepository,
        private readonly customerRepository: CustomerRepository,
        private readonly productRepository: ProductRepository,
        private readonly salesOrderLogRepository: SalesOrderLogRepository
    ) {}

    public async beforeCreate(params: SalesOrderHeader): Promise<CreationPayloadValidationResult> {
        const productValidationResult = await this.validateProductsOnCreation(params);
        if (!productValidationResult.hasError) {
            return productValidationResult;
        }
        const items = this.getSalesOrderItems(params, productValidationResult.products as ProductModel[]);
        const header = this.getSalesOrderHeader(params, items);
        const customerValidationResult = await this.validateCustomerOnCreation(params);
        if (!customerValidationResult.hasError) {
            return customerValidationResult;
        }

        const headerValidationResult = header.validateCreationPayload({
            customer_id: (customerValidationResult.customer as CustomerModel).id
        });

        if (headerValidationResult.hasError) {
            return headerValidationResult;
        }

        return {
            hasError: false,
            totalAmount: header.calculateDiscount()
        };
    }

    public async afterCreate(
        params: SalesOrderHeaders | BulkCreateSalesOrderPayload[],
        loggedUser: User
    ): Promise<void> {
        const headersAsArray = Array.isArray(params) ? params : ([params] as SalesOrderHeaders);
        const logs: SalesOrderLogModel[] = [];

        for (const header of headersAsArray) {
            const products = (await this.getProductsByIds(header)) as ProductModel[];
            const items = this.getSalesOrderItems(header, products);
            const salesOrderHeader = this.getExistingSalesOrderHeader(header, items);
            const productsData = salesOrderHeader.getProductData();

            for (const product of products) {
                const foundProduct = productsData.find((productData) => productData.id === product.id);
                product.sell(foundProduct?.quantity as number);
                await this.productRepository.updateStock(product);
            }

            const user = this.getLoggedUser(loggedUser);
            const log = this.getSalesOrderLog(salesOrderHeader, user);

            logs.push(log);
        }

        await this.salesOrderLogRepository.create(logs);
    }

    public async bulkCreate(
        headers: BulkCreateSalesOrderPayload[],
        loggedUser: User
    ): Promise<CreationPayloadValidationResult> {
        const bulkCreateHeaders: SalesOrderHeaderModel[] = [];
        for (const headerObject of headers) {
            const productsValidationResult = await this.validateProductsOnCreation(headerObject);
            if (!productsValidationResult.hasError) {
                return productsValidationResult;
            }
            const items = this.getSalesOrderItems(headerObject, productsValidationResult.products as ProductModel[]);
            const header = this.getSalesOrderHeader(headerObject, items);
            const customerValidationResult = await this.validateCustomerOnCreation(headerObject);
            if (!customerValidationResult.hasError) {
                return customerValidationResult;
            }
            const headerValidationResult = header.validateCreationPayload({
                customer_id: customerValidationResult.customer?.id as string
            });
            if (headerValidationResult.hasError) {
                return headerValidationResult;
            }
            bulkCreateHeaders.push(header);
        }
        await this.salesOrderHeaderRepository.bulkCreate(bulkCreateHeaders);
        await this.afterCreate(headers, loggedUser);
        return {
            hasError: false
        };
    }

    private async validateCustomerOnCreation(
        header: SalesOrderHeader | BulkCreateSalesOrderPayload
    ): Promise<CreationPayloadValidationResult> {
        const customer = await this.getCustomerById(header);
        if (!customer) {
            return {
                hasError: true,
                error: new Error('Customer not found')
            };
        }
        return {
            hasError: false,
            customer
        };
    }

    private async validateProductsOnCreation(
        header: SalesOrderHeader | BulkCreateSalesOrderPayload
    ): Promise<CreationPayloadValidationResult> {
        const products = await this.getProductsByIds(header);
        if (!products) {
            return {
                hasError: true,
                error: new Error('Products not found')
            };
        }
        return {
            hasError: false,
            products
        };
    }

    private async getProductsByIds(
        params: SalesOrderHeader | BulkCreateSalesOrderPayload
    ): Promise<ProductModel[] | null> {
        const productsIds: string[] = params.items?.map((item) => item.product_id as string) as string[];
        const products = await this.productRepository.findByIds(productsIds);

        return products;
    }

    private getSalesOrderItems(
        params: SalesOrderHeader | BulkCreateSalesOrderPayload,
        products: ProductModel[]
    ): SalesOrderItemModel[] {
        const items = params.items?.map((item) =>
            SalesOrderItemModel.create({
                productId: item.product_id as string,
                price: item.price as number,
                quantity: item.quantity as number,
                products
            })
        ) as SalesOrderItemModel[];

        return items;
    }

    private getSalesOrderHeader(
        params: SalesOrderHeader | BulkCreateSalesOrderPayload,
        items: SalesOrderItemModel[]
    ): SalesOrderHeaderModel {
        const header = SalesOrderHeaderModel.create({
            customerId: params.customer_id as string,
            items
        });

        return header;
    }

    private async getCustomerById(
        params: SalesOrderHeader | BulkCreateSalesOrderPayload
    ): Promise<CustomerModel | null> {
        const customerId = params.customer_id as string;
        const customer = await this.customerRepository.findById(customerId);

        return customer;
    }

    private getLoggedUser(loggedUser: User): LoggedUserModel {
        return LoggedUserModel.create({
            id: loggedUser.id,
            roles: loggedUser.roles as string[],
            attributes: {
                id: loggedUser.attr.id as unknown as number,
                groups: loggedUser.attr.groups as unknown as string[]
            }
        });
    }

    private getSalesOrderLog(header: SalesOrderHeaderModel, user: LoggedUserModel): SalesOrderLogModel {
        return SalesOrderLogModel.create({
            headerId: header.id,
            userData: user.toStringifiedObject(),
            orderData: header.toStringifiedObject()
        });
    }

    private getExistingSalesOrderHeader(
        header: SalesOrderHeader | BulkCreateSalesOrderPayload,
        items: SalesOrderItemModel[]
    ): SalesOrderHeaderModel {
        return SalesOrderHeaderModel.with({
            id: header.id as string,
            customerId: header.customer_id as string,
            items,
            totalAmount: header.totalAmount as number
        });
    }
}
