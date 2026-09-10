import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  @Input()
  collectionSize = 0;


  @Input()
  pageSize = 5;


  @Input()
  currentPage = 1;


  @Input()
  maxSize = 2;


  @Input()
  firstLastButtons = false;


  @Input()
  nextPreviousButtons = true;

  @Input()
  small = false;

  totalPages: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.totalPages = new Array(Math.ceil(this.collectionSize / this.pageSize));
    console.log("this.totalpage>>>>>>",this.totalPages)
  }

  ngOnChanges(changes: SimpleChanges) {
    this.totalPages = new Array(Math.ceil(this.collectionSize / this.pageSize));
  }


  selectPageNumber(pageNumber: number) {
    console.log(" pageNumber", pageNumber)
    this.currentPage = pageNumber;
    console.log(" this.currentPage", this.currentPage)
  }


  next() {
    console.log("hittingg")
    const nextPage = this.currentPage + 1;
    nextPage <= this.totalPages.length && this.selectPageNumber(nextPage);
  }

  previous() {
    console.log("previous")
    const previousPage = this.currentPage - 1;
    previousPage >= 1 && this.selectPageNumber(previousPage);
  }
}
