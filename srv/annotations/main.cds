using {MainService} from '../routes/main';

annotate MainService.SalesOrderHeaders with @(UI: {LineItem: [
    {
        $Type                : 'UI.DataField',
        Label                : 'ID',
        Value                : id,
        ![@HTML5.CssDefaults]: {
            $Type: 'HTML5.CssDefaultsType',
            width: '18rem'
        },
    },
    {
        $Type                : 'UI.DataField',
        Label                : 'Valor Total',
        Value                : totalAmount,
        ![@HTML5.CssDefaults]: {
            $Type: 'HTML5.CssDefaultsType',
            width: '10rem'
        },
    },
    {
        $Type                : 'UI.DataField',
        Label                : 'Data de criação',
        Value                : createdAt,
        ![@HTML5.CssDefaults]: {
            $Type: 'HTML5.CssDefaultsType',
            width: '15rem'
        },
    },
    {
        $Type                : 'UI.DataField',
        Label                : 'Criado por',
        Value                : createdBy,
        ![@HTML5.CssDefaults]: {
            $Type: 'HTML5.CssDefaultsType',
            width: '15rem'
        },
    },
]});
