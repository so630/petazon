import { Directive,
  Input,
  TemplateRef,
  ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[rerender]'
})
export class ReRenderDirective {
  constructor(
    private templateRef:    TemplateRef<any>,
    private viewContainer:  ViewContainerRef
  ) {}

  // if detects changes of the input `val`, clear and rerender the view
  @Input() set rerender(val) {
    console.log(val);
    this.viewContainer.clear();
    this.viewContainer.createEmbeddedView(this.templateRef);
  }
}
