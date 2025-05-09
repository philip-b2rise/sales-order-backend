import { CustomerController } from '@/controllers/customer/protocols';
import { CustomerControllerImpl } from '@/controllers/customer/implementations';
import { customerService } from '../services/customer';

const makeCustomerController = (): CustomerController => {
    return new CustomerControllerImpl(customerService);
};

export const customerController = makeCustomerController();
