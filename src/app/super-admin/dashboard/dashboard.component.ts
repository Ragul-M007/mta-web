import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, NgZone, OnDestroy, OnInit,Output,Input, ViewChild,ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import * as $ from 'jquery';
import { MatTabGroup } from '@angular/material/tabs';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from '../../service/data.service';
import { HttpService } from '../../service/http.service';
import { CommonserviceService } from '../../service/commonservice.service';
// import { CommonserviceService } from 'src/app/service/commonservice.service';

interface LatLng {
  latitude: number;
  longitude: number;
}



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit,AfterViewInit{

  @ViewChild('closeModal') private closeModal: ElementRef;
  @ViewChild('closeCatModal') private closeCatModal: ElementRef;
  @ViewChild('teamcloseModal') private teamcloseModal: ElementRef;
  @ViewChild('tabGroup', { static: true }) tab: any;
  showImg = false;
  images: any = "./../../../assets/image/Camera.png";
  croppedImage: any = "./../../../assets/image/Camera.png";
  addProjectForm: FormGroup;
  addTeamProjectForm: FormGroup;
  addCategoryForm: FormGroup;
  mapForm: FormGroup;
  filterList: any = ['Current Month', 'Last Month', 'Last 3 Month', 'Last 6 Month']
  gymImage: any;
  gymList: any = [];
  showAdd: boolean;
  paymentType: any = [
    { id: 0, 'name': 'Rental' },
    { id: 1, 'name': 'Commission' },
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
  catData: any
  userdetails: any;
  stateList: any;
  cityList: any;
  msg: string;
  statecode: any;
  projectList: any = [];
  AllProjList: any = [];
  filterProjList: any = [];
  backupProjList: any = []
  userRolesList: any;
  categoriesList: any;
  selectedState: any;
  noProject: string;
  selectedProject: any = {};
  categoryAction: string = "Add New category";
  catList: boolean;
  formHandle: boolean = true;
  deleteCate: unknown;
  editPro: unknown;
  option: any;
  selectededitProject: any = {};
  projectAction: string;
  projectActionBtn: string;
  teamId: any;
  teams_projectsId: any = [];
  categoriesListBackup: any = [];
  searchCat: string;
  positionMap = {
    street: "Brookline",
    num: "123",
    city: "NewYork"
  };
  // longitude: number;
  // latitude: number;

  // 10.994256049100754, 76.97299979750173
  // mapsURL: string;
  imgRemove: boolean = false;
  // textareaDefaultHeight: number = 45; // Set your default height here
  // textareaHeight: number;

  get frm() { return this.addProjectForm.controls; }
  get frmTeam() { return this.addTeamProjectForm.controls; }
  get frmCat() { return this.addCategoryForm.controls; }
  get mapform() { return this.mapForm.controls; }

  imageChangedEvent: any = '';
  showErr = false;
  searchText: string;
  searchdrop: string = '';
  filterResults: any = [];
  statusList: any = [{}];
  // disabledControl = true;
  // croppedImage: any = '';
  addTeamBtn: boolean = false;
  totalLength: any;
  page: number = 1;
  swipeLimitWidth = 80;
  connectEdges = true;
  selectedIndex: any = 0;
  mobileValue: string = '';
  @ViewChild('inputField') inputField: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;
  loading: boolean = false;
  editImg: boolean = false;

  /**Google Maps */
  // @ViewChild('map') mapElement: ElementRef;
  @ViewChild('map', { static: false }) mapElement: ElementRef;

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
  longitudes!: any;
  latitudes!: any;
  place!: google.maps.places.PlaceResult;
  link: string = '';
  combinedCoordinates!:string;
  options: any[] = [];
  geocoder!: google.maps.Geocoder;
  coordinates: LatLng | null = null;  

  constructor(public dataService: DataService,
    public formBuilder: FormBuilder,
    public http: HttpService,
    private router: ActivatedRoute,
    public route: Router,
    private cdr: ChangeDetectorRef,
    public ngzone: NgZone,
    private spinner: NgxSpinnerService,
    private commonservice: CommonserviceService) {
    router.params.subscribe(val => {
      this.newForm();
      this.categoryForm();
    })
  }
  ngOnInit(): void {
    

    this.option = this.router.snapshot.data.viewOption;
    this.ngzone.run(() => {
      if (this.option == 'projectPage') {
        this.userdetails = this.dataService.getData("userData");
        this.getStates();
        this.catData = {}
        this.getProjects();
        this.addTeamBtn = false;
        // $(".firstTab").addClass("active");
        //  var firstTabe = document.getElementById('#firstTab');
        //  firstTabe.classList.add('active');
        //  firstTabe.classList.add('cdk-mouse-focused');
      }
      else if (this.option == 'projectgetById') {
        this.userdetails = this.dataService.getData("userData");
        this.getStates();
        this.catData = {}
        this.addTeamBtn = true;
        this.router.queryParams.subscribe(params => {
          let temp = params["data"];
          this.getProjectById(temp)
          this.teamId = params["data"]
        });
      }
    })
    


    // this.focusOnTab(0);
    const pagelocal = this.dataService.getData("page")
    if (pagelocal > 1) {
      this.page = pagelocal
      this.dataService.removeData("page")
    }

    this.selectTab(0);

    this.mapForm = this.formBuilder.group({
      longitude: ['', Validators.compose([Validators.required, Validators.pattern(/^[0-9 ,.]+$/)])],
      // latitude: ['', Validators.compose([Validators.required])],
    });
  

  }

  getProjectById(temp) {
    this.http.getMethod("projects/getProjectsByTeam/" + temp).then((response: any) => {
      this.projectList = response.data;
      this.AllProjList = response.data;
      this.projectList = this.projectList.sort(function (a, b) { return a.project_name.localeCompare(b.project_name) });
      this.backupProjList = this.projectList;
      this.totalLength = this.projectList.length;
      this.getuserRoles();
    }).catch((err) => {
      console.log(err);
      if (err.statusText == "Unauthorized") {
        this.dataService.navigateForward("auth/login");

      }
    });
  }



  chngFun(data) {
    
    data = data.toLowerCase()
    if (data == "") {
      this.projectList = this.backupProjList;
      this.totalLength = this.projectList.length; 
      this.searchdrop = '';
    }

    if (data) {
      
      this.projectList = [];
      this.backupProjList.map((pro) => {
        if ((pro?.project_name.toLowerCase()).includes((data).toLowerCase()) && (pro?.status.toLowerCase()).includes((this.searchdrop).toLowerCase())){
            this.projectList.push(pro); 
        }

      })
    }
  }
    checkFilter(){ //Need Change //status key
      this.page = 1;
      
      if (this.projectList.length == 0) {
        this.noProject = "No projects available";
      }
      if (this.searchdrop == ""){
        this.projectList = this.AllProjList;
        console.log('ProjList',this.projectList);
        
        this.totalLength = this.projectList.length;

      } else {
        this.filterProjList = []

        this.AllProjList.map((i) => {
          if (i.status == this.searchdrop) {
            if (i) {
              this.filterProjList.push(i);
            }
          }
        })


        this.projectList = this.filterProjList;
        this.totalLength = this.projectList.length;
        
      }
    }
  addProject() {
    this.images = "./../../../assets/image/Camera.png";
    this.newForm();
    this.showAdd = true;
    // this.getStates();
    this.projectAction = "Add New Project";
    this.projectActionBtn = "ADD";
    // this.getcategoriesList();
    // this.getuserRoles();
  }


  addProjectInTeam() {

    this.images = "./../../../assets/image/Camera.png";
    this.newForm();
    this.mapForm.reset();
    this.selectTab(0);
    // this.mapsURL = `https://maps.google.com/maps?q=${11.109821423880947},${77.34401352765717}&z=12&output=embed`;
    this.showAdd = true;
    // this.getStates();
    this.projectAction = "Add New Project In Team";
    this.projectActionBtn = "ADD";
    // this.getcategoriesList();
    // this.getuserRoles();
  }


  getStates() {
    this.http.getMethod("location/states?country_code=IN").then((response: any) => {
      this.stateList = response.data;
    }).catch((err) => {
      console.log(err);
    });
  }

  getCities(state) {
    this.cityList = [];
    this.addProjectForm.controls.city.setValue('');
    this.addTeamProjectForm.controls.city.setValue('');
    this.selectedState = state.target.options[state.target.options.selectedIndex].text;
    this.http.getMethod("location/cities?country_code=IN&state_code=" + state.target.value).then((response: any) => {
      this.cityList = response.data;
    }).catch((err) => {
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


    const file = event.target.files[0];

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/gif', 'image/png'];

      if (!allowedTypes.includes(file.type)) {
        // Invalid file type
        this.images = ''
        this.showImg = false;
        this.dataService.showError("Error", "Only Image Formats Accept!")
        // this.form.get('image').setErrors({ invalidFileType: true });
      } else {
        // Valid file type
        // this.form.get('image').setErrors(null);
        this.showImg = true;
        this.imageChangedEvent = event;

      }
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.images = event.base64;
    this.croppedImage = this.base64ToFile(
      event.base64,
      this.imageChangedEvent.target.files[0].name,
    )


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
    // this.showImg = false;
  }

  viewProjects(item) {
    this.dataService.setData("page", this.page);

    this.route.navigate(["admin/viewproject"], { queryParams: { 'data': JSON.stringify(item) }, skipLocationChange: false });
  }

  viewpic(item) {
    this.selectedProject = item;
  }
  getuserRoles() {
    this.http.getMethod("users/user_roles").then((response: any) => {
      this.userRolesList = response.data;
    }).catch((err) => {
      console.log(err);
    });
  }

  editProject(data, event) {    
    this.selectTab(0);
    this.selectededitProject = {};
    this.selectedState = data.state;
    this.statusList = [{ 'name': "Completed" },{ 'name': "Cancelled" },{ 'name': "Active" }, { 'name': "Hold" }, { 'name': "Proposed" }]
 
  
    const ids = this.statusList.map(({ name }) => name);
    this.statusList = this.statusList.filter(({ name }, index) =>
        !ids.includes(name, index + 1));
    
    this.showAdd = false;
    this.projectAction = "Edit Project";
    this.projectActionBtn = "EDIT";
    // if ((data?.latitude != null || undefined) || (data?.longitude != null || undefined)) {
    //   //  `https://maps.google.com/maps?q=${data?.latitude},${data?.longitude}&z=18&output=embed`;

     

    //     console.log('lats',data.latitude)
    //     console.log('lngs',data.longitude)
    

    //     this.map = new google.maps.Map(this.mapElement.nativeElement, {
    //       center: { lat: data.latitude, lng: data.longitude },
    //       zoom: 16
    //   });

      
    //   console.log('latsss',data.latitude)
    //   console.log('lngsss',data.longitude)
  
      
    //   // Add a marker at the specified location
    // this.marker = new google.maps.Marker({
    //       position: { lat: data.latitude, lng: data.longitude },
    //       map: this.map,
    //       animation: google.maps.Animation.DROP,
    //   });

      
    //   console.log('latsssssssssssss',data.latitude)
    //   console.log('lngsssssssssssss',data.longitude)


    // } else {
    //   // this.mapsURL = `https://maps.google.com/maps?q=${11.109821423880947},${77.34401352765717}&z=12&output=embed`;
    // }

    // if (typeof data.latitude == 'number' && typeof data.longitude == 'number') {
      console.log('typof called');
      
      const latitude = parseFloat(data.latitude);
const longitude = parseFloat(data.longitude);
console.log('lat',latitude);
console.log('lng',longitude);


if (!isNaN(latitude) && !isNaN(longitude)) {
  this.map = new google.maps.Map(this.mapElement.nativeElement, {
    center: { lat: latitude, lng: longitude },
    zoom: 16,
  });

  this.marker = new google.maps.Marker({
    position: { lat: latitude, lng: longitude },
    map: this.map,
    animation: google.maps.Animation.DROP,
  });
  this.marker.addListener('dragend', (dragEvent: google.maps.MapMouseEvent) => {
    if (dragEvent.latLng) {
      this.updateLatLng(dragEvent.latLng);
    }
  });
  this.map.addListener('click', (event: google.maps.MapMouseEvent) => this.addMarker(event));
 

} else {
  console.error('Invalid latitude or longitude:', data);
}
    // }
    setTimeout(() => {                           //<<<---using ()=> syntax
      for (var i = 0; i < this.stateList.length; i++) {
        if (data.state == this.stateList[i].name) {
          data.stateCode = this.stateList[i].code;
          this.getCity(data.stateCode);

        }
      }

    }, 100);


    if ((data.latitude === '' || data.latitude === null) && (data.longitude === '' || data.longitude === null)) {
      this.mapForm = this.formBuilder.group({
        longitude: ['', Validators.compose([Validators.required,Validators.pattern(/^[0-9 ,.]+$/)])],
      });
    } else {
      this.mapForm = this.formBuilder.group({
        longitude: [data?.latitude?.concat("," + data?.longitude) || '', Validators.compose([Validators.required,Validators.pattern(/^[0-9 ,.]+$/)])],
      });

  
      
    }


    setTimeout(() => {

      this.addProjectForm = this.formBuilder.group({
        projectname: [data?.project_name, Validators.compose([Validators.required, Validators.pattern('')])],
        state: [data?.stateCode, Validators.compose([Validators.required])],
        city: [data?.city, Validators.compose([Validators.required])],
        area: [data?.address, Validators.compose([Validators.required])],
        description: [data?.description, Validators.compose([Validators.required])],
        status: [data?.status, Validators.compose([])],
      });

      // this.addProjectForm.controls.city.setValue(data?.city)

      this.selectededitProject = data;
      // this.selectededitProject.state = data.stateCode;
      // this.selectededitProject.city = data.city;
      // this.selectededitProject.description = data.description;
      // this.selectededitProject.status = data.status;
      // this.selectededitProject.address = data.address;
      this.images = this.http.imageURL + data.project_img;

      if ((data.project_img != undefined || null) && (data.project_img.length > 0)) {

        this.showImg = false;
        this.editImg = true;
        this.imageChangedEvent = event;
      } else {

      }
    }, 600);
  }

  async deleteProject(item) {
    this.deleteproject = await this.dataService.showDelete("Please Confirm", "The selected Project will be Deleted?", "Delete");


    if (this.deleteproject == true) {
      this.http.deleteMethod('projects/' + item.project_id, '').then((response: any) => {

        this.dataService.showSuccess("success", response.message);
        this.searchText = '';

        if (this.teamId == 0 || this.teamId == undefined || this.teamId == null) {
          this.getProjects();

        }
        else {
          this.getProjectById(this.teamId)
        }

        this.closeModal.nativeElement.click();
      }).catch((err) => {
        console.log(err);
      });
    }
  }


  getcategoriesList() {
    this.http.getMethod("categories/avail_cats").then((response: any) => {
      this.categoriesList = response.data;
      this.categoriesListBackup = response.data;


    }).catch((err) => {
      console.log(err);
    });
  }
  getProjects() {
    this.http.getMethod("projects?user_id=" + this.userdetails.user_id).then((response: any) => {
      this.projectList = response.data;
      this.AllProjList = response.data;
      this.projectList = this.projectList.sort(function (a, b) { return a.project_name.localeCompare(b.project_name) });
      this.backupProjList = this.projectList;
      this.totalLength = this.projectList.length;
      // this.tota
      this.getuserRoles();
    }).catch((err) => {
      console.log(err);
      if (err.statusText == "Unauthorized") {
        this.dataService.navigateForward("auth/login");

      }
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
    }
    else {
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
    this.http.getMethod("location/cities?country_code=IN&state_code=" + data).then((response: any) => {
      this.cityList = response.data;
      for (let i = 0; i < this.cityList.length; i++) {
        this.cityList[i].name = this.cityList[i].name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  onGymSearch(data) {
    this.searchVal = data;
  }

  search() {
    let req = {
      "search": this.searchVal
    }
    this.http.postMethod("user/gym-search", req).then((response: any) => {
      // this.dataService.showSuccess("success", response.response_desc);
      this.gymList = [];
      this.gymList = response.data;
    }).catch((err) => {
      console.log("error", err);
    });
  }

  reset() {
    // this.getDashboard();
  }

  addModal() {
    this.statusList = [{'name':""},{ 'name': "Active" }, { 'name': "Hold" }, { 'name': "Proposed" }] 
 

 
const ids = this.statusList.map(({ name }) => name);
this.statusList = this.statusList.filter(({ name }, index) =>
    !ids.includes(name, index + 1));
    this.showAdd = true;
    this.showPassword = true;
    this.images = ''
    this.showImg = false;
    this.editImg = false;
    // this.textareaHeight = this.textareaDefaultHeight;
    // this.addProjectForm.reset();
    // this.addTeamProjectForm.reset();
    // this.mapForm.reset();
    this.selectTab(0);
    // this.mapsURL = `https://maps.google.com/maps?q=${11.109821423880947},${77.34401352765717}&z=12&output=embed`;
  }
  addModal2() {
    this.statusList = [{'name':""},{ 'name': "Active" }, { 'name': "Hold" }, { 'name': "Proposed" }]  
    const ids = this.statusList.map(({ name }) => name);
    this.statusList = this.statusList.filter(({ name }, index) =>
        !ids.includes(name, index + 1));
    this.showAdd = true;
    this.showPassword = true;
    this.images = ''
    this.showImg = false;
    this.editImg = false;
    // this.textareaHeight = this.textareaDefaultHeight;
    // this.addTeamProjectForm.reset();
    // this.mapForm.reset();
    this.selectTab(0);
    // this.mapsURL = `https://maps.google.com/maps?q=${11.109821423880947},${77.34401352765717}&z=12&output=embed`;
  }

  onPaymentSelect(data) {
    this.addProjectForm.controls['paymentVal'].enable();
  }

  newForm() {
    this.addProjectForm = this.formBuilder.group({
      //Not Allowed Special Charachter = projectname: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-zA-Z])[a-zA-Z ]+$')])],
      projectname: ['', Validators.compose([Validators.required, Validators.pattern('')])],
      state: ['', Validators.compose([Validators.required])],
      // email: ['', Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])],
      // phoneno: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
      city: ['', Validators.compose([Validators.required])],
      area: ['', Validators.compose([Validators.required])],
      // pincode: ['', Validators.compose([Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(6), Validators.maxLength(6)])],
      description: ['', Validators.compose([Validators.required])],
      status: ['', Validators.compose([Validators.required])],
      // longitude: ['', Validators.compose([Validators.required])],
      // latitude: ['', Validators.compose([Validators.required])],
    },

    );

    this.addTeamProjectForm = this.formBuilder.group({
      //Not Allowed Special Charachter = projectname: ['', Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-zA-Z])[a-zA-Z ]+$')])],
      projectname: ['', Validators.compose([Validators.required, Validators.pattern('')])],
      state: ['', Validators.compose([Validators.required])],
      // email: ['', Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])],
      // phoneno: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
      city: ['', Validators.compose([Validators.required])],
      area: ['', Validators.compose([Validators.required])],
      // pincode: ['', Validators.compose([Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(6), Validators.maxLength(6)])],
      description: ['', Validators.compose([Validators.required])],
      status: ['', Validators.compose([Validators.required])]
    },

    );

  }
  categoryForm() {
    this.addCategoryForm = this.formBuilder.group({
      categoryname: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
      userType: ['', Validators.compose([Validators.required])]
    },

    );
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
    this.showPassword = false;
    this.showImg = false;
    this.images = this.http.imageURL + data.picture;
    this.addProjectForm = this.formBuilder.group({
      gymname: [data.gym_name, Validators.compose([Validators.required])],
      gymownername: [data.gym_owner_name, Validators.compose([Validators.required])],
      email: [data.email_id, Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])],
      phoneno: [data.contact_no, Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.required, Validators.pattern("^[0-9]*$")])],
      selstate: [data.state, Validators.compose([Validators.required])],
      selcity: [data.city, Validators.compose([Validators.required])],
      address: [data.address, Validators.compose([Validators.required])],
      pincode: [data.pincode, Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
      selPayment: ['', Validators.compose([Validators.required])],
      paymentVal: [data.paid, Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
      bankAccNo: [data.bank_account_number, Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
      accHolderName: [data.bank_account_holder_name, Validators.compose([Validators.required])],
      branch: [data.bank_name, Validators.compose([Validators.required])],
      ifsc: [data.bank_ifsc_code, Validators.compose([Validators.required])],
      // payment_type : ['', Validators.compose([Validators.required])],
      // payment : ['', Validators.compose([Validators.required])],
    });
    this.croppedImage = this.images;
    //this.gymOwnerid = data.user_id;
  }

  

  async stepMap(item) {
 
    if (this.showAdd) {
      if (this.addProjectForm.status == 'VALID') {
        this.selectedIndex = '';
        this.selectTab(1);

      } else {
        if (!this.croppedImage) {
          this.dataService.showError("error", "Please select the profile image");
        }

        this.dataService.markFormGroupTouched(this.addProjectForm);
      }
    } else {
      if (this.addProjectForm.status == 'VALID') {
        this.selectedIndex = '';
        this.selectTab(1);
      }
      else {
        this.dataService.markFormGroupTouched(this.addProjectForm);
      }
    }
  }
  

  async finalAddprojectSubmit(item) {


 
    if (this.showAdd) {

      if (this.addProjectForm.status == 'VALID' && !this.mapForm.controls.longitude.hasError('pattern')) {
        var img;

        if (this.images != '') {

          img = this.images;
        }
        let longandlat;

        if ((this.mapForm.value.longitude != undefined || null) && (this.mapForm.value.longitude.length > 0)) {
          longandlat = this.mapForm.value.longitude.split(",");
          console.log('long---->',longandlat);
          

        } else {
          longandlat = '';
        }

        var req;
        if ((longandlat != undefined || null) && (longandlat.length > 0)) {

          req = {
            "project_name": this.addProjectForm.value.projectname,
            "description": this.addProjectForm.value.description,
            "state": this.selectedState,  //this.addProjectForm.value.state,
            "city": this.addProjectForm.value.city,
            "address": this.addProjectForm.value.area,
            "project_img": img,
            "status": this.addProjectForm.value.status,
            "start_date": "2021-02-22",
            "end_date": "2021-08-22",
            "latitude": longandlat[0],
            "longitude": longandlat[1],
          }
        } else {
          req = {
            "project_name": this.addProjectForm.value.projectname,
            "description": this.addProjectForm.value.description,
            "state": this.selectedState,  //this.addProjectForm.value.state,
            "city": this.addProjectForm.value.city,
            "address": this.addProjectForm.value.area,
            "project_img": img,
            "status": this.addProjectForm.value.status,
            "start_date": "2021-02-22",
            "end_date": "2021-08-22",
            "latitude": longandlat,
            "longitude": longandlat,
          }
        }

        this.http.postMethod("projects", req).then((response: any) => {
    

          if(response.status == true){
  

            this.dataService.showSuccess("success", response.Message);
            if (response.data.insertId != 0 && this.addTeamBtn == true) {
              this.teams_projectsId = []
              this.teams_projectsId.push(response.data.insertId)
 
      
  
              var request = {
                "team_id": parseInt(this.teamId),
                "projects_id": this.teams_projectsId
              }
  
              this.http.postMethod("projects/addProjectsinTeams", request).then((response: any) => {
                this.getProjectById(this.teamId)
                this.mapForm.reset();
                this.closeModal.nativeElement.click();
                this.addTeamProjectForm.reset();
                this.showImg = false;
                this.addProjectForm.reset();
                this.searchText = '';




  
              }).catch((err) => {
                console.log(err);
              });
  
            } else if(this.addTeamBtn == false) {
              this.dataService.showSuccess("Success", response.Message);
              this.getProjects();
              this.searchText = '';
              this.closeModal.nativeElement.click();
              this.showImg = false;
              this.addProjectForm.reset();
              this.mapForm.reset();

              // this.getDashboard();
            }
          }         
        
        }).catch((err) => {
          console.log(err);
        });

      } else {
        if (this.addProjectForm.status == "INVALID") {
          this.selectedIndex = 0;
          this.selectTab(0);
          this.dataService.markFormGroupTouched(this.addProjectForm);
        }
        // if (this.mapForm.status == "INVALID") {
        //   this.dataService.markFormGroupTouched(this.mapForm);
        // }

        if (!this.croppedImage) {
          this.dataService.showError("error", "Please select the profile image");
          this.selectedIndex = 0;
          this.selectTab(0);
        }

      }

    } else {
      if (this.addProjectForm.status == 'VALID' && !this.mapForm.controls.longitude.hasError('pattern')) {

        this.editPro = await this.dataService.showDelete("Please Confirm", "Do you want to Update the project?", "Update");

        if (this.editPro == true) {


          var img;
          if (this.images != '') {
            img = this.images;
          }
          var request = {};
          if (this.showImg) {

            let longandlat;
            if ((this.mapForm.value.longitude != undefined || null) && (this.mapForm.value.longitude.length > 0)) {
              longandlat = this.mapForm.value.longitude.split(",");

            } else {
              longandlat = '';
            }


            if ((longandlat != undefined || null) && (longandlat.length > 0)) {
              request = {
                "project_name": this.addProjectForm.value.projectname,
                "description": this.addProjectForm.value.description,
                "state": this.selectedState,  //this.addProjectForm.value.state,
                "city": this.addProjectForm.value.city,
                "address": this.addProjectForm.value.area,
                'status': this.addProjectForm.value.status,
                "project_img": img,
                "latitude": longandlat[0],
                "longitude": longandlat[1],
              }
            } else {
              request = {
                "project_name": this.addProjectForm.value.projectname,
                "description": this.addProjectForm.value.description,
                "state": this.selectedState,  //this.addProjectForm.value.state,
                "city": this.addProjectForm.value.city,
                "address": this.addProjectForm.value.area,
                'status': this.addProjectForm.value.status,
                "project_img": img,
                "latitude": longandlat,
                "longitude": longandlat,
              }
            }

          } else if (this.imgRemove == true) {
            let longandlat;
            if ((this.mapForm.value.longitude != undefined || null) && (this.mapForm.value.longitude.length > 0)) {
              longandlat = this.mapForm.value.longitude.split(",");

            } else {
              longandlat = '';  
            }

            if ((longandlat != undefined || null) && (longandlat.length > 0)) {
  
              request = {
                "project_name": this.addProjectForm.value.projectname,
                "description": this.addProjectForm.value.description,
                "state": this.selectedState,  //this.addProjectForm.value.state,
                "city": this.addProjectForm.value.city,
                "address": this.addProjectForm.value.area,
                'status': this.addProjectForm.value.status,
                "project_img": this.commonservice.projectImg,
                "latitude": longandlat[0],
                "longitude": longandlat[1],
              }
            } else {

              request = {
                "project_name": this.addProjectForm.value.projectname,
                "description": this.addProjectForm.value.description,
                "state": this.selectedState,  //this.addProjectForm.value.state,
                "city": this.addProjectForm.value.city,
                "address": this.addProjectForm.value.area,
                'status': this.addProjectForm.value.status,
                "project_img": this.commonservice.projectImg,
                "latitude": longandlat,
                "longitude": longandlat,
              }
            }

          }
          else {

            img = item.project_img;
            let longandlat;
            if ((this.mapForm.value.longitude != undefined || null) && (this.mapForm.value.longitude.length > 0)) {
              longandlat = this.mapForm.value.longitude.split(",");

            } else {
              longandlat = '';

            }

            if ((longandlat != undefined || null) && (longandlat.length > 0)) {
              request = {
                "project_name": this.addProjectForm.value.projectname,
                "description": this.addProjectForm.value.description,
                "state": this.selectedState,  //this.addProjectForm.value.state,
                "city": this.addProjectForm.value.city,
                "address": this.addProjectForm.value.area,
                'status': this.addProjectForm.value.status,
                "latitude": longandlat[0],
                "longitude": longandlat[1],
              }
            } else {
              request = {
                "project_name": this.addProjectForm.value.projectname,
                "description": this.addProjectForm.value.description,
                "state": this.selectedState,  //this.addProjectForm.value.state,
                "city": this.addProjectForm.value.city,
                "address": this.addProjectForm.value.area,
                'status': this.addProjectForm.value.status,
                "latitude": longandlat,
                "longitude": longandlat,
              }
            }

          }

          this.http.putMethod("projects/" + item.project_id, request).then((response: any) => {
            this.dataService.showSuccess("success", response.message);

            this.closeModal.nativeElement.click();
            // this.categoriesList = response.data;
            this.searchText = '';

            if (this.teamId == 0 || this.teamId == undefined || this.teamId == null) {
              this.getProjects();

            }
            else {
              this.getProjectById(this.teamId)
            }

            this.showImg = false;
          }).catch((err) => {
            console.log(err);
          });
        }

      }
      else {

        if (this.addProjectForm.status == "INVALID") {
          this.selectedIndex = 0;
          this.selectTab(0);
          this.dataService.markFormGroupTouched(this.addProjectForm);
        }
        // if (this.mapForm.status == "INVALID") {
        //   this.dataService.markFormGroupTouched(this.mapForm);
        // }
      }
    }
  }

  // movetoMap(item) {
  //   console.log('itesmmm>>>',item, this.addTeamProjectForm.status);
  //   // console.log('Data>>>>>',this.addTeamProjectForm.value);
    
  //   console.log("this.showAdd",this.showAdd, this.selectTab,this.selectedIndex);
  //   // this.selectTab(1);
    
  //    if (this.showAdd) {
  //     if (this.addTeamProjectForm.status == 'VALID') {
  //       console.log("valid 1", this.selectTab);
  //       this.selectedIndex = '';
  //       this.selectTab(1);

  //     } else {
  //       console.log("not valid 1", this.selectTab);

  //       if (!this.croppedImage) { 
  //         this.dataService.showError("error", "Please select the profile image");
  //       }
  //       if (this.addTeamProjectForm.status == 'INVALID') {
  //         this.dataService.markFormGroupTouched(this.addTeamProjectForm);
  //         this.selectTab(0);
  //       }

  //    }
  //   }   else {
  //     if (this.addTeamProjectForm.status == 'VALID') {
  //       this.selectedIndex = '';
  //       this.selectTab(1);
  //     }
  //     else {
  //       // this.dataService.showError("error", "Please select the profile image");
  //       this.dataService.markFormGroupTouched(this.addProjectForm);
  //     }
  //   }
  // }

  async movetoMap(item) {
    console.log("itm>>>>>>>",this.selectedIndex)
    if (this.showAdd) {
      if (this.addTeamProjectForm.status == 'VALID') {
        this.selectedIndex = '';
        this.selectTab(1);

      } else {
        if (!this.croppedImage) {
          this.dataService.showError("error", "Please select the profile image");
        }

        this.dataService.markFormGroupTouched(this.addTeamProjectForm);
      }
    } else {
      if (this.addTeamProjectForm.status == 'VALID') {
        this.selectedIndex = '';
        this.selectTab(1);
      }
      else {
        this.dataService.markFormGroupTouched(this.addTeamProjectForm);
      }
    }
  }

  async addteamprojectSubmit(item) {

    if (this.showAdd) {
      if (this.addTeamProjectForm.status == 'VALID') {
        // var formData: any = new FormData();
        var img;
        if (this.images != '') {
          img = this.images;
        }
     
        let longandlat;

        if ((this.mapForm.value.longitude != undefined || null) && (this.mapForm.value.longitude.length > 0)) {
          longandlat = this.mapForm.value.longitude.split(",");

        } else {
          longandlat = '';
        }

        var req;
        if ((longandlat != undefined || null) && (longandlat.length > 0)) {
          req = {
            "project_name": this.addTeamProjectForm.value.projectname,
            "description": this.addTeamProjectForm.value.description,
            "state": this.selectedState,  //this.addTeamProjectForm.value.state,
            "city": this.addTeamProjectForm.value.city,
            "address": this.addTeamProjectForm.value.area,
            "project_img": img,
            "status": this.addTeamProjectForm.value.status,
            "start_date": "2021-02-22",
            "end_date": "2021-08-22",
            "latitude": longandlat[0],
            "longitude": longandlat[1],
          }
        } else {
          req = {
            "project_name": this.addTeamProjectForm.value.projectname,
            "description": this.addTeamProjectForm.value.description,
            "state": this.selectedState,  //this.addTeamProjectForm.value.state,
            "city": this.addTeamProjectForm.value.city,
            "address": this.addTeamProjectForm.value.area,
            "project_img": img,
            "status": this.addTeamProjectForm.value.status,
            "start_date": "2021-02-22",
            "end_date": "2021-08-22",
            "latitude": longandlat,
            "longitude": longandlat,
          }
        }

        this.http.postMethod("projects", req).then((response: any) => {

          if (response.status == true) {
            if (response.data.insertId != 0) {
              this.teams_projectsId = []
              this.teams_projectsId.push(response.data.insertId)

              var request = {
                "team_id": parseInt(this.teamId),
                "projects_id": this.teams_projectsId
              }

              this.http.postMethod("projects/addProjectsinTeams", request).then((response: any) => {
                this.dataService.showSuccess("success", response.message);
                this.getProjectById(this.teamId)
                this.mapForm.reset();
                this.teamcloseModal.nativeElement.click();
                this.addTeamProjectForm.reset();
                this.showImg = false;

              }).catch((err) => {
                console.log(err);
              });

            }
          }

        }).catch((err) => {
          console.log(err);
        });


      } else {

        if (this.addTeamProjectForm.status == 'INVALID') {
          this.selectedIndex = 0;
          this.selectTab(0);
          this.dataService.markFormGroupTouched(this.addTeamProjectForm);
          this.dataService.showError("Alert!", "Please fill Project Detail Before Add Location!")
        }
        // if (this.mapForm.status == 'INVALID') {
        //   this.dataService.markFormGroupTouched(this.mapForm);
        // }

      }
    }

  }

  addCategorySubmit() {

    if (this.addCategoryForm.status == 'VALID') {
      // var formData: any = new FormData();

      var req = {
        "category_name": this.addCategoryForm.value.categoryname,
        "description": this.addCategoryForm.value.description,
        "role_id": this.addCategoryForm.value.userType

      }

      // if (this.showAdd == true) {

      this.http.postMethod("categories", req).then((response: any) => {
        this.dataService.showSuccess("success", response.message);
        this.closeCatModal.nativeElement.click();

        // this.getDashboard();


      }).catch((err) => {
        console.log(err);
        // this.dataService.showError()
      });

    } else {

      this.dataService.markFormGroupTouched(this.addCategoryForm);
    }
  }

  editCategorySubmit(category_id) {
    if (this.addCategoryForm.status == 'VALID') {
      // var formData: any = new FormData();

      var req = {
        "category_name": this.addCategoryForm.value.categoryname,
        "description": this.addCategoryForm.value.description,
        "role_id": this.addCategoryForm.value.userType

      }

      // if (this.showAdd == true) {

      this.http.putMethod(`categories/${category_id}`, req).then((response: any) => {
        this.dataService.showSuccess("success", response.message);
        this.closeCatModal.nativeElement.click();

        // this.getDashboard();


      }).catch((err) => {
        console.log(err);
      });

    } else {

      this.dataService.markFormGroupTouched(this.addCategoryForm);
    }
  }
  addcategoryForm() {
    this.addCategoryForm.reset();
    this.categoryAction = 'Add New Category';
    this.formHandle = true;
  }

  gotoGym(item: any) {
    let data = JSON.stringify(item);
    this.route.navigate(["admin/gymboard"], { queryParams: { 'item': data }, skipLocationChange: true });
  }

  async deleteGym(data) {
    this.deleteConfirm = await this.dataService.showDelete("Please Confirm", "The respected details will be Deleted?", "Delete");

    if (this.deleteConfirm == true) {
      this.http.deleteMethod('user/delete-all/' + data, '').then((response: any) => {
        this.dataService.showSuccess("success", response.message);
        // this.getDashboard();
        this.closeModal.nativeElement.click();
      }).catch((err) => {
        console.log(err);
      });
    }
  }
  categoryList() {
    this.categoryAction = 'AVAILABLE CATEGORIES';
    this.catList = true;
    this.getcategoriesList();
    this.searchCat = ''
  }
  backBtn() {
    this.categoryAction = 'Add New Category';
    this.catList = false;
  }


  checkCat(event) {
    var data;
    data = event.target.value;
    this.categoriesList = [];
    if (data) {
      this.categoriesListBackup.map((pro: any) => {
        // ((pro?.project_name.toLowerCase()).includes((data).toLowerCase()))
        if ((pro.category_name.toLowerCase()).includes((data).toLowerCase())) {
          this.categoriesList.push(pro)
        }
      })
    }
    else {
      this.categoriesList = this.categoriesListBackup;
    }

  }

  async deleteCat(item) {
    this.deleteCate = await this.dataService.showDelete("Please Confirm", "The selected category will be Deleted?", "Delete");


    if (this.deleteCate == true) {
      this.http.deleteMethod('categories/' + item.category_id, '').then((response: any) => {
        this.dataService.showSuccess("success", response.message);
        this.getcategoriesList();

      }).catch((err) => {
        console.log(err);
      });
    }
  }
  omit_special_char(event) {

    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }

  openComments(item) {

    item.from = 'Project'
    this.route.navigate(['admin/project-comments'], { queryParams: { 'data': JSON.stringify(item) }, skipLocationChange: false });
  }

  selectTab(index: number): void {

    this.selectedIndex = '';
    this.selectedIndex = index;
    this.tab.selectedIndex = index;

  }
  // getLocation(e) {
  //   var longi;
  //   longi = e.target.value.split(',');
  //   this.latitude = longi[0];
  //   this.longitude = longi[1];
   
    // this.mapsURL = `https://maps.google.com/maps?q=${this.latitude},${this.longitude}&z=18&output=embed`;
  // }

  whiteSpaceCheck(event: any) {

    // var space = document.getElementById('inputSpace')

    var input = document.getElementById('input');
    var invalidChars = ['-', '+', 'e', '.', '`', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', "'", '"', '?', '<', '>', '{', '}', '[', ']', '=', '|', "\\", ':', ';', '/', '~'];

    const alpha = Array.from(Array(26)).map((e, i) => i + 65);
    var alphabet = alpha.map((x) => String.fromCharCode(x));

    const alphaLowercase = Array.from(Array(26)).map((e, i) => i + 97);
    const alphabetLowercase = alphaLowercase.map((x) => String.fromCharCode(x));

    const combinedAlphabet = alphabet.concat(alphabetLowercase);
    const combinesletter = combinedAlphabet.concat(invalidChars)

    input.addEventListener('keydown', function (e) {
      if (combinesletter.includes(e.key)) {
        e.preventDefault();
      }
    });

  }

  whiteSpaceCheck2(event: any) {

    // var space = document.getElementById('inputSpace')

    if (event.target.selectionStart == 0 && event.code == "Space") {
      event.preventDefault();
    }

  }

  restrictNumber(event: any): void {
    const newValue = event.target.value.replace(new RegExp(/[^0-9\.]/g, 'ig'), '');
    this.mobileValue = newValue;
  }

  ngAfterViewInit() {

    this.initializeMap();
    this.getPlaceAutocomplete();
    // const data = { latitude: 40.73061, longitude: -73.935242 };
    this.geocoder = new google.maps.Geocoder();
   
   

    var invalidChars = ['x', '-', '+', 'e', 'E', '`', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', "'", '"', '?', '<', '>', '{', '}', '[', ']', '=', '|', "\\", ':', ';', '/', '~', 'a', 'b', 'c', 'd', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'w', 'y', 'z']

    const alpha = Array.from(Array(26)).map((e, i) => i + 65);
    var alphabet = alpha.map((x) => String.fromCharCode(x));

    const alphaLowercase = Array.from(Array(26)).map((e, i) => i + 97);
    const alphabetLowercase = alphaLowercase.map((x) => String.fromCharCode(x));

    // const combinedAlphabet = alphabet.concat(alphabetLowercase);
    // const combinesletter = combinedAlphabet.concat(invalidChars)

    // this.fileInput.nativeElement.addEventListener('keydown', function (e: any) {
    //   if (alphabet.includes(e.key)) {
    //     e.preventDefault();
    //   }
    //   // if (alphabetLowercase.includes(e.key)) {
    //   //   e.preventDefault();
    //   // }
    //   if (invalidChars.includes(e.key)) {
    //     e.preventDefault();
    //   }

    //   const key = e.key;

    //   // Get the ASCII value of the pressed key
    //   const keyCode = key.charCodeAt(0);

    //   // ASCII value for 'v' and 'V'
    //   const vKeyCode = 'v'.charCodeAt(0);
    //   const VKeyCode = 'V'.charCodeAt(0);

    //   // Check if the pressed key is 'v' or 'V' and prevent default behavior
    //   if (keyCode === vKeyCode || keyCode === VKeyCode) {
    //     e.preventDefault();
    //   }

    // });


    /**special character restriction */
    var pattern = /[^0-9\.]/g;
    // /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9 ]+/
    // this.inputField.nativeElement.addEventListener('keydown', function (a: any) {
    //   if (pattern.test(a.key)) {
    //     a.preventDefault();
    //   }
    // });
  }

  alphaNumberOnly(e) {  // Accept only alpha numerics, not special characters 
    var regex = new RegExp("^[a-zA-Z0-9 ]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
      return true;
    }

    e.preventDefault();
    return false;

  }

  showSpinner() {
    this.spinner.show();
  }

  hideSpinner() {
    this.spinner.hide();
  }

  removeImg() {
    if (this.editImg == true) {
      this.editImg = false;
      this.images = '';
      this.imgRemove = true;

    }

    this.showImg = false;
    this.images = [];
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Check if the Tab key is pressed
    if (event.key === 'Tab') {
  
      event.preventDefault();
    }
  }
  backFun() {
    this.addProjectForm.reset();
    this.mapForm.reset();
    this.showImg = false;
    this.editImg = false;
    this.imageChangedEvent = '';
    this.images = '';
    this.link = ''
    this.initializeMap()

  }
  backFun2(){
    this.addTeamProjectForm.reset();
    this.mapForm.reset();
    this.showImg = false;
    this.editImg = false;
    this.imageChangedEvent = '';
    this.images = '';
  }

  /**Google Maps*/
  
  initializeMap(): void {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: { lat: this.latitude, lng: this.longitude }, 
      zoom: this.zoom,
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

    console.log('lat, lng', lat, lng);
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
        center: { lat: lat, lng: lng },
        zoom: 16,

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
      // alert('Coordinates are null');
    
    
      // this.dataService.showError("Error", "Invalid link. Please provide a correct URL.")

    }

  }
  
  
  updateLatLng(latLng: google.maps.LatLng) {
    this.display = latLng.toJSON();
    this.latitudes = this.display.lat.toString();
    this.longitudes = this.display.lng.toString();
    this.combinedCoordinates = this.latitudes+','+this.longitudes
    this.cdr.detectChanges();
  }

  getLocation(e:any) {
    var longi : any;
    longi = e.target.value.split(',');
    this.latitudes = longi[0];
    this.longitudes = longi[1];
  }
  

  
}
