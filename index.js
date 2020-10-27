var AWS = require('aws-sdk');
const Discord = require('discord.js');
const config = require('./config.json');
const discordClient = new Discord.Client();
var credentials = new AWS.SharedIniFileCredentials({profile: config.awsProfileName});
AWS.config.credentials = credentials;
AWS.config.region = config.awsRegion;
const dynamo = new AWS.DynamoDB.DocumentClient();

const PAGE_SIZE = 10;
const MAX_PAGES = 1;

discordClient.once('ready', () => {
    console.log('Ready!');
});

discordClient.on('messageReactionAdd', (messageReaction, user) => {
    if (messageReaction && user && messageReaction.message && messageReaction.emoji && messageReaction.emoji.id && messageReaction.message.author && !messageReaction.message.author.bot && user.id && !user.bot && messageReaction.message.guild.emojis.resolve(messageReaction.emoji.id)) {
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
                reactionKey: messageReaction.message.guild.id + '#' + messageReaction.message.channel.id,
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
                reactionKey: messageReaction.message.guild.id + '#' + messageReaction.message.channel.id + '#' + user.id,
                subKey: messageReaction.emoji.id
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
                reactionKey: messageReaction.message.guild.id + '#' + messageReaction.message.channel.id + '#' + messageReaction.emoji.id,
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
    }
});

discordClient.on('messageReactionRemove', (messageReaction, user) => {
    if (messageReaction && user && messageReaction.message && messageReaction.emoji && messageReaction.emoji.id && messageReaction.message.author && !messageReaction.message.author.bot && user.id && !user.bot && messageReaction.message.guild.emojis.resolve(messageReaction.emoji.id)) {
        let params = {
            ExpressionAttributeNames: {
                '#ic': 'itemCount'
            },
            ExpressionAttributeValues: {
                ':decr': 1
            }, 
            Key: {
                reactionKey: messageReaction.message.guild.id + '#' + messageReaction.message.channel.id,
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
                reactionKey: messageReaction.message.guild.id + '#' + messageReaction.message.channel.id + '#' + user.id,
                subKey: messageReaction.emoji.id
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
                reactionKey: messageReaction.message.guild.id + '#' + messageReaction.message.channel.id + '#' + messageReaction.emoji.id,
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
    }
});

discordClient.on('message', message => {
    if (message && message.guild && message.guild.id && message.content && message.channel && message.channel.id && message.content.toLowerCase().trim() === '!reacts') {
        let params = {
            ExpressionAttributeValues: {
                ':rk': message.guild.id + '#' + message.channel.id
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
                    responseMessage += `users with most reacts in #${message.channel.name}\n`;
                    responseMessage += `---------------------------\n`;
                    let userCount = 1;
                    for (let i = 0; i < response.length; i++) {
                        responseMessage += `${userCount}. ${response[i].user}\t|\tCount: ${response[i].count}\n`;
                        userCount += 1;
                    }
                    responseMessage += `---------------------------`;
                }
                if (responseMessage) {
                    message.channel.send(responseMessage);
                }
            }
        });
        message.delete();
    }
    else if (message && message.guild && message.guild.id && message.content && message.channel && message.channel.id && message.content.toLowerCase().startsWith('!reacts')) {
        if (message.mentions && message.mentions.users && message.mentions.users.first()) {
            let params = {
                ExpressionAttributeValues: {
                    ':rk': message.guild.id + '#' + message.channel.id + '#' + message.mentions.users.first().id
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
                        if (message.guild.members.resolve(message.mentions.users.first().id) && message.guild.emojis.resolve(data.Items[i].subKey) && data.Items[i].itemCount) {
                            response.push({emoji: message.guild.emojis.resolve(data.Items[i].subKey).identifier, count: data.Items[i].itemCount});
                        }
                    }
                    console.log(response.slice(0,PAGE_SIZE));
                }
            });
            message.delete();
        }
        else if (message.content.match(/<a:.+?:\d+>|<:.+?:\d+>/)) {
            let emojiId = message.content.match(/<a:.+?:\d+>|<:.+?:\d+>/)[0].match(/\d+/)[0].toString();
            let params = {
                ExpressionAttributeValues: {
                    ':rk': message.guild.id + '#' + message.channel.id + '#' + emojiId
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
                        if (message.guild.emojis.resolve(emojiId) && message.guild.members.resolve(data.Items[i].subKey) && data.Items[i].itemCount) {
                            response.push({user: message.guild.members.resolve(data.Items[i].subKey).user.tag, count: data.Items[i].itemCount});
                        }
                    }
                    console.log(response.slice(0,PAGE_SIZE));
                }
            });
            message.delete();
        }
    }
});

discordClient.login(config.discordToken);
