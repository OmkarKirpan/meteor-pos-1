import { Col, Row, Switch, Table } from "antd";
import React, { Component } from "react";
import { compose, withApollo } from "react-apollo";

import NumberFormat from "react-number-format";
import PropTypes from "prop-types";
import { RECORDSTATUS } from "../../constants";

@compose(withApollo)
class InvoiceList extends Component {
    render() {
        const {
            client,
            loading,
            error,
            invoices,
            current,
            pageSize,
            total,
            changeInvoicesPage,
            deleteInvoice,
            editInvoiceForm
        } = this.props;

        const columns = [
            {
                title: i18n.__("invoice-date"),
                key: "invoiceDate",
                dataIndex: "invoiceDate",
                width: "40%",
                render: (name, invoice) =>
                    <a
                        onClick={() => {
                            const { _id } = invoice;
                            editInvoiceForm({ client, _id });
                        }}
                    >
                        <strong>
                            {name}
                        </strong>
                    </a>
            },
            {
                title: i18n.__("invoice-customer"),
                key: "customer",
                dataIndex: "customer",
                width: "20%",
                render: customer =>
                    <div>
                        <span>
                            {customer.name}
                        </span>
                    </div>
            },
            {
                title: i18n.__("status"),
                key: "status",
                dataIndex: "status",
                width: "10%",
                render: (status, invoice) =>
                    <Switch
                        className={
                            "invoice-status-" +
                            (status === RECORDSTATUS.ACTIVE
                                ? "active"
                                : "inactive")
                        }
                        checked={status === RECORDSTATUS.ACTIVE}
                        onChange={() => {
                            const { _id } = invoice;
                            deleteInvoice({
                                client,
                                _id,
                                newStatus:
                                    status === RECORDSTATUS.ACTIVE
                                        ? RECORDSTATUS.INACTIVE
                                        : RECORDSTATUS.ACTIVE
                            });
                        }}
                    />
            }
        ];

        const expandedRowRender = invoice => {
            let { prices, baseUnit, basePrice } = invoice;
            let sortedPrices = [];
            sortedPrices.push({
                unit: baseUnit,
                price: basePrice,
                multiplier: 1
            });
            prices.forEach(price => sortedPrices.push(price));
            sortedPrices.sort(
                (price1, price2) => price1.multiplier - price2.multiplier
            );
            return (
                <div>
                    <Row>
                        <Col span={10}>
                            <Row>
                                <Col span={4}>
                                    {i18n.__("invoice-unit")}
                                </Col>
                                <Col span={8} offset={2}>
                                    {i18n.__("invoice-price")}
                                </Col>
                                <Col span={6} offset={2}>
                                    {i18n.__("invoice-multiplier")}
                                </Col>
                            </Row>
                            {sortedPrices.map((price, i) =>
                                <Row key={price.unit}>
                                    <Col span={4}>
                                        {price.unit}
                                    </Col>
                                    <Col span={8} offset={2}>
                                        <div>
                                            <span style={{ float: "left" }}>
                                                Rp
                                            </span>
                                            <NumberFormat
                                                value={price.price}
                                                displayType={"text"}
                                                thousandSeparator={true}
                                                style={{ float: "right" }}
                                            />
                                        </div>
                                    </Col>
                                    <Col span={6} offset={2}>
                                        {i === 0
                                            ? price.multiplier +
                                              " " +
                                              price.unit
                                            : Math.ceil(
                                                  price.multiplier /
                                                      sortedPrices[i - 1]
                                                          .multiplier
                                              ) +
                                              " " +
                                              sortedPrices[i - 1].unit}
                                    </Col>
                                </Row>
                            )}
                        </Col>
                    </Row>
                </div>
            );
        };

        const tableProps = {
            error,
            columns,
            loading,
            expandedRowRender,
            bordered: true,
            dataSource: invoices,
            rowKey: "_id",
            size: "small",
            pagination: {
                current,
                total,
                pageSize,
                onChange: page => {
                    changeInvoicesPage({ client, current: page });
                }
            },
            locale: {
                emptyText: i18n.__("no-data")
            }
        };

        return <Table {...tableProps} />;
    }
}

InvoiceList.propTypes = {
    loading: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
    invoices: PropTypes.array.isRequired,
    current: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired
    // changeInvoicesPage: PropTypes.func.isRequired,
    // editInvoiceForm: PropTypes.func.isRequired
};

export default InvoiceList;
