export async function matchmake(id) {
    var data = await fetch(`http://127.0.0.1:5000/groups/matchmake/${id}`,
        { method: "GET" })
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

export async function checkParkingPermit(userId) {
    var data = await fetch(`http://127.0.0.1:5000/parking-permit/${userId}`, 
        { method: 'GET' })
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.log(error));
    return data;
}

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

