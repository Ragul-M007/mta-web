import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { async } from 'rxjs';
import { DataService } from '../../service/data.service';
import { HttpService } from '../../service/http.service';


@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  notiForm: FormGroup;

  @ViewChild('closeModal') private closeModal: ElementRef;
  @ViewChild('fileInput') private fileInput : ElementRef; 
  url: any;
  imageChangedEvent: any;
  userdropdownSetting : any = {}
  files: any;
  MultiselectErr: boolean = false;
  showUserOptions: boolean = false;
  channelDDList = [
    {
      "channelId": 0,
      "channelName": "SMS",
      "selected": false
    },
    {
      "channelId": 1,
      "channelName": "Voice",
      "selected": false
    },
    {
      "channelId": 2,
      "channelName": "FaceBook",
      "selected": false
    },
    {
      "channelId": 4,
      "channelName": "Twitter",
      "selected": false
    },
    {
      "channelId": 5,
      "channelName": "Push",
      "selected": false
    },
    {
      "channelId": 6,
      "channelName": "WeChat",
      "selected": false
    },
    {
      "channelId": 7,
      "channelName": "Skype For Business",
      "selected": false
    },
    {
      "channelId": 8,
      "channelName": "Email",
      "selected": false
    }
  ];
  GetUserNoti: any = [];
  user_ids: any = [];
  showCheckbox = false;
  selectedAll: any;
  fileName: any;
  userRolesList: any = [];
  userList: any = [];
  images: any = "./../../../assets/image/Camera.png";
  role_id: any;
  showImg = false;
  ErrMultiSelect : string
