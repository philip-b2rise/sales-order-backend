import { Customer, Customers } from "@models/sales"

const customer: Customer = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com'
}

const customers: Customers = [customer]

console.log(customers)
