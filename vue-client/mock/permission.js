const result = {
  "code": 0,
  "data": {
    "items": [
      {
        "permission": [
          "query",
          "detail",
          "add",
          "edit",
          "delete",
          "import"
        ],
        "_id": "5d55359ed7c698247ca6d2a6",
        "code": "user",
        "name": "用户管理",
        "desc": "后台用户管理",
        "state": true,
        "timestamp": "2019-08-15T10:36:14.629Z",
        "__v": 0,
        "permissions": []
      },
      {
        "permission": [
          "query",
          "add",
          "edit",
          "delete"
        ],
        "_id": "5d553d54d7c698247ca6d2a9",
        "code": "permission",
        "name": "权限管理",
        "desc": "",
        "state": true,
        "timestamp": "2019-08-15T11:09:08.759Z",
        "__v": 0
      },
      {
        "permission": [
          "query",
          "detail",
          "add",
          "edit",
          "delete"
        ],
        "_id": "5d5646f83834ae1428d6704b",
        "code": "roles",
        "name": "角色管理",
        "desc": "",
        "state": true,
        "timestamp": "2019-08-16T06:02:32.762Z",
        "__v": 0
      },
      {
        "permission": [
          "query",
          "detail",
          "add",
          "edit",
          "delete",
          "import",
          "export"
        ],
        "_id": "5d5676b607a07e23f43947e6",
        "code": "test",
        "name": "测试页面",
        "desc": "",
        "state": true,
        "timestamp": "2019-08-16T09:26:14.136Z",
        "__v": 0
      },
      {
        "permission": [
          "query",
          "detail",
          "add",
          "edit",
          "delete"
        ],
        "_id": "5d5b973419a33f3f2037ed8d",
        "code": "button",
        "name": "按钮配置",
        "desc": "通过配置达到按钮级别权限控制",
        "state": true,
        "timestamp": "2019-08-20T06:46:12.123Z",
        "__v": 0
      }
    ],
    "total": 5
  }
}

  export default [

    {
      url: '/permission/list',
      type: 'post',
      response: config => {
        return result
      }
    },
  
    {
      url: '/permission/update',
      type: 'post',
      response: config => {
        return {
          code:0
        }
      }
    },
  ]
  