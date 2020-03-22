/*
  代码提交的流程
  fetch develop最新代码 => rebase最新代码 => build => 输入commit信息 => 提交代码 => 通知更新

*/
const git = require('simple-git/promise')
let simpleGit = git(`D:/test/test_vscode_debug/git2/localFileTrans`)
async function initSimpleGit () {
  // simpleGit = git(`D:/test/test_vscode_debug/git2/localFileTrans`)
  try {
    let statusObj = await getStatus()
    let needStash = statusObj.files.length > 0
    if (needStash) { // 存在未 commit 的文件
      // stash这部分文件
      await stashFiles()
    }
    await rebaseDevelop() // rebase文件
    // 成功后pop 出stash的文件
    needStash && await popStash()

  } catch (error) {
    console.log(error)
  }
}
function fetchDevelop () {
    simpleGit.fetch()
    return simpleGit
}
async function rebaseDevelop (branch) { // rebase 
    try {
        await simpleGit.rebase(['origin/master'])
    } catch (error) {
        console.log(error)
    }
}
async function getStatus () {
    let data = await simpleGit.status()
    return data
}
async function stashFiles () {
    await simpleGit.stash(['save', new Date().toLocaleDateString()])
    let list = await simpleGit.stash(['list'])
    console.log(list)
}
async function popStash () {
    await simpleGit.stash(['pop'])
}
initSimpleGit()
// popStash()
// getStatus()
// fetchDevelop()
// rebaseDevelop()
// fetchDevelop()

// simpleGit.branch().then(value => console.log(value))