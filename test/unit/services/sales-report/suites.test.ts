/* eslint-disable max-lines-per-function */
import { describe, expect, it, vi } from 'vitest';

import { SalesReportRepository } from '@/repositories/sales-report/protocol';
import { SalesReportService } from '@/services/sales-report/protocol';
import { SalesReportServiceImpl } from '@/services/sales-report/implementation';
import { NotFoundError, ServerError } from '@/errors';

import { SalesReportRepositoryStub } from '@tests/unit/services/sales-report/stubs';

type SutTypes = {
    sut: SalesReportService;
    salesReportRepository: SalesReportRepository;
};

const makeSut = (): SutTypes => {
    const salesReportRepository = new SalesReportRepositoryStub();

    return { sut: new SalesReportServiceImpl(salesReportRepository), salesReportRepository };
};

describe('SalesReportService test cases', () => {
    it('should throw if SalesReportRepository throws', async () => {
        const { sut, salesReportRepository } = makeSut();

        vi.spyOn(salesReportRepository, 'findByDays').mockRejectedValueOnce(() => {
            throw new ServerError('any_error');
        });

        const result = await sut.findByDays();

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(ServerError);
    });

    it('should return a not found error if no recors were found', async () => {
        const { sut, salesReportRepository } = makeSut();

        vi.spyOn(salesReportRepository, 'findByDays').mockReturnValueOnce(Promise.resolve(null));

        const result = await sut.findByDays();

        expect(result.isLeft()).toBeTruthy();
        expect(result.value).toBeInstanceOf(NotFoundError);
    });

    it('should return a list of sales report by days', async () => {
        const { sut } = makeSut();

        const result = await sut.findByDays();

        expect(result.isRight()).toBeTruthy();
        expect(result.value).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    salesOrderTotalAmount: 100,
                    customerFullName: 'any_name any_last_name'
                })
            ])
        );
    });
});
