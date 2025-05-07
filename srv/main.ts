import { Customers, Products, SalesOrderItem, SalesOrderItems } from '@models/sales';
import cds, { Request, Service } from '@sap/cds';
import { HttpStatus } from './http';

export default (service: Service) => {
    service.after('READ', 'Customers', (results: Customers) => {
        results.forEach(customer => {
            if (!customer.email?.includes('@')) {
                customer.email = `${customer.email}@sap.com`
            }
        })
    });

    service.before('CREATE', 'SalesOrderHeaders', async (request: Request) => {
        const params = request.data;
        const items: SalesOrderItems = params.items;

        if (!params.customer_id) {
            return request.reject(HttpStatus.BAD_REQUEST, 'Customer ID is required')
        }

        const customerQuery = SELECT.one.from('sales.Customers').where({ id: params.customer_id })
        const customer = await cds.run(customerQuery)

        if (!customer) {
            return request.reject(HttpStatus.NOT_FOUND, 'Customer not found')
        }

        if (!params.items || !params.items?.length) {
            return request.reject(HttpStatus.BAD_REQUEST, 'Items are required')
        }

        const productsIds: string[]= params.items.map((item: SalesOrderItem) => item.product_id);
        const productsQuery = SELECT.from('sales.Products').where({ id: productsIds });
        const products: Products = await cds.run(productsQuery);        

        items.forEach((item) => {
            const foundDbProduct = products.find((product) => product.id === item.product_id);
            if (!foundDbProduct) {
                return request.reject(HttpStatus.BAD_REQUEST, `Product ${item.product_id} not found`)
            }

            if (foundDbProduct.stock === 0) {
                return request.reject(HttpStatus.BAD_REQUEST, `Product ${foundDbProduct.name} (${foundDbProduct.id}) out of stock`)                
            }
        }) 
    })
}
