import { Col, Row, Switch, Table } from "antd";
import React, { Component } from "react";
import { compose, gql, graphql, withApollo } from "react-apollo";

import { GETSUPPLIERS } from "../../graphql/queries/supplier";
import PropTypes from "prop-types";
import { RECORDSTATUS } from "../../constants";
import { SUPPLIEREVENTSUBSCRIPTION } from "../../graphql/subscriptions/supplier";
import { cloneDeep } from "lodash";
import i18n from "meteor/universe:i18n";

@graphql(GETSUPPLIERS, {
    props: ({ data }) => {
        let {
            suppliers,
            supplierCount,
            loading,
            error,
            subscribeToMore,
            refetch
        } = data;
        return {
            suppliers,
            total: supplierCount,
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
@compose(withApollo)
class SupplierList extends Component {
    componentWillReceiveProps(newProps) {
        if (!newProps.loading) {
            if (this.unsubscribe) {
                if (newProps.suppliers !== this.props.suppliers) {
                    this.unsubscribe();
                } else {
                    return;
                }
            }

            let supplierIds = newProps.suppliers.map(({ _id }) => _id);

            this.unsubscribe = newProps.subscribeToMore({
                document: SUPPLIEREVENTSUBSCRIPTION,
                variables: { supplierIds },
                updateQuery: (previousResult, { subscriptionData }) => {
                    let newResult = cloneDeep(previousResult);

                    let { data } = subscriptionData;
                    let { supplierEvent } = data;
                    let { SupplierCreated, SupplierUpdated } = supplierEvent;

                    if (SupplierCreated) {
                        newProps.refetch();
                    } else if (SupplierUpdated) {
                        newResult.suppliers.forEach(supplier => {
                            if (supplier._id === SupplierUpdated._id) {
                                supplier.name = SupplierUpdated.name;
                                supplier.address = SupplierUpdated.address;
                                supplier.phoneNumber =
                                    SupplierUpdated.phoneNumber;
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
            suppliers,
            total,
            client,
            current,
            pageSize,
            changeInventoriesPage,
            editSupplierForm
        } = this.props;

        const columns = [
            {
                title: i18n.__("supplier-name"),
                key: "name",
                dataIndex: "name",
                width: "33%",
                render: (name, supplier) =>
                    <a
                        onClick={() => {
                            const { _id } = supplier;
                            editSupplierForm({ client, _id });
                        }}
                    >
                        <strong>
                            {name}
                        </strong>
                    </a>
            },
            {
                title: i18n.__("supplier-address"),
                key: "address",
                dataIndex: "address",
                width: "33%",
                render: address =>
                    <strong>
                        {address}
                    </strong>
            },
            {
                title: i18n.__("supplier-phoneNumber"),
                key: "phoneNumber",
                dataIndex: "phoneNumber",
                width: "33%",
                render: phoneNumber =>
                    <strong>
                        {phoneNumber}
                    </strong>
            }
        ];

        const tableProps = {
            error,
            columns,
            loading,
            bordered: true,
            dataSource: suppliers,
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

SupplierList.propTypes = {
    current: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired
};

export default SupplierList;
