import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import MatchmakingTitle from "../components/SpotSharing/Matchmaking/MatchmakingTitle/MatchmakingTitle";
import MatchmakingGroups from "../components/SpotSharing/Matchmaking/MatchmakingGroup/MatchmakingGroups";
import MatchmakingButton from "../components/SpotSharing/Matchmaking/MatchmakingButton/MatchmakingButton";
import { useNavigate } from "react-router-dom";
import { getCurrUser, matchmake } from "../services/requests";

function SpotSharing() {
    const navigate = useNavigate();
    const [data, setData] = useState(null);

    async function handleMatchmakeClick() {
        const currUser = await getCurrUser();
        if (currUser) {
            const matchData = await matchmake(currUser);
            setData(matchData.availableGroups);
        }
    }

    function handleGroupClick(id) {
        navigate(`/group-schedule/${id}`);
    }

    let content;

    if (data) {
        if (data.length > 0) {
            content = (
                <Stack>
                    <MatchmakingTitle />
                    <MatchmakingButton handleMatchmakeClick={handleMatchmakeClick} />
                    <MatchmakingGroups data={data} handleGroupClick={handleGroupClick} />
                </Stack>
            );
        } else {
            content = (
                <Stack>
                    <MatchmakingTitle />
                    <MatchmakingButton handleMatchmakeClick={handleMatchmakeClick} />
                    <Typography variant={"h3"} fontFamily={"Orelega One"}>
                        You are already in a group!
                    </Typography>
                </Stack>
            );
        }
    } else {
        content = (
            <Stack>
                <MatchmakingTitle />
                <MatchmakingButton handleMatchmakeClick={handleMatchmakeClick} />
            </Stack>
        );
    }

    return content;
}

export default SpotSharing;
