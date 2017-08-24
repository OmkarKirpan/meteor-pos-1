import "./index.scss";

import { ApolloClient, compose, graphql, withApollo } from "react-apollo";
import { Button, Form, Icon, Input, InputNumber, Select, Table } from "antd";
import React, { Component } from "react";

import { ENTITYSTATUS } from "../../../constants";
import PropTypes from "prop-types";
import i18n from "meteor/universe:i18n";

@compose(withApollo)
class ItemAdjustmentFormItems extends Component {
    constructor() {
        super();
        this.addAdjustmentItem = this.addAdjustmentItem.bind(this);
        this.removeAdjustmentItem = this.removeAdjustmentItem.bind(this);
        this.validateAdjustmentItems = this.validateAdjustmentItems.bind(this);
        this.checkDuplicateAdjustmentItems = this.checkDuplicateAdjustmentItems.bind(
            this
        );
        this.onSearchItems = this.onSearchItems.bind(this);
        this.onItemSelected = this.onItemSelected.bind(this);
    }

    addAdjustmentItem() {
        const { itemAdjustmentForm, editDisabled } = this.props;
        if (editDisabled) return;
        const { getFieldValue, setFieldsValue } = itemAdjustmentForm;
        const adjustmentItems = getFieldValue("adjustmentItems");
        const adjustmentItemCount = getFieldValue("adjustmentItemCount");
        setFieldsValue({
            adjustmentItems: adjustmentItems.concat({
                adjustmentItemId: adjustmentItemCount
            }),
            adjustmentItemCount: adjustmentItemCount + 1
        });
    }

    removeAdjustmentItem(adjustmentItemId) {
        const { itemAdjustmentForm, editDisabled } = this.props;
        if (editDisabled) return;
        const { getFieldValue, setFieldsValue } = itemAdjustmentForm;
        const adjustmentItems = getFieldValue("adjustmentItems");
        setFieldsValue({
            adjustmentItems: adjustmentItems.filter(
                adjustmentItem =>
                    adjustmentItem.adjustmentItemId !== adjustmentItemId
            )
        });
    }

    validateAdjustmentItems(rule, _, callback) {
        const { itemAdjustmentForm } = this.props;
        const { getFieldValue } = itemAdjustmentForm;
        const adjustmentItems = getFieldValue("adjustmentItems");
        if (!adjustmentItems || adjustmentItems.length <= 0)
            callback(
                new Error(i18n.__("itemAdjustment-adjustmentItems-required"))
            );
        else callback();
    }

    checkDuplicateAdjustmentItems(rule, itemId, callback) {
        if (itemId === undefined) callback();
        const { itemAdjustmentForm } = this.props;
        const adjustmentItems =
            itemAdjustmentForm.getFieldValue("adjustmentItems") || [];
        let duplicateUnitCount = 0;
        adjustmentItems.forEach(adjustmentItem => {
            const { adjustmentItemId } = adjustmentItem;
            duplicateUnitCount +=
                itemAdjustmentForm.getFieldValue(
                    `adjustmentItem-${adjustmentItemId}-itemId`
                ) === itemId
                    ? 1
                    : 0;
        });
        if (duplicateUnitCount <= 1) callback();
        else
            callback(
                new Error(i18n.__("itemAdjustment-adjustmentItem-duplicated"))
            );
    }

    onItemSelected(itemId, itemOption) {
        if (!itemOption) return;
        const { itemAdjustmentForm } = this.props;
        const { setFieldsValue } = itemAdjustmentForm;
        const { item, adjustmentItemId } = itemOption.props;
        setFieldsValue({
            [`adjustmentItem-${adjustmentItemId}-item`]: item
        });
    }

    onSearchItems(searchText) {
        const { searchItemAdjustmentItems, client } = this.props;
        const filter = {
            name: searchText,
            entityStatus: ENTITYSTATUS.ACTIVE
        };
        searchItemAdjustmentItems({ client, filter });
    }

