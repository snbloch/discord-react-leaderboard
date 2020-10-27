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
    let response;
    if (message && message.guild && message.guild.id && message.content && message.channel && message.channel.id && message.content.toLowerCase().trim() === '!reacts') {
        let params = {
            ExpressionAttributeValues: {
                ':rk': {
                    S: message.guild.id + '#' + message.channel.id
                }
            }, 
            KeyConditionExpression: 'reactionKey = :rk',
            TableName: config.awsDynamoDBTableName
        };
        dynamo.query(params, function(err, data) {
            if (err) {
                console.error(err);
            }
            else if (data && data.Items && data.Items.length) {
                response = []; 
                for (let i = 0; i < data.Items.length; i++) {
                    let unmarshalled = new AWS.DynamoDB.Converter.unmarshall(data.Items[i]);
                    response.push({id: unmarshalled.subKey, count: unmarshalled.itemCount});
                } 
            }
        });
        message.delete();
    }
    else if (message && message.guild && message.guild.id && message.content && message.channel && message.channel.id && message.content.toLowerCase().startsWith('!reacts')) {
        if (message.mentions && message.mentions.users && message.mentions.users.first()) {
            let params = {
                ExpressionAttributeValues: {
                    ':rk': {
                        S: message.guild.id + '#' + message.channel.id + '#' + message.mentions.users.first().id
                    }
                }, 
                KeyConditionExpression: 'reactionKey = :rk',
                TableName: config.awsDynamoDBTableName
            };
            dynamo.query(params, function(err, data) {
                if (err) {
                    console.error(err);
                }
                else if (data && data.Items && data.Items.length) {
                    response = []; 
                    for (let i = 0; i < data.Items.length; i++) {
                        let unmarshalled = new AWS.DynamoDB.Converter.unmarshall(data.Items[i]);
                        response.push({id: unmarshalled.subKey, count: unmarshalled.itemCount});
                    } 
                }
            });
            message.delete();
        }
        else if (message.content.match(/<a:.+?:\d+>|<:.+?:\d+>/)) {
            let emojiId = message.content.match(/<a:.+?:\d+>|<:.+?:\d+>/)[0].match(/\d+/);
            let params = {
                ExpressionAttributeValues: {
                    ':rk': {
                        S: message.guild.id + '#' + message.channel.id + '#' + emojiId
                    }
                }, 
                KeyConditionExpression: 'reactionKey = :rk',
                TableName: config.awsDynamoDBTableName
            };
            dynamo.query(params, function(err, data) {
                if (err) {
                    console.error(err);
                }
                else if (data && data.Items && data.Items.length) {
                    response = []; 
                    for (let i = 0; i < data.Items.length; i++) {
                        let unmarshalled = new AWS.DynamoDB.Converter.unmarshall(data.Items[i]);
                        response.push({id: unmarshalled.subKey, count: unmarshalled.itemCount});
                    } 
                }
            });
            message.delete();
        }
    }
    if (response) {
        console.log(response);
    }
});

discordClient.login(config.discordToken);
