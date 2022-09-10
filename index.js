var AWS = require('aws-sdk');
const { Client, Intents } = require('discord.js');
const config = require('./config.json');
const discordClient = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
var credentials = new AWS.SharedIniFileCredentials({profile: config.awsProfileName});
AWS.config.credentials = credentials;
AWS.config.region = config.awsRegion;
const dynamo = new AWS.DynamoDB.DocumentClient();
const emojiRegexRGI = require('emoji-regex/RGI_Emoji.js');

const PAGE_SIZE = 10;
const MAX_PAGES = 1;

discordClient.once('ready', () => {
    discordClient.guilds.cache.forEach(server => {
        server.members.fetch();
    });
    console.log('Ready!');
});

discordClient.on('messageReactionAdd', (messageReaction, user) => {
    if (messageReaction && user && messageReaction.message && messageReaction.emoji && (messageReaction.emoji.id || messageReaction.emoji.name) && messageReaction.message.author && !messageReaction.message.author.bot && user.id && !user.bot) {
        let emojiId;
        if (messageReaction.emoji.id) {
            emojiId = messageReaction.emoji.id;
        }
        else {
            emojiId = messageReaction.emoji.name;
        }
        let params = {
            ExpressionAttributeNames: {
                '#ic': 'itemCount',
                '#lu': 'lastUsed'
            },
            ExpressionAttributeValues: {
                ':incr': 1,
                ':lu': new Date().toString(),
                ':zero': 0
            }, 
            Key: {
                reactionKey: 'userByChannel#' + messageReaction.message.guild.id + '#' + messageReaction.message.channel.id,
                subKey: user.id
            },
            TableName: config.awsDynamoDBTableName,
            UpdateExpression: 'SET #ic = if_not_exists(#ic, :zero) + :incr, #lu = :lu'
        };
        dynamo.update(params, function(err, data){
            if (err) {
                console.error(err);
            }
        });
        params = {
            ExpressionAttributeNames: {
                '#ic': 'itemCount',
                '#lu': 'lastUsed'
            },
            ExpressionAttributeValues: {
                ':incr': 1,
                ':lu': new Date().toString(),
                ':zero': 0
            }, 
            Key: {
                reactionKey: 'userByChannelReceived#' + messageReaction.message.guild.id + '#' + messageReaction.message.channel.id,
                subKey: messageReaction.message.author.id
            },
            TableName: config.awsDynamoDBTableName,
            UpdateExpression: 'SET #ic = if_not_exists(#ic, :zero) + :incr, #lu = :lu'
        };
        dynamo.update(params, function(err, data){
            if (err) {
                console.error(err);
            }
        });
        params = {
            ExpressionAttributeNames: {
                '#ic': 'itemCount',
                '#lu': 'lastUsed'
            },
            ExpressionAttributeValues: {
                ':incr': 1,
                ':lu': new Date().toString(),
                ':zero': 0
            }, 
            Key: {
                reactionKey: 'emojiByChannel#' + messageReaction.message.guild.id + '#' + messageReaction.message.channel.id,
                subKey: emojiId
            },
            TableName: config.awsDynamoDBTableName,
            UpdateExpression: 'SET #ic = if_not_exists(#ic, :zero) + :incr, #lu = :lu'
        };
        dynamo.update(params, function(err, data){
            if (err) {
                console.error(err);
            }
        });
        params = {
            ExpressionAttributeNames: {
                '#ic': 'itemCount',
                '#lu': 'lastUsed'
            },
            ExpressionAttributeValues: {
                ':incr': 1,
                ':lu': new Date().toString(),
                ':zero': 0
            }, 
            Key: {
                reactionKey: 'emojiByUser#' + messageReaction.message.guild.id + '#' + messageReaction.message.channel.id + '#' + user.id,
                subKey: emojiId
            },
            TableName: config.awsDynamoDBTableName,
            UpdateExpression: 'SET #ic = if_not_exists(#ic, :zero) + :incr, #lu = :lu'
        };
        dynamo.update(params, function(err, data){
            if (err) {
                console.error(err);
            }
        });
        params = {
            ExpressionAttributeNames: {
                '#ic': 'itemCount',
                '#lu': 'lastUsed'
            },
            ExpressionAttributeValues: {
                ':incr': 1,
                ':lu': new Date().toString(),
                ':zero': 0
            }, 
            Key: {
                reactionKey: 'emojiByUserReceived#' + messageReaction.message.guild.id + '#' + messageReaction.message.channel.id + '#' + messageReaction.message.author.id,
                subKey: emojiId
            },
            TableName: config.awsDynamoDBTableName,
            UpdateExpression: 'SET #ic = if_not_exists(#ic, :zero) + :incr, #lu = :lu'
        };
        dynamo.update(params, function(err, data){
            if (err) {
                console.error(err);
            }
        });
        params = {
            ExpressionAttributeNames: {
                '#ic': 'itemCount',
                '#lu': 'lastUsed'
            },
            ExpressionAttributeValues: {
                ':incr': 1,
                ':lu': new Date().toString(),
                ':zero': 0
            }, 
            Key: {
                reactionKey: 'userByEmoji#' + messageReaction.message.guild.id + '#' + messageReaction.message.channel.id + '#' + emojiId,
                subKey: user.id
            },
            TableName: config.awsDynamoDBTableName,
            UpdateExpression: 'SET #ic = if_not_exists(#ic, :zero) + :incr, #lu = :lu'
        };
        dynamo.update(params, function(err, data){
            if (err) {
                console.error(err);
            }
        });
        params = {
            ExpressionAttributeNames: {
                '#ic': 'itemCount',
                '#lu': 'lastUsed'
            },
            ExpressionAttributeValues: {
                ':incr': 1,
                ':lu': new Date().toString(),
                ':zero': 0
            }, 
            Key: {
                reactionKey: 'userByEmojiReceived#' + messageReaction.message.guild.id + '#' + messageReaction.message.channel.id + '#' + emojiId,
                subKey: messageReaction.message.author.id
            },
            TableName: config.awsDynamoDBTableName,
            UpdateExpression: 'SET #ic = if_not_exists(#ic, :zero) + :incr, #lu = :lu'
        };
        dynamo.update(params, function(err, data){
            if (err) {
                console.error(err);
            }
        });
    }
});

