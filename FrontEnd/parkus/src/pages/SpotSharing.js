import MatchmakingTitle from "../components/SpotSharing/Matchmaking/MatchmakingTitle/MatchmakingTitle";
import {Stack, Typography} from "@mui/material";
import MatchmakingGroups from "../components/SpotSharing/Matchmaking/MatchmakingGroup/MatchmakingGroups";
import MatchmakingButton from "../components/SpotSharing/Matchmaking/MatchmakingButton/MatchmakingButton";
import {checkScheduleCompleted, getCurrUser, getGroupId, matchmake} from "../services/requests"
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";


function SpotSharing() {
    const navigate = useNavigate();

    const [availableGroups, setAvailableGroups] = useState(false);
    const [completedSchedule, setCompletedSchedule] = useState(false);
    const [notMemberOfGroup, setNotMemberOfGroup] = useState(false);

    async function handleMatchmakeClick() {
        const currUser = await getCurrUser();
        if (currUser) {
            setAvailableGroups( await matchmake(currUser).then(data => data.availableGroups))
            console.log(availableGroups)
        }
    }

    function handleGroupClick(id){
        navigate(`/group-schedule/${id}`);
    }

    useEffect(() => {
        async function init(){

            var userid = await getCurrUser();
            console.log(userid);

            var groupId = await getGroupId(userid);
            console.log("spotsharing useEffect",groupId);

            if(groupId === 'None'){
                setNotMemberOfGroup(true)
                console.log("member of group", notMemberOfGroup)
            }

            var scheduleComplete = await checkScheduleCompleted(userid)
            console.log(scheduleComplete)
            if(scheduleComplete['scheduleComplete'] !== false){
                setCompletedSchedule(true)
            }
        }
        init();
    }, []);



    return (
        <div>
            <MatchmakingTitle></MatchmakingTitle>
            {notMemberOfGroup ? (//check if they're a member of a group already
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
                    {completedSchedule ? (//check if they have schedule blocks
                        <section>
                            {availableGroups ? (//matchmake completed
                                !noAvailableGroups ? (
                                    <section>
                                        <h1>Uh Oh!</h1>
                                        <h3> There are no available groups for you to join, head to the Profile tab
                                        to purchase a permit and start your own!</h3>
                                    </section>
                                ): (
                                    <section>
                                        <MatchmakingButton handleMatchmakeClick={handleMatchmakeClick}/>
                                        <MatchmakingGroups data={availableGroups} handleGroupClick={handleGroupClick}></MatchmakingGroups>
                                    </section>
                                )
                            ):(//matchmake hasn't been completed
                                <section>
                                    <MatchmakingButton handleMatchmakeClick={handleMatchmakeClick}/>
                                </section>
                            )}
                        </section>
                    ):(
                        <section>
                            <h1>Uh Oh!</h1>
                            <h3> You haven't put in your schedule yet, to join a group head to the schedule tab</h3>
                        </section>
                    )}
                </Stack>
            ) : (
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
                    <h1>Uh Oh!</h1>
                    <h3> You are already in a group!</h3>
                </Stack>
            )}
        </div>


    )

}

export default SpotSharing;
