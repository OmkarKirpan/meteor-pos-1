import OrderPrinter from "./orderPrinter";
import printer from "node-thermal-printer";

const initPrinter = () => {
    printer.init({
        type: "epson",
        interface: "/dev/usb/lp2"
    });
};

const orderPrinter = new OrderPrinter();

export { initPrinter, orderPrinter };
