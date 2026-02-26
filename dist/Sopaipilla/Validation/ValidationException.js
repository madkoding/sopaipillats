export class ValidationException extends Error {
    errors;
    constructor(errors) {
        super('Validation failed');
        this.errors = errors;
        this.name = 'ValidationException';
    }
}
//# sourceMappingURL=ValidationException.js.map