import test from 'tape';
import courier from '../src/index';
import React from 'react';
import { Item, Email, Span } from 'react-html-email';

test('throw without opts', (t) => {
  const message = 'Should throw if no opts passed in';

  t.throws(() => courier(), message);
  t.end();
});

test(`throw if opts isn't an object`, (t) => {
  const message = `Should throw if opts isn't an object`;
  const opts = [];

  t.throws(() => courier(opts), message);
  t.end();
});

test('throw with no templates', (t) => {
  const message = `Should throw if 'allTemplates' isn't passed in`;
  const opts = {};

  t.throws(() => courier(opts), message);
  t.end();
});

test(`throws if templates isn't an object`, (t) => {
  const message = `Should throw if 'allTemplates' isn't an object`;
  const opts = {
    allTemplates: ''
  };

  t.throws(() => courier(opts), message);
  t.end();
});

test(`templateNames should return an object of template names`, (t) => {
  const opts = {
    allTemplates: {
      myTemplate: {
        template: `<p>Just a paragraph</p>`,
        fileName: 'myTemplate'
      },
      yourTemplate: {
        template: `<span>Just span</span>`,
        fileName: 'yourTemplate'
      }
    }
  };
  const { templateNames } = courier(opts);
  const expected = 'myTemplate, yourTemplate';

  t.equal(templateNames(), expected);
  t.end();
});

test(`render should throw if no templateName is passed`, (t) => {
  const message = `throw without templateName in render`;
  const opts = {
    allTemplates: {
      myTemplate: {
        template: `<p>foo</p>`,
        fileName: 'myTemplate'
      }
    }
  };
  const { render } = courier(opts);

  t.throws(() => render(), message);
  t.end();
});

test(`render should throw if templateName is not a string`, (t) => {
  const message = `throw without a valid templateName`;
  const opts = {
    allTemplates: {
      myTemplate: {
        template: `<p>foo</p>`,
        fileName: 'myTemplate'
      }
    }
  };
  const { render } = courier(opts);

  t.throws(() => render([]), message);
  t.end();
});

test(`render should throw if props is not an object`, (t) => {
  const message = `throw if props is not an object`;
  const opts = {
    allTemplates: {
      myTemplate: {
        template: `<p>foo</p>`,
        fileName: 'myTemplate'
      }
    }
  };
  const { render } = courier(opts);

  t.throws(() => render('template', []), message);
  t.end();
});

test(`render should return a html string`, (t) => {
  const template = () => (
    <Email>
      <Item>
        <Span>Foo</Span>
      </Item>
    </Email>
  );
  const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml">\n  \n  <head>\n    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0"\n    />\n    <title></title>\n  </head>\n  \n  <body style="width:100%;margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">\n    <table width="100%" height="100%" cellpadding="0" cellspacing="0" border="0"\n    align="left" valign="top">\n      <tbody>\n        <tr>\n          <td align="center" valign="top">\n            <table width="600" align="center" cellpadding="0" cellspacing="0" border="0"\n            valign="top">\n              <tbody>\n                <tr>\n                  <td><span style="font-family:sans-serif;font-size:14px;line-height:14px;color:#000;">Foo</span>\n                  </td>\n                </tr>\n              </tbody>\n            </table>\n          </td>\n        </tr>\n      </tbody>\n    </table>\n  </body>\n\n</html>`;
  const opts = {
    allTemplates: {
      myTemplate: {
        template,
        fileName: 'myTemplate'
      }
    }
  };
  const { render } = courier(opts);

  t.equal(render('myTemplate'), html);
  t.end();
});

test(`render should return a transformed mc:data string`, (t) => {
  const template = () => (
    <Email>
      <Item>
        <Span data-mc-edit='baz'>Foo</Span>
      </Item>
    </Email>
  );
  const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml">\n  \n  <head>\n    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0"\n    />\n    <title></title>\n  </head>\n  \n  <body style="width:100%;margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">\n    <table width="100%" height="100%" cellpadding="0" cellspacing="0" border="0"\n    align="left" valign="top">\n      <tbody>\n        <tr>\n          <td align="center" valign="top">\n            <table width="600" align="center" cellpadding="0" cellspacing="0" border="0"\n            valign="top">\n              <tbody>\n                <tr>\n                  <td><span mc:edit="baz" style="font-family:sans-serif;font-size:14px;line-height:14px;color:#000;">Foo</span>\n                  </td>\n                </tr>\n              </tbody>\n            </table>\n          </td>\n        </tr>\n      </tbody>\n    </table>\n  </body>\n\n</html>`;
  const opts = {
    allTemplates: {
      myTemplate: {
        template,
        fileName: 'myTemplate'
      }
    }
  };
  const { render } = courier(opts);

  t.equal(render('myTemplate'), html);
  t.end();
});
