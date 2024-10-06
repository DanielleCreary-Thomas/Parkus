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
        for (const member in members) {
            if(member['image_proof_url'] == null){
                member['image_proof_url'] =
                    "https://rtneojaduhodjxqmymlq.supabase.co/storage/v1/object/public/payment_proof/UnpaidDefault.webp"
            }
        }
        console.log(members)
        return (<LeaderCard data={members} permitData={permitImageUrl} />)
    }
    else{
        if(isPaidMember && userInfoGroup && permitImageUrl){
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
    const [userId, setUserId] = React.useState(null);
    const [groupId, setGroupId] = React.useState(null);
    const [permitImageUrl, setPermitImageUrl] = React.useState(null);
    const [members, setMembers] = React.useState(null);
    const [userInfoGroup, setUserInfoGroup] = React.useState(null);

    //runs once on page load
    useEffect(() => {
        async function init(){
            console.log("------INIT USEFFECT START-----");
            var userid = await getCurrUser();
            setUserId(userid);
            console.log(userid);

            var groupid = await getGroupId(userid);
            setGroupId(groupid); //because function is asynchronous, this hasn't been set yet
            console.log(groupid);

            if(groupId !== 'None'){
                var groupLeader = await getGroupLeader(groupid)
                setGroupLeader(groupLeader);
                console.log(groupLeader);

                var paid_member = await hasMemberPaid(userid)
                setIsMemberPaid(paid_member);
                console.log(paid_member);

                if(paid_member){
                    var allMembers = await getGroupMembers(groupid);
                    setMembers(allMembers);
                    console.log(allMembers);

                    var userMemberInfo = await getGroupMember(userid);
                    setUserInfoGroup(userMemberInfo);
                    console.log(userMemberInfo);

                    var permitImage = await getGroupPermit(groupLeader);
                    setPermitImageUrl(permitImage)
                    console.log(permitImage);
                }
            }
        }
        init();
    }, []);

    function checkGroupLeader() {
        return groupLeader === userId;
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
