import React from "react";
import {Typography} from "@mui/material";
import {getCurrUser, getGroupId, getGroupLeader} from "../services/requests";
import LeaderCard from "../components/Group/LeaderCard/LeaderCard";

function Group(){
    const [groupLeader, setGroupLeader] = React.useState(null);
    const [unpaidMember, setGroupMember] = React.useState(null);
    const [paidMember, setPaidMember] = React.useState(null);
    const [userid, setUserid] = React.useState(null);
    setUserid(getCurrUser());

    const [groupId, setGroupId] = React.useState(null);

    const [permitImageUrl, setPermitImageUrl] = React.useState(null);
    const [eTransferImageUrl, setETransferImageUrl] = React.useState(null);

    async function checkGroupLeader() {
        setGroupId(await getGroupId(userid));
        setGroupLeader(await getGroupLeader(groupId));
        return groupLeader === userid;
    }

    async function checkPaidMember() {
        const paid = await checkPaidMember(userid)
        return paid
    }

    async function leaderView(){
        const members = await getGroupMembers(groupId);
        return LeaderCard({members})
    }

    function paidMemberView(){
        const view  = <section>

        </section>
        return view
    }

    function unpaidMemberView(){
        const view  = <section>

        </section>
        return view
    }

    function checkViewType(){
        if (groupLeader != null){
            return <leaderView/>
        }
        else{
            if(paidMember != null){
                return <paidMemberView/>
            }
            else{
                return <unpaidMemberView/>
            }
        }
    }

    return(
        <div className="app-container">
            <div className="left-panel">
            </div>
            <div className="right-panel">
                <Typography variant={"h2"}>Group</Typography>
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
                    <checkViewType/>
                </section>
            </div>
        </div>
    )
}

export default Group