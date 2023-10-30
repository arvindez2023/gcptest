import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { repeaterAnimation } from 'app/main/apps/invoice/invoice.animation';
import { DoctorEditService } from './doctor-edit.service';

@Component({
  selector: 'app-doctor-edit',
  templateUrl: './doctor-edit.component.html',
  styleUrls: ['./doctor-edit.component.scss'],
  animations: [repeaterAnimation],
  encapsulation: ViewEncapsulation.None
})

export class DoctorEditComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any>;
  FormInput: any;
  returnUrl: string;

  constructor(
    private router: Router,
    private _route: ActivatedRoute,
    private _doctorEditService: DoctorEditService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this._doctorEditService.onEditChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      // console.log('> onDealerEditChanged ---> ', response);
      // response.staffBankDetail = response.staffBankList;
      // response.staffInsuranceDetail = response.staffInsuranceList;
      // response.staffVaccination = response.staffVaccinationList;
      this.FormInput = response;
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  redirect(event) {
    console.log('> redirect ---> ', event);
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/admin/doctor/list';
    this.router.navigateByUrl(this.returnUrl);
  }
}
