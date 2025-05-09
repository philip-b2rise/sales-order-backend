import { Request, Service } from '@sap/cds';

import { CompleteRequest } from './protocols';
import { CustomerServiceImpl } from './services/customer/implementation';
import { HttpStatus } from './utils/http';
import { customerController } from './factories/controllers/customer';
import { salesOrderHeaderController } from './factories/controllers/sales-order-header';
import { Customers, SalesOrderHeaders } from '@models/sales';

export default (service: Service) => {
    service.before('READ', '*', (request: Request) => {
        if (!request.user.is('read_only_user')) {
            return request.reject(HttpStatus.FORBIDDEN, 'Access denied');
        }
    });
    service.before(['WRITE', 'DELETE'], '*', (request: Request) => {
        if (!request.user.is('admin')) {
            return request.reject(HttpStatus.FORBIDDEN, 'Access denied for write/delete operations');
        }
    });
    service.after('READ', 'Customers', (results: Customers, request) => {
        const completeRequest = request as unknown as CompleteRequest<Customers>;
        completeRequest.results = customerController.afterRead(results);
        const service = new CustomerServiceImpl();
        return service.afterRead(results);
    });
    service.before('CREATE', 'SalesOrderHeaders', async (request: Request) => {
        const params = request.data;
        const result = await salesOrderHeaderController.beforeCreate(params);
        if (result.hasError) {
            return request.reject(HttpStatus.BAD_REQUEST, result.error?.message as string);
        }
        request.data.totalAmount = result.totalAmount;
    });
    service.after('CREATE', 'SalesOrderHeaders', async (salesOrderHeaders: SalesOrderHeaders, request: Request) => {
        await salesOrderHeaderController.afterCreate(salesOrderHeaders, request.user);
    });
};
