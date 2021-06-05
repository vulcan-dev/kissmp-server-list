const serverAddress = 'http://kissmp.online:3692/0.4.4';
var serverCount = 0;
var lastRow = -1;

function hideRow(row) {
    if (row == lastRow) {
        $('#' + lastRow).prev('tr').removeClass('active-row');
        $('#' + row).toggle()
        lastRow = -1;
    } else {
        $('#' + lastRow).prev('tr').removeClass('active-row');
        $('#' + row).prev('tr').addClass('active-row');

        $('#' + row).toggle()
        $('#' + lastRow).toggle()

        lastRow = row;
    }
}

function wordToUpper(str) {
    str = str.replace('/levels/', '')
                   .replace('/info.json', '')
                   .replaceAll('_', ' ');

    return str.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
}

function convertToLink(input) {
    let text = input;

    const aLink = [];
    const linksFound = text.match(/(?:www|https?)[^\s]+/g);

    if (linksFound != null) {
        for (let i = 0; i < linksFound.length; i++) {
            let replace = linksFound[i];

            let linkText = replace.split('/')[2];

            // if the last char is . then replace it with nothing so it doesn't break the link
            replace = replace.replace(/.\s*$/, '');

            aLink.push('<a href="' + replace + '" target="_blank">' + linkText + '</a>');

            text = text.split(linksFound[i]).map(item => {
                return aLink[i].includes('iframe') ? item.trim() : item
            }).join(aLink[i]);
        }

        return text;
    } else {
        return input;
    }
};


function getLink(str) {
    if (str.match(str)) {
        for (link in str) 
            return convertToLink(str)
    }

    return str;
}

function addToTable(serverName, currentPlayers, maxPlayers, description, ip, map, port, version, region) {
    if (region === null) region = 'Unknown';

    $('.content-table > tbody').append(`
    <tr onclick="hideRow('hidden_row${serverCount}')" class="hover">
        <td>${serverName}</td>
        <td>${currentPlayers}/${maxPlayers}</td>
        <td>${wordToUpper(map)}</td>
    </tr>
    
    <tr id="hidden_row${serverCount}" class="hidden_row">
        <td colspan="4">
            <table style="min-width:100%;overflow:hidden;position:relative">
                <thead>
                    <tr>
                        <th>Region</th>
                        <th>Description</th>
                        <th>IP</th>
                        <th>Port</th>
                        <th>Version</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${region}</td>
                        <td>${getLink(description)}</td>
                        <td>
                            <div class="tooltip" onclick="
                                // Copy to clipboard
                                navigator.clipboard.writeText('${ip}');
                                document.execCommand('copy');

                                $('span.cb-${serverCount}').html(\'Copied to Clipboard\');

                                // Change tooltip text after a few seconds
                                setTimeout(function() { 
                                    $('span.cb-${serverCount}').html(\'Copy to Clipboard\');
                                }, 2000)">
                                
                                <p style="color:#E27D60;padding:0;margin:0" class="un">${ip.split(':')[0]}</p>

                                <span class="tooltiptext cb-${serverCount}">
                                    Copy to Clipboard
                                </span>
                            </div>
                        </td>
                        <td>${port}</td>
                        <td>${version.replaceAll(',', '.').replace('[', '').replace(']', '')}</td>
                    </tr>
                </tbody>
            </table>
        </td>
    </tr>
    `)
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

function retreiveData(data) {
    for (const key in data) {
        serverCount++;

        var region = data[key].name.match(/\[[^]*?]/);

        addToTable(data[key].name, 
            data[key].player_count, 
            data[key].max_players, 
            data[key].description, 
            key, 
            data[key].map, 
            data[key].port, 
            JSON.stringify(data[key].version),
            region
        )
    }

    // check if there's no servers
    if (serverCount <= 0) {
        $('.content-table > tbody').append(`
            <h2 style="padding-left:10px;text-align:left;color:#E27D60">No servers available</h2>
        `)
    }
}

var xmlHttp = new XMLHttpRequest();
xmlHttp.open('GET', serverAddress)

xmlHttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        retreiveData(JSON.parse(this.response));
    }
}

xmlHttp.send();