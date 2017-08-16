import printer from "node-thermal-printer";

export default class BasePrinter {
    print() {
        printer.isPrinterConnected(isConnected => {
            if (isConnected) {
                printer.newLine();
                printer.newLine();
                printer.execute(err => {
                    err && console.error(err);
                });
            } else console.error("Printer is not connected");
        });
    }
}
