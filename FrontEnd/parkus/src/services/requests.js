function matchmake(id) {
    fetch(`http://127.0.0.1:5000/group/matchmake/?id=${id}`,
        {method: "GET"})
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.log(error));

}