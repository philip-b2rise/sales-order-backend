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
    describe('method findByDays test cases', () => {
        it('should return ServerError if SalesReportRepository throws', async () => {
            const { sut, salesReportRepository } = makeSut();
            vi.spyOn(salesReportRepository, 'findByDays').mockRejectedValueOnce(() => {
                throw new ServerError('any_error');
            });

            const result = await sut.findByDays();

            expect(result.isLeft()).toBeTruthy();
            expect(result.value).toBeInstanceOf(ServerError);
        });

        it('should return a NotFoundError if no records were found', async () => {
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

    describe('method findByCustomerId test cases', () => {
        it('should return ServerError if SalesReportRepository throws', async () => {
            const { sut, salesReportRepository } = makeSut();
            vi.spyOn(salesReportRepository, 'findByCustomerId').mockRejectedValueOnce(() => {
                throw new ServerError('any_error');
            });

            const customerId = crypto.randomUUID();
            const result = await sut.findByCustomerId(customerId);

            expect(result.isLeft()).toBeTruthy();
            expect(result.value).toBeInstanceOf(ServerError);
        });

        it('should return a NotFoundError if no records were found', async () => {
            const { sut, salesReportRepository } = makeSut();
            vi.spyOn(salesReportRepository, 'findByCustomerId').mockReturnValueOnce(Promise.resolve(null));

            const customerId = crypto.randomUUID();
            const result = await sut.findByCustomerId(customerId);

            expect(result.isLeft()).toBeTruthy();
            expect(result.value).toBeInstanceOf(NotFoundError);
        });

        it('should return a list of sales report by customer id', async () => {
            const { sut } = makeSut();

            const customerId = crypto.randomUUID();
            const result = await sut.findByCustomerId(customerId);

            expect(result.isRight()).toBeTruthy();
            expect(result.value).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        customerId,
                        salesOrderTotalAmount: 50,
                        customerFullName: 'any_name any_last_name'
                    })
                ])
            );
        });
    });
});
