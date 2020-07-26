layui.use(['layer', 'form', 'table', 'upload'], function () {
    var $ = layui.jquery
        , table = layui.table
        , layer = layui.layer
        , form = layui.form
        , upload = layui.upload;

    let localData = [{
        "id": "10001"
        , "username": "杜甫"
        , "email": "xianxin@layui.com"
        , "sex": "男"
        , "city": "浙江杭州"
        , "sign": "人生恰似一场修行"
        , "experience": "116"
        , "ip": "192.168.0.8"
        , "logins": "108"
        , "joinTime": "2016-10-14"
    }, {
        "id": "10002"
        , "username": "李白"
        , "email": "xianxin@layui.com"
        , "sex": "男"
        , "city": "浙江杭州"
        , "sign": "人生恰似一场修行"
        , "experience": "12"
        , "ip": "192.168.0.8"
        , "logins": "106"
        , "joinTime": "2016-10-14"
        , "LAY_CHECKED": true
    }, {
        "id": "10003"
        , "username": "王勃"
        , "email": "xianxin@layui.com"
        , "sex": "男"
        , "city": "浙江杭州"
        , "sign": "人生恰似一场修行"
        , "experience": "65"
        , "ip": "192.168.0.8"
        , "logins": "106"
        , "joinTime": "2016-10-14"
    }, {
        "id": "10004"
        , "username": "贤心"
        , "email": "xianxin@layui.com"
        , "sex": "男"
        , "city": "浙江杭州"
        , "sign": "人生恰似一场修行"
        , "experience": "666"
        , "ip": "192.168.0.8"
        , "logins": "106"
        , "joinTime": "2016-10-14"
    }, {
        "id": "10005"
        , "username": "贤心"
        , "email": "xianxin@layui.com"
        , "sex": "男"
        , "city": "浙江杭州"
        , "sign": "人生恰似一场修行"
        , "experience": "86"
        , "ip": "192.168.0.8"
        , "logins": "106"
        , "joinTime": "2016-10-14"
    }, {
        "id": "10006"
        , "username": "贤心"
        , "email": "xianxin@layui.com"
        , "sex": "男"
        , "city": "浙江杭州"
        , "sign": "人生恰似一场修行"
        , "experience": "12"
        , "ip": "192.168.0.8"
        , "logins": "106"
        , "joinTime": "2016-10-14"
    }]

    //展示已知数据
    table.render({
        elem: '#demo'
        , toolbar: '#topTool'
        , cols: [[ //标题栏
            { field: 'id', title: 'ID', width: 80, sort: true, edit: 'text' }
            , { field: 'username', title: '用户名', width: 120, edit: 'text' }
            , { field: 'email', title: '邮箱', minWidth: 150, edit: 'text' }
            , { field: 'sign', title: '签名', minWidth: 160, edit: 'text' }
            , { field: 'sex', title: '性别', width: 80, edit: 'text' }
            , { field: 'city', title: '城市', width: 100, edit: 'text' }
            , { field: 'experience', title: '积分', width: 80, sort: true, edit: 'text' }
            , { fixed: 'right', width: 178, align: 'center', toolbar: '#rowTool' }
        ]]
        , data: localData
        , even: true
        , page: true //是否显示分页
        , limits: [5, 7, 10]
        , limit: 5 //每页默认显示的数量
    });

    var active = {
        add: function () {
            addUser();
        },
        reset: function () {
            localData.length = 0;
            table.reload('demo', {
                data: localData
            })
        },
        import: function () {
            
        },
        commit: function () {
            layer.msg(JSON.stringify(localData));
        }

    }

    // 监听头工具栏事件
    // 必须使用动态绑定的方式，否则表格reload之后头部工具栏绑定的事件全部没了
    $("body").on('click', '.layui-btn-container .layui-btn', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

    //监听行工具条事件
    table.on('tool(test)', function (obj) {
        var data = obj.data;
        var dataIndex = $(obj.tr).attr('data-index');
        if (obj.event === 'del') {
            layer.confirm('真的删除行么',
                function (index) {
                    obj.del();
                    layer.close(index);
                    deleteUser(dataIndex);
                });
        } else if (obj.event === 'edit') {
            obj.update(field);
            layer.alert('编辑行：<br>' + JSON.stringify(data))
        }
    });

    upload.render({
        elem: '#importExcel' //绑定元素
        , url: '' //上传接口（PS:这里不用传递整个 excel）
        , auto: false //选择文件后不自动上传
        , accept: 'file'
        , choose: function (obj) {// 选择文件回调
            var files = obj.pushFile();
            var fileArr = Object.values(files)// 注意这里的数据需要是数组，所以需要转换一下
            // 用完就清理掉，避免多次选中相同文件时出现问题
            for (var index in files) {
                if (files.hasOwnProperty(index)) {
                    delete files[index]
                }
            }
            importExcel([fileArr.pop()]);
        }
    });

    $('#reset').on('click', function () {
        localData.length = 0;
        table.reload('demo', {
            data: localData
        })
    });

    $('#addUser').on('click',function(){
        addUser();
    })

    $('#commit').on('click', function(){
        layer.msg(JSON.stringify(localData));
    });

    // 删除用户
    function deleteUser(index) {
        localData.splice(index, 1);
        table.reload('demo', {
            data: localData
        })
    }

    // 添加用户
    function addUser(edit) {
        var index = layui.layer.open({
            title: "添加用户",
            type: 2,
            fixed: false, //不固定
            area: ['60%', '80%'],
            maxmin: true,
            btn: ['确定', '取消'],
            content: "add.html",
            yes: function (index, layero) {//确认按钮的回调函数  该回调携带两个参数，分别为当前层索引、当前层DOM对象

                var body = layer.getChildFrame('body', index); //得到iframe页的body内容
                var id = body.find("input[name='id']").val();
                var username = body.find("input[name='username']").val();
                var email = body.find("input[name='email']").val();
                var sign = body.find("input[name='sign']").val();
                var sex = body.find("input[name='sex']").val();
                var city = body.find("input[name='city']").val();
                var experience = body.find("input[name='experience']").val();

                localData.push({
                    "id": id
                    , "username": username
                    , "email": email
                    , "sex": sex
                    , "city": city
                    , "sign": sign
                    , "experience": experience
                    , "ip": "192.168.0.8"
                    , "logins": "108"
                    , "joinTime": new Date()
                });

                table.reload("demo", {
                    data: localData   // 将新数据重新载入表格
                })
                layer.close(index);
            }
        });
        //layui.layer.full(index);
        window.sessionStorage.setItem("index", index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）  
    }

    // 导入表格
    function importExcel(files) {
        var excel = layui.excel;
        try {
            excel.importExcel(files, {
                fields: {
                    'id': 'A'
                    , 'username': 'B'
                    , 'email': 'C'
                    , 'sex': 'D'
                    , 'city': 'E'
                    , 'sign': 'F'
                    , 'experience': 'G'
                    , 'ip': 'H'
                    , 'logins': 'I'
                    , 'joinTime': 'J'
                }
            }, function (data) {
                console.log(data);
                var importData = data['0']['Sheet1'];
                for(let i in importData){
                    localData.push(importData[i]);
                }
                table.reload('demo', {
                    data: localData
                });
            });
        } catch (e) {
            layer.alert(e.message);
        }
    }
});