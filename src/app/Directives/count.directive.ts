import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCount]'
})
export class CountDirective implements OnInit {

  @Input("appCount") count!: number;

  constructor(private elementRef: ElementRef, private render: Renderer2) { }
  ngOnInit(): void {
    const isCountExists = this.count > 0 ? this.count : 'Empty';
    this.render.setProperty(this.elementRef.nativeElement, "innerText", isCountExists)
  }

}
