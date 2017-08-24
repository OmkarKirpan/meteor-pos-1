import { Button, Col, Input, Row } from "antd";
import React, { Component } from "react";

import PropTypes from "prop-types";
import i18n from "meteor/universe:i18n";

class ItemHeader extends Component {
    render() {
        const { newItemForm, searchItems } = this.props;

        return (
            <Row>
                <Col span={4}>
                    <Button onClick={() => newItemForm()}>
                        {i18n.__("item-add")}
                    </Button>
                </Col>
                <Col span={4} offset={16}>
                    <Input.Search
                        placeholder={i18n.__("item-search")}
                        onSearch={value => {
                            searchItems({
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

ItemHeader.propTypes = {
    newItemForm: PropTypes.func,
    searchItems: PropTypes.func
};

export default ItemHeader;
