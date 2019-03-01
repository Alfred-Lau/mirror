module.exports = {
  "index": {
    "breadcrumb": {
      "label":"列表"
    },
    "custom": [{
      "label": "姓名",
      "id": "name",
      "render": "() => { return <Input />;}"
    }, {
      "label": "年龄",
      "id": "age",
      "render": "() => {return <Input />;}"
    }],
    "columns": [{
        "title": "测试",
        "key": "test1"
      },
      {
        "title": "测试2",
        "key": "test2"
      }
    ]
  },
  "detail": {
    "breadcrumb": {
      "label": "详情"
    }
  },
  "service": {

  },
  "route": {
    "index": "",
    "detail": ""
  },
  "model": {

  }
}
