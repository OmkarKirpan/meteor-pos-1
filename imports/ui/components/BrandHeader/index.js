import { Button, Col, Input, Row } from "antd";
import React, { Component } from "react";

import PropTypes from "prop-types";
import i18n from "meteor/universe:i18n";

class BrandHeader extends Component {
    render() {
        const { newBrandForm, searchBrands } = this.props;

        return (
            <Row>
                <Col span={4}>
                    <Button onClick={() => newBrandForm()}>
                        {i18n.__("brand-add")}
                    </Button>
                </Col>
                <Col span={4} offset={16}>
                    <Input.Search
                        placeholder={i18n.__("brand-search")}
                        onSearch={value => {
                            searchBrands({
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
    newBrandForm: PropTypes.func,
    searchBrands: PropTypes.func
};

export default BrandHeader;
