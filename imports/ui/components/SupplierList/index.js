import "./index.scss";

import { Button, Col, Row, Switch, Table } from "antd";
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
                title: (
                    <strong>
                        {i18n.__("supplier-name")}
                    </strong>
                ),
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
                title: (
                    <strong>
                        {i18n.__("supplier-address")}
                    </strong>
                ),
                key: "address",
                dataIndex: "address",
                width: "20%",
                render: address =>
                    <span>
                        {address}
                    </span>
            },
            {
                title: (
                    <strong>
                        {i18n.__("supplier-phoneNumber")}
                    </strong>
                ),
                key: "phoneNumber",
                dataIndex: "phoneNumber",
                width: "20%",
                render: phoneNumber =>
                    <span>
                        {phoneNumber}
                    </span>
            },
            {
                title: (
                    <strong>
                        {i18n.__("supplier-cellphoneNumber")}
                    </strong>
                ),
                key: "cellphoneNumber",
                dataIndex: "cellphoneNumber",
                width: "20%",
                render: phoneNumber =>
                    <span>
                        {phoneNumber}
                    </span>
            },
            {
                title: (
                    <strong>
                        {i18n.__("entityStatus")}
                    </strong>
                ),
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
                title: (
                    <strong>
                        {i18n.__("action")}
                    </strong>
                ),
                key: "action",
                dataIndex: "entityStatus",
                width: "10%",
                render: (entityStatus, supplier) =>
                    <Button
                        style={{ width: "100%" }}
                        onClick={() => {
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
                    >
                        {entityStatus === ENTITYSTATUS.ACTIVE
                            ? i18n.__("deactivate")
                            : i18n.__("activate")}
                    </Button>
            }
        ];

        const tableProps = {
            error,
            columns,
            loading,
            dataSource: suppliers,
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

SupplierList.propTypes = {
    current: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired
};

export default SupplierList;
