## jQit
####Requirements:
- [ ] Make the tracking code public
- [ ] Monitor all repositories
- [ ] Track pull requests and issues
- [ ] Track opens and closes, not just total open count
- [ ] Track average age
- [ ] Push the data into Splunk
- [ ] Track age range (as well as average age)
- [ ] Track average age at which issues get closed
- [ ] Track average age at which PRs get closed
- [ ] Track % PRs that get closed as opposed to merged (if possible)
- [ ] View tracking by team (i.e. all repos that fall under the chosen team)
- [ ] For each repo, view who created PRs over time
- [ ] For each repo, view who closed issues
- [ ] For each repo, view who closed/landed PRs
- [ ] For each repo, track issues that are assigned vs not assigned

**Actual requirements can be found [here] [requirements].**

  ------
**Implementation Requirements** 
-
 - [NodeJS] [node-requirements]
 - [MongoDB] [mongodb-requirements] 
 - Package Manager ([NPM][npm-requirements]/[Homebrew][homebrew-requirements]) 
 - Data Gatherer [jQit Bot][jqit-bot]


**Implementation**
-
In the Terminal.
```bash
$ cd jquery-issue-tracker-0.1.0
$ npm install --save
$ node server.js
```
Open the browser and enter the URL
```bash
localhost:3000
```

[requirements]: https://github.com/jquery/content/issues/4  
[node-requirements]: https://nodejs.org/
[mongodb-requirements]: https://www.mongodb.org/
[npm-requirements]: https://docs.npmjs.com/getting-started/installing-node
[homebrew-requirements]: http://brew.sh/
[jqit-bot]: https://github.com/markogrady1/jQit-Bot

####Enjoy!!!
