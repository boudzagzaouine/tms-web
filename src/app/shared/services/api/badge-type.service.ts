import { EmsService } from './ems.service';
import { Injectable } from '@angular/core';
import { ProxyService } from './proxy.service';
import { BadgeType } from '../../models/badge-type';
import 'rxjs/add/operator/map';

@Injectable()
export class BadgeTypeService extends EmsService<BadgeType> {

  constructor(proxy: ProxyService) {
    super(proxy, 'badgeTypes');
  }

}
