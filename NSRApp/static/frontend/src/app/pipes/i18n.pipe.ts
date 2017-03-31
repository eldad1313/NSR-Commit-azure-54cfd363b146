import { Pipe, PipeTransform } from '@angular/core';
import { i18nMap } from '../maps/i18n.map';
import * as _ from 'lodash';

@Pipe({
    name: 'i18n'
})
export class I18nPipe implements PipeTransform {

    transform(value: string, args?: any): any {
        var res = _.at(i18nMap, [value])[0]
        if (!res && typeof res == 'number') {
            return res;
        }
        return res || value;
    }

}
