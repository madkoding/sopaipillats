var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiController, Get } from '../../Sopaipilla/index.js';
export class AppController extends ApiController {
    index(_req, res) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>SopaipillaTS App</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1>SopaipillaTS Application</h1>
      <ul>
        <li><a href="/api/health">API Health</a></li>
        <li><a href="/api/users">Users API</a></li>
      </ul>
    </body>
    </html>`;
    }
    health() {
        return this.json({
            status: 'ok',
            app: 'SopaipillaTS App',
            timestamp: new Date().toISOString(),
        });
    }
}
__decorate([
    Get('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", String)
], AppController.prototype, "index", null);
__decorate([
    Get('/api/health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AppController.prototype, "health", null);
//# sourceMappingURL=AppController.js.map