discordClient.on('messageReactionRemove', (messageReaction, user) => {
    if (messageReaction && user && messageReaction.message && messageReaction.emoji && (messageReaction.emoji.id || messageReaction.emoji.name) && messageReaction.message.author && !messageReaction.message.author.bot && user.id && !user.bot) {
        let emojiId;
        if (messageReaction.emoji.id) {
            emojiId = messageReaction.emoji.id;
        }
        else {
            emojiId = messageReaction.emoji.name;
        }
        let params = {
            ExpressionAttributeNames: {
                '#ic': 'itemCount'
            },
            ExpressionAttributeValues: {
                ':decr': 1
            }, 
            Key: {
                reactionKey: 'userByChannel#' + messageReaction.message.guild.id + '#' + messageReaction.message.channel.id,
                subKey: user.id
            },
            TableName: config.awsDynamoDBTableName,
            UpdateExpression: 'SET #ic = #ic - :decr',
            ConditionExpression: '#ic >= :decr'
        };
        dynamo.update(params, function(err, data){
            if (err) {
                console.error(err);
            }
        });
        params = {
            ExpressionAttributeNames: {
                '#ic': 'itemCount'
            },
            ExpressionAttributeValues: {
                ':decr': 1
            }, 
            Key: {
                reactionKey: 'userByChannelReceived#' + messageReaction.message.guild.id + '#' + messageReaction.message.channel.id,
                subKey: messageReaction.message.author.id
            },
            TableName: config.awsDynamoDBTableName,
            UpdateExpression: 'SET #ic = #ic - :decr',
            ConditionExpression: '#ic >= :decr'
        };
        dynamo.update(params, function(err, data){
            if (err) {
                console.error(err);
            }
        });
        params = {
            ExpressionAttributeNames: {
                '#ic': 'itemCount'
            },
            ExpressionAttributeValues: {
                ':decr': 1
            }, 
            Key: {
                reactionKey: 'emojiByChannel#' + messageReaction.message.guild.id + '#' + messageReaction.message.channel.id,
                subKey: emojiId
            },
            TableName: config.awsDynamoDBTableName,
            UpdateExpression: 'SET #ic = #ic - :decr',
            ConditionExpression: '#ic >= :decr'
        };
        dynamo.update(params, function(err, data){
            if (err) {
                console.error(err);
            }
        });
        params = {
            ExpressionAttributeNames: {
                '#ic': 'itemCount'
            },
            ExpressionAttributeValues: {
                ':decr': 1
            }, 
            Key: {
                reactionKey: 'emojiByUser#' + messageReaction.message.guild.id + '#' + messageReaction.message.channel.id + '#' + user.id,
                subKey: emojiId
            },
            TableName: config.awsDynamoDBTableName,
            UpdateExpression: 'SET #ic = #ic - :decr',
            ConditionExpression: '#ic >= :decr'
        };
        dynamo.update(params, function(err, data){
            if (err) {
                console.error(err);
            }
        });
        params = {
            ExpressionAttributeNames: {
                '#ic': 'itemCount'
            },
            ExpressionAttributeValues: {
                ':decr': 1
            }, 
            Key: {
                reactionKey: 'emojiByUserReceived#' + messageReaction.message.guild.id + '#' + messageReaction.message.channel.id + '#' + messageReaction.message.author.id,
                subKey: emojiId
            },
            TableName: config.awsDynamoDBTableName,
            UpdateExpression: 'SET #ic = #ic - :decr',
            ConditionExpression: '#ic >= :decr'
        };
        dynamo.update(params, function(err, data){
            if (err) {
                console.error(err);
            }
        });
        params = {
            ExpressionAttributeNames: {
                '#ic': 'itemCount'
            },
            ExpressionAttributeValues: {
                ':decr': 1
            }, 
            Key: {
                reactionKey: 'userByEmoji#' + messageReaction.message.guild.id + '#' + messageReaction.message.channel.id + '#' + emojiId,
                subKey: user.id
            },
            TableName: config.awsDynamoDBTableName,
            UpdateExpression: 'SET #ic = #ic - :decr',
            ConditionExpression: '#ic >= :decr'
        };
        dynamo.update(params, function(err, data){
            if (err) {
                console.error(err);
            }
        });
        params = {
            ExpressionAttributeNames: {
                '#ic': 'itemCount'
            },
            ExpressionAttributeValues: {
                ':decr': 1
            }, 
            Key: {
                reactionKey: 'userByEmojiReceived#' + messageReaction.message.guild.id + '#' + messageReaction.message.channel.id + '#' + emojiId,
                subKey: messageReaction.message.author.id
            },
            TableName: config.awsDynamoDBTableName,
            UpdateExpression: 'SET #ic = #ic - :decr',
            ConditionExpression: '#ic >= :decr'
        };
        dynamo.update(params, function(err, data){
            if (err) {
                console.error(err);
            }
        });
    }
});

