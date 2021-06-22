import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
    selector: '[appNumberOnly]'
})

export class NumberOnlyDirective {
    key;
    @HostListener('keydown', ['$event']) onKeydown(event: KeyboardEvent) {
        this.key = event.keyCode;
        if (!(this.key >= 48 && this.key <= 57 || this.key == 8 ||
            this.key >= 96 && this.key <= 105 || this.key == 46 || this.key == 9 || this.key == 37 || this.key == 39)) {
            event.preventDefault();
        }
    }
}
