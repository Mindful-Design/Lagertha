/*
 * viewersPanel.js
 * Drives the Viewers Panel
 */
(function () {

    var modeIcon = [];
    modeIcon['false'] = "<i class=\"fa fa-circle-o\" />";
    modeIcon['true'] = "<i class=\"fa fa-circle\" />";

    var groupMapping = [];
    groupMapping[0] = "Caster";
    groupMapping[1] = "Admin";
    groupMapping[2] = "Moderator";
    groupMapping[3] = "Subscriber";
    groupMapping[4] = "Donator";
    groupMapping[6] = "Regular";
    groupMapping[7] = "Viewer";

    var loadedLastSeen = false,
        loadedGroups = false,
        loadedTime = false,
        loadedPoints = false,
        loadedChat = false,
        loadedTimeout = false,
        loadedFollowed = false,
        usernameData = [],
        lastseenData = [],
        groupData = [],
        timeData = [],
        pointsData = [],
        chatData = [],
        timeoutData = [],
        followedData = [];

    var viewerData = {}; // [ user: { group, time, points, lastseen, timeout, followed } ]

    /*
     * @function secsToDurationStr
     * @param {String} secondsStr
     * @returns {String} string formatted time duration
     */
    function secsToDurationStr(secondsStr) {
        var seconds = parseInt(secondsStr),
            years = 0,
            months = 0,
            days = 0,
            hours = 0,
            minutes = 0,
            durationStr = "",
            pad = function (i) {
                return (i < 10 ? '0' + i : i)
            };

        if (seconds > 86400) { // Day: 60 * 60 * 24
            days = seconds / 86400;
            seconds = seconds % 86400;
            durationStr += pad(Math.floor(days)) + ":";
        } else {
            durationStr += "00:";
        }

        if (seconds > 3600) { // Minutes: 60 * 60
            hours = seconds / 3600;
            seconds = seconds % 3600;
            durationStr += pad(Math.floor(hours)) + ":";
        } else {
            durationStr += "00:";
        }

        minutes = seconds / 60;
        durationStr += pad(Math.floor(minutes));
        return durationStr;
    }

    /*
     * @function lastseenStr
     * @param {String} time (ms)
     * @returns {String} formatDate
     */
    function lastseenStr(time) {
        if (time == undefined) {
            return "No Data";
        } else {
            return $.format.date(parseInt(time), "MM.dd.yy hh:mm:ss");
        }
    }

    /*
     * onMessage
     * This event is generated by the connection (WebSocket) object.
     */
    function onMessage(message) {
        var msgObject,
            user = "",
            htmlHeader = "";
        htmlData = [];

        try {
            msgObject = JSON.parse(message.data);
        } catch (ex) {
            return;
        }

        if (panelHasQuery(msgObject)) {
            if (msgObject['query_id'].indexOf('viewers_') === 0) {
                for (idx in msgObject['results']) {
                    var key = msgObject['results'][idx]['key'],
                        value = msgObject['results'][idx]['value'];

                    if (usernameData[key] === undefined) {
                        usernameData.push(key)
                    }

                    if (panelCheckQuery(msgObject, 'viewers_groups')) {
                        groupData[key] = value;
                        if (value.indexOf("0") == 0) groupData[key] = "1";
                    }
                    if (panelCheckQuery(msgObject, 'viewers_time')) {
                        timeData[key] = value;
                    }
                    if (panelCheckQuery(msgObject, 'viewers_points')) {
                        pointsData[key] = value;
                    }
                    if (panelCheckQuery(msgObject, 'viewers_lastseen')) {
                        lastseenData[key] = value;
                    }
                    if (panelCheckQuery(msgObject, 'viewers_timeout')) {
                        timeoutData[key] = value;
                    }
                    if (panelCheckQuery(msgObject, 'viewers_chat')) {
                        chatData[key] = value;
                    }
                    if (panelCheckQuery(msgObject, 'viewers_followed')) {
                        followedData[key] = value;
                    }
                }
            }

            loadedGroups = (loadedGroups ? true : panelCheckQuery(msgObject, 'viewers_groups'));
            loadedTime = (loadedTime ? true : panelCheckQuery(msgObject, 'viewers_time'));
            loadedPoints = (loadedPoints ? true : panelCheckQuery(msgObject, 'viewers_points'));
            loadedLastSeen = (loadedLastSeen ? true : panelCheckQuery(msgObject, 'viewers_lastseen'));
            loadedFollowed = (loadedFollowed ? true : panelCheckQuery(msgObject, 'viewers_followed'));
            loadedTimeout = (loadedTimeout ? true : panelCheckQuery(msgObject, 'viewers_timeout'));
            loadedChat = (loadedChat ? true : panelCheckQuery(msgObject, 'viewers_chat'));

            // Produce the data //
            if (loadedLastSeen && loadedGroups && loadedTime && loadedPoints && loadedFollowed &&
                (!panelStatsEnabled || (panelStatsEnabled && loadedChat && loadedTimeout))) {
                usernameData.sort(sortUsersTable_alpha_asc);
                for (var idx in usernameData) {
                    user = usernameData[idx];

                    if (groupData[user] == undefined) {
                        groupData[user] = "7";
                    }
                    if (!panelIsDefined(pointsData[user])) pointsData[user] = "0";
                    if (!panelIsDefined(timeoutData[user])) timeoutData[user] = "0";
                    if (!panelIsDefined(chatData[user])) chatData[user] = "0";
                    if (!panelIsDefined(followedData[user])) followedData[user] = 'false';
                    if (!panelIsDefined(timeData[user])) timeData[user] = "0";

                    viewerData[user] = {
                        group: groupData[user],
                        time: timeData[user],
                        points: pointsData[user],
                        lastseen: lastseenData[user],
                        followed: followedData[user],
                        timeout: (panelStatsEnabled ? timeoutData[user] : 0),
                        chat: (panelStatsEnabled ? chatData[user] : 0)
                    };
                }

                htmlHeader = "<table class='CLASS_STRING table table-hover table-striped' data-paging='true' data-paging-size='8'" +
                    "       data-filtering='true' data-filter-delay='200'" +
                    "       data-sorting='true'" +
                    "       data-paging-count-format='Rows {PF}-{PL} / {TR}' data-show-header='true'>" +
                    "<thead><tr>" +
                    "    <th data-breakpoints='xs'>User</th>" +
                    "    <th data-type='Date'>Last Seen</th>" +
                    "    <th data-type='Date'>Time in Chat</th>" +
                    "    <th data-type='number' data-container='body' data-toggle='tooltip' title='Points'><i class='fa fa-money' /></th>" +
                    "    <th data-type='number' data-container='body' data-toggle='tooltip' title='Messages'><i class='fa fa-comment' /></th>" +
                    "    <th data-type='number' data-container='body' data-toggle='tooltip' title='Bans'><i class='fa fa-ban' /></th>" +
                    "    <th data-toggle='tooltip' data-container='body' title='Promotions'><i class='fa fa-heart' /></th>" +
                    "</tr></thead><tbody>";


                htmlData["1"] = htmlHeader.replace('CLASS_STRING', 'table_1');
                htmlData["2"] = htmlHeader.replace('CLASS_STRING', 'table_2');
                htmlData["3"] = htmlHeader.replace('CLASS_STRING', 'table_3');
                htmlData["4"] = htmlHeader.replace('CLASS_STRING', 'table_4');
                htmlData["6"] = htmlHeader.replace('CLASS_STRING', 'table_6');
                htmlData["7"] = htmlHeader.replace('CLASS_STRING', 'table_7');

                for (var user in viewerData) {
                    htmlData[viewerData[user].group.toString()] +=
                        "<tr >" +
                        "    <td>" + user + "</td>" +
                        "    <td>" + lastseenStr(viewerData[user].lastseen) + "</td>" +
                        "    <td>" + secsToDurationStr(viewerData[user].time) + "</td>" +
                        "    <td>" + viewerData[user].points + "</td>";

                    if (panelStatsEnabled) {
                        htmlData[viewerData[user].group.toString()] +=
                            "    <td>" + viewerData[user].chat + "</td>" +
                            "    <td>" + viewerData[user].timeout + "</td>";
                    } else {
                        htmlData[viewerData[user].group.toString()] +=
                            "    <td>0</td>" +
                            "    <td>0</td>";
                    }

                    if (panelStrcmp(viewerData[user].followed, 'true') === 0) {
                        htmlData[viewerData[user].group.toString()] +=
                            "    <td>&hearts;</td>";
                    } else {
                        htmlData[viewerData[user].group.toString()] +=
                            "    <td>&nbsp;</td>";
                    }

                    htmlData[viewerData[user].group.toString()] += "</tr>";
                }

                htmlData["1"] += "</tbody></table>";
                htmlData["2"] += "</tbody></table>";
                htmlData["3"] += "</tbody></table>";
                htmlData["4"] += "</tbody></table>";
                htmlData["6"] += "</tbody></table>";
                htmlData["7"] += "</tbody></table>";

                $("#viewersAdminList").html(htmlData["1"]);
                $('.table_1').footable();

                $("#viewersModList").html(htmlData["2"]);
                $('.table_2').footable();

                $("#viewersSubList").html(htmlData["3"]);
                $('.table_3').footable();

                $("#viewersDonatorList").html(htmlData["4"]);
                $('.table_4').footable();

                $("#viewersRegList").html(htmlData["6"]);
                $('.table_6').footable();

                $("#viewersViewerList").html(htmlData["7"]);
                $('.table_7').footable();

                // Reset everything back now that the data displayed //
                loadedGroups = false;
                loadedTime = false;
                loadedPoints = false;
                loadedLastSeen = false;
                loadedTimeout = false;
                loadedChat = false;
                loadedFollowed = false;

                lastseenData = [];
                groupData = [];
                timeData = [];
                pointsData = [];
                chatData = [];
                timeoutData = [];
                followedData = [];
            }
        }
    }

    /**
     * @function doQuery
     */
    function doQuery() {
        sendDBKeys("viewers_lastseen", "lastseen");
        sendDBKeys("viewers_groups", "group");
        sendDBKeys("viewers_time", "time");
        sendDBKeys("viewers_points", "points");
        sendDBKeys("viewers_followed", "followed");
        sendDBKeys("viewers_visited", "visited");
        if (panelStatsEnabled) {
            sendDBKeys("viewers_timeout", "panelmoduserstats");
            sendDBKeys("viewers_chat", "panelchatuserstats");
        }

        $("#viewersAdminList").html("Refreshing Data <i class='fa fa-spinner fa-spin' aria-hidden='true'></i>");
        $("#viewersModList").html("Refreshing Data <i class='fa fa-spinner fa-spin' aria-hidden='true'></i>");
        $("#viewersSubList").html("Refreshing Data <i class='fa fa-spinner fa-spin' aria-hidden='true'></i>");
        $("#viewersDonatorList").html("Refreshing Data <i class='fa fa-spinner fa-spin' aria-hidden='true'></i>");
        $("#viewersRegList").html("Refreshing Data <i class='fa fa-spinner fa-spin' aria-hidden='true'></i>");
        $("#viewersViewerList").html("Refreshing Data <i class='fa fa-spinner fa-spin' aria-hidden='true'></i>");
    }

    /**
     * @function sortPointsTable
     * @param {Object} a
     * @param {Object} b
     */
    function sortUsersTable_alpha_desc(a, b) {
        return panelStrcmp(b, a);
    };

    function sortUsersTable_alpha_asc(a, b) {
        return panelStrcmp(a, b);
    };

    /**
     * @function updateUserPerm
     */
    function updateUserPerm(perm) {
        var username = $("#promoteUser" + perm).val();
        if (username.length != 0) {
            if (perm == 'Admin') {
                sendDBUpdate('user_perm', 'group', username.toLowerCase(), '1');
                sendCommand('permissionsetuser ' + username.toLowerCase() + ' 1');
            }

            if (perm == 'Mod') {
                sendDBUpdate('user_perm', 'group', username.toLowerCase(), '2');
                sendCommand('permissionsetuser ' + username.toLowerCase() + ' 2');
            }

            if (perm == 'Sub') {
                sendDBUpdate('user_perm', 'group', username.toLowerCase(), '3');
                sendCommand('permissionsetuser ' + username.toLowerCase() + ' 3');
            }

            if (perm == 'Donator') {
                sendDBUpdate('user_perm', 'group', username.toLowerCase(), '4');
                sendCommand('permissionsetuser ' + username.toLowerCase() + ' 4');
            }

            /*
            if (perm == 'Hoster') {
                sendDBUpdate('user_perm', 'group', username.toLowerCase(), '5');
            }*/

            if (perm == 'Reg') {
                sendDBUpdate('user_perm', 'group', username.toLowerCase(), '6');
                sendCommand('permissionsetuser ' + username.toLowerCase() + ' 6');
            }
        }

        $("#promoteUser" + perm).val('');
        doQuery();
    };

    /**
     * @function updateUserPerm
     */
    function demoteUser(perm) {
        var username = $("#unPromoteUser" + perm).val();
        if (username.length != 0) {
            sendDBDelete('user_perm', 'group', username.toLowerCase());
            sendCommand('permissionsetuser ' + username.toLowerCase() + ' 7');
        }
        $("#unPromoteUser" + perm).val('');
        doQuery();
    };

    /**
     * @function fixFollower
     */
    function fixFollower() {
        var username = $("#fixFollower").val();
        if (username.length != 0) {
            sendDBUpdate('user_follows', 'followed', username.toLowerCase(), 'true');
        }
        $("#fixFollower").val('');
        doQuery();
    };

    // Import the HTML file for this panel.
    $("#viewersPanel").load("/panel/viewers.html");

    // Load the DB items for this panel, wait to ensure that we are connected.
    var interval = setInterval(function () {
        if (isConnected && TABS_INITIALIZED) {
            var active = $("#tabs").tabs("option", "active");
            if (active == 7) {
                doQuery();
                clearInterval(interval);
            }
        }
    }, INITIAL_WAIT_TIME);

    // Query the DB every 30 seconds for updates.
    /*
        setInterval(function() {
            var active = $("#tabs").tabs("option", "active");
            if (active == 5 && isConnected && !isInputFocus()) {
                newPanelAlert('Refreshing Viewers Data', 'success', 1000);
                doQuery();
            }
        }, 3e4);
    */

    // Export functions - Needed when calling from HTML.
    $.viewersOnMessage = onMessage;
    $.viewersDoQuery = doQuery;
    $.updateUserPerm = updateUserPerm;
    $.demoteUser = demoteUser;
    $.fixFollower = fixFollower;
})();
