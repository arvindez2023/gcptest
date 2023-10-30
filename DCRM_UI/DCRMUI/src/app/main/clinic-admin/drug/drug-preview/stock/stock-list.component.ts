import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';

import { CoreConfigService } from '@core/services/config.service';
import { DrugPreviewService } from 'app/main/clinic-admin/drug/drug-preview/drug-preview.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import Swal from 'sweetalert2';
@Component({
    selector: 'app-stock-list',
    templateUrl: './stock-list.component.html',
    encapsulation: ViewEncapsulation.None
})
export class StockListComponent implements OnInit {
    // decorator
    @ViewChild(DatatableComponent) table: DatatableComponent;
    public returnUrl: string;
    public loading = false;
    public error = '';
    public selectedOption = 10;
    public ColumnMode = ColumnMode;
    public selectedStatus = [];
    public searchValue = '';
    private tempData = [];
    private _unsubscribeAll: Subject<any>;
    public rows;
    public tempFilterData;
    public previousStatusFilter = '';
    data: Object;
  
    /**
     * Constructor
     *
     * @param {CoreSidebarService} _coreSidebarService
     * @param {CalendarService} _calendarService
     */
    constructor(private router: Router, private _drugPreviewService: DrugPreviewService, private _coreConfigService: CoreConfigService, private _route: ActivatedRoute) {
        this._unsubscribeAll = new Subject();
    }
    // Public Methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * filterUpdate
     *
     * @param event
     */
    filterUpdate(event) {

        const val = event.target.value.toLowerCase();

        // filter our data
        const temp = this.tempData.filter(function (d) {
            return d.inward_Date.toLowerCase().indexOf(val) !== -1
                || d.batch_No.toLowerCase().indexOf(val) !== -1
                || d.expiry_Date.toLowerCase().indexOf(val) !== -1
                || d.packing_Qty.toLowerCase().indexOf(val) !== -1
                || d.purchase_Rate_Packing.toLowerCase().indexOf(val) !== -1
                || d.amount.toLowerCase().indexOf(val) !== -1
                || d.quantity.toLowerCase().indexOf(val) !== -1
                || d.mrp.toLowerCase().indexOf(val) !== -1
                || d.sale_Rate.toLowerCase().indexOf(val) !== -1
                || !val;
        });

        // update the rows
        this.rows = temp;
        // Whenever the filter changes, always go back to the first page
        this.table.offset = 0;
    }

    /**
     * Filter By Roles
     *
     * @param event
     */
    filterByStatus(event) {
        const filter = event ? event.value : '';
        this.previousStatusFilter = filter;
        this.tempFilterData = this.filterRows(filter);
        this.rows = this.tempFilterData;
    }

    /**
     * Filter Rows
     *
     * @param statusFilter
     */
    filterRows(statusFilter): any[] {
        // Reset search on select change
        this.searchValue = '';

        statusFilter = statusFilter.toLowerCase();

        return this.tempData.filter(row => {
            const isPartialNameMatch = row.invoiceStatus.toLowerCase().indexOf(statusFilter) !== -1 || !statusFilter;
            return isPartialNameMatch;
        });
    }

    ngOnInit(): void {
        this.getData();
    }
    delete(id) {
        let rowIndex = -1;
        this.tempData.forEach((currentValue, index) => {
            if (currentValue.id == id) {
                rowIndex = index
            }
        });
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                this._drugPreviewService
                    .deleteStock(id)
                    .pipe()
                    .subscribe(
                        data => {
                            delete this.tempData[rowIndex];
                            var temp = [];
                            this.tempData.forEach((currentValue, index) => {
                                temp.push(currentValue);
                            });
                            this.rows = temp;
                        },
                        error => {
                            this.error = error;

                        }
                    );
            }
        })
    }
    getData() {
      
        this._drugPreviewService.getDrugStockList().subscribe(resData => {
            this.data = resData;
            this.rows = this.data;
            this.tempData = this.rows;
            this.tempFilterData = this.rows;
        })
    }
    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
