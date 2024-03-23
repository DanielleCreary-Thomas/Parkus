import MatchmakingTitle from "../components/SpotSharing/Matchmaking/MatchmakingTitle/MatchmakingTitle";
import {Stack} from "@mui/material";
import MatchmakingGroups from "../components/SpotSharing/Matchmaking/MatchmakingGroup/MatchmakingGroups";

function SpotSharing() {
    return (
        <Stack>
            <MatchmakingTitle></MatchmakingTitle>
            <MatchmakingGroups></MatchmakingGroups>
        </Stack>
    )
}

export default SpotSharing;