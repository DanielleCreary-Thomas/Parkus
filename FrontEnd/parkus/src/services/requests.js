export async function matchmake(id) {
    var data = await fetch(`http://127.0.0.1:5000/groups/matchmake/${id}`,
        {method: "GET"})
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.log(error));
    return data;
}