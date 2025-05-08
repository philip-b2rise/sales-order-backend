import { Customers } from "@models/sales";
import { CustomerService } from "srv/services/customer/protocols";
import { CustomerController } from "./protocols";

export class CustomerControllerImpl implements CustomerController {
    constructor(private readonly service: CustomerService) {}

    public afterRead(customerList: Customers): Customers {
        return this.service.afterRead(customerList);
    }
}
