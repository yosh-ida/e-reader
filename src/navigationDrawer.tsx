import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import { SwipeableDrawer } from '@material-ui/core';
import { Link as MuiLink } from '@material-ui/core'

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        hide: {
            display: 'none',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
            justifyContent: 'flex-end',
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: -drawerWidth,
        },
        contentShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        },
    }),
);

const NavigationPage = {
    SHELF: 'SHELF',
    SETTINGS: 'SETTINGS',
    VIEWER: 'VIEWER',
} as const;

interface NavigationProps {
    nav: NavigationPages
    anchor: "bottom" | "left" | "right" | "top"
}

export type NavigationPages = typeof NavigationPage[keyof typeof NavigationPage];

export function NavigationDrawer(props: NavigationProps) {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        {props.nav}
                    </Typography>
                </Toolbar>
            </AppBar>
            <SwipeableDrawer
                className={classes.drawer}
                onClose={handleDrawerClose}
                onOpen={handleDrawerOpen}
                anchor={props.anchor}
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <MuiLink href={(process.env.NODE_ENV === 'production' ? "" : "/e-reader") + "/"}>
                        <ListItem button key={NavigationPage.SHELF} onClick={() => { }} disabled={props.nav === NavigationPage.SHELF}>
                            <ListItemIcon>{<InboxIcon />}</ListItemIcon>
                            <ListItemText primary={NavigationPage.SHELF} />
                        </ListItem>
                    </ MuiLink>
                    <MuiLink href={(process.env.NODE_ENV === 'production' ? "" : "/e-reader") + "/select"}>
                        <ListItem button key={NavigationPage.VIEWER} onClick={() => { }} disabled={props.nav === NavigationPage.VIEWER}>
                            <ListItemIcon>{<InboxIcon />}</ListItemIcon>
                            <ListItemText primary={NavigationPage.VIEWER} />
                        </ListItem>
                    </MuiLink>
                </List>
                <Divider />
                <List>
                    <MuiLink href={(process.env.NODE_ENV === 'production' ? "" : "/e-reader") + "/settings"} >
                        <ListItem button key={NavigationPage.SETTINGS} onClick={() => { }} disabled={props.nav === NavigationPage.SETTINGS}>
                            <ListItemIcon>{<InboxIcon />}</ListItemIcon>
                            <ListItemText primary={NavigationPage.SETTINGS} />
                        </ListItem>
                    </ MuiLink>
                </List>
            </SwipeableDrawer>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
                onClick={handleDrawerClose}
            >
                <div className={classes.drawerHeader} />
            </main>
        </div>
    );
}