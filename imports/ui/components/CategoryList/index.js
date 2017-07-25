import { Col, Row, Switch, Table } from "antd";
import React, { Component } from "react";
import { compose, gql, graphql, withApollo } from "react-apollo";

import { CATEGORYEVENTSUBSCRIPTION } from "../../graphql/subscriptions/category";
import { GETCATEGORIES } from "../../graphql/queries/category";
import PropTypes from "prop-types";
import { RECORDSTATUS } from "../../constants";
import { UPDATECATEGORYSTATUS } from "../../graphql/mutations/category";
import { cloneDeep } from "lodash";
import i18n from "meteor/universe:i18n";

@graphql(GETCATEGORIES, {
    props: ({ data }) => {
        let {
            categories,
            categoryCount,
            loading,
            error,
            subscribeToMore,
            refetch
        } = data;
        return {
            categories,
            total: categoryCount,
            loading,
            error,
            subscribeToMore,
            refetch
        };
    },
    options: ({ current, pageSize, filter }) => {
        return {
            variables: {
                skip: (current - 1) * pageSize,
                pageSize,
                filter: filter || {}
            }
        };
    }
})
@graphql(UPDATECATEGORYSTATUS, {
    name: "updateCategoryStatus"
})
@compose(withApollo)
class CategoryList extends Component {
    componentWillReceiveProps(newProps) {
        if (!newProps.loading) {
            if (this.unsubscribe) {
                if (newProps.categories !== this.props.categories) {
                    this.unsubscribe();
                } else {
                    return;
                }
            }

            let categoryIds = newProps.categories.map(({ _id }) => _id);

            this.unsubscribe = newProps.subscribeToMore({
                document: CATEGORYEVENTSUBSCRIPTION,
                variables: { categoryIds },
                updateQuery: (previousResult, { subscriptionData }) => {
                    let newResult = cloneDeep(previousResult);

                    let { data } = subscriptionData;
                    let { categoryEvent } = data;
                    let {
                        CategoryCreated,
                        CategoryUpdated,
                        CategoryActivated,
                        CategoryInactivated
                    } = categoryEvent;

                    if (CategoryCreated) {
                        newProps.refetch();
                    } else if (CategoryUpdated) {
                        newResult.categories.forEach(category => {
                            if (category._id === CategoryUpdated._id) {
                                category.name = CategoryUpdated.name;
                                category.basePrice = CategoryUpdated.basePrice;
                                category.baseUnit = CategoryUpdated.baseUnit;
                                category.prices = CategoryUpdated.prices;
                                return;
                            }
                        });
                    } else if (CategoryActivated) {
                        newResult.categories.forEach(category => {
                            if (category._id === CategoryActivated._id) {
                                category.status = RECORDSTATUS.ACTIVE;
                                return;
                            }
                        });
                    } else if (CategoryInactivated) {
                        newResult.categories.forEach(category => {
                            if (category._id === CategoryInactivated._id) {
                                category.status = RECORDSTATUS.INACTIVE;
                                return;
                            }
                        });
                    }

                    return newResult;
                },
                onError: err => console.error(err)
            });
        }
    }

    componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    render() {
        const {
            loading,
            error,
            categories,
            total,
            client,
            current,
            pageSize,
            changeInventoriesPage,
            editCategoryForm,
            updateCategoryStatus
        } = this.props;

        const columns = [
            {
                title: i18n.__("category-name"),
                key: "name",
                dataIndex: "name",
                width: "40%",
                render: (name, category) =>
                    category.status === RECORDSTATUS.ACTIVE
                        ? <a
                              onClick={() => {
                                  const { _id } = category;
                                  editCategoryForm({ client, _id });
                              }}
                          >
                              <strong>
                                  {name}
                              </strong>
                          </a>
                        : <strong>
                              {name}
                          </strong>
            },
            {
                title: i18n.__("status"),
                key: "status",
                dataIndex: "status",
                width: "10%",
                render: (status, category) =>
                    <Switch
                        className={
                            "category-status-" +
                            (status === RECORDSTATUS.ACTIVE
                                ? "active"
                                : "inactive")
                        }
                        checked={status === RECORDSTATUS.ACTIVE}
                        onChange={() => {
                            const { _id } = category;
                            updateCategoryStatus({
                                variables: {
                                    _id,
                                    newStatus:
                                        status === RECORDSTATUS.ACTIVE
                                            ? RECORDSTATUS.INACTIVE
                                            : RECORDSTATUS.ACTIVE
                                }
                            });
                        }}
                    />
            }
        ];

        const tableProps = {
            error,
            columns,
            loading,
            bordered: true,
            dataSource: categories,
            rowKey: "_id",
            size: "small",
            pagination: {
                current,
                total,
                pageSize,
                onChange: page => {
                    changeInventoriesPage({ client, current: page });
                }
            },
            locale: {
                emptyText: i18n.__("no-data")
            }
        };

        return <Table {...tableProps} />;
    }
}

CategoryList.propTypes = {
    current: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired
};

export default CategoryList;
