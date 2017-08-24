import "./index.scss";

import { ApolloClient, compose, graphql, withApollo } from "react-apollo";
import { Button, Table } from "antd";
import React, { Component } from "react";

import { CATEGORYEVENTSUBSCRIPTION } from "../../graphql/subscriptions/category";
import { ENTITYSTATUS } from "../../../constants";
import { GETCATEGORIES } from "../../graphql/queries/category";
import PropTypes from "prop-types";
import { UPDATECATEGORYSTATUS } from "../../graphql/mutations/category";
import i18n from "meteor/universe:i18n";

@graphql(GETCATEGORIES, {
    props: ({ data }) => {
        const {
            categories,
            categoryCount,
            loading,
            subscribeToMore,
            refetch
        } = data;
        return {
            categories,
            total: categoryCount,
            loading,
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
            },
            fetchPolicy: "network-only"
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

            const categoryIds = newProps.categories.map(({ _id }) => _id);

            this.unsubscribe = newProps.subscribeToMore({
                document: CATEGORYEVENTSUBSCRIPTION,
                variables: { categoryIds },
                updateQuery: (previousResult, { subscriptionData }) => {
                    const { data } = subscriptionData;
                    const { categoryEvent } = data;
                    const { CategoryCreated } = categoryEvent;

                    if (CategoryCreated) {
                        newProps.refetch({
                            variables: {
                                skip:
                                    (newProps.current - 1) * newProps.pageSize,
                                pageSize: newProps.pageSize,
                                filter: newProps.filter || {}
                            }
                        });
                    }

                    return previousResult;
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
            categories,
            total,
            client,
            current,
            pageSize,
            changeItemsPage,
            editCategoryForm,
            updateCategoryStatus
        } = this.props;

        const columns = [
            {
                title: (
                    <strong>
                        {i18n.__("category-name")}
                    </strong>
                ),
                key: "name",
                dataIndex: "name",
                width: "80%",
                render: (name, category) =>
                    category.entityStatus === ENTITYSTATUS.ACTIVE
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
                title: i18n.__("entityStatus"),
                key: "entityStatus",
                dataIndex: "entityStatus",
                width: "10%",
                render: entityStatus =>
                    <span
                        className={
                            "entity-status-" +
                            (entityStatus === ENTITYSTATUS.ACTIVE
                                ? "active"
                                : "inactive")
                        }
                    >
                        {entityStatus === ENTITYSTATUS.ACTIVE
                            ? i18n.__("entityStatus-active")
                            : i18n.__("entityStatus-inactive")}
                    </span>
            },
            {
                title: i18n.__("action"),
                key: "action",
                dataIndex: "entityStatus",
                width: "10%",
                render: (entityStatus, category) =>
                    <Button
                        style={{ width: "100%" }}
                        onClick={() => {
                            const { _id } = category;
                            updateCategoryStatus({
                                variables: {
                                    _id,
                                    newStatus:
                                        entityStatus === ENTITYSTATUS.ACTIVE
                                            ? ENTITYSTATUS.INACTIVE
                                            : ENTITYSTATUS.ACTIVE
                                }
                            });
                        }}
                    >
                        {entityStatus === ENTITYSTATUS.ACTIVE
                            ? i18n.__("deactivate")
                            : i18n.__("activate")}
                    </Button>
            }
        ];

        const tableProps = {
            columns,
            loading,
            dataSource: categories,
            rowKey: "_id",
            size: "middle",
            pagination: {
                current,
                total,
                pageSize,
                onChange: page => {
                    changeItemsPage({ client, current: page });
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
    loading: PropTypes.bool,
    categories: PropTypes.array,
    total: PropTypes.number,
    client: PropTypes.instanceOf(ApolloClient),
    current: PropTypes.number,
    pageSize: PropTypes.number,
    changeItemsPage: PropTypes.func,
    editCategoryForm: PropTypes.func,
    updateCategoryStatus: PropTypes.func
};

export default CategoryList;
