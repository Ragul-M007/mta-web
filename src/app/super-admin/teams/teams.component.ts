// import { Component, OnInit } from '@angular/core';

// export class TeamsComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }
import {Subject , fromEvent} from 'rxjs';

import {
  Component,
  ElementRef,
  HostListener,
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
import { takeUntil } from 'rxjs/operators';
import { DataService } from '../../service/data.service';
import { HttpService } from '../../service/http.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
})
export class TeamsComponent implements OnInit {
  @ViewChild('closeModal') private closeModal: ElementRef;
  @ViewChild(' closeModalPro') private closeModalPro: ElementRef;
  @ViewChild('closeCatModal') private closeCatModal: ElementRef;
  @ViewChild('adduserModal') private adduserModal: ElementRef;
  @ViewChild('userCloseModal') private userCloseModal: ElementRef;
  @ViewChild('viewProjectsModal') private viewProjectsModal: ElementRef;
  showImg = false;
  // @ViewChild('staticTabs', { static: false }) staticTabs!: TabsetComponent;
  images: any = './../../../assets/image/Camera.png';
  croppedImage: any = './../../../assets/image/Camera.png';
  addProjectForm: FormGroup;
  addCategoryForm: FormGroup;
  addNewProjectForm: FormGroup;
  mapUserForm: FormGroup;
  filterList: any = [
    'Current Month',
    'Last Month',
    'Last 3 Month',
    'Last 6 Month',
  ];
  gymImage: any;
  gymList: any = [];
  showAdd: boolean;
  paymentType: any = [
    { id: 0, name: 'Rental' },
    { id: 1, name: 'Commission' },
  ];
  deleteproject: unknown;
  payment: any;
  showPassword: boolean = true;
  gymOwnerid: string;
  deleteConfirm: {};
  dashboardData: any;
  selectedPayment: any;
  // isDisabled = true;
  p: number = 1;
  fileToReturn: File;
  searchData: any;
  searchVal: any;
  catData: any;
  userdetails: any;
  stateList: any;
  cityList: any;
  msg: string;
  statecode: any;
  projectList: any = [];
  teamList: any = [];
  AllProjList: any = [];
  filterProjList: any = [];
  backupProjList: any = [];
  userRolesList: any;
  categoriesList: any;
  selectedState: any;
  searchDataClear : any;
  noProject: string;
  selectedProject: any = {};
  categoryAction: string = 'Add New category';
  catList: boolean;
  formHandle: boolean = true;
  deleteCate: unknown;
  editPro: unknown;
  selectededitProject: any = {};
  projectAction: string;
  TeamAction: string;
  projectActionBtn: string;
  projectNewList: any = [];
  teamData: any;
  userList: any = [];
  project_role: string;
  teamUsers: any = [];
  deletedoc: any;
  projectDetails: any = [];
  projectSearch: any = [];
  userListSearch: any = [];
  userSearch: boolean = false;
  item: any;
  role_id: any;
  viewError: boolean = true;
  user_ids: any = [];
  page: number = 1;
  totalLength: any;

  selectedAll: any;
  channelDDList = [
    {
      channelId: 0,
      channelName: 'SMS',
      selected: false,
    },
    {
      channelId: 1,
      channelName: 'Voice',
      selected: false,
    },
    {
      channelId: 2,
      channelName: 'FaceBook',
      selected: false,
    },
    {
      channelId: 4,
      channelName: 'Twitter',
      selected: false,
    },
    {
      channelId: 5,
      channelName: 'Push',
      selected: false,
    },
    {
      channelId: 6,
      channelName: 'WeChat',
      selected: false,
    },
    {
      channelId: 7,
      channelName: 'Skype For Business',
      selected: false,
    },
    {
      channelId: 8,
      channelName: 'Email',
      selected: false,
    },
  ];

  showCheckbox = false;
  checkedAllValue: any;
  masterSelected:boolean;
  MultiselectErr: boolean ;
  masterSelected2: any;
  isModalOpen: boolean;
  allSelectedItem: any = [];

