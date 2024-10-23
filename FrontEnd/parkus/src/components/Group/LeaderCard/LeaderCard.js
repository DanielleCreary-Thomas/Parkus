import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Chip, Divider,
    Stack,
    Typography
} from "@mui/material";
import {Person} from '@mui/icons-material';

import React from "react";
import {getCurrUser} from "../../../services/requests";

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

export default function LeaderCard({data, permitData, currUserID}) {
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
            <Card sx={{ maxWidth: 345, minWidth:600 }}>
                {memberData['image_proof_url'] == null ? (
                    <CardMedia
                        component="img"
                        height="140"
                        src = "https://rtneojaduhodjxqmymlq.supabase.co/storage/v1/object/public/payment_proof/UnpaidDefault.webp"
                        alt="default unpaid eTransfer Image"
                        title="Unpaid eTransfer"
                    >
                        {/*<Image src={memberData.imageUrl} alt={"eTransfer Image"}/>*/}
                    </CardMedia>
                ) : (
                    <CardMedia
                        component="img"
                        height="140"
                        src = {memberData['image_proof_url']}
                        alt="eTransfer Image"
                        title="eTransfer Proof"
                    >
                        {/*<Image src={memberData.imageUrl} alt={"eTransfer Image"}/>*/}
                    </CardMedia>
                )}


                <CardContent>
                    <Stack direction="row"
                       spacing={2}
                       sx={{
                        justifyContent: "space-between",
                        alignItems: "center",

                    }}>
                        <Typography gutterBottom variant="h5" component="div">
                            {memberData['first_name'] + " " + memberData['last_name']}
                        </Typography>
                    </Stack>
                    {currUserID === memberData['userid'] ? (
                        <Divider textAlign="right">
                            <Chip color="info" icon={<Person/>} label="Leader" size="small"/>
                        </Divider>
                    ) : (
                        <Divider></Divider>
                    )}
                    <br/>
                    <Stack direction="row" spacing={6}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Plate Number: <br/>{memberData['license_plate_number']}<br/><br/>
                            Email: <br/>{memberData['email']}<br/>

                        </Typography>
                        <Divider orientation="vertical" flexItem />
                        <Stack>
                            <Typography gutterBottom variant="h5" component="div"
                                sx={{backgroundColor: "#e6eff5",
                                padding:0.5,
                                borderRadius:4,
                            }}>
                                Car Info
                            </Typography>
                            <Stack direction="row" spacing={2}>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Plate Number: {memberData['car']['license_plate_number']}<br/>
                                    Province: {memberData['car']['province']}<br/>
                                    Year: {memberData['car']['year']}<br/>
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Make: {memberData['car']['make']}<br/>
                                    Model: {memberData['car']['model']}<br/>
                                    Color: {memberData['car']['color']}<br/>
                                </Typography>
                            </Stack>
                        </Stack>

                    </Stack>
                </CardContent>
            </Card>
        );
    }

    const PermitCard = ()=>{
        return (
            <Card sx={{ maxWidth: 345, minWidth:600  }}>
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
            <MembersList></MembersList>
        </Stack>
    )
}