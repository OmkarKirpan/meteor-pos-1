import { CategoryApi, InventoryApi } from "./apis";
import { CategoryHandler, InventoryHandler } from "./commandHandlers";
import { CategoryProjection, InventoryProjection } from "./projections";

import Categories from "../../domain/Category/repository";
import Inventories from "../../domain/Inventory/repository";

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
        CategoryApi
    ],

    onInitialize() {
        this.injector
            .map("ProjectionBuilder")
            .to(Space.eventSourcing.ProjectionRebuilder.create());
        this.injector.map("Inventories").to(Inventories);
        this.injector.map("Categories").to(Categories);
    },

    onReset() {
        this.injector.get("Inventories").remove({});
        this.injector.get("Categories").remove({});
    },

    onStart() {
        this.injector
            .get("ProjectionBuilder")
            .rebuild([InventoryProjection, CategoryProjection]);
    }
});

export default new ServerApp();
