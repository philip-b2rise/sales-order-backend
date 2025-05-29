import { Either, left, right } from '@sweet-monads/either';

import { ExpectedResult as SalesReportByDays } from '@models/db/types/SalesReportByDays';

import { SalesReportRepository } from '@/repositories/sales-report/protocol';
import { SalesReportService } from '@/services/sales-report/protocol';
import { AbstractError, NotFoundError, ServerError } from '@/errors';

export class SalesReportServiceImpl implements SalesReportService {
    private readonly NOT_FOUND_ERROR_MESSAGE = 'Report data not found';

    constructor(private readonly repository: SalesReportRepository) {}

    public async findByDays(days = 7): Promise<Either<AbstractError, SalesReportByDays[]>> {
        try {
            const reportData = await this.repository.findByDays(days);

            if (!reportData) {
                const stack = new Error().stack as string;
                return left(new NotFoundError(this.NOT_FOUND_ERROR_MESSAGE, stack));
            }

            const mappedData = reportData.map((report) => report.toObject());

            return right(mappedData);
        } catch (error) {
            const errorInstance: Error = error as Error;
            return left(new ServerError(errorInstance.stack as string, errorInstance.message));
        }
    }

    public async findByCustomerId(customerId: string): Promise<Either<AbstractError, SalesReportByDays[]>> {
        try {
            const reportData = await this.repository.findByCustomerId(customerId);

            if (!reportData) {
                const stack = new Error().stack as string;
                return left(new NotFoundError(this.NOT_FOUND_ERROR_MESSAGE, stack));
            }

            const mappedData = reportData.map((report) => report.toObject());

            return right(mappedData);
        } catch (error) {
            const errorInstance: Error = error as Error;
            return left(new ServerError(errorInstance.stack as string, errorInstance.message));
        }
    }
}
