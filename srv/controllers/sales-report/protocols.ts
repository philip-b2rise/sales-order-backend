import { BaseControllerResponse } from '@/controllers/base/protocol';

export interface SalesReportController {
    findByDays(days: number): Promise<BaseControllerResponse>;
    findByCustomerId(customerId: string): Promise<BaseControllerResponse>;
}
