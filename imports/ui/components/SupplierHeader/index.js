import { Button, Col, Input, Row } from "antd";
import React, { Component } from "react";
import { compose, withApollo } from "react-apollo";

import PropTypes from "prop-types";
import i18n from "meteor/universe:i18n";

@compose(withApollo)
class SupplierHeader extends Component {
    render() {
        const { client, newSupplierForm, searchSuppliers } = this.props;

        return (
            <Row>
                <Col span={4}>
                    <Button
                        className="add-supplier-button"
                        onClick={() => newSupplierForm({ client })}
                    >
                        {i18n.__("supplier-add")}
                    </Button>
                </Col>
                <Col span={4} offset={16}>
                    <Input.Search
                        placeholder={i18n.__("supplier-search")}
                        onSearch={value => {
                            searchSuppliers({
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

SupplierHeader.propTypes = {
    newSupplierForm: PropTypes.func.isRequired,
    searchSuppliers: PropTypes.func.isRequired
};

export default SupplierHeader;
