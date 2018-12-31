import { Component, Element, Prop, State } from "@stencil/core";

@Component({
  tag: "test-carousel",
  styleUrl: "test-carousel.css",
  shadow: true
})
export class MyComponent {
  /**
   * The first name
   */
  @Prop() images: string[];
  @Prop() title: string;
  @Prop() cardWidth: number = 300;
  @State() hostWidth: number;
  @State() currentImage: number = 0;
  @State() children: Array<any> = [];
  @Element() host: HTMLDivElement;

  componentWillLoad() {
    this.children = Array.from(this.host.children);
    this.host.innerHTML = "";
    window.addEventListener(
      "resize",
      this.debounce(this.getCarouselWidth, 100, false),
      false
    );
  }

  componentDidLoad() {
    this.getCarouselWidth();
  }

  debounce(func: Function, wait: number, immediate: boolean): any {
    let timeout: any;
    return () => {
      const context: this = this;
      const args: IArguments = arguments;
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow: boolean = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  private renderCurrentImage() {
    if (!this.children.length) {
      return null;
    }
    const image = this.children[this.currentImage];
    return (
      <li
        class="slides__slide"
        style={{ width: `${this.cardWidth}px` }}
        innerHTML={image.outerHTML}
      />
    );
  }

  getCarouselWidth(): number {
    return (this.hostWidth = this.host.getBoundingClientRect().width);
  }

  private nextSlide() {
    this.currentImage =
      this.currentImage + 1 > this.children.length - 1
        ? 0
        : this.currentImage + 1;
  }

  private previousSlide() {
    this.currentImage =
      this.currentImage - 1 < 0
        ? this.children.length - 1
        : this.currentImage - 1;
  }

  render() {
    return (
      <div>
        <h2>{this.title}</h2>
        <ul class="slides">{this.renderCurrentImage()}</ul>
        <div class="controls">
          <button onClick={() => this.previousSlide()}>&lt;</button>
          <button onClick={() => this.nextSlide()}>&gt;</button>
        </div>
      </div>
    );
  }
}
