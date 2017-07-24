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
                name: "Invoice",
                icon: "shopping-cart",
                path: "/invoices",
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
                name: "Inventory Category",
                icon: "database",
                path: "/inventoryCategories",
                exact: true
            },
            {
                name: "Inventory",
                icon: "database",
                path: "/inventories",
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

export { LANGUAGE, OPEN_PAGES, MENUS };
