import nodePrinter from "printer";
import printer from "node-thermal-printer";

export default class BasePrinter {
    print() {
        printer.newLine();
        let text = printer.getText();
        printer.clear();
        nodePrinter.printDirect({
            data: text,
            type: "RAW",
            printer: "Printer",
            success: jobId => console.info("Printing with job id: ", jobId),
            error: err => console.error("Printing error: ", err)
        });
    }
}
