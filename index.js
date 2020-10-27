var AWS = require('aws-sdk');
const Discord = require('discord.js');
const config = require('./config.json');
const discordClient = new Discord.Client();
var credentials = new AWS.SharedIniFileCredentials({profile: config.awsProfileName});
AWS.config.credentials = credentials;
AWS.config.region = config.awsRegion;
const dynamo = new AWS.DynamoDB();

discordClient.once('ready', () => {
    console.log('Ready!');
});

discordClient.on('messageReactionAdd', (messageReaction, user) => {
    if (messageReaction && user && messageReaction.message && messageReaction.emoji && messageReaction.emoji.id && messageReaction.message.author && !messageReaction.message.author.bot && user.id && !user.bot) {
        let params = {
            ExpressionAttributeNames: {
                '#ic': 'itemCount',
                '#lu': 'lastUsed',
            },
            ExpressionAttributeValues: {
                ':incr': {
                    N: '1'
                },
                ':lu': {
                    S: new Date().toString()
                },
                ':zero': {
                    N: '0'
                }
            }, 
            Key: {
                reactionKey: {
                    S: messageReaction.message.guild.id + '#' + messageReaction.message.channel.id
                },
                subKey: {
                    S: user.id
                }
            },
            TableName: config.awsDynamoDBTableName,
            UpdateExpression: 'SET #ic = if_not_exists(#ic, :zero) + :incr, #lu = :lu'
        };
        dynamo.updateItem(params, function(err, data){
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
                ':incr': {
                    N: '1'
                },
                ':lu': {
                    S: new Date().toString()
                },
                ':zero': {
                    N: '0'
                }
            }, 
            Key: {
                reactionKey: {
                    S: messageReaction.message.guild.id + '#' + messageReaction.message.channel.id + '#' + user.id
                },
                subKey: {
                    S: messageReaction.emoji.id
                }
            },
            TableName: config.awsDynamoDBTableName,
            UpdateExpression: 'SET #ic = if_not_exists(#ic, :zero) + :incr, #lu = :lu'
        };
        dynamo.updateItem(params, function(err, data){
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
                ':incr': {
                    N: '1'
                },
                ':lu': {
                    S: new Date().toString()
                },
                ':zero': {
                    N: '0'
                }
            }, 
            Key: {
                reactionKey: {
                    S: messageReaction.message.guild.id + '#' + messageReaction.message.channel.id + '#' + messageReaction.emoji.id
                },
                subKey: {
                    S: user.id
                }
            },
            TableName: config.awsDynamoDBTableName,
            UpdateExpression: 'SET #ic = if_not_exists(#ic, :zero) + :incr, #lu = :lu'
        };
        dynamo.updateItem(params, function(err, data){
            if (err) {
                console.error(err);
            }
        });
    }
});

discordClient.on('messageReactionRemove', (messageReaction, user) => {
    if (messageReaction && user && messageReaction.message && messageReaction.emoji && messageReaction.emoji.id && messageReaction.message.author && !messageReaction.message.author.bot && user.id && !user.bot) {
        let params = {
            ExpressionAttributeNames: {
                '#ic': 'itemCount'
            },
            ExpressionAttributeValues: {
                ':decr': {
                    N: '1'
                }
            }, 
            Key: {
                reactionKey: {
                    S: messageReaction.message.guild.id + '#' + messageReaction.message.channel.id
                },
                subKey: {
                    S: user.id
                }
            },
            TableName: config.awsDynamoDBTableName,
            UpdateExpression: 'SET #ic = #ic - :decr',
            ConditionExpression: '#ic >= :decr'
        };
        dynamo.updateItem(params, function(err, data){
            if (err) {
                console.error(err);
            }
        });
        params = {
            ExpressionAttributeNames: {
                '#ic': 'itemCount'
            },
            ExpressionAttributeValues: {
                ':decr': {
                    N: '1'
                }
            }, 
            Key: {
                reactionKey: {
                    S: messageReaction.message.guild.id + '#' + messageReaction.message.channel.id + '#' + user.id
                },
                subKey: {
                    S: messageReaction.emoji.id
                }
            },
            TableName: config.awsDynamoDBTableName,
            UpdateExpression: 'SET #ic = #ic - :decr',
            ConditionExpression: '#ic >= :decr'
        };
        dynamo.updateItem(params, function(err, data){
            if (err) {
                console.error(err);
            }
        });
        params = {
            ExpressionAttributeNames: {
                '#ic': 'itemCount'
            },
            ExpressionAttributeValues: {
                ':decr': {
                    N: '1'
                }
            }, 
            Key: {
                reactionKey: {
                    S: messageReaction.message.guild.id + '#' + messageReaction.message.channel.id + '#' + messageReaction.emoji.id
                },
                subKey: {
                    S: user.id
                }
            },
            TableName: config.awsDynamoDBTableName,
            UpdateExpression: 'SET #ic = #ic - :decr',
            ConditionExpression: '#ic >= :decr'
        };
        dynamo.updateItem(params, function(err, data){
            if (err) {
                console.error(err);
            }
        });
    }
});

discordClient.on('message', message => {
    if (message && message.guild && message.guild.id && message.content && message.channel && message.channel.id && message.content.toLowerCase().trim() === '!reacts') {
        let params = {
            KeyConditionExpression: 'reactionKey = ' + message.guild.id + '#' + message.channel.id,
            TableName: config.awsDynamoDBTableName
        };
        dynamo.query(params, function(err, data) {
            if (err) {
                console.error(err);
            }
            else {
                console.log(data); 
            }
        });
    }
    else if (message && message.guild && message.guild.id && message.content && message.channel && message.channel.id && message.content.toLowerCase().startsWith('!reacts')) {
        if (message.mentions && message.mentions.users && message.mentions.users.first()) {
            let params = {
                KeyConditionExpression: 'reactionKey = ' + message.guild.id + '#' + message.channel.id + '#' + message.mentions.users.first().id,
                TableName: config.awsDynamoDBTableName
            };
            dynamo.query(params, function(err, data) {
                if (err) {
                    console.error(err);
                }
                else {
                    console.log(data); 
                }
            });
        }
        else if (message.content.match(/<a:.+?:\d+>|<:.+?:\d+>/)) {
            let emojiId = message.content.match(/<a:.+?:\d+>|<:.+?:\d+>/)[0].match(/\d+/);
            let params = {
                KeyConditionExpression: 'reactionKey = ' + message.guild.id + '#' + message.channel.id + '#' + emojiId,
                TableName: config.awsDynamoDBTableName
            };
            dynamo.query(params, function(err, data) {
                if (err) {
                    console.error(err);
                }
                else {
                    console.log(data); 
                }
            });
        }
    }
});

discordClient.login(config.discordToken);
