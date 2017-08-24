import { Button, Col, DatePicker, Row } from "antd";
import React, { Component } from "react";

import { LOCALE } from "../../configs";
import PropTypes from "prop-types";
import i18n from "meteor/universe:i18n";

class SupplyOrderHeader extends Component {
    constructor() {
        super();
        this.searchSupplyOrders = this.searchSupplyOrders.bind(this);
    }

    searchSupplyOrders(orderDate) {
        const { searchSupplyOrders } = this.props;
        searchSupplyOrders({
            filter: {
                orderDate
            }
        });
    }

    render() {
        const { newSupplyOrderForm, searchSupplyOrders, filter } = this.props;

        return (
            <Row>
                <Col span={4}>
                    <Button onClick={() => newSupplyOrderForm()}>
                        {i18n.__("supplyOrder-add")}
                    </Button>
                </Col>
                <Col span={4} offset={16}>
                    <DatePicker
                        placeholder={i18n.__("supplyOrder-date-filter")}
                        locale={LOCALE.DATEPICKER}
                        format="DD-MM-YYYY"
                        value={filter.orderDate}
                        onChange={value => {
                            this.searchSupplyOrders(value);
                        }}
                    />
                </Col>
            </Row>
        );
    }
}

SupplyOrderHeader.propTypes = {
    newSupplyOrderForm: PropTypes.func,
    searchSupplyOrders: PropTypes.func,
    filter: PropTypes.object
};

export default SupplyOrderHeader;
