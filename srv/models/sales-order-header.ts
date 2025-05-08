import { SalesOrderItemModel } from "./sales-order-item";

type SalesOrderHeaderProps = {
    id: string;
    customerId: string;
    totalAmount: number;
    items: SalesOrderItemModel[];
}

type SalesOrderHeaderPropsWithoutIdAndTotalAmount = Omit<SalesOrderHeaderProps, 'id' | 'totalAmount'>;

type CreationPayload = {
    customer_id: SalesOrderHeaderProps['customerId'];
}

type CreationPayloadValidationResult = {
    hasError: boolean;
    error?: Error;
}

export class SalesOrderHeaderModel {
    constructor(private props: SalesOrderHeaderProps) {}

    public static create(props: SalesOrderHeaderPropsWithoutIdAndTotalAmount): SalesOrderHeaderModel {
        return new SalesOrderHeaderModel({
            ...props,
            id: crypto.randomUUID(),
            totalAmount: 0
        });
    }

    public get id() {
        return this.props.id;
    }

    public get customerId() {
        return this.props.customerId;
    }

    public get totalAmount() {
        return this.props.totalAmount;
    }

    public get items() {
        return this.props.items;
    }

    public set totalAmount(amount: number) {
        this.props.totalAmount = amount;
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

    public calculateTotalAmount(): number { 
        this.totalAmount = 0;
        this.items.forEach((item) => {
            this.totalAmount += (item.quantity as number) * (item.price as number);
        });

        return this.totalAmount;
    }

    public calculateDiscount(): number {
        this.totalAmount = this.calculateTotalAmount();
        if (this.totalAmount > 30000) {
            this.totalAmount = this.totalAmount * 0.9;
        }

        return this.totalAmount;
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
