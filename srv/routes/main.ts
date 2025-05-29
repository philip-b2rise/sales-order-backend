/* eslint-disable max-lines-per-function */
import '../configs/module-alias';

import { Request, Service } from '@sap/cds';

import { Customers, SalesOrderHeaders } from '@models/sales';

import { HttpStatus } from '@/utils/http';
import { customerController } from '@/factories/controllers/customer';
import { salesOrderHeaderController } from '@/factories/controllers/sales-order-header';
import { salesReportController } from '@/factories/controllers/sales-report';

export default (service: Service) => {
    service.before('READ', '*', (request: Request) => {
        if (!request.user.is('read_only_user') && !request.user.is('admin')) {
            return request.reject(HttpStatus.FORBIDDEN, 'Access denied');
        }
    });
    service.before(['WRITE', 'DELETE'], '*', (request: Request) => {
        if (!request.user.is('admin')) {
            return request.reject(HttpStatus.FORBIDDEN, 'Access denied for write/delete operations');
        }
    });
    service.after('READ', 'Customers', (results: Customers, request: Request) => {
        const result = customerController.afterRead(results);
        if (result.status >= 400) {
            return request.reject(result.status, result.data as string);
        }
        return result.data;
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
    service.on('getSalesReportByDays', async (request: Request) => {
        const days = request.data?.days || 7;
        const result = await salesReportController.findByDays(days);
        if (result.status >= 400) {
            return request.reject(result.status, result.data as string);
        }
        return result.data;
    });
    service.on('getSalesReportByCustomerId', async (request: Request) => {
        const [{ id: customerId }] = request.params as unknown as { id: string }[];
        const result = await salesReportController.findByCustomerId(customerId);
        if (result.status >= 400) {
            return request.reject(result.status, result.data as string);
        }
        return result.data;
    });
    service.on('bulkCreateSalesOrder', async (request: Request) => {
        const { user, data } = request;
        return salesOrderHeaderController.bulkCreate(data.payload, user);
    });
    service.on('cloneSalesOrder', async (request: Request) => {
        const [{ id }] = request.params as unknown as { id: string }[];
        const { user } = request;
        return salesOrderHeaderController.cloneSalesOrder(id, user);
    });
};
