import { InventoryApi, InventoryCategoryApi } from "./apis";
import { InventoryCategoryHandler, InventoryHandler } from "./commandHandlers";
import {
    InventoryCategoryProjection,
    InventoryProjection
} from "./projections";

import Inventories from "../../domain/Inventory/repository";
import InventoryCategories from "../../domain/InventoryCategory/repository";

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
        InventoryCategoryHandler,
        InventoryCategoryProjection,
        InventoryCategoryApi
    ],

    onInitialize() {
        this.injector
            .map("ProjectionBuilder")
            .to(Space.eventSourcing.ProjectionRebuilder.create());
        this.injector.map("Inventories").to(Inventories);
        this.injector.map("InventoryCategories").to(InventoryCategories);
    },

    onReset() {
        this.injector.get("Inventories").remove({});
        this.injector.get("InventoryCategories").remove({});
    },

    onStart() {
        this.injector
            .get("ProjectionBuilder")
            .rebuild([InventoryProjection, InventoryCategoryProjection]);
    }
});

export default new ServerApp();
