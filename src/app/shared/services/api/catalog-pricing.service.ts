import { CatalogPricing } from '../../models/catalog-pricing';
import { EmsService } from './ems.service';
import { Injectable } from '@angular/core';
import { ProxyService } from './proxy.service';
import { Driver } from '../../models/driver';
import { Agent } from '../../models/agent';


@Injectable()
export class CatalogPricingService  extends EmsService<CatalogPricing> {

  constructor(proxy: ProxyService) {
    super(proxy, 'CatalogPricings');
  }

}