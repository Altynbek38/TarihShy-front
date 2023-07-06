# nFactorial Incubator Next.js Starter

This is a starting point for your AI Next.js project. It comes with a landing page, user authentication, and a chatbot UI hooked up to the OpenAI API.

## Where to start

We'll first deploy a demo of the project to Vercel (i.e. have an app you can share with others right away!) & create a repo for us to start developing from:

Make sure you have access to the following folder: https://github.com/nfactorial-incubator/2023-react/tree/main/nfactorial-nextjs-starter. (Request for repo access from mentors if you having trouble seeing this page)

Next, we can start our deployment to Vercel with the button below:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnfactorial-incubator%2F2023-react%2Ftree%2Fmain%2Fnfactorial-nextjs-starter&env=GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET,NEXTAUTH_SECRET,OPENAI_API_KEY&envDescription=Look%20into%20the%20README%20or%20the%20'Learn%20More'%20to%20learn%20what%20to%20populate%20the%20values%20with.&envLink=https%3A%2F%2Fgithub.com%2Fnfactorial-incubator%2F2023-react%2Fblob%2Fmain%2Fnfactorial-nextjs-starter%2F.env.example&project-name=my-first-ai-project&repository-name=my-first-ai-project)

1) In the `Create Git Repository`, choose `Github` as our provider, this will prompt you to authorize Vercel to your Github account.

2) Rename the `my-first-ai-project` with your new project name. You can always change this later. Click `Create` to create the repo.

3) In the `Configure Project` section, you'll see a list of environment variables we'll need to populate:

* Create a Google OAuth app through the [instructions here](https://refine.dev/blog/nextauth-google-github-authentication-nextjs/#for-googleprovider-make-sure-you-have-a-google-account). For "Authorized redirect URIs", ignore the production URI for now. Don't forget to publish the Google app in order for others to be able to sign-in. Paste the obtained Google Client ID to the `GOOGLE_CLIENT_ID` field, and the Google Client Secret to the `GOOGLE_CLIENT_SECRET` field. 
* Populate the `NEXTAUTH_SECRET` field with a string you can [generate here](https://generate-secret.vercel.app/32).
* Create an OpenAI API key through the [instructions here](https://www.howtogeek.com/885918/how-to-get-an-openai-api-key/). Save the generated API key somewhere safe, and paste it to the `OPENAI_API_KEY` field.

4) Click `Deploy`.

Once your app is built & deployed, click `Continue to Dashboard`. You should be able to visit your app through the `Visit` button (with the URL being something like `my-first-project-xxxx.vercel.app`), feel free to play around with it.

If you click the `Git Repository` button, it should take you to the new Github repo to start working from. Now anytime you push to that repo, Vercel will automatically create a new build at that url!

## Cool, but how do I run this project locally now?

Since Vercel created a new repo for us, you can clone it (change `your-github-name` to your own, and `my-first-ai-project` if you chose a different project name):
```bash
git clone git@github.com:your-github-name/my-first-ai-project
```
Then, install project dependencies
```
cd my-first-ai-project
pnpm install
```

Next, we'll need to copy the `.env.example` file as `.env.local`, and make some changes in `.env.local`:

* We need some of the environment variables we set during the Vercel deployment. You can now find them at `Your Vercel Dashboard -> Choose your project in the list (should be something like 'my-first-ai-project-xxxx') -> 'Settings' -> 'Environment Variables'`. Copy the `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` and `OPENAI_API_KEY`, and paste it to the `.env.local` file. The file show now include the following:
```
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET

...

OPENAI_API_KEY=YOUR_OPENAI_API_KEY
```

While in the project folder, launch the development server:
```
> npm run dev
```
App should now be available at [`http://localhost:3000`](http://localhost:3000).

With any new commits to the repo, Vercel will automatically re-deploy the new version of the app, so you don't have to worry about deployments. Build away & have fun!

***

### Frameworks

- [Next.js](https://nextjs.org/) – React framework for building performant apps with the best developer experience
- [Auth.js](https://authjs.dev/) – Handle user authentication with ease with providers like Google, Twitter, GitHub, etc.

### Platforms

- [Vercel](https://vercel.com/) – Easily preview & deploy changes with git

### UI

- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework for rapid UI development
- [Headless UI](https://headlessui.com/) – Primitives like modal, popover, etc. to build a stellar user experience
- [Heroicons](https://heroicons.com/) – Beautiful hand-crafted SVG icons, by the makers of Tailwind CSS.

### Code Quality

- [Prettier](https://prettier.io/) – Opinionated code formatter for consistent code style
- [ESLint](https://eslint.org/) – Pluggable linter for Next.js

### Miscellaneous

- [Vercel Analytics](https://vercel.com/analytics) – Track unique visitors, pageviews, and more in a privacy-friendly way

### Inspirations/Further Resources

- [Predecent](https://github.com/steven-tey/precedent/) - Steven Tey's next.js starter project
- [Chatbot UI](https://chatbotui.com/) - open-source ChatGPT clone
- [Vercel AI Chat GPT-3 example](https://github.com/vercel/examples/tree/main/solutions/ai-chatgpt)