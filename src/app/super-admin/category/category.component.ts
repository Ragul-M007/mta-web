import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';


import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Location } from '@angular/common';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { HttpService } from '../../service/http.service';
import { DataService } from '../../service/data.service';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  categoryVal: {};
  @ViewChild('mapuserModal') private mapuserModal: ElementRef;
  @ViewChild('addCategoryModal') private addCategoryModal: ElementRef;
  @ViewChild('uploadModal') private uploadModal: ElementRef;
  @ViewChild('closeModal') private closeModal: ElementRef;
  @ViewChild('userDetailModalView') private closeThisModal: ElementRef;
  @ViewChild('userDetailModal') private closeViewUserModal: ElementRef;
  @ViewChild('fileInput') private fileInput: ElementRef;
  addCategoryForm: FormGroup;
  categoryList: any = [];
  MultiselectErr: boolean ;
  categoryid: any;
  deleteConfirm: {};
  project: any;
  project_id: any;
  categoriesList: any = [];
  userList: any = [];
  projectList: any = [];
  userMain: boolean;
  categoryMain: boolean;
  selectedCategory: any;
  mapUserForm: FormGroup;
  uploadForm: FormGroup;
  projectDetails: any;
  url: any;
  imageChangedEvent: any;
  files: any;
  fileName: any;
  selectedDoc: any = {};
  documents: any;
  category_id: any = [];
  users: any = [];
  userLi: any = [];
  docViewer: boolean;
  userRolesList: any;
  role_id: any;
  gymImage: any;
  images: any;
  croppedImage: File;
  showImg: boolean;
  stateList: any;
  value: any;
  selectedState: any;
  cityList: any;
  showPassword: boolean;
  addUserForm: FormGroup;
  addUser: boolean;
  addEditlabel: string;
  addEditBtn: string;
  userData: any = {};
  categories_Id: any = [];
  searchUserList: any = [];
  userSearch: any = [];
  userSearching: boolean = false;
  lengthErr: boolean = false;
  deletedoc: any;
  categoriesListSearch: any = [];
  searchCat: any = String;
  activeTab = 'info';
  masterSelected: boolean;
  masterSelected2: any;
  allSelectedItem: any = [];
  get frmUser() {
    return this.mapUserForm.controls;
  }
  get frmCat() {
    return this.addCategoryForm.controls;
  }
  get frmUpload() {
    return this.uploadForm.controls;
  }
  get frm() {
    return this.addUserForm.controls;
  }
  showAdd: boolean;
  dropdownSettings: any = {
    singleSelection: false,
    idField: 'user_id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
  };
  constructor(
    public dataService: DataService,
    public http: HttpService,
    public formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    private _location: Location
  ) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe((params) => {
      let temp = params['data'];

      this.projectDetails = JSON.parse(temp);
      this.project_id = this.projectDetails.project_id;
    });
    this.getmappedCategory();
    this.categoryMain = true;
    this.userMain = false;

    this.addCategoryForm = this.formBuilder.group({
      categoryname: ['', Validators.compose([Validators.required])],
      // projectname: ['', Validators.compose([Validators.required])]
      // unit: ['', Validators.compose([Validators.required])],
    });

    this.mapuserForm();
    this.upldForm();
    this.newForm();
    this.switchTab('info');
    var input = document.getElementById('input');
    var invalidChars = ['-', '+', 'e', '.'];

    input.addEventListener('keydown', function (e) {
      if (invalidChars.includes(e.key)) {
        e.preventDefault();
      }
    });

    let check = this.dataService.getData("revisit");
    if (check != null || undefined) {
      this.dataService.removeData("revisit");
      this.selectedCategory = check;
      this.categoryMain = false;
      this.userMain = true;
      this.category_id = this.selectedCategory.category_id;
      this.project_id = this.selectedCategory.project_id;
      this.getCatUsers();
      this.getDocuments();
      this.switchTab('documents');
    }
  }
  upldForm() {
    this.uploadForm = this.formBuilder.group({
      filename: ['', Validators.compose([Validators.required])],
      title: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
    });
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

  imageLoaded() {
  }

  cropperReady() {
  }

  loadImageFailed() {
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

  adduser() {
    this.images = '';
    this.getStates();
    this.addUser = true;
    this.addEditlabel = 'Add New User';
    this.addEditBtn = 'ADD';
    this.newForm();
    this.addUserForm.reset();
    this.showAdd = true;
    this.showPassword = true;
    this.images = '';
    this.getuserRoles();
  }
  newForm() {
    this.addUserForm = this.formBuilder.group({
      userType: ['', Validators.compose([Validators.required])],
      userName: ['', Validators.compose([Validators.required])],
      dob: ['', Validators.compose([])],
      annDate: ['', Validators.compose([])],
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      ],
      phoneno: [
        '',
        Validators.compose([
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.required,
          Validators.pattern(/^-?(0|[1-9]\d*)?$/),
        ]),
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

  checkLength() {
    const length = this.addUserForm.controls.phoneno.value || '';

    if (length?.toString().length <= 1) {
      this.lengthErr = true;
    } else if (length?.toString().length > 8) {
      this.lengthErr = false;
    }
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

          this.showImg = false;
          this.closeModal.nativeElement.click();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.dataService.markFormGroupTouched(this.addUserForm);
    }
  }
  viewDoc(item) {
    this.selectedDoc = item;
    this.docViewer = false;
  }

  viewDocument(item) {
    this.docViewer = true;
    this.selectedDoc = item;
  }
  async uploadSubmit() {
    if (this.uploadForm.status == 'VALID') {
      // var formData: any = new FormData();

      let deleteconfirm = await this.dataService.showDelete(
        'Document Upload',
        'Confirm to proceed with upload',
        'Confirm'
      );
      if (deleteconfirm == true) {
        let user = this.dataService.userProfile;
        var userddetails = this.dataService.getData('userData');
        // var req = {
        //   file_name: this.uploadForm.value.title,
        //   project_id: this.selectedCategory.project_id,
        //   category_id: this.selectedCategory.category_id,
        //   category_name: this.selectedCategory.category_name,
        //   file: this.url,
        //   user_id: userddetails.user_id,
        //   description: this.uploadForm.value.description,
        
        // };

        var formData = new FormData();
        formData.append("file_name", this.uploadForm.value.title);
        formData.append("project_id", this.selectedCategory.project_id);
        formData.append("category_id", this.selectedCategory.category_id);
        formData.append("category_name", this.selectedCategory.category_name);
        formData.append("file", this.url);
        formData.append("user_id", userddetails.user_id);
        formData.append("description", this.uploadForm.value.description)

        this.http
          .postMethod('projects/addDocument', formData)
          .then((response: any) => {
            this.dataService.showSuccess('success', response.message);

            this.uploadModal.nativeElement.click();
            this.uploadForm.reset();
            this.getDocuments();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }else{
      this.dataService.markFormGroupTouched(this.uploadForm)
    }
  }

  async viewDocDel(item) {
    let deleteconfirm = await this.dataService.showDelete(
      'Please Confirm',
      'The selected Document will be Deleted?',
      'Delete'
    );
    if (deleteconfirm == true) {
      let payload = {
        project_id: item.document_id,
        category_id: item.category_id
      };

      this.http.postMethod(`projects/deleteCategoryDocuments?`, payload).then((response: any) => {
        this.dataService.showSuccess("Success", response.message)
        this.getDocuments();
      })
    }
  }

  async fileChangeEvent(event: any) {
    const file = event.target.files[0];

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/gif', 'image/png', 'application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/msword'];
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

  getDocuments() {
    this.documents = [];
    this.http
      .getMethod(
        'projects/getDocuments?category_id=' +
        this.selectedCategory.category_id +
        '&project_id=' +
        this.selectedCategory.project_id
      )
      .then((response: any) => {
        // this.dataService.console(response);
        // console.log("responseeeeeeeeee",response)
        this.documents = response.data;
        if (this.documents == null) {
          this.documents = [];
        } else {
          for (var i = 0; i < this.documents.length; i++) {
            var ext = this.documents[i].file;
            ext = ext.split('.');
            this.documents[i].ext_img = ext[1];
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  mapuserForm() {
    this.mapUserForm = this.formBuilder.group({
      userName: ['', Validators.compose([Validators.required])],
      // role: ['', Validators.compose([Validators.required])],
      user_id: ['null', Validators.compose([Validators.required])],
    });
  }
  mapusers() {
    // this.getProjects();
    // this.getCategories();
    // this.getUsers('');
    this.getuserRoles();
    this.userSearch = '';
    this.userSearching = false;
    // this.category_id=this.selectedCategory.category_id;
  }
  showUsers(item) {
    this.selectedCategory = item;
    this.categoryMain = false;
    this.userMain = true;
    this.category_id = this.selectedCategory.category_id;
    this.project_id = this.selectedCategory.project_id;
    this.getCatUsers();
    this.getDocuments();
    this.switchTab('info');
  }
  addModal() {
    this.showAdd = true;
    this.addCategoryForm.reset();
    // this.getProjects();
    this.getCategories();
    this.searchCat = '';
    // this.getUsers();
  }

  userModalOpen(item) {
    this.switchTab('info');
    this.dataService.removeData('revisit');
    this.selectedCategory = item;
    this.category_id = this.selectedCategory.category_id;
    this.project_id = this.selectedCategory.project_id;
    this.getCatUsers();
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
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getUsers(id) {
    this.userList = [];
    this.userLi = [];
    this.searchUserList = [];
    let localcheck = [];
    this.masterSelected2= false;
    this.MultiselectErr = false;
    // if (id == '6') {
    //   this.project_role = 'O';
    // } else {
    //   this.project_role = '';
    // }
    this.http
      .getMethod('users')
      .then((response: any) => {
        if (response.status == true) {
          this.userSearching = true;
          this.userSearch = '';
        }
        for (var i = 0; i < response.data.length; i++) {
          if (id == response.data[i].role_id) {
            // this.userList.push(response.data[i]);
            // this.searchUserList.push(response.data[i]);
            localcheck.push(response.data[i]);
          }
        }
        this.userList = this.userList.sort(function (a, b) {
          return a.name.localeCompare(b.name);
        });

        // for (let i = 0; i < localcheck.length; i++) {
          // console.log(">>>>>>>>",localcheck)
        //   for (let j = 0; j < this.users.length; j++) {
        //     if (localcheck[i].user_id != this.users[j].user_id) {
        //       this.userList.push(localcheck[i]);
        //     }
        //   }
        // }

        localcheck.filter((user1) => {
          let found = false;
          this.users.filter((user2) => {
            if (user1.user_id === user2.user_id) {
              found = true;
            }
          });
          if (!found) {
            this.searchUserList.push(user1);
            this.userList.push(user1);
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getUserNoti(id, con) {
    // this.user_id = [];
    if (id != '' && con == true) {
      this.userLi.push(id);
    }
    if (id != '' && con == false) {
      // this.userLi.shift(id)
      const newArr = this.userLi.filter((object) => {
        return object !== id;
      });
      this.userLi = newArr;
    }
    if (this.userLi.length === 0) {
      this.mapUserForm.value.user_id.reset();
    }
  }

  getCategories() {
    this.http
      .getMethod('categories/avail_cats')
      .then((response: any) => {
        if (this.categoryList.length > 0) {
          this.categoriesList = response.data.filter(
            ({ category_id: id1 }) =>
              !this.categoryList.some(({ category_id: id2 }) => id1 === id2)
          );
          this.categoriesListSearch = response.data.filter(
            ({ category_id: id1 }) =>
              !this.categoriesListSearch.some(({ category_id: id2 }) => id1 === id2)
          );
        } else {
          this.categoriesList = response.data;
          this.categoriesListSearch = response.data;
        }
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
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // editCategory(item){
  //   this.showAdd = false;
  //   this.addCategoryForm = this.formBuilder.group({
  //     category_name: [item.category_name, Validators.compose([Validators.required])],
  //   });
  //   this.categoryid = item.id;
  // }

  getmappedCategory() {
    this.http
      .getMethod('categories?project_id=' + this.project_id)
      .then((response: any) => {
        this.categoryList = response.data;
        this.categoriesListSearch = response.data;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getCatUsers() {
    this.users = [];
    this.http
      .getMethod(
        'categories/getCatUsers?project_id=' +
        this.project_id +
        '&category_id=' +
        this.category_id
      )
      .then((response: any) => {
        this.users = response.data;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  backFun() {
    this.masterSelected = false;
    this.categories_Id = [];
    this.category_id = []
    this.addCategoryForm.reset();
    this.categoriesList = [];
    this.searchCat = '';
  }
  backFun3() {
    this.uploadForm.reset();
    this.fileInput.nativeElement.value = '';
  }
  getProNoti(id, con) {

    if (id != '' && con == true) {
      this.category_id.push(id);
    }
    if (id != '' && con == false) {
      const newArr = this.category_id.filter((object) => {
        return object !== id;
      });
      this.category_id = newArr;
      // this.category_id.shift(id)
      // this.category_id.pop()
    } 
    if (this.category_id.length === 0) {
      // this.addCategoryForm.reset(this.addCategoryForm.value.categoryname);
    }
  }
  addCategory() {
    this.category_id ;
    
    // this.project_id=this.categoryList[0].project_id;
    // this.categoryVal = await this.dataService.categoryModal("Add Category","Add",true,"Category Name","Please enter Category Name");
    if (this.category_id.length > 0) {
      this.MultiselectErr = false;

      let payload = {
        project_id: this.project_id,
        category_id: this.category_id ,
        // "category_id": [this.addCategoryForm.value.categoryname],
        user_id: [],
      };

      // if(this.showAdd == true){

      if (this.category_id .length != 0 || this.category_id  != '') {
        this.http
          .postMethod('projects/mapCategory', payload)
          .then((response: any) => {
            this.dataService.showSuccess('success', response.message);
            this.addCategoryForm.value.categoryname = '';
            this.category_id = [];
            this.getmappedCategory();
            this.addCategoryModal.nativeElement.click();
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.MultiselectErr = true;
      }
    } else {
      this.dataService.showError('', 'Please Select Any Category!');
      this.dataService.markFormGroupTouched(this.addCategoryForm);
    }
  }


  async removeCat(e) {
    let deleteconfirm = await this.dataService.showDelete(
      ' ',
      'Confirm to Delete Category',
      'Confirm'
    );
    if (deleteconfirm == true) {
      var req = {
        category_id: e.category_id,
        project_id: e.project_id,
      };

      this.http
        .postMethod('categories/removeCat/', req)
        .then((response: any) => {
          this.dataService.showSuccess('success', response.message);
          this.getmappedCategory();
          this.addCategoryModal.nativeElement.click();
          // window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  onCheckboxChange(e) {

    this.userLi.push(e.target.value);
  }

  mapuserSubmit() {
    
      if (this.userLi.length > 0) {
        this.MultiselectErr = false;
        var req = {
          category_id: this.category_id,
          user_id: JSON.stringify(this.userLi),
          project_id: this.project_id,
        };
        this.http
          .postMethod('projects/mapUsers', req)
          .then((response: any) => {
            this.dataService.showSuccess('success', response.message);
            this.getCatUsers();
            this.mapUserForm.reset();
            this.userLi = [];
            this.userRolesList = [];
            this.userList = [];
            this.mapuserModal.nativeElement.click();
            // this.getDashboard();
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        // this.dataService.showError('Select User!', 'Please Select Any User!');
        this.MultiselectErr = true;

        // this.dataService.markFormGroupTouched(this.mapUserForm);
      }
    // } else {
    //   this.dataService.showError('Select User!', 'Please Select Any User!');
    //   this.dataService.markFormGroupTouched(this.mapUserForm);
    // }
  }
  showComments(item) {
    item.project_id = this.project_id;
    item.from = 'Category';
    this.dataService.removeData("revisit");

    this.dataService.setData("commentsVisit", this.selectedCategory);
    this.router.navigate(['admin/comments'], {
      queryParams: { data: JSON.stringify(item) },
      skipLocationChange: false,
    });

  }
  backClicked(boolean) {
    this.dataService.removeData('revisit');
    if (boolean == true) {
      this._location.back();
    } else {
      this.categoryMain = true;
      this.userMain = false;
      this.getmappedCategory();
    }
  }

  checkUser(event) {
    const data = event.target.value.toLowerCase();
    if (data == '') {
      this.userList = this.searchUserList;
    }
    if (data) {
      this.userList = [];
      this.searchUserList.map((user: any) => {
        if (user.name?.toLowerCase().includes(data.toLowerCase())) {
          this.userList.push(user);
        }
      });
    }
  }

  backFunction() {
    this.userSearch = '';
    this.role_id = [];
    this.masterSelected2 = true;
    this.userSearching = false;
    this.mapUserForm.reset();
    this.userRolesList = [];
    this.userList = [];
    this.masterSelected2= false;
  }
  async deleteBin(user) {
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
          this.getCatUsers();
          this.closeThisModal.nativeElement.click();
          this.closeViewUserModal.nativeElement.click();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  checkCat(event) {

    var data;
    data = event.target.value;
    this.categoriesList = [];
    if (data) {
      this.categoriesListSearch.map((cat: any) => {
        if (cat.category_name.toLowerCase().includes((data).toLowerCase())) {
          this.categoriesList.push(cat);
        }
      })
    }
    else {
      this.categoriesList = this.categoriesListSearch;
    }

  }


  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Check if the Tab key is pressed
    if (event.key === 'Tab') {
      // Prevent the default tab behavior
      event.preventDefault();
    }
  }

 
/**MultiSelect */
checkUncheckAll() {
  for (var i = 0; i < this.categoriesList.length; i++) {
    this.categoriesList[i].isSelected = this.masterSelected;
  }
  this.getCheckedItemList();
}
isAllSelected() {
  
  this.masterSelected = this.categoriesList.every(function(item:any) {
      return item.isSelected == true;
    })
  this.getCheckedItemList();
  if(this.category_id.length>0){     
    this.MultiselectErr = false;
  }
}

getCheckedItemList(){
  this.category_id = [];
  for (var i = 0; i < this.categoriesList.length; i++) {
    if(this.categoriesList[i].isSelected)
    this.category_id.push(this.categoriesList[i].category_id);
  }
}
toggleCheckbox(item: any): void {
  item.isSelected = !item.isSelected; // Toggle the isSelected property

  // Ensure this.category_id is initialized as an array if it's null or undefined
  if (!Array.isArray(this.category_id)) {
    this.category_id = [];
  }
  
  // Check if the item is selected and add its category_id to the category_id array
  if (item.isSelected && !this.category_id.includes(item.category_id)) {
    this.category_id.push(item.category_id);
  } else {
    // If the item is deselected, remove its category_id from the category_id array
    this.category_id = this.category_id.filter(id => id !== item.category_id);
  }

  this.MultiselectErr = false;
}


  // user list
  checkUncheckAll2() {
 

    for (var i = 0; i < this.userList.length; i++) {
      this.userList[i].isSelected = this.masterSelected2;
    }
    this.getCheckedItemList2();
    if(this.userLi.length>0){
        
      this.MultiselectErr = false;
    }
  }
  isAllSelected2() {

    
    this.masterSelected2 = this.userList.every(function(item:any) {
        return item.isSelected == true;
      })
    

    this.getCheckedItemList2();
    if(this.userLi.length>0){
        
      this.MultiselectErr = false;
    }
  }
 
  getCheckedItemList2(){
    this.userLi = [];
    for (var i = 0; i < this.userList.length; i++) {
      if(this.userList[i].isSelected)
      this.userLi.push(this.userList[i].user_id);
    }
  }
      
       toggleCheckbox2(item: any): void {
         item.isSelected = !item.isSelected; // Toggle the isSelected property
         if (!Array.isArray(this.userLi)) {
           this.userLi = [];
         }
      
        // Check if the item is selected and add its user_id to the user_id array
        if (item.isSelected && !this.userLi.includes(item.user_id)) {
          this.userLi.push(item.user_id);
        } else {
          // If the item is deselected, remove its user_id from the user_id array
          this.userLi = this.userLi.filter(id => id !== item.user_id);
        }
      
        this.MultiselectErr = false;
      }
       
  docClear(){
    this.selectedDoc = [{}];
  }
}
