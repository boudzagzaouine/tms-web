import { BadgeService,BadgeTypeService } from './../../..//shared/services';
import { EmsBuffer } from './../../../shared/utils/ems-buffer';

import { Badge } from './../../../shared/models';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.css'],
  providers: [ConfirmationService]
})
export class BadgeComponent implements OnInit {

  page = 0;
  size = 10;
  collectionSize: number;

  selectedBadge: Badge;
  searchQuery: string;
  codeSearch: string;
  badgeTypeSearch: string;

  badgeList: Array<Badge> = [];
  badgeTypeList: Array<string> = [];

  constructor(private badgeService: BadgeService,
    private badgeTypeService: BadgeTypeService,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.badgeService.badgeListChanged.subscribe(
      data => {
        this.badgeList = data;
      }
    );
  }


  loadData(search: string = '') {

    console.log(`search query : ${this.searchQuery}`);

    this.spinner.show();
    this.badgeService.sizeSearch(search).subscribe(
      data => {
        this.collectionSize = data;
      }
    );
    this.badgeService.findPagination(this.page, this.size, search).subscribe(
      data => {
        console.log(data);
        this.badgeList = data;
        this.spinner.hide();
      },
      error => { this.spinner.hide() },
      () => this.spinner.hide()
    );
  }
  loadDataLazy(event) {
    this.page = event.first / this.size;
    console.log('first : ' + event.first);
    this.loadData(this.searchQuery);
  }

  onSearchClicked() {

    const buffer = new EmsBuffer();
    if (this.codeSearch != null && this.codeSearch !== '') {
      buffer.append(`code~${this.codeSearch}`);
    }

    if (this.badgeTypeSearch != null && this.badgeTypeSearch !== '') {
      buffer.append(`badgeType.code~${this.badgeTypeSearch}`);
    }

    this.page = 0;
    this.searchQuery = buffer.getValue();
    this.loadData(this.searchQuery);

  }

  onBadgeTypeSearch(event: any) {
    this.badgeTypeService.find('code~' + event.query).subscribe(
      data => this.badgeTypeList = data.map(f => f.code)
    );
  }

  reset() {
    this.codeSearch = null;
    this.badgeTypeSearch = null;
    this.page = 0;
    this.searchQuery = '';
    this.loadData(this.searchQuery);
  }

  onDelete(id: number) {
    this.confirmationService.confirm({
      message: 'Voulez vous vraiment Suprimer?',
      accept: () => {
        this.badgeService.delete(id);
      }
    });
  }
}