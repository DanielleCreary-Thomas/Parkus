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
export async function checkUserImageProof(user_id){
    /**
     * using the current user's id, checks to see if they have already uploaded an imageProofUrl
     */
    var data = await fetch(`http://127.0.0.1:5000/users/imageproof/${user_id}`,
        { method: "GET" })
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.log(error));
    return data['imageProof'];
}

export async function uploadETransfer(formData){
    /**
     * Using the current user's id tries uploading their image proof url
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

    // const cacheBuster = `?cb=${new Date().getTime()}`;
    // ${cacheBuster}
    var data = await fetch(
        `http://127.0.0.1:5000/users/imageproof`,
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

export async function getPermitId({ userid, permit_number }) {
    const data = await fetch(`http://127.0.0.1:5000/get-permitid?userid=${userid}&permit_number=${permit_number}`, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => data)
    .catch(error => console.log(error));

    return data;
}

export async function fetchGroupId({ permitId }) {
    var data = await fetch(`http://127.0.0.1:5000/get-groupid?permitid=${permitId}`, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => data)
    .catch(error => console.log(error));
    return data;
}

export async function updateUserGroupId({ userid, groupid }) {
    try {
        const response = await fetch('http://127.0.0.1:5000/update-user-groupid', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userid, groupid }),
        });

        if (!response.ok) {
            // Check if the response is not OK and throw an error with the status text
            throw new Error(`Failed to update user group. Status: ${response.status} ${response.statusText}`);
        }

        const result = await response.json(); // Parse the JSON response
        return result;
    } catch (error) {
        console.error('Error updating user group ID:', error);
        throw error;
    }
}

// Function to insert a parking group using the permit ID
export async function addParkingGroup(permitid) {
    const data = await fetch('http://127.0.0.1:5000/parking-group', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ permitid }),  // Send the permitid
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


export async function getGroupMembers(group_id){
    /**
     * gets the information for each member of the given group
     * Information: userid, first name, last name, car info,
     *      email, image url, and car info
     */
    var data = await fetch(`http://127.0.0.1:5000/users/group/${group_id}`,
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
    return data["memberPaid"];
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
        console.log('get group member info', data)
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
    return data['image_proof_url']
}


 
export async function fetchGroupMembersSchedules(groupId) {
    /**
     * Fetches schedules for all members in a given group by groupId
     */
    var data = await fetch(`http://127.0.0.1:5000/groups/${groupId}/schedules`, 
        { method: "GET" })
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.log('Error fetching group schedules:', error));
    
    return data;
}


export async function fetchUserSchedule(userId) {
    var data = await fetch(`http://127.0.0.1:5000/users/${userId}/schedule`, 
        { method: "GET" })
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.log('Error fetching user schedule:', error));
    
    return data;
}



export async function checkGroupFullyPaid(groupId) {
    var data = await fetch(`http://127.0.0.1:5000/groups/${groupId}/fully_paid`, 
        { method: 'GET' })
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.log(error));
    return data;
  }
  

export const fetchCarByUserId = async (userId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/car/user/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch car information.');
      }
      const car = await response.json();
      return car;
    } catch (error) {
      console.error('Error fetching car:', error);
      throw error;
    }
  };


export async function addCar(carData) {
    try {
        const response = await fetch('http://127.0.0.1:5000/car', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(carData),
        });
        if (!response.ok) {
            throw new Error('Failed to update car information.');
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error updating car:', error);
        throw error;
    }
}

export async function updatePermit(permitData) {
    try {
        const response = await fetch('http://127.0.0.1:5000/update_permit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(permitData),
        });

        if (!response.ok) {
            throw new Error('Failed to update permit information.');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error updating permit:', error);
        throw error;
    }
}



export async function addUserData(userData) {
    /**
     * Sends a POST request to the Flask backend to insert user data and car data.
     * @param {Object} userData - Data containing user details and the car's license plate number.
     */
    try {
        const response = await fetch('http://127.0.0.1:5000/add-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Failed to insert user and car data. Please try again.');
        }

        return result;
    } catch (error) {
        console.error('Error during data insertion:', error);
        throw error;
    }
}
