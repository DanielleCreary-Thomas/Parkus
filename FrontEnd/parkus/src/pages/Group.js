import React, {useEffect} from "react";
import {Typography} from "@mui/material";
import {
    getCurrUser,
    getGroupId,
    getGroupLeader,
    getGroupMember,
    getGroupMembers, getGroupPermit,
    hasMemberPaid
} from "../services/requests.js";
import LeaderCard from "../components/Group/LeaderCard/LeaderCard";
import PaidMemberCard from "../components/Group/MemberCard/PaidMemberCard";
import UnpaidMemberCard from "../components/Group/MemberCard/UnpaidMemberCard";
import GroupTitle from "../components/Group/GroupTitle/GroupTitle";

function MemberView({members, userInfoGroup, permitImageUrl, isGroupLeader, isPaidMember}){
    if (isGroupLeader){
        return (<LeaderCard data={members}/>)
    }
    else{
        if(isPaidMember){
            return (<PaidMemberCard memberData={userInfoGroup} permitData={permitImageUrl}/>)
        }
        else{
            return (<UnpaidMemberCard/>)
        }
    }
}


export default function Group(){
    const [groupLeader, setGroupLeader] = React.useState(null);
    const [isMemberPaid, setIsMemberPaid] = React.useState(null);
    const [userid, setUserid] = React.useState(null);
    const [groupId, setGroupId] = React.useState(null);
    const [permitImageUrl, setPermitImageUrl] = React.useState(null);
    const [members, setMembers] = React.useState(null);
    const [userInfoGroup, setUserInfoGroup] = React.useState(null);

    //runs once on page load
    useEffect(() => {
        async function init(){
            console.log("------INIT USEFFECT START-----");
            var userid = await getCurrUser();
            setUserid(userid);
            console.log(userid);

            var groupId = await getGroupId(userid);
            setGroupId(groupId);
            console.log(groupId);

            if(groupId !== 'None'){
                var groupLeader = await getGroupLeader(groupId)
                setGroupLeader(groupLeader);
                console.log(groupLeader);

                setIsMemberPaid( await hasMemberPaid(userid));
                console.log(isMemberPaid);

                setMembers(await getGroupMembers(groupId));
                console.log(members);

                setUserInfoGroup(await getGroupMember(userid));
                console.log(userInfoGroup);

                setPermitImageUrl(await getGroupPermit(groupLeader))
                console.log(permitImageUrl);
            }



        }
        init();
    }, []);

    function checkGroupLeader() {
        return groupLeader === userid;
    }

    return(
        <div className="app-container">
            <div className="left-panel">
            </div>
            <div className="right-panel">
                <GroupTitle></GroupTitle>
                <section>
                    {/*
                    Check if they are group leader or member +
                    if group leader, show the cards for each member with their screen shot for payment and car info +
                    if member +
                        check if they paid or not +
                            if paid +; show the screenshot of the permit and display their card with their etransfer
                            screenshot and their car info
                            if not paid; show the payment screen
                    */
                    }
                    <MemberView
                                members={members}
                                userInfoGroup={userInfoGroup}
                                isGroupLeader={checkGroupLeader()}
                                isPaidMember={isMemberPaid}
                                permitImageUrl={permitImageUrl}
                    />
                </section>
            </div>
        </div>
    )
}
