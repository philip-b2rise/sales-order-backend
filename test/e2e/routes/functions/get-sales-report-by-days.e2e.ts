import { api } from '@tests/e2e/config/api';

describe('GetSalesReportByDays route', () => {
    it('should return  404 if no records are found', async () => {
        const request = api.get('/sales-order/getSalesReportByDays()');

        await expect(request).rejects.toThrow('Report data not found');
    });

    it('should return a sales report with status 200', async () => {
        const { data, status } = await api.get('/sales-order/getSalesReportByDays(days=20)');
        const { value: salesReport } = data;
        console.log(salesReport);

        expect(status).toBe(200);
        expect(salesReport).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    salesOrderId: '20592792-3d97-4542-94c4-ec4d1f9e041e',
                    salesOrderTotalAmount: 10894906.21,
                    customerFullName: 'firstName-22781501 lastName-22781501'
                })
            ])
        );
    });
});
