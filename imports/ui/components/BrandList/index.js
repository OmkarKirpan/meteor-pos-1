import { Col, Row, Switch, Table } from "antd";
import React, { Component } from "react";
import { compose, gql, graphql, withApollo } from "react-apollo";

import { BRANDEVENTSUBSCRIPTION } from "../../graphql/subscriptions/brand";
import { ENTITYSTATUS } from "../../../constants";
import { GETBRANDS } from "../../graphql/queries/brand";
import PropTypes from "prop-types";
import { cloneDeep } from "lodash";
import i18n from "meteor/universe:i18n";

@graphql(GETBRANDS, {
    props: ({ data }) => {
        const {
            brands,
            brandCount,
            loading,
            error,
            subscribeToMore,
            refetch
        } = data;
        return {
            brands,
            total: brandCount,
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
            },
            fetchPolicy: "network-only"
        };
    }
})
@compose(withApollo)
class BrandList extends Component {
    componentWillReceiveProps(newProps) {
        if (!newProps.loading) {
            if (this.unsubscribe) {
                if (newProps.brands !== this.props.brands) {
                    this.unsubscribe();
                } else {
                    return;
                }
            }

            const brandIds = newProps.brands.map(({ _id }) => _id);

            this.unsubscribe = newProps.subscribeToMore({
                document: BRANDEVENTSUBSCRIPTION,
                variables: { brandIds },
                updateQuery: (previousResult, { subscriptionData }) => {
                    const { data } = subscriptionData;
                    const { brandEvent } = data;
                    const { BrandCreated } = brandEvent;

                    if (BrandCreated) {
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
            brands,
            total,
            client,
            current,
            pageSize,
            changeItemsPage,
            editBrandForm
        } = this.props;

        const columns = [
            {
                title: (
                    <strong>
                        {i18n.__("brand-name")}
                    </strong>
                ),
                key: "name",
                dataIndex: "name",
                width: "100%",
                render: (name, brand) =>
                    brand.entityStatus === ENTITYSTATUS.ACTIVE
                        ? <a
                              onClick={() => {
                                  const { _id } = brand;
                                  editBrandForm({ client, _id });
                              }}
                          >
                              <strong>
                                  {name}
                              </strong>
                          </a>
                        : <strong>
                              {name}
                          </strong>
            }
        ];

        const tableProps = {
            error,
            columns,
            loading,
            dataSource: brands,
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

BrandList.propTypes = {
    current: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired
};

export default BrandList;
