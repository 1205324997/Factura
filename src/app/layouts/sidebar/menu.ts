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
            {
                id: 8,
                label: 'MENUITEMS.INVOICES.LIST.CREDINOTES',
                link: '/creditNotes',
                parentId: 6
            },
            {
                id: 9,
                label: 'MENUITEMS.INVOICES.LIST.DEBITNOTES',
                link: '/debitNotes',
                parentId: 6
            },
            {
                id: 10,
                label: 'MENUITEMS.INVOICES.LIST.PURCHASESETTLEMENTS',
                link: '/liquidation',
                parentId: 6
            },
            {
                id: 11,
                label: 'MENUITEMS.INVOICES.LIST.WITHHOLDINGRECEIPTS',
                link: '/withholding',
                parentId: 6
            },
            {
                id: 12,
                label: 'MENUITEMS.INVOICES.LIST.DISPATCHGUIDES',
                link: '/guide',
                parentId: 6
            },
        ]
    }
];
