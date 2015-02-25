var Twitter = require('twitter');
var pg = require('pg');

var tw = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

pg.connect(process.env.DATABASE_URL+'?ssl=true', function(err, client, done) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  client.query('SELECT twitter_handle__c, sfid '+
               'FROM salesforce.contact '+
               'WHERE contact.twitter_handle__c IS NOT NULL', function(err, result) {
    if (err) { 
      console.error(err);
    } else {
      var contacts = {};
      result.rows.forEach(function(row){
        contacts[row.twitter_handle__c] = row;
      });
      console.log('contacts :', contacts);

      client.query('SELECT hashtag__c, sfid '+
                   'FROM salesforce.campaign '+
                   'WHERE campaign.hashtag__c IS NOT NULL', function(err, result) {
        if (err) { 
          console.error(err);
        } else {
          var campaigns = result.rows;
          var query = '';
          result.rows.forEach(function(row){
            query += ((query === '') ? '' : ',')+row.hashtag__c;
          });
          console.log('query: ', query);
          console.log('campaigns: ', campaigns);

          tw.stream('statuses/filter', {track: query}, function(stream) {
            stream.on('data', function(tweet) {
              console.log('Tweet: ',tweet);
              if (contacts[tweet.user.screen_name]) {
                campaigns.forEach(function(campaign){
                  if (tweet.text.toLowerCase().indexOf(campaign.hashtag__c.toLowerCase()) !== -1) {
                    console.log('Inserting: ', tweet.id_str, contacts[tweet.user.screen_name].sfid, campaign.sfid, tweet.text);
                    var insert = 'INSERT INTO salesforce.tweet__c(name, contact__c, campaign__c, text__c) '+
                                 'VALUES($1, $2, $3, $4)';
                    client.query(insert, [tweet.id_str, contacts[tweet.user.screen_name].sfid, campaign.sfid, tweet.text], function(err, result) {
                      if(err) {
                        console.error(err);
                      } else {
                        console.log('Inserted: ', tweet.id_str);
                      }
                    });
                  }
                });
              }
            });
           
            stream.on('error', function(error) {
              console.error(error);
              throw error;
            });
          }); 
        }
      });
    }
  });
});