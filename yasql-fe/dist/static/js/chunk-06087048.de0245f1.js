(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-06087048"],{"5b0d":function(e,t,o){},"6b23":function(e,t,o){"use strict";var a=o("5b0d"),s=o.n(a);s.a},"9fc7":function(e,t,o){"use strict";o.r(t);var a=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",[o("a-card",{attrs:{title:"SQL执行任务"}},[o("div",{staticClass:"table-page-search-wrapper"},[o("a-row",{attrs:{gutter:[8,8]}},[o("a-col",{attrs:{span:8}},[o("a-button",{attrs:{icon:"play-circle"},on:{click:function(t){return e.executeMTask(e.$route.params.task_id)}}},[e._v("全部执行")])],1),o("a-col",{attrs:{span:16}},[o("a-row",{attrs:{gutter:[8,8]}},[o("a-form",{attrs:{layout:"inline",form:e.form},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.handleSearch(t)}}},[o("a-col",{attrs:{span:8}},[o("a-form-item",[o("a-select",{directives:[{name:"decorator",rawName:"v-decorator",value:e.decorator["progress"],expression:"decorator['progress']"}],attrs:{placeholder:"状态"}},e._l(e.progress,(function(t){return o("a-select-option",{key:t.key,attrs:{value:t.key}},[e._v(e._s(t.value))])})),1)],1)],1),o("a-col",{attrs:{span:8}},[o("a-form-item",[o("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:e.decorator["search"],expression:"decorator['search']"}],attrs:{placeholder:"输入要查询的工单内容"}})],1)],1),o("a-col",{attrs:{span:8}},[o("a-button",{attrs:{type:"primary"},on:{click:e.handleSearch}},[e._v("查询")]),o("a-button",{staticStyle:{"margin-left":"6px"},on:{click:e.resetForm}},[e._v("重置")])],1)],1)],1)],1)],1)],1),o("a-table",{attrs:{columns:e.table.columns,rowKey:function(e){return e.id},dataSource:e.table.data,pagination:e.pagination,loading:e.loading,size:"middle"},on:{change:e.handleTableChange},scopedSlots:e._u([{key:"num",fn:function(t,a,s){return o("span",{},[o("span",{domProps:{textContent:e._s(s+1)}})])}},{key:"sql",fn:function(t){return o("span",{},[o("a-tooltip",{attrs:{placement:"topLeft"}},[o("template",{slot:"title"},[e._v(e._s(t))]),o("span",{attrs:{href:"#"}},[e._v(e._s(t))])],2)],1)}},{key:"execute",fn:function(t,a){return o("span",{},[o("a-icon",{attrs:{type:"right-circle"},on:{click:function(t){return e.executeSTask(a)}}})],1)}},{key:"progress",fn:function(t){return o("span",{},["处理中"===t?o("span",{staticStyle:{color:"orange"}},[e._v(e._s(t))]):"已完成"===t?o("span",{staticStyle:{color:"green"}},[e._v(e._s(t))]):"失败"===t?o("span",{staticStyle:{color:"red"}},[e._v(e._s(t))]):"暂停"===t?o("span",{staticStyle:{color:"blue"}},[e._v(e._s(t))]):o("span",[e._v(e._s(t))])])}},{key:"ghost_pause",fn:function(t,a){return o("span",{},[o("a-icon",{attrs:{type:"pause-circle"},on:{click:function(t){return e.ghostTaskThrottle(a,"pause")}}})],1)}},{key:"ghost_recovery",fn:function(t,a){return o("span",{},[o("a-icon",{attrs:{type:"play-circle"},on:{click:function(t){return e.ghostTaskThrottle(a,"recovery")}}})],1)}},{key:"result",fn:function(t,a){return o("span",{},[o("a-icon",{attrs:{type:"eye"},on:{click:function(t){return e.showModal(a)}}})],1)}}])}),o("div",{directives:[{name:"show",rawName:"v-show",value:e.executeMsgVisible,expression:"executeMsgVisible"}]},[o("el-divider",{attrs:{"content-position":"center"}},[e._v("执行输出")]),o("codemirror",{ref:"myCm3",attrs:{options:e.executeMsgOptions},on:{ready:e.onCmReady3},model:{value:e.code3,callback:function(t){e.code3=t},expression:"code3"}}),o("a-modal",{attrs:{title:"任务执行详情",width:"70%"},model:{value:e.modalVisible,callback:function(t){e.modalVisible=t},expression:"modalVisible"}},[o("template",{slot:"footer"},[o("a-button",{key:"back",on:{click:e.handleCancel}},[e._v("Close")])],1),o("div",{directives:[{name:"loading",rawName:"v-loading",value:e.resultLoading,expression:"resultLoading"}],attrs:{"element-loading-text":"玩命加载中...","element-loading-spinner":"el-icon-loading"}},[o("div",[o("h5",[e._v("-> 执行日志")]),o("codemirror",{ref:"myCm2",attrs:{options:e.cmOptions},on:{ready:e.onCmReady2},model:{value:e.code2,callback:function(t){e.code2=t},expression:"code2"}})],1),o("div",{staticStyle:{"margin-top":"15px"}},[o("h5",[e._v("-> 回滚SQL")]),o("codemirror",{ref:"myCm1",attrs:{options:e.cmOptions},on:{ready:e.onCmReady1},model:{value:e.code1,callback:function(t){e.code1=t},expression:"code1"}})],1)])],2)],1)],1)],1)},s=[],n=(o("99af"),o("caad"),o("d3b7"),o("ac1f"),o("841c"),o("5530")),r=(o("c1df"),o("ffda"),o("f4ba"),o("4ad3")),i=o("7125"),c="ws://";"https:"===window.location.protocol&&(c="wss://");var l={name:"tasks-list",data:function(){return{modalLoading:!1,modalVisible:!1,executeMsgVisible:!1,resultLoading:!1,timer:"",websocket:{path:"".concat(c,"/").concat(window.location.host,"/ws/sql/").concat(this.$route.params.task_id,"/"),socket:""},loading:!1,progress:i["e"],table:{columns:null,data:null},pagination:{current:1,pageSize:10,total:0,pageSizeOptions:["10","20"],showSizeChanger:!0},decorator:{progress:["progress",{rules:[{required:!1}]}],search:["search",{rules:[{required:!1}]}]},code1:"",code2:"",code3:"",cmOptions:{mode:"text/x-mysql",indentUnit:2,tabSize:2,indentWithTabs:!0,smartIndent:!0,autoRefresh:!0,lineWrapping:!0,viewportMargin:1/0,readOnly:!0,autofocus:!1},executeMsgOptions:{smartIndent:!0,autoRefresh:!0,lineWrapping:!0,viewportMargin:1/0,readOnly:!0,autofocus:!1},form:this.$form.createForm(this)}},methods:{init_websocket:function(){"undefined"===typeof WebSocket&&this.$message.error("您的浏览器不支持websocket"),this.websocket.socket=new WebSocket(this.websocket.path),this.websocket.socket.onopen=this.socketOnOpen,this.websocket.socket.onerror=this.socketOnError,this.websocket.socket.onmessage=this.socketOnMessage},socketOnOpen:function(){},socketOnError:function(){this.init_websocket()},socketOnMessage:function(e){var t=JSON.parse(e.data);t.flag===this.$route.params.task_id&&(this.executeMsgVisible=!0,"processlist"===t.data.type&&this.codemirror3.setValue(this.renderProcesslist(t.data.data)),"execute"===t.data.type&&this.codemirror3.setValue(t.data.data),["export","ghost"].includes(t.data.type)&&(this.codemirror3.replaceRange(t.data.data,this.codemirror3.getCursor(this.codemirror3.lastLine())),this.codemirror3.setCursor(this.codemirror3.lastLine())))},socketClose:function(){this.websocket.socket.close()},renderProcesslist:function(e){var t="当前SQL SESSION ID的SHOW PROCESSLIST实时输出：";for(var o in e)t+="\n"+o+": "+e[o];return t},handleTableChange:function(e){this.pagination.current=e.current,this.pagination.pageSize=e.pageSize,this.fetchData()},fetchData:function(){var e=this,t=Object(n["a"])({page_size:this.pagination.pageSize,page:this.pagination.current,task_id:this.$route.params.task_id},this.filters);this.loading=!0,Object(r["p"])(t).then((function(t){e.pagination.total=t.count,e.loading=!1,e.table.columns=t.results.columns,e.table.data=t.results.data})).finally((function(){e.loading=!1}))},handleSearch:function(e){var t=this;e.preventDefault(),this.form.validateFields((function(e,o){e||(t.filters={progress:o["progress"],search:o["search"]},t.pagination.current=1,t.fetchData())}))},resetForm:function(){this.form.resetFields()},executeSTask:function(e){var t=this,o={id:e.id};Object(r["h"])(o).then((function(e){"0000"===e.code?t.$message.info(e.message):t.$message.error(e.message)}))},executeMTask:function(e){var t=this,o={task_id:e};Object(r["g"])(o).then((function(e){"0000"===e.code?t.$message.info(e.message):t.$message.error(e.message)}))},ghostTaskThrottle:function(e,t){var o=this,a={id:e.id,op:t};Object(r["b"])(a).then((function(e){"0000"===e.code?o.$message.info(e.message):o.$message.error(e.message)}))},getTResult:function(e){var t=this;Object(r["r"])(e.id).then((function(e){t.codemirror1.setValue(e.data.rollback_sql),t.codemirror2.setValue(e.data.execute_log),setTimeout((function(){t.resultLoading=!1}),1e3)})).catch((function(e){setTimeout((function(){t.resultLoading=!1}),1e3)}))},showModal:function(e){this.modalVisible=!0,this.resultLoading=!0,this.getTResult(e)},handleCancel:function(e){this.modalVisible=!1},onCmReady1:function(e){e.setSize("height","250px")},onCmReady2:function(e){e.setSize("height","250px")},onCmReady3:function(e){e.setSize("height","450px")}},destroyed:function(){this.socketClose(),clearInterval(this.timer)},computed:{codemirror1:function(){return this.$refs.myCm1.codemirror},codemirror2:function(){return this.$refs.myCm2.codemirror},codemirror3:function(){return this.$refs.myCm3.codemirror}},mounted:function(){var e=this;this.fetchData(),this.init_websocket(),this.timer&&clearInterval(this.timer),this.timer=setInterval((function(){setTimeout(e.fetchData(),0)}),1e4)}},u=l,d=(o("6b23"),o("2877")),p=Object(d["a"])(u,a,s,!1,null,null,null);t["default"]=p.exports}}]);