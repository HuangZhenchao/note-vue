<template>
    <div id="main" style="width:100%;height: 100vh;">
      <div style="width:40%;height:100vh;">
        <ListPanel @row-click="handleRowClick" @handleCMD="handleCommander"/>
      </div>
      <div style="width:59%;">
        <div id="editor" style="width:100%;height: 100vh;"></div>
        <!--
        <Textbus ref="textbus" 
        :uploadFilePromise="uploadImage" 
        :cbSaveJSON="saveJSON" 
        :cbSaveHTML="saveHTML"/>
      -->
      </div>
    </div>
</template>

<script lang="ts">
    import { api } from '../utils/axios/api';
import qs from 'qs';
import { Component, Prop, Ref, Vue } from 'vue-property-decorator';
//import {createEditor} from "../../bundles/createEditor"
import {defaultToolFactories,concatStyle} from "@huangzc/textbus"
import ListPanel from "./ListPanel.vue"
import {TextbusApp, TextbusConfig} from '@huangzc/textbus'
    //import { h } from 'vue';
    @Component({
        components: {
            ListPanel
        }
    })
    
    export default class Home extends Vue {
        filePath: string="123";
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
        handleCommander(cmd){
          if(cmd=="printstyle"){            
              //console.log("printstyle",process.env.NODE_ENV)
              console.log("printstyle",concatStyle(this.textbus.editor.getContents())) 
          }
        }
       handleRowClick(data){        
         this.newContent(data.value)
       }
       newContent(data){
          typeof(data)==='string'?
            this.filePath=data:this.filePath="upload/note/article.json"        
          //alert(filePath)
          
          console.log('打开',this.filePath)
          const form = new FormData();
          form.append('filePath',this.filePath)
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
              console.log('保存HTML',result);
              //content='<p><div>123</div></p>';
              //const editor = createEditor(document.getElementById('editor')!,content,api.upload.image);
              /*  */ 
          })
       }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#main{
  display: flex;
}
#editor{
  display: flex;
}
</style>
