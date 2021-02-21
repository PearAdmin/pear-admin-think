layui.use(['table', 'form', 'jquery'], function() {
    let table = layui.table;
    let form = layui.form;
    let $ = layui.jquery;
    let cols = [
        [{
                type: 'checkbox'
            },
            {
                field: 'id',
                 title: 'ID', 
                 sort: true, 
                 align: 'center',
                 unresize: true,
                 width: 80
            },{
                field: 'type',
                title: '存储位置',
                unresize: true,
                align: 'center'
            },{
                field: 'name',
                title: '文件名称',
                unresize: true,
                align: 'center'
            },{
                field: 'href',
                title: '图片',
                unresize: true,
                align: 'center',
                templet:function (d) {
                    return '<img class="photo" photo-data="' + d.href + '" src=" '+d.href+'"></i>';
                }
            },{
                field: 'mime',
                title: 'mime类型',
                unresize: true,
                align: 'center'
            },{
                field: 'size',
                title: '文件大小',
                unresize: true,
                align: 'center'
            },{
                field: 'ext',
                title: '文件后缀',
                unresize: true,
                align: 'center'
            },{
                field: 'create_time',
                title: '创建时间',
                unresize: true,
                align: 'center'
            },{
                title: '操作',
                toolbar: '#user-bar',
                align: 'center',
                unresize: true,
                width: 200
            }
        ]
    ]

    table.render({
        elem: '#dataTable',
        url: 'index',
        page: true,
        cols: cols,
        skin: 'line',
        toolbar: '#toolbar',
        defaultToolbar: [{
            layEvent: 'refresh',
            icon: 'layui-icon-refresh',
        }, 'filter', 'print', 'exports']
    });

    table.on('tool(dataTable)', function(obj) {
        if (obj.event === 'remove') {
            window.remove(obj);
        } 
    });

    table.on('toolbar(dataTable)', function(obj) {
        if (obj.event === 'add') {
            window.add();
        } else if (obj.event === 'refresh') {
            window.refresh();
        } else if (obj.event === 'batchRemove') {
            window.batchRemove(obj);
        }
    });
    if (typeof width !== 'number' || width === 0) {
        width = $(window).width() * 0.8;
    }
    if (typeof height !== 'number' || height === 0) {
        height = $(window).height() - 20;
    }
    window.add = function() {
        layer.open({
            type: 2,
            maxmin: true,
            title: '新增图片',
            shade: 0.1,
            area: [width + 'px', height + 'px'],
            content:'add'
        });
    }

    window.remove = function(obj) {
        layer.confirm('确定要删除该图片', {
            icon: 3,
            title: '提示'
        }, function(index) {
            layer.close(index);
            let loading = layer.load();
            $.ajax({
                url:'del',
                data:{id:obj.data['id']},
                dataType: 'json',
                type: 'POST',
                success: function(res) {
                    layer.close(loading);
                    if (res.code==200) {
                        layer.msg(res.msg, {
                            icon: 1,
                            time: 1000
                        }, function() {
                            obj.del();
                        });
                    } else {
                        layer.msg(res.msg, {
                            icon: 2,
                            time: 1000
                        });
                    }
                }
            })
        });
    }

    window.batchRemove = function(obj) {
        let data = table.checkStatus(obj.config.id).data;
        if (data.length === 0) {
            layer.msg("未选中数据", {
                icon: 3,
                time: 1000
            });
            return false;
        }
        var ids = []
        var hasCheck = table.checkStatus('dataTable')
        var hasCheckData = hasCheck.data
        if (hasCheckData.length > 0) {
            $.each(hasCheckData, function (index, element) {
                ids.push(element.id)
            })
        }
        layer.confirm('确定要删除这些图片', {
            icon: 3,
            title: '提示'
        }, function(index) {
            layer.close(index);
            let loading = layer.load();
            $.ajax({
                url:"del_all",
                data:{ids:ids},
                dataType: 'json',
                type: 'POST',
                success: function(res) {
                    layer.close(loading);
                    if (res.code==200) {
                        layer.msg(res.msg, {
                            icon: 1,
                            time: 1000
                        }, function() {
                            table.reload('dataTable');
                        });
                    } else {
                        layer.msg(res.msg, {
                            icon: 2,
                            time: 1000
                        });
                    }
                }
            })
        });
    }

    window.refresh = function() {
        table.reload('dataTable');
    }

    // 查看大图
    $("body").on('click','.photo', function(){
        layer.open({
            title:'查看大图',
            type: 1,
            content: "<img src='" + $(this).attr('photo-data') + "'>",
            area: ['70%', '70%'],
        })
    });
})