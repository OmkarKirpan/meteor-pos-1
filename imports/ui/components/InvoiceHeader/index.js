import { Button, Col, Input, Row } from "antd";
import React, { Component } from "react";
import { compose, withApollo } from "react-apollo";

import PropTypes from "prop-types";

@compose(withApollo)
class InvoiceHeader extends Component {
    render() {
        const { client, newInvoiceForm, searchInvoices } = this.props;

        return (
            <Row>
                <Col span={4}>
                    <Button
                        className="add-invoice-button"
                        onClick={newInvoiceForm}
                    >
                        {i18n.__("invoice-add")}
                    </Button>
                </Col>
                <Col span={4} offset={16}>
                    <Input.Search
                        placeholder={i18n.__("invoice-search")}
                        onSearch={value => {
                            searchInvoices({
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

InvoiceHeader.propTypes = {
    newInvoiceForm: PropTypes.func.isRequired,
    searchInvoices: PropTypes.func.isRequired
};

export default InvoiceHeader;
