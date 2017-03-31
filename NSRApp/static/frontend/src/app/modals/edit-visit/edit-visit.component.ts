import { Component, OnInit, Injector } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { I18nPipe } from '../../pipes/i18n.pipe';
import { DataService } from '../../services/data.service';
import { ModalService } from '../../services/modal.service';
import { DataEventService } from '../../services/data-event.service';
import { EventService } from '../../services/event.service';
import { UtilService } from '../../services/util.service';
import { ModalBaseComponent } from '../modal-base-component.component';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment/moment';
import { Observable } from 'rxjs/Observable';
let i18n = new I18nPipe().transform;

@Component({
    selector: 'app-edit-visit',
    templateUrl: './edit-visit.component.html',
    styleUrls: ['./edit-visit.component.scss']
})
export class EditVisitComponent extends ModalBaseComponent implements OnInit {

    visitType: {};
    visitTypeSelectOptions: any[];
    typeOptions: any[];
    dayOptions: any[];
    type: any;
    teamOptions: any[];
    team: any;
    repeatOptions: any[];
    specialVisitForm: FormGroup;
    visitSeriesForm: FormGroup;

    disableNumOfVisits: Boolean;
    disableEndDate: Boolean;

    seriesEndRadio: any;
    visitTypeChange: Function;
    disableSpecialVisitType: Boolean;
    disableSeriesRepeat: Boolean;

    private modalService: ModalService;

    constructor(
        private dataService: DataService,
        private dataEventService: DataEventService,
        private es: EventService,
        private utilService: UtilService,
        public injector: Injector,
        private router: Router) {
        super(injector);
        setTimeout(() => {
            this.modalService = injector.get(ModalService)
        });
    }

    ngOnInit() {
        this.setCfg();
        this.setData();
        this.setSpecialVisitForm();
        this.setSpecialVisitFormEvents();
        this.setVisitSeriesForm();
        this.setVisitSeriesFormEvents();
        this.setModalEvents();
    }

    setModalEvents() {

        this.disableBtn('ok', () => {
            if (this.visitType == 'specialVisit') {
                return this.specialVisitForm.invalid;
            } else {
                return this.visitSeriesForm.invalid;
            }
        });

        this.registerBtn('ok', () => {
            this['save' + (this.visitType == 'specialVisit' ? 'SpecialVisit' : 'VisitSeries')](!!this.args.visitId ? 'update' : 'create');
        });

        let deleteVisit = (cfg) => {
            this.modalService.bool({
                html: cfg.deleteHtmlMsg,
                yesKey: cfg.yesKey || 'editVisit.applyRemove',
                noKey: cfg.noKey || 'editVisit.dontApplyRemove'
            }).subscribe(res => {
                if (res == 'ok') {
                    this.dataService.api({
                        type: cfg.removeApiType,
                        urlParams: cfg.removeApiUrlParams
                    }).subscribe(res => {
                        this.modalConfirm({ success: true });
                    })
                }
            });
        }

        let deleteSpecialVisit = () => {
            let poolDetails = this.args.poolData || this.dataEventService.snapshot('POOL_DETAILS');
            let deleteHtmlMsg = _.template(i18n('editVisit.removeMsgTemplate'))({
                ownerName: poolDetails.ownerFullName,
                date: moment(this.specialVisitForm.get('date').value).format('MMMM D, YYYY')
            });
            deleteVisit({
                deleteHtmlMsg: deleteHtmlMsg,
                removeApiType: 'removePoolSpecialVisit',
                removeApiUrlParams: {
                    poolId: this.args.poolId,
                    visitId: this.args.visitId
                }
            });
        }

        let deleteEntireSeries = () => {
            let deleteHtmlMsg = i18n('editVisit.removeEntireSeriesMsg');
            deleteVisit({
                deleteHtmlMsg: deleteHtmlMsg,
                yesKey: 'G.remove',
                noKey: 'G.cancel',
                removeApiType: 'removePoolSeriesVisit',
                removeApiUrlParams: {
                    poolId: this.args.poolId,
                    visitSeriesId: this.args.visitSeriesId
                }
            });
        }

        this.registerBtn('remove', () => {
            if (!this.args.visitSeriesId || this.visitType == 'singleVisit') {
                deleteSpecialVisit();
            } else if (this.visitType == 'entireSeries') {
                deleteEntireSeries();
            }
        });

    }

