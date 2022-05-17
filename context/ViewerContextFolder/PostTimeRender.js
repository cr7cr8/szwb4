

import Countdown from "react-countdown";
import { ThemeProvider, useTheme, createTheme } from '@mui/material/styles';
import { Container, Grid, Paper, IconButton, ButtonGroup, Stack, Button, Switch, Box, Hidden, Collapse, Typography, Divider } from '@mui/material';


export default function PostTimeRender({ days, hours, minutes, seconds, completed, ...props }) {

    const theme = useTheme()



    const message = completed

        ? days > 0
            ? `${days}d`
            : hours > 0
                ? `${hours}h`
                : minutes > 0
                    ? `${minutes}m`
                    : `0m`//`${seconds}s`//`Just now` //`${seconds} sec ago`
        : days > 0
            ? `Remaining ${days}+ days`
            : hours > 0
                ? `Remaining ${hours}+ hours`
                : minutes > 0
                    ? `Remaining ${minutes}+ minutes`
                    : `Remaining ${seconds} seconds`

    return <Typography className="count-down" style={{ fontSize: "1rem" }} sx={{ color: theme.palette.text.secondary }}>{message} </Typography>

}