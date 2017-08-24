import { Col, Row } from "antd";
import React, { Component } from "react";

import PropTypes from "prop-types";
import { formatCurrency } from "../../../util/currency";
import i18n from "meteor/universe:i18n";

class SupplyOrderListItems extends Component {
    render() {
        const { supplyOrder } = this.props;
        let { supplyItems } = supplyOrder;

        return (
            <Row>
                <Col span={10}>
                    <Row>
                        <Col span={6}>
                            <strong>
                                {i18n.__("supplyOrder-supplyItem-item")}
                            </strong>
                        </Col>
                        <Col span={6}>
                            <strong>
                                {i18n.__("supplyOrder-supplyItem-quantity")}
                            </strong>
                        </Col>
                        <Col span={6}>
                            <strong>
                                {i18n.__("supplyOrder-supplyItem-price")}
                            </strong>
                        </Col>
                        <Col span={6}>
                            <strong>
                                {i18n.__("supplyOrder-supplyItem-total")}
                            </strong>
                        </Col>
                    </Row>
                    {supplyItems.map((supplyItem, i) =>
                        <Row key={supplyItem.itemId}>
                            <Col span={6}>
                                {supplyItem.item ? supplyItem.item.name : ""}
                            </Col>
                            <Col span={6}>
                                {`${supplyItem.quantity} ${supplyItem.item
                                    ? supplyItem.item.baseUnit
                                    : ""}`}
                            </Col>
                            <Col span={6}>
                                {formatCurrency(supplyItem.price)}
                            </Col>
                            <Col span={6}>
                                {formatCurrency(
                                    supplyItem.quantity * supplyItem.price
                                )}
                            </Col>
                        </Row>
                    )}
                </Col>
            </Row>
        );
    }
}

SupplyOrderListItems.propTypes = {
    supplyOrder: PropTypes.object
};

export default SupplyOrderListItems;
