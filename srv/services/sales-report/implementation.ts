import { ExpectedResult as SalesReportByDays } from '@models/db/types/SalesReportByDays';

import { SalesReportRepository } from '@/repositories/sales-report/protocol';
import { SalesReportService } from '@/services/sales-report/protocol';

export class SalesReportServiceImpl implements SalesReportService {
    constructor(private readonly repository: SalesReportRepository) {}

    public async findByDays(days = 7): Promise<SalesReportByDays[] | null> {
        const reportData = await this.repository.findByDays(days);

        if (!reportData) {
            return null;
        }

        return reportData.map((report) => report.toObject());
    }

    public async findByCustomerId(customerId: string): Promise<SalesReportByDays[] | null> {
        const reportData = await this.repository.findByCustomerId(customerId);

        if (!reportData) {
            return null;
        }

        return reportData.map((report) => report.toObject());
    }
}
