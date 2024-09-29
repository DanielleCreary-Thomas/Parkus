import React from "react";
import {Typography} from "@mui/material";

function Group(){

    return(
        <div className="app-container">
            <div className="left-panel">
            </div>
            <div className="right-panel">
                <Typography variant={"h2"}>Group</Typography>
                <section>
                    {/*
                    Check if they are group leader or member
                    if group leader, show the cards for each member with their screen shot for payment and car info
                    if member
                        check if they paid or not
                            if paid; show the screenshot of the permit and display their card with their etransfer
                            screenshot and their car info
                            if not paid; show the payment screen
                    */}

                </section>
            </div>
        </div>
    )
}

export default Group