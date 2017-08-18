import { Button, Col, Input, Row } from "antd";
import React, { Component } from "react";

import PropTypes from "prop-types";
import i18n from "meteor/universe:i18n";

class UserHeader extends Component {
    render() {
        const { client, searchUsers } = this.props;

        return (
            <Row>
                <Col span={4} offset={20}>
                    <Input.Search
                        placeholder={i18n.__("user-search")}
                        onSearch={value => {
                            searchUsers({
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

UserHeader.propTypes = {
    searchUsers: PropTypes.func.isRequired
};

export default UserHeader;
