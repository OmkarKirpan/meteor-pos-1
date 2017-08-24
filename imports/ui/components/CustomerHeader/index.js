import { Button, Col, Input, Row } from "antd";
import React, { Component } from "react";

import PropTypes from "prop-types";
import i18n from "meteor/universe:i18n";

class CustomerHeader extends Component {
    render() {
        const { newCustomerForm, searchCustomers } = this.props;

        return (
            <Row>
                <Col span={4}>
                    <Button onClick={() => newCustomerForm()}>
                        {i18n.__("customer-add")}
                    </Button>
                </Col>
                <Col span={4} offset={16}>
                    <Input.Search
                        placeholder={i18n.__("customer-search")}
                        onSearch={value => {
                            searchCustomers({
                                filter: {
                                    name: value
                                }
                            });
                        }}
                    />
                </Col>
            </Row>
        );
    }
}

CustomerHeader.propTypes = {
    newCustomerForm: PropTypes.func,
    searchCustomers: PropTypes.func
};

export default CustomerHeader;
