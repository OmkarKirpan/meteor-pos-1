import "./index.scss";

import {
    Button,
    Col,
    Form,
    Icon,
    Input,
    InputNumber,
    Row,
    Select,
    Table
} from "antd";
import React, { Component } from "react";
import { compose, graphql, withApollo } from "react-apollo";

import { ENTITYSTATUS } from "../../../constants";
import PropTypes from "prop-types";
import { formatCurrency } from "../../../util/currency";
import i18n from "meteor/universe:i18n";

@compose(withApollo)
class SupplyOrderFormItems extends Component {
    constructor() {
        super();
        this.addSupplyItem = this.addSupplyItem.bind(this);
        this.removeSupplyItem = this.removeSupplyItem.bind(this);
        this.validateSupplyItems = this.validateSupplyItems.bind(this);
        this.checkDuplicateSupplyItems = this.checkDuplicateSupplyItems.bind(
            this
        );
        this.onSearchItems = this.onSearchItems.bind(this);
        this.onItemSelected = this.onItemSelected.bind(this);
    }

    addSupplyItem() {
        const { supplyOrderForm, editDisabled } = this.props;
        if (editDisabled) return;
        const { getFieldValue, setFieldsValue } = supplyOrderForm;
        const supplyItems = getFieldValue("supplyItems");
        const supplyItemCount = getFieldValue("supplyItemCount");
        setFieldsValue({
            supplyItems: supplyItems.concat({
                supplyItemId: supplyItemCount
            }),
            supplyItemCount: supplyItemCount + 1
        });
    }

    removeSupplyItem(supplyItemId) {
        const { supplyOrderForm, editDisabled } = this.props;
        if (editDisabled) return;
        const { getFieldValue, setFieldsValue } = supplyOrderForm;
        const supplyItems = getFieldValue("supplyItems");
        setFieldsValue({
            supplyItems: supplyItems.filter(
                supplyItem => supplyItem.supplyItemId !== supplyItemId
            )
        });
    }

    validateSupplyItems(rule, _, callback) {
        const { supplyOrderForm } = this.props;
        const { getFieldValue } = supplyOrderForm;
        const supplyItems = getFieldValue("supplyItems");
        if (!supplyItems || supplyItems.length <= 0)
            callback(new Error(i18n.__("supplyOrder-supplyItems-required")));
        else callback();
    }

    checkDuplicateSupplyItems(rule, itemId, callback) {
        if (itemId === undefined) callback();
        const { supplyOrderForm } = this.props;
        const supplyItems = supplyOrderForm.getFieldValue("supplyItems") || [];
        let duplicateUnitCount = 0;
        supplyItems.forEach(supplyItem => {
            const { supplyItemId } = supplyItem;
            duplicateUnitCount +=
                supplyOrderForm.getFieldValue(
                    `supplyItem-${supplyItemId}-itemId`
                ) === itemId
                    ? 1
                    : 0;
        });
        if (duplicateUnitCount <= 1) callback();
        else callback(new Error(i18n.__("supplyOrder-supplyItem-duplicated")));
    }

    onItemSelected(itemId, itemOption) {
        if (!itemOption) return;
        const { supplyOrderForm } = this.props;
        const { setFieldsValue } = supplyOrderForm;
        const { item, supplyItemId } = itemOption.props;
        setFieldsValue({
            [`supplyItem-${supplyItemId}-item`]: item
        });
    }

    onSearchItems(searchText) {
        const { searchSupplyOrderItems, client } = this.props;
        const filter = {
            name: searchText,
            entityStatus: ENTITYSTATUS.ACTIVE
        };
        searchSupplyOrderItems({ client, filter });
    }

