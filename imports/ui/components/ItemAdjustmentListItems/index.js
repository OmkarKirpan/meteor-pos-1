import { Col, Row } from "antd";
import React, { Component } from "react";

import PropTypes from "prop-types";
import i18n from "meteor/universe:i18n";

class ItemAdjustmentListItems extends Component {
    render() {
        const { itemAdjustment } = this.props;
        let { adjustmentItems } = itemAdjustment;

        return (
            <Row>
                <Col span={10}>
                    <Row>
                        <Col span={6}>
                            <strong>
                                {i18n.__("itemAdjustment-adjustmentItem-item")}
                            </strong>
                        </Col>
                        <Col span={8} offset={2}>
                            <strong>
                                {i18n.__(
                                    "itemAdjustment-adjustmentItem-quantity"
                                )}
                            </strong>
                        </Col>
                    </Row>
                    {adjustmentItems.map((adjustmentItem, i) =>
                        <Row key={adjustmentItem.itemId}>
                            <Col span={6}>
                                {adjustmentItem.item
                                    ? adjustmentItem.item.name
                                    : ""}
                            </Col>
                            <Col span={8} offset={2}>
                                {`${adjustmentItem.quantity} ${adjustmentItem.item
                                    ? adjustmentItem.item.baseUnit
                                    : ""}`}
                            </Col>
                        </Row>
                    )}
                </Col>
            </Row>
        );
    }
}

ItemAdjustmentListItems.propTypes = {
    itemAdjustment: PropTypes.object
};

export default ItemAdjustmentListItems;
