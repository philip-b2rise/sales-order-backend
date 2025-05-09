import { Customers, Product, Products, SalesOrderHeaders, SalesOrderItems } from '@models/sales';
import cds, { Request, Service } from '@sap/cds';
import { customerController } from './factories/controllers/customer';
import { salesOrderHeaderController } from './factories/controllers/sales-order-header';
import { HttpStatus } from './http';
import { CompleteRequest } from './protocols';
import { CustomerServiceImpl } from './services/customer/implementation';
export default (service: Service) => {
    service.before('READ', '*', (request: Request) => {
        if (!request.user.is('read_only_user')) {
            return request.reject(HttpStatus.FORBIDDEN, 'Access denied')
        }
    });

    service.before(['WRITE', 'DELETE'], '*', (request: Request) => {
        if (!request.user.is('admin')) {
            return request.reject(HttpStatus.FORBIDDEN, 'Access denied for write/delete operations')
        }
    });

    service.after('READ', 'Customers', (results: Customers, request) => {
        const completeRequest = request as unknown as CompleteRequest<Customers>;
        
        completeRequest.results = customerController.afterRead(results);

        const service = new CustomerServiceImpl();
        return service.afterRead(results);
    });

    service.before('CREATE', 'SalesOrderHeaders', async (request: Request) => {
        const params = request.data;
        const result = await salesOrderHeaderController.beforeCreate(params);

        if (result.hasError) {
            return request.reject(HttpStatus.BAD_REQUEST, result.error?.message as string);
        }
        
        request.data.totalAmount = result.totalAmount;
    });

    service.after('CREATE', 'SalesOrderHeaders', async (results: SalesOrderHeaders, request: Request) => {
        const headersAsArray = Array.isArray(results) ? results : [results] as SalesOrderHeaders;

        for (const header of headersAsArray) {
            const items = header.items as SalesOrderItems;
            const productsData = items.map((item) => {
                return {
                    id: item.product_id as string,
                    quantity: item.quantity as number
                }
            });

            const productsIds: string[]= productsData.map((productData) => productData.id);
            const productsQuery = SELECT.from('sales.Products').where({ id: productsIds });
            const products: Products = await cds.run(productsQuery);
            
            for (const productData of productsData) {
                const foundProduct = products.find((product) => product.id === productData.id) as Product;
                foundProduct.stock = (foundProduct.stock as number) - productData.quantity;

                await cds.update('sales.Products').where({ id: foundProduct.id }).with({ stock: foundProduct.stock });
            };
            const headersAsString = JSON.stringify(header);
            const userAsString = JSON.stringify(request.user);

            const log = [{
                header_id: header.id,
                userData: userAsString,
                orderData: headersAsString
            }];
            await cds.create('sales.SalesOrderLogs').entries(log)
        };
    });
}
