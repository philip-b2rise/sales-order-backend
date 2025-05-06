import { Customers } from '@models/sales';
import { Service } from '@sap/cds';

export default (service: Service) => {
    service.after('READ', 'Customers', async (results: Customers) => {
        results.forEach(customer => {
            if (!customer.email?.includes('@')) {
                customer.email = `${customer.email}@sap.com`
            }
        })
    })
}
