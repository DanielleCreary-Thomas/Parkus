import {Box, Button, Card, CardActions, CardContent, CardHeader, Typography} from "@mui/material";

export default function PaymentTitle(){


    return(
        <Box
            className={"paymentTitle"}
            bgcolor={"#FFFFFF"}
            maxWidth={"75rem"}

            sx={{
                minWidth: "300px",
                border:"3px solid black",
                borderRadius:7,
                alignItems: "center",
                display:"flex",
                justifyContent:"center",
                margin: "2rem"

            }}
        >
            <Typography variant={"h2"} fontFamily={"Orelega One"}>Payment</Typography>
        </Box>
    )
}
