import "./index.scss";

import { Button, Col, Input, Radio, Row } from "antd";
import React, { Component } from "react";
import { compose, withApollo } from "react-apollo";

import { ORDERSTATUS } from "../../../constants";
import PropTypes from "prop-types";
import i18n from "meteor/universe:i18n";

@compose(withApollo)
class OrderHeader extends Component {
    constructor() {
        super();
        this.changeOrderStatusFilter = this.changeOrderStatusFilter.bind(this);
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
                        <Input.Search
                            placeholder={i18n.__("order-search")}
                            onSearch={value => {
                                searchOrders({
                                    client,
                                    filter: {
                                        name: value
                                    }
                                });
                            }}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}

OrderHeader.propTypes = {
    newOrderForm: PropTypes.func.isRequired,
    searchOrders: PropTypes.func.isRequired
};

export default OrderHeader;
