using {sales} from '../../db/schema';
using {db.types.SalesReport} from '../../db/types';

@requires: 'authenticated-user'

// Entities
service MainService {
    entity SalesOrderHeaders  as projection on sales.SalesOrderHeaders;
    entity SalesOrderStatuses as projection on sales.SalesOrderStatuses;
    entity Customers          as projection on sales.Customers actions {
        function getSalesReportByCustomerId() returns array of SalesReport.ExpectedResult
    };
    entity Products           as projection on sales.Products;
    entity SalesOrderLogs     as projection on sales.SalesOrderLogs;
}

// Functions
extend service MainService with {
    function getSalesReportByDays(days : SalesReport.Params : days) returns array of SalesReport.ExpectedResult;
}