    validVisitSeries() {
        let dayNum = i18n('E.' + this.visitSeriesForm.get('day').value + '_NUM');
        let startDay = moment(this.visitSeriesForm.get('startDate').value).day();

        let firstDateExecuted;
        if (startDay > dayNum) {
            firstDateExecuted = moment(this.visitSeriesForm.get('startDate').value).day(dayNum + 7)['_d'];
        } else {
            firstDateExecuted = moment(this.visitSeriesForm.get('startDate').value).day(dayNum)['_d'];
        }

        if (this.utilService.dateCmp(firstDateExecuted, new Date(this.visitSeriesForm.get('endDate').value)).past) {
            this.modalService.alert({
                bodyKey: 'editVisit.invalidEndDate'
            });
            return false;
        } else {
            return true;
        }
    }

    saveVisitSeries(mode) {
        console.log('save visit series', mode);

        if (mode == 'update' && this.visitType == 'singleVisit') {
            this.saveSpecialVisit(mode);
            return false;
        }

        if (!this.validVisitSeries()) {
            return false;
        }

        let data = {
            serviceFrequency: this.visitSeriesForm.value.repeat,
            visitDay: this.visitSeriesForm.value.day,
            fromDate: this.visitSeriesForm.value.startDate.getTime(),
            toDate: this.visitSeriesForm.value.endDate.getTime(),
            visitsAmount: this.visitSeriesForm.value.numOfVisits,
            teamId: this.visitSeriesForm.value.team,
            notes: this.visitSeriesForm.value.notes || null
        }

        if (this.args.visitSeriesId) {
            data['visitSeriesId'] = this.args.visitSeriesId;
        }


        this.dataService.api({
            type: mode + 'PoolSeriesVisit',
            urlParams: {
                poolId: this.args.poolId,
                visitSeriesId: this.args.visitSeriesId
            },
            data: data
        }).subscribe(res => {
            if (this.args.intercomEventKey) {
            }
            this.modalConfirm(res);
        });
    }

    saveSpecialVisit(mode) {
        let data = {
            visitType: this.specialVisitForm.value.type,
            visitDate: this.specialVisitForm.value.date.getTime(),
            teamId: this.specialVisitForm.value.team,
            notes: this.specialVisitForm.value.notes || null
        }

        if (this.args.visitId) {
            data['visitId'] = this.args.visitId;
        }

        this.dataService.api({
            type: mode + 'PoolVisit',
            urlParams: {
                poolId: this.args.poolId,
                visitId: this.args.visitId
            },
            data: data
        }).subscribe(res => {
            if (this.args.intercomEventKey) {
            }
            this.modalConfirm(res);
        });
    }

