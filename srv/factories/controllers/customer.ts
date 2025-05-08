import { CustomerControllerImpl } from "srv/controllers/customer/implementations";
import { CustomerController } from "srv/controllers/customer/protocols";
import { customerService } from "../services/customer";

const makeCustomerController = (): CustomerController => {
    return new CustomerControllerImpl(customerService);
}

export const customerController = makeCustomerController();
