/**
 * Goodgrove Digital — Google Forms + website contact form
 *
 * Owner setup:
 *   1. Visit https://script.google.com/home/projects/create
 *   2. Paste this entire file into Code.gs and save.
 *   3. Run setupGoodgroveForm once and authorize Google Forms + Sheets.
 *   4. View the Execution log for your Form and existing Sheet URLs.
 *   5. Deploy > New deployment > Web app > Execute as: Me > Access: Anyone.
 *   6. Paste the /exec Web app URL into the website's form-config.js.
 *
 * This creates a real Google Form linked to your existing Google Sheet.
 * Website inquiries are saved as Google Form responses by FormResponse.submit().
 */

const GOODGROVE = {
  formTitle: 'Goodgrove Digital — Project Inquiry',
  sheetId: '1S-P-ht72I6yw-7ar9HBcDtFcjvY09YEEvnCB-sQ1ixI',
  sheetTitle: 'Goodgrove Digital — Contact Inquiries',
  contactEmail: 'goodgrovedigital@gmail.com',
  services: [
    'Website design & development',
    'AI & workflow automation',
    'Web apps & custom tools',
    'Website maintenance & support',
    'Not sure yet / Something else'
  ],
  titles: {
    name: 'Your name',
    email: 'Email address',
    service: 'What can we help with?',
    message: 'Tell us a bit about your project'
  }
};

/** Run this once while signed into the Google account that should own the form. */
function setupGoodgroveForm() {
  const props = PropertiesService.getScriptProperties();
  const oldId = props.getProperty('GOODGROVE_FORM_ID');
  if (oldId) {
    const existing = FormApp.openById(oldId);
    Logger.log('Existing form found — not creating a duplicate.');
    Logger.log('Edit form: ' + existing.getEditUrl());
    Logger.log('Public Google Form: ' + existing.getPublishedUrl());
    Logger.log('Responses spreadsheet: ' + props.getProperty('GOODGROVE_SHEET_URL'));
    return;
  }

  const form = FormApp.create(GOODGROVE.formTitle, true)
    .setDescription('Tell us about your website, automation, or software project. We will contact you using the email you provide.')
    .setConfirmationMessage('Thank you! Goodgrove Digital has received your inquiry. We will review your request and get back to you.')
    .setAllowResponseEdits(false)
    .setCollectEmail(false);

  form.addTextItem()
    .setTitle(GOODGROVE.titles.name)
    .setRequired(true);

  form.addTextItem()
    .setTitle(GOODGROVE.titles.email)
    .setValidation(FormApp.createTextValidation()
      .requireTextIsEmail()
      .setHelpText('Please provide a valid email address.')
      .build())
    .setRequired(true);

  form.addListItem()
    .setTitle(GOODGROVE.titles.service)
    .setChoiceValues(GOODGROVE.services)
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle(GOODGROVE.titles.message)
    .setRequired(true);

  const sheet = SpreadsheetApp.openById(GOODGROVE.sheetId);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  props.setProperties({
    GOODGROVE_FORM_ID: form.getId(),
    GOODGROVE_SHEET_URL: sheet.getUrl()
  });
  Logger.log('Created form and linked response spreadsheet:');
  Logger.log('Edit form: ' + form.getEditUrl());
  Logger.log('Public Google Form: ' + form.getPublishedUrl());
  Logger.log('Responses spreadsheet: ' + sheet.getUrl());
  Logger.log('NEXT: Deploy this project as a Web app. Copy its /exec URL into form-config.js.');
}

/** Optional diagnostics: open your /exec URL to see whether setup is complete. */
function doGet() {
  const configured = !!PropertiesService.getScriptProperties().getProperty('GOODGROVE_FORM_ID');
  return renderPage_(
    configured ? 'Goodgrove form receiver is ready' : 'Form setup is incomplete',
    configured
      ? 'This endpoint is ready to receive inquiries from the Goodgrove website.'
      : 'Run setupGoodgroveForm from the Apps Script editor before publishing.',
    configured
  );
}

