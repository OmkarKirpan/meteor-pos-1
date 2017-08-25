const LANGUAGE = "id-ID";

const MENUS = [
    {
        icon: "home",
        name: "Home",
        path: "/",
        exact: true
    },
    {
        name: "Transaction",
        icon: "shop",
        exact: false,
        subMenus: [
            {
                name: "Order",
                icon: "shopping-cart",
                path: "/orders",
                exact: true
            },
            {
                name: "Customer",
                icon: "contacts",
                path: "/customers",
                exact: true
            }
        ]
    },
    {
        name: "Warehouse",
        icon: "database",
        exact: false,
        subMenus: [
            {
                name: "Brand",
                icon: "copyright",
                path: "/brands",
                exact: true
            },
            {
                name: "Category",
                icon: "tag-o",
                path: "/categories",
                exact: true
            },
            {
                name: "Item",
                icon: "barcode",
                path: "/items",
                exact: true
            },
            {
                name: "Item Adjustment",
                icon: "bars",
                path: "/adjustments",
                exact: true
            },
            {
                name: "Supplier",
                icon: "idcard",
                path: "/suppliers",
                exact: true
            },
            {
                name: "Supply Order",
                icon: "car",
                path: "/supplyOrders",
                exact: true
            }
        ]
    },
    {
        name: "User",
        icon: "user",
        path: "/users",
        exact: true
    }
];

const LOCALE = {
    DATEPICKER: {
        lang: {
            today: "Today",
            backToToday: "Back to today",
            ok: "Ok",
            dateSelect: "Select date",
            decadeSelect: "Choose a decade",
            yearFormat: "YYYY",
            dateFormat: "M/D/YYYY",
            dayFormat: "D",
            dateTimeFormat: "M/D/YYYY HH:mm:ss",
            monthFormat: "MMMM",
            monthBeforeYear: true,
            previousMonth: "Previous month (PageUp)",
            nextMonth: "Next month (PageDown)",
            previousYear: "Last year (Control + left)",
            nextYear: "Next year (Control + right)",
            previousDecade: "Last decade",
            nextDecade: "Next decade",
            previousCentury: "Last century",
            nextCentury: "Next century"
        }
    }
};

export { LANGUAGE, MENUS, LOCALE };
