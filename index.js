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
    if (messageReaction && user && messageReaction.message && messageReaction.emoji && user.id && !user.bot) {
        let params = {
            ExpressionAttributeValues: {
                ':c': {
                    N: '1'
                },
                ':lu': {
                    S: new Date()
                }
            }, 
            Key: {
                discordServerID: {
                    S: messageReaction.message.guild.id
                },
                discordUserID: {
                    S: user.id
                },
                discordChannelId: {
                    S: messageReaction.message.channel.id
                },
                emojiId: {
                    S: messageReaction.emoji.id
                }
            },
            TableName: config.awsDynamoDBTableName,
            UpdateExpression: 'SET count = count + :c, SET lastUsed = :lu',
        };
        dynamo.updateItem(params, function(err, data){
            if (err) {
                console.error(err);
            }
        });
    }
});

discordClient.on('messageReactionRemove', (messageReaction, user) => {
    if (messageReaction && user && messageReaction.message && messageReaction.emoji && user.id && !user.bot) {
        let params = {
            ExpressionAttributeValues: {
                ':c': {
                    N: '1'
                }
            }, 
            Key: {
                discordServerID: {
                    S: messageReaction.message.guild.id
                },
                discordUserID: {
                    S: user.id
                },
                discordChannelId: {
                    S: messageReaction.message.channel.id
                },
                emojiId: {
                    S: messageReaction.emoji.id
                }
            },
            TableName: config.awsDynamoDBTableName,
            UpdateExpression: 'SET count = count - :c',
            ConditionExpression: 'count >= 1'
        };
        dynamo.updateItem(params, function(err, data){
            if (err) {
                console.error(err);
            }
        });
    }
});

discordClient.login(config.discordToken);
