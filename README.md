# courier
Render and send component based emails easily with `react-html-email` and Mailchimp on the server.

## Installation
Download node at [nodejs.org](http://nodejs.org) and install it, if you haven't already.

```sh
npm install courier-js --save
```

## Render Usage
Render and return an HTML string from your email component.
```js
import courier from 'courier';
import React from 'react';
import { Email, Item, Span } from 'react-html-email';

const template = () => (
    <Email title='My Sexy Email'>
        <Item data-mc-edit="article_title">
            <Span>Oh my, emails are sexy now.</Span>
        </Item>
    </Email>
);

const allTemplates = {
    myTemplate: {
        template,
        fileName: 'myTemplate'
    }
};

const { render, templateNames } = courier({ allTemplates });
const templateProps = {};

render('myTemplate', templateProps); // returns an HTML string with your props and `mc:edit` attribute
```

## Compile to HTML file
Compile your email component to an HTML file and the directory of your choice.
```js
import courier from 'courier';
import React from 'react';
import { Email, Item, Span } from 'react-html-email';
const action = process.argv[2];

const template = () => (
    <Email title='My Sexy Email'>
        <Item data-mc-edit="article_title">
            <Span>Oh my, emails are sexy now.</Span>
        </Item>
    </Email>
);

const allTemplates = {
    myTemplate: {
        template,
        fileName: 'myTemplate'
    }
};

const { compile } = courier({ allTemplates });
const templateProps = {};

const templateProps = {};
const dir = __dirname;
compile('myTemplate', templateProps, dir); // renders your template inside `dir` with your `fileName`.html
```

## Render to Mailchimp Campaign
Update a Mailchimp template and send a campaign based on your email component.
```js
import courier from 'courier';
import React from 'react';
import { Email, Item, Span } from 'react-html-email';
const action = process.argv[2];

const template = () => (
    <Email title='My Sexy Email'>
        <Item data-mc-edit="article_title">
            <Span>Oh my, emails are sexy now.</Span>
        </Item>
    </Email>
);

const allTemplates = {
    myTemplate: {
        template,
        fileName: 'myTemplate'
    }
};

const { mailchimp, render } = courier({ allTemplates });
const templateProps = {};
const mailchimpConfig = {
  key: config.key,
  datacenter: config.datacenter
};
const mailchimpOpts = {
  campaign: {
    type: 'regular',
    recipients: {
      list_id: 0
    },
    settings: {
      subject_line: 'Send via Courier',
      from_name: 'Sample',
      reply_to: 'sample@someemail.com',
      title: 'My Sexy Courier Campaign'
    }
  },
  templateId: 0,
  templateData: {
    name: 'My Template Name',
    html: render('myTemplate', templateProps)
  }
};

/*
    Also available from `mailchimp`:
    updateTemplate,
    createCampaign,
    updateCampaignContent,
    sendCampaignAction
*/
const { init } = mailchimp(mailchimpConfig, mailchimpOpts);


/*
    Updates `templateId` with your rendered component
    Creates new campaign
    Updates campaign content with your `templateId`
    Sends campaign to your list
*/
init()
    .then((data) => console.log(data));
    .catch((error) => console.log(error));
```

## Tests

```sh
npm install
npm test
```

## Dependencies

- [assert](https://github.com/defunctzombie/commonjs-assert): commonjs assert - node.js api compatible
- [html](https://github.com/maxogden/commonjs-html-prettyprinter): HTML pretty printer CLI utility (based on jsbeautifier)
- [mailchimp-lite](https://github.com/NickTomlin/mailchimp-lite): A lightweight wrapper for Mailchimp&#39;s v2 and v3 apis
- [mailchimpify](https://github.com/Roilan/mailchimpify): transform your data attributes to Mailchimp&#39;s custom `mc:edit`
- [react](https://github.com/facebook/react): React is a JavaScript library for building user interfaces.
- [react-dom](https://github.com/facebook/react): React package for working with the DOM.
- [react-html-email](https://github.com/chromakode/react-html-email): Create elegant HTML email templates using React.

## Dev Dependencies

- [babel-core](https://github.com/babel/babel/tree/master/packages): Babel compiler core.
- [babel-preset-es2015](https://github.com/babel/babel/tree/master/packages): Babel preset for all es2015 plugins.
- [babel-preset-react](https://github.com/babel/babel/tree/master/packages): Babel preset for all React plugins.
- [semistandard](https://github.com/Flet/semistandard): All the goodness of `feross/standard` with semicolons sprinkled on top.
- [snazzy](https://github.com/feross/snazzy): Format JavaScript Standard Style as Stylish (i.e. snazzy) output
- [tape](https://github.com/substack/tape): tap-producing test harness for node and browsers


## License

MIT

_Generated by [package-json-to-readme](https://github.com/zeke/package-json-to-readme)_
