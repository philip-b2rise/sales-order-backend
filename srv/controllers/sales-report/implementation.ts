import { ExpectedResult as SalesReportByDays } from '@models/db/types/SalesReportByDays';

import { BaseControllerImpl } from '@/controllers/base/implementation';
import { BaseControllerResponse } from '@/controllers/base/protocol';
import { SalesReportController } from '@/controllers/sales-report/protocols';
import { SalesReportService } from '@/services/sales-report/protocol';

export class SalesReportControllerImpl extends BaseControllerImpl implements SalesReportController {
    constructor(private readonly service: SalesReportService) {
        super();
    }

    public async findByDays(days: number): Promise<BaseControllerResponse> {
        const result = await this.service.findByDays(days);

        if (result.isLeft()) {
            return this.error(result.value.code, result.value.message);
        }

        return this.success(result.value);
    }

    public async findByCustomerId(customerId: string): Promise<SalesReportByDays[] | null> {
        return this.service.findByCustomerId(customerId);
    }
}
