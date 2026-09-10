import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Location } from '@angular/common';
import moment from 'moment';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { ViewChild, ElementRef } from '@angular/core';
import { map, startWith } from 'rxjs/operators';
// import { IDropdownSettings } from 'ng-multiselect-dropdown';
declare var $: any;
import * as RecordRTC from 'recordrtc';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from '../../service/data.service';
import { HttpService } from '../../service/http.service';
// export interface userList {
//   user_img: string;
//   name: string;
//   user_id:0;
// }
// export interface catList {
//   category_id: string;
//   category_name: string;
//   // user_id:0;
// }
@Component({
  selector: 'app-project-comments',
  templateUrl: './project-comments.component.html',
  styleUrls: ['./project-comments.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectCommentsComponent implements OnInit {
  @ViewChild('closeModal') private closeModal: ElementRef;
  @ViewChild('fileInput') private fileInput: ElementRef;
  commentsData: any = {};
  showReplies: boolean = true;
  chatList: any = [];
  chatListList: any;
  dropdownSettings: any = {
    singleSelection: false,
    idField: 'user_id',
    textField: 'name',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
  };
  dropdownSettingsCat: any = {
    singleSelection: false,
    idField: 'category_id',
    textField: 'category_name',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
  };
  //   chatList:any=[{"name":"Rajesh Kumar",'time':"2 hours ago","message":"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  // "replies":[{"name":"Sanjeev Ram",'time':"2 hours ago","message":"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."}]
  // },{"name":"Sanjeev Ram",'time':"4 hours ago","message":"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  // "replies":[{"name":"Rajesh Kumar",'time':"4 hours ago","message":"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."}]
  // }];
  images: any;

  // chatList=[{'showReplies':false,'picture':'application/1614062892487_image_picker6503659757908921466.jpg','name':'Suresh','role':'owner','gymName':'TMF Gym','date':"Feb 25",'replies':[{'name':"Admin",'message':"Lorem Ipsum is simply dummy text of the printing and typesetting industry",'date':"Feb 25"},{'name':"Suresh",'message':"Lorem Ipsum is simply dummy text of the printing and typesetting industry",'date':"Feb 25"}],'message':'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. '},
  // {'showReplies':false,'name':'Saranya','role':'Refilling Agent','gymName':'','date':"Feb 25",'replies':[{'name':"Admin",'message':"Lorem Ipsum is simply dummy text of the printing and typesetting industry",'date':"Feb 25"},{'name':"Saranya",'message':"Lorem Ipsum is simply dummy text of the printing and typesetting industry",'date':"Feb 25"}],'message':'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. '}]
  createOffForm: FormGroup;
  messageList: any = [];
  socket: any;
  conversationList: any;
  message: string;
  tempChatList: any = [];
  searchDate: any;
  userList: any = [];
  catList: any = [];
  parent_comment_id: any;
  reciepent_name: string;
  reciepent_id: any;
  imageChangedEvent: any;
  fileName: any;
  files: any;
  urlLink: any;
  UserRole: any;
  deletecmd: any;
  handlesio: boolean = true;
  category_name: string;
  category_id: string;
  selectedItems: any = [];
  isSearchDisabled: boolean = false;
  selectedCatItems: any = [];
  multiples: any = {};
  reciepent_list: any = [];
  reciepent_id_list: any = [];
  category_id_list: any = [];
  category_list: any = [];
  microphone: boolean = true;
  reader = new FileReader();
  audioSource: any;
  record: any;
  recording: boolean;
  url: string;
  error: string;
  filterchart: any;
  selectedCommenttoReply: any = {};
  userdetails: any;
  uploadForm: FormGroup;
  superArr: any = [{}];

  get couponFrm() {
    return this.createOffForm.controls;
  }
  get uploadFrm() {
    return this.uploadForm.controls;
  }
  constructor(
    public dataService: DataService,
    public route: ActivatedRoute,
    public http: HttpService,
    public router: Router,
    public formBuilder: FormBuilder,
    private _location: Location,
    private domSanitizer: DomSanitizer
  ) {
    // this.filteredUsers = this.stateCtrl.valueChanges
    // .pipe(
    //   startWith(''),
    //   map(state => state ? this._filterStates(state) : this.userList.slice())
    // );
    // this.filteredcategory = this.catCtrl.valueChanges
    // .pipe(
    //   startWith(''),
    //   map(category => category ? this._filterCats(category) : this.catList.slice())
    // );
  }
  // stateCtrl = new FormControl();
  // catCtrl = new FormControl();
  // filteredUsers: Observable<userList[]>;
  // filteredcategory: Observable<catList[]>;

  // private _filterStates(value: string): userList[] {

  //   const filterValue = value.toLowerCase();
  //   this.reciepent_name=value;
  //   for(var i=0;i< this.userList.length;i++){
  //     if(value == this.userList[i].name){
  //     this.reciepent_id=this.userList[i].user_id;
  //     }
  //   }
  //   return this.userList.filter(state => state.name.toLowerCase().indexOf(filterValue) === 0 );
  // }

  // private _filterCats(value: string): catList[] {
  //   const filterValue = value.toLowerCase();
  //   this.category_name=value;
  //   for(var i=0;i< this.catList.length;i++){
  //     if(value == this.catList[i].category_name){
  //     this.category_id=this.catList[i].category_id;
  //     }
  //   }
  //   return this.catList.filter(category => category.category_name.toLowerCase().indexOf(filterValue) === 0 );
  // }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      let temp = params['data'];

      this.commentsData = JSON.parse(temp);

      if (this.commentsData.from == 'Project') {
        this.getUsers();
        this.getmappedCategory();
        this.userdetails = this.dataService.getData('userData');
      } else {
        this.getCatUsers();
      }
    });

    this.uploadForm = this.formBuilder.group({
      file_upload: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
    });

    this.socket = io(this.http.web_socket_url, {
      path: '',
      forceNew: true,
      reconnectionAttempts: 3,
      timeout: 2000,
      query: {
        token: this.dataService.getData('token'),
        project_id: this.commentsData.project_id,
      },
    });
    this.socket.on('connect', () => {
      var dda = this.dataService.getData('userData');
      this.UserRole = dda.role;
    });

    //this.getConversation();
    // Dominic
    this.getMessages().subscribe((message) => {

      if (this.chatList.length == 0) {
        this.chatList = message;
        this.tempChatList = this.chatList;

        this.chatList = this.chatList.filter((item: any) => {
          return item.comment != '';
        });

        // this.chatListList = this.chatList.length;
        // var c = 0;
        // this.chatList.map((i) => {
        //   console.log("loooping-------------------->",c)
        //   let x = String(i.audio);
        //   console.log("xx",x)
        //   let y = x.split('.');
        //   console.log("y",y)
        //   c++;
        //   Object.assign(i, { filterchart: y[1] }, { count: c });
        //   //Object.assign(i,())
        //   console.log("item>>>>",i)
        // });


        for (let i = 0; i < this.chatList.length; i++) {
          let x = this.chatList[i].audio;
          if (x) {
              let y = x.split('.');
              this.chatList[i].filterchart = y[1];
          }
      
          if (this.chatList[i].replies && this.chatList[i].replies.length > 0) {
              for (let j = 0; j < this.chatList[i].replies.length; j++) {
                  let p = this.chatList[i].replies[j].audio;
                  if (p) {
                      let q = p.split('.');
                      this.chatList[i].replies[j].filterchartRe = q[1];
                  }
              }
          }
      }

      } else if (this.chatList.length != message.length) {
        this.chatList = message;
        this.tempChatList = this.chatList;
      } else {
        for (var i = 0; i < message.length; i++) {
          if (message[i].document_id == this.commentsData.document_id) {
            if (message[i].replies == null) {
              message[i].replies = [];
            }
            let index = this.chatList.indexOf(this.chatList[i]);
            // if(this.chatList[i].replies.length != message.data[i].replies.length){
            if (index != -1) {
              this.chatList[index].replies = message[i].replies;
              // }
            }
          }
        }
      }
      this.handlesio = false;
    });
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Check if the Tab key is pressed
    if (event.key === 'Tab') {
      // Prevent the default tab behavior
      event.preventDefault();
    }
  }
  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }
  /**
   * Start recording.
   */
  initiateRecording() {
    this.recording = true;
    let mediaConstraints = {
      video: false,
      //audio: true,
      audio: { echoCancellation: true },
    };
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }
  /**
   * Will be called automatically.
   */
  successCallback(stream) {
    var options = {
      mimeType: 'audio/wav',
      // numberOfAudioChannels: 1
    };
    //Start Actuall Recording
    var StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
    this.record = new StereoAudioRecorder(stream, options);
    this.record.record();
  }
  /**
   * Stop recording.
   */
  stopRecording(data) {
    this.selectedCommenttoReply = data;
    this.recording = false;

    this.record.stop(this.processRecording.bind(this));
  }
  /**
   * processRecording Do what ever you want with blob
   * @param  {any} blob Blog
   */
  async processRecording(blob) {
    // this.url = URL.createObjectURL(blob);
    // console.log(" this.url",  this.url);

    var base64data = await this.uploadFileToServer(blob);

    var req;
    if (this.parent_comment_id) {
      req = {
        // document_id: this.commentsData.document_id,
        user_id: this.userdetails.user_id,
        audio: base64data,
        comment: this.message,
        parent_comment_id: this.parent_comment_id,
        recipient: this.reciepent_list,
        category_id_list: this.category_id_list,
        category_list: this.category_list,
        recipient_id: this.reciepent_id_list,
      };
    } else {
      req = {
        // document_id: this.commentsData.document_id,
        user_id: this.userdetails.user_id,
        audio: base64data,
        comment: this.message,
        recipient: this.reciepent_list,
        category_id_list: this.category_id_list,
        category_list: this.category_list,
        recipient_id: this.reciepent_id_list,
        project_id: this.commentsData.project_id,
      };
    }

    this.http
      .postMethod('utils/getAudioUrl', req)
      .then((response: any) => {
        this.url = response.data;
        location.reload();
        // if(this.selectedCommenttoReply){
        //   this.initSocket("",this.selectedCommenttoReply);
        //   }else{
        //     this.initSocket("",this.commentsData);
        //   }
     
      })
      .catch((err) => {
        console.log(err);
      });
  }
  /**
   * Process Error.
   */
  errorCallback(error) {
    this.error = 'Can not play audio in your browser';
  }

  async uploadSubmit(data) {
    //console.log("Valid=====",this.uploadForm.status)
    //if (this.uploadForm.status == 'VALID') {
    // var formData: any = new FormData();


    //}
  }

  async uploadFileToServer(file) {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = function (res) {
        resolve(res.target.result);
      };
      reader.onerror = function (err) {
        reject(err);
      };
    });
  }
  getCatUsers() {
    this.http
      .getMethod(
        'categories/getCatUsers?project_id=' +
        this.commentsData.project_id +
        '&category_id=' +
        this.commentsData.category_id
      )
      .then((response: any) => {
        this.userList = response.data;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getmappedCategory() {
    this.http
      .getMethod('categories?project_id=' + this.commentsData.project_id)
      .then((response: any) => {
        this.catList = response.data;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  getUsers() {
    this.http
      .getMethod(
        'projects/getmappedUser?project_id=' + this.commentsData.project_id
      )
      .then((response: any) => {
        let res = response.data;
        this.userList = res;
        // for(var i=0; i < res.length;i++){
        //   if (res[i].role_id == 6){
        //     this.usersListCus.push(res[i]);
        //   }else if(res[i].role_id == 2){
        //     this.usersListStaf.push(res[i]);
        //   }
        //   else if(res[i].role_id == 3){
        //     this.usersListCont.push(res[i]);
        //   }
        //   else if(res[i].role_id == 4 || res[i].role_id == 5){
        //     this.usersListVend.push(res[i]);
        //   }
        //   else if(res[i].role_id == 5){
        //     this.usersListC.push(res[i]);
        //   }
        // }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  initSocket(msg, item) {

    // this.socket = io(this.http.web_socket_url,{"path":"","forceNew":true,
    // "reconnectionAttempts":3,"timeout":2000,
    // "query":{
    //   "token":this.dataService.getData('token'),
    //   "document_id":this.commentsData.document_id
    // }});

    //dominic
    //console.log('this.reciepent_id',this.reciepent_id);
    if (item?.comment_id == undefined) {
      // console.log('first fucnt');
      this.socket.emit(
        'create-project-comment',
        JSON.stringify({
          user_id: this.userdetails.user_id,
          project_id: this.commentsData.project_id,
          project_name: this.commentsData.project_name,
          audio: this.url,
          comment: msg,
          // document_id: item.document_id,
          recipient_id: JSON.stringify(this.reciepent_id_list),
          recipient: JSON.stringify(this.reciepent_list),
          category_id_list: JSON.stringify(this.category_id_list),
          category_list: JSON.stringify(this.category_list),
        })
      );
      this.handlesio = true;
    } else {
      // console.log('secondd fucnt');
      this.socket.emit(
        'create-project-comment',
        JSON.stringify({
          user_id: this.userdetails.user_id,
          project_id: this.commentsData.project_id,
          project_name: this.commentsData.project_name,
          audio: this.url,
          comment: msg,
          // document_id: this.commentsData.document_id,
          parent_comment_id: item.comment_id,
          recipient_id: JSON.stringify(this.reciepent_id_list),
          recipient: JSON.stringify(this.reciepent_list),
          category_id_list: JSON.stringify(this.category_id_list),
          category_list: JSON.stringify(this.category_list),
        })
      );
      this.handlesio = true;
    }
    // let projectid
    // if (this.commentsData.project_id == 583) {
    //   projectid = 570;
    // }
    // else {
    //   projectid = this.commentsData.project_id;
    // }

    // this.socket.emit(
    //   'joinRoom', JSON.stringify({
    //     "group_type": "project",
    //     "project_id": projectid,
    //     "team_id": null
    //   }));

    this.reciepent_id_list = [];
    this.reciepent_list = [];
    this.category_id_list = [];
    this.category_list = [];
  }

  updateSocket(item) {
    this.socket = io(this.http.web_socket_url, {
      path: '',
      forceNew: true,
      reconnectionAttempts: 3,
      timeout: 2000,
      query: {
        token: this.dataService.getData('token'),
        project_id: this.commentsData.project_id,
      },
    });

    this.socket.emit('update-message', { message_id: item.message_id });
    this.dataService.showSuccess(
      'success',
      'This conversation is closed successfully'
    );
  }

  async fileChangeEvent(event: any) {

    const file = event.target.files[0];

    if (file) {

      const allowedTypes = ['image/jpeg', 'image/gif', 'image/png', 'application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

      if (!allowedTypes.includes(file.type)) {
        // Invalid file type

        this.dataService.showError("Error", "This File Format is Not Accept!")
        this.fileInput.nativeElement.value = ''; //input name clear
        this.uploadForm.controls.file_upload.setValue(''); //  formcontrol value clear
      } else {
        // Valid file type
        this.imageChangedEvent = event;
        this.files = this.imageChangedEvent.target.files[0];
        this.fileName = this.files.name;
        this.url = event.target.files[0];
      }
    }

    // this.imageChangedEvent = event;
    // console.log('Documents event', this.imageChangedEvent);
    // this.files = this.imageChangedEvent.target.files[0];
    // this.fileName = this.files.name;
    //this.urlLink= await this.processRecording(this.files);
    //    this.uploadForm.patchValue({
    //     title: this.fileName
    //  });
  }
  //   async uploadFileToServer1(file) {
  //     return new Promise((resolve, reject) => {
  //     console.log(file);
  //     var reader = new FileReader();
  //     reader.readAsDataURL(file);

  //     reader.onload = function(res) {
  //         console.log(res.target.result);
  //         resolve(res.target.result);

  //     };
  //     reader.onerror = function(err) {
  //         console.log('there are some problems');
  //         reject(err);
  //     };
  //   })
  // }

  async sendMessage(msg: string, check: boolean, item) {

    if (
      this.imageChangedEvent &&
      this.uploadForm.status == 'VALID' &&
      check == false
    ) {
      this.files = this.imageChangedEvent.target.files[0];
      var base64datafile = await this.uploadFileToServer(this.files);
      var req;
      if (this.parent_comment_id) {
        req = {
          user_id: this.userdetails.user_id,
          audio: base64datafile,
          parent_comment_id: this.parent_comment_id,
          comment: msg,
          recipient: this.reciepent_list,
          category_id_list: JSON.stringify( this.category_id_list),
          category_list: this.category_list,
          recipient_id: JSON.stringify( this.reciepent_id_list),
          project_id: this.commentsData.project_id,
        };
      } else {
        req = {
          user_id: this.userdetails.user_id,
          audio: base64datafile,
          comment: msg,
          recipient: this.reciepent_list,
          category_id_list:JSON.stringify(this.category_id_list),
          category_list: this.category_list,
          recipient_id: JSON.stringify( this.reciepent_id_list),
          project_id: this.commentsData.project_id,
        };
      }

      this.http
        .postMethod('utils/getAudioUrl', req)
        .then((response: any) => {
          this.url = response.data;
          if (response.status == true) {
            this.uploadForm.reset();
            this.closeModal.nativeElement.click();
            this.message = '';
            // this.initSocket('', req);
            location.reload();
            this.showReplies  = true;
            this.parent_comment_id = '';
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.dataService.markFormGroupTouched(this.uploadForm);
    }

    if (check == true) {
      if (msg != undefined && msg.length > 0) {
        this.selectedItems = [];
        this.selectedCatItems = [];
        this.initSocket(msg, item);
        this.message = '';
        this.parent_comment_id='';
        this.showReplies  = true;
      } else {
        this.dataService.showError('Warning', "Can't Send Empty Comment");
      }
    }
  }

  //DOMINIC
  async deleteComment(item) {
    this.deletecmd = await this.dataService.showDelete(
      'Please Confirm',
      'Selected Comment will be Deleted?',
      'Delete'
    );

    if (this.deletecmd == true) {
      this.http
        .deleteMethod('utils/deletecomment/' + item.comment_id, '')
        .then((response: any) => {
          this.initSocket('', item);
          this.dataService.showSuccess('success', response.message);
          // location.reload();
          this.closeModal.nativeElement.click();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  onUserSelect(e) {
    this.reciepent_id_list.push(e.user_id);
    this.reciepent_list.push(e.name);

  }

  onuserDeSelect(e) {
  
    if (this.reciepent_list.length == 1) {
      this.reciepent_id_list = [];
      this.reciepent_list = [];
    }
    else if (this.reciepent_list.length > 1) {
      const newArr = this.reciepent_list.filter((object) => {
        return object !== e.name;
      });
      this.reciepent_list = newArr;
    }

  }

  updateSearchResults(searchResults: any[]) {
    this.checkSearchResults(searchResults);
  }

  private checkSearchResults(searchResults: any[]) {
    this.isSearchDisabled = searchResults.length === 0;
  }

  // onSelectAllUsers(e){
  //   this.reciepent_id_list=e;
  //   this.reciepent_list=e;
  // }
  // onSelectAllCats(e){
  //   this.category_id_list=e[0].category_id;
  //   this.category_list=e[0].category_name;
  // }
  onCatSelect(e) {
    this.category_id_list.push(e.category_id);
    this.category_list.push(e.category_name);
  }

  oncatDeSelect(e) {
    if (this.category_list.length == 1) {
      this.category_list = [];
      this.category_id_list = [];
    }
    else if (this.category_list.length > 1) {
      const arrNew = this.category_list.filter((object) => {
        return object !== e.category_name;
      })
      this.category_list = arrNew;
    }

  }
  getMessages() { //Socket Function for reference

    return Observable.create((observer) => {
      this.socket.on('project-comments', (message) => {
        // console.log(JSON.parse(message));

        // console.log('console data ----------------->', message);
        if (this.handlesio == true) {
          observer.next(message);
          this.handlesio = false;
          this.chatList = message;
          console.log('chat',this.chatList);
          
          
          // console.log('chartlist data DOMMM----------------->', message);

          for (let i = 0; i < this.chatList.length; i++) {
     
              let recipient = this.chatList[i]?.recipient
                .split('[')
                .join('')
                .split(']')
                .join('');
              this.chatList[i].recipient = recipient.replaceAll('"', '');
              const category_list = this.chatList[i]?.category_list
                .split('[')
                .join('')
                .split(']')
                .join('');
              this.chatList[i].category_list = category_list.replaceAll(
                '"',
                ''
              );
          

            if (this.chatList[i]?.replies.length != 0) {
              let replies = this.chatList[i]?.replies;
              for (let j = 0; j < replies?.length; j++) {
                  const reply_recipien = replies[j]?.recipient
                    .split('[')
                    .join('')
                    .split(']')
                    .join('');
                  replies[j].recipient = reply_recipien.replaceAll('"', '');
                  const reply_catgory = replies[j]?.category_list
                    .split('[')
                    .join('')
                    .split(']')
                    .join('');
                  replies[j].category_list = reply_catgory.replaceAll('"', '');
                
              }
            }
          }
       

          this.chatList = this.chatList.filter((item) => {
            // console.log('Item>>>',item);
            
            return item.comment != '';
          });

          let totalCount = 0;
          for (let k = 0; k < this.chatList.length; k++) {
            const { replies } = this.chatList[k];
            if (replies.length > 0) {
              let repliesCount = replies.length;
              totalCount += repliesCount;
            }
          }
          this.chatListList = this.chatList.length + totalCount;
          // var c = 0;
          // this.chatList.map((i) => {
          //   let x = String(i.audio);
          //   let y = x.split('.');
          //   c++;
          //   Object.assign(i, { filterchart: y[1] }, { count: c });
          // });

          for (let i = 0; i < this.chatList.length; i++) {
            let x = this.chatList[i].audio;
            if (x) {
                let y = x.split('.');
                this.chatList[i].filterchart = y[1];
            }
        
            if (this.chatList[i].replies && this.chatList[i].replies.length > 0) {
                for (let j = 0; j < this.chatList[i].replies.length; j++) {
                    let p = this.chatList[i].replies[j].audio;
                    if (p) {
                        let q = p.split('.');
                        this.chatList[i].replies[j].filterchartRe = q[1];
                    }
                }
            }
        }
        }
      });
    });
  }
  addOffer() { }

  openModal() { }

  couponSubmit() { }
  openReplies(item) {
    item.showReplies = item.showReplies == false ? true : false;
    this.showReplies = item.showReplies == false ? true : false;
    this.parent_comment_id = item.comment_id;
  }
  dateFormat(date) {
    return moment(date).format('LLLL');
  }
  dateChange(e) {

    if (e == '') {
      this.chatList = this.tempChatList;
    } else {
      this.chatList = [];
      for (var i = 0; i < this.tempChatList.length; i++) {
        if (e == moment(this.tempChatList[i].message_on).format('YYYY-MM-DD')) {
          this.chatList.push(this.tempChatList[i]);
        }
      }
    }
  }
  // getConversation(){
  //   this.http.getMethod("help-desk/conversations").then((response: any) => {
  //     this.chatList = response.data;
  //     console.log("category list", this.chatList);
  //   }).catch((err) => {
  //     console.log(err);
  //   });
  // }

  backClicked() {
    this._location.back();
  }

  rmveditdata() {
    this.uploadForm.reset();
  }

  onSelectAllUsers(e: any) {
  }
  onSelectAllCats(e: any) { }

  whiteSpaceCheck2(event: any) {
    // var space = document.getElementById('inputSpace')
    if (event.target.selectionStart == 0 && event.code == "Space") {
      event.preventDefault();
    }

  }

}
