// truncate.ts
import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'truncate'
})
export class TruncatePipe {
    transform(value: string): string {
        let limit = 100;
        let trail = '...';
        if (value) {
            return value.length > limit ? value.substring(0, limit) + trail : value;
        } else {
            return '';
        }
    }
}