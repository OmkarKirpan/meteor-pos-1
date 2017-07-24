import React, { Component } from "react";
import { Switch, Table } from "antd";
import { compose, withApollo } from "react-apollo";

import NumberFormat from "react-number-format";
import PropTypes from "prop-types";
import { RECORDSTATUS } from "../../constants";

@compose(withApollo)
class SupplierList extends Component {
    render() {
        const {
            client,
            loading,
            error,
            suppliers,
            current,
            pageSize,
            total,
            changeSuppliersPage,
            deleteSupplier,
            editSupplierForm
        } = this.props;

        const columns = [
            {
                title: i18n.__("supplier-name"),
                key: "name",
                dataIndex: "name",
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
                render: address =>
                    <span>
                        {address}
                    </span>
            },
            {
                title: i18n.__("supplier-phone-number"),
                key: "phoneNumber",
                dataIndex: "phoneNumber",
                render: phoneNumber =>
                    <span>
                        <NumberFormat
                            displayType="text"
                            format="#### #### #### #### ####"
                            value={phoneNumber}
                        />
                    </span>
            },
            {
                title: i18n.__("status"),
                key: "status",
                dataIndex: "status",
                width: "10%",
                render: (status, supplier) =>
                    <Switch
                        className={
                            "supplier-status-" +
                            (status === RECORDSTATUS.ACTIVE
                                ? "active"
                                : "inactive")
                        }
                        checked={status === RECORDSTATUS.ACTIVE}
                        onChange={() => {
                            const { _id } = supplier;
                            deleteSupplier({
                                client,
                                _id,
                                newStatus:
                                    status === RECORDSTATUS.ACTIVE
                                        ? RECORDSTATUS.INACTIVE
                                        : RECORDSTATUS.ACTIVE
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
            size: "small",
            pagination: {
                current,
                total,
                pageSize,
                onChange: page => {
                    changeSuppliersPage({ client, current: page });
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
    loading: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
    suppliers: PropTypes.array.isRequired,
    current: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    changeSuppliersPage: PropTypes.func.isRequired,
    editSupplierForm: PropTypes.func.isRequired
};

export default SupplierList;
