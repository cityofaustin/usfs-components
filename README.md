# usfs-components
Custom components for USFS forms

## Running locally
We are utilizing [storybook](https://storybook.js.org/) for developing our components, to run storybook locally you can run
`yarn storybook`

## How to use

We're currently publishing this to npm and using it as a package. 

In order to utilize updates: 

* Have your branch you like, make sure it can cleanly merge with master
* Merge master into your branch 
* Build
* Merge your branch with the new build and everything into master
* Pull master and run yarn publish
* npm will ask for yer creds
* on sucessful publish, push to master again to update the version number in package.json