    render() {
        const { supplyOrderForm, editDisabled, items } = this.props;

        const { getFieldDecorator, getFieldValue } = supplyOrderForm;

        getFieldDecorator("supplyItems");
        getFieldDecorator("supplyItemCount");
        const supplyItems = getFieldValue("supplyItems") || [];

        const supplyItemsDatasource = supplyItems.map(supplyItem => {
            const { supplyItemId } = supplyItem;
            getFieldDecorator(`supplyItem-${supplyItemId}-item`);
            const selectedItem = getFieldValue(
                `supplyItem-${supplyItemId}-item`
            );

            return {
                supplyItemId: supplyItemId,
                delete: (
                    <div>
                        {!editDisabled &&
                            <Icon
                                className="item-price-delete-button"
                                type="minus-circle-o"
                                onClick={() =>
                                    this.removeSupplyItem(supplyItemId)}
                            />}
                    </div>
                ),
                item: (
                    <Form.Item>
                        {getFieldDecorator(
                            `supplyItem-${supplyItemId}-itemId`,
                            {
                                rules: [
                                    {
                                        required: true,
                                        message: i18n.__(
                                            "supplyOrder-supplyItem-item-required"
                                        )
                                    },
                                    {
                                        required: false,
                                        message: i18n.__(
                                            "supplyOrder-supplyItem-item-duplicated"
                                        ),
                                        validator: this
                                            .checkDuplicateSupplyItems
                                    }
                                ]
                            }
                        )(
                            <Select
                                disabled={
                                    editDisabled || selectedItem !== undefined
                                }
                                placeholder={i18n.__(
                                    "supplyOrder-supplyItem-item-placeholder"
                                )}
                                mode="combobox"
                                notFoundContent=""
                                optionLabelProp="text"
                                defaultActiveFirstOption={false}
                                filterOption={false}
                                onSearch={this.onSearchItems}
                                onSelect={this.onItemSelected}
                            >
                                {(items || []).map(item =>
                                    <Select.Option
                                        key={item._id}
                                        text={`${item.name}`}
                                        supplyItemId={supplyItemId}
                                        item={item}
                                    >
                                        <span>
                                            {item.name}
                                        </span>
                                    </Select.Option>
                                )}
                            </Select>
                        )}
                    </Form.Item>
                ),
                quantity: (
                    <Form.Item>
                        {getFieldDecorator(
                            `supplyItem-${supplyItemId}-quantity`,
                            {
                                rules: [
                                    {
                                        required: true,
                                        message: i18n.__(
                                            "supplyOrder-supplyItem-quantity-required"
                                        )
                                    },
                                    {
                                        message: i18n.__(
                                            "supplyOrder-supplyItem-quantity-invalid"
                                        ),
                                        validator: (_, value, callback) => {
                                            value === undefined || value > 0
                                                ? callback()
                                                : callback(new Error());
                                        }
                                    }
                                ]
                            }
                        )(
                            <InputNumber
                                placeholder={i18n.__(
                                    "supplyOrder-supplyItem-quantity-placeholder"
                                )}
                                disabled={editDisabled}
                                style={{ width: "100%" }}
                            />
                        )}
                    </Form.Item>
                ),
                price: (
                    <Form.Item>
                        {getFieldDecorator(`supplyItem-${supplyItemId}-price`, {
                            rules: [
                                {
                                    required: true,
                                    message: i18n.__(
                                        "supplyOrder-supplyItem-price-required"
                                    )
                                },
                                {
                                    message: i18n.__(
                                        "supplyOrder-supplyItem-price-invalid"
                                    ),
                                    validator: (_, value, callback) => {
                                        value === undefined || value > 0
                                            ? callback()
                                            : callback(new Error());
                                    }
                                }
                            ]
                        })(
                            <InputNumber
                                formatter={value =>
                                    `Rp ${value
                                        .toString()
                                        .replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                        )}`}
                                parser={value =>
                                    value.toString().replace(/Rp\s?|(,*)/g, "")}
                                placeholder={i18n.__(
                                    "supplyOrder-supplyItem-price-placeholder"
                                )}
                                disabled={editDisabled}
                                style={{ width: "100%" }}
                            />
                        )}
                    </Form.Item>
                ),
                total: (
                    <div style={{ marginBottom: "24px" }}>
                        {formatCurrency(
                            (getFieldValue(
                                `supplyItem-${supplyItemId}-price`
                            ) || 0) *
                                (getFieldValue(
                                    `supplyItem-${supplyItemId}-quantity`
                                ) || 0)
                        )}
                    </div>
                )
            };
        });

        const supplyItemsTableProps = {
            title: () =>
                <Form.Item>
                    {getFieldDecorator("supplyItems", {
                        rules: [
                            {
                                validator: this.validateSupplyItems
                            }
                        ]
                    })(
                        <span>
                            {i18n.__("supplyOrder-supplyItems")}
                        </span>
                    )}
                </Form.Item>,
            rowKey: "supplyItemId",
            pagination: false,
            dataSource: supplyItemsDatasource,
            columns: [
                {
                    title: i18n.__("supplyOrder-supplyItem-item"),
                    dataIndex: "item",
                    key: "item",
                    width: "20%"
                },
                {
                    title: i18n.__("supplyOrder-supplyItem-quantity"),
                    dataIndex: "quantity",
                    key: "quantity",
                    width: "25%"
                },
                ,
                {
                    title: i18n.__("supplyOrder-supplyItem-price"),
                    dataIndex: "price",
                    key: "price",
                    width: "25%"
                },
                ,
                {
                    title: i18n.__("supplyOrder-supplyItem-total"),
                    dataIndex: "total",
                    key: "total",
                    width: "25%"
                },
                {
                    dataIndex: "delete",
                    key: "delete",
                    width: "5%"
                }
            ],
            scroll: { y: 200 },
            locale: {
                emptyText: i18n.__("no-data")
            }
        };

        const leftTotalsProps = {
            xs: 12,
            sm: 12,
            md: 12,
            lg: 12,
            xl: 12
        };

        const rightTotalProps = {
            xs: 12,
            sm: 12,
            md: 12,
            lg: 12,
            xl: 12
        };

        return (
            <div>
                <Table {...supplyItemsTableProps} />
                <Button
                    className="supplyOrder-supplyItems-add-button"
                    disabled={editDisabled}
                    type="dashed"
                    onClick={this.addSupplyItem}
                >
                    <Icon type="plus" />
                    {i18n.__("supplyOrder-supplyItems-add")}
                </Button>
                <Row>
                    <Col {...leftTotalsProps}>
                        <span>Sub total</span>
                    </Col>
                    <Col {...rightTotalProps}>
                        {formatCurrency(
                            supplyItems.reduce((sum, supplyItem) => {
                                const { supplyItemId } = supplyItem;
                                return (
                                    sum +
                                    (getFieldValue(
                                        `supplyItem-${supplyItemId}-price`
                                    ) || 0) *
                                        (getFieldValue(
                                            `supplyItem-${supplyItemId}-quantity`
                                        ) || 0)
                                );
                            }, 0)
                        )}
                    </Col>
                </Row>
                <Row>
                    <Col {...leftTotalsProps}>
                        <span>Total discount</span>
                    </Col>
                    <Col {...rightTotalProps}>
                        {formatCurrency(getFieldValue("discount") || 0)}
                    </Col>
                </Row>
                <Row>
                    <Col {...leftTotalsProps}>
                        <span>Total</span>
                    </Col>
                    <Col {...rightTotalProps}>
                        {formatCurrency(
                            supplyItems.reduce((sum, supplyItem) => {
                                const { supplyItemId } = supplyItem;
                                return (
                                    sum +
                                    (getFieldValue(
                                        `supplyItem-${supplyItemId}-price`
                                    ) || 0) *
                                        (getFieldValue(
                                            `supplyItem-${supplyItemId}-quantity`
                                        ) || 0)
                                );
                            }, -(getFieldValue("discount") || 0))
                        )}
                    </Col>
                </Row>
            </div>
        );
    }
}

SupplyOrderFormItems.propTypes = {};

export default SupplyOrderFormItems;
