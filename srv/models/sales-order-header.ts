import { SalesOrderItemModel } from '@/models/sales-order-item';

type SalesOrderHeaderProps = {
    id: string;
    customerId: string;
    totalAmount: number;
    items: SalesOrderItemModel[];
};

type SalesOrderHeaderPropsWithoutIdAndTotalAmount = Omit<SalesOrderHeaderProps, 'id' | 'totalAmount'>;

type SalesOrderHeaderPropsWithSnakeCaseCustomerId = Omit<SalesOrderHeaderProps, 'customerId'> & {
    customer_id: SalesOrderHeaderProps['customerId'];
};

type CreationPayload = {
    customer_id: SalesOrderHeaderProps['customerId'];
};

type CreationPayloadValidationResult = {
    hasError: boolean;
    error?: Error;
};

export class SalesOrderHeaderModel {
    constructor(private props: SalesOrderHeaderProps) {}

    public static create(props: SalesOrderHeaderPropsWithoutIdAndTotalAmount): SalesOrderHeaderModel {
        return new SalesOrderHeaderModel({
            ...props,
            id: crypto.randomUUID(),
            totalAmount: 0
        });
    }

    public static with(props: SalesOrderHeaderProps): SalesOrderHeaderModel {
        return new SalesOrderHeaderModel(props);
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
        };
    }

    public calculateTotalAmount(): number {
        let totalAmount = 0;
        this.items.forEach((item) => {
            totalAmount += (item.quantity as number) * (item.price as number);
        });

        return totalAmount;
    }

    public calculateDiscount(): number {
        let totalAmount = this.calculateTotalAmount();
        if (totalAmount > 30000) {
            totalAmount = totalAmount * 0.9;
        }

        return totalAmount;
    }

    public getProductData(): { id: string; quantity: number }[] {
        return this.items.map((item) => ({
            id: item.productId,
            quantity: item.quantity as number
        }));
    }

    public toStringifiedObject(): string {
        return JSON.stringify(this.props);
    }

    private validateCustomerOnCreation(customerId: CreationPayload['customer_id']): CreationPayloadValidationResult {
        if (!customerId) {
            return {
                hasError: true,
                error: new Error('Customer ID is required')
            };
        }

        return {
            hasError: false
        };
    }

    private validateItemsOnCreation(items: SalesOrderHeaderProps['items']): CreationPayloadValidationResult {
        if (!items || !items.length) {
            return {
                hasError: true,
                error: new Error('Items are required')
            };
        }

        const itemsErrors: string[] = [];

        this.items.forEach((item) => {
            const validationResult = item.validateCreationPayload({ product_id: item.productId });

            if (validationResult.hasError) {
                itemsErrors.push(validationResult.error?.message as string);
            }
        });

        if (itemsErrors.length) {
            const messages = itemsErrors.join('\n - ');
            return {
                hasError: true,
                error: new Error(messages)
            };
        }

        return {
            hasError: false
        };
    }

    public toCreationObject(): SalesOrderHeaderPropsWithSnakeCaseCustomerId {
        return {
            ...this.props,
            customer_id: this.customerId,
            totalAmount: this.calculateDiscount()
        };
    }
}