/** Submitted as a plain HTML form POST from goodgrove's existing contact UI. */
function doPost(e) {
  const p = e && e.parameter ? e.parameter : {};

  // Invisible field should always remain empty for human visitors.
  // A bot that fills it is shown a generic receipt but is not recorded.
  if (String(p.website || '').trim()) {
    return renderPage_('Thanks for reaching out!', 'Your message has been received.', true);
  }

  const name = String(p.name || '').trim();
  const email = String(p.email || '').trim();
  const service = String(p.service || '').trim();
  const message = String(p.message || '').trim();

  if (name.length < 1 || name.length > 100 ||
      email.length < 3 || email.length > 180 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      GOODGROVE.services.indexOf(service) === -1 ||
      message.length < 1 || message.length > 2500) {
    return renderPage_(
      'Please check your inquiry',
      'Some details were missing or invalid. Return to the Goodgrove website and check the fields, or email ' + GOODGROVE.contactEmail + '.',
      false
    );
  }

  try {
    const formId = PropertiesService.getScriptProperties().getProperty('GOODGROVE_FORM_ID');
    if (!formId) throw new Error('Form has not been set up.');
    const form = FormApp.openById(formId);
    const byTitle = {};
    form.getItems().forEach(item => byTitle[item.getTitle()] = item);

    const response = form.createResponse()
      .withItemResponse(byTitle[GOODGROVE.titles.name].asTextItem().createResponse(name))
      .withItemResponse(byTitle[GOODGROVE.titles.email].asTextItem().createResponse(email))
      .withItemResponse(byTitle[GOODGROVE.titles.service].asListItem().createResponse(service))
      .withItemResponse(byTitle[GOODGROVE.titles.message].asParagraphTextItem().createResponse(message));

    response.submit();
    return renderPage_(
      'Thank you, ' + name.split(/\s+/)[0] + '!',
      'Your project inquiry was successfully submitted to Goodgrove Digital. We will reach out using the email address you provided.',
      true
    );
  } catch (err) {
    console.error('Goodgrove inquiry submission failed: ' + err);
    return renderPage_(
      'We could not save your inquiry',
      'Please try again later or email ' + GOODGROVE.contactEmail + ' directly. Your inquiry has NOT been confirmed as submitted.',
      false
    );
  }
}

function escapeHtml_(input) {
  return String(input).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function renderPage_(heading, message, success) {
  const title = escapeHtml_(heading);
  const info = escapeHtml_(message);
  const icon = success ? '&#10003;' : '!';
  const color = success ? '#173F35' : '#9A5A37';
  return HtmlService.createHtmlOutput(
    '<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>' + title + ' — Goodgrove Digital</title>' +
    '<style>*{box-sizing:border-box}body{margin:0;padding:24px;display:grid;place-items:center;min-height:100vh;background:#F7F8F2;color:#26352E;font-family:Arial,Helvetica,sans-serif}' +
    '.card{max-width:540px;width:100%;padding:42px;border:1px solid #D9E5D9;border-radius:24px;background:#fff;box-shadow:0 12px 35px #173f3512}' +
    '.brand{color:#173F35;font-weight:800;font-size:26px;letter-spacing:-1.3px;margin-bottom:34px}.brand span{color:#F6BB9C}' +
    '.icon{display:grid;place-items:center;width:48px;height:48px;border-radius:50%;background:#A9D9B5;color:' + color + ';font-size:26px;font-weight:bold;margin-bottom:18px}' +
    'h1{font-size:clamp(27px,6vw,36px);line-height:1.17;letter-spacing:-1.2px;margin:0 0 16px}p{line-height:1.7;color:#536A5B;font-size:16px;margin:0 0 22px}' +
    '.foot{border-top:1px solid #E4ECE4;padding-top:18px;color:#789182;font-size:13px}a{color:#173F35;font-weight:bold}</style></head>' +
    '<body><main class="card"><div class="brand">goodgrove<span>.</span></div>' +
    '<div class="icon">' + icon + '</div><h1>' + title + '</h1><p>' + info + '</p>' +
    '<div class="foot">Goodgrove Digital &middot; You can close this tab and return to our website.</div>' +
    '</main></body></html>'
  ).setTitle('Goodgrove Digital — Inquiry');
}
