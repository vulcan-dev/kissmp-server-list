const serverAddress = 'http://kissmp.online:3692/0.4.4';
var serverCount = 0;
var lastRow = -1;

function hideRow(row) {
    // Untoggle the previous row
    $('#' + lastRow).toggle();
    $('#' + lastRow).prev('tr').removeClass('active-row');
    
    $('#' + row).toggle()
    $('#' + row).prev('tr').addClass('active-row');

    lastRow = row;
}

function wordToUpper(str) {
    str = str.replace('/levels/', '')
                   .replace('/info.json', '')
                   .replaceAll('_', ' ')

    return str.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
}

function addToTable(serverName, currentPlayers, description, ip, map) {
    $('.content-table > tbody').append(`
    <tr onclick="hideRow('hidden_row${serverCount}')" class="hover">
        <td>${serverName}</td>
        <td>${currentPlayers}</td>
        <td>${wordToUpper(map)}</td>
    </tr>
    
    <tr id="hidden_row${serverCount}" class="hidden_row">
        <td colspan="4">
            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>IP</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${description}</td>
                        <td>
                            <div class="tooltip"><a href="#">${ip}
                                <span class="tooltiptext">Connect to server</span>
                            </a></div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </td>
    </tr>
    `)
}

function retreiveData(data) {
    for (const key in data) {
        serverCount++;
        addToTable(data[key].name, data[key].player_count, data[key].description, key, data[key].map)
    }
}

var xmlHttp = new XMLHttpRequest();
xmlHttp.open('GET', serverAddress)
xmlHttp.setRequestHeader('Access-Control-Allow-Origin', '*')
xmlHttp.setRequestHeader('Access-Control-Allow-Methods', 'GET')
xmlHttp.setRequestHeader('Access-Control-Allow-Headers', 'accept, content-type')

xmlHttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        retreiveData(JSON.parse(this.response));
    }
}

/**
 * name
 * player_count
 * max_players
 * description
 * map
 * port
 * version
 */

xmlHttp.open('GET', serverAddress);
xmlHttp.send();