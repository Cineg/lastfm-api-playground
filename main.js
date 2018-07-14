const APIKEY = 'dd40e7897a7d237d17d21f033ffbea3f';

//get searchform from dom
const search = document.getElementById('searchForm');


search.addEventListener('submit', e =>{
    //get username from form
    const username = document.getElementById('username').value;
    //get data type searched
    const dataType = document.querySelector('input[name="datatype"]:checked').value;
    const output = document.getElementById('output');
  
    
    if(username.trim() !== ''){
        fillInfo(username);
        if(dataType == 'gettopartists'){
            getArtists(username, dataType)
            .then(results => {
                const max = results[0].playcount;
    
                results.forEach(item => {
                const percent = (item.playcount / max) * 100; 
                output.innerHTML += `
                   <li class="collection-item avatar">
                     <img src="${item.image[0]['#text']}" class="circle">
                     <span class="title">${item.name}</span>
                     <span class="new badge" data-badge-caption="scrobbles">${item.playcount}</span>
                     <div class="bar" style="width: ${percent}%"></div>
               `
            })
        });
        } else if(dataType == 'gettopalbums'){
            getAlbums(username, dataType)
            .then(results => console.log(results));
        } else if(dataType == 'gettoptracks'){
            getTracks(username, dataType)
            .then(results => console.log(results));
        }
    }
    else{
        alert('enter username')
    }

    e.preventDefault();

})

// get top artists
function getArtists(username, dataType){

    //get data from lastfm
    return fetch(`http://ws.audioscrobbler.com/2.0/?method=user.${dataType}&api_key=${APIKEY}&format=json&user=${username}`)
        .then(response => response.json())
        .then(data => data.topartists.artist.map(data => data))
        .catch(err => console.log(err));
}

function getAlbums(username, dataType){

    //get data from lastfm
    return fetch(`http://ws.audioscrobbler.com/2.0/?method=user.${dataType}&api_key=${APIKEY}&format=json&user=${username}`)
        .then(response => response.json())
        .then(data => data.topalbums.album.map(data => data))
        .catch(err => console.log(err));
}

function getTracks(username, dataType){

    //get data from lastfm
    return fetch(`http://ws.audioscrobbler.com/2.0/?method=user.${dataType}&api_key=${APIKEY}&format=json&user=${username}`)
        .then(response => response.json())
        .then(data => data.toptracks.track.map(data => data))
        .catch(err => console.log(err));
}


function userInfo(username){
    return fetch(`http://ws.audioscrobbler.com/2.0/?method=user.getinfo&api_key=${APIKEY}&format=json&user=${username}`)
        .then(response => response.json())
        .then(data => data.user)
        .catch(err => console.log(err));
}

function fillInfo(username){
    const userInfoOutput = document.getElementById('userInfoOutput');
    userInfo(username)
    .then(result =>{
        userInfoOutput.innerHTML += `
        <div class="card blue-grey darken-2">
            <div class="card-content white-text">
                <span class="card-title"> ${result.name} 
                </span>
                <p>Tracks listened: ${result.playcount}</p>
                <p>Playlists: ${result.playlists}</p>
                <p>Country: ${result.country}</p>
            </div>
        </div>
    `
    })

}