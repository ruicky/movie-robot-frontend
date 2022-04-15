import React from "react";
import styled from "styled-components/macro";

import {Avatar, Badge, Grid, Typography} from "@mui/material";

import useAuth from "../../hooks/useAuth";

const Footer = styled.div`
  background-color: ${(props) =>
    props.theme.sidebar.footer.background} !important;
  padding: ${(props) => props.theme.spacing(2.75)}
    ${(props) => props.theme.spacing(4)};
  border-right: 1px solid rgba(0, 0, 0, 0.12);
`;

const FooterText = styled(Typography)`
  color: ${(props) => props.theme.sidebar.footer.color};
`;

const FooterSubText = styled(Typography)`
  color: ${(props) => props.theme.sidebar.footer.color};
  font-size: 0.7rem;
  display: block;
  padding: 1px;
`;

const FooterBadge = styled(Badge)`
  margin-right: ${(props) => props.theme.spacing(1)};
  span {
    background-color: ${(props) =>
    props.theme.sidebar.footer.online.background};
    border: 1.5px solid ${(props) => props.theme.palette.common.white};
    height: 12px;
    width: 12px;
    border-radius: 50%;
  }
`;

const SidebarFooter = ({...rest}) => {
    const {user} = useAuth();
    return (
        <Footer {...rest}>
            <Grid container spacing={2}>
                <Grid item>
                    <FooterBadge
                        overlap="circular"
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                        variant="dot"
                    >
                        {!!user && <Avatar alt={user.nickname}
                                           src={user.avatar}>{user.nickname && user.nickname.substring(0, 1)}</Avatar>}
                    </FooterBadge>
                </Grid>
                <Grid item>
                    {!!user && (
                        <FooterText variant="body2">{user.nickname}</FooterText>
                    )}
                    {/* Demo data */}
                    {!user && <FooterText variant="body2">{user.nickname}</FooterText>}
                    <FooterSubText variant="caption">{user.role_name}</FooterSubText>
                </Grid>
            </Grid>
        </Footer>
    );
};

export default SidebarFooter;
