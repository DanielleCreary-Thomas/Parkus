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

class car {
    licensePlateNumber:number
    province:string
    year:string
    make:string
    model:string
    color:string
}

class member {
    id: number
    firstName:string
    lastName:string
    licensePlateNumber:string
    email:string
    imageUrl: string
    car : car
}

export default function LeaderCard({data}) {
    console.log("leader card data", data)//a group id

    // async function getMembers(){
    //
    // }

    const MembersList = () => {
        if (!data){
            return
        }
        return data.map(member => (
            <Box key={member.id}>
                <MemberCard memberData={member}></MemberCard>
            </Box>

        ))
    }

    const MemberCard = ({memberData})=>
    {
        console.log("memberData:", memberData)//data for a single member
        return (
            <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                    sx={{ height: 140 }}
                    src={memberData.imageUrl}
                    title="eTransfer Proof"
                />

                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {memberData.firstName + " " + memberData.lastName}
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {memberData.licensePlateNumber}<br/>
                                {memberData.email}<br/>

                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {memberData.car.licensePlateNumber}<br/>
                                {memberData.car.province}<br/>
                                {memberData.car.year}<br/>
                                {memberData.car.make}<br/>
                                {memberData.car.model}<br/>
                                {memberData.car.color}<br/>
                            </Typography>
                        </Stack>
                    </CardContent>



            </Card>

        );
    }

    return(
        <Stack>
            <MembersList></MembersList>
        </Stack>
    )
}