export class AbstractError extends Error {
    public code: number;

    constructor(message: string, code: number, stack: string) {
        super(message);
        this.code = code;
        this.message = message;
        this.stack = stack;
    }
}
