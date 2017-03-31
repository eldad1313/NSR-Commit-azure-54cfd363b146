/**
 * This map defines all the types of modals in the app and configures their properties.
 * It is used by ModalService
 */
import { NotificationModalComponent } from '../modals/notification/notification-modal.component';
import { EditVisitComponent } from '../modals/edit-visit/edit-visit.component';
import { I18nPipe } from '../pipes/i18n.pipe';

let i18n = new I18nPipe().transform;

export const modalMap = {
    // poolFiltering: {
    //     title: i18n('pools.poolFilters.filteringModal.title'),
    //     component: PoolFilteringModalComponent,
    //     options: {
    //         width: 600,
    //         theme: 'mx-modal-1',
    //         backdrop: true
    //     },
    //     btns: [
    //         { id: 'cancel', type: 'medium-clear-grey', label: i18n('modals.cancel'), cssClass: ['float-right'] },
    //         { id: 'ok', type: 'medium-grey', label: i18n('pools.poolFilters.filteringModal.applyFilters'), cssClass: ['float-right'] },
    //         { id: 'clear', type: 'medium-clear-grey', label: i18n('modals.clear'), cssClass: ['float-left', 'close-icon'], icon: 'Close' }
    //     ]
    // },
    notification: {
        component: NotificationModalComponent,
        options: {
            width: 300,
            backdrop: true
        },
        btns: [
            { id: 'ok', type: 'medium-grey', label: i18n('modals.ok'), cssClass: ['text-center'] }
        ]
    }
};
