import { Button, Col, Input, Row } from "antd";
import React, { Component } from "react";

import PropTypes from "prop-types";
import i18n from "meteor/universe:i18n";

class CategoryHeader extends Component {
    render() {
        const { newCategoryForm, searchCategories } = this.props;

        return (
            <Row>
                <Col span={4}>
                    <Button onClick={() => newCategoryForm()}>
                        {i18n.__("category-add")}
                    </Button>
                </Col>
                <Col span={4} offset={16}>
                    <Input.Search
                        placeholder={i18n.__("category-search")}
                        onSearch={value => {
                            searchCategories({
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
    newCategoryForm: PropTypes.func,
    searchCategories: PropTypes.func
};

export default CategoryHeader;
