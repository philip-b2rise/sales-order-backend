import { User } from '@sap/cds';

import { CreationPayloadValidationResult } from 'srv/services/sales-order-header/protocols';
import { SalesOrderHeader, SalesOrderHeaders } from '@models/sales';

export interface SalesOrderHeaderController {
    beforeCreate(params: SalesOrderHeader): Promise<CreationPayloadValidationResult>;
    afterCreate(params: SalesOrderHeaders, loggedUser: User): Promise<void>
}
