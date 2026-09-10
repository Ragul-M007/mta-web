import { HostListener, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { NgForm } from '@angular/forms';
import moment from 'moment';

import * as $ from 'jquery';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  Renderer2,
  NgZone,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ImageCroppedEvent } from 'ngx-image-cropper';
import { DataService } from '../../service/data.service';
import { HttpService } from '../../service/http.service';



@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  readonly managedByBothValue = '__BOTH__';
  @ViewChild('closeModal') private closeModal: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('closeModalChat') closeModalChat: ElementRef;


  images: any;
  showReplies: boolean = false;
  chatList: any = [];
  // chatList=[{'showReplies':false,'picture':'application/1614062892487_image_picker6503659757908921466.jpg','name':'Suresh','role':'owner','gymName':'TMF Gym','date':"Feb 25",'replies':[{'name':"Admin",'message':"Lorem Ipsum is simply dummy text of the printing and typesetting industry",'date':"Feb 25"},{'name':"Suresh",'message':"Lorem Ipsum is simply dummy text of the printing and typesetting industry",'date':"Feb 25"}],'message':'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. '},
  // {'showReplies':false,'name':'Saranya','role':'Refilling Agent','gymName':'','date':"Feb 25",'replies':[{'name':"Admin",'message':"Lorem Ipsum is simply dummy text of the printing and typesetting industry",'date':"Feb 25"},{'name':"Saranya",'message':"Lorem Ipsum is simply dummy text of the printing and typesetting industry",'date':"Feb 25"}],'message':'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. '}]
  createOffForm: FormGroup;
  messageList: any = [];
  managedBy = [
    { city: 'Tiruppur', type: 'A' },
    { city: 'Chennai', type: 'B' },
    { city: 'Both', type: this.managedByBothValue },
  ];
  socket: any;
  conversationList: any;
  message: string;
  tempChatList: any = [];
  searchDate: any;
  usersList: any = [];
  addUserForm: FormGroup;
  addChatAccesUserForm: FormGroup;
  userRolesList: any = [];
  showAdd: boolean;
  showPassword: boolean;
  addProjectForm: any;
  gymImage: any;
  searchdrop: string = '';
  noProject: string;
  searchText: string;
  showImg: boolean;
  showOTP: boolean = true;
  imageChangedEvent: any;
  croppedImage: File;
  usersListCus: any = [];
  usersListStaf: any = [];
  usersListCont: any = [];
  usersListVend: any = [];
  usersListPublicUser: any = [];
  usersListC: any = [];
  cityList: any = [];
  stateList: any = [];
  selectedState: any;
  profession: number = 0;
  prof_clients: any = [];
  prof_staff: any = [];
  prof_contractors: any = [];
  prof_consultants: any = [];
  prof_vendors: any = [];
  prof_publicuser: any = [];

  dropdownSettings: any = {};
  showProjectDrop: boolean = false;
  selectedItems = [];
  totalLength:any;
  page:number;
  itemsPerPage2 = 10;
  //  this.dropdownSettings = {
  //   singleSelection: false,
  //   idField: 'user_id',
  //   textField: 'name',
  //   // textField: 'project_name',
  //   unSelectAllText: 'UnSelect All',
  //   enableSearchFilter: true,
  //   itemsShowLimit: 3,
  //   allowSearchFilter: true,
  //   noDataAvailablePlaceholderText: "No results matched your search!",
  //   allowRemoteDataSearch: false,
  //   selectAllText: 'Select All',
  //   clearSearchFilter: false,
  //   closeDropDownOnSelection:true,

  // }

  // prof_staff: any=[{"prof":"Project Manager"},{"prof":"Draft Man"},{"prof":"Site Enginner"},{"prof":"Design Team"}];
  // prof_consul: any=[{"prof":"Structural"},{"prof":"Plumbing"},{"prof":"Electrical"},{"prof":"3D Design"},{"prof":"Landscape"}];
  // prof_vendor: any=[{"prof":"Airconditioning"},{"prof":"curtains/fabrics"},{"prof":"Lights"},{"prof":"Wallpaper"},{"prof":"CCTV/PA/Telecomm"},{"prof":"Glass/Mirror Work"},{"prof":"UPVC Window"},{"prof":"Furniture/Chair"},{"prof":"Acoustics"},{"prof":"CVS"},{"prof":"PEB"}];
  // prof_contractors: any=[{"prof":"Plumbing"},{"prof":"Electrical"},{"prof":"Carpenter"},{"prof":"Tile/Marbel Flooring"},{"prof":"Woodern Flooring"},{"prof":"Rubber Flooring"},{"prof":"False Ceiling"},{"prof":"Polish / Painting"},{"prof":"Airconditioning"},{"prof":"MS Work"},{"prof":"Civil"},{"prof":"Deploy Counter"},{"prof":"Display Counter"},{"prof":"Garden Work"},{"prof":"Overall Contractor"},{"prof":"Interior Carpenter"}]

  defaultDiacriticsRemovalMap: any = [
    {
      base: 'A',
      letters:
        '\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F',
    },
    { base: 'AA', letters: '\uA732' },
    { base: 'AE', letters: '\u00C6\u01FC\u01E2' },
    { base: 'AO', letters: '\uA734' },
    { base: 'AU', letters: '\uA736' },
    { base: 'AV', letters: '\uA738\uA73A' },
    { base: 'AY', letters: '\uA73C' },
    {
      base: 'B',
      letters: '\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181',
    },
    {
      base: 'C',
      letters:
        '\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E',
    },
    {
      base: 'D',
      letters:
        '\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779\u00D0',
    },
    { base: 'DZ', letters: '\u01F1\u01C4' },
    { base: 'Dz', letters: '\u01F2\u01C5' },
    {
      base: 'E',
      letters:
        '\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E',
    },
    { base: 'F', letters: '\u0046\u24BB\uFF26\u1E1E\u0191\uA77B' },
    {
      base: 'G',
      letters:
        '\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E',
    },
    {
      base: 'H',
      letters:
        '\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D',
    },
    {
      base: 'I',
      letters:
        '\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197',
    },
    { base: 'J', letters: '\u004A\u24BF\uFF2A\u0134\u0248' },
    {
      base: 'K',
      letters:
        '\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2',
    },
    {
      base: 'L',
      letters:
        '\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780',
    },
    { base: 'LJ', letters: '\u01C7' },
    { base: 'Lj', letters: '\u01C8' },
    { base: 'M', letters: '\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C' },
    {
      base: 'N',
      letters:
        '\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4',
    },
    { base: 'NJ', letters: '\u01CA' },
    { base: 'Nj', letters: '\u01CB' },
    {
      base: 'O',
      letters:
        '\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C',
    },
    { base: 'OI', letters: '\u01A2' },
    { base: 'OO', letters: '\uA74E' },
    { base: 'OU', letters: '\u0222' },
    { base: 'OE', letters: '\u008C\u0152' },
    { base: 'oe', letters: '\u009C\u0153' },
    {
      base: 'P',
      letters: '\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754',
    },
    { base: 'Q', letters: '\u0051\u24C6\uFF31\uA756\uA758\u024A' },
    {
      base: 'R',
      letters:
        '\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782',
    },
    {
      base: 'S',
      letters:
        '\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784',
    },
    {
      base: 'T',
      letters:
        '\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786',
    },
    { base: 'TZ', letters: '\uA728' },
    {
      base: 'U',
      letters:
        '\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244',
    },
    { base: 'V', letters: '\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245' },
    { base: 'VY', letters: '\uA760' },
    {
      base: 'W',
      letters: '\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72',
    },
    { base: 'X', letters: '\u0058\u24CD\uFF38\u1E8A\u1E8C' },
    {
      base: 'Y',
      letters:
        '\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE',
    },
    {
      base: 'Z',
      letters:
        '\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762',
    },
    {
      base: 'a',
      letters:
        '\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250',
    },
    { base: 'aa', letters: '\uA733' },
    { base: 'ae', letters: '\u00E6\u01FD\u01E3' },
    { base: 'ao', letters: '\uA735' },
    { base: 'au', letters: '\uA737' },
    { base: 'av', letters: '\uA739\uA73B' },
    { base: 'ay', letters: '\uA73D' },
    {
      base: 'b',
      letters: '\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253',
    },
    {
      base: 'c',
      letters:
        '\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184',
    },
    {
      base: 'd',
      letters:
        '\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A',
    },
    { base: 'dz', letters: '\u01F3\u01C6' },
    {
      base: 'e',
      letters:
        '\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD',
    },
    { base: 'f', letters: '\u0066\u24D5\uFF46\u1E1F\u0192\uA77C' },
    {
      base: 'g',
      letters:
        '\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F',
    },
    {
      base: 'h',
      letters:
        '\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265',
    },
    { base: 'hv', letters: '\u0195' },
    {
      base: 'i',
      letters:
        '\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131',
    },
    { base: 'j', letters: '\u006A\u24D9\uFF4A\u0135\u01F0\u0249' },
    {
      base: 'k',
      letters:
        '\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3',
    },
    {
      base: 'l',
      letters:
        '\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747',
    },
    { base: 'lj', letters: '\u01C9' },
    { base: 'm', letters: '\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F' },
    {
      base: 'n',
      letters:
        '\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5',
    },
    { base: 'nj', letters: '\u01CC' },
    {
      base: 'o',
      letters:
        '\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275',
    },
    { base: 'oi', letters: '\u01A3' },
    { base: 'ou', letters: '\u0223' },
    { base: 'oo', letters: '\uA74F' },
    {
      base: 'p',
      letters: '\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755',
    },
    { base: 'q', letters: '\u0071\u24E0\uFF51\u024B\uA757\uA759' },
    {
      base: 'r',
      letters:
        '\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783',
    },
    {
      base: 's',
      letters:
        '\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B',
    },
    {
      base: 't',
      letters:
        '\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787',
    },
    { base: 'tz', letters: '\uA729' },
    {
      base: 'u',
      letters:
        '\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289',
    },
    { base: 'v', letters: '\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C' },
    { base: 'vy', letters: '\uA761' },
    {
      base: 'w',
      letters:
        '\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73',
    },
    { base: 'x', letters: '\u0078\u24E7\uFF58\u1E8B\u1E8D' },
    {
      base: 'y',
      letters:
        '\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF',
    },
    {
      base: 'z',
      letters:
        '\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763',
    },
  ];
  deleteuser: unknown;
  addUser: boolean;
  selecteduser: any = {};
  userData: any = {};
  value: any;
  addEditlabel: string;
  addEditBtn: string;
  selectedUser: any = {};
  confirmpass: boolean;
  usersListCusBackup: any[];
  usersListStafBackup: any[];
  usersListContBackup: any[];
  usersListVendBackup: any[];
  usersListPublicUserBackup: any[];
  usersListCBackup: any[];
  activeTabId: string = 'general-home';

  option: any;
  lengthErr: boolean = false;
  newUserAlert: boolean = false;
  condition: boolean = false;
  finalusersLists: any = [];
  newAdduser: boolean = true;
  newAdduser2: boolean = false;
  chatAccesUsersList: any = [];
  user_ids: any = [];
  chatUsersList: any = [];
  noData: boolean = false;
  chatAccesUsersListBackup: any = [];
  ribbon: boolean = false;

  get frm() {
    return this.addUserForm.controls;
  }

  get form() {
    return this.addChatAccesUserForm.controls;
  }

  constructor(
    public dataService: DataService,
    public formBuilder: FormBuilder,
    public http: HttpService,
    private router: ActivatedRoute,
    public ngzone: NgZone,
    public route: Router,
    private el: ElementRef,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    
    this.option = this.router.snapshot.data.viewOption;

    var today = new Date().toISOString().split('T')[0];
    document.getElementById('date-input').setAttribute('max', today);

    this.ngzone.run(() => {
      if (this.option === 'revisit') {
        this.newForm();
        this.getStates();
        this.getuserRoles();
        this.getCategories();
        this.getCategories2().then((data: any) => {
          if (data.length > 0) {
          }
        });

        this.router.queryParams.subscribe((params) => {
          let temp = params['data'];

          if (temp === 'viewUser') {
            const tab_id = this.dataService.getData('location');

            if (tab_id === 'general-home') {
              this.activeTabId = 'general-home';
              var element = document.getElementById('general-home');
              element.classList.add('active');
              this.searchReset(6);             
            } else if (tab_id === 'staffs') {
              this.activeTabId = 'staffs';
              var element = document.getElementById('gym-owner');
              element.classList.add('active');
              this.searchReset(2);
            } else if (tab_id === 'contractors') {
              this.activeTabId = 'contractors';
              var element = document.getElementById('member');
              element.classList.add('active');
              this.searchReset(5);
            } else if (tab_id === 'consultants') {
              this.activeTabId = 'consultants';
              var element = document.getElementById('consult');
              element.classList.add('active');
              this.searchReset(4);
            } else if (tab_id === 'vendors') {
              this.activeTabId = 'vendors';
              var element = document.getElementById('trainer');
              element.classList.add('active');
              this.searchReset(3);
            } else if (tab_id === 'publicuser') {
              this.activeTabId = 'publicuser';
              var element = document.getElementById('publicuser');
              element.classList.add('active');
              this.searchReset(7);
            }
          }
        });
      } else if (this.option == undefined) {
        this.newForm();
        // this.getUsers().then((data: any) => {
        //   if (data) {
        //     this.makeActive();
        //   }
        // });
        this.getUsersAdd(6,1,"","").then((data: any) => {
          if (data) {
            this.makeActive();
          }
        });
        this.getStates();
        this.getuserRoles();
        this.getCategories();
        this.getCategories2().then((data: any) => {
          if (data.length > 0) {
            this.searchReset(6);
          }
        });

        // setTimeout(() => {
        //   this.makeActive();
        // }, 1000);
      }

      this.addChatAccesUserForm = this.formBuilder.group({
        userMultiselct: ['', Validators.compose([Validators.required])],
      });

    });

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'user_id',
      textField: 'name',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      itemsShowLimit: 3,
      allowSearchFilter: true,
      noDataAvailablePlaceholderText: "No results matched your search!",
      allowRemoteDataSearch: false,
      selectAllText: 'Select All',
      clearSearchFilter: false,
      closeDropDownOnSelection: true,

    }

    var input = document.getElementById('input');
    var invalidChars = ['-', '+', 'e', '.', '`', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', "'", '"', '?', '<', '>', ',', '{', '}', '[', ']', '=', '|', "\\", ':', ';', '/', '~'];

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

  isActiveTab(tabId: string): boolean {
    return tabId === this.activeTabId;
  }

  dateFormat(date) {
    return moment(date).format('LLLL');
  }
  addModal() {
    this.showAdd = true;
    this.showPassword = true;
    this.images = '';
    this.addUserForm.reset();
    this.getuserRoles();
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
    // console.log('failed');
  }

  backfun() {
    this.showProjectDrop = false;
    this.images = [];
    this.showImg = false;
    this.noData = false;
    this.fileInput.nativeElement.value = '';
    this.addChatAccesUserForm.reset();
    this.addChatAccesUserForm.get('userMultiselct').setValue([]);
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

    this.addUserForm.value.city = '';
    // this.addUserForm.controls.city.setValue('')
    this.userData.city = '';
    if (state.code) {
      this.value = state.code;
      this.selectedState = state.name;
    } else {
      this.value = state.target.value;
      this.selectedState =
        state.target.options[state.target.options.selectedIndex].text;
    }

    this.cityList = [];
    this.http
      .getMethod('location/cities?country_code=IN&state_code=' + this.value)
      .then((response: any) => {

        this.cityList = response.data;
        for (let i = 0; i < this.cityList.length; i++) {
          this.cityList[i].name = this.cityList[i].name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getProf(role) {
    this.profession = role;
    this.userData.prof = '';
    this.newAdduser2 = false;
    this.newAdduser = true;
    if (this.profession == 7 || this.profession == 1) {
      this.addUserForm.controls.prof.setValue(0);
      this.newAdduser2 = false;
      this.newAdduser = false;

    }
    // else {
    //   this.addUserForm.controls.prof.setValue(undefined)
    //   // this.addUserForm.value.prof ="dudeee"
    // }

    // this.getCategories();
    // if(state.code){
    //   this.value=state.code;
    //   this.selectedState = state.name;
    // }else{
    //   this.value=state.target.value
    //   this.selectedState = state.target.options[state.target.options.selectedIndex].text;
    // }

    // this.http.getMethod("location/cities?country_code=IN&state_code="+ this.value).then((response: any) => {
    //   this.cityList = response.data;
    // }).catch((err) => {
    //   console.log(err);
    // });
  }

  getUsers() {
    this.usersListCus = [];
    this.usersListCusBackup = [];
    this.usersListStaf = [];
    this.usersListStafBackup = [];
    this.usersListCont = [];
    this.usersListContBackup = [];
    this.usersListVend = [];
    this.usersListVendBackup = [];
    this.usersListPublicUser = [];
    this.usersListPublicUserBackup = [];
    this.usersListC = [];
    this.usersListCBackup = [];
    // this.totalLength = '';

    return new Promise((resolve, reject) => {
      this.http
        .getMethod('users')
        .then((response: any) => {
          let res = response.data;
          for (var i = 0; i < res.length; i++) {
            if (res[i].role_id == 6) {
              this.profession = 6;
              this.usersListCus.push(res[i]);
              this.usersListCusBackup.push(res[i]);
              resolve(this.usersListCusBackup);
            } else if (res[i].role_id == 2) {
              this.profession = 2;
              this.usersListStaf.push(res[i]);
             
              
              this.usersListStafBackup.push(res[i]);
              resolve(this.usersListStafBackup);
            } else if (res[i].role_id == 3) {
              this.profession = 3;
              this.usersListVend.push(res[i]);
              this.usersListVendBackup.push(res[i]);
              resolve(this.usersListVendBackup);
            } else if (res[i].role_id == 4) {
              this.profession = 7;
              this.usersListC.push(res[i]);
              this.usersListCBackup.push(res[i]);
              resolve(this.usersListCBackup);
            } else if (res[i].role_id == 5) {
              this.profession = 5;
              this.usersListCont.push(res[i]);
              this.usersListContBackup.push(res[i]);
              resolve(this.usersListContBackup);
            } else if (res[i].role_id == 7) {
              this.profession = 7;
              this.usersListPublicUser.push(res[i]);
              this.usersListPublicUserBackup.push(res[i]);
              resolve(this.usersListPublicUserBackup);
            }
          }

          for (let i = 0; i < this.usersListPublicUser.length; i++) {
            if (this.usersListPublicUser[i].new_user == null) {
              this.newUserAlert = true;
              this.condition = true;
            }
          }


          this.usersListCus = this.usersListCus.sort(function (a, b) {
            return a.name.localeCompare(b.name);
          });
          this.usersListStaf = this.usersListStaf.sort(function (a, b) {
            return a.name.localeCompare(b.name);
          });
          this.usersListVend = this.usersListVend.sort(function (a, b) {
            return a.name.localeCompare(b.name);
          });
          this.usersListC = this.usersListC.sort(function (a, b) {
            return a.name.localeCompare(b.name);
          });
          this.usersListCont = this.usersListCont.sort(function (a, b) {
            return a.name.localeCompare(b.name);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  searchUser(data) {

    this.usersListCus = [];
    if (data) {
      this.usersListCusBackup.map((pro: any) => {
        if (pro?.name.toLowerCase().includes(data.toLowerCase())) {
          this.usersListCus.push(pro);
        }
      });
    } else {
      this.usersListCus = this.usersListCusBackup;
    }
  }

  searchStaf(data) {
    this.usersListStaf = [];
    if (data) {
      this.usersListStafBackup.map((pro: any) => {
        if (pro?.name.toLowerCase().includes(data.toLowerCase())) {
          this.usersListStaf.push(pro);
        }
      });
    } else {
      this.usersListStaf = this.usersListStafBackup;
    }
  }

  searchContract(data) {
    this.usersListCont = [];
    if (data) {
      this.usersListContBackup.map((pro: any) => {
        if (pro?.name.toLowerCase().includes(data.toLowerCase())) {
          this.usersListCont.push(pro);
        }
      });
    } else {
      this.usersListCont = this.usersListContBackup;
    }
  }

  searchConsultant(data) {
    this.usersListC = [];
    if (data) {
      this.usersListCBackup.map((pro: any) => {
        if (pro?.name.toLowerCase().includes(data.toLowerCase())) {
          this.usersListC.push(pro);
        }
      });
    } else {
      this.usersListC = this.usersListCBackup;
    }
  }

  searchVendors(data) {
    this.usersListVend = [];
    if (data) {
      this.usersListVendBackup.map((pro: any) => {
        if (pro?.name.toLowerCase().includes(data.toLowerCase())) {
          this.usersListVend.push(pro);
        }
      });
    } else {
      this.usersListVend = this.usersListVendBackup;
    }
  }

  searchPublicusers(data) {
    this.usersListPublicUser = [];
    if (data) {
      this.usersListPublicUserBackup.map((pro: any) => {
        if (pro?.name.toLowerCase().includes(data.toLowerCase())) {
          this.usersListPublicUser.push(pro);
        }
      });
    } else {
      this.usersListPublicUser = this.usersListPublicUserBackup;
    }
  }
  searchchatAccessusers(data) {
    this.chatAccesUsersList = [];
    if (data) {
      this.chatAccesUsersListBackup.map((pro: any) => {
        if (pro?.name.toLowerCase().includes(data.toLowerCase())) {
          this.chatAccesUsersList.push(pro);
        }
      });
    } else {
      this.chatAccesUsersList = this.chatAccesUsersListBackup;
    }
  }

   searchReset(profession: any) {
    this.itemsPerPage2 = 10;
    this.newAdduser = false;
    this.newAdduser2 = true;
    this.searchText = '';
    // this.page = 0;
    // this.getUsers();
    this.updateUsersList();

    this.finalusersLists = [];
    if (profession == 6) {
      this.finalusersLists = this.prof_clients;
      this.page = 1;
      this.getUsersAdd(6,this.page,"","");
    }
    if (profession == 2) {
      this.finalusersLists = this.prof_staff;
      this.usersListStaf = this.usersListStafBackup;
      // this.totalLength = this.usersListStafBackup.length;
      this.page = 1;
      this.getUsersAdd(2,this.page,"","");
    }
    if (profession == 5) {
      this.finalusersLists = this.prof_contractors;
      this.usersListCont = this.usersListContBackup;
      // this.totalLength = this.usersListContBackup.length;
      this.page = 1;
      this.getUsersAdd(5,this.page,"","");
    }
    if (profession == 4) {
      this.finalusersLists = this.prof_consultants;
      this.usersListC = this.usersListCBackup;
      this.page = 1;
      this.getUsersAdd(4,this.page,"","");
      // this.totalLength = this.usersListCBackup.length;
    }
    if (profession == 3) {
      this.finalusersLists = this.prof_vendors;
      this.usersListVend = this.usersListVendBackup;
      // this.totalLength = this.usersListVendBackup.length;
      this.page = 1;
      this.getUsersAdd(3,this.page,"","");
    }
    if (profession == 7) {
      this.newAdduser = false;
      this.newAdduser2 = false;
      this.addUserForm.controls.prof.setValue(0);
      this.usersListPublicUser = this.usersListPublicUserBackup;
      // this.totalLength = this.usersListPublicUserBackup.length;
      this.page = 1;
      this.getUsersAdd(7,this.page,"","");
    }
    if (this.profession == 7 || this.profession == 1) {
      this.newAdduser = false;
      this.newAdduser2 = false;
      this.addUserForm.controls.prof.setValue(0);
      this.usersListPublicUser = this.usersListPublicUserBackup;
      // this.totalLength = this.usersListPublicUserBackup.length;
      this.page = 1;
      this.getUsersAdd(7,this.page,"","");
    }

    if (profession == 9) {
      this.chatAccesUsersList = [];
      this.chatAccesUsersListBackup = [];
      this.http.getMethod('chat/groupCreateAccessUserList?status=linkedUser').then((respone: any) => {
        this.chatAccesUsersList = respone.data;
        this.chatAccesUsersListBackup = respone.data;
        // this.totalLength = this.chatAccesUsersListBackup.length;
        this.page = 1;
        this.getUsersAdd(9,this.page,"","");
      }).catch((err) => {
        console.log("err", err);
      });
    }

  }

  makeActive() {
    if (this.newUserAlert == true) {
      this.activeTabId = 'publicuser';
      var element = document.getElementById('general-home');
      element.classList.remove('active');
      var element = document.getElementById('publicuser');
      element.classList.add('active');
    } else {
      var element = document.getElementById('publicuser');
      element.classList.remove('active');
      var element = document.getElementById('general-home');
      element.classList.add('active');
      this.activeTabId = 'general-home';
      // this.totalLength = this.usersListCus.length;
    }
  }

  updateUsersList() {
    this.http
      .getMethod('users/updateusercounts')
      .then((response: any) => {
        this.usersListReset();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  usersListReset() {
    this.http
      .getMethod('users/usercounts')
      .then((response: any) => {
        // let res = response.data;
        // this.usersCounts = res.length;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  adduser() {
    this.images = '';

    this.addUser = true;
    this.addEditlabel = 'Add New User';
    this.addEditBtn = 'ADD';
    this.addUserForm.controls['pass'].enable();
    this.addUserForm.controls['cpass'].enable();
    this.newForm();
    this.newAdduser = true;
    this.newAdduser2 = false;
  }
  editUser(item) {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    var currentdate = dd + '-' + mm + '-' + yyyy;
    // this.newForm();
    this.newAdduser = false;
    this.newAdduser2 = true;
    this.userData = {};
    this.selecteduser = {};
    this.addUser = false;
    this.addUserForm.controls['pass'].disable();
    this.addUserForm.controls['cpass'].disable();
    this.addEditlabel = 'Edit User';
    this.addEditBtn = 'EDIT';
    this.profession = item.role_id;
    this.selecteduser = item;
    this.userData.userName = item.name;
    this.userData.email = item.email;
    this.userData.phoneno = item.mobile_no;
    this.userData.city = item.city;
    this.userData.state = item.state;
    this.userData.area = item.area;
    //this.userData.pass=item.password;
    this.userData.status = item.status;
    this.userData.dob = moment(item.dob).format('YYYY-MM-DD');
    this.userData.annDate = moment(item.anniver_date).format('YYYY-MM-DD');
    // this.userData.annDate =currentdate;
    this.userData.loginpin = item.loginpin;
    this.userData.images = item.user_img;
    // this.userData.prof = item.prof;


    if (typeof item.prof === 'string') {
      if (item.role_id == 6) {
        for (let i = 0; i < this.prof_clients.length; i++) {
          if (this.prof_clients[i].category_name === item.prof) {
            this.userData.prof = this.prof_clients[i].category_id;
          }
        }
      }
      if (item.role_id == 2) {
        for (let i = 0; i < this.prof_staff.length; i++) {
          if (this.prof_staff[i].category_name === item.prof) {
            this.userData.prof = this.prof_staff[i].category_id;
          }
        }
      }
      if (item.role_id == 5) {
        for (let i = 0; i < this.prof_contractors.length; i++) {
          if (this.prof_contractors[i].category_name === item.prof) {
            this.userData.prof = this.prof_contractors[i].category_id;
          }
        }
      }
      if (item.role_id == 3) {
        for (let i = 0; i < this.prof_vendors.length; i++) {
          if (this.prof_vendors[i].category_name === item.prof) {
            this.userData.prof = this.prof_vendors[i].category_id;
          }
        }
      }
      if (item.role_id == 4) {
        for (let i = 0; i < this.prof_consultants.length; i++) {
          if (this.prof_consultants[i].category_name === item.prof) {
            this.userData.prof = this.prof_consultants[i].category_id;
          }
        }
      }
    }
    this.userData.created_by =
      item.created_by === null ? this.managedByBothValue : item.created_by;
    this.images = "https://mta.multitechcorp.in/mta-img/" + item.user_img;
    this.userData.userType = item.role_id;
    if (this.profession == 7) {
      this.newAdduser2 = false;
      this.newAdduser = false;
      this.addUserForm.controls.prof.setValue(0);

    }

    setTimeout(() => {
      //<<<---using ()=> syntax
      for (var i = 0; i < this.stateList.length; i++) {
        if (item.state == this.stateList[i].name) {
          this.userData.state = this.stateList[i].code;

          this.getCities(this.stateList[i]);
        }
      }
    }, 500);

    setTimeout(() => {
      //<<<---using ()=> syntax
      for (var i = 0; i < this.cityList.length; i++) {
        if (item.city == this.cityList[i].name) {
          this.userData.city = this.cityList[i].name;
        }
      }
    }, 1000);

    //    setTimeout(()=>{                           //<<<---using ()=> syntax
    //     for(var i=0; i <  this.userRolesList.length;i++){
    //       if(item.role_id == this.userRolesList[i].role_id){
    //        this.userData.userType = this.userRolesList[i].role_id;
    //       }
    //      }
    // }, 1000);
  }

  getuserRoles() {
    this.http
      .getMethod('users/user_roles')
      .then((response: any) => {
        this.userRolesList = response.data;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getCategories() {
    return new Promise((resolve, reject) => {
      this.http
        .getMethod('categories/avail_cats')
        .then((response: any) => {
          var role2 = [];
          var role3 = [];
          var role4 = [];
          var role5 = [];
          var role6 = [];
          var filterProfession = response.data.map(function (e) {
            if (e.role_id == 2) {
              role2.push(e);
            } else if (e.role_id == 3) {
              role3.push(e);
            } else if (e.role_id == 4) {
              role4.push(e);
            } else if (e.role_id == 5) {
              role5.push(e);
            } else if (e.role_id == 6) {
              role6.push(e);
            }
          });

          this.prof_staff = role2;
          this.prof_vendors = role3;
          this.prof_consultants = role4;
          this.prof_contractors = role5;
          this.prof_clients = role6;
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  getCategories2() {
    return new Promise((resolve, reject) => {
      this.http
        .getMethod('categories/avail_cats')
        .then((response: any) => {
          var role2 = [];
          var role3 = [];
          var role4 = [];
          var role5 = [];
          var role6 = [];
          var filterProfession = response.data.map(function (e) {
            if (e.role_id == 2) {
              role2.push(e);
            } else if (e.role_id == 3) {
              role3.push(e);
            } else if (e.role_id == 4) {
              role4.push(e);
            } else if (e.role_id == 5) {
              role5.push(e);
            } else if (e.role_id == 6) {
              role6.push(e);
            }
          });

          resolve(role6);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  async deleteUser(item) {
    this.deleteuser = await this.dataService.showDelete(
      'Please Confirm',
      'The selected User will be Deleted?',
      'Delete'
    );

    if (this.deleteuser == true) {
      this.http
        .deleteMethod('users/' + item.user_id, '')
        .then((response: any) => {
          this.dataService.showSuccess('success', response.message);
          this.getUsers();
          this.closeModal.nativeElement.click();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  newForm() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    var currentdate = dd + '-' + mm + '-' + yyyy;

    this.addUserForm = this.formBuilder.group({
      userType: ['', Validators.compose([Validators.required])],
      userName: ['', Validators.compose([Validators.required])],
      dob: ['', Validators.compose([])],
      annDate: [currentdate, Validators.compose([])],
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$'),
        ]),
      ],
      phoneno: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.pattern(/^-?(0|[1-9]\d*)?$/),
        ]),
      ],
      state: ['', Validators.compose([Validators.required])],
      city: ['', Validators.compose([Validators.required])],
      prof: ['', Validators.compose([Validators.required])],
      area: ['', Validators.compose([Validators.required])],
      pass: [
        '',
        Validators.compose([Validators.required, Validators.minLength(4)]),
      ],
      cpass: [
        '',
        Validators.compose([Validators.required, Validators.minLength(4)]),
      ],
      created_by: ['', Validators.compose([Validators.required])],
    });
  }
  equalto(field_name): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      let input = control.value;
      this.confirmpass = true;
      let isValid;
      if (this.addUserForm) {
        if (field_name == 'pass') {
          isValid = this.addUserForm.value.cpass == input;
        } else {
          isValid = this.addUserForm.value.pass == input;
        }
      }
      if (!isValid) {
        this.confirmpass = false;
        if (this.addUserForm) {
          return { equalTo: { isValid } };
        } else {
          return null;
        }
      } else {
        // this.newPasswordStrength(input);
        // this.onInputCheckPass(this.confirmPassword);
        return null;
      }
    };
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
    const createdByValue =
      this.addUserForm.value.created_by === this.managedByBothValue
        ? null
        : this.addUserForm.value.created_by;
    if (this.addUser) {
      //if (this.addUserForm.status == 'VALID') {

      // var formData: any = new FormData();
      if (this.addUserForm.status == 'VALID') {
        var img;
        if (this.images != '') {
          img = this.images;
        }

        //diacritivsMapping
        var diacriticsMap = {};
        for (var i = 0; i < this.defaultDiacriticsRemovalMap.length; i++) {
          var letters = this.defaultDiacriticsRemovalMap[i].letters;
          for (var j = 0; j < letters.length; j++) {
            diacriticsMap[letters[j]] =
              this.defaultDiacriticsRemovalMap[i].base;
          }
        }

        // "what?" version ... http://jsperf.com/diacritics/12
        function removeDiacritics(str) {
          return str?.replace(/[^\u0000-\u007E]/g, function (a) {
            return diacriticsMap[a] || a;
          });
        }
        if (this.addUserForm.value.city !== undefined) {
          var diacritics_city = removeDiacritics(this.addUserForm.value.city);
        }

        req = {
          role_id: this.addUserForm.value.userType,
          name: this.addUserForm.value.userName,
          email: this.addUserForm.value.email,
          mobile_no: this.addUserForm.value.phoneno,
          city: diacritics_city,
          state: this.selectedState,
          area: this.addUserForm.value.area,
          password: this.addUserForm.value.pass,
          cpassword: this.addUserForm.value.cpass,
          status: 'A',
          dob: this.addUserForm.value.dob,
          anniver_date: this.addUserForm.value.annDate,
          prof: this.addUserForm.value.prof,
          created_by: createdByValue,
          loginpin: '',
          user_img: img,
        };
        // if (this.showAdd == true) {

        this.http
          .postMethod('users', req)
          .then((response: any) => {
            this.dataService.showSuccess('success', response.message);
            this.getUsers();
            this.showImg = false;
            this.closeModal.nativeElement.click();

            // this.getDashboard();
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.dataService.markFormGroupTouched(this.addUserForm);
      }
    } else {
      if (this.addUserForm.value.userType == 2 && this.addUserForm.value.prof == 0) {
        this.addUserForm.controls.prof.setValue(undefined)
      }
      else if (this.addUserForm.value.userType == 3 && this.addUserForm.value.prof == 0) {
        this.addUserForm.controls.prof.setValue(undefined)
      }
      else if (this.addUserForm.value.userType == 4 && this.addUserForm.value.prof == 0) {
        this.addUserForm.controls.prof.setValue(undefined)
      }
      else if (this.addUserForm.value.userType == 5 && this.addUserForm.value.prof == 0) {
        this.addUserForm.controls.prof.setValue(undefined)
      }
      else if (this.addUserForm.value.userType == 6 && this.addUserForm.value.prof == 0) {
        this.addUserForm.controls.prof.setValue(undefined)
      }
      //diacritivsMapping

      var diacriticsMap = {};
      for (var i = 0; i < this.defaultDiacriticsRemovalMap.length; i++) {
        var letters = this.defaultDiacriticsRemovalMap[i].letters;
        for (var j = 0; j < letters.length; j++) {
          diacriticsMap[letters[j]] = this.defaultDiacriticsRemovalMap[i].base;
        }
      }
      function removeDiacritics(str) {
        return str.replace(/[^\u0000-\u007E]/g, function (a) {
          return diacriticsMap[a] || a;
        });
      }
      if (this.addUserForm.value.city !== undefined) {
        var diacritics_city = removeDiacritics(this.addUserForm.value.city);
      }

      if (this.addUserForm.valid == true) {
        if (!this.showImg) {

          req = {
            role_id: this.addUserForm.value.userType,
            name: this.addUserForm.value.userName,
            email: this.addUserForm.value.email,
            mobile_no: this.addUserForm.value.phoneno,
            city: this.addUserForm.value.city,
            state: this.selectedState,
            area: this.addUserForm.value.area,
            password: this.addUserForm.value.pass,
            status: 'A',
            dob: this.addUserForm.value.dob,
            prof: this.addUserForm.value.prof,
            created_by: createdByValue,
          };
          if (this.addUserForm.value.dob == 'Invalid date') {
            req['dob'] = null;
          }
          if (this.addUserForm.value.annDate != 'Invalid date') {
            req['anniver_date'] = this.addUserForm.value.annDate;
          }
        } else {
          req = {
            role_id: this.addUserForm.value.userType,
            name: this.addUserForm.value.userName,
            email: this.addUserForm.value.email,
            mobile_no: this.addUserForm.value.phoneno,
            city: this.addUserForm.value.city,
            state: this.selectedState,
            area: this.addUserForm.value.area,
            prof: this.addUserForm.value.prof,
            password: this.addUserForm.value.pass,
            status: 'A',
            dob: this.addUserForm.value.dob,
            created_by: createdByValue,
            user_img: this.images,
          };
          if (this.addUserForm.value.annDate != 'Invalid date') {
            req['anniver_date'] = this.addUserForm.value.annDate;
          }
        }

        this.http
          .putMethod('users/' + this.selecteduser.user_id, req)
          .then((response: any) => {
            this.dataService.showSuccess('success', response.message);
            // this.getUsers(); //Recent Bug
            console.log('Put Complete');
            
            this.finalusersLists = [];     
            if (this.addUserForm.value.userType == 6) {
                         this.finalusersLists = this.prof_clients;
                         this.page = 1;
                         this.getUsersAdd(6,this.page,"","");
                       }
                       if (this.addUserForm.value.userType == 2) {
                         this.finalusersLists = this.prof_staff;
                         this.usersListStaf = this.usersListStafBackup;
                         this.page = 1;
                         this.getUsersAdd(2,this.page,"","");
                       }
                       if (this.addUserForm.value.userType == 5) {
                         this.finalusersLists = this.prof_contractors;
                         this.usersListCont = this.usersListContBackup;
                         // this.totalLength = this.usersListContBackup.length;
                         this.page = 1;
                         this.getUsersAdd(5,this.page,"","");
                       }
                       if (this.addUserForm.value.userType == 4) {
                         this.finalusersLists = this.prof_consultants;
                         this.usersListC = this.usersListCBackup;
                         this.page = 1;
                         this.getUsersAdd(4,this.page,"","");
                         // this.totalLength = this.usersListCBackup.length;
                       }
                       if (this.addUserForm.value.userType == 3) {
                         this.finalusersLists = this.prof_vendors;
                         this.usersListVend = this.usersListVendBackup;
                         // this.totalLength = this.usersListVendBackup.length;
                         this.page = 1;
                         this.getUsersAdd(3,this.page,"","");
                       }
                       if (this.addUserForm.value.userType == 7) {
                         this.newAdduser = false;
                         this.newAdduser2 = false;
                         this.addUserForm.controls.prof.setValue(0);
                         this.usersListPublicUser = this.usersListPublicUserBackup;
                         // this.totalLength = this.usersListPublicUserBackup.length;
                         this.page = 1;
                         this.getUsersAdd(7,this.page,"","");
                       }
                       if (this.addUserForm.value.userType == 7 || this.addUserForm.value.userType == 1) {
                         this.newAdduser = false;
                         this.newAdduser2 = false;
                         this.addUserForm.controls.prof.setValue(0);
                         this.usersListPublicUser = this.usersListPublicUserBackup;
                         // this.totalLength = this.usersListPublicUserBackup.length;
                         this.page = 1;
                         this.getUsersAdd(7,this.page,"","");
                       }
            this.closeModal.nativeElement.click();
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.dataService.markFormGroupTouched(this.addUserForm);
      }

    }
  }

  viewUser(item, loc, usersData: any) {
    this.dataService.removeData('location');
    this.dataService.setData('location', loc);

    this.route.navigate(['admin/userdetails'], {
      queryParams: { data: JSON.stringify(item) },
      skipLocationChange: false,
    });
  }
  viewpic(item) {
    this.selectedUser = item;
  }

  async forgotPassword(item) {
    this.selectedUser = item;

  }

  onSubmit(form: NgForm): void {

    let req = {
      password: form.value.Password,
    };


    this.http
      .putMethod('users/' + this.selectedUser.user_id, req)
      .then((response: any) => {
        this.dataService.showSuccess('success', response.message);
        this.getUsers();
        this.showImg = false;
        this.showOTP = false;
        this.closeModal.nativeElement.click();
        location.reload();
        // this.getDashboard();
      })
      .catch((err) => {
        console.log(err);
      });
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
  checkFilter() {
  
  }

  addChatModal() {
    this.showProjectDrop = true;
    this.noData = false;
    this.addChatAccesUserForm.get('userMultiselct').setValue([]);
    this.addChatAccesUserForm.reset();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'user_id',
      textField: 'name',
      // textField: 'project_name',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      itemsShowLimit: 3,
      allowSearchFilter: true,
      enableCheckAll: true,
      noDataAvailablePlaceholderText: "No results matched your search!",
      allowRemoteDataSearch: false,
      selectAllText: 'Select All',
      clearSearchFilter: false,
      closeDropDownOnSelection: true,

    }
    this.user_ids = [];
    this.chatUsersList = [];
    this.selectedItems = [];
    this.http.getMethod('chat/groupCreateAccessUserList?status=unLinkedUser').then((response: any) => {
      this.chatUsersList = response.data;
    }).catch((err) => {
      console.log("err", err)
    });

  }

  addChatModal2() {
    this.showProjectDrop = true;
    this.noData = false;

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'user_id',
      textField: 'name',
      // textField: 'project_name',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      itemsShowLimit: 3,
      allowSearchFilter: true,
      enableCheckAll: true,
      noDataAvailablePlaceholderText: "No results matched your search!",
      allowRemoteDataSearch: false,
      selectAllText: 'Select All',
      clearSearchFilter: false,
      closeDropDownOnSelection: true,

    }

    
    if (this.selectedItems.length > 0 && this.selectedItems != undefined || null) {
      this.user_ids = [];
      for (let i = 0; i < this.selectedItems.length; i++) {
        this.user_ids.push(this.selectedItems[i].user_id);
      }
    }

    this.chatUsersList = [];
    this.http.getMethod('chat/groupCreateAccessUserList?status=unLinkedUser').then((response: any) => {
      this.chatUsersList = response.data;
    }).catch((err) => {
      console.log("err", err)
    });

  }


  onuserSelect(e) {
    this.user_ids.push(e.user_id);
    this.selectedItems.push(e)
    // this.selectedItems = [...new Set(this.selectedItems)];

    if (this.user_ids != undefined || null) {
      this.noData = false;
    }
  }

  onuserDeSelect(e) {
    var final;
    var final2;
    if (this.user_ids.length > 0) {
      final = this.user_ids.filter((id: any) => {
        if (e.user_id != id) {
          return id;
        }
      });
      final2 = this.selectedItems.filter((user: any) => {
        if (e.user_id != user?.user_id) {
          return user;
        }
      });
    } else {
      this.user_ids = [];
    }
    if (final && final != undefined || null) {
      this.user_ids = final;
      this.selectedItems = final2;
    }

  }
  onSelectAllUsers(event) {
    let users = event;
    for (let i = 0; i < users.length; i++) {
      this.user_ids.push(users[i].user_id);
      this.selectedItems.push(users[i])
    }

    if ((this.user_ids != undefined || null) && (this.user_ids.length > 0)) {
      this.noData = false;
    }
    else {
      this.user_ids = [];

    }
  }
  onUnSelectAllUsers() {
    this.user_ids = [];
    this.selectedItems = [];
  }

  createChatAccess() {

    if (this.addChatAccesUserForm.status == "VALID" && this.user_ids != undefined || null) {
      let payload = {
        "status": "add",
        "user_id": this.user_ids
      }
      this.http.postMethod('chat/groupCreateAccess', payload).then((res: any) => {

        if (res.status == true) {
          this.closeModalChat.nativeElement.click();
          this.addChatAccesUserForm.reset();
          this.addChatAccesUserForm.get('userMultiselct').setValue([]);
          this.searchReset(9);
          this.dataService.showSuccess("Success", res.message + '!');
        }

      }).catch((err) => {
        console.log("errr", err)
      });
    } else {
      this.dataService.markFormGroupTouched(this.addChatAccesUserForm);
    }
  }


  onFilterChangeUser(change) {

    let users = [];
    if (change != undefined || null) {
      this.chatUsersList.map((user) => {
        if ((user.name).toLowerCase().includes(change.toLowerCase())) {
          users.push(user);

        }
      });

      if (users.length == 0) {
        this.noData = true;
        this.dropdownSettings = {
          singleSelection: false,
          idField: 'user_id',
          textField: 'name',
          // textField: 'project_name',
          unSelectAllText: 'UnSelect All',
          enableSearchFilter: true,
          itemsShowLimit: 3,
          allowSearchFilter: true,
          enableCheckAll: false,
          noDataAvailablePlaceholderText: "No results matched your search!",
          allowRemoteDataSearch: true,
          selectAllText: 'Select All',
          clearSearchFilter: false,
          closeDropDownOnSelection: true,

        }
      } else {
        this.noData = false;

        this.dropdownSettings.allowRemoteDataSearch = true;

        this.dropdownSettings = {
          singleSelection: false,
          idField: 'user_id',
          textField: 'name',
          unSelectAllText: 'UnSelect All',
          enableSearchFilter: true,
          itemsShowLimit: 3,
          allowSearchFilter: true,
          enableCheckAll: true,
          noDataAvailablePlaceholderText: "No results matched your search!",
          allowRemoteDataSearch: false,
          selectAllText: 'Select All',
          clearSearchFilter: false,
          closeDropDownOnSelection: true,

        }
      }


    }

  }

  async removeUserFromChatAccess(user) {

    this.deleteuser = await this.dataService.showDelete(
      'Confirmation!',
      'Are you sure you want to remove access to the selected User?',
      'Confirm'
    );

    if (this.deleteuser == true) {
      let payload = {
        "status": "remove",
        "user_id": [user.user_id]
      }
      this.http.postMethod('chat/groupCreateAccess', payload)
        .then((response: any) => {
          if (response.status == true) {
            this.dataService.showSuccess('success', response.message);
            this.searchReset(9);
          }

          // this.getUsers();
          // this.closeModal.nativeElement.click();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  onDropDownClose() {


    const searchInput = this.el.nativeElement.querySelector('.filter-textbox input');


    if (this.selectedItems.length > 0 && this.noData == false) {

      const unique = this.selectedItems.filter((obj, index) => {
        return index === this.selectedItems.findIndex(o => obj.user_id == o.user_id);
      });

      if (unique != undefined || null) {
        this.selectedItems = unique;
        for (let i = 0; i < this.selectedItems.length; i++) {
          this.user_ids.push(this.selectedItems[i].user_id);
        }

        this.showProjectDrop = false;
        setTimeout(() => {
          this.showProjectDrop = true;
          this.addChatModal2();
        }, 0)
      }

    }

    if (this.noData == true) {
      // this.addChatModal()
      this.showProjectDrop = false;
      setTimeout(() => {
        this.showProjectDrop = true;
        this.addChatModal2();
      }, 0)
      // if (searchInput) {
      //   this.renderer.setProperty(searchInput, 'value', '');
      //   // this.addChatModal();
      // }

    }

    if (this.noData == false && this.selectedItems.length == 0) {
      // this.addChatModal()
      this.showProjectDrop = false;
      setTimeout(() => {
        this.showProjectDrop = true;
        this.addChatModal2();
      }, 0)
    
    }


  }

  preventFuturedate(e){
    const selectedDate = new Date(e.target.value);
    const currentDate = new Date();

    if (selectedDate > currentDate) {
      // Prevent the input or handle the error
      e.target.value = ''; 
    }
  }

  preventBackgroundClick(event: Event): void {
  event.stopPropagation();
}

@HostListener('keydown', ['$event'])
onKeyDown(event: KeyboardEvent) {
  // Check if the Tab key is pressed
  if (event.key === 'Tab') {
    // Prevent the default tab behavior
    event.preventDefault();
  }
}
onPageClick(role : number, page: number,search:string,page_count:number): void {
  this.page = page;
  if(search == undefined || null){
    search = "";
    this.page = 1;
  }
  
 page_count = this.itemsPerPage2;
 this.getUsersAdd(role,page,page_count,search);
}
getUsersAdd(role,page,page_count,search){
  this.page = page;

  if(search == undefined || null){
    search = "";
  
  }else {
    this.page = page;
  }
  
  
  if(page_count == undefined || null){
    page_count = ""
  }else {
    this.page = page;
  }

  this.usersListCus = [];
  this.usersListStaf = [];
  this.usersListCont = [];
  this.usersListVend = [];
  this.usersListPublicUser = [];
  this.usersListC = [];
  this.chatAccesUsersList = [];

if(role == 9){

  return new Promise((resolve, reject) => {
    this.http.getMethodAdd("users/getUsersWithPagination?role_id="+role +"&page_no="+page +"&page_count="+page_count +"&search="+search+"&status=linkedUser").then((response: any) => {
    if(role == 9 ){
      this.profession = 9;
      this.chatAccesUsersList = response.data;
      resolve(this.chatAccesUsersList );
      this.totalLength = response.total_count;
    }
    
    });
  });
}else{
  return new Promise((resolve, reject) => {
    this.http.getMethodAdd("users/getUsersWithPagination?role_id="+role +"&page_no="+page +"&page_count="+page_count +"&search="+search).then((response: any) => {
    if(role == 6 ){
      this.profession = 6;
      // this.page = 1;
      this.usersListCus = response.data;
      resolve(this.usersListCus );
      this.totalLength = response.total_count;
    }
    if(role == 2){
      this.profession = 2;
      this.usersListStaf = response.data;
      resolve( this.usersListStaf);
      this.totalLength = response.total_count;
    }
    if(role == 5){
      this.profession = 5;
      this.usersListCont = response.data;
      resolve( this.usersListStaf);
      this.totalLength = response.total_count;
    }

    if(role == 4){
      this.profession = 4;
      this.usersListC = response.data;
      resolve( this.usersListC);
      this.totalLength = response.total_count;
    }
    if(role == 3){
      this.profession = 3;
      this.usersListVend = response.data;
      resolve( this.usersListVend);
      this.totalLength = response.total_count;
    }
    if(role == 7){
      this.profession = 7;
      this.usersListPublicUser = response.data;
      // Get the current date and time
let currentDate = new Date();

// Extract individual date components
let year = currentDate.getFullYear();
let month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
let day = String(currentDate.getDate()).padStart(2, '0');

// Format the date-time string
let formattedDateTime = `${year}-${month}-${day}`;
      for(var alterDate of this.usersListPublicUser){
        alterDate.newuser = false //Whenever Looping need to assign a Key if The Specific user is varry
        var cutDate = alterDate.created_at.split(' ')[0];
        if(formattedDateTime == cutDate){
         alterDate.newuser = true;//Only Become true when Certain Condition becomes true
        }
      }
      
      resolve( this.usersListPublicUser);
      this.totalLength = response.total_count;
    }
    if(role == 9){
      this.profession = 9;
      this.chatAccesUsersList = response.data;
      resolve( this.chatAccesUsersList);
      this.totalLength = response.total_count;
    }
    });
  });
}
 
}

}
