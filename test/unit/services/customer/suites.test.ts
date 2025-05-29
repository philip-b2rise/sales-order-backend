/* eslint-disable max-lines-per-function */
import { describe, expect, it } from 'vitest';

import { Customer } from '@models/sales';

import { CustomerService } from '@/services/customer/protocols';
import { CustomerServiceImpl } from '@/services/customer/implementation';

type SutTypes = {
    sut: CustomerService;
};

const makeSut = (): SutTypes => {
    return {
        sut: new CustomerServiceImpl()
    };
};

const id = crypto.randomUUID();

const getCustomersWithoutEmail = (): Customer[] => {
    return [
        {
            id,
            firstName: 'any_name',
            lastName: 'any_last_name',
            email: ''
        }
    ];
};

const getCustomersWithFullEmail = (): Customer[] => {
    return [
        {
            id,
            firstName: 'any_name',
            lastName: 'any_last_name',
            email: 'any_email@sap.com'
        }
    ];
};

const getCustomersWithInvalidEmail = (): Customer[] => {
    return [
        {
            id,
            firstName: 'any_name',
            lastName: 'any_last_name',
            email: 'any_email'
        }
    ];
};

describe('CustomerService Implementation test cases', () => {
    it('should verify if the afterRead method works with an empty customers array', () => {
        const { sut } = makeSut();

        const customers = [];
        const expectedResult = customers;

        const result = sut.afterRead(customers);
        expect(result.value).toEqual(expectedResult);
    });

    it('should verify if the afterRead method works with a customers array with an undefined or empty email', () => {
        const { sut } = makeSut();

        const customers = getCustomersWithoutEmail();
        const expectedResult = customers;

        const result = sut.afterRead(customers);
        expect(result.value).toEqual(expectedResult);
    });

    it('should verify if the afterRead method works with a customers array with a full email', () => {
        const { sut } = makeSut();

        const customers = getCustomersWithFullEmail();
        const expectedResult = customers;

        const result = sut.afterRead(customers);
        expect(result.value).toEqual(expectedResult);
    });

    it('should verify if the afterRead method works with a customers array with an invalid email', () => {
        const { sut } = makeSut();

        const customers = getCustomersWithInvalidEmail();
        const expectedResult = [
            {
                id,
                firstName: 'any_name',
                lastName: 'any_last_name',
                email: 'any_email@sap.com'
            }
        ];

        const result = sut.afterRead(customers);
        expect(result.value).toEqual(expectedResult);
    });
});
