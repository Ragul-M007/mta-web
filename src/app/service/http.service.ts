import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataService } from './data.service';
import { async } from '@angular/core/testing';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  // UAT URL
  // serverURL = "https://uatmta.multitechcorp.in/mta/";
  // imageURL = "https://uatmta.multitechcorp.in/mta-img/";
  // web_socket_url="https://uatmta.multitechcorp.in:5022/";

  // live URL
  // serverURL = "https://mta.multitechcorp.in/mta/";
  // imageURL = "https://mta.multitechcorp.in/mta-img/";
  // web_socket_url="https://mta.multitechcorp.in:5022/";

  //LOCAL dev (backend on this PC — web opens in browser here)
  serverURL = "http://localhost:3000/mta/";
  imageURL = "http://localhost:3000/mta-img/";
  web_socket_url="http://localhost:5022/";

  defaultImage = "src/assets/image/user.svg";
  paginationCount = 8;



  constructor(private httpClient: HttpClient,
    private dataService: DataService) { }


  //Post method
  //input url, request, header and flag (true- return the failur, false - block the failur)
  //output return the response
  postMethod(path: string, payload: any, flag?: Boolean) {

    let options: any = { headers: this.appendHeaders() }
    return new Promise(async (resolve, reject) => {
      await this.dataService.presentLoading();
      this.httpClient.post(this.serverURL + path, payload, options).subscribe((data: any) => {

        this.dataService.dismissLoading();
        if (data.status == false && !flag) {
          // this.dataService.showError("ALERT",data.response_desc);
          this.dataService.showError("Error", data.message);
        } else {

          resolve(data);
        }
      }, (error) => {

        this.dataService.dismissLoading();
        this.dataService.showError("ALERT", error?.error?.message);
        reject(error);
      });
    });
  }

  //get method
  //input url, header and flag (true- return the failur, false - block the failur)
  //output return the response
  getMethod(path: string, flag?: Boolean) {
    let options: any = { headers: this.appendHeaders() }
    return new Promise(async (resolve, reject) => {
      await this.dataService.presentLoading();
      this.httpClient.get(this.serverURL + path, options).subscribe((data: any) => {
        this.dataService.dismissLoading();
        if (data.status == false && !flag) {
          // this.dataService.showError("ALERT",data.response_desc);
          // if(data.message){ 
          // this.dataService.showError("Error", data.message);
          // };
        } else {
          resolve(data);
        }
      }, (error) => {
        // console.log("error", error);
        this.dataService.dismissLoading();
        // if(error.status == 404){
        //   this.dataService.showError("ALERT", 'No Data Found');
        // }else{
        //   this.dataService.showError("ALERT", 'Please try after some time!');
        // }
        reject(error);
      });
    });
  }

  getMethodAdd(path: string, flag?: Boolean) {
    let options: any = { headers: this.appendHeaders() }
    return new Promise(async (resolve, reject) => {

      this.httpClient.get(this.serverURL + path, options).subscribe((data: any) => {

        if (data.status == false && !flag) {
          // this.dataService.showError("ALERT",data.response_desc);
          // if(data.message){ 
          // this.dataService.showError("Error", data.message);
          // };
        } else {
          resolve(data);
        }
      }, (error) => {
        // console.log("error", error);
        // this.dataService.dismissLoading();
        // if(error.status == 404){
        //   this.dataService.showError("ALERT", 'No Data Found');
        // }else{
        //   this.dataService.showError("ALERT", 'Please try after some time!');
        // }
        reject(error);
      });
    });
  }

  getImage(url) {
    console.log("get image");
    this.httpClient.get(url, { responseType: 'blob' }).subscribe(result => {
      console.log(result);
      return result;
    }, async (error) => {
      console.log("error", error);
      return this.defaultImage;
    });
  }

  //PUT method
  //input url, request, header and flag (true- return the failur, false - block the failur)
  //output return the response
  putMethod(path: string, payload: any, flag?: Boolean) {
    let options: any = { headers: this.appendHeaders() }
    return new Promise(async (resolve, reject) => {
      await this.dataService.presentLoading();
      this.httpClient.put(this.serverURL + path, payload, options).subscribe((data: any) => {
        this.dataService.dismissLoading();
        if (data.status == false && !flag) {
          // this.dataService.showError("ALERT",data.response_desc);
          this.dataService.showError("Error", data.message);
        } else {
          resolve(data);
        }
      }, (error) => {
        this.dataService.dismissLoading();
        this.dataService.showError("ALERT", 'Please try after some time!');
        reject(error);
      });
    });
  }

  //DELETE method
  //input url, request, header and flag (true- return the failur, false - block the failur)
  //output return the response
  deleteMethod(path: string, payload: any, flag?: Boolean) {
    let options: any = { headers: this.appendHeaders() }
    return new Promise(async (resolve, reject) => {
      await this.dataService.presentLoading();
      this.httpClient.delete(this.serverURL + path, options).subscribe((data: any) => {
        this.dataService.dismissLoading();
        if (data.status == false && !flag) {
          // this.dataService.showError("ALERT",data.response_desc);
          this.dataService.showError("Error", data.message);
        } else {
          resolve(data);
        }
      }, (error) => {
        this.dataService.dismissLoading();
        this.dataService.showError("ALERT", 'Please try after some time!');
        reject(error);
      });
    });
  }

  // header
  appendHeaders() {
    this.dataService.getData("token");
    let headers: HttpHeaders;
    headers = new HttpHeaders(
      {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE, PUT',
        'x-access-token': this.dataService.getData("token") ? this.dataService.getData("token") : "",
        'x-refresh-token': this.dataService.getData("token") ? this.dataService.getData("token") : "",
      }
    )
    // 'jwt': this.dataService.authToken,

    // headers = new HttpHeaders({});
    return headers;
  }

  /**Google Maps */
  getLatLngFromLink(link: string): { latitude: number, longitude: number } | null {
    try {
      // Create a URL object from the link
      const url = new URL(link);
      
      // Get the pathname of the URL
      const pathname = url.pathname;
      
      // Regular expression to match the latitude and longitude in the pathname
      const latLngRegex = /@(-?\d+\.\d+),[^,]+,.*!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/;
      const match = pathname.match(latLngRegex);
      
      if (match) {
        // Extract the latitude and longitude from the regex match
        const latitude = parseFloat(match[1]);
        const longitude = parseFloat(match[3]);
        
        return {
          latitude: latitude,
          longitude: longitude
        };
      } else {
        throw new Error('Invalid Google Maps location link');
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
