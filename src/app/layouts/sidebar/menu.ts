import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true
    },
    {
        id: 2,
        label: 'MENUITEMS.DASHBOARDS.TEXT',
        icon: 'bx-home-circle',
    },
    {
        id: 6,
        label: 'MENUITEMS.INVOICES.TEXT',
        icon: 'bx-receipt',
        subItems: [
            {
                id: 7,
                label: 'MENUITEMS.INVOICES.LIST.INVOICELIST',
                link: '/voucher',
                parentId: 6
            },
         
        ]
    }
];
