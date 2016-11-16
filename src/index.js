import { createWriteStream } from 'fs';
import { prettyPrint } from 'html';
import mailchimpify from 'mailchimpify';
import assert from 'assert';
import { injectReactEmailAttributes, renderEmail } from 'react-html-email';
import mailchimpIntegration from './integrations/mailchimp';

injectReactEmailAttributes();

function assertTemplateParams (templateName, props) {
  assert(templateName, '`templateName` should be passed in to `render`.');
  assert(typeof (templateName) === 'string', '`templateName` should be a string');
  assert(typeof (props) === 'object' && !Array.isArray(props), '`props` should be an object');
}

const renderHtml = (template) => prettyPrint(mailchimpify(renderEmail(template)), { indent_size: 2 });

export default (opts) => {
  assert(opts, 'Requires an `opts` object');
  assert(typeof (opts) === 'object', '`opts` should be an object');
  assert(opts.allTemplates, 'Requires an `allTemplates` object in opts');
  assert(typeof (opts.allTemplates) === 'object' && !Array.isArray(opts.allTemplates), '`allTemplates` should be an object');

  const { allTemplates } = opts;

  return {
    templateNames: () => Object.keys(allTemplates).map(template => template).join(', '),
    render: (templateName, props = {}) => {
      assertTemplateParams(templateName, props);
      const { template } = allTemplates[templateName];
      const html = renderHtml(template(props));

      return html;
    },
    compile: (templateName, props = {}, dir = __dirname) => {
      assertTemplateParams(templateName, props);
      const { template, fileName } = allTemplates[templateName];
      const stream = createWriteStream(`${dir}/${fileName}.html`);
      const html = renderHtml(template(props));

      stream.once('open', () => stream.end(html));
    },
    mailchimp: (config, data) => mailchimpIntegration(config, data)
  };
};