    setVisitSeriesForm() {

        let poolDetails = this.dataEventService.snapshot('POOL_DETAILS');

        this.visitSeriesForm = new FormGroup({
            repeat: new FormControl(null, [
                Validators.required
            ]),
            team: new FormControl(null, [
                Validators.required
            ]),
            day: new FormControl(null, [
                Validators.required
            ]),
            startDate: new FormControl(new Date(), [
                Validators.required
            ]),
            endDate: new FormControl(null, [
                Validators.required
            ]),
            notes: new FormControl(),
            seriesEndsRadio: new FormControl('specificDate'),
            numOfVisits: new FormControl(),
        });

        this.disableNumOfVisits = true;
        this.disableEndDate = false;
        this.disableSeriesRepeat = false;

        if (this.args.visitId && this.args.visitSeriesId) {
            // visit series edit mode
            console.log('visit series edit mode', this.args)
            this.visitSeriesForm.patchValue({
                repeat: this.args.serviceFrequency,
                team: this.args.teamId,
                day: this.args.visitDay,
                startDate: this.utilService.dateCmp(new Date(), new Date(this.args.fromDate)).past ? new Date() : new Date(this.args.fromDate),
                endDate: new Date(this.args.toDate),
                notes: this.args.notes,
                numOfVisits: this.args.visitsAmount,
                seriesEndsRadio: this.args.visitsAmount ? 'numOfVisits' : 'specificDate'
            });

            this.specialVisitForm.patchValue({
                type: 'SERVICE',
                team: this.args.teamId,
                date: this.args.visitDate,
                notes: this.args.notes
            });

            this.disableSpecialVisitType = true;
            this.disableSeriesRepeat = true;

            if (this.args.visitsAmount) {
                this.disableNumOfVisits = false;
                this.disableEndDate = true;
            }

            this.visitTypeSelectOptions = [
                {
                    id: 'singleVisit',
                    val: i18n('editVisit.singleVisit')
                },
                {
                    id: 'entireSeries',
                    val: i18n('editVisit.entireSeries')
                }
            ];

            this.visitTypeChange = () => {
                if (this.visitType == 'entireSeries') {
                    this.labelBtn('remove', i18n('editVisit.removeEntireSeries'));
                } else {
                    this.labelBtn('remove', i18n('editVisit.removeVisit'));
                }
            };

            this.visitType = 'singleVisit';

        }
    }

    setVisitSeriesFormEvents() {

        let setEndDate = () => {
            if (this.visitSeriesForm.get('numOfVisits').valid && !!this.visitSeriesForm.get('day').value) {
                let dayNum = i18n('E.' + this.visitSeriesForm.get('day').value + '_NUM');
                let startDay = moment(this.visitSeriesForm.get('startDate').value).day();

                let firstDateExecuted;
                if (startDay > dayNum) {
                    firstDateExecuted = moment(this.visitSeriesForm.get('startDate').value).day(dayNum + 7)['_d'];
                } else {
                    firstDateExecuted = this.visitSeriesForm.get('startDate').value;
                }
                console.log('repeat', this.visitSeriesForm.get('repeat'))
                let weekFactor = (this.visitSeriesForm.get('repeat') && (this.visitSeriesForm.get('repeat').value == 'WEEKLY')) ? 1 : 2;
                let endVisitDate = moment(firstDateExecuted).add(parseInt(this.visitSeriesForm.get('numOfVisits').value) * 7 * weekFactor, 'days');
                console.log('endVisitDate', endVisitDate['_d']);
                this.visitSeriesForm.patchValue({
                    endDate: endVisitDate['_d']
                });
            }
        }

        this.visitSeriesForm.get('numOfVisits').valueChanges.subscribe(setEndDate);
        this.visitSeriesForm.get('repeat').valueChanges.subscribe(setEndDate);
        this.visitSeriesForm.get('day').valueChanges.subscribe(setEndDate);
        this.visitSeriesForm.get('startDate').valueChanges.subscribe(setEndDate);

        this.visitSeriesForm.get('seriesEndsRadio').valueChanges.subscribe(() => {
            if (this.visitSeriesForm.value.seriesEndsRadio == 'specificDate') {
                this.disableNumOfVisits = true;
                this.disableEndDate = false;
                this.visitSeriesForm.get('numOfVisits').setValue('');
                this.visitSeriesForm.get('numOfVisits').clearValidators();
                this.visitSeriesForm.get('numOfVisits').updateValueAndValidity();
                this.visitSeriesForm.get('endDate').setValidators([Validators.required]);
                this.visitSeriesForm.get('endDate').updateValueAndValidity();
            } else {
                this.disableNumOfVisits = false;
                this.disableEndDate = true;
                this.visitSeriesForm.get('numOfVisits').setValidators([Validators.required, Validators.pattern('0*[1-9][0-9]*')]);
                this.visitSeriesForm.get('numOfVisits').markAsPristine();
                this.visitSeriesForm.get('numOfVisits').updateValueAndValidity();
                this.visitSeriesForm.get('endDate').clearValidators();
                this.visitSeriesForm.get('endDate').updateValueAndValidity();
            }
        });

        let prepareTeamOptions = () => {
            if (this.visitSeriesForm.get('day') && this.visitSeriesForm.get('startDate')) {
                let dayNum = i18n('E.' + this.visitSeriesForm.get('day').value + '_NUM');
                let startDay = moment(this.visitSeriesForm.get('startDate').value).day();

                let getTeamsForDate;
                if (startDay > dayNum) {
                    getTeamsForDate = moment(this.visitSeriesForm.get('startDate').value).day(dayNum + 7)['_d'];
                } else {
                    getTeamsForDate = this.visitSeriesForm.get('startDate').value;
                }

                console.log('get teams for day: ', moment(getTeamsForDate).format('D MMMM YYYY'));
                this.setTeamsOptions(getTeamsForDate);
            }
        }

        this.visitSeriesForm.get('day').valueChanges.subscribe(prepareTeamOptions);
        this.visitSeriesForm.get('startDate').valueChanges.subscribe(prepareTeamOptions);
    }

