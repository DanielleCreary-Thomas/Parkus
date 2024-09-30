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
        <Stack>
            <Typography variant="h5" component="div">
                Uh Oh!
            </Typography>
            <Typography variant="body2" sx={{color: 'text.secondary'}}>
                You either aren't a member of a group or you have not paid your group leader<br/>
                Head to the Spotsharing tab to find a group<br/>
                OR<br/>
                Head to the Payment tab to pay your Leader<br/>
            </Typography>
        </Stack>
    )
}