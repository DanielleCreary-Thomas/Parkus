import {Button} from "@mui/material";

export default function MatchmakingButton({handleMatchmakeClick}) {
    return(
        <Button
            sx={{
                fontFamily: "Orelega One",
                // fontWeight:"Bold",
                fontSize:"50px",
                height:"50px",
                backgroundColor: "#1D3557",
                color: "#FFFFFF",
                borderRadius:"20px"
            }}
            onClick={handleMatchmakeClick}>
        Matchmake!</Button>
    )
}

