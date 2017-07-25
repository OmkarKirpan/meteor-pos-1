import { Button, Col, Input, Row } from "antd";
import React, { Component } from "react";
import { compose, withApollo } from "react-apollo";

import PropTypes from "prop-types";
import i18n from "meteor/universe:i18n";

@compose(withApollo)
class CategoryHeader extends Component {
    render() {
        const { client, newCategoryForm, searchCategories } = this.props;

        return (
            <Row>
                <Col span={4}>
                    <Button
                        className="add-category-button"
                        onClick={() => newCategoryForm({ client })}
                    >
                        {i18n.__("category-add")}
                    </Button>
                </Col>
                <Col span={4} offset={16}>
                    <Input.Search
                        placeholder={i18n.__("category-search")}
                        onSearch={value => {
                            searchCategories({
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

CategoryHeader.propTypes = {
    newCategoryForm: PropTypes.func.isRequired,
    searchCategories: PropTypes.func.isRequired
};

export default CategoryHeader;
