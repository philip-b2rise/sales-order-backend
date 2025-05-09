import { SalesOrderHeader, SalesOrderHeaders } from "@models/sales";

export type CreationPayloadValidationResult = {
    hasError: boolean;
    totalAmount?: number;
    error?: Error;
}

export interface SalesOrderHeaderService {
    beforeCreate(params: SalesOrderHeader): Promise<CreationPayloadValidationResult>
    afterCreate(params: SalesOrderHeaders): Promise<void>
}
