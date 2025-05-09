import { CustomerService } from 'srv/services/customer/protocols';
import { CustomerServiceImpl } from 'srv/services/customer/implementation';

const makeCustomerService = (): CustomerService => {
    return new CustomerServiceImpl();
};

export const customerService = makeCustomerService();
