const SQLite = require('SQLite');
let sql = new SQLite();
sql.open('your DB file path'); // DB 파일 경로 설정 필수 / DB file path setting required

let index = 0;
let prefix = '!'; // 접두사 수정 선택 / Select Modifying Prefix

function responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
    if (NoonWhether()) {
        sql.query('DELETE FROM CHATLOG');
    }

    if (room == 'yout room name') { // 채팅방 이름 수정 필수 / Modifying chat room name is required
        if (sender != 'your bot name') { // 봇 이름 수정 필수 / Bot Name Modification Required
            let nowTime = TimeNow();
            sql.query('INSERT INTO CHATLOG VALUES("' + room + '", "' + nowTime[0] + '", ' + nowTime[1] + ', ' + nowTime[2] + ', "' + sender + '", "' + msg + '")');

            if (findUser(sender)) {
                sql.query('UPDATE USERCHAT SET CHATINGNUM = CHATINGNUM + 1 WHERE NAME = "' + sender + '"');
            } else {
                sql.query('INSERT INTO USERCHAT VALUES("' + sender + '", 1)');
            }
        }

        if (msg == prefix + '채팅 기록') {
            let cursor = sql.query('SELECT * FROM CHATLOG WHERE ROOM = "' + room + '"');
            cursor.moveToFirst();
            let result = [], chatLog = [];
            index = 0;

            result[index] = {
                r: cursor.getString(0),
                t: cursor.getString(1),
                h: cursor.getInt(2),
                m: cursor.getInt(3),
                n: cursor.getString(4),
                d: cursor.getString(5)
            };
            chatLog[index] = String(result[index].t) + ' ' + Number(result[index].h) + '시 ' + Number(result[index].m) + '분 | ' + String(result[index].n) + ' : ' + String(result[index].d);

            while (cursor.moveToNext()) {
                index++;
                result[index] = {
                    r: cursor.getString(0),
                    t: cursor.getString(1),
                    h: cursor.getInt(2),
                    m: cursor.getInt(3),
                    n: cursor.getString(4),
                    d: cursor.getString(5)
                };
                chatLog[index] = String(result[index].t) + ' ' + Number(result[index].h) + '시 ' + Number(result[index].m) + '분 | ' + String(result[index].n) + ' : ' + String(result[index].d);
            }
            let log = '채팅로그​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​\n\n*모든 채팅기록은 매일 밤 11시 59분에 삭제됩니다.\n==========\n';
            log += chatLog.join('\n');
            replier.reply(log);
        }

        if (msg.startsWith(prefix + '채팅 순위')) {
            let top = msg.split(' ');
            let rankCursor, topNum;

            if (top.length > 2) {
                topNum = Number(top[2]);
                rankCursor = sql.query('SELECT * FROM USERCHAT ORDER BY CHATINGNUM DESC LIMIT ' + topNum);
            } else {
                topNum = 10;
                rankCursor = sql.query('SELECT * FROM USERCHAT ORDER BY CHATINGNUM DESC LIMIT 10');
            }

            rankCursor.moveToFirst();
            let user = [], rank = [], rankNum = 1;
            index = 0;

            index++;
            user[index] = {
                n: rankCursor.getString(0),
                d: rankCursor.getInt(1)
            };
            rank[index] = rankNum + '위 ' + user[index].n + ' | ' + user[index].d + '회';
            rankNum++;

            while (rankCursor.moveToNext()) {
                index++;
                user[index] = {
                    n: rankCursor.getString(0),
                    d: rankCursor.getInt(1)
                };
                rank[index] = rankNum + '위 ' + user[index].n + ' | ' + user[index].d + '회';
                rankNum++;
            }

            let rankResult = '채팅순위 top' + topNum + '​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​\n';
            rankResult += rank.join('\n');
            replier.reply(rankResult);
        }

        if (msg == '>기록삭제') {
            sql.query('DELETE FROM CHATLOG');
        }

        if (msg == '>순위삭제') {
            sql.query('DLETE FROM USERCHAT');
        }
    }
}

function TimeNow() {
    let now = new Date();

    let hours = now.getHours();
    let minutes = now.getMinutes();

    let meridiem = hours >= 12 ? '오후' : '오전';

    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;

    let time = [String(meridiem), Number(hours), Number(minutes)];

    return time;
}

function NoonWhether() {
    var currentDate = new Date();
    var targetTime = new Date();
    targetTime.setHours(23, 59, 59, 700);

    if (currentDate.getTime() < targetTime.getTime()) {
        return false;
    } else {
        return true;
    }
}

function findUser(sender) {
    let find = sql.query('SELECT NAME FROM USERCHAT WHERE NAME = "' + sender + '"');
    find.moveToFirst();

    try {
        let user = find.getString(0);
        return user !== null;
    } catch (e) {
        return false;
    }
}


//대응소스
function onNotificationPosted(sbn, sm) {
    var packageName = sbn.getPackageName();
    if (!packageName.startsWith("com.kakao.tal"))
        return;
    var actions = sbn.getNotification().actions;
    if (actions == null)
        return;
    var userId = sbn.getUser().hashCode();
    for (var n = 0; n < actions.length; n++) {
        var action = actions[n];
        if (action.getRemoteInputs() == null)
            continue;
        var bundle = sbn.getNotification().extras;
        var msg = bundle.get("android.text").toString();
        var sender = bundle.getString("android.title");
        var room = bundle.getString("android.subText");
        if (room == null)
            room = bundle.getString("android.summaryText");
        var isGroupChat = room != null;
        if (room == null)
            room = sender;
        var replier = new com.xfl.msgbot.script.api.legacy.SessionCacheReplier(packageName, action, room, false, "");
        var icon = bundle.getParcelableArray("android.messages")[0].get("sender_person").getIcon().getBitmap();
        var image = bundle.getBundle("android.wearable.EXTENSIONS");
        if (image != null)
            image = image.getParcelable("background");
        var imageDB = new com.xfl.msgbot.script.api.legacy.ImageDB(icon, image);
        com.xfl.msgbot.application.service.NotificationListener.Companion.setSession(packageName, room, action);
        if (this.hasOwnProperty("responseFix")) {
            responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName, userId != 0);
        }
    }
}
