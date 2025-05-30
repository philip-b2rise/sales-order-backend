import cds from '@sap/cds';
import { resolve } from 'path';

const rootDir = resolve(__dirname, '..', '..');
const api = cds.test(rootDir);
api.axios.defaults.auth = { username: 'john', password: 'john12' };

describe('GET API Test', () => {
    it('should get all customers with @sap.com email', async () => {
        const { data } = await api.get('/sales-order/Customers');
        const { value: customers } = data;
        console.log(customers);
        expect(2).toBe(2);
        expect(customers).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    email: expect.stringContaining('@sap.com')
                })
            ])
        );
    });
});
