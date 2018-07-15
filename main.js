const APIKEY = 'dd40e7897a7d237d17d21f033ffbea3f';

//get searchform from dom
const search = document.getElementById('searchForm');
const output = document.getElementById('output');


search.addEventListener('submit', e =>{
    //get username from form
    const username = document.getElementById('username').value;
    //get data type searched
    const dataType = document.querySelector('input[name="datatype"]:checked').value;
    //time span
    const time = document.querySelector('input[name="time"]:checked').value;
    //number of results
    const number = document.querySelector('input[name="number"]:checked').value;
    const numbers = number * number;
    

   

    if(username.trim() !== ''){
        fillInfo(username);
        clearOutput();
        if(dataType == 'gettopartists'){
            getArtists(username, dataType, time)
            .then(results => fillgridHTML(results, number, numbers))
        } else if(dataType == 'gettopalbums'){
            getAlbums(username, dataType, time)
            .then(results => fillgridHTMLSongs(results, number, numbers));
        } else if(dataType == 'gettoptracks'){
            getTracks(username, dataType, time)
            .then(results => fillgridHTMLSongs(results, number, numbers));
        }
    }
    else{
        alert('enter username')
    }

    e.preventDefault();

})

// get top artists
function getArtists(username, dataType, time){

    //get data from lastfm
    return fetch(`http://ws.audioscrobbler.com/2.0/?method=user.${dataType}&api_key=${APIKEY}&format=json&user=${username}&period=${time}`)
        .then(response => response.json())
        .then(data => data.topartists.artist.map(data => data))
        .catch(err => console.log(err));
}

//get top albums
function getAlbums(username, dataType, time){

    //get data from lastfm
    return fetch(`http://ws.audioscrobbler.com/2.0/?method=user.${dataType}&api_key=${APIKEY}&format=json&user=${username}&period=${time}`)
        .then(response => response.json())
        .then(data => data.topalbums.album.map(data => data))
        .catch(err => console.log(err));
}

//geet top tracks
function getTracks(username, dataType, time){

    //get data from lastfm
    return fetch(`http://ws.audioscrobbler.com/2.0/?method=user.${dataType}&api_key=${APIKEY}&format=json&user=${username}&period=${time}`)
        .then(response => response.json())
        .then(data => data.toptracks.track.map(data => data))
        .catch(err => console.log(err));
}

//get user info
function userInfo(username){
    return fetch(`http://ws.audioscrobbler.com/2.0/?method=user.getinfo&api_key=${APIKEY}&format=json&user=${username}`)
        .then(response => response.json())
        .then(data => data.user)
        .catch(err => console.log(err));
}

//fill info into html
function fillInfo(username){
    const userInfoOutput = document.getElementById('userInfoOutput');
    userInfoOutput.innerHTML = '';
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

function fillHTML(results){
    //get max playcount
    const max = results[0].playcount;
    //clear html div 
    output.innerHTML = '<ul class="collection" id="list"></ul>';

    results.forEach(item => {
        const percent = (item.playcount / max) * 100; 
        const list = document.getElementById('list');
        list.innerHTML += `
        <li class="collection-item avatar">
         <img src="${item.image[0]['#text']}" class="circle">
         <span class="title">${item.name}</span>
         <span class="new badge" data-badge-caption="scrobbles">${item.playcount}</span>
         <div class="bar" style="width: ${percent}%"></div>
    `
    })

}

function fillgridHTML(results, number, numbers){
    const max = results[0].playcount;
    output.classList.add(`grid${number}`);

    output.innerHTML = '';

    for(let i=0; i<numbers; i++){
        output.innerHTML += `
        <div class="square-tile" style="background: url('${results[i].image[3]['#text']}');">
         <span class="new badge red author-badge" data-badge-caption="">${results[i].name}</span>
         <span class="new badge" data-badge-caption="scrobbles">${results[i].playcount}</span>
         `
    }
}

//render nice grid 
function fillgridHTMLSongs(results, number, numbers){
    const max = results[0].playcount;
    output.classList.add(`grid${number}`);

    output.innerHTML = '';

    if (number == '5'){
        for(let i=0; i<numbers; i++){
            output.innerHTML += `
            <div class="square-tile" style="background: url('${results[i].image[2]['#text']}');">
             <span class="title title-custom new badge blue" data-badge-caption="" >${results[i].name}</span>
             <span class="new badge red author-badge" data-badge-caption="">${results[i].artist.name}</span>
             <span class="new badge" data-badge-caption="scrobbles">${results[i].playcount}</span>
             `
        }
    } else {
        for(let i=0; i<numbers; i++){
            output.innerHTML += `
            <div class="square-tile" style="background: url('${results[i].image[3]['#text']}');">
             <span class="title title-custom new badge blue" data-badge-caption="" >${results[i].name}</span>
             <span class="new badge red author-badge" data-badge-caption="">${results[i].artist.name}</span>
             <span class="new badge" data-badge-caption="scrobbles">${results[i].playcount}</span>
             `
        }
    }

}

//clear output
function clearOutput(){

    if(output.classList.contains('grid3')){
        output.classList.remove('grid3');
    } else if(output.classList.contains('grid4')){
        output.classList.remove('grid4');
    } else if(output.classList.contains('grid5')){
        output.classList.remove('grid5');
    }
}