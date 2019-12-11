const result = {
    "code": 0,
    "data": {
      "items": [
        {
          "_id": "5d5b98ffb0c02b3f78e34e79",
          "code": "query",
          "name": "查询",
          "desc": "控制显示菜单同时页面显示列表",
          "state": true,
          "timestamp": "2019-08-20T06:53:51.485Z",
          "__v": 0
        },
        {
          "_id": "5d5b994db0c02b3f78e34e7a",
          "code": "detail",
          "name": "详情",
          "desc": "控制页面中【详情】按钮",
          "state": true,
          "timestamp": "2019-08-20T06:55:09.065Z",
          "__v": 0
        },
        {
          "_id": "5d5b99c0b0c02b3f78e34e7b",
          "code": "add",
          "name": "新增",
          "desc": "控制页面【新增】按钮",
          "state": true,
          "timestamp": "2019-08-20T06:57:04.225Z",
          "__v": 0
        },
        {
          "_id": "5d5b9a37b0c02b3f78e34e7c",
          "code": "edit",
          "name": "编辑",
          "desc": "控制页面【编辑】按钮",
          "state": true,
          "timestamp": "2019-08-20T06:59:03.640Z",
          "__v": 0
        },
        {
          "_id": "5d5b9a6db0c02b3f78e34e7d",
          "code": "delete",
          "name": "删除",
          "desc": "控制页面【删除】按钮",
          "state": true,
          "timestamp": "2019-08-20T06:59:57.693Z",
          "__v": 0
        },
        {
          "_id": "5d5b9a88b0c02b3f78e34e7e",
          "code": "import",
          "name": "导入",
          "desc": "控制页面【导入】按钮",
          "state": true,
          "timestamp": "2019-08-20T07:00:24.673Z",
          "__v": 0
        },
        {
          "_id": "5d5b9aa6b0c02b3f78e34e7f",
          "code": "export",
          "name": "导出",
          "desc": "控制页面【导出】按钮",
          "state": true,
          "timestamp": "2019-08-20T07:00:54.872Z",
          "__v": 0
        },
        {
          "_id": "5d5b9ac4b0c02b3f78e34e80",
          "code": "audit",
          "name": "审核",
          "desc": "控制页面【审核】按钮",
          "state": true,
          "timestamp": "2019-08-20T07:01:24.744Z",
          "__v": 0
        }
      ],
      "total": 8
    }
  }


  export default [
    // user login
    {
      url: '/button/list',
      type: 'post',
      response: config => {
        return result
      }
    },
  
    {
        url: '/button/update',
        type: 'post',
        response: config => {
          return {
            code:0
          }
        }
      },
  ]
  