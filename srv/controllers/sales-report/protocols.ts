import { BaseControllerResponse } from '@/controllers/base/protocol';
import { ExpectedResult as SalesReportByDays } from '@models/db/types/SalesReportByDays';

export interface SalesReportController {
    findByDays(days: number): Promise<BaseControllerResponse>;
    findByCustomerId(customerId: string): Promise<SalesReportByDays[] | null>;
}
