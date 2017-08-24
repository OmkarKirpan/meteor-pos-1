import { Button, Col, DatePicker, Row } from "antd";
import React, { Component } from "react";

import { LOCALE } from "../../configs";
import PropTypes from "prop-types";
import i18n from "meteor/universe:i18n";

class ItemAdjustmentHeader extends Component {
    constructor() {
        super();
        this.searchItemAdjustments = this.searchItemAdjustments.bind(this);
    }

    searchItemAdjustments(adjustmentDate) {
        const { searchItemAdjustments } = this.props;
        searchItemAdjustments({
            filter: {
                adjustmentDate
            }
        });
    }

    render() {
        const { newItemAdjustmentForm, filter } = this.props;

        return (
            <Row>
                <Col span={4}>
                    <Button onClick={() => newItemAdjustmentForm()}>
                        {i18n.__("itemAdjustment-add")}
                    </Button>
                </Col>
                <Col span={4} offset={16}>
                    <DatePicker
                        placeholder={i18n.__("itemAdjustment-date-filter")}
                        locale={LOCALE.DATEPICKER}
                        format="DD-MM-YYYY"
                        value={filter.adjustmentDate}
                        onChange={value => {
                            this.searchItemAdjustments(value);
                        }}
                    />
                </Col>
            </Row>
        );
    }
}

ItemAdjustmentHeader.propTypes = {
    newItemAdjustmentForm: PropTypes.func,
    searchItemAdjustments: PropTypes.func,
    filter: PropTypes.object
};

export default ItemAdjustmentHeader;
