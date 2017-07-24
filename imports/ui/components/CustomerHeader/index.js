import { Button, Col, Input, Row } from "antd";
import React, { Component } from "react";
import { compose, withApollo } from "react-apollo";

import PropTypes from "prop-types";
import i18n from "meteor/universe:i18n";

@compose(withApollo)
class CustomerHeader extends Component {
    render() {
        const { client, newCustomerForm, searchCustomers } = this.props;

        return (
            <Row>
                <Col span={4}>
                    <Button
                        className="add-customer-button"
                        onClick={newCustomerForm}
                    >
                        {i18n.__("customer-add")}
                    </Button>
                </Col>
                <Col span={4} offset={16}>
                    <Input.Search
                        placeholder={i18n.__("customer-search")}
                        onSearch={value => {
                            searchCustomers({
                                client,
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
    newCustomerForm: PropTypes.func.isRequired,
    searchCustomers: PropTypes.func.isRequired
};

export default CustomerHeader;
