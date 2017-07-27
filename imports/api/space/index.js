import { CategoryApi, InventoryApi, SupplierApi } from "./apis";
import {
    CategoryHandler,
    InventoryHandler,
    SupplierHandler
} from "./commandHandlers";
import {
    CategoryProjection,
    InventoryProjection,
    SupplierProjection
} from "./projections";

import Categories from "../../domain/Category/repository";
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
        SupplierProjection
    ],

    onInitialize() {
        this.injector
            .map("ProjectionBuilder")
            .to(Space.eventSourcing.ProjectionRebuilder.create());
        this.injector.map("Inventories").to(Inventories);
        this.injector.map("Categories").to(Categories);
        this.injector.map("Suppliers").to(Suppliers);
    },

    onReset() {
        this.injector.get("Inventories").remove({});
        this.injector.get("Categories").remove({});
        this.injector.get("Suppliers").remove({});
    },

    onStart() {
        this.injector
            .get("ProjectionBuilder")
            .rebuild([
                InventoryProjection,
                CategoryProjection,
                SupplierProjection
            ]);
    }
});

export default new ServerApp();
