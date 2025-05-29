import { SalesReportModel } from '@/models/sales-report';
import { SalesReportRepository } from '@/repositories/sales-report/protocol';

export class SalesReportRepositoryStub implements SalesReportRepository {
    public async findByCustomerId(customerId: string): Promise<SalesReportModel[] | null> {
        const salesOrderId = crypto.randomUUID();
        const result: SalesReportModel[] = [
            SalesReportModel.with({
                salesOrderId,
                salesOrderTotalAmount: 100,
                customerId,
                customerFullName: 'any_name any_last_name'
            })
        ];

        return result;
    }

    public async findByDays(days: number): Promise<SalesReportModel[] | null> {
        void days;

        const customerId = crypto.randomUUID();
        const salesOrderId = crypto.randomUUID();

        const result: SalesReportModel[] = [
            SalesReportModel.with({
                salesOrderId,
                salesOrderTotalAmount: 100,
                customerId,
                customerFullName: 'any_name any_last_name'
            })
        ];

        return result;
    }
}
