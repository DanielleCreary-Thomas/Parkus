import {Card, CardContent, CardMedia, Stack, Typography} from "@mui/material";


export default function PaidMemberCard({memberData, permitData}){

    const PermitCard = ()=>{
        return (
            <Card sx={{ maxWidth: 345, minWidth:600 }}>
                <CardMedia
                    component="img"
                    height="140"
                    src = {permitData}
                    alt="Permit Image"
                    title="eTransfer Proof"
                />

                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Group Permit
                    </Typography>
                </CardContent>
            </Card>
            )
    }

    const MemberCard = ()=>
    {
        console.log("memberData:", memberData)//data for a single member

        return (
            <Card sx={{ maxWidth: 345, minWidth:600 }}>
                <CardMedia
                    component="img"
                    height="140"
                    src = {memberData['image_proof_url']}
                    alt="eTransfer Image"
                    title="eTransfer Proof"
                >
                    {/*<Image src={memberData.imageUrl} alt={"eTransfer Image"}/>*/}
                </CardMedia>

                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {memberData['first_name'] + " " + memberData['last_name']}
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {memberData['license_plate_number']}<br/>
                            {memberData['email']}<br/>

                        </Typography>
                        <Stack>
                            <Typography gutterBottom variant="h5" component="div">
                                Car Info
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {memberData['car']['license_plate_number']}<br/>
                                {memberData['car']['province']}<br/>
                                {memberData['car']['year']}<br/>
                                {memberData['car']['make']}<br/>
                                {memberData['car']['model']}<br/>
                                {memberData['car']['color']}<br/>
                            </Typography>
                        </Stack>

                    </Stack>
                </CardContent>
            </Card>
        );
    }

    return(
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
            <PermitCard></PermitCard>
            <MemberCard></MemberCard>
        </Stack>
    )
}