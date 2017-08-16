import { Col, Row, Switch, Table } from "antd";
import React, { Component } from "react";
import { compose, gql, graphql, withApollo } from "react-apollo";

import { ENTITYSTATUS } from "../../../constants";
import { GETSUPPLIERS } from "../../graphql/queries/supplier";
import PropTypes from "prop-types";
import { SUPPLIEREVENTSUBSCRIPTION } from "../../graphql/subscriptions/supplier";
import { UPDATESUPPLIERSTATUS } from "../../graphql/mutations/supplier";
import { cloneDeep } from "lodash";
import i18n from "meteor/universe:i18n";

@graphql(GETSUPPLIERS, {
    props: ({ data }) => {
        const {
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
@graphql(UPDATESUPPLIERSTATUS, {
    name: "updateSupplierStatus"
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

            const supplierIds = newProps.suppliers.map(({ _id }) => _id);

            this.unsubscribe = newProps.subscribeToMore({
                document: SUPPLIEREVENTSUBSCRIPTION,
                variables: { supplierIds },
                updateQuery: (previousResult, { subscriptionData }) => {
                    const { data } = subscriptionData;
                    const { supplierEvent } = data;
                    const { SupplierCreated } = supplierEvent;

                    if (SupplierCreated) {
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
            suppliers,
            total,
            client,
            current,
            pageSize,
            changeItemsPage,
            editSupplierForm,
            updateSupplierStatus
        } = this.props;

        const columns = [
            {
                title: i18n.__("supplier-name"),
                key: "name",
                dataIndex: "name",
                width: "20%",
                render: (name, supplier) =>
                    supplier.entityStatus === ENTITYSTATUS.ACTIVE
                        ? <a
                              onClick={() => {
                                  const { _id } = supplier;
                                  editSupplierForm({ client, _id });
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
                title: i18n.__("supplier-address"),
                key: "address",
                dataIndex: "address",
                width: "30%",
                render: address =>
                    <strong>
                        {address}
                    </strong>
            },
            {
                title: i18n.__("supplier-phoneNumber"),
                key: "phoneNumber",
                dataIndex: "phoneNumber",
                width: "20%",
                render: phoneNumber =>
                    <strong>
                        {phoneNumber}
                    </strong>
            },
            {
                title: i18n.__("supplier-cellphoneNumber"),
                key: "cellphoneNumber",
                dataIndex: "cellphoneNumber",
                width: "20%",
                render: phoneNumber =>
                    <strong>
                        {phoneNumber}
                    </strong>
            },
            {
                title: i18n.__("entityStatus"),
                key: "entityStatus",
                dataIndex: "entityStatus",
                width: "10%",
                render: (entityStatus, supplier) =>
                    <Switch
                        className={
                            "supplier-entityStatus-" +
                            (entityStatus === ENTITYSTATUS.ACTIVE
                                ? "active"
                                : "inactive")
                        }
                        checked={entityStatus === ENTITYSTATUS.ACTIVE}
                        onChange={() => {
                            const { _id } = supplier;
                            updateSupplierStatus({
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
            dataSource: suppliers,
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

SupplierList.propTypes = {
    current: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired
};

export default SupplierList;
