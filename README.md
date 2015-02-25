Heroku Connect Twitter Demo
===========================

This sample Node.js app monitors monitors tweets and synchronizes them back to Salesforce with Heroku Connect.

Instructions
------------

* [Create a Twitter application](https://apps.twitter.com/app/new). You can use any URL for your website, and leave the Callback URL blank, but your app will need read/write permissions and an access token.
	* Click the **Permissions** tab and select **Read and Write**. Click **Update Settings**.
	* Click the **Keys and Access Tokens** tab, scroll down and click **Create my Access Token**. Leave this page open - you'll need the values for the consumer key and secret, and the access token and its secret when you deploy the demo code to Heroku in a few minutes.
* [Create a Salesforce Developer Edition](https://developer.salesforce.com/signup), or use an existing one
	* Add a **Twitter Handle** custom field (note the space in the name!) to **Contact**
	* Add a **Hashtag** custom field to **Campaign**
	* Create a custom object, **Tweet**, with the following custom fields:
		* **Contact** - Lookup Relationship to Contact
		* **Campaign** - Lookup Relationship to Campaign
		* **Text** - Text with length 255
	* Set the Twitter handle for a contact to one you can tweet from, and set the hashtag in a campaign.
* Deploy the demo code to Heroku. You'll be prompted for your Twitter app's keys and secrets. Make a note of the app's name - you'll need it for a later step.

	[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

* Once you've deployed, Click 'View it' at the bottom of the page to configure Heroku Connect.
	* Click **Next** to accept the suggested database and schema.
	* Click **Authorize** to link Heroku Connect to your Developer Edition.
	* Create a mapping for **Contact**
		* Enable mapping for the **Twitter_Handle__c** field
	* Create a mapping for **Campaign**
		* Enable mapping for the **Hashtag__c** field
	* Create a mapping for **Tweet__c**
		* Enable mapping for the the **Name**, **Contact__c**, **Campaign__c** and **Text__c** fields. 
		* Click **DB -> SF** and enable **Write to Salesfore any updates to your Postgres database.**
* Turn on the worker dyno in your new Heroku app. You can turn off the web dyno, since it's only used for configuration.

	`heroku scale web=0 worker=1 --app your-app-name`

* Tweet the hashtag, and, within a few seconds, you should see the tweet appear in Salesforce!
* You can access the source code for your app with

	`heroku git:clone -a your-app-name`

Not Working?
------------

If you encounter any problems, please [file an issue](https://github.com/metadaddy-sfdc/Heroku-Connect-Twitter-Demo/issues/new).