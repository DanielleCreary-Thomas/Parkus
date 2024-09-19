import {Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, Chip, Stack, Typography} from "@mui/material";

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
export default function MatchmakingGroups({data}){
    console.log(data)

    const GroupCard = ({groupData, handleGroupClick})=>{
        const MembersList = () => {
            console.log(groupData.members)
            if (groupData.members.length === 0){return}
            return groupData.members.map(member => (
                <Chip avatar={<Avatar sx={{bgcolor:"#A7C957"}}>{member.name[0]}</Avatar>}
                      label={member.name}
                      key={member.user_id}
                      sx={{
                          width:"50",
                          marginLeft:"10px"
                      }}
                />

            ))
        }


        return (
            <Card
                sx={{
                    borderRadius:"20px",
                    backgroundColor:"#C0D7D8",
                    margin:"2rem"
                }}
                key={groupData.group_id}
            >
                <CardHeader
                    title={"Group #: " + groupData.group_id}
                    titleTypographyProps={{variant:'h3', fontFamily:"Orelega One"}}
                >
                    <Typography variant={"h3"} fontFamily={"Orelega One"}>
                        {"Group #: " + groupData.group_id}</Typography>
                </CardHeader>
                <CardContent>
                    <MembersList/>

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
                        onClick={()=>(handleGroupClick(groupData.group_id))}
                    >View</Button>
                </CardActions>
            </Card>
        )
    }

    const GroupsList = () => {
        if (!data){
            return
        }
        return data.map(group => (
            <Box key={group.group_id}>
                <GroupCard groupData={group}></GroupCard>
            </Box>

        ))
    }

    return(
        <Stack>
            <GroupsList></GroupsList>
        </Stack>
    )
}