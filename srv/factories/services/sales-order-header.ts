import { CustomerRepositoryImpl } from '@/repositories/customer/implementation';
import { ProductRepositoryImpl } from '@/repositories/product/implementation';
import { SalesOrderHeaderService } from '@/services/sales-order-header/protocols';
import { SalesOrderHeaderServiceImpl } from '@/services/sales-order-header/implementation';
import { SalesOrderLogRepositoryImpl } from '@/repositories/sales-order-log/implementation';

const makeSalesOrderHeaderService = (): SalesOrderHeaderService => {
    const customerRepository = new CustomerRepositoryImpl();
    const productRepository = new ProductRepositoryImpl();
    const salesOrderLogRepository = new SalesOrderLogRepositoryImpl();

    const service = new SalesOrderHeaderServiceImpl(customerRepository, productRepository, salesOrderLogRepository);

    return service;
};

export const salesOrderHeaderService = makeSalesOrderHeaderService();
