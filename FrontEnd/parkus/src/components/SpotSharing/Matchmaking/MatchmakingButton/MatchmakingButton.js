import {Button} from "@mui/material";

export default function MatchmakingButton({handleMatchmakeClick}) {
    return(
        <Button
            sx={{
                fontFamily: "Orelega One",
                // fontWeight:"Bold",
                fontSize:"50px",
                height:"60px",
                backgroundColor: "#1D3557",
                color: "#FFFFFF",
                borderRadius:"20px",
                alignItems: "center",
                display:"flex",
                justifyContent:"center",
                margin: "2rem"
            }}
            onClick={handleMatchmakeClick}>
        Matchmake!</Button>
    )
}

