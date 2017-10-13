# markdown笔记应用 MarkNote

## 一些程序逻辑记录

### 获得笔记标题逻辑

1. 获取所有已一个#开头的行，其中第一行则为标题行

```javascript
title_line_reg = /^#[^#].*$/gm;
```

2. 从第一步中获得的标题行中取出#后面的内容则为笔记标题

```javascript
title_reg = /[^#\s]{1}.*/g;
```

### 保存笔记、标签逻辑

1. 检查笔记标题是否为空，为空则不做任何处理，不为空则保存笔记，如果笔记已存在则会更新笔记内容

2. 保存笔记成功后，保存标签，保存标签和笔记的对应关系，（后台控制标签为空不做任何处理，前端标签为空也发送ajax）

3. 刷新菜单，更新url（新建笔记后跳转到笔记页，而不是留在新建页面），重新获取笔记数据

## 接口数据说明

1. menus

    1.1 GET:

        [
            {
                name: "",
                notes: [],
                open: false
            }
            .......
        ]

2. notes

    2.1 GET:

        {
            content: "",
            datetime: "",
            labels: []
        }

    2.2 POST:

        {
            title: "",
            content: "",
            datetime: ""
        }

3. labels

    3.1 GET:

        ["label_name01", "label_name02", .....]

    3.2 POST:

        {
            note_title: "",
            label_name: ""
        }