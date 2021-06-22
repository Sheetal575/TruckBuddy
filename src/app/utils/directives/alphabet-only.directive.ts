import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
    selector: '[appAlphabetOnly]'
})

export class AlphabetOnlyDirective {
    key;
    @HostListener('keydown', ['$event']) onKeydown(event: KeyboardEvent) {
        this.key = event.keyCode;
        if ((this.key >= 15 && this.key <= 64 &&
            (this.key != 46 || this.key != 9 || this.key != 8) && this.key != 32 && this.key != 37 && this.key != 39)
            || (this.key >= 123) || (this.key >= 96 && this.key <= 105)) {
            event.preventDefault();
        }
    }
}
