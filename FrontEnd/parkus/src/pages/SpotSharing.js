import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MatchmakingTitle from "../components/SpotSharing/Matchmaking/MatchmakingTitle/MatchmakingTitle";
import {Stack, Typography} from "@mui/material";
import MatchmakingGroups from "../components/SpotSharing/Matchmaking/MatchmakingGroup/MatchmakingGroups";
import MatchmakingButton from "../components/SpotSharing/Matchmaking/MatchmakingButton/MatchmakingButton";
import {checkScheduleCompleted, getCurrUser, getGroupId, matchmake} from "../services/requests"
import React, {useEffect, useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";

function SpotSharing() {
    const navigate = useNavigate();
    const location = useLocation();

    const [availableGroups, setAvailableGroups] = useState(false);
    const [completedSchedule, setCompletedSchedule] = useState(false);
    const [notMemberOfGroup, setNotMemberOfGroup] = useState(false);
    const [noAvailableGroups, setNoAvailableGroups] = useState(false);


    async function handleMatchmakeClick() {
        const currUser = await getCurrUser();
        if (currUser) {
            setAvailableGroups( await matchmake(currUser).then(data => data.availableGroups))
            console.log(availableGroups)
            if (availableGroups === false) {setNoAvailableGroups(true)}
        }
    }


    function handleGroupClick(id){
        navigate(`/group-schedule/${id}`, {
            state: {
                fromAvailableGroups: true,
                availableGroups: availableGroups, // Pass the availableGroups data
            },
        });
    }

    useEffect(() => {
        async function init() {

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

            // Check if we need to display available groups
            if (location.state && location.state.showAvailableGroups) {
                if (location.state.availableGroups) {
                    // Use the availableGroups passed via navigation state
                    setAvailableGroups(location.state.availableGroups);
                } else {
                    // If not available, fetch them
                    await handleMatchmakeClick();
                }
            }
        }
        init();
    }, [location.state]);

    return (
        <div>
            <ToastContainer />
            <MatchmakingTitle />
            {notMemberOfGroup ? (
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
                                availableGroups.length === 0 ? (
                                    <section>
                                        <h1>Uh Oh!</h1>
                                        <h3>There are no available groups for you to join. Head to the Profile tab to purchase a permit and start your own!</h3>
                                    </section>
                                ) : (
                                    <section>
                                        <MatchmakingButton handleMatchmakeClick={handleMatchmakeClick} />
                                        <MatchmakingGroups data={availableGroups} handleGroupClick={handleGroupClick} />
                                    </section>
                                )
                            ) : (//matchmake hasn't been completed
                                <section>
                                    <MatchmakingButton handleMatchmakeClick={handleMatchmakeClick} />
                                </section>
                            )}
                        </section>
                    ) : (
                        <section>
                            <h1>Uh Oh!</h1>
                            <h3>You haven't put in your schedule yet. To join a group, head to the Schedule tab.</h3>
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
                    <h3>You are already in a group!</h3>
                </Stack>
            )}
        </div>
    );
}

export default SpotSharing;
