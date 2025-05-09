import { User } from "@sap/cds";

import { SalesOrderHeader, SalesOrderHeaders } from "@models/sales";
import { CreationPayloadValidationResult } from "srv/services/sales-order-header/protocols";

export interface SalesOrderHeaderController {
    beforeCreate(params: SalesOrderHeader): Promise<CreationPayloadValidationResult>;
    afterCreate(params: SalesOrderHeaders, loggedUser: User): Promise<void>
}
