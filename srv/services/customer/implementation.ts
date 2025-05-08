import { Customers } from "@models/sales";
import { CustomerModel } from "srv/models/customer";
import { CustomerService } from "./protocols";

export class CustomerServiceImpl implements CustomerService {
    public afterRead(customerList: Customers): Customers {
        const customers = customerList.map(customer => {
            const customerData = CustomerModel.with({
                id: customer.id as string,
                firstName: customer.firstName as string,
                lastName: customer.lastName as string,
                email: customer.email as string,
            });

            return customerData.setDefaultEmailDomain().toObject();
        });
        
        return customers;
    }
}
