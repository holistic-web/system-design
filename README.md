# System Design Website

A tool to capture screenshots from a given livestream and have these shown on a static website. These images will update live in front of the user every 5 seconds. The screenshots are taken with the npm screenshot tool, stored in AWS S3 with Pusher notifications being sent to tell the site to update.

## Using this tool

1. Download Node js from https://nodejs.org/en/download/

2. Run the installation, clicking through without changing any of the default settings.

3. Download this repository as a ZIP folder using the 'Code' button above and unzip.

4. Copy the .env file you have been given. Go to the screenshot-tool inside system-design and paste in the .env file.

5. Open a terminal. This can be done by running 'Command Prompt' on Windows.

6. Enter the file by typing 'cd ' followed by the location of the screenshot-tool e.g. 'cd C:\example\system-design\screenshot-tool'

7. Install dependencies by typing 'npm install'.

8. Run the code by typing 'npm run start'.

9. A screenshot of your desktop will now be taken every 5 seconds and hosted at the url http://system-design-hosting.s3-website.ap-east-1.amazonaws.com/
