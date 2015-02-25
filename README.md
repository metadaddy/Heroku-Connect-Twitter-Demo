Heroku Connect Twitter Demo
===========================

This sample Node.js app monitors monitors tweets and synchronizes them back to Salesforce with Heroku Connect.

Instructions
------------

* [Create a Salesforce Developer Edition](https://developer.salesforce.com/signup)
* Add a **Twitter Handle** custom field to **Contact**
* Add a **Hashtag** custom field to **Campaign**
* Create a custom object, **Tweet**, with the following custom fields:
	* **Contact** - Lookup Relationship to Contact
	* **Campaign** - Lookup Relationship to Campaign
	* **Text** - Text with length 255
* Set the Twitter handle for a contact to one you can tweet from, and set the hashtag in a campaign.
* Deploy the demo code to Heroku:

	[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

* Click 'View it' at the bottom once you've deployed to configure Heroku Connect.
	* Map **Contact**, including the **Twitter Handle** custom field
	* Map **Campaign**, including the **Hashtag** custom field
	* Map **Tweet**, including the **Contact**, **Campaign** and **Text** custom fields

* Tweet the hashtag, and, within a few seconds, you should see the tweet appear in Salesforce.