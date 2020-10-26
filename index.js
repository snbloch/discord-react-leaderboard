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
                '#c': 'count',
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
                    S: messageReaction.message.guild.id + '#' + messageReaction.message.channel.id + '#' + user.id + '#' + messageReaction.emoji.id
                }
            },
            TableName: config.awsDynamoDBTableName,
            UpdateExpression: 'SET #c = if_not_exists(#c, :zero) + :incr, #lu = :lu',
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
                '#c': 'count'
            },
            ExpressionAttributeValues: {
                ':decr': {
                    N: '1'
                }
            }, 
            Key: {
                reactionKey: {
                    S: messageReaction.message.guild.id + '#' + messageReaction.message.channel.id + '#' + user.id + '#' + messageReaction.emoji.id
                }
            },
            TableName: config.awsDynamoDBTableName,
            UpdateExpression: 'SET #c = #c - :decr',
            ConditionExpression: '#c >= :decr'
        };
        dynamo.updateItem(params, function(err, data){
            if (err) {
                console.error(err);
            }
        });
    }
});

discordClient.login(config.discordToken);
