# Goodgrove Digital — agency website

A complete, responsive single-page marketing website made for **Goodgrove Digital**, with **goodgrove.** as the customer-facing brand.

## What's included

- `index.html` — content, navigation, featured work, services, process, founder bio, FAQ, and contact form.
- `styles.css` — complete responsive brand styling and visual illustrations.
- `script.js` — mobile menu, scroll reveals, Google Forms submission, and email fallback.
- `assets/favicon.svg` — Goodgrove-inspired leaf and G favicon.
- `assets/social-preview.svg` — social sharing image.
- `assets/goodgrove-logo.svg` — standalone Goodgrove wordmark artwork.

## Running locally

Open `index.html` in a browser, or start a local server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploying to Vercel

1. Create a new GitHub repository and upload the files in this folder (keep `index.html` at the root).
2. In Vercel, click **Add New → Project**, select your repository, choose **Other** framework preset, and deploy.
3. No build command or environment variables are required. Alternatively, upload this folder to any static web hosting platform.
4. Add your own verified domain in Vercel's project settings when ready.

## Brand identity

- Customer-facing logo/brand: **goodgrove.**
- Full name for formal communication: **Goodgrove Digital**
- Primary: `#173F35` (Forest Green)
- Secondary: `#A9D9B5` (Soft Mint)
- Background: `#F7F8F2` (Warm Off-White)
- Accent: `#F6BB9C` (Soft Peach)
- Text: `#26352E` (Charcoal)
- Fonts: Plus Jakarta Sans (headings), DM Sans (body), with system fallbacks
- Lead message: Beautiful websites. Smarter workflows. Better business.

## Included content sources

Project links, experience, service areas, booking link, and email are drawn from Marcus Paredes' published portfolio at https://marcusparedes-website.vercel.app/. Descriptions of the live projects were checked against their respective sites. NexHaul is identified as a portfolio concept and the wedding site as a portfolio demo; no fictional clients, testimonials, or fabricated results are used.

## Contact form: Google Forms + your Google Sheet (URL configured)

**The website contact form is now configured** to POST submissions to the Apps Script web app URL provided by the owner:

`https://script.google.com/macros/s/AKfycbyD5s13CRbt1EY--5dgcp4oVDsBqXWIUax8cCcjjqFqMWVUwMc2IA44JayHTtkEBHXd/exec`

The linked Google Sheet created in the connected Drive is:

https://docs.google.com/spreadsheets/d/1S-P-ht72I6yw-7ar9HBcDtFcjvY09YEEvnCB-sQ1ixI/edit

The existing website form sends `name`, `email`, `service`, and `message`. The script's `doPost(e)` writes a real Google Form response, and the form should sync that response to the Sheet's **Form Responses 1** tab. The webpage uses a normal form POST (instead of a cross-origin AJAX request), so a branded Google Apps Script receipt opens in a separate tab. Only a receipt indicating success confirms a submission.

**Required live end-to-end verification:** The owner should open the `/exec` URL in a browser to check whether the script reports that the form receiver is ready, then send a test inquiry from the deployed Goodgrove website. Check both the confirmation page and that the response appears in the Google Form/Sheet. We could verify the local site logic, but the live script endpoint could not be accessed from this environment; no real submission has been sent here.

If the Google endpoint does not accept submissions, check these owner settings:

1. In the Apps Script editor, run `setupGoodgroveForm()` and authorize the project (once). The function creates or finds the form and links it to the Google Sheet. If already configured, it logs the existing form.
2. **Deploy → Manage deployments**; open the web app deployment and verify **Execute as: Me**, **Who has access: Anyone**. If you changed code after deployment, create a new version and update the deployment.
3. Ensure the Google Form is accepting responses and check the Apps Script **Executions** tab for errors. Do not give visitors access to the editor or Sheet.
4. Retest with a non-sensitive inquiry after the website is re-deployed to Vercel.

The source for the associated owner-managed Google Apps Script is included in `google-forms/Code.gs`; you do **not** need to upload `Code.gs` to Vercel for the contact form to work. The public `/exec` URL may be kept in frontend code. Never put OAuth tokens, API secrets, or private spreadsheet access tokens in frontend files.

**Email notifications:** In Google Forms → Responses → three-dot menu, enable *Get email notifications for new responses* (menu placement may change). Or build an email alert in Apps Script.

**Privacy and spam:** The website has a basic honeypot field, but this is not comprehensive spam prevention. Put a clear privacy notice on the website before launch, since the form collects names, email addresses, and project details. Don't collect passwords or sensitive credentials. Keep the Google Sheet and form editor permissions private.

## Before public launch

- Confirm **Goodgrove Digital** name, trademarks, and `.com` domain availability in the Philippines and any countries you plan to target.
- Update the contact email to your business inbox if you create one.
- Recheck the published portfolio projects and booking calendar URLs.
- If needed, replace portfolio concepts with paid client work once you have client permission to display it.
- Add a privacy policy before connecting analytics, tracking pixels, or a server-backed contact form.
- Add a full absolute social share image URL after choosing your final domain (currently a local asset path).

© 2026 Goodgrove Digital — website starter.


## Featured work: actual website screenshot previews

The **Selected Work** cards have been updated from CSS-drawn mockups to screenshots
of the actual project website homepages:

- Lumière Skin Studio: https://lumiere-skinstudio.vercel.app/
- NexHaul Logistics: https://nexhaul-logistics.vercel.app/
- Angelo & Alexandra Wedding Website: https://angelo-alexandra-wedding-website.vercel.app/

Preview images are requested from the public **Thum.io website screenshot service**
(`image.thum.io`) using the actual project URLs. If that service fails to load,
the site automatically tries **WordPress mShots** (`s.wordpress.com`).
If both fail, a clear **preview unavailable** message appears with a working
link to the actual site. The preview may take some seconds to generate on first
load, especially on slow connections. Dynamic screenshot URLs depend on these
external services and their pricing/usage limits; they are not permanently
stored static screenshots in this archive.

**Recommended for production:** capture actual screenshots yourself using your
browser and save the images as local `/assets/` files. Then replace each
`website-preview-image` `src` in `index.html` with the local screenshot path
and remove or update the `data-fallback-src` attribute. This removes the
third-party dependency and gives you more control over the crop and quality.

The rest of the website and the Google Forms integration are unchanged.

### Save local screenshots instead (optional)

For a faster website that does not rely on a third-party screenshot request each time
someone views your portfolio, run the included helper on your own computer **with
Internet access**:

```bash
python3 tools/save_project_screenshots.py
```

It downloads all three real homepage previews, checks that each is a valid PNG,
saves them under `assets/previews/`, and updates `index.html` to use the static
images. It only updates the HTML after **all three** downloads succeed. This
helper uses Thum.io's public endpoint; check their current usage allowance.
Review the saved images to confirm the screenshot service captured the correct
content (not an error page) before publishing. You can also replace those PNGs
with your own browser screenshots, keeping the same filenames.
