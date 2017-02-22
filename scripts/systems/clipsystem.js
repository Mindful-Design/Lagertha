/**
 * clipSystem.js
 *
 * Have the bot remember the most epic/derpy moment using twitchclip
 * based on orginal quoteSystem.js from PhantomBot-2.3.4.1
 */
(function() {
    
    /**
     * @function updateClip
     * @param {Number} clipid
     * @param {Array} clip data
     */
    function updateClip(clipId, clip) {
        // Specify String() for objects as they were being treated as an object rather than a String on stringify().
        $.inidb.set('clips', clipId, JSON.stringify([String(clip[0]), String(clip[1]), String(clip[2]), String(clip[3])]));
    }
    
    /**
     * @function saveClip
     * @param {string} clipUrl
     * @param {string} com clip comment
     * @returns {Number}
     */
    function saveClip(clipUrl, com) {
        var newKey = $.inidb.GetKeyList('clips', '').length,
            game = ($.getGame($.channelName) != '' ? $.getGame($.channelName) : "No Game !");
            $.consoleLn(JSON.stringify([String(clipUrl), com, $.systemTime(), game + '']));
        $.inidb.set('clips', newKey, JSON.stringify([String(clipUrl), String(com), $.systemTime(), game + '']));
        return newKey;
    };
    
    /**
     * @function deleteClip
     * @param {Number} clipId
     * @returns {Number}
     */
    function deleteClip(clipId) {
        var clipKeys,
            clips = [],
            i;
            
        if ($.inidb.exists('clips', clipId)) {
            $.inidb.del('clips', clipId);
            clipKeys = $.inidb.GetKeyList('clips', '');
            
            for (i in clipKeys) {
                clips.push($.inidb.get('clips', clipKeys[i]));
                $.inidb.del('clips', clipKeys[i]);
            }
            
            for (i in clips) {
                $.inidb.set('clips', i, clips[i]);
            }
            
            return (clips.length ? clips.length : 0);
        }
        else {
            return -1;
        }
    };
    
    /**
     * @function getClip
     * @param {Number} clipId
     * @returns {Array}
     */
    function getClip(clipId) {
        var clip;
        if (!clipId || isNaN(clipId)) {
            clipId = $.rand($.inidb.GetKeyList('clips', '').length - 1);
        }
        
        if ($.inidb.exists('clips', clipId)) {
            clip = JSON.parse($.inidb.get('clips', clipId));
            clip.push(clipId);
            return clip;
        }
        else {
            return [];
        }
    };
    
    /**
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender(),
            command = event.getCommand(),
            args = event.getArgs(),
            clip,
            urlPattern = new RegExp('^(:?http(?:s)?://?)?clips\.twitch\.tv/'),
            clipStr;
            
        /**
         * @commandpath editclip [id] [clip|game|com] [text]
         */
        if (command.equalsIgnoreCase("editclip")) {
            if (args.length < 3) {
                $.say($.whisperPrefix(sender) + $.lang.get('clipsystem.edit.usage'));
                return;
            }
            
            clip = getClip(args[0]);
            if (clip.length > 0) {
                if (args[1].equalsIgnoreCase("clip")) {
                    if (!urlPattern.test(args[2])) {
                        $.say($.whisperPrefix(sender) + $.lang.get('clipsystem.url.403', args[2]));
                        return;
                    }
                    clip[0] = args[2];
                    updateClip(args[0], clip);
                    $.say($.whisperPrefix(sender) + $.lang.get('clipsystem.edit.url.success', args[0], args[2]));
                }
                else if (args[1].equalsIgnoreCase("com")) {
                    clip[1] = args.splice(2).join(' ');
                    updateClip(args[0], clip);
                    $.say($.whisperPrefix(sender) + $.lang.get('clipsystem.edit.com.success', args[0], clip[1]));
                }
                else if (args[1].equalsIgnoreCase("game")) {
                    clip[3] = args.splice(2).join(' ');
                    updateClip(args[0], clip);
                    $.say($.whisperPrefix(sender) + $.lang.get('clipsystem.edit.game.success', args[0], clip[3]));
                }
                else {
                    $.say($.whisperPrefix(sender) + $.lang.get('clipsystem.edit.usage'));
                }
            }
            else {
                $.say($.whisperPrefix(sender) + $.lang.get('clipsystem.edit.404', (typeof args[0] != 'undefined' ? '#'+args[0] : '')));
            }
            
            $.log.event(sender + ' edited clip #' + clip);
            return;
        }
        
        /**
         * @commandpath editclipstealth [id] [clip|game|com] [text] but in stealth mode (Feedback only by /w !)
         */
        if (command.equalsIgnoreCase("editclipstealth")) {
            if (args.length < 3) {
                $.say($.whisperPrefix(sender,true) + $.lang.get('clipsystem.edit.usage'));
                return;
            }
            
            clip = getClip(args[0]);
            if (clip.length > 0) {
                if (args[1].equalsIgnoreCase("clip")) {
                    if (!urlPattern.test(args[2])) {
                        $.say($.whisperPrefix(sender,true) + $.lang.get('clipsystem.url.403', args[2]));
                        return;
                    }
                    clip[0] = args[2];
                    updateClip(args[0], clip);
                    $.say($.whisperPrefix(sender,true) + $.lang.get('clipsystem.edit.url.success', args[0], args[2]));
                }
                else if (args[1].equalsIgnoreCase("com")) {
                    clip[1] = args.splice(2).join(' ');
                    updateClip(args[0], clip);
                    $.say($.whisperPrefix(sender,true) + $.lang.get('clipsystem.edit.com.success', args[0], clip[1]));
                }
                else if (args[1].equalsIgnoreCase("game")) {
                    clip[3] = args.splice(2).join(' ');
                    updateClip(args[0], clip);
                    $.say($.whisperPrefix(sender,true) + $.lang.get('clipsystem.edit.game.success', args[0], clip[3]));
                }
                else {
                    $.say($.whisperPrefix(sender,true) + $.lang.get('clipsystem.edit.usage'));
                }
            }
            else {
                $.say($.whisperPrefix(sender,true) + $.lang.get('clipsystem.edit.404', (typeof args[0] != 'undefined' ? '#'+args[0] : '')));
            }
            
            $.log.event(sender + ' edited clip #' + clip);
            return;
        }
        
        /**
         * @commandpath addclip [clipUrl com] - Save a clip with an optional comment
         */
        if (command.equalsIgnoreCase('addclip')) {
            if (args.length < 1) {
                $.say($.whisperPrefix(sender) + $.lang.get('clipsystem.add.usage'));
                return;
            }
            var com = (args.length >= 2) ? args.splice(1).join(' ') : '';
            
            var clipUrl = args.shift();
            if (!urlPattern.test(clipUrl)) {
                $.say($.whisperPrefix(sender) + $.lang.get('clipsystem.url.403', clipUrl));
                return;
            }
            
            $.log.event(sender + ' added a clip "' + clipUrl+ '" commented with "' + com + '".');
            $.say($.lang.get('clipsystem.add.success', $.username.resolve(sender), saveClip(clipUrl, com)));
            return;
        }
        
        /**
         * @commandpath addclip [clipUrl com] - Save a clip with an optional comment but in stealth mode (Feedback only by /w !)
         */
        if (command.equalsIgnoreCase('addclipstealth')) {
            if (args.length < 1) {
                $.say($.whisperPrefix(sender,true) + $.lang.get('clipsystem.add.usage'));
                return;
            }
            var com = (args.length >= 2) ? args.splice(1).join(' ') : '';
            var clipUrl = args.shift();
            if (!urlPattern.test(clipUrl)) {
                $.say($.whisperPrefix(sender,true) + $.lang.get('clipsystem.url.403', clipUrl));
                return;
            }
            
            $.log.event(sender + ' added a clip "' + clipUrl+ '" commented with "' + com + '".');
            $.say($.whisperPrefix(sender,true) + $.lang.get('clipsystem.add.success', $.username.resolve(sender), saveClip(clipUrl, com)));
            return;
        }
        
        /**
         * @commandpath delclip [clipId] - Delete a clip
         */
        if (command.equalsIgnoreCase('delclip')) {
            if (!args[0] || isNaN(args[0])) {
                $.say($.whisperPrefix(sender) + $.lang.get('clipsystem.del.usage'));
                return;
            }
            
            var newCount;
            
            if ((newCount = deleteClip(args[0])) >= 0) {
                $.say($.whisperPrefix(sender) + $.lang.get('clipsystem.del.success', args[0], newCount));
            } else {
                $.say($.whisperPrefix(sender) + $.lang.get('clipsystem.del.404', args[0]));
            }
            
            $.log.event(sender + ' removed clip with id: ' + args[0]);
        }
        
        /**
         * @commandpath delclipstealth [clipId] - Delete a clip but in stealth mode (Feedback only by /w !)
         */
        if (command.equalsIgnoreCase('delclipstealth')) {
            if (!args[0] || isNaN(args[0])) {
                $.say($.whisperPrefix(sender, true) + $.lang.get('clipsystem.del.usage'));
                return;
            }
            var newCount;
            if ((newCount = deleteClip(args[0])) >= 0) {
                $.say($.whisperPrefix(sender, true) + $.lang.get('clipsystem.del.success', args[0], newCount));
            } else {
                $.say($.whisperPrefix(sender, true) + $.lang.get('clipsystem.del.404', args[0]));
            }
            $.log.event(sender + ' removed clip with id: ' + args[0]);
        }
        
        /**
         * @commandpath clip [clipId] - Announce a clip by its Id, omit the id parameter to get a random clip
         */
        if (command.equalsIgnoreCase('clip')) {
            clip = getClip(args[0]);
            if (clip.length > 0) {
                clipStr = ($.inidb.exists('settings', 'clipFormat') ? $.inidb.get('settings', 'clipFormat') : $.lang.get('clipsystem.clipformat.default'));
                var comStr = ($.inidb.exists('settings', 'clipComFormat') ? $.inidb.get('settings', 'clipComFormat') : $.lang.get('clipsystem.clipcomformat.default'));
                $.consoleLn('clipFormat is «' +clipStr+'»');
                clipStr
                    = clipStr
                    .replace('(clip)', clip[0])
                    .replace('(date)', $.getLocalTimeString('dd-MM-yyyy', parseInt(clip[2])))
                    .replace('(game)', clip[3])
                    .replace('(id)', clip[4].toString())
                    .replace('(com)', (clip[1]) ? comStr.replace('(com)', clip[1]) : '')
                ;
                $.say(clipStr);
            }
            else {
                $.say($.whisperPrefix(sender) + $.lang.get('clipsystem.get.404', (typeof args[0] != 'undefined' ? '#'+args[0] : '')));
            }
        }
        
        /**
         * @commandpath clipcomformat [message] - Sets the com part of the clip string with tag: (com), if there is no (com) in the given quote then this will not appeare (or if (com) is not use in clipformat string)
         */
        if (command.equalsIgnoreCase('clipcomformat')) {
            if (!args[0]) {
                $.say($.whisperPrefix(sender) + $.lang.get('clipsystem.clipcomformat.usage'));
                return;
            }
            
            var comStr = args.splice(0).join(' ');
            $.inidb.set('settings', 'clipComFormat', comStr);
            $.say($.whisperPrefix(sender) + $.lang.get('clipsystem.clipcomformat.success'));
            $.log.event(sender + ' changed the com clip message to: ' + comStr);
        }
        
        /**
         * @commandpath clipformat [message] - Sets the clip string with tags: (id) (clip) (com) (game) (date)
         */
        if (command.equalsIgnoreCase('clipformat')) {
            if (!args[0]) {
                $.say($.whisperPrefix(sender) + $.lang.get('clipsystem.clipformat.usage'));
                return;
            }
            
            clipStr = args.splice(0).join(' ');
            $.inidb.set('settings', 'clipFormat', clipStr);
            $.say($.whisperPrefix(sender) + $.lang.get('clipsystem.clipformat.success'));
            $.log.event(sender + ' changed the clip message to: ' + clipStr);
        }
        
        /**
         * @commandpath cliphelp - list all the commande and default restriction level but as a wisp
         */
        if (command.equalsIgnoreCase('cliphelp')) {
            $.lang.get('clipsystem.list').split("\n").forEach(function(val) {
                $.say($.whisperPrefix(sender, true ) + val);
            });
        }
    });
    
    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        if ($.bot.isModuleEnabled('./systems/clipSystem.js')) {
            $.registerChatCommand('./systems/clipSystem.js', 'addclip');
            $.registerChatCommand('./systems/clipSystem.js', 'addclipstealth', 1);
            $.registerChatCommand('./systems/clipSystem.js', 'delclip', 2);
            $.registerChatCommand('./systems/clipSystem.js', 'delclipstealth', 1);
            $.registerChatCommand('./systems/clipSystem.js', 'editclip', 2);
            $.registerChatCommand('./systems/clipSystem.js', 'editclipstealth', 1);
            $.registerChatCommand('./systems/clipSystem.js', 'clip');
            $.registerChatCommand('./systems/clipSystem.js', 'clipformat', 1);
            $.registerChatCommand('./systems/clipSystem.js', 'clipcomformat', 1);
            $.registerChatCommand('./systems/clipSystem.js', 'cliphelp', 1);
        }
    });
})();