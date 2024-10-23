import Navbar from "../components/SideNav/Navbar/Navbar";
import {Route, Routes, useNavigate} from "react-router-dom";
import Home from "./Home";
import Schedule from "./Schedule";
import SpotSharing from "./SpotSharing";
import {CircularProgress, Stack, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import "./styles/Payment.css"
import {checkUserImageProof, getCurrUser, getGroupId, uploadETransfer} from "../services/requests";
import {supabase} from "../utils/supabase.ts";
import {toast, ToastContainer} from "react-toastify";
import PaymentTitle from "../components/Payment/PaymentTitle/PaymentTitle";
import {Start} from "@mui/icons-material";

function Payment() {
    const [uploadImageUrl, setUploadImageUrl] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [isMemberOfGroup, setIsMemberOfGroup] = useState(false);
    const [userId, setUserId] = useState(null);
    const [groupId, setGroupId] = useState(null);
    const [userImageProof, setUserImageProof] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleBMOClick = ()=> {
        window.open("https://www1.bmo.com/banking/digital/login","_blank")
    }

    function handleScotiaClick() {
        window.open("https://auth.scotiaonline.scotiabank.com/online?oauth_key=" +
            "7j4EdYoeALw&oauth_key_signature=eyJraWQiOiJrUFVqdlNhT25GWUVDakpjMmV1MXJvNGxnb2VFeXJJ" +
            "b2tCbU1oX3BiZXNVIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJyZWZlcmVyIjoiaHR0cHM6XC9cL3d3dy5nb29nb" +
            "GUuY29tXC8iLCJvYXV0aF9rZXkiOiI3ajRFZFlvZUFMdyIsImNvbnNlbnRfcmVxdWlyZWQiOmZhbHNlLCJyZWRpcmVjdF91cmkiOi" +
            "JodHRwczpcL1wvd3d3LnNjb3RpYW9ubGluZS5zY290aWFiYW5rLmNvbVwvb25saW5lXC9sYW5kaW5nXC9vYXV0aGxhbmRpbmcuYm5z" +
            "IiwiZXhwIjoxNzI3MDE5ODYyLCJpYXQiOjE3MjcwMTg2NjIsImp0aSI6Ijg1NjY3Y2VjLTkzMmQtNDkxYy05N2YxLTgyMGQ3YTg3ZGY" +
            "3YiIsImNsaWVudF9pZCI6IjhlZTkwYzM5LTFjNTItNGZmNC04YWU2LWE3YjU0YzUzOTkzMyIsImNsaWVudF9tZXRhZGF0YSI6eyJDaGF" +
            "ubmVsSUQiOiJTT0wiLCJBcHBsaWNhdGlvbkNvZGUiOiJINyJ9LCJpc3N1ZXIiOiJodHRwczpcL1wvcGFzc3BvcnQuc2NvdGlhYmFuay" +
            "5jb20ifQ.KiQbX3IuenqdGqQr_GNBf8pa0hdiLMLVPlN8hOX0tIQweEuO2-MWUTpNI683aDe3bcgHy9Dxda5i49zHKWFkhbFWFiK0eUDu2" +
            "adnEbJxPcJEDNOVfNMXTMOeixyX1Wrn4ngiO_gMgrZ4_kMGqypTNEHADVfpCWSEHPaEhtdUmgnKW3aX7T0GYhd-Vrg9VeoTSZarz90Hw" +
            "EBOLtwrsHzezTT0gp_puGt3udw-bQor0ItTlRpVRojPyFuc-mAPBQvYjNN5Cf4OsG-ZqNDmNswWo5piA40CCTgcO0wVsMyTCZeCsu1" +
            "BZErO161QF_qLWaDSnK-VbEZpCsTLU9dAmlA6XA&preferred_environment=", "_blank")
    }

    function handleTDClick() {
        window.open("https://authentication.td.com/uap-ui/?consumer=easyweb&locale=en_CA#/uap/login", "_blank")
    }

    function handleRBCClick() {
        window.open("https://secure.royalbank.com/statics/login-service-ui/index#/full/signin?LANGUAGE=ENGLISH", "_blank")
    }

    function handleCIBCClick() {
        window.open("https://www.cibc.com/en/personal-banking.html", "_blank")
    }

    function handleTangerineClick() {
        window.open("https://www.tangerine.ca/app/#/login/login-id?locale=en_CA", "_blank")
    }

    async function uploadProof(file) {
        let outerError;
        if(!userImageProof) {//if the user has no image proof
            let {data, error} =
                await supabase.storage.from('payment_proof').upload(userId, file)
            outerError = error
        } else {
            let { data, error } =
                await supabase.storage.from('payment_proof').update(userId, file)
            outerError = error
        }
        if (outerError) {
            // Handle error
            console.log(outerError)
        } else {
            // Handle success
            let data = supabase.storage.from('payment_proof').getPublicUrl(userId)
            console.log("immediate after url call")
            const url = data.data['publicUrl']
            console.log(url)
            return url

        }
    }



    useEffect(() => {
        async function init(){

            var userid = await getCurrUser();
            console.log(userid);

            var groupid = await getGroupId(userid);
            console.log(groupId);

            var imageProof = await checkUserImageProof(userid)
            console.log(imageProof)


            if(groupid !== 'None'){
                setIsMemberOfGroup(true)
                setUserId(userid)
                setUserImageProof(imageProof)
                setGroupId(groupid)
                console.log("member of group", isMemberOfGroup)
            }

        }
        init();
        setIsLoading(false)


    }, []);

    // const checkInGroup = async() =>{
    //     const userid = getCurrUser()
    //     const groupid = getGroupId(userid)
    //     if(groupid['groupid'] !== "None"){
    //         setMemberOfGroup(true)
    //     }
    // }

    const handleSubmit = async () => {
        if (!selectedImage) {
            alert('Please select an image to upload.');
            return;
        }

        const url = await uploadProof(selectedImage);

        console.log("outside",url)

        if(url !== undefined){
            const formData = new FormData();
            formData.append('proofImageUrl', url);
            formData.append('userid', userId)
            try{
                const response = await uploadETransfer(formData);
                console.log(response);
                if(response['urlUploaded'] === true){
                    console.log("image uploaded successfully")
                    // Reset the form
                    setSelectedImage(null);
                    setImagePreviewUrl(null);
                    setUploadImageUrl(null);
                    toast.success("Image uploaded successfully")
                }

            }catch(error){
                console.log("error uploading image", error);
                toast.error("An error occurred while uploading image, Try Again", error);
            }
        }else{
            toast.error("An error occurred while uploading image, Try Again");
        }



    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
            setImagePreviewUrl(URL.createObjectURL(file));
        }
    };


    const buttonStyle = {
        display: 'flex',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#faf6f0',
        color: '#01294f',
        border: 'none',
        borderRadius: 30,
        cursor: 'pointer',
        marginBottom: '10px',
        width: 200
    };



    return (

            <div className="app-container">
                <div className="left-panel"></div>
                <div className="right-panel">
                    <PaymentTitle></PaymentTitle>
                    {isLoading ? (
                        <CircularProgress />
                    ) :
                    (
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
                            {isMemberOfGroup ? (//check to see if the current user is in a group
                                !userImageProof ? (//check to see if the current user has paid
                                    <section>
                                        <section>
                                            <h2> Select your Banking Institution below to login</h2>
                                            <Stack>
                                                <Stack direction="row" spacing={2}>
                                                    <button onClick={handleBMOClick} style={buttonStyle}>
                                                        <img
                                                            src={"https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/BMO_Logo.svg/1200px-BMO_Logo.svg.png"}
                                                            alt={"BMO Logo"}
                                                            style={{height: '50px', marginRight: '8px'}}
                                                        />
                                                        {/*<Start></Start>*/}
                                                    </button>

                                                    <button onClick={handleScotiaClick} style={buttonStyle}>
                                                        <img
                                                            src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7ayPlli-1fIySOJFISHAy08cW8Spwixt0TA&s"}
                                                            alt={"Scotiabank Logo"}
                                                            style={{height: '40px', marginRight: '8px'}}
                                                        />
                                                        {/*<Start></Start>*/}
                                                    </button>

                                                    <button onClick={handleTDClick} style={buttonStyle}>
                                                        <img
                                                            src={"https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/TD_Bank.svg/2560px-TD_Bank.svg.png"}
                                                            alt={"TD Logo"}
                                                            style={{height: '40px', marginRight: '8px'}}
                                                        />
                                                        {/*<Start></Start>*/}
                                                    </button>
                                                </Stack>
                                                <Stack direction="row" spacing={2}>

                                                    <button onClick={handleRBCClick} style={buttonStyle}>
                                                        <img
                                                            src={"https://downtownkelowna.com/wp-content/uploads/2021/07/RBC-Royal-Bank.jpg"}
                                                            alt={"RBC Logo"}
                                                            style={{height: '50px', marginRight: '8px'}}
                                                        />
                                                        {/*<Start></Start>*/}
                                                    </button>

                                                    <button onClick={handleCIBCClick} style={buttonStyle}>
                                                        <img
                                                            src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi-F3zP_sJLpxuGWfGXhUR1zQpPRMeBtrPUw&s"}
                                                            alt={"CIBC Logo"}
                                                            style={{height: '40px', marginRight: '8px'}}
                                                        />
                                                        {/*<Start></Start>*/}
                                                    </button>

                                                    <button onClick={handleTangerineClick} style={buttonStyle}>
                                                        <img
                                                            src={"https://milliondollarjourney.com/wp-content/uploads/tangerine_logo.jpg"}
                                                            alt={"Tangerine Logo"}
                                                            style={{height: '50px', marginRight: '8px'}}
                                                        />
                                                        {/*<Start></Start>*/}
                                                    </button>
                                                </Stack>
                                            </Stack>

                                            <h3>... Or login to a different bank on your own</h3>
                                        </section>
                                        <section>
                                            <Typography variant={"h4"}>Proof of eTransfer</Typography>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                aria-label="Upload proof of eTransfer"
                                            />
                                            {imagePreviewUrl && (
                                                <div>
                                                    <h3>Image Preview:</h3>
                                                    <img
                                                        src={imagePreviewUrl}
                                                        alt="Selected Proof of eTransfer"
                                                        style={{width: '300px', marginTop: '10px'}}
                                                    />
                                                </div>
                                            )}
                                            <button onClick={handleSubmit} disabled={!selectedImage}>
                                                Submit
                                            </button>
                                        </section>
                                    </section>
                                ) : (
                                    <section>
                                        <h1>Uh Oh!</h1>
                                        <h3> You have already paid your group leader or you are the group leader, review in Group Tab</h3>
                                    </section>
                                )
                            ) : (
                                <section>
                                    <h1>Uh Oh!</h1>
                                    <h3> You aren't part of a group yet, to join a group head to the spotsharing tab</h3>
                                </section>
                            )}
                        </Stack>
                    )}

                    <ToastContainer/>
                </div>
            </div>


    )
}

export default Payment;