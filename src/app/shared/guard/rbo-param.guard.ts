import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, Router } from "@angular/router";
import { AppProperties } from "../domain/app-properties";
import { RboCodeService } from '../service/rbo-code.service';

@Injectable({
    providedIn: 'root',
})
export class RboParamGuard implements CanActivateChild {

    constructor(
        private router: Router,
        private rboCodeService: RboCodeService
    ) {

    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      if (route.paramMap.has(AppProperties.REQUEST_PARAM_RBO)) {
            this.rboCodeService.changeCodeIfNotEquals(route.paramMap.get(AppProperties.REQUEST_PARAM_RBO));
            return true;
        }
        this.router.navigate(['/selectrbo']);
        return false;
    }
}
