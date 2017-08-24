import "./index.scss";

import { Button, Col, DatePicker, Radio, Row } from "antd";
import React, { Component } from "react";

import { LOCALE } from "../../configs";
import { ORDERSTATUS } from "../../../constants";
import PropTypes from "prop-types";
import i18n from "meteor/universe:i18n";

class OrderHeader extends Component {
    constructor() {
        super();
        this.changeOrderStatusFilter = this.changeOrderStatusFilter.bind(this);
        this.searchOrders = this.searchOrders.bind(this);
    }

    changeOrderStatusFilter(e) {
        const orderStatus = e.target.value;
        const { searchOrders } = this.props;
        searchOrders({
            filter: {
                orderStatus
            }
        });
    }

    searchOrders(orderDate) {
        const { searchOrders } = this.props;
        searchOrders({
            filter: {
                orderDate
            }
        });
    }

    render() {
        const { client, newOrderForm, searchOrders, filter } = this.props;

        return (
            <div>
                <Row className="order-header-status-filter-row">
                    <Radio.Group
                        value={filter.orderStatus}
                        onChange={this.changeOrderStatusFilter}
                    >
                        <Radio.Button value={ORDERSTATUS.INPROGRESS}>
                            {i18n.__("order-status-inProgress")}
                        </Radio.Button>
                        <Radio.Button value={ORDERSTATUS.FINALIZED}>
                            {i18n.__("order-status-finalized")}
                        </Radio.Button>
                        <Radio.Button value={ORDERSTATUS.COMPLETED}>
                            {i18n.__("order-status-completed")}
                        </Radio.Button>
                        <Radio.Button value={ORDERSTATUS.CANCELLED}>
                            {i18n.__("order-status-cancelled")}
                        </Radio.Button>
                    </Radio.Group>
                </Row>
                <Row>
                    <Col span={4}>
                        <Button onClick={() => newOrderForm({ client })}>
                            {i18n.__("order-add")}
                        </Button>
                    </Col>
                    <Col span={4} offset={16}>
                        <DatePicker
                            placeholder={i18n.__("order-date-filter")}
                            locale={LOCALE.DATEPICKER}
                            format="DD-MM-YYYY"
                            value={filter.orderDate}
                            onChange={value => {
                                this.searchOrders(value);
                            }}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}

OrderHeader.propTypes = {
    newOrderForm: PropTypes.func,
    searchOrders: PropTypes.func,
    filter: PropTypes.object
};

export default OrderHeader;
