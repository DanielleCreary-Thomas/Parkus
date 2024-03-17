1. cd to the repo clone on your device
2. `git checkout main` switches you to the main branch if you weren't there already
3. `git pull` get the latest version of main
4. `git checkout -b <Jira Ticket ID>-<Jira Description>` to create a new branch off of your current branch (we're on main so it'll be for main) for the feature you're going to implement(ie. Jira Ticket)
   example `git checkout -b PARKUS-31-loginFunctionality`
5. `git branch` will list all the branches and show current branch in green
6. `git push --set-upstream origin <branchName>` to push the new branch to the repo
7. now you can do all your development for the feature, 
	1. `git add --a` add all
	2. `git commit -m "<your message>"` 
	3. `git push`
8. You should only merge your branch after our meetings to confirm that the feature is fully complete and ready to merge to main
9. To merge your branch
	1. checkout to main branch
	2. pull main branch
	3. `git merge <branch name>` will add branch changes to main branch, if there are conflicts you will be notified here
	4. `git push` pushes changes branch to repo
10. Once you're done the feature and it's on the main branch you repeat all steps for another feature