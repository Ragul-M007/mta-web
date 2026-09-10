import { HostListener, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import  moment from 'moment';

import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ImageCroppedEvent } from 'ngx-image-cropper';
import { DataService } from '../../service/data.service';
import { HttpService } from '../../service/http.service';

@Component({
  selector: 'app-newsfeed',
  templateUrl: './newsfeed.component.html',
  styleUrls: ['./newsfeed.component.scss'],
})
export class NewsfeedComponent implements OnInit {
  @ViewChild('closeModal') private closeModal: ElementRef;
  @ViewChild('fileInput') private fileInput: any;
  images: any;
  showReplies: boolean = false;
  chatList: any = [];
  // chatList=[{'showReplies':false,'picture':'application/1614062892487_image_picker6503659757908921466.jpg','name':'Suresh','role':'owner','gymName':'TMF Gym','date':"Feb 25",'replies':[{'name':"Admin",'message':"Lorem Ipsum is simply dummy text of the printing and typesetting industry",'date':"Feb 25"},{'name':"Suresh",'message':"Lorem Ipsum is simply dummy text of the printing and typesetting industry",'date':"Feb 25"}],'message':'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. '},
  // {'showReplies':false,'name':'Saranya','role':'Refilling Agent','gymName':'','date':"Feb 25",'replies':[{'name':"Admin",'message':"Lorem Ipsum is simply dummy text of the printing and typesetting industry",'date':"Feb 25"},{'name':"Saranya",'message':"Lorem Ipsum is simply dummy text of the printing and typesetting industry",'date':"Feb 25"}],'message':'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. '}]
  createOffForm: FormGroup;
  messageList: any = [];
  socket: any;
  conversationList: any;
  message: string;
  tempChatList: any = [];
  searchDate: any;
  usersList: any = [];
  feedForm: FormGroup;
  userRolesList: any = [];
  showAdd: boolean;
  showPassword: boolean;
  addProjectForm: any;
  gymImage: any;
  showImg: boolean;
  imageChangedEvent: any;
  croppedImage: File;
  usersListCus: any = [];
  usersListStaf: any = [];
  usersListCont: any = [];
  usersListVend: any = [];
  usersListC: any = [];
  cityList: any = [];
  url: any;
  files: any;
  fileName: any;
  uploadForm: any;
  feedList: any = [];
  feedTypeList: any = [
    { id: 'N', name: 'NewsFeed' },
    { id: 'H', name: 'Hightlights' },
  ];
  hightlightList: any = [];
  searchText: string;
  selectedFeed: any = {};
  action: string = 'Add';
  deleteFd: any;
  selectedFeedV: any = {};
  filterfeedResults: any = [];
  filterhighResults: any = [];
  get frm() {
    return this.feedForm.controls;
  }
  constructor(
    public dataService: DataService,
    public formBuilder: FormBuilder,
    public http: HttpService,
    private router: ActivatedRoute,
    public route: Router
  ) { }

  ngOnInit(): void {
    this.newForm();
    this.getFeeds();
  }

  addModal() {
    this.showAdd = true;
    this.showPassword = true;
    // this.images = './../../../assets/image/Camera.png';
    this.feedForm.reset();
  }

