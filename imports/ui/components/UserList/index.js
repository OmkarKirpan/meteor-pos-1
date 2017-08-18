import { Button, Col, Row, Switch, Table } from "antd";
import React, { Component } from "react";
import { compose, gql, graphql, withApollo } from "react-apollo";

import { GETUSERS } from "../../graphql/queries/user";
import PropTypes from "prop-types";
import i18n from "meteor/universe:i18n";
import moment from "moment";

@graphql(GETUSERS, {
    props: ({ data }) => {
        const { users, userCount, loading, error, refetch } = data;
        return {
            users,
            total: userCount,
            loading,
            error,
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
class UserList extends Component {
    render() {
        const {
            loading,
            error,
            users,
            total,
            current,
            pageSize,
            changeUsersPage
        } = this.props;

        const columns = [
            {
                title: (
                    <strong>
                        {i18n.__("user-username")}
                    </strong>
                ),
                key: "username",
                dataIndex: "username",
                width: "60%",
                render: name =>
                    <strong>
                        {name}
                    </strong>
            },
            {
                title: (
                    <strong>
                        {i18n.__("user-createdAt")}
                    </strong>
                ),
                key: "createdAt",
                dataIndex: "createdAt",
                width: "60%",
                render: createdAt =>
                    <span>
                        {moment(createdAt).format("DD-MM-YYYY")}
                    </span>
            }
        ];

        const tableProps = {
            error,
            columns,
            loading,
            dataSource: users,
            rowKey: "username",
            size: "middle",
            pagination: {
                current,
                total,
                pageSize,
                onChange: page => {
                    changeUsersPage({ client, current: page });
                }
            },
            locale: {
                emptyText: i18n.__("no-data")
            }
        };

        return <Table {...tableProps} />;
    }
}

UserList.propTypes = {
    current: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired
};

export default UserList;
