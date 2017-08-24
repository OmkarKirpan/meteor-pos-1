import { Button, Col, Input, Row } from "antd";
import React, { Component } from "react";

import PropTypes from "prop-types";
import i18n from "meteor/universe:i18n";

class SupplierHeader extends Component {
    render() {
        const { newSupplierForm, searchSuppliers } = this.props;

        return (
            <Row>
                <Col span={4}>
                    <Button onClick={() => newSupplierForm()}>
                        {i18n.__("supplier-add")}
                    </Button>
                </Col>
                <Col span={4} offset={16}>
                    <Input.Search
                        placeholder={i18n.__("supplier-search")}
                        onSearch={value => {
                            searchSuppliers({
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
    newSupplierForm: PropTypes.func,
    searchSuppliers: PropTypes.func
};

export default SupplierHeader;
