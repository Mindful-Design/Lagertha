(function() {

    /**
     * @event command
     */
    $.bind('command', function(event) {
        var defaultConsole = 'ps'; // Change this to xbox or ps
        var command = event.getCommand();
        var args = event.getArgs();

        if (command.equalsIgnoreCase('overwatch')) {

            var action = args[0];
            var gamertag = args[1];
            var console = args[2];

            try {
                var HttpRequest = Packages.com.gmt2001.HttpRequest;
                var HashMap = Packages.java.util.HashMap;
                var h = new HashMap(1);
                var r = HttpRequest.getData(HttpRequest.RequestType.GET, 'https://2g.be/twitch/Overwatch/command/action=' + action + '&gamertag=' + gamertag + '&user=' + event.getSender() + '&channel=' + $.channelName + '&console=' + console + '&defaultconsole=' + defaultConsole + '&bot=phantombot', '', h); 
                if (r.success) {
                    $.say(r.content);
                } else {
                    if (r.httpCode == 0) {
                        $.say('Failed to connect to the server, please contact Xgerhard on twitch or tweet at @gerhardoh, error code 0');
                    } else {
                        $.say('Failed to connect to the server, please contact Xgerhard on twitch or tweet at @gerhardoh, error code 1');
                    }
                }
            } catch (e) {
                $.say('Failed to connect to the server, please contact Xgerhard on twitch or tweet at @gerhardoh, error code 2');
            }
        }
    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./commands/XgOverwatchTracker.js')) {
            $.registerChatCommand('./commands/XgOverwatchTracker.js', 'overwatch');
        }   
    }); 
})();