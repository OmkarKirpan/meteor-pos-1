import { Col, Row } from "antd";
import React, { Component } from "react";

import NumberFormat from "react-number-format";
import PropTypes from "prop-types";
import i18n from "meteor/universe:i18n";

class ItemListPrices extends Component {
    render() {
        const { item } = this.props;
        let { allPrices } = item;

        return (
            <Row>
                <Col span={10}>
                    <Row>
                        <Col span={4}>
                            {i18n.__("item-unit")}
                        </Col>
                        <Col span={8} offset={2}>
                            {i18n.__("item-price")}
                        </Col>
                        <Col span={6} offset={2}>
                            {i18n.__("item-multiplier")}
                        </Col>
                    </Row>
                    {allPrices.map((itemPrice, i) =>
                        <Row key={itemPrice.unit}>
                            <Col span={4}>
                                {itemPrice.unit}
                            </Col>
                            <Col span={8} offset={2}>
                                <div>
                                    <span style={{ float: "left" }}>Rp</span>
                                    <NumberFormat
                                        value={itemPrice.price}
                                        displayType={"text"}
                                        thousandSeparator={true}
                                        style={{ float: "right" }}
                                    />
                                </div>
                            </Col>
                            <Col span={6} offset={2}>
                                {i === allPrices.length - 1
                                    ? itemPrice.multiplier +
                                      " " +
                                      itemPrice.unit
                                    : Math.ceil(
                                          itemPrice.multiplier /
                                              allPrices[i + 1].multiplier
                                      ) +
                                      " " +
                                      allPrices[i + 1].unit}
                            </Col>
                        </Row>
                    )}
                </Col>
            </Row>
        );
    }
}

ItemListPrices.propTypes = {
    item: PropTypes.object.isRequired
};

export default ItemListPrices;
