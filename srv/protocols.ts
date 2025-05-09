import { Request } from '@sap/cds';

export type CompleteRequest<ExpectedResult> = Request & {
    results: ExpectedResult;
}
