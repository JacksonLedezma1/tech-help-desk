import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    success: boolean;
    data: T;
    message: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        return next.handle().pipe(
            map((data: any) => {
                if (data && typeof data === 'object' && 'message' in data && Object.keys(data).length === 1) {
                    return {
                        success: true,
                        data: null,
                        message: data.message,
                    };
                }

                const { message, ...rest } =
                    data && typeof data === 'object' && 'message' in data ? data : { message: undefined };

                return {
                    success: true,
                    data: data && typeof data === 'object' && 'message' in data ? rest : data ?? null,
                    message: message ?? 'Request successful',
                };
            }),
        );
    }
}
