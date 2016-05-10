import Mailchimp from 'mailchimp-lite';
import assert from 'assert';

export default function (config, data) {
  assert(config, 'Config is required');
  assert(typeof (config) === 'object' && !Array.isArray(config), 'Config should be an object');
  assert(config.key, '`key` is required in config');
  assert(config.datacenter, '`datacenter` is required in config');

  assert(data, 'data is required');
  assert(typeof (data) === 'object' && !Array.isArray(data), 'data should be an object');
  assert(data.templateId, '`templateId` is required in data object');
  assert(typeof (data.templateId) === 'number', '`templateId` should be a number');
  assert(data.templateData, '`templateData` is required');
  assert(typeof (data.templateData) === 'object' && !Array.isArray(data.templateData), '`templateData` should be an object');
  assert(data.templateData.name, 'A template name inside `templateData` is required');
  assert(data.templateData.html, 'An HTML string inside `templateData` is required');
  assert(typeof (data.templateData.html) === 'string', 'An HTML string inside `templateData` is required');
  assert(data.campaign, 'Campaign is required');
  assert(typeof (data.campaign) === 'object' && !Array.isArray(data.campaign), '`campaign` should be an object');

  const mailchimp = new Mailchimp({
    key: config.key,
    datacenter: config.datacenter
  });

  function updateTemplate ({ id, data }) {
    return mailchimp.patch(`/templates/${id}`, data);
  }

  function createCampaign (data) {
    return mailchimp.post('/campaigns', data);
  }

  function updateCampaignContent ({ id, data }) {
    return mailchimp.put(`/campaigns/${id}/content`, data);
  }

  function sendCampaignAction ({ id, action }) {
    return mailchimp.post(`/campaigns/${id}/actions/${action}`);
  }

  function init () {
    return new Promise((resolve, reject) => {
      return updateTemplate({ id: data.templateId, data: data.templateData })
        .then(() => createCampaign(data.campaign))
        .then((response) => {
          const { id } = response;
          const dataObj = {
            template: {
              id: data.templateId
            }
          };

          return updateCampaignContent({ id, data: dataObj })
            .then(() => id);
        })
        .then((id) => sendCampaignAction({ id, action: 'send' }))
        .then((response) => resolve({ message: 'Campaign sent' }))
        .catch((error) => reject(error));
    });
  }

  return {
    init,
    updateTemplate,
    createCampaign,
    updateCampaignContent,
    sendCampaignAction
  };
}
