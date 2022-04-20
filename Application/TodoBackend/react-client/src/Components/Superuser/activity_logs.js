import { Collapse, Container, ListItemButton } from "@mui/material";
import { Box } from "@mui/system";
import { useCallback, useEffect, useState } from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import {
    Add,
    Check,
    Clear,
    Error,
    ExpandCircleDown,
    Info,
    RemoveCircle,
} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import { getSystemLogs } from "../../APIs/Superuser/network.api";

const getIcon = (icon) => {
    switch (icon.trim()) {
        case "add":
            return ["primary", <Add />];
        case "removecircle":
            return ["primary", <RemoveCircle />];
        case "clear":
            return ["primary", <Clear />];
        case "success":
            return ["success", <Check />];
        case "info":
            return ["info", <Info />];
        case "error":
            return ["error", <Error />];
        default:
            return [null, null];
    }
};

const SetIcon = ({ icon }) => {
    const [color, ele] = getIcon(icon);
    return (
        <TimelineDot color={color} variant="outlined">
            {ele}
        </TimelineDot>
    );
};
export default function ActivityLogs({ nav, setNav, network }) {
    useEffect(() => {
        setNav({ ...nav, logs: "Activity Log" });
    }, [network.Name || undefined]);

    const [logs, setLogs] = useState(false);
    const [collapse, setCollapse] = useState({});
    const handleCollapse = (index) => {
        const current = collapse[index];
        setCollapse({ ...collapse, [index]: !current });
    };
    const getLogByDate = (date) =>
        logs?.filter(
            (ele) =>
                new Date(ele.createdAt).getDate() === new Date(date).getDate()
        ) || [];
    const formatAMPM = (date) => {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        hours = hours < 10 ? "0" + hours : hours;
        return hours + ":" + minutes + " " + ampm;
    };
    const getLogs = useCallback(async () => {
        const res = (await getSystemLogs())?.data;
        if (res) {
            let date = "0";
            const statesCollapse = {};
            res.forEach((ele) => {
                const newDate = new Date(ele.createdAt).getDate();
                if (newDate !== date) {
                    statesCollapse[ele.createdAt] = false;
                    date = newDate;
                }
            });
            setLogs(res);
            setCollapse(statesCollapse);
            console.log(statesCollapse);
            console.log(res);
        }
    }, []);
    useEffect(() => {
        getLogs();
    }, [getLogs]);
    return (
        <Box
            sx={{
                width: "100%",
                mb: 2,
                pb: 2.5,
                borderRadius: "12px",
                bgcolor: "primary.sectionContainer",
                boxShadow:
                    "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)",
            }}
        >
            {Object.keys(collapse).map((key, i) => (
                <div key={key}>
                    <ListItemButton
                        component="div"
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            p: 2,
                            borderRadius: `${i === 0 ? "12px 12px 0 0" : null}`,
                        }}
                        onClick={() => handleCollapse(key)}
                    >
                        <Typography component="small">
                            <b>
                                {new Date(key).toLocaleString("default", {
                                    month: "long",
                                })}{" "}
                                {new Date(key).getDate()},{" "}
                                {new Date(key).getFullYear()}
                            </b>
                        </Typography>
                        <ExpandCircleDown
                            sx={{
                                transform: `rotate(${
                                    collapse[key] ? 180 : 0
                                }deg)`,
                                transition: "ease-in 0.2s",
                            }}
                        />
                    </ListItemButton>
                    <Collapse in={collapse[key]} timeout="auto">
                        <Timeline align="left">
                            {getLogByDate(key).map((ele) => (
                                <TimelineItem key={ele._id}>
                                    <TimelineOppositeContent
                                        sx={{
                                            m: "auto 0",
                                            flex: "0.1",
                                            minWidth: "fit-content",
                                            paddingLeft: 0,
                                            paddingRight: 1,
                                        }}
                                        align="right"
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {formatAMPM(new Date(ele.createdAt))}
                                    </TimelineOppositeContent>
                                    <TimelineSeparator>
                                        <TimelineConnector />
                                        <SetIcon icon={ele.Icon} />
                                        <TimelineConnector />
                                    </TimelineSeparator>
                                    <TimelineContent sx={{ py: "12px", px: 2 }}>
                                        <Typography component="span">
                                            <b>{ele.Title}</b>
                                        </Typography>
                                        <Typography
                                            sx={{ color: "text.secondary" }}
                                        >
                                            {ele.Subtitle}
                                        </Typography>
                                    </TimelineContent>
                                </TimelineItem>
                            ))}
                        </Timeline>
                    </Collapse>
                </div>
            ))}
        </Box>
    );
}
