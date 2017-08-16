import { Col, Row, Switch, Table } from "antd";
import React, { Component } from "react";
import { compose, gql, graphql, withApollo } from "react-apollo";

import { CATEGORYEVENTSUBSCRIPTION } from "../../graphql/subscriptions/category";
import { ENTITYSTATUS } from "../../../constants";
import { GETCATEGORIES } from "../../graphql/queries/category";
import PropTypes from "prop-types";
import { UPDATECATEGORYSTATUS } from "../../graphql/mutations/category";
import { cloneDeep } from "lodash";
import i18n from "meteor/universe:i18n";

@graphql(GETCATEGORIES, {
    props: ({ data }) => {
        const {
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
            error,
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
                title: i18n.__("category-name"),
                key: "name",
                dataIndex: "name",
                width: "40%",
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
                render: (entityStatus, category) =>
                    <Switch
                        className={
                            "category-entityStatus-" +
                            (entityStatus === ENTITYSTATUS.ACTIVE
                                ? "active"
                                : "inactive")
                        }
                        checked={entityStatus === ENTITYSTATUS.ACTIVE}
                        onChange={() => {
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
    current: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired
};

export default CategoryList;