  getFeeds() {
    this.http
      .getMethod('newsfeed')
      .then((response: any) => {
        this.feedList = [];

        this.hightlightList = [];
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].feed_type == 'N') {
            this.feedList.push(response.data[i]);
          } else {
            this.hightlightList.push(response.data[i]);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  adduser() {
    // this.images = './../../../assets/image/user.svg';
    this.action = 'Add';
  }
  newForm() {
    this.feedForm = this.formBuilder.group({
      feedType: ['', Validators.compose([Validators.required])],
      title: ['', Validators.compose([Validators.required])],
      filename: ['', Validators.compose([])],
      description: ['', Validators.compose([Validators.required])],
    });
  }

  async uploadSubmit() {
    console.log('FeedForm--->',this.feedForm.value);
    
    if (this.feedForm.status == 'VALID') {
      console.log('called');
      

      let deleteconfirm = await this.dataService.showDelete(
        'NewsFeed / Highlights',
        'Confirm to proceed with upload',
        'Confirm'
      );
      if (deleteconfirm == true) {
        if (this.action == 'Add') {
          // var req = {
          //   title_text: this.feedForm.value.title,
          //   feed_type: this.feedForm.value.feedType,
          //   description: this.feedForm.value.description,
          //   img_url: this.url,
          // };
          // var formData = new FormData();
          // formData.append("feed_type", this.feedForm.value.feedType);
          // formData.append("img_url", this.url);
          // formData.append("title_text", this.feedForm.value.title);
          // formData.append("description", this.feedForm.value.description);

          let request = {
            "feed_type": this.feedForm.value.feedType,
            "img_url": this.url,
            "title_text": this.feedForm.value.title,
            "description": this.feedForm.value.description
          }

          console.log('req', request);
          this.http
            .postMethod('newsfeed', request)
            .then((response: any) => {
              this.dataService.showSuccess('success', response.message);
              this.getFeeds();
              this.images = '';
              this.url = null
              this.feedForm.reset();
              this.fileInput.nativeElement.value = '';
              this.closeModal.nativeElement.click();
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          var request = {};
          if (!this.showImg) {
            request = {
              title_text: this.feedForm.value.title,
              feed_type: this.feedForm.value.feedType,
              description: this.feedForm.value.description,
              img_url: this.url,
            };
          } else {
            request = {
              title_text: this.feedForm.value.title,
              feed_type: this.feedForm.value.feedType,
              description: this.feedForm.value.description,
              img_url: this.url
            };
          }

          this.http
            .putMethod('newsfeed/' + this.selectedFeed.id, request)
            .then((response: any) => {
              this.dataService.showSuccess('success', response.message);
              this.getFeeds();
              this.images = '';
              this.feedForm.reset();
              this.fileInput.nativeElement.value = '';
              this.closeModal.nativeElement.click();
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    } else {
      this.dataService.markFormGroupTouched(this.feedForm)
    }
  }

  async deleteFeed(item) {
    this.deleteFd = await this.dataService.showDelete(
      'Please Confirm',
      'The respected NewsFeed / Highlight will be Deleted?',
      'Delete'
    );

    if (this.deleteFd == true) {
      this.http
        .deleteMethod('newsfeed/' + item.id, '')
        .then((response: any) => {
          this.dataService.showSuccess('success', response.message);
          this.getFeeds();
          this.closeModal.nativeElement.click();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }


  async uploadFileToServer(file) {
    return new Promise((resolve, reject) => {
      console.log(file);
      var reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = function (res) {
        resolve(res.target.result);
      };
      reader.onerror = function (err) {
        console.log('there are some problems');
        reject(err);
      };
    });
  }


  highlights() {
    this.searchText = '';
    // this.url = '';
  }

  feeds() {
    this.searchText = '';
    // this.url = '';
  }

  viewFeed(data) {
    this.selectedFeed = {};
    this.selectedFeedV = data;
  }
  editFeed(data) {

    this.selectedFeed = {};
    this.selectedFeed = data;

    var feedType_id;
    for (var i = 0; i < this.feedTypeList.length; i++) {
      if (data.feed_type == this.feedTypeList[i].name) {
        feedType_id = this.feedTypeList[i].id;
      }
    }
    // this.feedForm.patchValue({
    //   title: data.title_text,
    //   feedType: data.feed_type,
    //   description: data.description,
    // });

    this.feedForm = this.formBuilder.group({
      feedType: [data.feed_type, Validators.compose([Validators.required])],
      title: [data.title_text, Validators.compose([Validators.required])],
      filename: ['', Validators.compose([])],
      description: [data.description, Validators.compose([Validators.required])],
    });

    this.images = this.http.imageURL + data.img_url;
    this.action = 'Edit';
  }



  //  async fileChangeEvent(event: any) {


  //    this.imageChangedEvent = event;

  //         const file = this.imageChangedEvent.target.files[0];


  //     if (file) {
  //       const allowedTypes = ['image/jpeg', 'image/gif', 'image/png'];

  //       if (!allowedTypes.includes(file.type)) {
  //         this.fileInput.nativeElement.value = '';
  //         this.images = ''
  //         this.showImg = false;
  //         this.dataService.showError("Error", "Only Image Formats Accept!")
  //       } else {

  //         this.fileName = file.name;
  //         // this.showImg = true;
  //         this.url = this.imageChangedEvent.target.files[0];


  //       }
  //     }
  //   }

  fileChangeEvent(event: any): void {

    const file = event.target.files[0];

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/gif', 'image/png'];

      if (!allowedTypes.includes(file.type)) {
        // Invalid file type
        this.images = ''
        this.dataService.showError("Error", "Only Image Formats Accept!")
        this.fileInput.nativeElement.value = '';
      } else {
        // Valid file type
        // this.form.get('image').setErrors(null);
        this.showImg = true;
        this.convertImageToBase64(file);

      }
    }
  }

  convertImageToBase64(file: File): void {
    const reader = new FileReader();

    reader.onload = (e) => {
      this.images = e.target?.result;
      this.url = e.target?.result;
    };

    reader.readAsDataURL(file);
  }

  imageCropped(event: ImageCroppedEvent) {
    this.images = event.base64;
    this.croppedImage = this.base64ToFile(
      event.base64,
      this.imageChangedEvent.target.files[0].name,
    )
    return this.croppedImage;
  }


  base64ToFile(data, filename) {
    const arr = data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Check if the Tab key is pressed
    if (event.key === 'Tab') {
      // Prevent the default tab behavior
      event.preventDefault();
    }
  }
}
