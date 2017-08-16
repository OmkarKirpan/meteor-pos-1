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
                <Row>
                    <Radio.Group
                        value={filter.orderStatus}
                        onChange={this.changeOrderStatusFilter}
                    >
                        <Radio.Button value={ORDERSTATUS.INPROGRESS}>
                            In Progress
                        </Radio.Button>
                        <Radio.Button value={ORDERSTATUS.CANCELLED}>
                            Cancelled
                        </Radio.Button>
                        <Radio.Button value={ORDERSTATUS.FINALIZED}>
                            Finalized
                        </Radio.Button>
                        <Radio.Button value={ORDERSTATUS.COMPLETED}>
                            Completed
                        </Radio.Button>
                    </Radio.Group>
                </Row>
                <Row>
                    <Col span={4}>
                        <Button
                            className="add-order-button"
                            onClick={() => newOrderForm({ client })}
                        >
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
