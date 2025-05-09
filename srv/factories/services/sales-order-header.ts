import { CustomerRepositoryImpl } from 'srv/repositories/customer/implementation';
import { ProductRepositoryImpl } from 'srv/repositories/product/implementation';
import { SalesOrderHeaderService } from 'srv/services/sales-order-header/protocols';
import { SalesOrderHeaderServiceImpl } from 'srv/services/sales-order-header/implementation';
import { SalesOrderLogRepositoryImpl } from 'srv/repositories/sales-order-log/implementation';

const makeSalesOrderHeaderService = (): SalesOrderHeaderService => {
    const customerRepository = new CustomerRepositoryImpl();
    const productRepository = new ProductRepositoryImpl();
    const salesOrderLogRepository = new SalesOrderLogRepositoryImpl();

    const service = new SalesOrderHeaderServiceImpl(customerRepository, productRepository, salesOrderLogRepository);

    return service;
};

export const salesOrderHeaderService = makeSalesOrderHeaderService();
