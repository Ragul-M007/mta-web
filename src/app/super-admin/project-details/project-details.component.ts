import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

// import { IDropdownSettings } from 'ng-multiselect-dropdown';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Location } from '@angular/common';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import $ from 'jquery';
import { DataService } from '../../service/data.service';
import { HttpService } from '../../service/http.service';
// import { viewerType } from '../../../../node_modules/doc-viewer-angular/modules/document-viewer.component'
@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
})
export class ProjectDetailsComponent implements OnInit {
  @ViewChild('closeModal') private closeModal: ElementRef;
  @ViewChild('mapuserModal') private mapuserModal: ElementRef;
  @ViewChild('userDetailModal') private userDetailModal: ElementRef;
  @ViewChild('newUserModal') private newUserModal: ElementRef;
  @ViewChild('fileInput') private fileInput: ElementRef;

  flag: any;
  showAgent = false;
  showTechnician = false;
  refillingAgent: any;
  technician: any;
  deletedoc: any;
  taskHistory: any = [];
  techTask: any = [];
  projectDetails: any;
  imageChangedEvent: any;
  files: any;
  fileName: any;
  url: any;
  editasignproject: any = {};
  uploadForm: FormGroup;
  selectededitDoc: any = {};
  mapCatForm: FormGroup;
  mapUserForm: FormGroup;
  categoriesList: any;
  projectList: any;
  getCategory: any = [];
  userList: any = [];
  project_role: string;
  user_id: any = [];
  selectedItems: any = [];
  activeTab = 'info';
  ErrMultiSelect : string
  // dropdownSettings: IDropdownSettings = {
  //   singleSelection: false,
  //   idField: 'user_id',
  //   textField: 'name',
  //   selectAllText: 'Select All',
  //   unSelectAllText: 'UnSelect All',
  //   itemsShowLimit: 3,
  //   allowSearchFilter: true
  // };
  dropdownSettings: any = {
    singleSelection: false,
    idField: 'user_id',
    textField: 'name',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
  };
  category: any;
  selectedDoc: any = {};
  documents: any;
  roList: any = [
    { id: 'M', name: 'Manager' },
    { id: 'L', name: 'Lead' },
    { id: 'O', name: 'Other' },
  ];
  usersinProject: any = [];
  vw_rights_docs: any = [];
  ryts: any = [];
  usersinRightsProject: any = [];
  docViewer: boolean;
  userRolesList: any = [];
  documentAction: any;
  categoryList: any = [];
  addUser: boolean = true;
  addEditlabel: string;
  UserRole: string;
  images: string;
  addEditBtn: string;
  addUserForm: FormGroup;
  gymImage: any;
  showImg: boolean;
  userdetails: any;
  croppedImage: File;
  showAdd: boolean;
  showPassword: boolean;
  stateList: any = [];
  value: any;
  selectedState: any;
  searchUser: any = [];
  cityList: any = [];
  userData: any = {};
  userListSearch: any = [];
  userCheck: boolean = false;
  fileCheck: boolean = true;
  title_true: boolean = true;
  all: any;
  role_id: any;
  documentsSearch: any = [];
  searchText: string;
  editData: any;
  MultiselectErr: boolean;
  masterSelected2: any;
  allSelectedItem: any = [];

