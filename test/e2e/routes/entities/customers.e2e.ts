import { api } from '@tests/e2e/config/api';

describe('Customers routes', () => {
    describe('afterRead Customers', () => {
        it('should get all customers with @sap.com', async () => {
            const { data } = await api.get('/sales-order/Customers');
            const { value: customers } = data;

            expect(customers).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        email: expect.stringContaining('@sap.com')
                    })
                ])
            );
        });

        it('should return at least one email with @gmail.com', async () => {
            const { data } = await api.get('/sales-order/Customers');
            const { value: customers } = data;

            expect(customers).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        email: expect.stringContaining('@gmail.com')
                    })
                ])
            );
        });
    });
});
