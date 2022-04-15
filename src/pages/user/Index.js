import React, {useEffect, useState} from "react";
import {Helmet} from "react-helmet-async";
import {Grid,} from "@mui/material";
import UserTable from "@/pages/user/Table";
import {getUserList} from "@/api/UserApi";


function UserManager() {
    const [userList, setUserList] = useState([])
    useEffect(async () => {
        const userList = await getUserList()
        console.log(userList)
        setUserList(userList)
    }, [])
    return (<React.Fragment>
        <Helmet title="用户管理"/>
        <Grid container spacing={6}>
            <Grid item xs={12} lg={12}>
                <UserTable data={userList}/>
            </Grid>
        </Grid>
    </React.Fragment>);
}

export default UserManager;