  get frm() {
    return this.addUserForm.controls;
  }
  get frmUpload() {
    return this.uploadForm.controls;
  }
  get frmCat() {
    return this.mapCatForm.controls;
  }
  get frmUser() {
    return this.mapUserForm.controls;
  }
  constructor(
    public dataService: DataService,
    public route: ActivatedRoute,
    public http: HttpService,
    public router: Router,
    public formBuilder: FormBuilder,
    private _location: Location
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      let temp = params['data'];
      this.userdetails = this.dataService.getData('userData');
      this.projectDetails = JSON.parse(temp);
      this.getmappedUsers();
      this.getmappedCategory();
      let local = this.dataService.getData('commentsToProjects')
      if (local != undefined || null && local?.length > 0) {
        this.activeTab = 'documents';
        // this.getDocuments();
        // this.checkFunction();
        setTimeout(() => {
          this.dataService.removeData('commentsToProjects')
        }, 1000)

      }
    });

    this.upForm();
    this.mapcatForm();
    this.mapUsForm();
    this.newForm();

    var input = document.getElementById('input');
    var invalidChars = ['-', '+', 'e'];

    input.addEventListener('keydown', function (e) {
      if (invalidChars?.includes(e.key)) {
        e.preventDefault();
      }
    });

    var today = new Date().toISOString().split('T')[0];
    document.getElementById('date-input').setAttribute('max', today);

    var today2 = new Date().toISOString().split('T')[0];
    document.getElementsByName('setTodayDate')[0].setAttribute('max', today2);
    // this.dataService.removeData('commentsToProjects')

  }

  selectImage(event: any) {

    this.gymImage = event.files[0];
    if (event.files[0]) {
      this.dataService.readImage(event.files[0]).then((base64Data: any) => {
        this.images = base64Data.result;
      });
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.images = event.base64;

    this.croppedImage = this.base64ToFile(
      event.base64,
      this.imageChangedEvent.target.files[0].name
    );

    return this.croppedImage;
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Check if the Tab key is pressed
    if (event.key === 'Tab') {
      // Prevent the default tab behavior
      event.preventDefault();
    }
  }
  imageLoaded() {
    /* show cropper */
    // console.log('image load');
  }

  cropperReady() {
    /* cropper ready */
    // console.log('cropper ready');
  }

  loadImageFailed() {
    /* show message */
    // console.log('failed');
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

  saveImage() {
    this.showImg = false;
  }
  getStates() {
    this.http
      .getMethod('location/states?country_code=IN')
      .then((response: any) => {
        this.stateList = response.data;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  getCities(state) {
    if (state.code) {
      this.value = state.code;
      this.selectedState = state.name;
    } else {
      this.value = state.target.value;
      this.selectedState =
        state.target.options[state.target.options.selectedIndex].text;
    }

    this.http
      .getMethod('location/cities?country_code=IN&state_code=' + this.value)
      .then((response: any) => {
        this.cityList = response.data;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  addModal() {
    this.showAdd = true;
    this.showPassword = true;
    this.images = '';
    this.addUserForm.reset();
    this.getuserRoles();
  }
  adduser() {
    this.images = '';
    this.getStates();
    this.addUser = true;
    this.addEditlabel = 'Add New User';
    this.addEditBtn = 'ADD';
    this.addUserForm.controls['pass'].enable();
    this.addUserForm.controls['cpass'].enable();
    this.newForm();
  }
  newForm() {
    this.addUserForm = this.formBuilder.group({
      userType: ['', Validators.compose([Validators.required])],
      userName: ['', Validators.compose([Validators.required])],
      dob: ['', Validators.compose([Validators.required])],
      annDate: ['', Validators.compose([])],
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      ],
      // phoneno: ['', Validators.compose([Validators.minLength(2), Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
      phoneno: [
        '',
        [
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.required,
          Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
        ],
      ],
      state: ['', Validators.compose([Validators.required])],
      city: ['', Validators.compose([Validators.required])],
      area: ['', Validators.compose([Validators.required])],
      pass: [
        '',
        Validators.compose([Validators.required, Validators.minLength(4)]),
      ],
      cpass: ['', Validators.compose([Validators.required])],
    });
  }

  upForm() {
    this.uploadForm = this.formBuilder.group({
      filename: ['', Validators.compose([Validators.required])],
      title: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
    });
  }
  mapcatForm() {
    this.mapCatForm = this.formBuilder.group({
      projectname: ['', Validators.compose([Validators.required])],
      categoryname: ['', Validators.compose([Validators.required])],
    });
  }
  mapUsForm() {
    this.mapUserForm = this.formBuilder.group({
      userName: ['', Validators.compose([Validators.required])],
      user_id: ['null', Validators.compose([Validators.required])],
    });
  }

  // blockInvalidChar(event) {
  //   console.log('event.target.value', event.key)

  //   if (event.key != 8 && event.key != 0 && event.key < 48 || event.key > 57) {
  //     event.preventDefault();
  //   }
  //   // ['e', 'E', '+', '-'].includes(event.target.value) && e.preventDefault();
  // }

  backFun() {
    this.mapUserForm.reset();
    this.role_id = [];
    this.user_id = [];
    this.userList = [];
    this.searchUser = '';
    this.userCheck = false;
  }

  adduserSubmit() {
    var req = {};
    var image;

    if (this.addUserForm.status == 'VALID') {
      // var formData: any = new FormData();
      var img;
      if (this.images != '') {
        img = this.images;
      }
      req = {
        role_id: this.addUserForm.value.userType,
        name: this.addUserForm.value.userName,
        email: this.addUserForm.value.email,
        mobile_no: this.addUserForm.value.phoneno,
        city: this.addUserForm.value.city,
        state: this.selectedState,
        area: this.addUserForm.value.area,
        password: this.addUserForm.value.pass,
        cpassword: this.addUserForm.value.cpass,
        status: 'A',
        dob: this.addUserForm.value.dob,
        anniver_date: this.addUserForm.value.annDate,
        loginpin: '',
        user_img: img,
      };

      // if (this.showAdd == true) {
      this.http
        .postMethod('users', req)
        .then((response: any) => {
          this.dataService.showSuccess('success', response.message);
          this.newUserModal.nativeElement.click();
          this.showImg = false;
          this.ngOnInit();
          this.addUserForm.reset();

          // this.getDashboard();
        })
        .catch((err) => {
          console.log(err);
        });
      // } else {
      //   this.http.putMethod("user/update-all/" + this.gymOwnerid, formData).then((response: any) => {
      //     this.dataService.showSuccess("success", response.response_desc);
      //     this.closeModal.nativeElement.click();
      //     // this.getDashboard();
      //   }).catch((err) => {
      //     console.log(err);
      //   });
      // }
    } else {
      this.dataService.markFormGroupTouched(this.addUserForm);
    }
  }
  addcategory() {
    // this.getProjects();
    // this.getCategories();
    // this.getUsers();
  //  this.dataService.removeData('commentsVisit')
  localStorage.removeItem('commentsVisit')

    this.router.navigate(['admin/categoriesView'], {
      queryParams: { data: JSON.stringify(this.projectDetails) },
      skipLocationChange: false,
    });
  }
  mapusers() {
    // this.getProjects();
    // this.getCategories();
    // this.getUsers();
    this.getuserRoles();
    this.mapUserForm.reset();
    this.searchUser = '';
  }
  getUsers(id) {

    this.mapUserForm.get('user_id').reset();
    this.masterSelected2 = false;
    this.MultiselectErr = false;
    this.userList = [];
    this.userListSearch = [];
    let localcheck = [];
    if (id == '6') {
      this.project_role = 'O';
    } else {
      this.project_role = '';
    }
    this.http
      .getMethod('users')
      .then((response: any) => {
        if (response.status == true) {
          this.userCheck = true;
          this.searchUser = '';

        }
        for (var i = 0; i < response.data.length; i++) {
          if (id == response.data[i].role_id) {
            // this.userList.push(response.data[i]);
            // this.userListSearch.push(response.data[i]);
            localcheck.push(response.data[i])
          }
        }


        localcheck.filter((user1) => {
          let found = false;
          this.usersinProject.filter((user2:any) => {
            if (user1.user_id === user2.user_id) {
              found = true;
            }
          });
          if (!found) {
            this.userListSearch.push(user1);
            this.userList.push(user1);
          }
        });
        this.userList = this.userList.sort(function (a:any, b:any) {
          return a.name.localeCompare(b.name);
        });

      })
      .catch((err) => {
        console.log(err);
      });
  }

  checkUser(event: any) {
    let data = event.target.value.toLowerCase();

    if (data == '') {
      this.userList = this.userListSearch;
    }

    if (data) {
      this.userList = [];

      this.userListSearch.map((user: any) => {
        if (user.name?.toLowerCase().includes(data.toLowerCase())) {
          this.userList.push(user);
        }
      });

    }
  }

  getUserNoti(id:any, con:any) {


    if (id != '' && con == true) {
      this.user_id.push(id);
    }
    if (id != '' && con == false) {
      // this.user_id.shift(id)
      // this.user_id.pop();

      const newArr = this.user_id.filter((object:any) => {
        return object !== id;
      });
      this.user_id = newArr;
    }

    if (this.user_id.length === 0) {
      this.mapUserForm.value.user_id.reset();
    }
  }
  checkFunction() {
    this.documents = [];
    this.documentsSearch = [];
    var r = this.usersinProject;

    var not = r.map((item:any) => {
      return item.user_id;
    });

    var userDet = this.dataService.getData('userData');
    this.UserRole = userDet.role;
    var usr_id :any;
    if (this.UserRole == 'ADMIN') {
      usr_id = not;
    } else {
      usr_id = userDet.user_id;
    }
    this.http
      .getMethod(
        'categories/getCategorybyuser?user_id=' + this.userdetails.user_id
      )
      .then((response: any) => {
        this.getCategory = response.data;
        var DataSet:any = [];

        this.getCategory.map((i:any) => {
          if (i.category_id !== null) {
            DataSet.push(i.category_id);
          }
        });

        var CategoryUser = JSON.stringify(DataSet);
        var CatData = CategoryUser.substring(1, CategoryUser.length - 1);

        if (CatData === null || CatData === 'null') {
          this.http
            .getMethod(
              'projects/getDocuments?project_id=' +
              this.projectDetails.project_id +
              '&&users_id=' +
              usr_id
            )
            .then((response: any) => {

              this.documents = response.data;
              this.documentsSearch = response.data;
              this.ryts = this.documents.map((item:any) => {
                return (this.ryts = item.vw_rights);
              });

              if (this.documents == null) {
                this.documents = [];
              } else {
                for (var i = 0; i < this.documents.length; i++) {
                  var ext = this.documents[i].file;
                  ext = ext.split('.');

                  this.documents[i].ext_img = ext[1];
                  //  if(ext[1] == 'docx'){
                  //   this.documents[i].ext_img="../assets/image/doc.svg";
                  //  }else  if(ext[1] == 'pdf'){
                  //   this.documents[i].ext_img="../assets/image/pdf.svg";
                  //  }else if(ext[1] == 'xls'){
                  //   this.documents[i].ext_img="../assets/image/xls.png";
                  //  }else{

                  //   this.documents[i].ext_img="../assets/image/file.svg";
                  //  }
                }
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {

          this.http
            .getMethod(
              'projects/getDocuments?project_id=' +
              this.projectDetails.project_id +
              '&&users_id=' +
              usr_id
            )
            .then((response: any) => {
              this.documents = response.data;
              this.documentsSearch = response.data;
              this.ryts = this.documents.map((item :any) => {
                return (this.ryts = item.vw_rights);
              });

              if (this.documents == null) {
                this.documents = [];
              } else {
                for (var i = 0; i < this.documents.length; i++) {
                  var ext = this.documents[i].file;
                  ext = ext.split('.');

                  this.documents[i].ext_img = ext[1];
                  //  if(ext[1] == 'docx'){
                  //   this.documents[i].ext_img="../assets/image/doc.svg";
                  //  }else  if(ext[1] == 'pdf'){
                  //   this.documents[i].ext_img="../assets/image/pdf.svg";
                  //  }else if(ext[1] == 'xls'){
                  //   this.documents[i].ext_img="../assets/image/xls.png";
                  //  }else{

                  //   this.documents[i].ext_img="../assets/image/file.svg";
                  //  }
                }
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getDocuments() {
    this.documents = [];
    this.documentsSearch = [];
    var r = this.usersinProject;

    var not = r.map((item : any) => {
      return item.user_id;
    });

    var userDet = this.dataService.getData('userData');
    this.UserRole = userDet.role;
 
    var usr_id :any;
    if (this.UserRole == 'ADMIN') {
      usr_id = not;
    } else {
      usr_id = userDet.user_id;
    }
    this.http
      .getMethod(
        'categories/getCategorybyuser?user_id=' + this.userdetails.user_id
      )
      .then((response: any) => {
        this.getCategory = response.data;
        var DataSet:any = [];

        this.getCategory.map((i :any) => {
          if (i.category_id !== null) {
            DataSet.push(i.category_id);
          }
        });

        var CategoryUser = JSON.stringify(DataSet);
        var CatData = CategoryUser.substring(1, CategoryUser.length - 1);

        if (CatData === null || CatData === 'null') {
          this.http
            .getMethod(
              'projects/getDocuments?project_id=' +
              this.projectDetails.project_id +
              '&&users_id=' +
              usr_id
            )
            .then((response: any) => {

              this.documents = response.data;
              this.documentsSearch = response.data;
              this.ryts = this.documents.map((item:any) => {
                return (this.ryts = item.vw_rights);
              });

              if (this.documents == null) {
                this.documents = [];
              } else {
                for (var i = 0; i < this.documents.length; i++) {
                  var ext = this.documents[i].file;
                  ext = ext.split('.');

                  this.documents[i].ext_img = ext[1];
                  //  if(ext[1] == 'docx'){
                  //   this.documents[i].ext_img="../assets/image/doc.svg";
                  //  }else  if(ext[1] == 'pdf'){
                  //   this.documents[i].ext_img="../assets/image/pdf.svg";
                  //  }else if(ext[1] == 'xls'){
                  //   this.documents[i].ext_img="../assets/image/xls.png";
                  //  }else{

                  //   this.documents[i].ext_img="../assets/image/file.svg";
                  //  }
                }
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.http
            .getMethod(
              'projects/getDocuments?project_id=' +
              this.projectDetails.project_id +
              '&&users_id=' +
              usr_id
            )
            .then((response: any) => {
              this.documents = response.data;
              this.documentsSearch = response.data;
              this.ryts = this.documents.map((item:any) => {
                return (this.ryts = item.vw_rights);
              });

              if (this.documents == null) {
                this.documents = [];
              } else {
                for (var i = 0; i < this.documents.length; i++) {
                  var ext = this.documents[i].file;
                  ext = ext.split('.');

                  this.documents[i].ext_img = ext[1];
                  //  if(ext[1] == 'docx'){
                  //   this.documents[i].ext_img="../assets/image/doc.svg";
                  //  }else  if(ext[1] == 'pdf'){
                  //   this.documents[i].ext_img="../assets/image/pdf.svg";
                  //  }else if(ext[1] == 'xls'){
                  //   this.documents[i].ext_img="../assets/image/xls.png";
                  //  }else{

                  //   this.documents[i].ext_img="../assets/image/file.svg";
                  //  }
                }
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  mapuserSubmit() {
    // if (this.mapUserForm.status == 'VALID') {
      // var formData: any = new FormData();
      if (this.user_id.length != 0) {
        this.MultiselectErr = true;
        this.ErrMultiSelect = ''
        var req = {
          category_id: null,
          user_id: JSON.stringify([...new Set(this.user_id)]),
          project_id: this.projectDetails.project_id,
          project_role: this.project_role,
        };
        this.http
          .postMethod('projects/mapUsers', req)
          .then((response: any) => {
            this.dataService.showSuccess('success', response.message);
            this.mapUserForm.reset();
            this.userList = [];
            this.userCheck = false;
            this.searchUser = '';
            this.getmappedUsers();
            this.mapuserModal.nativeElement.click();
            this.user_id = []
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        // this.dataService.showError('Select User!', 'Please Select Any User!');
        // this.dataService.markFormGroupTouched(this.mapUserForm);
        this.MultiselectErr = true;
        this.ErrMultiSelect = 'Please Enter The User Name'
      }
    // } else {
    //   this.dataService.showError('Select User!', 'Please Select Any User!');
    //   this.dataService.markFormGroupTouched(this.mapUserForm);
    // }
  }

  getCategories() {
    this.http
      .getMethod('categories/avail_cats')
      .then((response: any) => {
       
        this.categoriesList = response.data;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  getmappedCategory() {
    this.http
      .getMethod('categories?project_id=' + this.projectDetails.project_id)
      .then((response: any) => {
        this.categoryList = response.data;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  getProjects() {
    this.http
      .getMethod('projects')
      .then((response: any) => {
        this.projectList = response.data;
        for (var i = 0; i < this.projectList.length; i++) {
          if (
            (this.projectList[i].project_id = this.projectDetails.project_id)
          ) {
            this.projectDetails = this.projectList[i];
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  getmappedUsers() {
    this.http
      .getMethod(
        'projects/getmappedUser?project_id=' + this.projectDetails.project_id
      )
      .then((response: any) => {
        this.usersinProject = response.data;
        this.checkFunction()
        this.usersinProject.map((item : any) => {
          if (item.vw_rights == null) {
            delete item.vw_rights;
            Object.assign(item, { vw_rights: 'null' });
          }
        });

        this.usersinProject.sort(function (a:any, b:any) {
          var textA = a.name.toUpperCase();
          var textB = b.name.toUpperCase();
          return textA < textB ? -1 : textA > textB ? 1 : 0;
        });

        //   this.vw_rights_docs = this.usersinProject.map(item=>{

        //   this.vw_rights_docs = item.vw_rights;

        //   if(this.vw_rights_docs == null){
        //     this.vw_rights_docs = null;
        //   }
        //   else{
        //     this.vw_rights_docs=this.vw_rights_docs.split(",");
        //   }
        //  return this.vw_rights_docs = this.vw_rights_docs

        // })

        // console.log("usr vw rights after split----------->", (this.vw_rights_docs));
        // Object.assign(this.usersinProject,{'vw_rights_docs':this.vw_rights_docs})

        //comment
        //return this.usersinProject;
        //console.log("finally get value ", this.usersinProject.vw_rights_docs)
        // if(this.vw_rights_docs.indexOf(453) !== -1){
        //     console.log("ok")
        //   }
        //   if(this.vw_rights_docs.indexOf(453) === -1){
        //     console.log("not ok")
        //   }

        // this.userpro[0] = this.usersinProject.push(this.projectDetails);
        // console.log("projectList", this.projectList);
        // for (var i=0;i< this.projectList.length;i++){
        //       if(this.projectList[i].project_id = this.projectDetails.project_id){
        //         this.projectDetails = this.projectList[i];
        //       }
        // }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  getmappedUsersRights() {
    this.http
      .getMethod(
        'projects/getmappedUser?project_id=' + this.projectDetails.project_id
      )
      .then((response: any) => {
        this.usersinRightsProject = response.data;

        // this.userpro[0] = this.usersinProject.push(this.projectDetails);
        // console.log("projectList", this.projectList);
        // for (var i=0;i< this.projectList.length;i++){
        //       if(this.projectList[i].project_id = this.projectDetails.project_id){
        //         this.projectDetails = this.projectList[i];
        //       }
        // }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  async addViewRights(data) {


    let deleteconfirm = await this.dataService.showDelete(
      'Document Update',
      'Confirm to proceed with Update',
      'Confirm'
    );
    if (deleteconfirm == true) {
      var data_user_id = data.user_id;
      var data_document_id = data.document_id;
      let ref = {
        project_id: this.projectDetails.project_id,
        user_id: data_user_id,
        vw_rights: data_user_id,
        document: data_document_id,
      };
      this.http
        .putMethod(`projects/putCategory/${ref.user_id}`, ref)
        .then((response: any) => {
          this.dataService.showSuccess('success', response.message);
          this.getDocuments();
          this.closeModal.nativeElement.click();
          this.uploadForm.reset();
          this.getmappedUsers();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  async removeViewRights(data) {

    let deleteconfirm = await this.dataService.showDelete(
      'Document Update',
      'Confirm to proceed with Update',
      'Confirm'
    );
    if (deleteconfirm == true) {
      let ref = {
        project_id: this.projectDetails.project_id,
        user_id: data.user_id,
        document: data.document_id,
        vw_rights: 0,
      };
      this.http
        .putMethod(`projects/putCategory/${data.user_id}`, ref)
        .then((response: any) => {
          this.dataService.showSuccess('success', response.message);
          this.getDocuments();
          this.closeModal.nativeElement.click();
          this.uploadForm.reset();
          this.getmappedUsers();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  onItemSelect(item: any) {
    // console.log(item);
  }
  onSelectAll(items: any) {
    // console.log(items);
  }
  categoryChange(event) {
    // console.log(event.target.value);
  }

  mapCatSubmit() {
    if (this.mapCatForm.status == 'VALID') {
      // var formData: any = new FormData();

      var req = {
        category_id: this.mapCatForm.value.categoryname,
        user_id: [],
        project_id: this.mapCatForm.value.projectname,
      };

      // if (this.showAdd == true) {
      this.http
        .postMethod('projects/mapCategory', req)
        .then((response: any) => {
          this.dataService.showSuccess('success', response.message);
          this.closeModal.nativeElement.click();
          // this.getDashboard();
        })
        .catch((err) => {
          console.log(err);
        });

      // } else {

      //   this.dataService.markFormGroupTouched(this.mapUserForm);
      // }
    }
  }
  viewDoc(item) {
    this.selectedDoc = {};
    this.selectedDoc = item;
    this.docViewer = false;
  }
  async viewDocument(item) {
    this.selectedDoc = {};
    this.docViewer = true;
    this.selectedDoc = item;
    await this.dataService.presentLoading();

    setTimeout(() => {
      this.dataService.dismissLoading();
    }, 5000);
  }

  async uploadSubmit(data) {
    
    if (this.uploadForm.status == 'VALID') {
      // var formData: any = new FormData();

      if (this.documentAction == 'ADD') {
        let deleteconfirm = await this.dataService.showDelete(
          'Document Upload',
          'Confirm to proceed with upload',
          'Confirm'
        );
        if (deleteconfirm == true) {
          let user = this.dataService.getData('userData');

          // var req = {
          //   file_name: this.uploadForm.value.title,
          //   project_id: this.projectDetails.project_id,
          //   category_id: this.projectDetails.category_id
          //     ? this.projectDetails.category_id
          //     : null,
          //     category_name: this.projectDetails.category_name,
          //   file: this.url,
          //   user_id: user.user_id,
          //   description: this.uploadForm.value.description,
          // };

          var formData = new FormData();
          formData.append("file_name", this.uploadForm.value.title);
          formData.append("project_id", this.projectDetails.project_id);
          formData.append("file", this.url);
          formData.append("user_id", user.user_id);
          formData.append("description", this.uploadForm.value.description)

          this.http
            .postMethod('projects/addDocument', formData)
            .then((response: any) => {
              this.dataService.showSuccess('success', response.message);
              this.getDocuments();
              this.getmappedUsers();
              this.closeModal.nativeElement.click();
              this.uploadForm.reset();
              this.url = '';
              // window.location.reload();
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }

      if (this.documentAction == 'EDIT') {
        let deleteconfirm = await this.dataService.showDelete(
          'Document Update',
          'Confirm to proceed with Update',
          'Confirm'
        );
        if (deleteconfirm == true) {
          let user = this.dataService.userProfile;
          var req = {
            file_name: this.uploadForm.value.title,
            project_id: this.projectDetails.project_id,
            category_id: this.projectDetails.category_id
              ? this.projectDetails.category_id
              : null,
            category_name: this.projectDetails.category_name,
            // file: this.url,
            user_id: user.user_id,
            description: this.uploadForm.value.description,
          };

          this.http
            .putMethod(`projects/editDocument/${this.editData.document_id}`, req)
            .then((response: any) => {
              this.dataService.showSuccess('success', response.message);
              this.getDocuments();
              this.closeModal.nativeElement.click();
              this.uploadForm.reset();
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    } else {
      this.dataService.markFormGroupTouched(this.uploadForm);
    }
  }

  async fileChangeEvent(event: any) {
    console.log("event",event.target.files[0])
    const file = event.target.files[0];

    if (file) {

      const allowedTypes = ['image/jpeg', 'image/gif', 'image/png', 'application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/msword','application/dwg'];
    
      if (file.name.toLowerCase().endsWith(".dwg") && file.type == '') {
        this.imageChangedEvent = event;
        this.files = this.imageChangedEvent.target.files[0];
        this.fileName = this.files.name;
        this.url = event.target.files[0];
    } 
      else if (!allowedTypes.includes(file.type)) {
        // Invalid file type

        this.dataService.showError("Error", "This File Format is Not Accept!")
        this.fileInput.nativeElement.value = ''; //input name clear
        this.uploadForm.controls.filename.setValue(''); //  formcontrol name clear
        // this.form.get('image').setErrors({ invalidFileType: true });
      } else {
        // Valid file type
        this.imageChangedEvent = event;
        this.files = this.imageChangedEvent.target.files[0];
        this.fileName = this.files.name;
        this.url = event.target.files[0];

      }
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
    });
  }
  getuserRoles() {
    this.userRolesList = [];
    this.http
      .getMethod('users/user_roles')
      .then((response: any) => {
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].role_id != 1 && response.data[i].role_id != 7) {
            this.userRolesList.push(response.data[i]);
          }
        }
        // this.userRolesList = response.data;
        // console.log(' this.userRolesList', this.userRolesList);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  showComments(item) {
    item.project_name = this.projectDetails.project_name;

    item.from = 'Project';
    this.router.navigate(['admin/comments'], {
      queryParams: { data: JSON.stringify(item) },
      skipLocationChange: false,
    });
  }

  async editDoc(data) {
    this.editData=data
    
    this.documentAction = 'EDIT';
    this.selectededitDoc = {};
    this.fileCheck = false;
    this.title_true = false;

    this.uploadForm = this.formBuilder.group({
      // filename: [data.file_name , Validators.compose([Validators.required])],
      title: [data.file_name, Validators.compose([Validators.required])],
      description: [data.description, Validators.compose([Validators.required])],
    });


    setTimeout(() => {
      this.selectededitDoc = data;
      this.selectededitDoc.document_id = data.document_id;
      this.selectededitDoc.title = data.title;
      this.selectededitDoc.discription = data.discription;
    }, 500);

    // this.usersinProject.vw_rights.indexOf(this.selectededitDoc.document_id)===-1
  }

  async rmveditdata() {
    this.selectededitDoc = {};
    this.documentAction = 'ADD';
    this.fileCheck = true;
    this.title_true = true;
    this.uploadForm.reset();
    this.uploadForm = this.formBuilder.group({
      filename: ['', Validators.compose([Validators.required])],
      title: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
    });
  }

  async viewDocDel(item) {
    this.deletedoc = await this.dataService.showDelete(
      'Please Confirm',
      'The selected category will be Deleted?',
      'Delete'
    );

    if (this.deletedoc == true) {
      this.http
        .deleteMethod('projects/document/' + item.document_id, '')
        .then((response: any) => {
          this.dataService.showSuccess('success', response.message);
          this.documents = [];
          this.getDocuments();
          this.closeModal.nativeElement.click();
          this.uploadForm.reset();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  async deleteassignproject(user) {
    var data_a = user;
    var data_b = this.projectDetails.project_id;

    this.deletedoc = await this.dataService.showDelete(
      'Please Confirm',
      'The selected User will be Remove From the Project?',
      'Delete'
    );

    if (this.deletedoc == true) {
      this.http
        .deleteMethod('projects/mappedUser/' + data_a + '/' + data_b, '')
        .then((response: any) => {
          this.dataService.showSuccess('success', response.message);
          this.usersinProject = [];
          this.getmappedUsers();
          this.userDetailModal.nativeElement.click();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  backClicked() {
    this._location.back();
  }
  searchDocument(event) {

    let data = event.target.value;
    data = data.toLowerCase()

    if (data == "") {
      this.documents = this.documentsSearch
    }

    if (data) {
      this.documents = [];
      this.documentsSearch.map((doc) => {
        if ((doc?.file_name.toLowerCase()).includes((data).toLowerCase())) {
          this.documents.push(doc)
        }
      })
    }
  }
  clearFun() {
    this.searchText = '';
  }
  selectAllProj(e, projList) {
    let condtion = e.target.checked;
    if (condtion == true) {
      for (var i = 0; i < this.userList.length; i++) {
        this.userList[i].checked = true;
        this.user_id.push(this.userList[i].user_id);
      }
    } else {
      this.user_id = [];
     
      for (var i = 0; i < this.userList.length; i++) {
        this.userList[i].checked = false;
      }
    }
    if (this.user_id.length == 0) {
      this.mapUserForm.controls.user_id.setValue('');
    }

  }
  removePDFData(){
    this.selectedDoc = {};
  }
    // user list
    checkUncheckAll2() {
     
      for (var i = 0; i < this.userList.length; i++) {
        this.userList[i].isSelected = this.masterSelected2;
      }
      this.getCheckedItemList2();
      if(this.user_id.length>0){     
        this.MultiselectErr = false;
      }
    }
    isAllSelected2() {
      
      this.masterSelected2 = this.userList.every(function(item:any) {
          return item.isSelected == true;
        })
  
      this.getCheckedItemList2();
      if(this.user_id.length>0){   
        this.MultiselectErr = false;
      }
    }
   
    getCheckedItemList2(){
      this.user_id = [];
      for (var i = 0; i < this.userList.length; i++) {
        if(this.userList[i].isSelected)
        this.user_id.push(this.userList[i].user_id);
      }
    }
      
    // toggleCheckbox2(item: any): void {
    //   this.allSelectedItem.push(item)
    //   this.allSelectedItem?.filter((a)=>a.isSelected && this.user_id.push(a.user_id))
    //   this.user_id = [...new Set(this.user_id)];
    //        // item.isSelected = !item.isSelected;
    //        this.ErrMultiSelect = ''
           
    //      }

    toggleCheckbox2(item: any): void {
      item.isSelected = !item.isSelected; // Toggle the isSelected property
      if (!Array.isArray(this.user_id)) {
        this.user_id = [];
      }
    
      // Check if the item is selected and add its user_id to the user_id array
      if (item.isSelected && !this.user_id.includes(item.user_id)) {
        this.user_id.push(item.user_id);
      } else {
        // If the item is deselected, remove its user_id from the user_id array
        this.user_id = this.user_id.filter(id => id !== item.user_id);
      }
    
      this.ErrMultiSelect = '';
    }
    

}
