import { BaseController } from '@/controllers/base/protocol';
import { BaseControllerResponse } from '@/controllers/base/protocol';

export class BaseControllerImpl implements BaseController {
    public success(data: unknown): BaseControllerResponse {
        return {
            data,
            status: 200
        };
    }

    public error(code: number, message: string): BaseControllerResponse {
        return {
            status: code,
            data: message
        };
    }
}
