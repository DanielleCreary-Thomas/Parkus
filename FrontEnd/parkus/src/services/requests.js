import {supabase} from "../utils/supabase.ts";


export async function matchmake(id) {
    var data = await fetch(`http://127.0.0.1:5000/groups/matchmake/${id}`,
        {method: "GET"})
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.log(error));
    return data;
}

export async function getCurrUser(){
    var data = await supabase.auth.getUser()
        .catch(error => {
            console.log('Error fetching authenticated user:',error);
            return -1
        });

    console.log(data.data.user.id);
    return data.data.user.id;
}


export async function uploadETransfer(formData){
    /**
     * Using the current user's id tries uploading their etransfer image
     */
    console.log("uploading image form", formData)

    var proofImage = formData.get('proofImage');
    var userId = formData.get('userid')
    console.log("uploading image", proofImage)
    var data = await fetch(`http://127.0.0.1:5000/users/etransfer`,
    {
        method: 'POST',
        body: JSON.stringify({proofImage:'myproofimage', userId:userId})
    })
    .then((response) => console.log(response))
    .then((data) => {
        // Handle success
        console.log('Upload successful', data);
        alert('Proof of eTransfer uploaded successfully!');
        })
    .catch((error) => {
        // Handle error
        console.error('Error uploading image', error);
        alert('There was an error uploading your proof. Please try again.');
    })
}

export async function getGroupLeader(group_id){
    var data = await fetch(`http://127.0.0.1:5000/permits/userid/${group_id}`,
        {method: "GET"})
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.log(error));
    return data;
}

export async function checkPaidMember(group_id){
    var data = await fetch(`http://127.0.0.1:5000/users/paid/${group_id}`,
        {method: "GET"})
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.log(error));
    return data;
}