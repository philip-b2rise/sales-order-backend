import { Customers } from '@models/sales';
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
    })
}