    setSpecialVisitForm() {
        this.specialVisitForm = new FormGroup({
            type: new FormControl(this.args.visitType, [
                Validators.required
            ]),
            team: new FormControl(this.args.teamId, [
                Validators.required
            ]),
            date: new FormControl(this.args.visitDate || new Date()),
            notes: new FormControl(this.args.notes)
        });

        this.setTeamsOptions(this.args.visitDate || new Date());
    }

    setSpecialVisitFormEvents() {
        this.specialVisitForm.get('date').valueChanges.subscribe(() => {
            if (this.specialVisitForm.get('date').value) {
                this.setTeamsOptions(this.specialVisitForm.get('date').value)
            }
        });
    }

    setData() {
        this.visitType = this.args.mode || 'specialVisit';
    }

    setCfg() {
        this.visitTypeSelectOptions = [
            {
                id: 'specialVisit',
                val: i18n('editVisit.specialVisit')
            },
            {
                id: 'visitSeries',
                val: i18n('editVisit.visitSeries')
            }
        ];

        this.typeOptions = [
            {
                id: 'POOL_OPENING',
                val: i18n('E.POOL_OPENING')
            },
            {
                id: 'POOL_CLOSING',
                val: i18n('E.POOL_CLOSING')
            },
            {
                id: 'REPAIRS',
                val: i18n('E.REPAIRS')
            },
            {
                id: 'SERVICE',
                val: i18n('E.SERVICE')
            }
        ];

        this.repeatOptions = [
            {
                id: 'WEEKLY',
                val: i18n('E.WEEKLY')
            },
            {
                id: 'FORTNIGHTLY',
                val: i18n('E.FORTNIGHTLY')
            }
        ];

        this.dayOptions = [
            {
                id: 'MONDAY',
                val: i18n('E.MONDAY')
            },
            {
                id: 'TUESDAY',
                val: i18n('E.TUESDAY')
            },
            {
                id: 'WEDNESDAY',
                val: i18n('E.WEDNESDAY')
            },
            {
                id: 'THURSDAY',
                val: i18n('E.THURSDAY')
            },
            {
                id: 'FRIDAY',
                val: i18n('E.FRIDAY')
            },
            {
                id: 'SATURDAY',
                val: i18n('E.SATURDAY')
            },
            {
                id: 'SUNDAY',
                val: i18n('E.SUNDAY')
            }
        ];
    }

    setTeamsOptions(date: Date) {

        let idExists = false;

        this.dataService.api({
            type: 'getTeamsByDate',
            urlParams: {
                msDate: date.getTime()
            }
        })
            .map(res => {
                return res.map((i) => {
                    if (!idExists && this.specialVisitForm.value.team && this.specialVisitForm.value.team == i.teamId) idExists = true;
                    return {
                        id: i.teamId,
                        val: `${i.name} (${i.numVisits})`
                    };
                });
            })
            .subscribe(res => this.teamOptions = res);
    }
}
