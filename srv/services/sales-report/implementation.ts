import { Either, left, right } from '@sweet-monads/either';

import { ExpectedResult as SalesReportByDays } from '@models/db/types/SalesReportByDays';

import { SalesReportRepository } from '@/repositories/sales-report/protocol';
import { SalesReportService } from '@/services/sales-report/protocol';
import { AbstractError, NotFoundError, ServerError } from '@/errors';

export class SalesReportServiceImpl implements SalesReportService {
    constructor(private readonly repository: SalesReportRepository) {}

    public async findByDays(days = 7): Promise<Either<AbstractError, SalesReportByDays[]>> {
        try {
            const reportData = await this.repository.findByDays(days);

            if (!reportData) {
                const stack = new Error().stack as string;
                return left(new NotFoundError('Report data not found', stack));
            }

            const mappedData = reportData.map((report) => report.toObject());

            return right(mappedData);
        } catch (error) {
            const errorInstance: Error = error as Error;
            return left(new ServerError(errorInstance.stack as string, errorInstance.message));
        }
    }

    public async findByCustomerId(customerId: string): Promise<SalesReportByDays[] | null> {
        const reportData = await this.repository.findByCustomerId(customerId);

        if (!reportData) {
            return null;
        }

        return reportData.map((report) => report.toObject());
    }
}
