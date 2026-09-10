import { Component, ChangeDetectorRef,AfterViewInit,ViewChild,ElementRef,EventEmitter,Output,Input } from '@angular/core';
import { HttpService } from '../../service/http.service';

interface LatLng {
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'app-googlemaps',
  templateUrl: './googlemaps.component.html',
  styleUrls: ['./googlemaps.component.scss']
})
export class GooglemapsComponent implements AfterViewInit {
   /**Google Maps */
   @ViewChild('map') mapElement: ElementRef;
   map!: google.maps.Map;
   marker!: google.maps.Marker;
   currentMarker!:google.maps.Marker
   latitude: any = 11.016868873458;
   longitude: any = 76.96627199045038;
   zoom: number = 8;
   display: any;
   markerOptions: google.maps.MarkerOptions = { draggable: true };
   @Input() addressType!: string;
   @Output() setAddress: EventEmitter<any> = new EventEmitter();
   @ViewChild('addresstext') addresstext: any;
   autocompleteInput!: string;
   queryWait!: boolean;
   newCenter: google.maps.LatLngLiteral = { lat: this.latitude, lng: this.longitude };
   longitudes!: any;
   latitudes!: any;
   place!: google.maps.places.PlaceResult;
   link: string = '';
   combinedCoordinates!:string;
   options: any[] = [];
   geocoder!: google.maps.Geocoder;
   coordinates: LatLng | null = null; 

  constructor(
    public http: HttpService,
 
    private cdr: ChangeDetectorRef,
  ) { }

  ngAfterViewInit(): void {
    this.initializeMap();
    this.getPlaceAutocomplete();
    this.geocoder = new google.maps.Geocoder();
  }

/**Google Maps*/
  
initializeMap(): void {
  this.map = new google.maps.Map(this.mapElement.nativeElement, {
    center: { lat: this.latitude, lng: this.longitude },
    zoom: this.zoom
  });

  this.map.addListener('click', (event: google.maps.MapMouseEvent) => this.addMarker(event));
  this.getPlaceAutocomplete()
}

updateWithLatLng(lats: any, lngs: any): void {
  const lat = Number(lats);
  const lng = Number(lngs);

  // Check if lat and lng are valid numbers
  if (isNaN(lat) || isNaN(lng)) {
      console.error('Invalid latitude or longitude values:', lats, lngs);
      return;
  }

  console.log('lat: any, lng: any', lat, lng);

  this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: { lat: lat, lng: lng },
      zoom: 16
  });

  // Add a marker at the specified location
 this.marker = new google.maps.Marker({
      position: { lat: lat, lng: lng },
      map: this.map,
  });

 
  
  this.map.addListener('click', (event: google.maps.MapMouseEvent) => this.addMarker(event));


  this.marker?.addListener('dragend', (dragEvent: google.maps.MapMouseEvent) => {
    if (dragEvent.latLng) {
      this.updateLatLng(dragEvent.latLng);
    }
  });
}



addMarker(event: google.maps.MapMouseEvent): void {
  if (event.latLng) {
    if (this.marker) {
      this.marker.setMap(null);
    }

    this.marker = new google.maps.Marker({
      position: event.latLng,
      map: this.map,
      animation: google.maps.Animation.DROP,
      ...this.markerOptions
    });

    this.updateLatLng(event.latLng);

    this.marker.addListener('dragend', (dragEvent: google.maps.MapMouseEvent) => {
      if (dragEvent.latLng) {
        this.updateLatLng(dragEvent.latLng);
      }
    });
  }
}

getPlaceAutocomplete() {

  console.log('apicalled');
  const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement, {
    componentRestrictions: { country: ['IND','US'] },
    types: [this.addressType]
  });

  console.log('apiautoCmpltq22222',autocomplete);

  google.maps.event.addListener(autocomplete, 'place_changed', () => {
  const place = autocomplete.getPlace();
  console.log('apiautoCmplt333333',place);

    if (place.geometry && place.geometry.location) {
  console.log('apiautoCmplt77777');

      this.latitude = place.geometry.location.lat();
      this.longitude = place.geometry.location.lng();

      this.map.setCenter({ lat: this.latitude, lng: this.longitude });
      this.map.setZoom(16);

      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport);
      } else {
        this.map.setZoom(16);
      }
      console.log('apiautoCmplt444444');

      this.addMarkers({ latLng: new google.maps.LatLng(this.latitude, this.longitude) });

      this.map.addListener('click', (event: google.maps.MapMouseEvent) => this.addMarkers(event));
      console.log('apiautoCmplt55555555');

      this.invokeEvent(place);
      console.log('apiautoCmplt6666666');

    } else {
      alert("Cannot retrieve location details for this place");
    }
  });
}

addMarkers(event: google.maps.MapMouseEvent | { latLng: google.maps.LatLng }) {
  if (this.marker) {
    this.marker.setMap(null);
  }

  this.marker = new google.maps.Marker({
    position: event.latLng,
    map: this.map,
    animation: google.maps.Animation.DROP,
    draggable: true
  });

 if (event.latLng !== null) {
this.updateLatLng(event.latLng); 
}

  this.marker.addListener('dragend', () => {
    if (this.marker && this.marker.getPosition()) {
      const position = this.marker.getPosition();
      if (position) {
        this.updateLatLng(position);
        console.log(`Marker dragged to: ${this.latitude}, ${this.longitude}`);
      }
    }
  });
}

invokeEvent(place: Object) {
  console.log('places',place);
  this.setAddress.emit(place);
}

extractCoordinates() {
  this.coordinates = this.http.getLatLngFromLink(this.link);
  if (this.coordinates) {
    // Convert this.coordinates to google.maps.LatLng object
    const latLng = new google.maps.LatLng(this.coordinates.latitude, this.coordinates.longitude);

    // Remove the existing marker if it exists
    if ( this.marker) {
      this.marker.setMap(null);
    }

    // Create a new marker
    this.marker = new google.maps.Marker({
      position: { lat: this.coordinates.latitude, lng: this.coordinates.longitude },
      map: this.map,
      animation: google.maps.Animation.DROP,
      title: 'Extracted Location'
    });

    this.updateLatLng(latLng);
    this.map.setCenter({ lat: this.coordinates.latitude, lng: this.coordinates.longitude });
    this.map.setZoom(16);

  } else {
    alert('Coordinates are null');
  }
}


updateLatLng(latLng: google.maps.LatLng) {
  this.display = latLng.toJSON();
  this.latitudes = this.display.lat.toString();
  this.longitudes = this.display.lng.toString();

  this.combinedCoordinates = this.latitudes+','+this.longitudes
  console.log('Updated LatLng:', this.display);
  this.cdr.detectChanges();
}

getLocation(e:any) {
  var longi : any;
  longi = e.target.value.split(',');
  this.latitudes = longi[0];
  this.longitudes = longi[1];
}



}

