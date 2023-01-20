---
name: Create New Environment Checklist
about: Steps to take to create an environment for a new website instance
title: Create New Environment <name>
labels: documentation, techdebt
assignees: jhorback

---

## Add new Firebase project
- [ ] Add new project in the firebase console
- [ ] For the projectId, use -dev or -stage suffix for development projects; for production use a -prod suffix
- [ ] Enable Google analytics
  > Create a new analytics account using the projectId for new production projects

## Setup Firebase resources
- [ ] Enable Firestore database
  > Use us-east1 for the Clound Firestore location
- [ ] Enable Cloud Storage (us-east1)
- [ ] Enable Google Authentication
- [ ] Add App and enable Hosting
  > On the project overview page add a web app
  > Name it the same as the projectId without the suffix
  > Check "Also setup Firebase Hosting"
  > This will provide the Firebase configuration
  > If needed, open the app settings and set the environment to Production

## Create Firebase Service Account Key
- [ ] Create key
```sh
firebase use <alias>
firebase init hosting:github
```
> This will create the environment variable in github
The generated github task can be deleted, but copy the key
for the next step


## Update Harbor code
- [ ] Save the Firebase configuration in harbor.config
- [ ] Create new harbor theme and update the harbor.config
  > This is likely a separate ticket and should already be done
- [ ] Update Github task; for production, add variables to the deploy-prod task


## Deploy Firebase rules
- [ ] Deploy rules
```sh
firebase use <alias>
firebase deploy --only firestore:rules
firebase deploy --only storage
```


## Deployment
- [ ]  For production sites, merge into master and test


## Update Domain
- [ ] Follow instructions in Firebase and site host to setup domain name
- [ ] Add authorized domain in Firbase Console -> Authentication -> Settings
  > Also add `127.0.0.1` for vite to work locally
- [ ] Add the domain to tinymce
  > https://www.tiny.cloud/tinymce/
