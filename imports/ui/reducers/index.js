import { default as app } from "./AppReducer";
import { default as brand } from "./BrandReducer";
import { default as category } from "./CategoryReducer";
import { client } from "../graphql";
import { combineReducers } from "redux";
import { default as customer } from "./CustomerReducer";
import { default as item } from "./ItemReducer";
import { default as itemAdjustment } from "./ItemAdjustmentReducer";
import { default as order } from "./OrderReducer";
import { reducer as reduxForm } from "redux-form";
import { routerReducer } from "react-router-redux";
import { default as session } from "./SessionReducer";
import { default as supplier } from "./SupplierReducer";
import { default as supplyOrder } from "./SupplyOrderReducer";
import { default as user } from "./UserReducer";

const rootReducer = combineReducers({
    routing: routerReducer,
    form: reduxForm,
    apollo: client.reducer(),
    app,
    customer,
    item,
    supplier,
    order,
    category,
    brand,
    order,
    session,
    user,
    itemAdjustment,
    supplyOrder
});

export { rootReducer };
