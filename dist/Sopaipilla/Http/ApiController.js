import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
export class ApiController {
    static allowedOrigin = '*';
    constructor() {
        this.sendSecurityHeaders();
    }
    sendSecurityHeaders() {
        // Will be applied by middleware in Express
    }
    setSecurityHeaders(_req, res) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        res.setHeader('Content-Security-Policy', "default-src 'none'");
        const origin = _req.headers.origin;
        if (ApiController.allowedOrigin === '*') {
            res.setHeader('Access-Control-Allow-Origin', '*');
        }
        else if (origin === ApiController.allowedOrigin) {
            res.setHeader('Access-Control-Allow-Origin', origin);
            res.setHeader('Vary', 'Origin');
        }
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
    json(data, _status = 200) {
        return {
            success: true,
            ...(Array.isArray(data) ? { data } : { data }),
        };
    }
    error(message, _status = 400) {
        return {
            success: false,
            error: message,
        };
    }
    okOr201(data, message = 'Processing error') {
        return data
            ? { success: true, data, status: 201 }
            : { success: false, error: message, status: 500 };
    }
    okOr404(data, message = 'Not found') {
        return data
            ? { success: true, data, status: 200 }
            : { success: false, error: message, status: 404 };
    }
    validationError(errors) {
        return {
            success: false,
            errors,
            status: 422,
        };
    }
    input(req) {
        return req.body;
    }
    async withDto(_dtoClass, req, callback) {
        const input = req.body;
        if (!input || typeof input !== 'object') {
            return this.error('Invalid or empty JSON body', 400);
        }
        const dto = plainToInstance(_dtoClass, input);
        const errors = await validate(dto);
        if (errors.length > 0) {
            const formattedErrors = {};
            for (const err of errors) {
                formattedErrors[err.property] = Object.values(err.constraints || {});
            }
            return this.validationError(formattedErrors);
        }
        return callback(dto);
    }
    sendResponse(res, payload, status = 200) {
        res.status(status).json(payload);
    }
}
//# sourceMappingURL=ApiController.js.map