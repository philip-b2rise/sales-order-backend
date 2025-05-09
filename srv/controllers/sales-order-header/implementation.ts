import { User } from '@sap/cds';

import { SalesOrderHeaderController } from './protocols';
import { CreationPayloadValidationResult, SalesOrderHeaderService } from 'srv/services/sales-order-header/protocols';
import { SalesOrderHeader, SalesOrderHeaders } from '@models/sales';

export class SalesOrderHeaderControllerImpl implements SalesOrderHeaderController {
    constructor(private readonly service: SalesOrderHeaderService) {}

    public async beforeCreate(params: SalesOrderHeader): Promise<CreationPayloadValidationResult> {
        return this.service.beforeCreate(params);
    }   

    public async afterCreate(params: SalesOrderHeaders, loggedUser: User): Promise<void> {
        return this.service.afterCreate(params, loggedUser);
    }
}
