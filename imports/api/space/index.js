import {
    BrandApi,
    CategoryApi,
    CustomerApi,
    ItemAdjustmentApi,
    ItemApi,
    OrderApi,
    SupplierApi,
    SupplyOrderApi
} from "./apis";
import {
    BrandHandler,
    CategoryHandler,
    CustomerHandler,
    ItemAdjustmentHandler,
    ItemHandler,
    OrderHandler,
    SupplierHandler,
    SupplyOrderHandler
} from "./commandHandlers";
import {
    BrandProjection,
    CategoryProjection,
    CustomerProjection,
    ItemAdjustmentProjection,
    ItemProjection,
    OrderProjection,
    SupplierProjection,
    SupplyOrderProjection
} from "./projections";

import Brands from "../../domain/Brand/repository";
import Categories from "../../domain/Category/repository";
import Customers from "../../domain/Customer/repository";
import ItemAdjustments from "../../domain/ItemAdjustment/repository";
import Items from "../../domain/Item/repository";
import Orders from "../../domain/Order/repository";
import Suppliers from "../../domain/Supplier/repository";
import SupplyOrders from "../../domain/SupplyOrder/repository";

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
        OrderProjection,
        ItemAdjustmentHandler,
        ItemAdjustmentApi,
        ItemAdjustmentProjection,
        SupplyOrderHandler,
        SupplyOrderApi,
        SupplyOrderProjection
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
        this.injector.map("ItemAdjustments").to(ItemAdjustments);
        this.injector.map("SupplyOrders").to(SupplyOrders);
    },

    onReset() {
        this.injector.get("Items").remove({});
        this.injector.get("Categories").remove({});
        this.injector.get("Suppliers").remove({});
        this.injector.get("Customers").remove({});
        this.injector.get("Brands").remove({});
        this.injector.get("Orders").remove({});
        this.injector.get("ItemAdjustments").remove({});
        this.injector.get("SupplyOrders").remove({});
    },

    onStart() {
        // this.injector
        //     .get("ProjectionBuilder")
        //     .rebuild([
        //         ItemProjection,
        //         CategoryProjection,
        //         SupplierProjection,
        //         CustomerProjection,
        //         BrandProjection,
        //         OrderProjection,
        //         ItemAdjustmentProjection,
        //         SupplyOrderProjection
        //     ]);
    }
});

export default new ServerApp();
