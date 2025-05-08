import cds from '@sap/cds';

import { CustomerModel } from "srv/models/customer";
import { CustomerRepository } from "./protocols";

export class CustomerRepositoryImpl implements CustomerRepository {
    public async findById(id: string): Promise<CustomerModel | null> {
        const customerQuery = SELECT.one.from('sales.Customers').where({ id });
        const customer = await cds.run(customerQuery);

        if (!customer) {
            return null;
        }

        return CustomerModel.with({
            id: customer.id as string,
            firstName: customer.firstName as string,
            lastName: customer.lastName as string,
            email: customer.email as string,
        });
    }
}
