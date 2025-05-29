import { Customers } from '@models/sales';

import { BaseControllerResponse } from '@/controllers/base/protocol';

export interface CustomerController {
    afterRead(customerList: Customers): BaseControllerResponse;
}