disableSend: any;
  masterSelected2: boolean;
  user_role_id: number;
  role_type_change: number;
  allSelectedItem: any = [];
  get frm() { return this.notiForm.controls; }
  constructor(public dataService: DataService,
    public formBuilder: FormBuilder,
    public http: HttpService,
    private router: ActivatedRoute,
    public route: Router) {
  }
  ngOnInit(): void {
    this.newForm();
    this.getuserRoles();
   /**Multi Select*/
 
  }
  newForm() {
    this.notiForm = this.formBuilder.group({
      userType: ['null', Validators.compose([Validators.required])],
      title: ['', Validators.compose([Validators.required])],
      filename: ['', Validators.compose([])],
      description: ['', Validators.compose([Validators.required])],
      user_id: ['null', Validators.compose([])]

    },

    );
  }
  getuserRoles() {
    
    this.http.getMethod("users/user_roles").then((response: any) => {
      this.userRolesList = response.data;
    }).catch((err) => {
      console.log(err);
    });
  }
  getUsers(id) {
   this.role_type_change = parseInt(id)
    this.user_role_id = this.role_type_change;
    
    this.userList = [];
    this.MultiselectErr = false;
    this.masterSelected2= false;
    this.selectedAll = '';
    this.showUserOptions = true;
    this.http.getMethod("users?role_id=" + id).then((response: any) => {

      let res = response.data;
      for (var i = 0; i < res.length; i++) {
        if (res[i].role_id == id) {
          this.userList.push(res[i]);
        }

      }

    }).catch((err) => {
      console.log(err);
    });
  }
  clearNotification() {
    this.role_id = [];
    this.notiForm.reset();
    this.userList = '';
    this.ErrMultiSelect = ''
  }

  public getUserNoti(id, con) {
    if (id != "" && con == true) {
      this.GetUserNoti.push(id);
    }
    if (id != "" && con == false) {
      this.GetUserNoti.shift(id)
    }

  }
  sendNotification() {

    const hasSelectedUsers = Array.isArray(this.user_ids) && this.user_ids.length > 0;

    if (this.notiForm.status == 'VALID' && hasSelectedUsers) {
      this.MultiselectErr = false;
      this.ErrMultiSelect = ''
      
      var req = {
        "title": this.notiForm.value.title,
        "user_type": this.user_role_id,
        "description": this.notiForm.value.description,
        "user_id": this.user_ids, //this.notiForm.value.user_id,
        "img_url": this.url
      }
      // if (req.user_type == 0) {
      //   delete req.user_id
      //   Object.assign(req, { user_id: 0 })
      // }

       

      this.http.postMethod("utils/addNoti", req).then((response: any) => {
        this.dataService.showSuccess("success", response.message);
        if(response.status == true){
          this.notiForm.reset();
          this.masterSelected2= false;
          this.newForm();
          this.role_id = ''
          this.getuserRoles();  
          this.GetUserNoti = [];
          this.userList = [];
          this.user_ids = []
        }      
      }).catch((err) => {
        console.log(err);
      });
  }else{
    if (!hasSelectedUsers) {
      this.MultiselectErr = true
      this.ErrMultiSelect = 'Please Select Any User'
    }
      this.dataService.markFormGroupTouched(this.notiForm)
    }
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
    })
  }


  async fileChangeEvent(event: any) {

    
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/gif', 'image/png'];

      if (!allowedTypes.includes(file.type)) {
        // Invalid file type
        this.images = ''
        this.showImg = false;
        this.fileInput.nativeElement.value = '';
        this.dataService.showError("Error", "Only Image Formats Accept!")
        // this.form.get('image').setErrors({ invalidFileType: true });
      } else {
        // // Valid file type
        // this.fileName = this.files.name; 
        
        
                this.showImg = true;
                this.imageChangedEvent = event;
        this.url = await this.uploadFileToServer(event.target.files[0]);
        
        // console.log('IMGURL',this.url);
        
        

      }
    }
  }

  showCheckboxes2() {
    this.showCheckbox = false;
  }
  showCheckboxes() {
    this.showCheckbox = !this.showCheckbox;
  }
  selectAll(event, users) {
    let condtion = event.target.checked
    if (condtion == true) {
      for (var i = 0; i < this.userList.length; i++) {
        this.userList[i].checked = true;
        this.user_ids.push(this.userList[i].user_id)
      }
    } else {
      this.user_ids = [];
      for (var i = 0; i < this.userList.length; i++) {
        this.userList[i].checked = false;
      }
    }

  }

  checkIfAllSelected() {
    this.selectedAll = this.channelDDList.every(function (item: any) {
      return item.selected == true;
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
    // user list
    checkUncheckAll2() {

      for (var i = 0; i < this.userList.length; i++) {
        this.userList[i].isSelected = this.masterSelected2;
      }
      this.getCheckedItemList2();
      if (Array.isArray(this.user_ids) && this.user_ids.length > 0) {
        this.MultiselectErr = false;
      }else {
        this.MultiselectErr = true;
      }
    }
    isAllSelected2() {
      this.MultiselectErr = false;
      this.masterSelected2 = this.userList.every(function(item:any) {
          return item.isSelected == true;
        })
  
      this.getCheckedItemList2();
      if (Array.isArray(this.user_ids) && this.user_ids.length > 0) {
        this.MultiselectErr = false;
      }
    }
   
    getCheckedItemList2(){
      this.user_ids = [];
      for (var i = 0; i < this.userList.length; i++) {
        if(this.userList[i].isSelected)
        this.user_ids.push(this.userList[i].user_id);
      }
    }
         
    toggleCheckbox2(item: any): void {
      this.MultiselectErr = true;
      item.isSelected = !item.isSelected; // Toggle the isSelected property
      if (!Array.isArray(this.user_ids)) {
        this.user_ids = [];
      }
    
      // Check if the item is selected and add its user_id to the user_id array
      if (item.isSelected && !this.user_ids.includes(item.user_id)) {
        this.user_ids.push(item.user_id);
      } else {
        // If the item is deselected, remove its user_id from the user_id array
        this.user_ids = this.user_ids.filter(id => id !== item.user_id);
      }
    
      this.MultiselectErr = false;
    }

         
  
}
