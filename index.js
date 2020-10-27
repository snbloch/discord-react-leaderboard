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
                '#uid': 'userId',
            },
            ExpressionAttributeValues: {
                ':incr': {
                    N: '1'
                },
                ':lu': {
                    S: new Date().toString()
                },
                ':uid': {
                    S: user.id
                },
                ':zero': {
                    N: '0'
                }
            }, 
            Key: {
                reactionKey: {
                    S: messageReaction.message.guild.id + '#' + messageReaction.message.channel.id
                }
            },
            TableName: config.awsDynamoDBTableName,
            UpdateExpression: 'SET #ic = if_not_exists(#ic, :zero) + :incr, #uid = :uid, #lu = :lu'
        };
        dynamo.updateItem(params, function(err, data){
            if (err) {
                console.error(err);
            }
        });
        params = {
            ExpressionAttributeNames: {
                '#eid': 'emojiId',
                '#ic': 'itemCount',
                '#lu': 'lastUsed'
            },
            ExpressionAttributeValues: {
                ':eid': {
                    S: messageReaction.emoji.id
                },
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
                }
            },
            TableName: config.awsDynamoDBTableName,
            UpdateExpression: 'SET #ic = if_not_exists(#ic, :zero) + :incr, #eid = :eid, #lu = :lu'
        };
        dynamo.updateItem(params, function(err, data){
            if (err) {
                console.error(err);
            }
        });
        params = {
            ExpressionAttributeNames: {
                '#uid': 'userId',
                '#ic': 'itemCount',
                '#lu': 'lastUsed'
            },
            ExpressionAttributeValues: {
                ':uid': {
                    S: user.id
                },
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
                }
            },
            TableName: config.awsDynamoDBTableName,
            UpdateExpression: 'SET #ic = if_not_exists(#ic, :zero) + :incr, #uid = :uid, #lu = :lu'
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
                '#ic': 'itemCount',
                '#uid': 'userId'
            },
            ExpressionAttributeValues: {
                ':decr': {
                    N: '1'
                },
                ':uid': {
                    S: user.id
                }
            }, 
            Key: {
                reactionKey: {
                    S: messageReaction.message.guild.id + '#' + messageReaction.message.channel.id
                }
            },
            TableName: config.awsDynamoDBTableName,
            UpdateExpression: 'SET #ic = #ic - :decr',
            ConditionExpression: '#ic >= :decr, #uid = :uid'
        };
        dynamo.updateItem(params, function(err, data){
            if (err) {
                console.error(err);
            }
        });
        params = {
            ExpressionAttributeNames: {
                '#eid': 'emojiId',
                '#ic': 'itemCount'
            },
            ExpressionAttributeValues: {
                ':decr': {
                    N: '1'
                },
                ':eid': {
                    S: messageReaction.emoji.id
                }
            }, 
            Key: {
                reactionKey: {
                    S: messageReaction.message.guild.id + '#' + messageReaction.message.channel.id + '#' + user.id
                }
            },
            TableName: config.awsDynamoDBTableName,
            UpdateExpression: 'SET #ic = #ic - :decr',
            ConditionExpression: '#ic >= :decr, #eid = :eid'
        };
        dynamo.updateItem(params, function(err, data){
            if (err) {
                console.error(err);
            }
        });
        params = {
            ExpressionAttributeNames: {
                '#ic': 'itemCount',
                '#uid': 'userId'
            },
            ExpressionAttributeValues: {
                ':decr': {
                    N: '1'
                },
                ':uid': {
                    S: user.id
                }
            }, 
            Key: {
                reactionKey: {
                    S: messageReaction.message.guild.id + '#' + messageReaction.message.channel.id + '#' + messageReaction.emoji.id
                }
            },
            TableName: config.awsDynamoDBTableName,
            UpdateExpression: 'SET #ic = #ic - :decr',
            ConditionExpression: '#ic >= :decr, #uid = :uid'
        };
        dynamo.updateItem(params, function(err, data){
            if (err) {
                console.error(err);
            }
        });
    }
});

discordClient.login(config.discordToken);
