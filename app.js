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
  client.query('SELECT contact.twitter_handle__c FROM salesforce.contact WHERE contact.twitter_handle__c IS NOT NULL', function(err, result) {
    done();
    if (err) { 
      console.error(err); response.send("Error " + err); 
    } else {
      var contacts = {};
      result.rows.forEach(function(row){
        contacts[row.twitter_handle__c] = row;
      });
      console.log('contacts :', contacts);

      client.query('SELECT campaign.hashtag__c FROM salesforce.campaign WHERE campaign.hashtag__c IS NOT NULL', function(err, result) {
        done();
        if (err) { 
          console.error(err); response.send("Error " + err); 
        } else {
          var hashtags = [];
          var query = '';
          result.rows.forEach(function(row){
            query += ((query === '') ? '' : ',')+row.hashtag__c;
            hashtags.push(row.hashtag__c);
          });
          console.log('query: ', query);
          console.log('hashtags: ', hashtags);
          tw.stream('statuses/filter', {track: query}, function(stream) {
            stream.on('data', function(tweet) {
              console.log('Tweet: ',tweet);
              if (contacts[tweet.user.screen_name]) {
                // tweet.text, tweet.user.screen_name
                hashtags.forEach(function(hashtag){
                  if (tweet.text.toLowerCase().indexOf(hashtag.toLowerCase()) !== -1) {
                    console.log(hashtag, tweet.user.screen_name, tweet.text);
                  }
                });
              }
            });
           
            stream.on('error', function(error) {
              throw error;
            });
          }); 
        }
      });
    }
  });
});