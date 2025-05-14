import { SalesReportRepositoryImpl } from '@/repositories/sales-report/implementation';
import { SalesReportService } from '@/services/sales-report/protocol';
import { SalesReportServiceImpl } from '@/services/sales-report/implementation';

export const makeSalesReportService = (): SalesReportService => {
    const repository = new SalesReportRepositoryImpl();
    return new SalesReportServiceImpl(repository);
};

export const salesReportService = makeSalesReportService();
