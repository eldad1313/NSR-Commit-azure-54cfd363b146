import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'ordinal'
})
export class OrdinalPipe implements PipeTransform {

    transform(int: number, args?: any): string {
        if (!args) {
            var args: any = {};
            args.showNum = true;
        }

        const ones = +int % 10
        const tens = +int % 100 - ones;
        let ordinalStr;

        if (tens === 10 || ones > 3) {
            ordinalStr = 'th';
        } else {
            ordinalStr = ['th', 'st', 'nd', 'rd'][ones];
        }

        return args.showNum ? int + ordinalStr : ordinalStr;
    }
}
