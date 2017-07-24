import { Button, Col, Input, Row } from "antd";
import React, { Component } from "react";
import { compose, withApollo } from "react-apollo";

import PropTypes from "prop-types";
import i18n from "meteor/universe:i18n";

@compose(withApollo)
class InventoryHeader extends Component {
    render() {
        const { client, newInventoryForm, searchInventories } = this.props;

        return (
            <Row>
                <Col span={4}>
                    <Button
                        className="add-inventory-button"
                        onClick={() => newInventoryForm({ client })}
                    >
                        {i18n.__("inventory-add")}
                    </Button>
                </Col>
                <Col span={4} offset={16}>
                    <Input.Search
                        placeholder={i18n.__("inventory-search")}
                        onSearch={value => {
                            searchInventories({
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

InventoryHeader.propTypes = {
    newInventoryForm: PropTypes.func.isRequired,
    searchInventories: PropTypes.func.isRequired
};

export default InventoryHeader;
