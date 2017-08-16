import BasePrinter from "./basePrinter";
import Customers from "../../domain/Customer/repository";
import Items from "../../domain/Item/repository";
import Orders from "../../domain/Order/repository";
import { formatCurrency } from "../currency";
import moment from "moment";
import printer from "node-thermal-printer";

export default class OrderPrinter extends BasePrinter {
    print(orderId) {
        const order = Orders.findOne({ _id: orderId });
        if (order) {
            printer.tableCustom([
                { text: "Order No", align: "LEFT", width: 0.4 },
                { text: order.orderNo, align: "LEFT", width: 0.6 }
            ]);
            printer.tableCustom([
                { text: "Order Date", align: "LEFT", width: 0.4 },
                {
                    text: moment(order.orderDate).format("DD-MM-YYYY"),
                    align: "LEFT",
                    width: 0.6
                }
            ]);
            const customer = Customers.findOne({ _id: order.customerId });
            if (customer) {
                printer.println(customer.name);
            }
            if (order.shipmentInfo) {
                order.shipmentInfo.address &&
                    printer.println(order.shipmentInfo.address);
                order.shipmentInfo.phoneNumber &&
                    printer.println(order.shipmentInfo.phoneNumber);
                order.shipmentInfo.cellphoneNumber &&
                    printer.println(order.shipmentInfo.cellphoneNumber);
            }
            let total = 0;
            let totalDiscount = 0;
            if (order.orderItems && order.orderItems.length > 0) {
                printer.newLine();
                printer.tableCustom([
                    {
                        text: "Item",
                        align: "LEFT"
                    },
                    {
                        text: "Quantity",
                        align: "LEFT"
                    },
                    {
                        text: "Price",
                        align: "LEFT"
                    },
                    {
                        text: "Total",
                        align: "LEFT"
                    },
                    {
                        text: "Discount",
                        align: "LEFT"
                    }
                ]);
                order.orderItems.forEach(orderItem => {
                    const item = Items.findOne({ _id: orderItem.itemId });
                    orderItem.itemPrices.forEach(itemPrice => {
                        total += itemPrice.quantity * itemPrice.price;
                        totalDiscount += itemPrice.discount;
                        printer.table([
                            item.name,
                            itemPrice.quantity + " " + itemPrice.unit,
                            formatCurrency(itemPrice.price),
                            formatCurrency(
                                itemPrice.quantity * itemPrice.price
                            ),
                            formatCurrency(itemPrice.discount)
                        ]);
                    });
                    totalDiscount += orderItem.discount;
                });
            }
            printer.newLine();
            printer.tableCustom([
                {
                    text: "Sub total",
                    align: "LEFT",
                    width: 0.3
                },
                {
                    text: formatCurrency(total),
                    align: "LEFT",
                    width: 0.7
                }
            ]);
            printer.tableCustom([
                {
                    text: "Discount",
                    align: "LEFT",
                    width: 0.3
                },
                {
                    text: formatCurrency(totalDiscount),
                    align: "LEFT",
                    width: 0.7
                }
            ]);
            printer.tableCustom([
                {
                    text: "Total",
                    align: "LEFT",
                    width: 0.3
                },
                {
                    text: formatCurrency(total - totalDiscount),
                    align: "LEFT",
                    width: 0.7
                }
            ]);
            super.print();
        }
    }
}
