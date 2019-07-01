import { Directive, ElementRef, Renderer, HostListener, HostBinding, Input } from '@angular/core';
import { hostViewClassName } from '@angular/compiler';

@Directive({
  selector: '[appMydirective]',
  host: {  
  }
})

export class MydirectiveDirective {
  
  constructor(private el: ElementRef,
    private renderer: Renderer) {
    this.ChangeBgColor('red');
  }

  ChangeBgColor(color: string) {
    this.renderer.setElementStyle(this.el.nativeElement, 'color', color);
  }

  @HostListener('click') onClick() {
    window.alert('Host Element Clicked');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.ChangeBgColor('black');
  }

  @HostListener('mouseover') onMouseHover() {
    this.ChangeBgColor('green');
  }

  @HostBinding('class') @Input()  classname: string;
}
