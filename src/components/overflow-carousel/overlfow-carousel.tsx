import { Component, Element, Prop, State } from "@stencil/core";

@Component({
  tag: "overflow-carousel",
  styleUrl: "overflow-carousel.css",
  shadow: true
})
export class MyComponent {
  // the number of child cards. We can figured this out automatically in the future.
  @Prop() numCards: number = 3;
  @Prop() images: string[];
  @Prop() title: string;
  @State() cardWidth: number = 300;
  @State() cardHeight: number;
  @State() hostWidth: number;
  @State() currentImage: number = 0;
  @State() sliderActive: boolean = false;
  @State() children: Array<any> = [];
  @Element() host: HTMLDivElement;

  componentWillLoad() {
    window.addEventListener(
      "resize",
      this.debounce(this.checkSliderState, 100, false),
      false
    );
  }

  async componentDidLoad() {
    this.getCarouselWidth();
    const firstCard = this.host.firstElementChild;
    const cardWidth = firstCard.getBoundingClientRect().width;
    var img = firstCard.querySelector("img");

    await img.onload;

    // this is gross and probably doesn't work in some cases.
    const cardMargin = window.getComputedStyle(firstCard, null).marginLeft;
    this.cardWidth = cardWidth + parseFloat(cardMargin.replace("px", "")) * 2;

    this.cardHeight = firstCard.getBoundingClientRect().height;
    this.isSliderActive();
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

  getCarouselWidth(): number {
    return (this.hostWidth = this.host.getBoundingClientRect().width);
  }

  private checkSliderState() {
    this.getCarouselWidth();
    this.isSliderActive();
  }

  private isSliderActive() {
    if (this.cardWidth * this.numCards > this.hostWidth) {
      this.sliderActive = true;
    } else {
      this.sliderActive = false;
    }
  }

  private setActiveCard(card: number) {
    this.currentImage = card;
  }

  private buildControls() {
    const dots = [];

    for (let i = 0; i < this.numCards; i++) {
      const buttonClass = `Overflow-carousel__controls__dot${
        this.currentImage === i
          ? " Overflow-carousel__controls__dot--active"
          : ""
      }`;
      dots.push(
        <button class={buttonClass} onClick={() => this.setActiveCard(i)} />
      );
    }
    return dots;
  }

  private getLeftPosition() {
    const offset = this.cardWidth * this.currentImage;
    return offset * -1;
  }

  render() {
    const trackClass = `Overflow-carousel__images__track${
      this.sliderActive ? " Overflow-carousel__images__track--active" : ""
    }`;
    const trackStyle = {
      left: this.sliderActive ? `${this.getLeftPosition()}px` : `0`
    };

    return (
      <div class="Overflow-carousel">
        <h2>{this.title}</h2>
        <div
          class="Overflow-carousel__images"
          style={{ height: `${this.cardHeight}px` }}
        >
          <div class={trackClass} style={trackStyle}>
            <slot />
          </div>
        </div>
        <div class="Overflow-carousel__controls">
          {this.sliderActive && this.buildControls()}
        </div>
      </div>
    );
  }
}
