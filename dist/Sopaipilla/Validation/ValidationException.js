export class ValidationException extends Error {
    constructor(errors) {
        super('Validation failed');
        this.errors = errors;
        this.name = 'ValidationException';
    }
}
//# sourceMappingURL=ValidationException.js.map