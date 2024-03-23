import {Avatar, Button, Card, CardActions, CardContent, CardHeader, Chip, Stack, Typography} from "@mui/material";

class user {
    id:number
    groupID:number
    firstName:string
    lastName:string
    studentID:number
    phoneNumber:string
    licensePlateNumber:string
    email:string
    password:string
}
export type GroupMetaData = {
    id:number,
    members:user[],
}
export default function MatchmakingGroups(){

    const GroupDisplay = ({groupData, handleGroupClick})=>{
        return (
            <Card
                sx={{
                    borderRadius:"20px",
                    backgroundColor:"#C0D7D8",
                    margin:"2rem"
                }}
            >
                <CardHeader
                    title={"Group #: 5"}
                    titleTypographyProps={{variant:'h3', fontFamily:"Orelega One"}}
                >
                    <Typography variant={"h3"} fontFamily={"Orelega One"}>
                        Group #: 5</Typography>
                </CardHeader>
                <CardContent>
                    <Chip avatar={<Avatar sx={{bgcolor:"#A7C957"}}>H</Avatar>}
                          label="Harper Manning"
                          sx={{
                              width:"50"
                          }}
                    />

                </CardContent>
                <CardActions>
                    <Button
                        sx={{
                            fontFamily: "Orelega One",
                            // fontWeight:"Bold",
                            fontSize:"20px",
                            height:"30px",
                            backgroundColor: "#1D3557",
                            color: "#FFFFFF",
                            borderRadius:"20px"
                        }}
                    >View</Button>
                </CardActions>
            </Card>
        )
    }


    return(
        <Stack>
            <GroupDisplay></GroupDisplay>
        </Stack>
    )
}