discordClient.on('message', message => {
    if (message && message.guild && message.guild.id && message.content && message.channel && message.channel.id && message.content.toLowerCase().trim() === '!reacts users') {
        let params = {
            ExpressionAttributeValues: {
                ':rk': 'userByChannel#' + message.guild.id + '#' + message.channel.id
            }, 
            KeyConditionExpression: 'reactionKey = :rk',
            TableName: config.awsDynamoDBTableName
        };
        dynamo.query(params, function(err, data) {
            if (err) {
                console.error(err);
            }
            else {
                data.Items.sort((a, b) => (a.itemCount < b.itemCount) ? 1 : -1);
                let response = [];
                for (let i = 0; i < data.Items.length; i++) {
                    if (message.guild.members.resolve(data.Items[i].subKey) && data.Items[i].itemCount) {
                        response.push({user: message.guild.members.resolve(data.Items[i].subKey).user.tag, count: data.Items[i].itemCount});
                    }
                }
                let responseMessage;
                if (response.length) {
                    response = response.slice(0,PAGE_SIZE);
                    responseMessage = `${message.guild.name} react leaderboard\n`;
                    responseMessage += `users with most reacts sent in #${message.channel.name}\n`;
                    responseMessage += `---------------------------\n`;
                    let userCount = 1;
                    for (let i = 0; i < response.length; i++) {
                        responseMessage += `${userCount}. ${response[i].user}\t|\tCount: ${response[i].count}\n`;
                        userCount += 1;
                    }
                    responseMessage += `---------------------------`;
                }
                if (responseMessage) {
                    message.channel.send(responseMessage).catch(err => {
                        console.error(err);
                    });
                }
            }
        });
        message.delete().catch(err => {
            console.error(err);
        });
    }
    else if (message && message.guild && message.guild.id && message.content && message.channel && message.channel.id && message.content.toLowerCase().trim() === '!reacts users received') {
        let params = {
            ExpressionAttributeValues: {
                ':rk': 'userByChannelReceived#' + message.guild.id + '#' + message.channel.id
            }, 
            KeyConditionExpression: 'reactionKey = :rk',
            TableName: config.awsDynamoDBTableName
        };
        dynamo.query(params, function(err, data) {
            if (err) {
                console.error(err);
            }
            else {
                data.Items.sort((a, b) => (a.itemCount < b.itemCount) ? 1 : -1);
                let response = [];
                for (let i = 0; i < data.Items.length; i++) {
                    if (message.guild.members.resolve(data.Items[i].subKey) && data.Items[i].itemCount) {
                        response.push({user: message.guild.members.resolve(data.Items[i].subKey).user.tag, count: data.Items[i].itemCount});
                    }
                }
                let responseMessage;
                if (response.length) {
                    response = response.slice(0,PAGE_SIZE);
                    responseMessage = `${message.guild.name} react leaderboard\n`;
                    responseMessage += `users with most reacts received in #${message.channel.name}\n`;
                    responseMessage += `---------------------------\n`;
                    let userCount = 1;
                    for (let i = 0; i < response.length; i++) {
                        responseMessage += `${userCount}. ${response[i].user}\t|\tCount: ${response[i].count}\n`;
                        userCount += 1;
                    }
                    responseMessage += `---------------------------`;
                }
                if (responseMessage) {
                    message.channel.send(responseMessage).catch(err => {
                        console.error(err);
                    });
                }
            }
        });
        message.delete().catch(err => {
            console.error(err);
        });
    }
    else if (message && message.guild && message.guild.id && message.content && message.channel && message.channel.id && message.content.toLowerCase().trim() === '!reacts emojis') {
        let params = {
            ExpressionAttributeValues: {
                ':rk': 'emojiByChannel#' + message.guild.id + '#' + message.channel.id
            }, 
            KeyConditionExpression: 'reactionKey = :rk',
            TableName: config.awsDynamoDBTableName
        };
        dynamo.query(params, function(err, data) {
            if (err) {
                console.error(err);
            }
            else {
                data.Items.sort((a, b) => (a.itemCount < b.itemCount) ? 1 : -1);
                let response = [];
                for (let i = 0; i < data.Items.length; i++) {
                    if ((discordClient.emojis.resolve(data.Items[i].subKey) || emojiRegexRGI().exec(data.Items[i].subKey)) && data.Items[i].itemCount) {
                        if (discordClient.emojis.resolve(data.Items[i].subKey)) {
                            response.push({emoji: discordClient.emojis.resolve(data.Items[i].subKey), count: data.Items[i].itemCount});
                        }
                        else {
                            response.push({emoji: emojiRegexRGI().exec(data.Items[i].subKey)[0].toString(), count: data.Items[i].itemCount});
                        }
                    }
                }
                let responseMessage;
                if (response.length) {
                    response = response.slice(0,PAGE_SIZE);
                    responseMessage = `${message.guild.name} react leaderboard\n`;
                    responseMessage += `emojis with most react usage in #${message.channel.name}\n`;
                    responseMessage += `---------------------------\n`;
                    let emojiCount = 1;
                    for (let i = 0; i < response.length; i++) {
                        responseMessage += `${emojiCount}. ${response[i].emoji}\t|\tCount: ${response[i].count}\n`;
                        emojiCount += 1;
                    }
                    responseMessage += `---------------------------`;
                }
                if (responseMessage) {
                    message.channel.send(responseMessage).catch(err => {
                        console.error(err);
                    });
                }
            }
        });
        message.delete().catch(err => {
            console.error(err);
        });
    }
    else if (message && message.guild && message.guild.id && message.content && message.channel && message.channel.id && message.content.toLowerCase().startsWith('!reacts')) {
        if (message.mentions && message.mentions.users && message.mentions.users.first() && !message.content.trim().endsWith('received')) {
            let params = {
                ExpressionAttributeValues: {
                    ':rk': 'emojiByUser#' + message.guild.id + '#' + message.channel.id + '#' + message.mentions.users.first().id
                }, 
                KeyConditionExpression: 'reactionKey = :rk',
                TableName: config.awsDynamoDBTableName
            };
            dynamo.query(params, function(err, data) {
                if (err) {
                    console.error(err);
                }
                else {
                    data.Items.sort((a, b) => (a.itemCount < b.itemCount) ? 1 : -1);
                    let response = [];
                    for (let i = 0; i < data.Items.length; i++) {
                        if (message.guild.members.resolve(message.mentions.users.first().id) && (discordClient.emojis.resolve(data.Items[i].subKey) || emojiRegexRGI().exec(data.Items[i].subKey)) && data.Items[i].itemCount) {
                            if (discordClient.emojis.resolve(data.Items[i].subKey)) {
                                response.push({emoji: discordClient.emojis.resolve(data.Items[i].subKey), count: data.Items[i].itemCount});
                            }
                            else {
                                response.push({emoji: emojiRegexRGI().exec(data.Items[i].subKey)[0].toString(), count: data.Items[i].itemCount});
                            }
                        }
                    }
                    let responseMessage;
                    if (response.length) {
                        response = response.slice(0,PAGE_SIZE);
                        responseMessage = `${message.guild.name} react leaderboard\n`;
                        responseMessage += `reactions most used by ${message.mentions.users.first().tag} in #${message.channel.name}\n`;
                        responseMessage += `---------------------------\n`;
                        let emojiCount = 1;
                        for (let i = 0; i < response.length; i++) {
                            responseMessage += `${emojiCount}. ${response[i].emoji}\t|\tCount: ${response[i].count}\n`;
                            emojiCount += 1;
                        }
                        responseMessage += `---------------------------`;
                    }
                    if (responseMessage) {
                        message.channel.send(responseMessage).catch(err => {
                            console.error(err);
                        });
                    }
                }
            });
            message.delete().catch(err => {
                console.error(err);
            });
        }
        else if (message.mentions && message.mentions.users && message.mentions.users.first() && message.content.trim().endsWith('received')) {
            let params = {
                ExpressionAttributeValues: {
                    ':rk': 'emojiByUserReceived#' + message.guild.id + '#' + message.channel.id + '#' + message.mentions.users.first().id
                }, 
                KeyConditionExpression: 'reactionKey = :rk',
                TableName: config.awsDynamoDBTableName
            };
            dynamo.query(params, function(err, data) {
                if (err) {
                    console.error(err);
                }
                else {
                    data.Items.sort((a, b) => (a.itemCount < b.itemCount) ? 1 : -1);
                    let response = [];
                    for (let i = 0; i < data.Items.length; i++) {
                        if (message.guild.members.resolve(message.mentions.users.first().id) && (discordClient.emojis.resolve(data.Items[i].subKey) || emojiRegexRGI().exec(data.Items[i].subKey)) && data.Items[i].itemCount) {
                            if (discordClient.emojis.resolve(data.Items[i].subKey)) {
                                response.push({emoji: discordClient.emojis.resolve(data.Items[i].subKey), count: data.Items[i].itemCount});
                            }
                            else {
                                response.push({emoji: emojiRegexRGI().exec(data.Items[i].subKey)[0].toString(), count: data.Items[i].itemCount});
                            }
                        }
                    }
                    let responseMessage;
                    if (response.length) {
                        response = response.slice(0,PAGE_SIZE);
                        responseMessage = `${message.guild.name} react leaderboard\n`;
                        responseMessage += `reactions most received by ${message.mentions.users.first().tag} in #${message.channel.name}\n`;
                        responseMessage += `---------------------------\n`;
                        let emojiCount = 1;
                        for (let i = 0; i < response.length; i++) {
                            responseMessage += `${emojiCount}. ${response[i].emoji}\t|\tCount: ${response[i].count}\n`;
                            emojiCount += 1;
                        }
                        responseMessage += `---------------------------`;
                    }
                    if (responseMessage) {
                        message.channel.send(responseMessage).catch(err => {
                            console.error(err);
                        });
                    }
                }
            });
            message.delete().catch(err => {
                console.error(err);
            });
        }
        else if ((message.content.match(/<a:.+?:\d+>|<:.+?:\d+>/) || emojiRegexRGI().exec(message.content)) && !message.content.trim().endsWith('received')) {
            let customEmoji;
            let emojiId;
            if (message.content.match(/<a:.+?:\d+>|<:.+?:\d+>/)) {
                customEmoji = true;
                emojiId = message.content.match(/<a:.+?:\d+>|<:.+?:\d+>/)[0].match(/\d+/)[0].toString();
            }
            else {
                emojiId = emojiRegexRGI().exec(message.content)[0];
            }
            let params = {
                ExpressionAttributeValues: {
                    ':rk': 'userByEmoji#' + message.guild.id + '#' + message.channel.id + '#' + emojiId
                }, 
                KeyConditionExpression: 'reactionKey = :rk',
                TableName: config.awsDynamoDBTableName
            };
            dynamo.query(params, function(err, data) {
                if (err) {
                    console.error(err);
                }
                else {
                    data.Items.sort((a, b) => (a.itemCount < b.itemCount) ? 1 : -1);
                    let response = [];
                    let emojiObject;
                    if (customEmoji) {
                        emojiObject = discordClient.emojis.resolve(emojiId);
                    }
                    else {
                        emojiObject = emojiId.toString();
                    }
                    for (let i = 0; i < data.Items.length; i++) {
                        if (emojiObject && message.guild.members.resolve(data.Items[i].subKey) && data.Items[i].itemCount) {
                            response.push({user: message.guild.members.resolve(data.Items[i].subKey).user.tag, count: data.Items[i].itemCount});
                        }
                    }
                    let responseMessage;
                    if (response.length) {
                        response = response.slice(0,PAGE_SIZE);
                        responseMessage = `${message.guild.name} react leaderboard\n`;
                        responseMessage += `most frequent use of ${emojiObject} in #${message.channel.name}\n`;
                        responseMessage += `---------------------------\n`;
                        let userCount = 1;
                        for (let i = 0; i < response.length; i++) {
                            responseMessage += `${userCount}. ${response[i].user}\t|\tCount: ${response[i].count}\n`;
                            userCount += 1;
                        }
                        responseMessage += `---------------------------`;
                    }
                    if (responseMessage) {
                        message.channel.send(responseMessage).catch(err => {
                            console.error(err);
                        });
                    }
                }
            });
            message.delete().catch(err => {
                console.error(err);
            });
        }
        else if ((message.content.match(/<a:.+?:\d+>|<:.+?:\d+>/) || emojiRegexRGI().exec(message.content)) && message.content.trim().endsWith('received')) {
            let customEmoji;
            let emojiId;
            if (message.content.match(/<a:.+?:\d+>|<:.+?:\d+>/)) {
                customEmoji = true;
                emojiId = message.content.match(/<a:.+?:\d+>|<:.+?:\d+>/)[0].match(/\d+/)[0].toString();
            }
            else {
                emojiId = emojiRegexRGI().exec(message.content)[0];
            }
            let params = {
                ExpressionAttributeValues: {
                    ':rk': 'userByEmojiReceived#' + message.guild.id + '#' + message.channel.id + '#' + emojiId
                }, 
                KeyConditionExpression: 'reactionKey = :rk',
                TableName: config.awsDynamoDBTableName
            };
            dynamo.query(params, function(err, data) {
                if (err) {
                    console.error(err);
                }
                else {
                    data.Items.sort((a, b) => (a.itemCount < b.itemCount) ? 1 : -1);
                    let response = [];
                    let emojiObject;
                    if (customEmoji) {
                        emojiObject = discordClient.emojis.resolve(emojiId);
                    }
                    else {
                        emojiObject = emojiId.toString();
                    }
                    for (let i = 0; i < data.Items.length; i++) {
                        if (emojiObject && message.guild.members.resolve(data.Items[i].subKey) && data.Items[i].itemCount) {
                            response.push({user: message.guild.members.resolve(data.Items[i].subKey).user.tag, count: data.Items[i].itemCount});
                        }
                    }
                    let responseMessage;
                    if (response.length) {
                        response = response.slice(0,PAGE_SIZE);
                        responseMessage = `${message.guild.name} react leaderboard\n`;
                        responseMessage += `most frequent recipients of ${emojiObject} in #${message.channel.name}\n`;
                        responseMessage += `---------------------------\n`;
                        let userCount = 1;
                        for (let i = 0; i < response.length; i++) {
                            responseMessage += `${userCount}. ${response[i].user}\t|\tCount: ${response[i].count}\n`;
                            userCount += 1;
                        }
                        responseMessage += `---------------------------`;
                    }
                    if (responseMessage) {
                        message.channel.send(responseMessage).catch(err => {
                            console.error(err);
                        });
                    }
                }
            });
            message.delete().catch(err => {
                console.error(err);
            });
        }
        else {
            let responseMessage = `Welcome to the ${message.guild.name} react leaderboard!\n`;
            responseMessage += `You can use the following commands in the chat channel:\n`;
            responseMessage += `\`!reacts users\` will show the users in the channel with the most overall react activity\n`;
            responseMessage += `\`!reacts users received\` will show the users in the channel who receive the most overall reacts on their messages\n`;
            responseMessage += `\`!reacts emojis\` will show the emojis in the channel with the most usage\n`;
            responseMessage += `\`!reacts @userName\` will show the most commonly used emojis for a specific user\n`;
            responseMessage += `\`!reacts @userName received\` will show the most commonly received emojis for a specific user\n`;
            responseMessage += `\`!reacts :emojiname:\` will show the users that react with a specific emoji most often\n`;
            responseMessage += `\`!reacts :emojiname: received\` will show the users that receive reacts with a specific emoji most often\n`;
            message.author.send(responseMessage).catch(err => {
                console.error(err);
            });
            message.delete().catch(err => {
                console.error(err);
            });
        }
    }
});

discordClient.login(config.discordToken);
