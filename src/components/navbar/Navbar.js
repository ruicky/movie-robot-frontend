import * as React from "react";
import {useEffect, useState} from "react";
import styled, {withTheme} from "styled-components/macro";
import {AppBar as MuiAppBar, Grid, IconButton as MuiIconButton, InputBase, Toolbar,} from "@mui/material";
import {darken} from "polished";
import {Search as SearchIcon} from "react-feather";

import {Menu as MenuIcon} from "@mui/icons-material";

import NavbarUserDropdown from "./NavbarUserDropdown";
import NavbarNotificationsDropdown from "@/components/navbar/NavbarNotificationsDropdown";
import {useNavigate} from "react-router-dom";
import {useUrlQueryParam} from "@/hooks/useUrlQueryParam";

const AppBar = styled(MuiAppBar)`
  background: ${(props) => props.theme.header.background};
  color: ${(props) => props.theme.header.color};
`;

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

const Search = styled.div`
  border-radius: 2px;
  background-color: ${(props) => props.theme.header.background};
  display: none;
  position: relative;
  width: 100%;
  display: block;
  &:hover {
    background-color: ${(props) => darken(0.05, props.theme.header.background)};
  }
`;
const SearchIconWrapper = styled.div`
  width: 50px;
  height: 100%;
  position: absolute;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 22px;
    height: 22px;
  }
`;
const Input = styled(InputBase)`
  color: inherit;
  width: 100%;

  > input {
    color: ${(props) => props.theme.header.search.color};
    padding-top: ${(props) => props.theme.spacing(2.5)};
    padding-right: ${(props) => props.theme.spacing(2.5)};
    padding-bottom: ${(props) => props.theme.spacing(2.5)};
    padding-left: ${(props) => props.theme.spacing(12)};
    width: 160px;
  }
`;

const Navbar = ({onDrawerToggle}) => {
    const [param, setParam] = useUrlQueryParam(["keyword"]);
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState(param.keyword)
    useEffect(() => {
        setKeyword(param.keyword)
    }, [param])
    return (
        <React.Fragment>
            <AppBar position="sticky" elevation={0}>
                <Toolbar>
                    <Grid container alignItems="center">
                        <Grid item sx={{display: {xs: "block", md: "none"}}}>
                            <IconButton
                                color="inherit"
                                aria-label="Open drawer"
                                onClick={onDrawerToggle}
                                size="large"
                            >
                                <MenuIcon/>
                            </IconButton>
                        </Grid>
                        <Grid item xs>
                            <Search>
                                <SearchIconWrapper>
                                    <SearchIcon/>
                                </SearchIconWrapper>
                                <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="搜索进行订阅"
                                       onKeyUp={(e) => {
                                           if ((e.key === 'Enter' || e.key === "NumpadEnter") && keyword) {
                                               navigate("/subscribe/search?keyword=" + keyword)
                                           }
                                       }}/>
                            </Search>
                        </Grid>
                        {/*<Grid item xs />*/}
                        <Grid item>
                            <NavbarNotificationsDropdown/>
                            <NavbarUserDropdown/>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
};

export default withTheme(Navbar);
