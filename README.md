# Decode Challenge

We recommend opening this file with a Markdown viewer. (https://www.google.com/search?q=markdown+viewer)

## Instructions

1. Open this [link](https://tns4lpgmziiypnxxzel5ss5nyu0nftol.lambda-url.us-east-1.on.aws/challenge)
2. Find a hidden URL within the HTML
   - Each character of the URL is given by this DOM tree, in this specific order. You need to find (in order) all of the occurrences and join them to get the link.
   - The asterisk **(\*)** is a wildcard representing zero or more characters that can be present in the string. These characters are irrelevant to the result and should be ignored.
   - There can be zero or more DOM nodes between each valid tag. These nodes are irrelevant to the result.
   - Any additional attribute that doesn't interfere with the described pattern can be safely ignored.

Pattern of the DOM tree for each valid character of the URL

```html
<section data-id="92*">
  <article data-class="*45">
    <div data-tag="*78*">
      <b class="ref" value="VALID_CHARACTER"></b>
    </div>
  </article>
</section>
```

(_To validate this step, you should be able to open the URL and get an English word. This means you have captured the flag!_ 🥳)

3. Create a CodeSandbox React application
4. Make an HTTP request to URL obtained in step 2 to load the flag into a React component
   - Don't use any external libraries. Use browser APIs
   - Render a "Loading..." text while the request is ongoing
5. Render the flag you loaded in step 4 with the following conditions:
   - Simulate a typewriter effect with a half second delay between each character. _Start showing nothing and then display characters one by one until the full string is displayed._
   - No style required
   - Render the flag a list, where each character is a list item
   - Animation should trigger after you load the flag
   - Animation should run only once
   - Use React APIs only. Don't use CSS or external libraries

Bonus: Add as a comment the script you used to to get the URL in step 2

```javascript
/**
 *  Hidden URL Script
 */
[...document.querySelectorAll(
  'section[data-id^="92"] article[data-class$="45"] div[data-tag*="78"] b.ref'
)]
  .map(n => n.getAttribute('value'))
  .join('');
```

## Submission

Paste the flag you captured in step 2 and the link to your CodeSandbox in the job application with the following format:

`<FLAG> - <LINK>`

`<https://tns4lpgmziiypnxxzel5ss5nyu0nftol.lambda-url.us-east-1.on.aws/challenge> - <https://wgg522pwivhvi5gqsn675gth3q0otdja.lambda-url.us-east-1.on.aws/616d69>`

_Replace the placeholders with your captured flag and corresponding link._

We're aware answers here might eventually be leaked and we'll probably have to refresh this every couple months or so, but please keep in mind it'll be very easy to tell once that happens and will only result in slowing down our ability to process applications - so please keep the result to yourself.

**IMPORTANT: It is critical that your answer is provided in this format to ensure your submission is properly reviewed.**

\[1\]: https://en.wikipedia.org/wiki/Capture_the_flag_(cybersecurity)

## Scripts

### URL Extraction Script

A Python script is provided to automate the extraction of the hidden URL from the HTML source.

#### Usage

1. Save the HTML source from the challenge link to `scripts/source.html`
2. Run the extraction script:
   ```bash
   python scripts/extract_flag_url.py
   ```
3. The script will:
   - Parse the HTML to find all matching DOM patterns
   - Extract characters in the correct order
   - Output the complete URL

#### Requirements

- Python 3.6+
- BeautifulSoup4 (install with `pip install beautifulsoup4`)

#### How it works

The script searches for the specific DOM pattern:
- `<section>` tags with `data-id` starting with "92"
- Nested `<article>` tags with `data-class` ending with "45"
- Nested `<div>` tags with `data-tag` containing "78"
- Extracts the `value` attribute from nested `<b class="ref">` tags

The extracted characters are concatenated to form the complete URL.
