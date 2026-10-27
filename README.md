martinzzz@martinzzzs-mbp invoice-generator %
martinzzz@martinzzzs-mbp invoice-generator % git status
On branch main
nothing to commit, working tree clean
martinzzz@martinzzzs-mbp invoice-generator % git remote -v
origin https://github.com/martinmounir/invoice-generator.git (fetch)
origin https://github.com/martinmounir/invoice-generator.git (push)
martinzzz@martinzzzs-mbp invoice-generator % git push -u origin main
Username for 'https://github.com': martinmounir
Password for 'https://martinmounir@github.com':
remote: Invalid username or token. Password authentication is not supported for Git operations.
fatal: Authentication failed for 'https://github.com/martinmounir/invoice-generator.git/'
martinzzz@martinzzzs-mbp invoice-generator % gh --version
zsh: command not found: gh
martinzzz@martinzzzs-mbp invoice-generator % brew install gh
zsh: command not found: brew
martinzzz@martinzzzs-mbp invoice-generator % git ls-remote origin
305ad2c16a2616327cb55de9d6e327524466ad5a HEAD
305ad2c16a2616327cb55de9d6e327524466ad5a refs/heads/main
martinzzz@martinzzzs-mbp invoice-generator % cd ~/Desktop/invoice-generator
martinzzz@martinzzzs-mbp invoice-generator % git remote -v
git status
git branch -vv
origin https://github.com/martinmounir/invoice-generator.git (fetch)
origin https://github.com/martinmounir/invoice-generator.git (push)
On branch main
nothing to commit, working tree clean

- main 1b6a8dd Initial commit: Invoice Generator
  martinzzz@martinzzzs-mbp invoice-generator % git fetch origin
  martinzzz@martinzzzs-mbp invoice-generator %
  martinzzz@martinzzzs-mbp invoice-generator %
  martinzzz@martinzzzs-mbp invoice-generator % git status
  git log --oneline --decorate --all -8
  On branch main
  nothing to commit, working tree clean
  1b6a8dd (HEAD -> main) Initial commit: Invoice Generator
  305ad2c (origin/main, origin/HEAD) Remove project details from README.md
  69197d0 README
  d34fef4 Initial commit
  martinzzz@martinzzzs-mbp invoice-generator %
  martinzzz@martinzzzs-mbp invoice-generator % git merge-base main origin/main
  martinzzz@martinzzzs-mbp invoice-generator % git merge-base main origin/main
  martinzzz@martinzzzs-mbp invoice-generator % git branch backup-before-merge
  martinzzz@martinzzzs-mbp invoice-generator % git merge-base main origin/main
  martinzzz@martinzzzs-mbp invoice-generator %
  martinzzz@martinzzzs-mbp invoice-generator % git merge origin/main --allow-unrelated-histories
  Auto-merging README.md
  CONFLICT (add/add): Merge conflict in README.md
  Automatic merge failed; fix conflicts and then commit the result.
  martinzzz@martinzzzs-mbp invoice-generator % code README.md
  zsh: command not found: code
  martinzzz@martinzzzs-mbp invoice-generator % code README.md
  zsh: command not found: code
  martinzzz@martinzzzs-mbp invoice-generator %
  martinzzz@martinzzzs-mbp invoice-generator % >....  
  **Deploying the frontend alone does not deploy the API or database.** Database-backed invoice saving will only work when the backend and database are deployed and configured correctly.

## Security

- Never commit `.env` files, API keys, database credentials, access tokens, private certificates, or real customer data.
- Keep `.env` files excluded through `.gitignore`.
- If a secret is accidentally committed, rotate it. Removing it from the latest version alone may not remove it from Git history.
- A public repository makes its source code visible to everyone.
- Do not put private credentials in frontend code or Vite environment variables.

## Current Scope

The project provides an invoice editor and printable invoice preview. Production invoice persistence depends on a correctly configured and deployed API and database.

## License

No license has been specified yet. Unless a license is added to this repository, others do not automatically receive permission to reuse, modify, or distribute
