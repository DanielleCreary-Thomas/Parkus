import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Chip,
    Stack,
    Typography
} from "@mui/material";

export default function UnpaidMemberCard() {
    return (
        <Stack
            spacing={2}
            sx={{
                justifyContent: "center",
                alignItems: 'center',
                display: 'flex',
                maxWidth: '400px',
                margin: '20px auto',
                minWidth: '400px'
            }}>
            <h1>
                Uh Oh!
            </h1>
            <h3 variant="body2" sx={{color: 'text.secondary'}}>
                You either aren't a member of a group or you have not paid your group leader!<br/><br/>
                Head to the Spotsharing tab to find a group<br/><br/>
                <em><strong>OR</strong></em><br/><br/>
                Head to the Payment tab to pay your Leader<br/>
            </h3>
        </Stack>
    )
}