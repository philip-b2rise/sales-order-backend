import { Either } from '@sweet-monads/either';

import { Customers } from '@models/sales';

import { AbstractError } from '@/errors';

export interface CustomerService {
    afterRead(customerList: Customers): Either<AbstractError, Customers>;
}
