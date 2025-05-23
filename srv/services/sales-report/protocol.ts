import { ExpectedResult as SalesReportByDays } from '@models/db/types/SalesReportByDays';

export interface SalesReportService {
    findByDays(days: number): Promise<SalesReportByDays[] | null>;
    findByCustomerId(customerId: string): Promise<SalesReportByDays[] | null>;
}
