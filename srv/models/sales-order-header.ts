import { SalesOrderItemModel } from "./sales-order-item";

type SalesOrderHeaderProps = {
    id: string;
    customerId: string;
    items: SalesOrderItemModel[];
}

type CreationPayload = {
    customer_id: SalesOrderHeaderProps['customerId'];
}

type CreationPayloadValidationResult = {
    hasError: boolean;
    error?: Error;
}

export class SalesOrderHeaderModel {
    constructor(private props: SalesOrderHeaderProps) {}

    public get id() {
        return this.props.id;
    }

    public get customerId() {
        return this.props.customerId;
    }

    public get items() {
        return this.props.items;
    }

    public validateCreationPayload(payload: CreationPayload): CreationPayloadValidationResult {
        const customerValidationResult = this.validateCustomerOnCreation(payload.customer_id);

        if (customerValidationResult.hasError) {
            return customerValidationResult;
        }

        const itemsValidationResult = this.validateItemsOnCreation(this.items);

        if (itemsValidationResult.hasError) {
            return itemsValidationResult;
        }        

        return {
            hasError: false
        }
    }

    private validateCustomerOnCreation(customerId: CreationPayload['customer_id']): CreationPayloadValidationResult {
        if (!customerId) {
            return {
                hasError: true,
                error: new Error('Customer ID is required')
            }
        }

        return {
            hasError: false
        }
        
    }

    private validateItemsOnCreation(items: SalesOrderHeaderProps['items']): CreationPayloadValidationResult {
        if (!items || !items.length) {
            return {
                hasError: true,
                error: new Error('Items are required')
            }
        }

        const itemsErrors: string[] = [];
        
        this.items.forEach((item) => {
            const validationResult = item.validateCreationPayload({product_id: item.productId});

            if (validationResult.hasError) {
                itemsErrors.push(validationResult.error?.message as string);
            }
        });

        if (itemsErrors.length) {
            const messages = itemsErrors.join('\n - ');
            return {
                hasError: true,
                error: new Error(messages)
            }
        }

        return {
            hasError: false
        }
    }
}
