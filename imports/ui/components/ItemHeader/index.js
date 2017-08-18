import { Button, Col, Input, Row } from "antd";
import React, { Component } from "react";
import { compose, withApollo } from "react-apollo";

import PropTypes from "prop-types";
import i18n from "meteor/universe:i18n";

@compose(withApollo)
class ItemHeader extends Component {
    render() {
        const { client, newItemForm, searchItems } = this.props;

        return (
            <Row>
                <Col span={4}>
                    <Button onClick={() => newItemForm({ client })}>
                        {i18n.__("item-add")}
                    </Button>
                </Col>
                <Col span={4} offset={16}>
                    <Input.Search
                        placeholder={i18n.__("item-search")}
                        onSearch={value => {
                            searchItems({
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

ItemHeader.propTypes = {
    newItemForm: PropTypes.func.isRequired,
    searchItems: PropTypes.func.isRequired
};

export default ItemHeader;
