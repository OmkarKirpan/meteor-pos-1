import {
    BrandApi,
    CategoryApi,
    CustomerApi,
    ItemApi,
    OrderApi,
    SupplierApi
} from "./apis";
import {
    BrandHandler,
    CategoryHandler,
    CustomerHandler,
    ItemHandler,
    OrderHandler,
    SupplierHandler
} from "./commandHandlers";
import {
    BrandProjection,
    CategoryProjection,
    CustomerProjection,
    ItemProjection,
    OrderProjection,
    SupplierProjection
} from "./projections";

import Brands from "../../domain/Brand/repository";
import Categories from "../../domain/Category/repository";
import Customers from "../../domain/Customer/repository";
import Items from "../../domain/Item/repository";
import Orders from "../../domain/Order/repository";
import Suppliers from "../../domain/Supplier/repository";

const ServerApp = Space.Application.extend("Application", {
    configuration: {
        appId: "Application",
        eventSourcing: {
            snapshotting: {
                enabled: true,
                frequency: 10
            }
        }
    },

    requiredModules: ["Space.messaging", "Space.eventSourcing"],

    singletons: [
        ItemHandler,
        ItemProjection,
        ItemApi,
        CategoryHandler,
        CategoryProjection,
        CategoryApi,
        SupplierHandler,
        SupplierApi,
        SupplierProjection,
        CustomerHandler,
        CustomerApi,
        CustomerProjection,
        BrandHandler,
        BrandApi,
        BrandProjection,
        OrderHandler,
        OrderApi,
        OrderProjection
    ],

    onInitialize() {
        this.injector
            .map("ProjectionBuilder")
            .to(Space.eventSourcing.ProjectionRebuilder.create());
        this.injector.map("Items").to(Items);
        this.injector.map("Categories").to(Categories);
        this.injector.map("Suppliers").to(Suppliers);
        this.injector.map("Customers").to(Customers);
        this.injector.map("Brands").to(Brands);
        this.injector.map("Orders").to(Orders);
    },

    onReset() {
        this.injector.get("Items").remove({});
        this.injector.get("Categories").remove({});
        this.injector.get("Suppliers").remove({});
        this.injector.get("Customers").remove({});
        this.injector.get("Brands").remove({});
        this.injector.get("Orders").remove({});
    },

    onStart() {
        this.injector
            .get("ProjectionBuilder")
            .rebuild([
                ItemProjection,
                CategoryProjection,
                SupplierProjection,
                CustomerProjection,
                BrandProjection,
                OrderProjection
            ]);
    }
});

export default new ServerApp();
