import { default as app } from "./AppReducer";
import { default as category } from "./CategoryReducer";
import { client } from "../graphql";
import { combineReducers } from "redux";
import { default as customer } from "./CustomerReducer";
import { default as inventory } from "./InventoryReducer";
import { default as invoice } from "./InvoiceReducer";
import { reducer as reduxForm } from "redux-form";
import { routerReducer } from "react-router-redux";
import { default as supplier } from "./SupplierReducer";

const rootReducer = combineReducers({
    routing: routerReducer,
    form: reduxForm,
    apollo: client.reducer(),
    app,
    customer,
    inventory,
    supplier,
    invoice,
    category
});

export { rootReducer };
