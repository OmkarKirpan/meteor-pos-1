import OrderPrinter from "./orderPrinter";
import printer from "node-thermal-printer";

const initPrinter = () => {
    printer.init("epson");
};

const orderPrinter = new OrderPrinter();

export { initPrinter, orderPrinter };
