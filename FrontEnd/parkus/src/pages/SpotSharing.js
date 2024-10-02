import MatchmakingTitle from "../components/SpotSharing/Matchmaking/MatchmakingTitle/MatchmakingTitle";
import {Stack, Typography} from "@mui/material";
import MatchmakingGroups from "../components/SpotSharing/Matchmaking/MatchmakingGroup/MatchmakingGroups";
import MatchmakingButton from "../components/SpotSharing/Matchmaking/MatchmakingButton/MatchmakingButton";
import {getCurrUser, matchmake} from "../services/requests"
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";


function SpotSharing() {
    let content;
    const navigate = useNavigate();

    const[data, setData] = useState(false);


    async function handleMatchmakeClick() {
        const currUser = await getCurrUser();
        setData( await matchmake(currUser).then(data => data.availableGroups))
        console.log(data)
    }

    function handleGroupClick(id){
        navigate(`/groups/${id}`);
    }


    if(data !== false){
        if (data && data.length > 0){
            content = (
                <Stack>
                    <MatchmakingTitle></MatchmakingTitle>
                    <MatchmakingButton handleMatchmakeClick={handleMatchmakeClick}/>
                    <MatchmakingGroups data={data} handleGroupClick={handleGroupClick}></MatchmakingGroups>
                </Stack>
            )
        }
        else{
            content = (
                <Stack>
                    <MatchmakingTitle></MatchmakingTitle>
                    <MatchmakingButton handleMatchmakeClick={handleMatchmakeClick}/>
                    <Typography variant={"h3"} fontFamily={"Orelega One"}>
                        You are already in a group!</Typography>
                </Stack>
            )
        }

    }
    else {
        content = (
            <Stack>
                <MatchmakingTitle></MatchmakingTitle>
                <MatchmakingButton handleMatchmakeClick={handleMatchmakeClick}/>

            </Stack>
        )
    }

    return content

}

export default SpotSharing;