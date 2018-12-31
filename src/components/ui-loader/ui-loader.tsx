declare const L: any;

import { Component, Prop, State } from "@stencil/core";

interface Person {
  age: number;
  birthday: { dmy: string; mdy: string; raw: number };
  credit_card: {
    expiration: string;
    number: string;
    pin: number;
    security: number;
  };
  email: string;
  gender: string;
  name: string;
  password: string;
  phone: string;
  photo: string;
  region: string;
  surname: string;
  title: string;
}

@Component({
  tag: "ui-loader",
  styleUrl: "ui-loader.css",
  shadow: true
})
export class MyComponent {
  @Prop() gender: string;
  @State() person: Person;
  @State() loaded: boolean = false;

  api: string;
  map: HTMLDivElement;

  async componentDidLoad() {
    this.api = `https://uinames.com/api/?gender=${this.gender}&ext`;
    this.person = await fetch(this.api).then(response => {
      this.loaded = true;
      return response.json();
    });
    L.mapbox.accessToken =
      "pk.eyJ1IjoiamptYXJ0dWNjaSIsImEiOiJjaXV0dXc4OHIwMWtrMnpzNXE1aWFhMTl5In0.YJCxDijip_MVA_5xHeNQ7Q";
    var geocoder = L.mapbox.geocoder("mapbox.places"),
      map = L.mapbox.map(this.map, "examples.map-h67hf2ic");

    geocoder.query(this.person.region, showMap);

    function showMap(err, data) {
      if (err) {
        console.log(err);
      }
      // The geocoder can return an area, like a city, or a
      // point, like an address. Here we handle both cases,
      // by fitting the map bounds to an area or zooming to a point.
      if (data.lbounds) {
        map.fitBounds(data.lbounds);
      } else if (data.latlng) {
        map.setView([data.latlng[0], data.latlng[1]], 13);
      }
    }
  }

  render() {
    const mapClass = this.loaded ? "UI__map" : "UI__map UI__map--loading";
    return (
      <div class="UI">
        {!this.loaded && [
          <div class="UI__face-name">
            <div class="UI__face-name__face UI__face-name__face--loading" />
            <span class="UI__loading UI__loading--big" />
          </div>,
          <div class="UI__contact">
            <span class="UI__loading UI__loading--label" />
            <span class="UI__loading" />
            <span class="UI__loading" />
          </div>
        ]}
        {this.loaded && [
          <div class="UI__face-name">
            <img class="UI__face-name__face" src={this.person.photo} />
            <span>{`${this.person.name} ${this.person.surname}`}</span>
          </div>,
          <div class="UI__contact">
            <span>
              <strong>Email: </strong>
              {this.person.email}
            </span>
            <span>
              <strong>Phone: </strong>
              {this.person.phone}
            </span>
          </div>
        ]}
        <div
          class={mapClass}
          id="map"
          ref={el => (this.map = el as HTMLDivElement)}
        />
      </div>
    );
  }
}
