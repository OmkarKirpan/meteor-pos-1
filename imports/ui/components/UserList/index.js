import React, { Component } from "react";

import { GETUSERS } from "../../graphql/queries/user";
import PropTypes from "prop-types";
import { Table } from "antd";
import { graphql } from "react-apollo";
import i18n from "meteor/universe:i18n";
import moment from "moment";

@graphql(GETUSERS, {
    props: ({ data }) => {
        const { users, userCount, loading, refetch } = data;
        return {
            users,
            total: userCount,
            loading,
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
    loading: PropTypes.bool,
    users: PropTypes.array,
    total: PropTypes.number,
    current: PropTypes.number,
    pageSize: PropTypes.number,
    changeUsersPage: PropTypes.func
};

export default UserList;
