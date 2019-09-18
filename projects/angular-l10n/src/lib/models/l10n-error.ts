import { Type } from '@angular/core';

export function l10nError(type: Type<any> | any, value: string): string {
    return `angular-l10n (${type.name}): ${value}`;
}
