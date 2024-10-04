// MatchmakingGroups.jsx

import React from 'react';
import { Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, Chip, Stack } from "@mui/material";

export default function MatchmakingGroups({ data, handleGroupClick }) {
    const GroupCard = ({ groupData }) => {
        const MembersList = () => {
            if (groupData.members.length === 0) { return null; }
            return groupData.members.map(member => (
                <Chip
                    avatar={<Avatar sx={{ bgcolor: "#A7C957" }}>{member.name[0]}</Avatar>}
                    label={member.name}
                    key={member.user_id}
                    sx={{ width: "50", marginLeft: "10px" }}
                />
            ));
        };

        return (
            <Card
                sx={{
                    borderRadius: "20px",
                    backgroundColor: "#C0D7D8",
                    margin: "2rem"
                }}
                key={groupData.group_id}
            >
                <CardHeader
                    title={"Group #: " + groupData.group_id}
                    titleTypographyProps={{ variant: 'h3', fontFamily: "Orelega One" }}
                />
                <CardContent>
                    <MembersList />
                </CardContent>
                <CardActions>
                    <Button
                        sx={{
                            fontFamily: "Orelega One",
                            fontSize: "20px",
                            height: "30px",
                            backgroundColor: "#1D3557",
                            color: "#FFFFFF",
                            borderRadius: "20px"
                        }}
                        onClick={() => handleGroupClick(groupData.group_id)}
                    >
                        View
                    </Button>
                </CardActions>
            </Card>
        );
    };

    const GroupsList = () => {
        if (!data) { return null; }
        return data.map(group => (
            <Box key={group.group_id}>
                <GroupCard groupData={group} />
            </Box>
        ));
    };

    return (
        <Stack>
            <GroupsList />
        </Stack>
    );
}
