type SalesOrderHeaderProps = {
    id: string;
    customerId: string;
}

type CreationPayload = {
    customer_id: SalesOrderHeaderProps['customerId'];
    items: any[];
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

    public validateCreationPayload(payload: CreationPayload): CreationPayloadValidationResult {
        if (!payload.customer_id) {
            return {
                hasError: true,
                error: new Error('Customer ID is required')
            }
        }

        if (!payload.items || !payload.items.length) {
            return {
                hasError: true,
                error: new Error('Items are required')
            }
        }
        

        return {
            hasError: false
        }
    }
    
    
}
