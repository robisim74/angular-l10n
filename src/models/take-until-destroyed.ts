import { MonoTypeOperatorFunction, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Logger } from '../models/logger';

export function takeUntilDestroyed(target: any): MonoTypeOperatorFunction<any> {
    const destroy: Subject<boolean> = new Subject<boolean>();
    const targetNgOnDestroy: Function = target.ngOnDestroy;

    function ngOnDestroy(this: any): void {
        destroy.next(true);
        destroy.complete();

        if (targetNgOnDestroy) {
            targetNgOnDestroy.apply(this);
        } else {
            Logger.log(this.constructor ? this.constructor.name : 'takeUntilDestroyed', 'missingOnDestroy');
        }
    }
    target.ngOnDestroy = ngOnDestroy;

    return takeUntil(destroy);
}
