/**
 * Created by user on 2017/12/1.
 */
// import Mock from 'mockjs'

let users

// 创建用户
export function create (req, res) {
  let name = req.body.name
  let username = req.body.username
  let password = req.body.password
  let describe = req.body.describe
  users.push({
    name: name,
    username: username,
    password: password,
    describe: describe
  })
  res.json({'status': 200, 'msg': '添加成功'})
}

// 编辑用户
export function update (req, res) {
  let id = this.trim(res.params.id || '')
  if (!id) {
    return res.json({'status': 4001, 'msg': '参数不合法'})
  }
  let name = req.body.name
  let username = req.body.username
  let password = req.body.password
  let roles = res.body.roles
  let describe = req.body.describe
  let i = this.findIndex(users, (u) => {
    return u.id === id
  })
  if (i > -1) {
    users[i].name = name
    users[i].username = username
    users[i].password = password
    users[i].roles = roles
    users[i].describe = describe
    res.json({'status': 200, 'msg': '修改成功'})
  } else {
    res.json({'status': 40002, 'msg': '修改失败'})
  }
}
