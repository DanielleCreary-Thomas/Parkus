import {supabase} from "../utils/supabase.ts";

//Spotsharing
export async function matchmake(id) {
    var data = await fetch(`http://127.0.0.1:5000/groups/matchmake/${id}`,
        { method: "GET" })
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.log(error));
    return data;
}

export async function getCurrUser(){
    const data = await supabase.auth.getUser()
        .catch(error => {
            console.log('Error fetching authenticated user:', error);
            return -1
        });
    console.log(data.data.user.id);
    return data.data.user.id;
}

export async function checkScheduleCompleted(userid){
    var data = await fetch(`http://127.0.0.1:5000/schedule/${userid}`,
        { method: "GET" })
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.log(error));
    return data;
}

//Payment
export async function uploadETransfer(formData){
    /**
     * Using the current user's id tries uploading their etransfer image
     */
    console.log("uploading image form", formData)

    //values for the image url and user id
    var proofImageUrl = formData.get('proofImageUrl');
    var userId = formData.get('userid')
    console.log("uploading image URL", proofImageUrl)
    let body = {
        "userId" : userId,
        "proofImageUrl" : proofImageUrl
    }
    body = JSON.stringify(body);

    var data = await fetch(`http://127.0.0.1:5000/users/etransfer`,
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
        })
        .then((response) => response.json())
        .then((data) => data)
        .catch((error) => console.log(error));
    return data;
}

//Profile
export async function addParkingPermit(permitData) {
    var data = await fetch('http://127.0.0.1:5000/parking-permit',
        { method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(permitData),
        })
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.log(error));
    return data;
}

export async function fetchParkingPermits(userId) {
    var data = await fetch(`http://127.0.0.1:5000/parking-permits/${userId}`,
        { method: 'GET' })
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.log(error));
    return data;
}

export async function checkParkingPermit(userId) {
    var data = await fetch(`http://127.0.0.1:5000/parking-permit/${userId}`,
        { method: 'GET' })
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.log(error));
    return data;
}

export async function fetchUser(userId) {
    var data = await fetch(`http://127.0.0.1:5000/users/${userId}`,
        { method: 'GET' })
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.log(error));
    return data;
}

//Group
export async function getGroupId(user_id){
    /**
     * Returns the group id for the given user id
     */
    var data = await fetch(`http://127.0.0.1:5000/users/groupid/${user_id}`,
        {method: "GET"})
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.log(error));
        console.log('getGroupId', data);
    return data['groupid'];

}


export async function getGroupMembers(groupId){
    /**
     * gets the information for each member of the given group
     * Information: userid, first name, last name, car info,
     *      email, image url, and car info
     */
    var data = await fetch(`http://127.0.0.1:5000/users/group/${groupId}`,
        {method: "GET"})
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.log(error));
    return data;
}

export async function getGroupLeader(group_id){
    /**
     * Returns the userid for the leader of the group matching the given groupid
     */
    var data = await fetch(`http://127.0.0.1:5000/permits/userid/${group_id}`,
        {method: "GET"})
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.log(error));
        console.log('get Group Leader', data)
    return data['userid'];
}

export async function hasMemberPaid(userid){
    /**
     * Checks to see if the given user has an eTransfer url on file
     */
    var data = await fetch(`http://127.0.0.1:5000/users/paid/${userid}`,
        {method: "GET"})
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.log(error));
        console.log('check Paid Member', data)
    return data.data;
}

export async function getGroupMember(userid){
    /**
     * Gets the member information for the given user id
     * Information: userid, first name, last name, car info,
     *      email, image url, and car info
     */
    var data = await fetch(`http://127.0.0.1:5000/group/member/${userid}`,
        {method: "GET"})
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.log(error));
        console.log('check Paid Member', data)
    return data;
}

export async function getGroupPermit(leaderid){
    /**
     * Gets the image url for the group's permit
     */
    var data = await fetch(`http://127.0.0.1:5000/group/permit/${leaderid}`,
        {method: "GET"})
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.log(error));
        console.log('check Paid Member', data)
    return data
}


