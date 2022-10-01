---
name: Release Checklist
about: Use this checklist when releasing a new version.
title: Release v0.0
labels: documentation
assignees: jhorback

---

- [ ] Update any Rennovate dependency items
- [ ] Ensure corresponding milestone issues are 100% complete
- [ ] Create release branch using Gitflow
- [ ] Build and test
- [ ] Review the README.md for any changes if neccessary
- [ ] Update the CHANGELOG.md
- [ ] Update package version
- [ ] Merge release into master using Gitflow
- [ ] Push git tags `git push origin --tags`.
- [ ] Add release to git; add changelog notes for the specific release.
- [ ] Close milestone
