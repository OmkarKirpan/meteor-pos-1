import { Button, Col, Input, Row } from "antd";
import React, { Component } from "react";
import { compose, withApollo } from "react-apollo";

import PropTypes from "prop-types";
import i18n from "meteor/universe:i18n";

@compose(withApollo)
class BrandHeader extends Component {
    render() {
        const { client, newBrandForm, searchBrands } = this.props;

        return (
            <Row>
                <Col span={4}>
                    <Button
                        className="add-brand-button"
                        onClick={() => newBrandForm({ client })}
                    >
                        {i18n.__("brand-add")}
                    </Button>
                </Col>
                <Col span={4} offset={16}>
                    <Input.Search
                        placeholder={i18n.__("brand-search")}
                        onSearch={value => {
                            searchBrands({
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

BrandHeader.propTypes = {
    newBrandForm: PropTypes.func.isRequired,
    searchBrands: PropTypes.func.isRequired
};

export default BrandHeader;