    render() {
        const { itemAdjustmentForm, editDisabled, items } = this.props;

        const { getFieldDecorator, getFieldValue } = itemAdjustmentForm;

        const adjustmentItems = getFieldValue("adjustmentItems") || [];
        getFieldDecorator("adjustmentItems");
        getFieldDecorator("adjustmentItemCount");

        const adjustmentItemsDatasource = adjustmentItems.map(
            adjustmentItem => {
                const { adjustmentItemId } = adjustmentItem;
                getFieldDecorator(`adjustmentItem-${adjustmentItemId}-item`);
                const selectedItem = getFieldValue(
                    `adjustmentItem-${adjustmentItemId}-item`
                );

                return {
                    adjustmentItemId: adjustmentItemId,
                    delete: (
                        <div>
                            {!editDisabled &&
                                <Icon
                                    className="itemAdjustment-adjustmentItem-delete-button"
                                    type="minus-circle-o"
                                    onClick={() =>
                                        this.removeAdjustmentItem(
                                            adjustmentItemId
                                        )}
                                />}
                        </div>
                    ),
                    item: (
                        <Form.Item>
                            {getFieldDecorator(
                                `adjustmentItem-${adjustmentItemId}-itemId`,
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: i18n.__(
                                                "itemAdjustment-adjustmentItem-item-required"
                                            )
                                        },
                                        {
                                            required: false,
                                            message: i18n.__(
                                                "itemAdjustment-adjustmentItem-item-duplicated"
                                            ),
                                            validator: this
                                                .checkDuplicateAdjustmentItems
                                        }
                                    ]
                                }
                            )(
                                <Select
                                    disabled={
                                        editDisabled ||
                                        selectedItem !== undefined
                                    }
                                    placeholder={i18n.__(
                                        "itemAdjustment-adjustmentItem-item-placeholder"
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
                                            adjustmentItemId={adjustmentItemId}
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
                                `adjustmentItem-${adjustmentItemId}-quantity`,
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: i18n.__(
                                                "itemAdjustment-adjustmentItem-quantity-required"
                                            )
                                        },
                                        {
                                            message: i18n.__(
                                                "itemAdjustment-adjustmentItem-quantity-invalid"
                                            ),
                                            validator: (_, value, callback) => {
                                                value === undefined ||
                                                value != 0
                                                    ? callback()
                                                    : callback(new Error());
                                            }
                                        }
                                    ]
                                }
                            )(
                                <InputNumber
                                    placeholder={i18n.__(
                                        "itemAdjustment-adjustmentItem-quantity-placeholder"
                                    )}
                                    disabled={editDisabled}
                                    style={{ width: "100%" }}
                                />
                            )}
                        </Form.Item>
                    )
                };
            }
        );

        const adjustmentItemsTableProps = {
            title: () =>
                <Form.Item>
                    {getFieldDecorator("adjustmentItems", {
                        rules: [
                            {
                                validator: this.validateAdjustmentItems
                            }
                        ]
                    })(
                        <span>
                            {i18n.__("itemAdjustment-adjustmentItems")}
                        </span>
                    )}
                </Form.Item>,
            rowKey: "adjustmentItemId",
            pagination: false,
            dataSource: adjustmentItemsDatasource,
            columns: [
                {
                    title: i18n.__("itemAdjustment-adjustmentItem-item"),
                    dataIndex: "item",
                    key: "item",
                    width: "50%"
                },
                {
                    title: i18n.__("itemAdjustment-adjustmentItem-quantity"),
                    dataIndex: "quantity",
                    key: "quantity",
                    width: "45%"
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

        return (
            <div>
                <Table {...adjustmentItemsTableProps} />
                <Button
                    className="itemAdjustment-adjustmentItems-add-button"
                    disabled={editDisabled}
                    type="dashed"
                    onClick={this.addAdjustmentItem}
                >
                    <Icon type="plus" />
                    {i18n.__("itemAdjustment-adjustmentItems-add")}
                </Button>
            </div>
        );
    }
}

ItemAdjustmentFormItems.propTypes = {
    itemAdjustmentForm: PropTypes.object,
    editDisabled: PropTypes.bool,
    searchItemAdjustmentItems: PropTypes.func,
    client: PropTypes.instanceOf(ApolloClient),
    items: PropTypes.array
};

export default ItemAdjustmentFormItems;
