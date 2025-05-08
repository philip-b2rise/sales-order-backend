import { SalesOrderHeader } from "@models/sales";
import { CreationPayloadValidationResult, SalesOrderHeaderService } from "srv/services/sales-order-header/protocols";
import { SalesOrderHeaderController } from "./protocols";

export class SalesOrderHeaderControllerImpl implements SalesOrderHeaderController {
    constructor(private readonly service: SalesOrderHeaderService) {}

    public async beforeCreate(params: SalesOrderHeader): Promise<CreationPayloadValidationResult> {
        return this.service.beforeCreate(params);
    }   
    
    
}
