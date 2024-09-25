import {Box, Button, Card, CardActions, CardContent, CardHeader, Typography} from "@mui/material";

export default function MatchmakingTitle(){


    return(
        <Box
            className={"matchmakingTitle"}
            bgcolor={"#FFFFFF"}
            maxWidth={"75rem"}

            sx={{
                border:"3px solid black",
                borderRadius:7,
                alignItems: "center",
                display:"flex",
                justifyContent:"center",
                margin: "2rem",

            }}
        >
            <Typography variant={"h2"} fontFamily={"Orelega One"}>SpotSharing Generation</Typography>
        </Box>
    )
}