  get frm() {
    return this.addProjectForm.controls;
  }
  get frmCat() {
    return this.addCategoryForm.controls;
  }
  get frmTeam() {
    return this.addNewProjectForm.controls;
  }
  get frmUser() {
    return this.mapUserForm.controls;
  }
  imageChangedEvent: any = '';
  showErr = false;
  searchText: string;
  searchdrop: string = '';
  searchProject: any = [];
  searchUser: any = [];
  filterResults: any = [];
  user_id: any = [];
  project_id: any = [];
  statusList: any = [
    { name: 'Active' },
    { name: 'Hold' },
    { name: 'Cancelled' },
    { name: 'Completed' },
    { name: 'Proposed' },
  ];
  private unsubscriber : Subject<void> = new Subject<void>();
  // disabledControl = true;
  // croppedImage: any = '';

  constructor(
    public dataService: DataService,
    public formBuilder: FormBuilder,
    public http: HttpService,
    private router: ActivatedRoute,
    public route: Router
  ) {
    this.masterSelected = false;

    router.params.subscribe((val) => {
      // this.getDashboard();
      // this.getGymList();
      // this.getProjects();
      this.newForm();
      this.categoryForm();
    });
  }
  ngOnInit(): void {
    // this.getGymList();
    // this.newForm();
    history.pushState(null, '');

    fromEvent(window, 'popstate')
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((_) => {
        history.pushState(null, '');
        // this.dataService.getData('userData')
        // this.dataService.removeData('userData')
        this.dataService.navigateForward("auth/login");
        
        // this.showError = true;
      });
    this.userdetails = this.dataService.getData('userData');
    this.getTeams();
    this.getStates();
    // this.getCities();
    this.catData = {};
    this.addNewProjectForm = this.formBuilder.group({
      project: ['', Validators.compose([Validators.required])],
    });
    this.mapUserForm = this.formBuilder.group({
      userName: ['', Validators.compose([Validators.required])],
      // role: ['', Validators.compose([Validators.required])],
      user_id: ['null', Validators.compose([Validators.required])],
    });
  }
  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }
  chngFun(data : any) {
    console.log('search data',data);

    
    this.searchDataClear = data
    console.log('search data2222',this.searchDataClear);

    data = this.searchDataClear?.toLowerCase();
    if (data == '') {
      this.teamList = this.backupProjList;
    }

    if (data) {
      this.teamList = [];
      this.backupProjList.map((pro: any) => {
        if (pro.team_name?.toLowerCase().includes(data.toLowerCase())) {
          this.teamList.push(pro);
        }
      });
    }

    // this.teamList.map((pro: any) => {
    //   let proName = pro.team_name?.toLowerCase()
    //   let result = proName?.startsWith(data)
    //   if (result) {
    //     teamList.push(pro)
    //   }
    // })
  }

  checkProject(event) {
    var data;
    data = event.target.value?.toLowerCase();
    if (data == '') {
      this.projectList = this.projectSearch;
    }
    if (data) {
      this.projectList = [];

      this.projectSearch.map((pro: any) => {
        if (pro.project_name?.toLowerCase().includes(data.toLowerCase())) {
          this.projectList.push(pro);
        }
      });
      // console.log("projejctt filter", this.projectList)
      if (Array.isArray(this.projectList) && !this.projectList.length) {
        this.viewError = false;
      } else {
        this.viewError = true;
      }
    }
  }

  checkUser(event: any) {
    let data = event.target.value.toLowerCase();

    if (data == '') {
      this.userList = this.userListSearch;
    }

    if (data) {
      this.userList = [];

      this.userListSearch.map((user: any) => {
        if (user.name?.toLowerCase().includes(data?.toLowerCase())) {
          this.userList.push(user);
        }
      });
    }
  }

  checkFilter(data) {
    if (this.teamList.length == 0) {
      this.noProject = 'No projects available';
    }
    if (this.searchdrop == '') {
      this.teamList = this.AllProjList;
    } else {
      this.filterProjList = [];
      this.AllProjList.map((i) => {
        if (i.status == this.searchdrop) {
          if (i) {
            this.filterProjList.push(i);
          }
        }
      });
      this.teamList = this.filterProjList;
    }
  }
  addProject() {
    this.images = './../../../assets/image/Camera.png';
    this.newForm();
    this.showAdd = true;
    // this.getStates();
    this.projectAction = 'Add New Team';
    this.projectActionBtn = 'ADD';
    // this.getcategoriesList();
    // this.getuserRoles();
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
    this.selectedState =
      state.target.options[state.target.options.selectedIndex].text;

    this.http
      .getMethod(
        'location/cities?country_code=IN&state_code=' + state.target.value
      )
      .then((response: any) => {
        this.cityList = response.data;
      })
      .catch((err) => {
        console.log(err);
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

  fileChangeEvent(event: any): void {
    this.showImg = true;
    this.imageChangedEvent = event;
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
    /* show cropper */
  }

  cropperReady() {
    /* cropper ready */
  }

  loadImageFailed() {
    /* show message */
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

  viewProjects(item) {
    this.route.navigate(['admin/projectsview'], {
      queryParams: { data: JSON.stringify(item.team_id) },
      skipLocationChange: false,
    });
  }

  viewpic(item) {
    this.selectedProject = item;
  }
  getuserRoles() {
    this.http
      .getMethod('users/user_roles')
      .then((response: any) => {
        // this.userRolesList = response.data;
        this.userRolesList = [];
        for (let userRole of response.data) {

          if (userRole.role_id != 7 && userRole.role_id !=1)  {

            this.userRolesList.push(userRole);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getUsers(id) {
    this.masterSelected2= false
    this.userList = [];
    this.user_ids = [];
    this.selectedAll = '';
    this.userListSearch = [];
    this.MultiselectErr = false;
    // this.userSearch = false;
    this.searchUser = [];
    let localcheck = [];
    this.http
      .getMethod('users')
      .then((response: any) => {
        if (response.status == true) {
          this.userSearch = true;
        }
        for (var i = 0; i < response.data.length; i++) {
          if (id == response.data[i].role_id) {
            localcheck.push(response.data[i])
          }
        }

        localcheck.filter((user1) => {
          let found = false;
          this.teamUsers.filter((user2) => {
            if (user1.user_id === user2.user_id) {
              found = true;
            }
          });
          if (!found) {
            this.userListSearch.push(user1);
            this.userList.push(user1);
          }
        });
        this.userList = this.userList.sort(function (a, b) {
          return a.name.localeCompare(b.name);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getUserNoti(id, con) {
    // this.user_id = [];
    if (id != '' && con == true) {
      this.user_ids.push(id);
    }
    if (id != '' && con == false) {
      // this.user_id.shift(id)
      // this.user_id.pop()

      const newArr = this.user_ids.filter((object) => {
        return object !== id;
      });
      this.user_ids = newArr;
    }

    if (this.user_ids.length == 0) {
      this.mapUserForm.controls.user_id.setValue('');
    }
  }

  getProNoti(id, con) {
    this.checkedAllValue = false;

      
      if(this.project_id.length>0){
        
        this.MultiselectErr = false;
      }
    
    if (id != '' && con == true) {
      this.project_id.push(id);
    }
    if (id != '' && con == false) {
      // this.project_id.shift(id)
      // this.project_id.pop();

      const newArr = this.project_id.filter((object) => {
        return object !== id;
      });
      this.project_id = newArr;
    }

    if (this.project_id.length === 0) {
      this.addNewProjectForm.controls.project.setValue('');
    }
  }

  editProject(data) {
    this.selectededitProject = {};

    this.showAdd = false;

    this.projectAction = 'Edit Team';
    this.projectActionBtn = 'EDIT';

    setTimeout(() => {
      //<<<---using ()=> syntax
      for (var i = 0; i < this.stateList.length; i++) {
        if (data.state == this.stateList[i].name) {
          data.stateCode = this.stateList[i].code;
          this.getCity(data.stateCode);
        }
      }
    }, 100);

    setTimeout(() => {
      this.addProjectForm = this.formBuilder.group({
        //Not Allowed Special Charachter = projectname: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-zA-Z])[a-zA-Z ]+$')])],
        teamname: [
          data?.team_name,
          Validators.compose([Validators.required, Validators.pattern('')]),
        ],
        description: [
          data?.description,
          Validators.compose([Validators.required]),
        ],
      });

      this.selectededitProject = data;
      this.selectededitProject.description = data.description;
    }, 500);
  }

  addProjectTeam(data) {
    this.searchProject = '';
    this.teamData = data;
    this.projectAction = 'Map Projects in Team';
    this.projectActionBtn = 'MAP';
    this.getProjects();
    this.searchUser = '';
    this.userSearch = false;
    this.userRolesList = [];
    this.getuserRoles();
    this.view_usersmodal(data)
  }

  async deleteProject(item : any) {
    this.deleteproject = await this.dataService.showDelete(
      'Please Confirm',
      'The selected Team will be Deleted?',
      'Delete'
    );

    if (this.deleteproject == true) {
      this.http
        .deleteMethod('teams/' + item.team_id, '')
        .then((response: any) => {
          this.dataService.showSuccess('success', response.message);
          this.teamList = [];
          this.filterResults = [];
          this.teamList = [];
          this.searchDataClear = '';
          this.getTeams();
          this.closeModal.nativeElement.click();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  getcategoriesList() {
    this.http
      .getMethod('categories/avail_cats')
      .then((response: any) => {
        this.categoriesList = response.data;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getTeams() {
    this.http
      .getMethod('teams')
      .then((response: any) => {
        this.teamList = response.data;
        this.AllProjList = response.data;
        this.totalLength = this.teamList.length;
        this.teamList = this.teamList.sort(function (a, b) {
          return a.team_name.localeCompare(b.team_name);
        });
        this.backupProjList = this.teamList;
        this.getuserRoles();

        //   if ((this.teamList[i]?.users_id == undefined || null) || (this.teamList[i]?.users_id === "")) {
        //     this.teamList[i].users_length = 0;
        //   }
        //   else {
        //     local = this.teamList[i]?.users_id?.split(',');
        // 

        //     let dublicate_id = [];
        //     local.filter((e) => {
        //       if (!dublicate_id.includes(e)) {
        //         dublicate_id.push(e)
        //       }
        //     })

      })
      .catch((err) => {
        console.log(err);
        if (err.statusText == 'Unauthorized') {
          this.dataService.navigateForward('auth/login');
        }
      });
  }

  view_usersmodal(data: any) {
    this.teamData = data;
    this.teamUsers = [];
    this.TeamAction = data.team_name;

    if (data.users_id?.length != 0) {
      this.http
        .getMethod('teams/getTeamUsers/' + data.team_id)
        .then((response: any) => {
          this.teamUsers = response.data;
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
    }
  }

  view_projectsmodal(data: any) {
    this.teamData = data;
    this.TeamAction = data.team_name;

    this.http
      .getMethod('projects/getProjectsByTeam/' + data.team_id)
      .then((response: any) => {
        this.projectDetails = response.data;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async deleteUser(data: any) {
    this.deletedoc = await this.dataService.showDelete(
      'Please Confirm',
      'The selected User will be Remove From the Team?',
      'Delete'
    );


    if (this.deletedoc == true) {
      var req = {
        team_id: this.teamData.team_id,
        user_id: data.user_id,
      };


      this.http
        .postMethod('teams/deleteUserbyTeam', req)
        .then((response: any) => {
          this.dataService.showSuccess(
            'success',
            ' User Deleted Successfully!'
          );
          this.closeModal.nativeElement.click();
          this.userCloseModal.nativeElement.click();
          this.getTeams();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Check if the Tab key is pressed
    if (event.key === 'Tab' && this.isModalOpen) {
      // Prevent the default tab behavior
      event.preventDefault();
    }
  }

  openModals() {
    this.isModalOpen = true;
  }
  closeModals() {
    this.isModalOpen = false;
  }
    

  async deleteproject_inteam(data: any) {
    this.deletedoc = await this.dataService.showDelete(
      'Please Confirm',
      'The selected Project will be Remove From the Team?',
      'Delete'
    );
    if (this.deletedoc == true) {
      var req = {
        team_id: data.team_id,
        project_id: data.project_id,
      };

      this.http
        .postMethod('teams/deleteProjectbyTeam', req)
        .then(async (response: any) => {


          this.dataService.showSuccess(
            'success',
            ' Project Removed Successfully!'
          );
        
          await  this.viewProjectsModal.nativeElement.click();
          this.getTeams();
          this.view_projectsmodal(this.teamData)
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  getProjects() {
    this.http
      .getMethod('projects/getUnMappedProjects')
      .then((response: any) => {
        this.projectList = response.data;
        this.projectSearch = response.data;
        this.projectList = this.projectList.sort(function (a, b) {
          return a.project_name.localeCompare(b.project_name);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  addcategory(data) {
    if (data !== undefined) {
      if (Object.keys(data).length > 0) {
        this.catData = data;
        this.categoryAction = 'Edit Category';
        this.catList = false;
        this.formHandle = false;
        this.categoryForm();
      }
    } else {
      this.categoryAction = 'Add New Category';
      this.catList = false;
      this.formHandle = true;
      this.categoryForm();
    }
  }
  onChange(data) {
    let temp = this.addProjectForm.value.selstate;
    for (let i = 0; i < this.stateList.length; i++) {
      if (temp == this.stateList[i].code) {
        this.statecode = this.stateList[i].name;
      }
    }
    this.getCity(this.addProjectForm.value.selstate);
  }

  getCity(data) {
    this.http
      .getMethod('location/cities?country_code=IN&state_code=' + data)
      .then((response: any) => {
        this.cityList = response.data;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onGymSearch(data) {
    this.searchVal = data;
  }

  search() {
    let req = {
      search: this.searchVal,
    };
    this.http
      .postMethod('user/gym-search', req)
      .then((response: any) => {
        // this.dataService.showSuccess("success", response.response_desc);
        this.gymList = [];
        this.gymList = response.data;
      })
      .catch((err) => {
        console.log('error', err);
      });
  }

  reset() {
    // this.getDashboard();
  }

  addModal() {
    if ((this.showAdd = true)) {
    }
    this.showPassword = true;
    this.images = '';
    this.showImg = false;
    this.addProjectForm.reset();
  }

  onPaymentSelect(data) {
    this.addProjectForm.controls['paymentVal'].enable();
  }

  newForm() {
    this.addProjectForm = this.formBuilder.group({
      //Not Allowed Special Charachter = projectname: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-zA-Z])[a-zA-Z ]+$')])],
      teamname: [
        '',
        Validators.compose([Validators.required, Validators.pattern('')]),
      ],
      description: ['', Validators.compose([Validators.required])],
    });
  }
  categoryForm() {
    this.addCategoryForm = this.formBuilder.group({
      categoryname: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
      userType: ['', Validators.compose([Validators.required])],
    });
  }
  passwordValidate(formGroup: FormGroup) {
    const { value: password } = formGroup.get('pass');
    const { value: confirmPassword } = formGroup.get('cpass');
    if (password === confirmPassword) {
      this.showErr = false;
    } else {
      this.showErr = true;
    }
  }

  editGym(data) {
    this.showAdd = false;
    if ((this.showAdd = false)) {
    }
    this.showPassword = false;
    this.showImg = false;
    this.images = this.http.imageURL + data.picture;

    this.addProjectForm = this.formBuilder.group({
      gymname: [data.gym_name, Validators.compose([Validators.required])],
      gymownername: [
        data.gym_owner_name,
        Validators.compose([Validators.required]),
      ],
      email: [
        data.email_id,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      ],
      phoneno: [
        data.contact_no,
        Validators.compose([
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.required,
          Validators.pattern('^[0-9]*$'),
        ]),
      ],
      selstate: [data.state, Validators.compose([Validators.required])],
      selcity: [data.city, Validators.compose([Validators.required])],
      address: [data.address, Validators.compose([Validators.required])],
      pincode: [
        data.pincode,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]*$'),
        ]),
      ],
      selPayment: ['', Validators.compose([Validators.required])],
      paymentVal: [
        data.paid,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]*$'),
        ]),
      ],
      bankAccNo: [
        data.bank_account_number,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]*$'),
        ]),
      ],
      accHolderName: [
        data.bank_account_holder_name,
        Validators.compose([Validators.required]),
      ],
      branch: [data.bank_name, Validators.compose([Validators.required])],
      ifsc: [data.bank_ifsc_code, Validators.compose([Validators.required])],
      // payment_type : ['', Validators.compose([Validators.required])],
      // payment : ['', Validators.compose([Validators.required])],
    });

    this.croppedImage = this.images;
    //this.gymOwnerid = data.user_id;
  }

  async addprojectSubmit(item) {
    if (this.showAdd) {
      if (this.addProjectForm.status == 'VALID') {
        // var formData: any = new FormData();
        var img;
        if (this.images != '') {
          img = this.images;
        }
        var req = {
          team_name: this.addProjectForm.value.teamname,
          description: this.addProjectForm.value.description,
        };

        // if (this.showAdd == true) {
        this.http
          .postMethod('teams', req)
          .then((response: any) => {
            this.dataService?.showSuccess('success', response.message);
            this.closeModal?.nativeElement.click();
            this.closeModalPro?.nativeElement.click();
            this.getTeams();

            // this.closeModal.nativeElement.click();
            this.showImg = false;
            // this.getDashboard();
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.dataService.markFormGroupTouched(this.addProjectForm);
      }
    } else {
      if (this.addProjectForm.status == 'VALID') {
        this.editPro = await this.dataService.showDelete(
          'Please Confirm',
          'Do you want to Update the Team?',
          'Update'
        );

        if (this.editPro == true) {
          var img;
          var request = {};
          if (this.showImg) {
            img = this.images;
            request = {
              team_name: this.addProjectForm.value.teamname,
              description: this.addProjectForm.value.description,
            };
          } else {
            img = item?.project_img;
            request = {
              team_name: this.addProjectForm.value.teamname,
              description: this.addProjectForm.value.description,
            };
          }

          this.http
            .putMethod('teams/' + item.team_id, request)
            .then((response: any) => {
              this.closeModal.nativeElement.click();
              this.closeModalPro.nativeElement.click();
              this.dataService.showSuccess('success', response.message);

              // this.categoriesList = response.data;
              this.getTeams();
              this.showImg = false;
            })
            .catch((err) => {
              console.log(err);
            });
        }
      } else {
        this.dataService.markFormGroupTouched(this.addProjectForm);
      }
    }
  }

  selectPro(data) { }

  addteamSubmit(item) {


    this.MultiselectErr = true

    if (this.project_id.length > 0) {
      this.MultiselectErr = false;
      var request = {
        team_id: this.teamData.team_id,
        projects_id: this.project_id,
      };

      this.http
        .postMethod('projects/addProjectsinTeams', request)
        .then((response: any) => {
          if (response.status == true) {
            this.dataService.showSuccess('success', response.message);
            this.closeModal.nativeElement.click();
            this.addNewProjectForm.reset();
            this.project_id = [];
            
            this.addNewProjectForm.value.project = '';
            // this.categoriesList = response.data;
            this.getTeams();
            this.showImg = false;
          } else {
            this.dataService.showError('error', response.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.MultiselectErr = true;
    }
  }

  backFun() {
    this.mapUserForm.reset();
    this.user_ids = [];
    this.userList = [];
    this.userSearch = false;
    this.searchUser = [];
    this.role_id=[]
  }

  backFun2() {
    this.masterSelected = false;
    this.addNewProjectForm.reset();
    this.projectList = [];
    this.searchProject = '';
  }

  adduserSubmit() {
    

      if (this.user_ids.length > 0) {
        var request = {
          team_id: this.teamData.team_id,
          users_id: this.user_ids,
        };
        this.http
          .postMethod('teams/addUsersbyTeam', request)
          .then((response: any) => {
            this.dataService.showSuccess(
              'success',
              'User added Sucessfully in the Team!'
            );
            this.mapUserForm.reset();
            this.userList = [];
            this.user_ids = '';
            this.showImg = false;
            this.userSearch = false;
            this.searchUser = '';
            this.closeModal.nativeElement.click();
            this.adduserModal.nativeElement.click();
            this.getTeams();
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.MultiselectErr= true
      }
  }

  addCategorySubmit() {

    if (this.addCategoryForm.status == 'VALID') {
      // var formData: any = new FormData();
      var req = {
        category_name: this.addCategoryForm.value.categoryname,
        description: this.addCategoryForm.value.description,
        role_id: this.addCategoryForm.value.userType,
      };

      // if (this.showAdd == true) {

      this.http
        .postMethod('categories', req)
        .then((response: any) => {
          this.dataService.showSuccess('success', response.message);
          this.closeCatModal.nativeElement.click();

          // this.getDashboard();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.dataService.markFormGroupTouched(this.addCategoryForm);
    }
  }

  editCategorySubmit(category_id) {
    if (this.addCategoryForm.status == 'VALID') {

      var req = {
        category_name: this.addCategoryForm.value.categoryname,
        description: this.addCategoryForm.value.description,
        role_id: this.addCategoryForm.value.userType,
      };

      // if (this.showAdd == true) {

      this.http
        .putMethod(`categories/${category_id}`, req)
        .then((response: any) => {
          this.dataService.showSuccess('success', response.message);
          this.closeCatModal.nativeElement.click();

          // this.getDashboard();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.dataService.markFormGroupTouched(this.addCategoryForm);
    }
  }

  gotoGym(item: any) {
    let data = JSON.stringify(item);
    this.route.navigate(['admin/gymboard'], {
      queryParams: { item: data },
      skipLocationChange: true,
    });
  }

  async deleteGym(data) {
    this.deleteConfirm = await this.dataService.showDelete(
      'Please Confirm',
      'The respected details will be Deleted?',
      'Delete'
    );

    if (this.deleteConfirm == true) {
      this.http
        .deleteMethod('user/delete-all/' + data, '')
        .then((response: any) => {
          this.dataService.showSuccess('success', response.message);
          // this.getDashboard();
          this.closeModal.nativeElement.click();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  categoryList() {
    this.categoryAction = 'AVAILABLE CATEGORIES';
    this.catList = true;
    this.getcategoriesList();
  }
  backBtn() {
    this.categoryAction = 'Add New Category';
    this.catList = false;
  }
  async deleteCat(item) {
    this.deleteCate = await this.dataService.showDelete(
      'Please Confirm',
      'The selected category will be Deleted?',
      'Delete'
    );

    if (this.deleteCate == true) {
      this.http
        .deleteMethod('categories/' + item.category_id, '')
        .then((response: any) => {
          this.dataService.showSuccess('success', response.message);
          this.getcategoriesList();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  omit_special_char(event) {
    var k;
    k = event.charCode; //         k = event.keyCode;  (Both can be used)
    return (
      (k > 64 && k < 91) ||
      (k > 96 && k < 123) ||
      k == 8 ||
      k == 32 ||
      (k >= 48 && k <= 57)
    );
  }

  showCheckboxes() {
    this.showCheckbox = !this.showCheckbox;
    // this.selectedAll = '';
  }

  // selectAll(event, users) {
  //   let condtion = event.target.checked;
  //   if (condtion == true) {
  //     for (var i = 0; i < this.userList.length; i++) {
  //       this.userList[i].checked = true;
  //       this.user_ids.push(this.userList[i].user_id);
  //     }
  //   } else {
  //     this.user_ids = [];
  //     for (var i = 0; i < this.userList.length; i++) {
  //       this.userList[i].checked = false;
  //     }
  //   }
  // }
  checkIfAllSelected() {
    this.selectedAll = this.channelDDList.every(function (item: any) {
      return item.selected == true;
    });
  }



  // selectAllProj(e, projList) {
  //   let condtion = e.target.checked;
  //   this.checkedAllValue= condtion;

  //   if (condtion == true) {
  //     for (var i = 0; i < this.projectList.length; i++) {
  //       this.projectList[i].checked = true;
  //       this.project_id.push(this.projectList[i].project_id);
  //     }
  //   } else {
  //     this.project_id = [];
      
  //     for (var i = 0; i < this.projectList.length; i++) {
  //       this.projectList[i].checked = false;
  //     }
  //   }
  //   if (this.project_id.length === 0) {
  //     this.addNewProjectForm.controls.project.setValue('');
  //   }

  // }

  checkUncheckAll() {
    for (var i = 0; i < this.projectList.length; i++) {
      this.projectList[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
    if(this.project_id.length>0){    
      this.MultiselectErr = false;
    }
  }
  isAllSelected() {
    
    this.masterSelected = this.projectList.every(function(item:any) {
        return item.isSelected == true;
      })
    this.getCheckedItemList();
    if(this.project_id.length>0){     
      this.MultiselectErr = false;
    }
  }
 
  getCheckedItemList(){
    this.project_id = [];
    for (var i = 0; i < this.projectList.length; i++) {
      if(this.projectList[i].isSelected)
      this.project_id.push(this.projectList[i].project_id);
    }
  }

  toggleCheckbox(item: any): void {
    // this.project_id.push(item.project_id);
  
    item.isSelected = !item.isSelected; // Toggle the isSelected property
    if (!Array.isArray(this.project_id)) {
      this.project_id = [];
    }
      
    // Check if the item is selected and add its user_id to the user_id array
    if (item.isSelected && !this.project_id.includes(item.project_id)) {
      this.project_id.push(item.project_id);
    } else {
      // If the item is deselected, remove its user_id from the user_id array
      this.project_id = this.project_id.filter(id => id !== item.project_id);
    }
  
    this.MultiselectErr = false;
  }


  // user list
  checkUncheckAll2() {

    for (var i = 0; i < this.userList.length; i++) {
      this.userList[i].isSelected = this.masterSelected2;
    }
    this.getCheckedItemList2();
    if(this.user_ids.length>0){      
      this.MultiselectErr = false;
    }
  }
  isAllSelected2() {
    
    this.masterSelected2 = this.userList.every(function(item:any) {
        return item.isSelected == true;
      })

    this.getCheckedItemList2();
    if(this.user_ids.length>0){     
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
        item.isSelected = !item.isSelected; // Toggle the isSelected property
        
        if (!Array.isArray(this.user_ids)) {
          this.user_ids = [];
        }
        // Check if the item is selected and add its user_id to the user_id array
        if (item.isSelected && !this.user_ids.includes(item.user_id)) {
          this.user_ids.push(item.user_id);
        } else {
          // If the item is deselected, remove its user_id from the user_id array
          this.user_ids = this.user_id.filter(id => id !== item.user_id);
        }
      
        this.MultiselectErr = false;
      }
}
