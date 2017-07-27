import { CategoryApi, CustomerApi, InventoryApi, SupplierApi } from "./apis";
import {
    CategoryHandler,
    CustomerHandler,
    InventoryHandler,
    SupplierHandler
} from "./commandHandlers";
import {
    CategoryProjection,
    CustomerProjection,
    InventoryProjection,
    SupplierProjection
} from "./projections";

import Categories from "../../domain/Category/repository";
import Customers from "../../domain/Customer/repository";
import Inventories from "../../domain/Inventory/repository";
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
        InventoryHandler,
        InventoryProjection,
        InventoryApi,
        CategoryHandler,
        CategoryProjection,
        CategoryApi,
        SupplierHandler,
        SupplierApi,
        SupplierProjection,
        CustomerHandler,
        CustomerApi,
        CustomerProjection
    ],

    onInitialize() {
        this.injector
            .map("ProjectionBuilder")
            .to(Space.eventSourcing.ProjectionRebuilder.create());
        this.injector.map("Inventories").to(Inventories);
        this.injector.map("Categories").to(Categories);
        this.injector.map("Suppliers").to(Suppliers);
        this.injector.map("Customers").to(Customers);
    },

    onReset() {
        this.injector.get("Inventories").remove({});
        this.injector.get("Categories").remove({});
        this.injector.get("Suppliers").remove({});
        this.injector.get("Customers").remove({});
    },

    onStart() {
        this.injector
            .get("ProjectionBuilder")
            .rebuild([
                InventoryProjection,
                CategoryProjection,
                SupplierProjection,
                CustomerProjection
            ]);
    }
});

export default new ServerApp();
