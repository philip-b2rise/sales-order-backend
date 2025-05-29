import { Either, left, right } from '@sweet-monads/either';

import { Customers } from '@models/sales';

import { CustomerModel } from '@/models/customer';
import { CustomerService } from '@/services/customer/protocols';
import { AbstractError, ServerError } from '@/errors';

export class CustomerServiceImpl implements CustomerService {
    public afterRead(customerList: Customers): Either<AbstractError, Customers> {
        try {
            const customers = customerList.map((customer) => {
                const customerData = CustomerModel.with({
                    id: customer.id as string,
                    firstName: customer.firstName as string,
                    lastName: customer.lastName as string,
                    email: customer.email as string
                });

                return customerData.setDefaultEmailDomain().toObject();
            });
            return right(customers);
        } catch (error) {
            const errorInstance: Error = error as Error;
            return left(new ServerError(errorInstance.stack as string, errorInstance.message));
        }
    }
}
