<template>
    <div id="NoteMobile" style="width:100%;height: 100vh;">
      <div class="panel-header" style="width:100%;">
        <a @click="show=true" >
              打开文件
            </a>当前路径：{{current}}
      </div>
      <div style="width:100%;height:calc(100vh - 42px);">       
        <div id="editor" style="width:100%;height: 100%;display:flex;"></div>
      </div>
      <DialogOpenFile :show.sync="show" @handleRowClick="handleRowClick"/>
    </div>
</template>

<script lang="ts">
    import { api } from '../../utils/axios/api';
import qs from 'qs';
import { Component, Prop, Ref, Vue } from 'vue-property-decorator';
//import {createEditor} from "../../bundles/createEditor"
import Textbus from "@huangzc/textbus/bundles/textbus.vue"
import {defaultToolFactories, TextbusApp, TextbusConfig} from "@huangzc/textbus"

import {defaultOptions} from "@textbus/editor"
import DialogOpenFile from "./DialogOpenFile.vue"
    //import { h } from 'vue';
    @Component({
        components: {
            Textbus,DialogOpenFile
        }
    })
    
    export default class NoteMobile extends Vue {
      show:boolean=false;
      current:string="";
      //@Ref() readonly textbus!:Textbus;
      filePath: string="";
      textbus!: TextbusApp;
        config:TextbusConfig={
          outputSetting:{
                cbSaveHTML:this.cbSaveHTML,
                saveInterval:10000,
                bConcatHtml:true,
                styleLink:"http://106.55.148.203:8002/upload/textbus.component.style.css"
            },
            uploadFilePromise:api.upload.image,
        }
        mounted(){
          this.textbus=new TextbusApp(document.getElementById('editor'),this.config)
       }
       handleRowClick(data){
          this.current=data.value
          this.newContent(data.value);
       }
       newContent(value){           
         this.filePath=value     
          const form = new FormData();
          form.append('filePath',value)
          api.r.note(form).then(response=>{
                  let result=response.data;
                  if(result.code==0){
                    this.textbus.replaceContent(result.content);
                  }else{
                      console.log(result.message)
                  }   
          })
       }
       cbSaveHTML(content){
          const form = new FormData();
          form.append('filePath',this.filePath)
          form.append('content',content)
          api.u.note(form).then(response=>{
              let result=response.data;
              console.log('result',result);
              //content='<p><div>123</div></p>';
              //const editor = createEditor(document.getElementById('editor')!,content,api.upload.image);
              /*  */ 
          })
       }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.panel-header{
  color:#495060;
  background-color:#F8F8F9 ;
  height:40px;
  line-height: 40px;
}
.panel-header a{
  padding-right: 20px;
  padding-left: 20px;
  color: #000;
  cursor:pointer;
}
</style>
