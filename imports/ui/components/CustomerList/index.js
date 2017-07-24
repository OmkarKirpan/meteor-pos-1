import React, { Component } from "react";
import { Switch, Table } from "antd";
import { compose, withApollo } from "react-apollo";

import NumberFormat from "react-number-format";
import PropTypes from "prop-types";
import { RECORDSTATUS } from "../../constants";
import i18n from "meteor/universe:i18n";

@compose(withApollo)
class CustomerList extends Component {
    render() {
        const {
            client,
            loading,
            error,
            customers,
            current,
            pageSize,
            total,
            changeCustomersPage,
            deleteCustomer,
            editCustomerForm
        } = this.props;

        const columns = [
            {
                title: i18n.__("customer-name"),
                key: "name",
                dataIndex: "name",
                render: (name, customer) =>
                    <a
                        onClick={() => {
                            const { _id } = customer;
                            editCustomerForm({ client, _id });
                        }}
                    >
                        <strong>
                            {name}
                        </strong>
                    </a>
            },
            {
                title: i18n.__("customer-address"),
                key: "address",
                dataIndex: "address",
                render: address =>
                    <span>
                        {address}
                    </span>
            },
            {
                title: i18n.__("customer-phone-number"),
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
                render: (status, customer) =>
                    <Switch
                        className={
                            "customer-status-" +
                            (status === RECORDSTATUS.ACTIVE
                                ? "active"
                                : "inactive")
                        }
                        checked={status === RECORDSTATUS.ACTIVE}
                        onChange={() => {
                            const { _id } = customer;
                            deleteCustomer({
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
            dataSource: customers,
            size: "small",
            pagination: {
                current,
                total,
                pageSize,
                onChange: page => {
                    changeCustomersPage({ client, current: page });
                }
            },
            locale: {
                emptyText: i18n.__("no-data")
            }
        };

        return <Table {...tableProps} />;
    }
}

CustomerList.propTypes = {
    loading: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
    customers: PropTypes.array.isRequired,
    current: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    changeCustomersPage: PropTypes.func.isRequired,
    editCustomerForm: PropTypes.func.isRequired
};

export default CustomerList;
