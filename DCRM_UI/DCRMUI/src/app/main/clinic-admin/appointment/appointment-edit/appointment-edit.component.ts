﻿import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { repeaterAnimation } from 'app/main/apps/invoice/invoice.animation';
import { AppointmentEditService } from './appointment-edit.service';

@Component({
    selector: 'app-appointment-edit',
    templateUrl: './appointment-edit.component.html',
    styleUrls: ['./appointment-edit.component.scss'],
    animations: [repeaterAnimation],
    encapsulation: ViewEncapsulation.None
})

export class AppointmentEditComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any>;
    FormInput: any;
    returnUrl: string;

    constructor(
        private router: Router,
        private _route: ActivatedRoute,
        private _appointmentEditService: AppointmentEditService,
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this._appointmentEditService.onEditChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
            // console.log('> onDealerEditChanged ---> ', response);
            this.FormInput = response;
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    redirect(event) {
        console.log('> redirect ---> ', event);
        this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/admin/appointment/list';
        this.router.navigateByUrl(this.returnUrl);
    }
}