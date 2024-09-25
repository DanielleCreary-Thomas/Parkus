import Navbar from "../components/SideNav/Navbar/Navbar";
import {Route, Routes, useNavigate} from "react-router-dom";
import Home from "./Home";
import UpdateSchedule from "./UpdateSchedule";
import SpotSharing from "./SpotSharing";
import {Typography} from "@mui/material";
import React, { useState } from "react";

function Payment() {
    const handleBMOClick = ()=>
    {
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
    const handleSubmit = () => {
        if (!selectedImage) {
            alert('Please select an image to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('proofImage', selectedImage);

        fetch('https://your-server-endpoint.com/upload', {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                // Handle success
                console.log('Upload successful', data);
                alert('Proof of eTransfer uploaded successfully!');
                // Reset the form
                setSelectedImage(null);
                setImagePreviewUrl(null);
            })
            .catch((error) => {
                // Handle error
                console.error('Error uploading image', error);
                alert('There was an error uploading your proof. Please try again.');
            });
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
            setImagePreviewUrl(URL.createObjectURL(file));
        }
    };

    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

    const buttonStyle = {
        display: 'flex',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#faf6f0',
        color: '#01294f',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginBottom: '10px',
    };



    return (

        <div className="app-container">
            <div className="left-panel">
            </div>
            <div className="right-panel">
                <Typography variant={"h2"}>Payment</Typography>
                <section>
                    <h3> Select your Banking Institution below to login</h3>
                    <ul style={{listStyleType: "none"}}>
                        <li>
                            <button onClick={handleBMOClick} style={buttonStyle}>
                                <img
                                    src={"https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/BMO_Logo.svg/1200px-BMO_Logo.svg.png"}
                                    alt={"BMO Logo"}
                                    style={{height: '40px', marginRight: '8px'}}
                                />
                                Proceed to Login
                            </button>
                        </li>
                        <li>
                            <button onClick={handleScotiaClick} style={buttonStyle}>
                                <img
                                    src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7ayPlli-1fIySOJFISHAy08cW8Spwixt0TA&s"}
                                    alt={"Scotiabank Logo"}
                                    style={{height: '40px', marginRight: '8px'}}
                                />
                                Proceed to Login
                            </button>
                        </li>
                        <li>
                            <button onClick={handleTDClick} style={buttonStyle}>
                                <img
                                    src={"https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/TD_Bank.svg/2560px-TD_Bank.svg.png"}
                                    alt={"TD Logo"}
                                    style={{height: '40px', marginRight: '8px'}}
                                />
                                Proceed to Login
                            </button>
                        </li>
                        <li>
                            <button onClick={handleRBCClick} style={buttonStyle}>
                                <img
                                    src={"https://crowd.adsy.me/images/tmfUE__rbc-royal-bank.svg"}
                                    alt={"RBC Logo"}
                                    style={{height: '40px', marginRight: '8px'}}
                                />
                                Proceed to Login
                            </button>
                        </li>
                        <li>
                            <button onClick={handleCIBCClick} style={buttonStyle}>
                                <img
                                    src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi-F3zP_sJLpxuGWfGXhUR1zQpPRMeBtrPUw&s"}
                                    alt={"CIBC Logo"}
                                    style={{height: '40px', marginRight: '8px'}}
                                />
                                Proceed to Login
                            </button>
                        </li>
                    </ul>
                    <h3>... Or login to a different bank on your own</h3>
                </section>
                <section>
                    <Typography variant={"h4"}>Proof  of  eTransfer</Typography>
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
            </div>

        </div>
    )
}

export default Payment;