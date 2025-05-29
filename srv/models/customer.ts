export type CustomerProps = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
};

export class CustomerModel {
    constructor(private props: CustomerProps) {}

    public static with(props: CustomerProps) {
        return new CustomerModel(props);
    }

    public get id() {
        return this.props.id;
    }

    public get firstName() {
        return this.props.firstName;
    }

    public get lastName() {
        return this.props.lastName;
    }

    public get email() {
        return this.props.email;
    }

    public setDefaultEmailDomain(): CustomerModel {
        if (!this.props.email) {
            return this;
        }

        if (!this.props.email?.includes('@')) {
            this.props.email = `${this.props.email}@sap.com`;
        }

        return this;
    }

    public toObject() {
        return this.props;
    }
}
