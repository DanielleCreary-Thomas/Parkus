import MatchmakingTitle from "../components/SpotSharing/Matchmaking/MatchmakingTitle/MatchmakingTitle";
import {Stack} from "@mui/material";
import MatchmakingGroups from "../components/SpotSharing/Matchmaking/MatchmakingGroup/MatchmakingGroups";
import MatchmakingButton from "../components/SpotSharing/Matchmaking/MatchmakingButton/MatchmakingButton";
import matchmake from "../services/requests"

function handleMatchmakeClick(){
    matchmake(5)
}

function SpotSharing() {
    return (
        <Stack>
            <MatchmakingTitle></MatchmakingTitle>
            <MatchmakingButton handleMatchmakeClick={handleMatchmakeClick}/>
            <MatchmakingGroups></MatchmakingGroups>
        </Stack>
    )
}

export default SpotSharing;