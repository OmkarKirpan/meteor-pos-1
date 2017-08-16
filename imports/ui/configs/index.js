import i18n from "meteor/universe:i18n";

const LANGUAGE = "en";

const OPEN_PAGES = ["/login"];

const MENUS = [
    {
        icon: "home",
        name: "Home",
        path: "/",
        exact: true
    },
    {
        name: "Transaction",
        icon: "database",
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
                icon: "database",
                path: "/brands",
                exact: true
            },
            {
                name: "Category",
                icon: "database",
                path: "/categories",
                exact: true
            },
            {
                name: "Item",
                icon: "database",
                path: "/items",
                exact: true
            },
            {
                name: "Supplier",
                icon: "database",
                path: "/suppliers",
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
            today: i18n.__("datepicker-today"),
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

export { LANGUAGE, OPEN_PAGES, MENUS, LOCALE };
